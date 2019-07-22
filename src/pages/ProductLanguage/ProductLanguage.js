import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Tabs, Modal } from 'antd';

import StandardTable from '@/components/StandardTable';
import ConditionQuery from '@/components/ConditionQuery'
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import EditForm from './EditForm'
import { renderCensorTag, renderStatus, renderFunctions, formatTime, renderProhibitText, renderBatchFunctions, formatTokensData, handleRes, formatLanguage } from '@/utils/commonFunction'
import { MockSelect } from '@/utils/Enum';
import styles from './ProductLanguage.less';

const { stateSelect } = MockSelect;
const { TabPane } = Tabs;
const { confirm } = Modal;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

@connect(({ productLanguage, loading }) => ({
  productLanguage,
  loading: loading.models.productLanguage,
}))
class ProductLanguage extends Component {
  state = {
    modalState: 'Default',
    modalVisible: true,
    selectedRows: [],
    detailForm: {},
    tabActiveKey: 'all',
    sort: 'DEFAULT',
    direction: true,
  }

  componentDidMount() {
    this.getData();
  }

  onTabChange = (value) => {
    this.setState({ tabActiveKey: value })
    this.getData({ tabActiveKey: value });
  }

  onConfirm = props => {
    const { cleanRows, freshData, actionName = '操作', dispatch, record, pagination, ...rest } = props;
    const languageTokens = formatTokensData(record);
    confirm({
      title: `是否${actionName}以下的内容`,
      // content: renderItemContent(record),
      okText: "确认",
      cancelText: "取消",
      // width: '1200px',
      onOk() {
        dispatch({
          type: `productLanguage/operation`,
          payload: {
            languageTokens,
            ...rest
          },
          callback: (res) => {
            if (res) {
              handleRes({ res, actionName, record, showName: 'productName', freshData, cleanRows, pagination });
            }
          }
        })
      },
      onCancel() { },
    });
  }

  onOperation = (props) => {
    const { productLanguage } = this.props;
    const { data = {} } = productLanguage;
    const { pagination = {} } = data
    const { dispatch } = this.props;
    const { prefix } = props;
    const freshData = (params) => this.getData({ ...params })
    if (prefix) {
      this.onConfirm({ ...props, dispatch, pagination, freshData, cleanRows: () => this.handleSelectRows([]) })
    }
  }

  onCancel = () => {
    this.handleModalVisible('Default');
  }

  getData(params) {
    const { sort, direction, tabActiveKey } = this.state;
    const { dispatch } = this.props;
    const realTabActiveKey = params && params.tabActiveKey || tabActiveKey;
    if (realTabActiveKey === 'recycle') {
      dispatch({
        type: 'productLanguage/recycle',
        payload: {
          sort,
          direction,
          ...params
        }
      })
    } else {
      dispatch({
        type: 'productLanguage/fetch',
        payload: {
          sort,
          direction,
          ...params
        }
      })
    }
  }

  getForm(record) {
    const { dispatch } = this.props;
    const languageTokens = formatTokensData(record);
    dispatch({
      type: 'productLanguage/detail',
      payload: {
        languageTokens,
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
      this.getData(params);
    }
    this.getData(params);
  }

  handleDetail = (record) => {
    this.handleModalVisible('Detail');
    this.getForm(record);
  }


  handleStandardTableChange = (pagination, filtersArg, sorter) => {
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
    this.getData({ sort, direction, ...params });
  }




  render() {
    const { modalState, initialFormData, detailForm, selectedRows, tabActiveKey } = this.state;
    const { productLanguage: { data = [] }, loading, } = this.props;
    const pickButton = {
      pickProhibit: true,
      pickCensor: ['RETURN']
    }
    const BatchButton = {
      BatchProhibit: true,
    }
    const columns = [
      { title: '语言', key: 'language', render: record => <a onClick={() => this.handleDetail(record)}>{formatLanguage(record.language)}</a> },
      { title: '商品名', dataIndex: 'productName', key: 'productName' },
      { title: '品牌', dataIndex: 'brand', key: 'brand' },
      { title: '规格', dataIndex: 'specs', key: 'specs' },
      { title: '单位', dataIndex: 'unit', key: 'unit' },
      { title: '发售时间', dataIndex: 'saleDate', key: 'saleDate', sortKey: 'SALE_DATE', render: time => formatTime(time), sorter: (a, b) => a.saleDate - b.saleDate },
      { title: '状态', key: 'status', render: record => renderStatus(record) },
      { title: '禁用', dataIndex: 'prohibit', key: 'prohibit', render: prohibit => renderProhibitText(prohibit) },
      { title: '审核进度', key: 'censor', dataIndex: 'censor', render: censor => renderCensorTag(censor) },
      { title: '操作', key: 'action', render: (record) => renderFunctions({ property: { ...pickButton }, tabActiveKey, record, onClick: this.onOperation }) },
    ];
    const conditionConfig = [
      { fieldId: 'brand', label: '品牌', fieldType: 'brand' },
      { fieldId: 'productName', label: '商品名', fieldType: 'input' },
      { fieldId: 'companyName', label: '企业名称', fieldType: 'input' },
      { fieldId: 'state', label: '状态', fieldType: 'select', fieldProps: { options: stateSelect } }
      // { fieldId: 'add_date', label: '加入时间', fieldType: 'datePicker', fieldProps: { type: 'range' } },
      // { fieldId: 'upper_date', label: '上架时间', fieldType: 'datePicker', fieldProps: { type: 'range' } },
      // { fieldId: 'model', label: '型号', fieldType: 'input' },
      // { fieldId: 'x', label: '引源流', fieldType: 'select', fieldProps: { options: categoryTokenSelect } },
      // { fieldId: 'categoryToken', label: '地区', fieldType: 'select', fieldProps: { options: categoryTokenSelect } },
    ];
    return (
      <PageHeaderWrapper title="商品语言管理">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              <ConditionQuery
                modalFormConfig={conditionConfig}
                onQuery={this.handleSearch}
              />
            </div>
            <div className={styles.tableListOperator}>
              {renderBatchFunctions({ property: { ...BatchButton }, selectedRows, tabActiveKey })}
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
        {/* <CreateForm {...parentMethods} modalVisible={modalVisible} /> */}
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

export default ProductLanguage;
