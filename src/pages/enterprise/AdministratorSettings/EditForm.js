import React, { Component } from 'react';
import { Form, Button, Modal } from 'antd';
import CustomForm from '@/components/CustomForm';
import { renderTitle, formatSelectOption } from '@/utils/enterprise/commonFunction'


@Form.create()
class EditForm extends Component {

  render() {
    const {
      form,
      onSubmit,
      onCancel,
      countSelect,
      visible,
      modalState,
      initialFormData,
    } = this.props;
    const FormConfig =
      [
        {
          fieldId: 'account',
          label: '管理员设置',
          fieldType: 'select',
          labelSpan: 8,
          fieldProps: { options: formatSelectOption({ array: countSelect, label: 'username', value: 'account' }) }
        }
      ];
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
          [
            <Button key="submit" type="primary" onClick={() => onSubmit({ ...params, submit: true })}>提交</Button>,
            <Button key="save" onClick={() => onSubmit({ ...params, submit: false })}>保存</Button>,
          ]
        }
      >
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
