import React, { Component } from 'react';
import { Form, Button, Modal, Descriptions } from 'antd';
import CustomForm from '@/components/CustomForm';
import { renderTitle,renderContent,renderCensorButton } from '@/utils/commonFunction'
import getRules from '@/utils/regExpFunction'


@Form.create()
class EditForm extends Component {

  renderTab = (modalState, detailForm) => {
    if (!(modalState === 'Detail')) {
      return null;
    }
    return (
      <Descriptions title="询问详情" Info>
        {renderContent(detailForm)}
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
      detailForm,
    } = this.props;

    const pickCensor = ['PASS', 'UNPASS']
    const FormConfig = modalState === 'AddSign' ? [{ fieldId: 'marks', label: '标签', fieldType: 'input',rules: getRules({ required: true, label: '标签' }) }] : [];
    return (
      <Modal
        {...this.props}
        form={form}
        title={renderTitle(modalState)}
        visible={visible}
        width={900}
        onCancel={onCancel}
        footer={
          modalState === 'AddSign' ? [
            <Button key="submit" type="primary" onClick={() => onSubmit(form, modalState)}>提交</Button>,
            <Button key="save" onClick={() => onSubmit(form, modalState)}>保存</Button>,
          ] : renderCensorButton({ ...this.props, record: detailForm, pickCensor })
        }
      >
        {this.renderTab(modalState, detailForm)}
        <CustomForm
          form={form}
          modalFormConfig={FormConfig}
          detailForm={detailForm}
        />
      </Modal>
    )
  }
}

export default EditForm;
