import React, { Component } from 'react';
import { Form, Button, Modal, Tabs, Descriptions } from 'antd';
import CustomForm from '@/components/CustomForm';
import { renderTitle, renderContent } from '@/utils/enterprise/commonFunction'
import getRules from '@/utils/regExpFunction'

const { TabPane } = Tabs;

@Form.create()
class EditForm extends Component {

  onTabchange = value => {
    // console.log(value)
  }


  renderTab = (modalState, initialFormData) => {
    if (!(modalState === 'Detail')) {
      return null;
    }
    const { languages = [], askTokens, ...rest } = initialFormData;
    return (
      <Descriptions title="询问商品详情" Info>
        {renderContent(rest)}
      </Descriptions>
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
      handleAddSign
    } = this.props;
    // console.log(initialFormData);

    const FormConfig = modalState === 'AddSign' ? [
      { fieldId: 'askTokens', fieldType: 'input', colLayout: { span: 0 } },
      { fieldId: 'marks', label: '标签', fieldType: 'input', rules: getRules({ required: true, label: '标签', min: 1, max: 5 }) }
    ] : [];
    const params = { form, modalState }
    return (
      <Modal
        {...this.props}
        form={form}
        title={renderTitle(modalState)}
        visible={visible}
        width={900}
        onCancel={onCancel}
        footer={
          modalState === 'AddSign' ?
            [
              <Button key="submit" type="primary" onClick={() => onSubmit({ ...params, submit: true })}>提交</Button>,
              <Button key="save" onClick={() => onSubmit({ ...params, submit: false })}>保存</Button>,
            ]
            :
            [
              <Button key="add" type="primary" onClick={() => handleAddSign(initialFormData)}>编辑标签</Button>,
              <Button key="close" onClick={onCancel}>关闭</Button>,
            ]
        }
      >
        {this.renderTab(modalState, initialFormData)}
        <CustomForm
          form={form}
          modalFormConfig={FormConfig}
          initialFormData={initialFormData}
        />
      </Modal>
    )
  }
}

export default EditForm;
