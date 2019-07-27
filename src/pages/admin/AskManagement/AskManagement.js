import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Tabs, Modal } from 'antd';

import StandardTable from '@/components/StandardTable';
import ConditionQuery from '@/components/ConditionQuery'
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import EditForm from './EditForm'
import { renderStatus, renderFunctions, formatTime, renderCensorTag, renderBatchFunctions, formatTokensData, handleRes } from '@/utils/admin/commonFunction'
import { MockSelect } from '@/utils/Enum';

import styles from './AskManagement.less';

const { countrySelect, stateSelect, censorSelect } = MockSelect;
const { TabPane } = Tabs;
const { confirm } = Modal;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

@connect(({ askManagement, loading }) => ({
  askManagement,
  loading: loading.models.askManagement,
}))
class AskManagement extends Component {
  state = {
    modalState: 'Default',
    modalVisible: true,
    selectedRows: [],
    detailForm: {},
    tabActiveKey: 'all',
    sort: 'DEFAULT',
    direction: true,
    conditionParams: {}
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
    const askTokens = formatTokensData(record);
    confirm({
      title: `是否${actionName}以下的内容`,
      // content: renderItemContent(record),
      okText: "确认",
      cancelText: "取消",
      // width: '1200px',
      onOk() {
        dispatch({
          type: `askManagement/operation`,
          payload: {
            askTokens,
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
    const { askManagement } = this.props;
    const { data = {} } = askManagement;
    const { pagination = {} } = data;
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
    const { sort, direction, tabActiveKey, conditionParams } = this.state;
    const { dispatch } = this.props;
    const realTabActiveKey = params && params.tabActiveKey || tabActiveKey;
    if (realTabActiveKey === 'recycle') {
      dispatch({
        type: 'askManagement/recycle',
        payload: {
          sort,
          direction,
          ...params,
          ...conditionParams
        }
      })
    } else {
      dispatch({
        type: 'askManagement/fetch',
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
    const askTokens = formatTokensData(record);
    dispatch({
      type: 'askManagement/detail',
      payload: {
        askTokens,
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

  handleAddSign = () => {
    this.handleFormReset();
    this.handleModalVisible('AddSign');
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
    this.getData({ sort, direction, ...params, ...conditionParams });
  }




  render() {
    const { modalState, detailForm, tabActiveKey } = this.state;
    const { askManagement: { data = [] }, loading, } = this.props;
    const pickButton = {
      pickState: true,
      pickCensor: ['UNPASS']
    }
    const BatchButton = {
      BatchState: true,
      BatchCensor: true
    }
    const columns = [
      { title: '商品名', key: 'productName', render: record => <a onClick={() => this.handleDetail(record)}>{record.productName}</a> },
      { title: '邮箱', dataIndex: 'email', key: 'email' },
      { title: '国家', dataIndex: 'country', key: 'country' },
      { title: '标签', dataIndex: 'marks', key: 'marks' },
      { title: '创建时间', dataIndex: 'createDate', key: 'createDate', sortKey: 'CREATE_DATE', render: time => formatTime(time), sorter: (a, b) => a.createDate - b.createDate },
      { title: '信息状态', key: 'status', render: record => renderStatus(record) },
      { title: '审核进度', key: 'censor', dataIndex: 'censor', render: censor => renderCensorTag(censor) },
      { title: '操作', key: 'action', render: (record) => renderFunctions({ property: { ...pickButton }, tabActiveKey, record, onClick: this.onOperation }) },
    ];
    const conditionConfig = [
      { fieldId: 'marks', label: '标签', fieldType: 'input' },
      { fieldId: 'email', label: '邮箱', fieldType: 'input' },
      { fieldId: 'country', label: '国家', fieldType: 'select', fieldProps: { options: countrySelect } },
      { fieldId: 'censor', label: '审核进度', fieldType: 'select', fieldProps: { options: censorSelect } },
      { fieldId: 'state', label: '信息状态', fieldType: 'select', fieldProps: { options: stateSelect } },
      { fieldId: 'productName', label: '商品名称', fieldType: 'input' },
      // { fieldId: 'add_date', label: '创建时间', fieldType: 'datePicker', fieldProps: { type: 'range' } },
    ];
    const { selectedRows } = this.state;
    return (
      <PageHeaderWrapper title="询问管理">
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

export default AskManagement;
