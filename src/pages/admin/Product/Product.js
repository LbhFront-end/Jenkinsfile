import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Tabs, Modal } from 'antd';

import StandardTable from '@/components/StandardTable';
import ConditionQuery from '@/components/ConditionQuery'
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import EditForm from './EditForm'
import { renderCensorTag, renderStatus, renderFunctions, formatTime, renderBatchFunctions, formatTokensData, handleRes, renderProhibitInTable, formatSelectOption } from '@/utils/admin/commonFunction'
import { MockSelect } from '@/utils/Enum';
import styles from './Product.less';

const { stateSelect, prohbitSelect, censorSelect } = MockSelect;
const { TabPane } = Tabs;
const { confirm } = Modal;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

@connect(({ product, loading }) => ({
  product,
  loading: loading.models.product,
}))
class Product extends Component {
  state = {
    modalState: 'Default',
    modalVisible: true,
    selectedRows: [],
    enterpriseSelect: [],
    detailForm: {},
    tabActiveKey: 'all',
    sort: 'DEFAULT',
    direction: true,
    conditionParams: {}
  }

  componentDidMount() {
    this.getData();
    this.getEnterpriseOpts();
  }

  onTabChange = (value) => {
    this.setState({ tabActiveKey: value })
    this.getData({ tabActiveKey: value });
  }

  getEnterpriseOpts(params) {
    const { dispatch } = this.props;
    dispatch({
      type: 'product/optsOfEnterprise',
      payload: params,
      callback: (res) => {
        this.setState({ enterpriseSelect: res })
      }
    })
  }

  onConfirm = props => {
    const { cleanRows, freshData, actionName = '操作', dispatch, record, pagination, onCancel, ...rest } = props;
    const productTokens = formatTokensData(record);
    confirm({
      title: `是否${actionName}以下的内容`,
      // content: renderItemContent(record),
      okText: "确认",
      cancelText: "取消",
      // width: '1200px',
      onOk() {
        dispatch({
          type: `product/operation`,
          payload: {
            productTokens,
            ...rest
          },
          callback: (res) => {
            if (res) {
              handleRes({ res, actionName, record, showName: 'productName', freshData, cleanRows, pagination, onCancel });
            }
          }
        })
      },
      onCancel() { },
    });
  }

  onOperation = (props) => {
    const { product } = this.props;
    const { data = {} } = product;
    const { pagination = {} } = data
    const { dispatch } = this.props;
    const { prefix } = props;
    const freshData = (params) => this.getData({ ...params })
    const onCancel = () => this.onCancel();
    if (prefix) {
      this.onConfirm({ ...props, dispatch, pagination, freshData, onCancel, cleanRows: () => this.handleSelectRows([]) })
    }
  }


  onCancel = () => {
    this.handleModalVisible('Default');
  }

  getData(params) {
    const { sort, direction, tabActiveKey, conditionParams } = this.state;
    const { dispatch } = this.props;
    const realTabActiveKey = params && params.tabActiveKey || tabActiveKey;
    if (realTabActiveKey === 'recycle') {
      dispatch({
        type: 'product/recycle',
        payload: {
          sort,
          direction,
          ...params,
          ...conditionParams
        }
      })
    } else {
      dispatch({
        type: 'product/fetch',
        payload: {
          sort,
          direction,
          ...params,
          ...conditionParams
        }
      })
    }
  }

  getForm(record) {
    const { dispatch } = this.props;
    const productTokens = formatTokensData(record);
    dispatch({
      type: 'product/detail',
      payload: {
        productTokens,
      },
      callback: res => this.setState({ detailForm: res })
    })
  }

  handleModalVisible = modalState => {
    const { modalVisible } = this.state;
    this.setState({
      modalVisible: !modalVisible,
      modalState
    })
  }

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    })
  }

  handleSearch = fieldsValue => {
    let params = {};
    if (fieldsValue) {
      let createDateU = '';
      let createDateL = '';
      let saleDateU = '';
      let saleDateL = '';
      const { add_date, upper_date, ...rest } = fieldsValue;
      if (add_date || upper_date) {
        if (add_date) {
          createDateL = add_date[0].format('YYYY-MM-DD HH:mm:ss.SSS');
          createDateU = add_date[1].format('YYYY-MM-DD HH:mm:ss.SSS');
          params = { createDateL, createDateU, ...params }
        }
        if (upper_date) {
          saleDateL = upper_date[0].format('YYYY-MM-DD HH:mm:ss.SSS');
          saleDateU = upper_date[1].format('YYYY-MM-DD HH:mm:ss.SSS');
          params = { saleDateL, saleDateU, ...params }
        }
      } else {
        params = { ...rest }
      }
    }
    this.setState({ conditionParams: params })
    this.getData(params);
  }

  handleDetail = (record) => {
    this.handleModalVisible('Detail');
    this.getForm(record);
  }

  handleFormReset = () => {
    this.setInitialFormData({})
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { conditionParams } = this.state;
    let { sort, direction } = this.state;
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      // currentPage: pagination.current,
      // pageSize: pagination.pageSize,
      page: pagination.current - 1,
      size: 10,
      ...filters,
    }
    if (sorter.field) {
      const { column, order } = sorter;
      const { sortKey } = column;
      direction = order === 'ascend';
      sort = sortKey;
      this.setState({ direction, sort })
    }
    this.getData({ sort, direction, ...params, conditionParams });
  }




  render() {
    const { modalState, detailForm, selectedRows, tabActiveKey, enterpriseSelect } = this.state;
    const { product: { data = [] }, loading, } = this.props;
    const pickButton = {
      pickProhibit: true,
      pickCensor: ['RETURN']
    }
    const BatchButton = {
      BatchProhibit: true,
    }
    const columns = [
      { title: '商品名称', key: 'productName', render: record => <a onClick={() => this.handleDetail(record)}>{renderProhibitInTable({ record, name: 'productName' })}</a> },
      { title: '企业名称', key: 'companyName', dataIndex: 'companyName' },
      { title: '品牌', dataIndex: 'brand', key: 'brand' },
      { title: '型号', dataIndex: 'model', key: 'model' },
      { title: '出厂价', dataIndex: 'price', key: 'price' },
      { title: '分类', dataIndex: 'categoryName', key: 'categoryName' },
      { title: '创建时间', dataIndex: 'createDate', key: 'createDate', sortKey: 'CREATE_DATE', render: time => formatTime(time), sorter: (a, b) => a.createDate - b.createDate },
      { title: '上架时间', dataIndex: 'saleDate', key: 'saleDate', sortKey: 'SALE_DATE', render: time => formatTime(time), sorter: (a, b) => a.saleDate - b.saleDate },
      { title: '信息状态', key: 'status', render: record => renderStatus(record) },
      // { title: '禁用', dataIndex: 'prohibit', key: 'prohibit', render: prohibit => renderProhibitText(prohibit) },
      { title: '审核进度', key: 'censor', dataIndex: 'censor', render: censor => renderCensorTag(censor) },
      { title: '操作', key: 'action', render: (record) => renderFunctions({ property: { ...pickButton }, tabActiveKey, record, onClick: this.onOperation }) },
    ];
    const conditionConfig = [
      { fieldId: 'productName', label: '名称', fieldType: 'input' },
      {
        fieldId: 'companyToken',
        label: '企业名称',
        fieldType: 'select',
        labelSpan: 8,
        fieldProps: { options: formatSelectOption({ array: enterpriseSelect, label: 'companyName', value: 'token' }) }
      },
      { fieldId: 'add_date', label: '创建时间', fieldType: 'datePicker', fieldProps: { type: 'range' } },
      { fieldId: 'upper_date', label: '上架时间', fieldType: 'datePicker', fieldProps: { type: 'range' } },
      { fieldId: 'model', label: '型号', fieldType: 'input' },
      { fieldId: 'categoryNames', label: '类目', fieldType: 'categoryCascader', fieldProps: { setFieldId: 'categoryToken' } },
      { fieldId: 'categoryToken', label: 'categoryToken', fieldType: 'input', colLayout: { span: 0 } },
      { fieldId: 'brand', label: '品牌', fieldType: 'input' },
      { fieldId: 'prohibit', label: '禁用', fieldType: 'select', fieldProps: { options: prohbitSelect } },
      { fieldId: 'censor', label: '审核进度', fieldType: 'select', fieldProps: { options: censorSelect } },
      { fieldId: 'state', label: '信息状态', fieldType: 'select', fieldProps: { options: stateSelect } }
    ];
    return (
      <PageHeaderWrapper title="商品管理">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              <ConditionQuery
                modalFormConfig={conditionConfig}
                onQuery={this.handleSearch}
              />
            </div>
            <div className={styles.tableListOperator}>
              {renderBatchFunctions({ property: { ...BatchButton }, selectedRows, tabActiveKey, onClick: this.onOperation })}
            </div>
            <Tabs defaultActiveKey={tabActiveKey} onChange={this.onTabChange}>
              <TabPane tab="全部" key="all">
                <StandardTable
                  rowKey="token"
                  selectedRows={selectedRows}
                  loading={loading}
                  data={data}
                  columns={columns}
                  onSelectRow={this.handleSelectRows}
                  onChange={this.handleStandardTableChange}
                />
              </TabPane>
              <TabPane tab="回收站" key="recycle">
                <StandardTable
                  rowKey="token"
                  selectedRows={selectedRows}
                  loading={loading}
                  data={data}
                  columns={columns}
                  onSelectRow={this.handleSelectRows}
                  onChange={this.handleStandardTableChange}
                />
              </TabPane>
            </Tabs>
          </div>
        </Card>
        <EditForm
          detailForm={detailForm}
          modalState={modalState}
          visible={modalState !== 'Default'}
          onCancel={this.onCancel}
          onOperation={this.onOperation}
        />
      </PageHeaderWrapper>
    )
  }
}

export default Product;
