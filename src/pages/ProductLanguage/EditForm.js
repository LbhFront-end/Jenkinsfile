import React, { Component } from 'react';
import { Form, Modal, Descriptions, Card } from 'antd';

import { renderContent, renderTitle, renderCensorButton } from '@/utils/commonFunction'



@Form.create()
class EditForm extends Component {


  renderTab = (initialFormData) => {
    const { token, languages, ...rest } = initialFormData;
    return (
      <Card bordered={false}>
        <Descriptions title="语言详情" Info>
          {renderContent((rest))}
        </Descriptions>
      </Card>
    )
  }


  render() {
    const {
      form,
      onCancel,
      detailForm,
      visible,
      modalState,
    } = this.props;
    const pickCensor = ['PASS', 'RETURN']
    return (
      <Modal
        {...this.props}
        form={form}
        title={renderTitle(modalState)}
        visible={visible}
        width={900}
        onCancel={onCancel}
        footer={renderCensorButton({ ...this.props, record: detailForm, pickCensor })}
      >
        {this.renderTab(detailForm)}
      </Modal>
    )
  }
}

export default EditForm;
