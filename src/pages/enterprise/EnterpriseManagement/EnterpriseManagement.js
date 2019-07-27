import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Tabs, Button, Descriptions } from 'antd';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import EditForm from './EditForm'
import { renderContent, renderPickEnterpriseLanguage, renderOmitEnterpriseLanguage, renderTitle, formatFieldValue, handleRes, formatLanguage, renderProhibitByAlert } from '@/utils/enterprise/commonFunction'


const { TabPane } = Tabs;


@connect(({ enterpriseManagement, loading }) => ({
  enterpriseManagement,
  loading: loading.models.enterpriseManagement,
}))
class EnterpriseManagement extends Component {
  state = {
    modalState: 'Default',
    modalVisible: true,
    detailForm: {},
    initialFormData: {},
    languageTokens: '',
  }

  componentDidMount() {
    this.getDetail();
  }

  setInitialFormData = (initialFormData) => {
    this.setState({ initialFormData })
  }

  onSubmit = (props) => {
    const { enterpriseManagement } = this.props;
    const { data = {} } = enterpriseManagement;
    const { pagination = {} } = data;
    const { languageTokens } = this.state;
    const { dispatch } = this.props;
    const { form, modalState, description, submit } = props;
    const freshData = () => this.getDetail()
    const type = modalState === 'AddLanguage' ? `enterpriseManagement/addL` : `enterpriseManagement/update`;
    form.validateFields((error, fieldvalue) => {
      if (error) return false;
      dispatch({
        type,
        payload: {
          languageTokens,
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

  getDetail(params) {
    const { dispatch } = this.props;
    dispatch({
      type: 'enterpriseManagement/detail',
      payload: params,
      callback: (res) => {
        this.setState({ detailForm: res })
      }
    })
  }

  getForm(params) {
    const { dispatch } = this.props;
    dispatch({
      type: 'enterpriseManagement/form',
      payload: params,
      callback: (res) => {
        if (res) {
          this.setInitialFormData(res)
          this.handleModalVisible('Edit');
        }
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

  handleAdd = () => {
    this.handleFormReset();
    this.handleModalVisible('Add');
  }

  handleAddLanguage = () => {
    this.handleFormReset();
    this.handleModalVisible('AddLanguage');
  }

  handleEdit = () => {
    this.getForm();
  }


  handleFormReset = () => {
    this.setInitialFormData({})
  }

  renderTab = (detailData) => {
    const panes = [];
    const { languages = [], prohibit, ...rest } = detailData;
    languages.forEach((item, i) => {
      const { language, token, ...restProps } = item;
      panes.push({ title: language, content: restProps, key: i + 2 })
    })
    panes.unshift({ title: '英文', content: renderPickEnterpriseLanguage(rest), key: 1 })
    return (
      <Card bordered={false}>
        {renderProhibitByAlert(prohibit)}
        <Tabs onChange={this.onTabchange} tabBarExtraContent={<Button onClick={() => this.handleAddLanguage()}>新增语言</Button>}>
          {
            panes.map(pane => (
              <TabPane tab={formatLanguage(pane.title)} key={pane.key}>
                <Descriptions title="语言详情" Info>
                  {renderContent(pane.content)}
                </Descriptions>
              </TabPane>
            ))
          }
        </Tabs>
        <Descriptions title="企业详情" Info>
          {renderContent(renderOmitEnterpriseLanguage(rest))}
        </Descriptions>
        <Button type="primary" onClick={() => this.handleEdit()}>编辑</Button>
      </Card>
    )
  }

  render() {
    const { detailForm, modalState, initialFormData } = this.state;
    const { enterpriseManagement: { data = {} }, loading, dispatch } = this.props;
    return (
      <PageHeaderWrapper>
        {this.renderTab(detailForm)}
        <EditForm
          dispatch={dispatch}
          loading={loading}
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

export default EnterpriseManagement;
