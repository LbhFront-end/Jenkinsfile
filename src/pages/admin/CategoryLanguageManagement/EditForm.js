import React, { Component } from 'react';
import { Form, Button, Modal, Descriptions, Card } from 'antd';
import getRules from '@/utils/regExpFunction'
import CustomForm from '@/components/CustomForm';
import { MockSelect } from '@/utils/Enum';
import { formatInitialFormData, renderOmitCategoryLanguage, renderContent, renderTitle } from '@/utils/admin/commonFunction'

const { languageSelect } = MockSelect;

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
    const { token, languageTokens, ...rest } = initialFormData;
    return (
      <Card bordered={false}>
        <Descriptions title="分类语言详情" Info>
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


    const FormConfig = modalState === 'Add' || modalState === 'Edit' ? [
      { fieldId: 'language', label: '语言', fieldType: 'select', fieldProps: { options: languageSelect }, rules: getRules({ required: true, label: '语言' }) },
      { fieldId: 'categoryName', label: '分类', fieldType: 'input', rules: getRules({ required: true, label: '分类名', min: 0, max: 50, }) },
      { fieldId: 'categoryNames', label: '多级分类', fieldType: 'categoryCascader', labelSpan: 8, fieldProps: { changeOnSelect: true, form, setFieldId: 'categoryToken' }, rules: getRules({ required: true, label: '多级分类' }) },
      { fieldId: 'categoryToken', label: 'categoryToken', fieldType: 'input', colLayout: { span: 0 } },
      { fieldId: 'description', label: '描述', fieldType: 'textArea', rules: getRules({ required: true, label: '描述', max: 200, }) },
      { fieldId: 'version', label: 'version', fieldType: 'input', colLayout: { span: 0 } },
    ] : []
    const params = { form, modalState, description: tempEditorValue }
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
              <Button key="submit" type="primary" onClick={() => onSubmit({ ...params, submit: true })}>提交</Button>,
              <Button key="save" onClick={() => onSubmit({ ...params, submit: false })}>保存</Button>,
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
            modalState === 'Add' ? { version: 0 } :
              modalState === 'Edit' ? formatInitialFormData(initialFormData)
                : initialFormData
          }
        />
      </Modal>
    )
  }
}

export default EditForm;
