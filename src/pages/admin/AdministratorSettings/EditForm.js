import React, { Component } from 'react';
import { Form, Button, Modal } from 'antd';
import CustomForm from '@/components/CustomForm';
import { renderTitle, formatSelectOption } from '@/utils/admin/commonFunction'
import getRules from '@/utils/regExpFunction'


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
          fieldProps: { options: formatSelectOption({ array: countSelect, label: 'username', value: 'account' }) },
          rules: getRules({ required: true, label: '管理员' })
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
            <Button key="add" type="primary" onClick={() => onSubmit({ ...params })}>提交</Button>,
            <Button key="close" onClick={onCancel}>取消</Button>,
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
