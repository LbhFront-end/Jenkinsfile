import React, { Component } from 'react';
import { Form, Button, Modal, Tabs, Descriptions, Card } from 'antd';
import CustomUpload from '@/components/CustomUpload';
import CustomEditor from '@/components/CustomEditor';
import CustomForm from '@/components/CustomForm';
import { MockSelect } from '@/utils/Enum';
import getRules from '@/utils/regExpFunction'
import { formatInitialFormData, renderPickProductLanguage, renderOmitProductLanguage, renderContent, renderTitle, formatLanguage, renderProhibitByAlert } from '@/utils/enterprise/commonFunction'
const { categoryTokenSelect, marketSelect, languageSelect } = MockSelect;
const { TabPane } = Tabs;
const imgPrefix = 'http://pimg.21silkroad.com';

@Form.create()
class EditForm extends Component {

  state = {
    tempEditorValue: '',
  }

  onTabchange = value => {
    // console.log(value)
  }

  onEditorChange = (value) => {
    this.setState({ tempEditorValue: value })
  }

  handleImgUpload = props => {
    const { form } = this.props;
    const { property, fileList, maxNum } = props;
    let imgUrl;
    if (fileList.fileList && fileList.fileList.length > 0) {
      if (maxNum === 1) {
        imgUrl = fileList.fileList[0].fileUrl;
      } else {
        imgUrl = [];
        fileList.fileList.forEach(i => imgUrl.push(i.fileUrl))
      }
      form.setFields({ [property]: { value: imgUrl } })
    }
  }

  renderTab = (props) => {
    const { modalState, initialFormData } = props;
    if (!(modalState === 'Detail')) {
      return null;
    }
    const panes = [];
    const { languages = [], productTokens, prohibit, ...rest } = initialFormData;
    languages.forEach((item, i) => {
      const { language, token, ...restProps } = item;
      panes.push({ title: language, content: restProps, key: i + 2 })
    })
    panes.unshift({ title: '英文', content: renderPickProductLanguage(rest), key: 1 })
    return (
      <Card bordered={false}>
        {renderProhibitByAlert(prohibit)}
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
        <Descriptions title="商品详情" Info>
          {renderContent(renderOmitProductLanguage(rest))}
        </Descriptions>
      </Card>
    )
  }


  imgUpload(props) {
    const { property, maxNum } = props;
    const { initialFormData, modalState } = this.props;
    const initImgValue = formatInitialFormData(initialFormData)[property];
    let initFileList;
    if (modalState === 'Edit') {
      if (typeof initImgValue === 'string') {
        initFileList = [{
          uid: -1,
          url: imgPrefix + initImgValue,
          name: '图片',
          status: 'done'
        }]
      } else if (initImgValue instanceof Array) {
        initFileList = [];
        initImgValue.forEach((item, i) => initFileList.push({
          uid: initFileList.length > 0 ? initFileList[initFileList.length - 1].uid - 1 : -i - 1,
          name: `图片${i}`,
          url: imgPrefix + item,
          status: 'done',
        }))
      }
    }
    return <CustomUpload
      {...props}
      initFileList={initFileList}
      handleFormItem={fileList => this.handleImgUpload({ fileList, property, maxNum })}
    />;
  }

  render() {
    const {
      form,
      onSubmit,
      onCancel,
      onAddLanguage,
      visible,
      modalState,
      initialFormData,
    } = this.props;
    const { tempEditorValue } = this.state;
    const { description } = initialFormData;

    const disabled = modalState === 'Detail';

    const FormConfig = modalState === 'AddLanguage' ? [
      { fieldId: 'language', label: '语言', fieldType: 'select', fieldProps: { options: languageSelect, disabled }, rules: getRules({ required: true, label: '语言' }), },
      { fieldId: 'productName', label: '商品名', fieldType: 'input', rules: getRules({ required: true, label: '商品名', max: 100 }) },
      { fieldId: 'specs', label: '规格', fieldType: 'input', rules: getRules({ required: true, label: '规格', max: 100 }) },
      { fieldId: 'brand', label: '品牌', fieldType: 'input', rules: getRules({ required: true, label: '品牌' }) },
      { fieldId: 'unit', label: '单位', fieldType: 'input', rules: getRules({ required: true, label: '商品名', max: 50 }) },
      { fieldId: 'saleDate', label: '上架时间', fieldType: 'datePicker', labelSpan: 8, rules: getRules({ required: true, label: '上架时间' }), },
      { fieldId: 'description', label: '描述', fieldType: 'node', fieldNode: <CustomEditor onChange={this.onEditorChange} />, colLayout: { span: 24 } },
      { fieldId: 'version', label: '版本', fieldType: 'input', colLayout: { span: 0 } },
    ] : modalState === 'Detail' || modalState === 'Default' ? [
    ] : [
          { fieldId: 'productTokens', fieldType: 'input', colLayout: { span: 0 } },
          { fieldId: 'productName', label: '商品名', fieldType: 'input', rules: getRules({ required: true, label: '商品名', max: 100 }) },
          { fieldId: 'brand', label: '品牌', fieldType: 'input', rules: getRules({ required: true, label: '品牌' }) },
          { fieldId: 'specs', label: '规格', fieldType: 'input', rules: getRules({ required: true, label: '规格', max: 100 }) },
          { fieldId: 'unit', label: '单位', fieldType: 'input', rules: getRules({ required: true, label: '商品名', max: 50 }) },
          { fieldId: 'model', label: '型号', fieldType: 'input', fieldProps: { disabled }, rules: getRules({ required: true, label: '型号', max: 50 }) },
          { fieldId: 'categoryNames', label: '分类', fieldType: 'categoryCascader', fieldProps: { form, setFieldId: 'categoryToken' }, rules: getRules({ required: true, label: '分类' }) },
          { fieldId: 'categoryToken', label: 'categoryToken', fieldType: 'input', colLayout: { span: 0 } },
          { fieldId: 'markets', label: '出口市场', fieldType: 'input', labelSpan: 8, rules: getRules({ required: true, label: '出口市场' }), },
          { fieldId: 'price', label: '出厂价', fieldType: 'inputNumber', fieldProps: { disabled }, rules: getRules({ required: true, label: '出厂价', type: 'number' }) },
          { fieldId: 'coverImage', label: '主图', fieldType: 'node', rules: getRules({ required: true, label: '主图' }), fieldNode: this.imgUpload({ maxNum: 1, property: 'coverImage', type: 'PRODUCT' }), colLayout: { span: 24 } },
          { fieldId: 'images', label: '图片', fieldType: 'node', rules: getRules({ required: true, label: '图片' }), fieldNode: this.imgUpload({ maxNum: 5, property: 'images', type: 'PRODUCT' }), colLayout: { span: 24 } },
          { fieldId: 'saleDate', label: '上架时间', fieldType: 'datePicker', labelSpan: 8, rules: getRules({ required: true, label: '上架时间' }), },
          { fieldId: 'description', label: '描述', fieldType: 'node', fieldNode: <CustomEditor value={description} onChange={this.onEditorChange} />, colLayout: { span: 24 } },
          { fieldId: 'version', label: '版本', fieldType: 'input', colLayout: { span: 0 } },
        ];

    const params = { form, modalState, description: tempEditorValue }
    const { token, ...restProps } = initialFormData;
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
            ] : modalState === 'Detail' ? [
              <Button key="add" type="primary" onClick={() => onAddLanguage(initialFormData)}>添加语言</Button>,
              <Button key="close" onClick={onCancel}>关闭</Button>,
            ] :
              [
                <Button key="submit" type="primary" onClick={() => onSubmit({ ...params, submit: true })}>提交</Button>,
                <Button key="save" onClick={() => onSubmit({ ...params, submit: false })}>保存</Button>,
              ]
        }
      >
        {this.renderTab({ modalState, initialFormData: restProps })}
        <CustomForm
          form={form}
          modalFormConfig={FormConfig}
          initialFormData={
            modalState === 'Add' || modalState === 'AddLanguage' ? { version: 0 }
              : modalState === 'Edit' || modalState === 'AddSequence' ? formatInitialFormData(initialFormData)
                : initialFormData
          }
        />
      </Modal>
    )
  }
}

export default EditForm;
