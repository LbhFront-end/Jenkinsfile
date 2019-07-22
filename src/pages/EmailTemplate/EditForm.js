import React, { Component } from 'react';
import { Form, Button, Modal, Descriptions, Card } from 'antd';
import CustomEditor from '@/components/CustomEditor';
import CustomForm from '@/components/CustomForm';
import { formatInitialFormData, renderOmitCategoryLanguage, renderContent, renderTitle } from '@/utils/commonFunction'
import getRules from '@/utils/regExpFunction'

@Form.create()
class EditForm extends Component {

  state = {
    tempEditorValue: '',
  }

  onTabchange = value => {
    console.log(value)
  }

  onEditorChange = (value) => {
    this.setState({ tempEditorValue: value })
  }


  renderTab = (modalState, initialFormData) => {
    if (!(modalState === 'Detail')) {
      return null;
    }
    const { token, emailTemplateTokens, ...rest } = initialFormData;
    return (
      <Card bordered={false}>
        <Descriptions title="邮件模板详情" Info>
          {renderContent(renderOmitCategoryLanguage(rest))}
        </Descriptions>
      </Card>
    )
  }

  render() {
    const {
      form,
      onSubmit,
      onCancel,
      visible,
      modalState,
      initialFormData,
    } = this.props;
    const { tempEditorValue } = this.state;
    const { context } = initialFormData;


    const FormConfig = modalState === 'Add' || modalState === 'Edit' ? [
      { fieldId: 'name', label: '模板名称', fieldType: 'input', rules: getRules({ required: true, label: '模板名称', max: 50 }) },
      { fieldId: 'code', label: '代码', fieldType: 'input', rules: getRules({ required: true, label: '代码', max: 50 }) },
      { fieldId: 'context', label: '描述', fieldType: 'node', fieldNode: <CustomEditor value={context} onChange={this.onEditorChange} />, colLayout: { span: 24 } },
      { fieldId: 'version', label: 'version', fieldType: 'input', colLayout: { span: 0 } },
    ] : []
    const params = { form, modalState, context: tempEditorValue }
    return (
      <Modal
        {...this.props}
        form={form}
        title={renderTitle(modalState)}
        visible={visible}
        width={900}
        onCancel={onCancel}
        footer={
          modalState === 'Add' || modalState === 'Edit' ?
            [
              <Button key="submit" type="primary" onClick={() => onSubmit({ ...params })}>提交</Button>,
              <Button key="cancel" onClick={() => onCancel()}>取消</Button>,
            ] : [
              <Button key="cancel" onClick={() => onCancel()}>关闭</Button>,
            ]
        }
      >
        {this.renderTab(modalState, initialFormData)}
        <CustomForm
          form={form}
          modalFormConfig={FormConfig}
          initialFormData={
            modalState === 'Add' ? { version: 0 }
              : modalState === 'Edit' ? formatInitialFormData(initialFormData)
                : initialFormData
          }
        />
      </Modal>
    )
  }
}

export default EditForm;
