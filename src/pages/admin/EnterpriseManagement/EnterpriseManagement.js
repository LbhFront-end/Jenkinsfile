import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Tabs, Modal } from 'antd';

import StandardTable from '@/components/StandardTable';
import ConditionQuery from '@/components/ConditionQuery'
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import EditForm from './EditForm'
import { renderCensorTag, renderStatus, renderFunctions, formatTime, renderProhibitInTable, formatStringArray, renderBatchFunctions, formatTokensData, handleRes } from '@/utils/admin/commonFunction';
import { MockSelect } from '@/utils/Enum';
import styles from './EnterpriseManagement.less';

const { prohbitSelect, censorSelect } = MockSelect;
const { TabPane } = Tabs;
const { confirm } = Modal;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

@connect(({ enterpriseManagement, loading }) => ({
  enterpriseManagement,
  loading: loading.models.enterpriseManagement,
}))
class EnterpriseManagement extends Component {
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
    const { cleanRows, freshData, actionName = '操作', dispatch, record, pagination, onCancel, ...rest } = props;
    const companyTokens = formatTokensData(record);
    confirm({
      title: `是否${actionName}以下的内容`,
      // content: renderItemContent(record),
      okText: "确认",
      cancelText: "取消",
      // width: '1200px',
      onOk() {
        dispatch({
          type: `enterpriseManagement/operation`,
          payload: {
            companyTokens,
            ...rest
          },
          callback: (res) => {
            if (res) {
              handleRes({ res, actionName, record, showName: 'companyName', freshData, cleanRows, pagination, onCancel });
            }
          }
        })
      },
      onCancel() { },
    });
  }

  onOperation = (props) => {
    const { enterpriseManagement } = this.props;
    const { data = {} } = enterpriseManagement;
    const { pagination = {} } = data
    const { dispatch } = this.props;
    const { prefix } = props;
    const freshData = (params) => this.getData({ ...params })
    const onCancel = () => this.onCancel()
    if (prefix) {
      this.onConfirm({ ...props, dispatch, freshData, pagination, onCancel, cleanRows: () => this.handleSelectRows([]) })
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
        type: 'enterpriseManagement/recycle',
        payload: {
          sort,
          direction,
          ...params,
          ...conditionParams
        }
      })
    } else {
      dispatch({
        type: 'enterpriseManagement/fetch',
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
    const companyTokens = formatTokensData(record);
    dispatch({
      type: 'enterpriseManagement/detail',
      payload: {
        companyTokens,
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
    const { modalState, detailForm, selectedRows, tabActiveKey } = this.state;
    const { enterpriseManagement: { data = [] }, loading, } = this.props;
    const pickButton = {
      pickProhibit: true,
      pickCensor: ['RETURN']
    }
    const BatchButton = {
      BatchProhibit: true,
    }
    const columns = [
      { title: '企业名称', key: 'companyName', render: record => <a onClick={() => this.handleDetail(record)}>{renderProhibitInTable({ record, name: 'companyName' })}</a> },
      { title: '联系人', dataIndex: 'contacts', key: 'contacts' },
      { title: '手机号码', dataIndex: 'cellphone', key: 'cellphone' },
      { title: '企业官网', dataIndex: 'website', key: 'website' },
      { title: '地区', dataIndex: 'regionNames', key: 'regionNames', render: regionNames => formatStringArray(regionNames) },
      { title: '创建时间', dataIndex: 'createDate', key: 'createDate', sortKey: 'CREATE_DATE', render: time => formatTime(time), sorter: (a, b) => a.createDate - b.createDate },
      { title: '注册时间', dataIndex: 'foundedDate', key: 'foundedDate', sortKey: 'FOUNDED_DATE', render: time => formatTime(time), sorter: (a, b) => a.foundedDate - b.foundedDate },
      { title: '信息状态', key: 'status', render: record => renderStatus(record) },
      // { title: '禁用', dataIndex: 'prohibit', key: 'prohibit', render: prohibit => renderProhibitText(prohibit) },
      { title: '审核进度', key: 'censor', dataIndex: 'censor', render: censor => renderCensorTag(censor) },
      { title: '操作', key: 'action', render: (record) => renderFunctions({ property: { ...pickButton }, tabActiveKey, record, onClick: this.onOperation }) },
    ];
    const conditionConfig = [
      { fieldId: 'companyName', label: '企业名称', fieldType: 'input' },
      { fieldId: 'esrCode', label: 'ESR代码', fieldType: 'input' },
      // {fieldId: 'add_date', label: '加入时间', fieldType: 'datePicker', fieldProps: {type: 'range' } },
      // {fieldId: 'upper_date', label: '上架时间', fieldType: 'datePicker', fieldProps: {type: 'range' } },
      // {fieldId: 'model', label: '型号', fieldType: 'input' },
      // {fieldId: 'x', label: '引源流', fieldType: 'select', fieldProps: {options: categoryTokenSelect } },
      // {fieldId: 'categoryToken', label: '地区', fieldType: 'select', fieldProps: {options: categoryTokenSelect } },
      { fieldId: 'prohibit', label: '禁用', fieldType: 'select', fieldProps: { options: prohbitSelect } },
      { fieldId: 'censor', label: '审核进度', fieldType: 'select', fieldProps: { options: censorSelect } },
    ];
    return (
      <PageHeaderWrapper title="企业管理">
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

export default EnterpriseManagement;
