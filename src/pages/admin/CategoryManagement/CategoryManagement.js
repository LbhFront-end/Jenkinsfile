import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Tabs, Button, Modal, Tag } from 'antd';

import StandardTable from '@/components/StandardTable';
import ConditionQuery from '@/components/ConditionQuery'
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import EditForm from './EditForm'
import { renderStatus, renderFunctions, renderBatchFunctions, renderTitle, formatFieldValue, formatTokensData, handleRes } from '@/utils/admin/commonFunction'
import { MockSelect } from '@/utils/Enum';
import styles from './CategoryManagement.less';

const { stateSelect } = MockSelect;
const { TabPane } = Tabs;
const { confirm } = Modal;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

@connect(({ categoryManagement, loading }) => ({
  categoryManagement,
  loading: loading.models.categoryManagement,
}))
class CategoryManagement extends Component {
  state = {
    modalState: 'Default',
    modalVisible: true,
    selectedRows: [],
    initialFormData: {},
    tabActiveKey: 'all',
    sort: 'DEFAULT',
    direction: true,
    categoryTokens: '',
    conditionParams: {}
  }

  componentDidMount() {
    this.getData();
  }

  setTokens = (categoryTokens) => {
    this.setState({ categoryTokens })
  }

  onTabChange = (value) => {
    this.setState({ tabActiveKey: value })
    this.getData({ tabActiveKey: value });
  }

  onConfirm = props => {
    const { cleanRows, freshData, actionName = '操作', dispatch, record, pagination, ...rest } = props;
    const categoryTokens = formatTokensData(record);
    confirm({
      title: `是否${actionName}以下的内容`,
      // content: renderItemContent(record),
      okText: "确认",
      cancelText: "取消",
      // width: '1200px',
      onOk() {
        dispatch({
          type: `categoryManagement/operation`,
          payload: {
            categoryTokens,
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
    const { categoryManagement } = this.props;
    const { data = {} } = categoryManagement;
    const { pagination = {} } = data
    const { dispatch } = this.props;
    const { action, prefix, record } = props;
    const freshData = (params) => this.getData({ ...params })
    const categoryTokens = formatTokensData(record);
    this.setTokens(categoryTokens)
    if (prefix) {
      this.onConfirm({ ...props, dispatch, pagination, freshData, cleanRows: () => this.handleSelectRows([]) })
    } else if (action === 'form') {
      dispatch({
        type: `categoryManagement/${action}`,
        payload: {
          categoryTokens,
          prefix
        },
        callback: (res) => {
          if (res) {
            this.setInitialFormData({ categoryTokens, ...res })
            this.handleModalVisible('Edit');
          }
        }
      })
    } else if (action === 'detail') {
      dispatch({
        type: `categoryManagement/${action}`,
        payload: {
          categoryTokens,
          prefix
        },
        callback: (res) => {
          if (res) {
            this.setInitialFormData({ categoryTokens, ...res })
          }
        }
      })
    }
  }


  setInitialFormData = (initialFormData) => {
    this.setState({ initialFormData })
  }

  onSubmit = (props) => {
    const { categoryManagement } = this.props;
    const { data = {} } = categoryManagement;
    const { pagination = {} } = data
    const { categoryTokens } = this.state;
    const { dispatch } = this.props;
    const { form, modalState, submit } = props;
    const freshData = (params) => this.getData({ ...params })
    const type =
      modalState === 'AddLanguage' ? `categoryManagement/addL`
        : modalState === 'Edit' ? 'categoryManagement/update'
          : modalState === 'Add' ? `categoryManagement/add`
            : modalState === 'AddSequence' ? `categoryManagement/sequence`
              : '';
    form.validateFields((error, fieldvalue) => {
      if (error) return false;
      dispatch({
        type,
        payload: {
          categoryTokens,
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
    this.handleFormReset();
  }

  getData(params) {
    const { sort, direction, tabActiveKey, conditionParams } = this.state;
    const { dispatch } = this.props;
    const realTabActiveKey = params && params.tabActiveKey || tabActiveKey;
    if (realTabActiveKey === 'recycle') {
      dispatch({
        type: 'categoryManagement/recycle',
        payload: {
          sort,
          direction,
          ...params,
          ...conditionParams
        }
      })
    } else {
      dispatch({
        type: 'categoryManagement/fetch',
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
    this.setTokens(formatTokensData(record))
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

  handleAddSequence = (record) => {
    this.setTokens(formatTokensData(record))
    this.onOperation({ actionName: '详情', action: 'detail', record })
    this.handleModalVisible('AddSequence');
  }


  renderSequence = (record) => <Tag color="#108ee9" onClick={() => this.handleAddSequence(record)} style={{ cursor: 'pointer' }}>{record.sequence}</Tag>


  render() {
    const { tabActiveKey, modalState, initialFormData, selectedRows } = this.state;
    const { categoryManagement: { data = [] }, loading, } = this.props;
    const pickButton = {
      pickChange: true,
      pickState: true
    }
    const BatchButton = {
      BatchState: true,
      BatchCensor: true,
    }
    const columns = [
      { title: '分类', key: 'categoryName', render: record => <a onClick={() => this.handleDetail(record)}>{record.categoryName}</a> },
      { title: '级数', dataIndex: 'depth', key: 'depth' },
      { title: '排序', key: 'sequence', render: record => this.renderSequence(record) },
      { title: '信息状态', key: 'status', render: record => renderStatus(record) },
      { title: '操作', key: 'action', render: (record) => renderFunctions({ property: { ...pickButton }, tabActiveKey, record, onClick: this.onOperation }) },
    ];
    const conditionConfig = [
      { fieldId: 'parentToken', label: 'parentToken', fieldType: 'input', colLayout: { span: 0 } },
      { fieldId: 'categoryNames', label: '父分类', fieldType: 'categoryCascader', fieldProps: { changeOnSelect: true, setFieldId: 'parentToken' } },
      { fieldId: 'categoryName', label: '分类名称', fieldType: 'input' },
      { fieldId: 'state', label: '信息状态', fieldType: 'select', fieldProps: { options: stateSelect } }
      // { fieldId: 'categoryToken', label: 'categoryToken', fieldType: 'input', colLayout: { span: 0 } },
    ];
    return (
      <PageHeaderWrapper title="分类管理">
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
          onSubmit={this.onSubmit}
        />
      </PageHeaderWrapper>
    )
  }
}

export default CategoryManagement;
