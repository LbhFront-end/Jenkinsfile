import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Tabs, Button, Modal } from 'antd';

import StandardTable from '@/components/StandardTable';
import ConditionQuery from '@/components/ConditionQuery'
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import EditForm from './EditForm'
import { renderFunctions, renderTitle, formatFieldValue, formatTokensData, handleRes } from '@/utils/admin/commonFunction'
import styles from './EmailTemplate.less';

const { TabPane } = Tabs;
const { confirm } = Modal;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

@connect(({ emailTemplate, loading }) => ({
  emailTemplate,
  loading: loading.models.emailTemplate,
}))
class EmailTemplate extends Component {
  state = {
    modalState: 'Default',
    modalVisible: true,
    selectedRows: [],
    initialFormData: {},
    tabActiveKey: 'all',
    sort: 'DEFAULT',
    direction: true,
    emailTemplateTokens: '',
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
    const emailTemplateTokens = formatTokensData(record);
    confirm({
      title: `是否${actionName}以下的内容`,
      // content: renderItemContent(record),
      okText: "确认",
      cancelText: "取消",
      // width: '1200px',
      onOk() {
        dispatch({
          type: `emailTemplate/operation`,
          payload: {
            emailTemplateTokens,
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
    const { emailTemplate } = this.props;
    const { data = {} } = emailTemplate;
    const { pagination = {} } = data
    const { dispatch } = this.props;
    const { action, prefix, record } = props;
    const freshData = (params) => this.getData({ ...params })
    const emailTemplateTokens = formatTokensData(record);
    if (prefix) {
      this.onConfirm({ ...props, dispatch, pagination, freshData, cleanRows: () => this.handleSelectRows([]) })
    } else if (action === 'form') {
      dispatch({
        type: `emailTemplate/${action}`,
        payload: {
          emailTemplateTokens,
          prefix
        },
        callback: (res) => {
          if (res) {
            this.setInitialFormData({ emailTemplateTokens, ...res })
            this.handleModalVisible('Edit');
          }
        }
      })
    } else if (action === 'detail') {
      dispatch({
        type: `emailTemplate/${action}`,
        payload: {
          emailTemplateTokens,
          prefix
        },
        callback: (res) => {
          if (res) {
            this.setInitialFormData({ emailTemplateTokens, ...res })
          }
        }
      })
    }
  }

  setInitialFormData = (initialFormData) => {
    this.setState({ initialFormData })
  }

  onSubmit = (props) => {
    const { emailTemplate } = this.props;
    const { data = {} } = emailTemplate;
    const { pagination = {} } = data
    const { emailTemplateTokens } = this.state;
    const { dispatch } = this.props;
    const { form, modalState, context } = props;
    const freshData = (params) => this.getData({ ...params })
    const type = `emailTemplate/add`;
    form.validateFields((error, fieldvalue) => {
      if (error) return false;
      dispatch({
        type,
        payload: {
          emailTemplateTokens,
          ...formatFieldValue(fieldvalue),
          context
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
    this.handleFormReset();
  }

  getData(params) {
    const { sort, direction, tabActiveKey, conditionParams } = this.state;
    const { dispatch } = this.props;
    const realTabActiveKey = params && params.tabActiveKey || tabActiveKey;
    if (realTabActiveKey === 'recycle') {
      dispatch({
        type: 'emailTemplate/recycle',
        payload: {
          sort,
          direction,
          ...params,
          ...conditionParams
        }
      })
    } else {
      dispatch({
        type: 'emailTemplate/fetch',
        payload: {
          sort,
          direction,
          ...params,
          ...conditionParams
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
    const { emailTemplate: { data = [] }, loading, } = this.props;
    const pickButton = {
      pickOnlyChange: true,
    }
    const columns = [
      { title: '模板名称', key: 'name', render: record => <a onClick={() => this.handleDetail(record)}>{record.name}</a> },
      { title: '代码', key: 'code', dataIndex: 'code' },
      { title: '操作', key: 'action', render: (record) => renderFunctions({ property: { ...pickButton }, tabActiveKey, record, onClick: this.onOperation }) },
    ];
    const conditionConfig = [
      { fieldId: 'name', label: '模板名称', fieldType: 'input' },
    ];
    return (
      <PageHeaderWrapper title="邮件模板管理">
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
            </Tabs>
          </div>
        </Card>
        <EditForm
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

export default EmailTemplate;
