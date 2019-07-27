import React, { Component } from 'react';
import { Form, Button, Modal, Tabs, Descriptions, Card } from 'antd';
import getRules from '@/utils/regExpFunction'
import CustomForm from '@/components/CustomForm';
import { formatInitialFormData, renderPickCategoryLanguage, renderOmitCategoryLanguage, renderContent, renderTitle, formatLanguage } from '@/utils/admin/commonFunction'

const { TabPane } = Tabs;

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
    const panes = [];
    const { languages = [], categoryTokens, ...rest } = initialFormData;
    languages.forEach((item, i) => {
      const { language, token, ...restProps } = item;
      panes.push({ title: language, content: restProps, key: i + 2 })
    })
    panes.unshift({ title: '英文', content: renderPickCategoryLanguage(rest), key: 1 })
    return (
      <Card bordered={false}>
        <Tabs onChange={this.onTabchange}>
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
        <Descriptions title="分类详情" Info>
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
    const FormConfig =
      modalState === 'Add'
        ? [
          { fieldId: 'categoryName', label: '分类名', fieldType: 'input', rules: getRules({ required: true, label: '分类名', min: 0, max: 50, }) },
          { fieldId: 'parentToken', label: 'parentToken', fieldType: 'input', colLayout: { span: 0 } },
          { fieldId: 'version', label: '版本', fieldType: 'input', colLayout: { span: 0 } },
          { fieldId: 'categoryNames', label: '父分类', fieldType: 'categoryCascader', fieldProps: { changeOnSelect: true, form, setFieldId: 'parentToken' } },
          { fieldId: 'sequence', label: '排序', fieldType: 'inputNumber', rules: getRules({ required: true, label: '排序', min: 0, max: 250, type: 'number' }) },
          { fieldId: 'description', label: '描述', fieldType: 'textArea', rules: getRules({ required: true, label: '描述', max: 200, }) }
        ]
        : modalState === 'Edit' ? [
          { fieldId: 'categoryName', label: '分类名', fieldType: 'input', rules: getRules({ required: true, label: '分类名', min: 0, max: 50, }) },
          { fieldId: 'parentToken', label: 'parentToken', fieldType: 'input', colLayout: { span: 0 } },
          { fieldId: 'version', label: 'version', fieldType: 'input', colLayout: { span: 0 } },
          { fieldId: 'categoryNames', label: '父分类', fieldType: 'categoryCascader', fieldProps: { changeOnSelect: true, form, setFieldId: 'parentToken' }, rules: getRules({ required: true, label: '父分类' }) },
          { fieldId: 'sequence', label: '排序', fieldType: 'inputNumber', rules: getRules({ required: true, label: '排序', min: 0, max: 250, type: 'number' }) },
          { fieldId: 'description', label: '描述', fieldType: 'textArea', rules: getRules({ required: true, label: '描述', max: 200, }) }
        ]
          : modalState === 'AddSequence' ? [
            { fieldId: 'sequence', label: '排序', fieldType: 'inputNumber', rules: getRules({ required: true, label: '排序', min: 0, max: 250, type: 'number' }) }
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
          modalState === 'Add' || modalState === 'Edit' || modalState === 'AddSequence' ?
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
