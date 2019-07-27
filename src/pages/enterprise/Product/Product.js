import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Tabs, Button, Modal } from 'antd';

import StandardTable from '@/components/StandardTable';
import ConditionQuery from '@/components/ConditionQuery'
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import EditForm from './EditForm'
import { renderCensorTag, renderStatus, renderFunctions, formatTime, renderBatchFunctions, renderTitle, formatFieldValue, formatTokensData, handleRes, renderProhibitInTable } from '@/utils/enterprise/commonFunction'
import { MockSelect } from '@/utils/Enum';
import styles from './Product.less';

const { stateSelect, censorSelect } = MockSelect;
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
    initialFormData: {},
    tabActiveKey: 'all',
    sort: 'DEFAULT',
    direction: true,
    conditionParams: {},
    productTokens: '',
  }

  componentDidMount() {
    this.getData();
  }

  onAddLanguage = (initialFormData) => {
    this.setTokens(formatTokensData(initialFormData))
    this.handleModalVisible('AddLanguage');
    this.handleFormReset();
  }

  setTokens = (productTokens) => {
    this.setState({ productTokens })
  }


  onTabChange = (value) => {
    this.setState({ tabActiveKey: value })
    this.getData({ tabActiveKey: value });
  }

  onConfirm = props => {
    const { cleanRows, freshData, actionName = '操作', dispatch, record, pagination, ...rest } = props;
    const productTokens = formatTokensData(record);
    confirm({
      title: `是否${actionName}`,
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
              handleRes({ res, actionName, record, showName: 'productName', freshData, cleanRows, pagination });
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
    const { pagination = {} } = data;
    const { dispatch } = this.props;
    const { action, prefix, record } = props;
    const freshData = (params) => this.getData({ ...params })
    const productTokens = formatTokensData(record);
    if (prefix) {
      this.onConfirm({ ...props, dispatch, pagination, freshData, cleanRows: () => this.handleSelectRows([]) })
    } else if (action === 'form') {
      dispatch({
        type: `product/${action}`,
        payload: {
          productTokens,
          prefix
        },
        callback: (res) => {
          if (res) {
            this.setInitialFormData({ productTokens, ...res })
            this.handleModalVisible('Edit');
          }
        }
      })
    } else if (action === 'detail') {
      dispatch({
        type: `product/${action}`,
        payload: {
          productTokens,
          prefix
        },
        callback: (res) => {
          if (res) {
            this.setInitialFormData({ productTokens, ...res })
          }
        }
      })
    }
  }

  setInitialFormData = (initialFormData) => {
    this.setState({ initialFormData })
  }

  onSubmit = (props) => {
    const { product } = this.props;
    const { data = {} } = product;
    const { pagination = {} } = data;
    const { productTokens } = this.state;
    const { dispatch } = this.props;
    const { form, modalState, description, submit } = props;
    const freshData = (params) => this.getData({ ...params })
    const type =
      modalState === 'AddLanguage'
        ? `product/addL` : modalState === 'Edit' ? 'product/update'
          : modalState === 'Add' ? `product/add` : '';
    form.validateFields((error, fieldvalue) => {
      if (error) return false;
      dispatch({
        type,
        payload: {
          productTokens,
          ...formatFieldValue(fieldvalue),
          description,
          submit
        },
        callback: (res) => {
          if (res && res.code === 0) {
            handleRes({ res, actionName: renderTitle(modalState), freshData, pagination });
            this.handleModalVisible('Default');
          }
        }
      })
      return null;
    })
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
          ...conditionParams,
          ...params
        }
      })
    } else {
      dispatch({
        type: 'product/fetch',
        payload: {
          sort,
          direction,
          ...conditionParams,
          ...params
        }
      })
    }
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

  handleAdd = () => {
    this.handleFormReset();
    this.handleModalVisible('Add');
  }

  handleDetail = (record) => {
    this.handleModalVisible('Detail');
    this.onOperation({ actionName: '详情', action: 'detail', record })
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
    this.getData({ sort, direction, ...params, ...conditionParams });
  }



  render() {
    const { tabActiveKey, modalState, initialFormData, selectedRows } = this.state;
    const { product: { data = [] }, loading, } = this.props;
    const pickButton = {
      pickChange: true,
      pickSale: true,
      pickState: true,
      pickCensor: true
    }
    const BatchButton = {
      BatchSale: true,
      BatchState: true,
      BatchCensor: true
    }
    const columns = [
      { title: '商品名', key: 'productName', render: record => <a onClick={() => this.handleDetail(record)}>{renderProhibitInTable({ record, name: 'productName' })}</a> },
      { title: '品牌', dataIndex: 'brand', key: 'brand' },
      { title: '型号', dataIndex: 'model', key: 'model' },
      { title: '分类', dataIndex: 'categoryName', key: 'categoryName' },
      { title: '创建时间', dataIndex: 'createDate', key: 'createDate', render: time => formatTime(time), sortKey: 'CREATE_DATE', sorter: (a, b) => a.createDate - b.createDate },
      { title: '上架时间', dataIndex: 'saleDate', key: 'saleDate', render: time => formatTime(time), sortKey: 'SALE_DATE', sorter: (a, b) => a.saleDate - b.saleDate },
      { title: '信息状态', key: 'status', render: record => renderStatus(record) },
      { title: '审核进度', key: 'censor', dataIndex: 'censor', render: censor => renderCensorTag(censor) },
      { title: '操作', key: 'action', render: (record) => renderFunctions({ property: { ...pickButton }, tabActiveKey, record, onClick: this.onOperation }) },
    ];
    const conditionConfig = [
      { fieldId: 'productName', label: '商品名', fieldType: 'input' },
      { fieldId: 'add_date', label: '创建时间', fieldType: 'datePicker', fieldProps: { type: 'range' } },
      { fieldId: 'upper_date', label: '上架时间', fieldType: 'datePicker', fieldProps: { type: 'range' } },
      { fieldId: 'model', label: '型号', fieldType: 'input' },
      { fieldId: 'categoryNames', label: '分类', fieldType: 'categoryCascader', setFieldId: 'categoryToken' },
      { fieldId: 'categoryToken', label: 'categoryToken', fieldType: 'input', colLayout: { span: 0 } },
      { fieldId: 'brand', label: '品牌', fieldType: 'input' },
      { fieldId: 'censor', label: '审核进度', fieldType: 'select', fieldProps: { options: censorSelect } },
      { fieldId: 'state', label: '信息状态', fieldType: 'select', fieldProps: { options: stateSelect } }
    ];
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              <ConditionQuery
                modalFormConfig={conditionConfig}
                onQuery={this.handleSearch}
              />
            </div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={this.handleAdd}>
                新建
              </Button>
              {renderBatchFunctions({ property: { ...BatchButton }, selectedRows, tabActiveKey, onClick: this.onOperation })}
            </div>
            <Tabs defaultActiveKey={tabActiveKey} onChange={this.onTabChange}>
              <TabPane tab="全部" key="all">
                <StandardTable
                  rowKey='token'
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
                  rowKey='token'
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
          initialFormData={initialFormData}
          modalState={modalState}
          visible={modalState !== 'Default'}
          onCancel={this.onCancel}
          onAddLanguage={this.onAddLanguage}
          onSubmit={this.onSubmit}
        />
      </PageHeaderWrapper>
    )
  }
}

export default Product;
