/* eslint-disable global-require */
import React, { Component } from 'react';
import { Form, Button, Modal } from 'antd';
import CustomUpload from '@/components/CustomUpload';
import CustomEditor from '@/components/CustomEditor';
import CustomForm from '@/components/CustomForm';
import { MockSelect } from '@/utils/Enum';
import { formatInitialFormData, renderTitle, handleRes } from '@/utils/enterprise/commonFunction'
import getRules from '@/utils/regExpFunction'

const imgPrefix = 'http://pimg.21silkroad.com';
const { languageSelect } = MockSelect;
const { confirm } = Modal;

@Form.create()
class EditForm extends Component {

  state = {
    tempEditorValue: '',
  }

  onEditorChange = (value) => {
    this.setState({ tempEditorValue: value })
  }

  onEditorChange = (value) => {
    // console.log(value)
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

  handleConfirm = (props) => {
    const { dispatch, form } = this.props;
    const { checked, noticeText, noticeType, fieldId } = props;
    const actionName = checked ? '开通' : '关闭';
    const action = checked ? 'on' : 'off';
    confirm({
      title: `确定${actionName}${noticeText}吗？`,
      okText: "确认",
      cancelText: "取消",
      onOk() {
        dispatch({
          type: `enterpriseManagement/notice`,
          payload: {
            action,
            noticeType
          },
          callback: (res) => {
            if (res) {
              handleRes({ res, actionName, record: [] });
            }
          }
        })
      },
      onCancel() {
        form.setFields({ [fieldId]: { value: !checked } })
      },
    });
  }

  handlePhoneNoticeChange = (props) => {
    this.handleConfirm(props);
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
      visible,
      modalState,
      initialFormData,
    } = this.props;
    const { tempEditorValue } = this.state;
    // console.log(initialFormData);

    const FormConfig =
      modalState === 'AddLanguage' ?
        [
          { fieldId: 'language', label: '语言', fieldType: 'select', fieldProps: { options: languageSelect }, rules: getRules({ required: true, label: '语言' }) },
          { fieldId: 'companyName', label: '企业名', fieldType: 'input', rules: getRules({ required: true, label: '企业名', max: 100 }) },
          { fieldId: 'contacts', label: '联系人', fieldType: 'input', rules: getRules({ required: true, label: '联系人', max: 50 }) },
          { fieldId: 'address', label: '地址', fieldType: 'input', rules: getRules({ required: true, label: '地址', max: 200 }) },
          { fieldId: 'foundedDate', label: '注册时间', fieldType: 'datePicker', rules: getRules({ required: true, label: '注册时间' }) },
          { fieldId: 'description', label: '描述', fieldType: 'node', fieldNode: <CustomEditor onChange={this.onEditorChange} />, colLayout: { span: 24 } },
          { fieldId: 'version', label: '版本', fieldType: 'input', colLayout: { span: 0 } },
        ] : modalState === 'Edit' ?
          [
            { fieldId: 'companyName', label: '企业名', fieldType: 'input', rules: getRules({ required: true, label: '企业名', max: 100 }) },
            { fieldId: 'contacts', label: '联系人', fieldType: 'input', rules: getRules({ required: true, label: '联系人', max: 50 }) },
            { fieldId: 'licenseCompanyName', label: '执照企业', fieldType: 'input', labelSpan: 8, rules: getRules({ required: true, label: '执照企业', max: 50 }) },
            { fieldId: 'regionToken', label: 'regionToken', fieldType: 'input', colLayout: { span: 0 } },
            { fieldId: 'regionNames', label: '地区', fieldType: 'regionCascader', fieldProps: { form }, rules: getRules({ required: true, label: '地区' }) },
            { fieldId: 'address', label: '地址', fieldType: 'input' },
            { fieldId: 'cellphone', label: '手机', fieldType: 'input' },
            { fieldId: 'email', label: '邮件', fieldType: 'input' },
            { fieldId: 'fax', label: '传真', fieldType: 'input' },
            { fieldId: 'foundedDate', label: '注册时间', labelSpan: 8, fieldType: 'datePicker', rules: getRules({ required: true, label: '注册时间' }) },
            { fieldId: 'notifyByCellphone', label: '短信通知', fieldType: 'switch', fieldProps: { onChange: (checked) => this.handlePhoneNoticeChange({ fieldId: 'notifyByCellphone', checked, noticeText: '短信通知', noticeType: 'cellphone' }) } },
            { fieldId: 'notifyByEmail', label: '邮件通知', fieldType: 'switch', fieldProps: { onChange: (checked) => this.handlePhoneNoticeChange({ fieldId: 'notifyByEmail', checked, noticeText: '邮件通知', noticeType: 'email' }) } },
            { fieldId: 'phone', label: '固话', fieldType: 'input' },
            { fieldId: 'website', label: '企业网站', fieldType: 'input' },
            { fieldId: 'coverImage', label: '主图', fieldType: 'node', fieldNode: this.imgUpload({ maxNum: 1, property: 'coverImage', type: 'COMPANY' }), colLayout: { span: 24 }, rules: getRules({ required: true, label: '主图' }) },
            { fieldId: 'logoImage', label: 'LOGO', fieldType: 'node', fieldNode: this.imgUpload({ maxNum: 1, property: 'logoImage', type: 'COMPANY' }), colLayout: { span: 24 }, rules: getRules({ required: true, label: '企业LOGO' }) },
            { fieldId: 'description', label: '企业简介', fieldType: 'node', fieldNode: <CustomEditor onChange={this.onEditorChange} />, colLayout: { span: 24 } },
            { fieldId: 'version', label: '版本', fieldType: 'input', colLayout: { span: 0 } },
          ] : [];
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
          [
            <Button key="submit" type="primary" onClick={() => onSubmit({ ...params, submit: true })}>提交</Button>,
            <Button key="cancle" onClick={() => onCancel()}>关闭</Button>,
          ]
        }
      >
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
