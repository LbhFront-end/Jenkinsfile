import React, { Component } from 'react';
import { Form, Button, Modal, Tabs, Descriptions, Card } from 'antd';
import CustomEditor from '@/components/CustomEditor';
import CustomForm from '@/components/CustomForm';
import { MockSelect } from '@/utils/Enum';
import { renderTitle, formatInitialFormData, renderContent, renderProhibitByAlert } from '@/utils/enterprise/commonFunction'
import { getProductOpts } from '@/services/enterprise/productLanguage';
import getRules from '@/utils/regExpFunction'


const { languageSelect } = MockSelect;
const { TabPane } = Tabs;

@Form.create()
class EditForm extends Component {

  state = {
    tempEditorValue: '',
  }


  onProductSelect = (props, option) => {
    const { form } = this.props;
    form.setFields({ 'productTokens': { value: option.props.token } })
  }

  onTabchange = value => {
    // console.log(value)
  }

  onEditorChange = (value) => {
    this.setState({ tempEditorValue: value })
  }

  renderTab = (modalState, initialFormData) => {
    if (!(modalState === 'Detail')) {
      return null;
    }
    const { languageTokens, token, prohibit, ...rest } = initialFormData;
    return (
      <Card bordered={false}>
        {renderProhibitByAlert(prohibit)}
        <Descriptions title="商品语言详情" Info>
          {renderContent(rest)}
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
    const { description } = initialFormData;
    const disabled = modalState === 'Edit';

    const FormConfig = modalState === 'Detail' || modalState === 'Default' ? [] : [
      {
        fieldId: 'productName2',
        label: '商品',
        fieldType: 'searchSelect',
        rules: [{ required: true, label: '商品' }],
        fieldProps: {
          searchType: 'productName',
          valueType: 'key',
          optionFieldNames: {
            key: 'token', value: 'productName', label: 'productName', token: 'token',
          },
          getDataList: getProductOpts,
          onChange: this.onProductSelect,
          disabled
        }
      },
      { fieldId: 'productName', label: '商品名', fieldType: 'input', rules: getRules({ required: true, label: '商品名', max: 100 }) },
      { fieldId: 'version', label: '版本', fieldType: 'input', colLayout: { span: 0 } },
      { fieldId: 'productTokens', fieldType: 'input', colLayout: { span: 0 } },
      { fieldId: 'languageTokens', fieldType: 'input', colLayout: { span: 0 } },
      { fieldId: 'language', label: '语言', fieldType: 'select', fieldProps: { options: languageSelect }, rules: getRules({ required: true, label: '语言' }) },
      { fieldId: 'specs', label: '规格', fieldType: 'input', rules: getRules({ required: true, label: '规格', max: 100 }) },
      { fieldId: 'brand', label: '品牌', fieldType: 'input', rules: getRules({ required: true, label: '品牌' }) },
      { fieldId: 'unit', label: '单位', fieldType: 'input', rules: getRules({ required: true, label: '商品名', max: 50 }) },
      { fieldId: 'saleDate', label: '上架时间', labelSpan: 8, fieldType: 'datePicker', rules: getRules({ required: true, label: '上架时间' }) },
      { fieldId: 'description', label: '描述', fieldType: 'node', fieldNode: <CustomEditor value={description} onChange={this.onEditorChange} />, colLayout: { span: 24 } },
    ]
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
            modalState === 'Add' ? { version: 0 }
              : modalState === 'Edit' || modalState === 'AddSequence' ? formatInitialFormData(initialFormData)
                : initialFormData
          }
        />
      </Modal>
    )
  }
}

export default EditForm;
