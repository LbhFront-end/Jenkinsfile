import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Tabs, Button, Modal } from 'antd';

import StandardTable from '@/components/StandardTable';
import ConditionQuery from '@/components/ConditionQuery'
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import EditForm from './EditForm'
import { renderFunctions, renderStatus, formatTime, renderBatchFunctions, formatFieldValue, formatTokensData, handleRes, renderTitle } from '@/utils/enterprise/commonFunction'
import { MockSelect } from '@/utils/Enum';
import styles from './AdministratorSettings.less';

const { stateSelect } = MockSelect;
const { TabPane } = Tabs;
const { confirm } = Modal;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

@connect(({ administratorSettings, loading }) => ({
  administratorSettings,
  loading: loading.models.administratorSettings,
}))
class AdministratorSettings extends Component {
  state = {
    modalState: 'Default',
    modalVisible: true,
    selectedRows: [],
    initialFormData: {},
    countSelect: [],
    tabActiveKey: 'all',
    conditionParams: {},
    memberTokens: '',
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
    const memberTokens = formatTokensData(record);
    confirm({
      title: `是否${actionName}`,
      // content: renderItemContent(record),
      okText: "确认",
      cancelText: "取消",
      // width: '1200px',
      onOk() {
        dispatch({
          type: `administratorSettings/operation`,
          payload: {
            memberTokens,
            ...rest
          },
          callback: (res) => {
            if (res) {
              handleRes({ res, actionName, record, showName: 'account', freshData, cleanRows, pagination });
            }
          }
        })
      },
      onCancel() { },
    });
  }


  onOperation = (props) => {
    const { administratorSettings } = this.props;
    const { data = {} } = administratorSettings;
    const { pagination = {} } = data;
    const { dispatch } = this.props;
    const { action, prefix, record } = props;
    const freshData = (params) => this.getData({ ...params })
    const memberTokens = formatTokensData(record);
    if (prefix) {
      this.onConfirm({ ...props, dispatch, pagination, freshData, cleanRows: () => this.handleSelectRows([]) })
    } else if (action === 'form') {
      dispatch({
        type: `administratorSettings/${action}`,
        payload: {
          memberTokens,
          prefix
        },
        callback: (res) => {
          if (res) {
            this.setInitialFormData({ memberTokens, ...res })
            this.handleModalVisible('Edit');
          }
        }
      })
    } else if (action === 'detail') {
      dispatch({
        type: `administratorSettings/${action}`,
        payload: {
          memberTokens,
          prefix
        },
        callback: (res) => {
          if (res) {
            this.setInitialFormData({ memberTokens, ...res })
          }
        }
      })
    }
  }


  setInitialFormData = (initialFormData) => {
    this.setState({ initialFormData })
  }

  onSubmit = (props) => {
    const { administratorSettings } = this.props;
    const { data = {} } = administratorSettings;
    const { pagination = {} } = data;
    const { memberTokens } = this.state;
    const { dispatch } = this.props;
    const { form, modalState, submit } = props;
    const freshData = (params) => this.getData({ ...params })
    const type = 'administratorSettings/add';
    form.validateFields((error, fieldvalue) => {
      if (error) return false;
      dispatch({
        type,
        payload: {
          memberTokens,
          ...formatFieldValue(fieldvalue),
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
        type: 'administratorSettings/recycle',
        payload: {
          sort,
          direction,
          ...conditionParams,
          ...params
        }
      })
    } else {
      dispatch({
        type: 'administratorSettings/fetch',
        payload: {
          sort,
          direction,
          ...conditionParams,
          ...params
        }
      })
    }
  }

  getOpts(params) {
    const { dispatch } = this.props;
    dispatch({
      type: 'administratorSettings/opts',
      payload: params,
      callback: (res) => {
        this.setState({ countSelect: res })
      }
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

  handleAdd = () => {
    this.handleFormReset();
    this.handleModalVisible('Add');
    this.getOpts();
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
    const { selectedRows, modalState, initialFormData, countSelect, tabActiveKey } = this.state;
    const { administratorSettings: { data = [] }, loading, } = this.props;
    const pickButton = {
      pickState: true,
      pickChange: true,
    }
    const BatchButton = {
      BatchState: true,
    }
    const columns = [
      { title: '管理员账号', dataIndex: 'account', key: 'account' },
      { title: '创建时间', dataIndex: 'createDate', key: 'createDate', render: time => formatTime(time), sorter: (a, b) => a.createDate - b.createDate },
      { title: '信息状态', key: 'status', render: record => renderStatus(record) },
      { title: '操作', key: 'action', render: (record) => renderFunctions({ property: { ...pickButton }, record, onClick: this.onOperation }) },
    ];
    const conditionConfig = [
      { fieldId: 'account', label: '管理员', fieldType: 'input' },
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
                绑定
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
          countSelect={countSelect}
          initialFormData={initialFormData}
          modalState={modalState}
          visible={modalState !== 'Default'}
          onCancel={this.onCancel}
          onSubmit={this.onSubmit}
        />
      </PageHeaderWrapper>
    )
  }
}

export default AdministratorSettings;
