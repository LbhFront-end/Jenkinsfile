import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Tabs, Form, Button, message } from 'antd';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import CustomEditor from '@/components/CustomEditor';
import CustomForm from '@/components/CustomForm';
import { formatTokensData } from '@/utils/admin/commonFunction';
import { getOpts } from '@/services/admin/enterpriseManagement';
import { getEmailTemplateOpts } from '@/services/admin/emailTemplate';
// import getRules from '@/utils/regExpFunction'
import styles from './Email.less';

const { TabPane } = Tabs;


@connect(({ email, loading }) => ({
  email,
  loading: loading.models.email,
}))

@Form.create()
class Email extends Component {
  state = {
    tabActiveKey: 'template',
    tempEditorValue: '',
  }

  componentDidMount() {

  }


  onTabChange = (value) => {
    this.setState({ tabActiveKey: value })
  }

  onEditorChange = (value) => {
    this.setState({ tempEditorValue: value })
  }


  onSubmit = () => {
    const { tempEditorValue, tabActiveKey } = this.state;
    const { form, dispatch } = this.props;
    const type = tabActiveKey === 'template' ? 'email/sendEmailByTemplate' : 'email/sendEmailByEditor'
    form.validateFields((err, values) => {
      if (err) return;
      dispatch({
        type,
        payload: {
          ...values,
          context: tempEditorValue,
        },
        callback: (res) => {
          if (res && res.code === 0) {
            message.success('发送成功')
            form.resetFields();
          }
        }
      })
    })
  }

  onCompanySelect = (props, option) => {
    const { form } = this.props;
    const result = [];
    if (option.length) {
      option.forEach(i => result.push(i.props))
    } else {
      result.push(option)
    }
    const tokens = formatTokensData(result);
    form.setFields({ 'companyTokens': { value: tokens } })
  }

  onEmailTemplateSelect = (props, option) => {
    const { form } = this.props;
    form.setFields({ 'templateToken': { value: option.props.token } })
  }


  render() {
    const { tabActiveKey } = this.state;
    const { form } = this.props;
    const FormConfig =
      tabActiveKey === 'template' ?
        [
          {
            fieldId: 'companyNames',
            label: '企业名称',
            fieldType: 'searchSelect',
            rules: [{ required: true, message: '请选择企业' }],
            colLayout: { span: 24 },
            fieldProps: {
              searchType: 'companyName',
              valueType: 'key',
              mode: 'multiple',
              optionFieldNames: {
                key: 'token', value: 'companyName', label: 'companyName', token: 'token',
              },
              getDataList: getOpts,
              onChange: this.onCompanySelect,
            }
          },
          {
            fieldId: 'template',
            label: '模板',
            fieldType: 'searchSelect',
            rules: [{ required: true, message: '请选择模板' }],
            colLayout: { span: 24 },
            fieldProps: {
              searchType: 'name',
              valueType: 'key',
              optionFieldNames: {
                key: 'token', value: 'name', label: 'name', token: 'token',
              },
              getDataList: getEmailTemplateOpts,
              onChange: this.onEmailTemplateSelect,
            }
          },
          { fieldId: 'templateToken', fieldType: 'input', colLayout: { span: 0 } },
          { fieldId: 'companyTokens', fieldType: 'input', colLayout: { span: 0 } },
          { fieldId: 'subject', label: '标题', fieldType: 'textArea', rules: [{ required: true, label: '标题' }], colLayout: { span: 24 }, },
          // { fieldId: 'context', label: '描述', fieldType: 'node', fieldNode: <CustomEditor onChange={this.onEditorChange} />, colLayout: { span: 24 } },
        ] :
        [
          {
            fieldId: 'companyNames',
            label: '企业名称',
            fieldType: 'searchSelect',
            rules: [{ required: true, message: '请选择企业' }],
            colLayout: { span: 24 },
            fieldProps: {
              searchType: 'companyName',
              mode: 'multiple',
              valueType: 'key',
              optionFieldNames: {
                key: 'token', value: 'companyName', label: 'companyName', token: 'token',
              },
              getDataList: getOpts,
              onChange: this.onCompanySelect,
            }
          },
          { fieldId: 'companyTokens', fieldType: 'input', colLayout: { span: 0 } },
          { fieldId: 'subject', label: '标题', fieldType: 'textArea', rules: [{ required: true, label: '标题' }], colLayout: { span: 24 }, },
          { fieldId: 'context', label: '描述', fieldType: 'node', fieldNode: <CustomEditor onChange={this.onEditorChange} />, colLayout: { span: 24 } },
        ]
    return (
      <PageHeaderWrapper title="邮件管理">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <Tabs defaultActiveKey={tabActiveKey} onChange={this.onTabChange}>
              <TabPane tab="邮箱模板" key="template">
                <CustomForm
                  form={form}
                  modalFormConfig={FormConfig}
                />
              </TabPane>
              <TabPane tab="富文本框" key="editor">
                <CustomForm
                  form={form}
                  modalFormConfig={FormConfig}
                />
              </TabPane>
            </Tabs>
            <Button
              type="primary"
              style={{ float: 'right', margin: '0 20px 0 0' }}
              onClick={this.onSubmit}
            >发送
            </Button>
          </div>
        </Card>
      </PageHeaderWrapper>
    )
  }
}

export default Email;
