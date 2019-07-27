import React, { Component } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import Link from 'umi/link';
import router from 'umi/router';
import { Form, Input, Button, Select, Row, Col, Card, Progress, Tabs } from 'antd';
import CustomUpload from '@/components/CustomUpload';
import CustomEditor from '@/components/CustomEditor';
import CustomForm from '@/components/CustomForm';
import getRules from '@/utils/regExpFunction'
import styles from './Register.less';

import { Source } from '@/utils/Enum';
import { formatFieldValue, formatInitialFormData } from '@/utils/enterprise/commonFunction';

const imgPrefix = 'http://pimg.21silkroad.com';
const FormItem = Form.Item;
const { Option } = Select;
const InputGroup = Input.Group;
const { TabPane } = Tabs;

const passwordStatusMap = {
  ok: (
    <div className={styles.success}>
      <FormattedMessage id="validation.password.strength.strong" />
    </div>
  ),
  pass: (
    <div className={styles.warning}>
      <FormattedMessage id="validation.password.strength.medium" />
    </div>
  ),
  poor: (
    <div className={styles.error}>
      <FormattedMessage id="validation.password.strength.short" />
    </div>
  ),
};

const passwordProgressMap = {
  ok: 'success',
  pass: 'normal',
  poor: 'exception',
};

@connect(({ register, loading }) => ({
  register,
  submitting: loading.effects['register/submit'],
}))
@Form.create()
class Register extends Component {
  state = {
    count: 0,
    confirmDirty: false,
    visible: false,
    help: '',
    prefix: '86',
    RegisterType: 'Normal',
    description: ''
  };

  componentDidUpdate() {
    const { form, register } = this.props;
    const account = form.getFieldValue('mail');
    if (register.status === 'ok') {
      router.push({
        pathname: '/user/register-result',
        state: {
          account,
        },
      });
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  onTabChange = value => {
    this.setState({ RegisterType: value })
  }

  onEditorChange = value => {
    this.setState({ description: value })
  }

  onGetCaptcha = () => {
    let count = 59;
    this.setState({ count });
    this.interval = setInterval(() => {
      count -= 1;
      this.setState({ count });
      if (count === 0) {
        clearInterval(this.interval);
      }
    }, 1000);
  };

  getPasswordStatus = () => {
    const { form } = this.props;
    const value = form.getFieldValue('password');
    if (value && value.length > 9) {
      return 'ok';
    }
    if (value && value.length > 5) {
      return 'pass';
    }
    return 'poor';
  };

  handleSubmit = e => {
    e.preventDefault();
    const { form, dispatch, location } = this.props;
    const { description = '', RegisterType } = this.state;
    let source = 'NONE';
    if (location && location.query) {
      source = Source[location.query.source].value;
    }
    form.validateFields({ force: true }, (err, values) => {
      if (!err) {
        const { account, password, ...rest } = formatFieldValue(values);
        const parmas = { account, password, RegisterType, company: { ...rest, description } };
        dispatch({
          type: 'register/submit',
          payload: {
            source,
            ...parmas,
          },
        });
      }
    });
  };

  handleConfirmBlur = e => {
    const { value } = e.target;
    const { confirmDirty } = this.state;
    this.setState({ confirmDirty: confirmDirty || !!value });
  };

  checkConfirm = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('password')) {
      callback(formatMessage({ id: 'validation.password.twice' }));
    } else {
      callback();
    }
  };

  checkPassword = (rule, value, callback) => {
    const { visible, confirmDirty } = this.state;
    if (!value) {
      this.setState({
        help: formatMessage({ id: 'validation.password.required' }),
        visible: !!value,
      });
      callback('error');
    } else {
      this.setState({
        help: '',
      });
      if (!visible) {
        this.setState({
          visible: !!value,
        });
      }
      if (value.length < 6) {
        callback('error');
      } else {
        const { form } = this.props;
        if (value && confirmDirty) {
          form.validateFields(['confirm'], { force: true });
        }
        callback();
      }
    }
  };

  changePrefix = value => {
    this.setState({
      prefix: value,
    });
  };

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

  renderPasswordProgress = () => {
    const { form } = this.props;
    const value = form.getFieldValue('password');
    const passwordStatus = this.getPasswordStatus();
    return value && value.length ? (
      <div className={styles[`progress-${passwordStatus}`]}>
        <Progress
          status={passwordProgressMap[passwordStatus]}
          className={styles.progress}
          strokeWidth={6}
          percent={value.length * 10 > 100 ? 100 : value.length * 10}
          showInfo={false}
        />
      </div>
    ) : null;
  };

  render() {
    const { count, prefix, help, visible, RegisterType } = this.state;
    const { form, submitting, location } = this.props;
    let source = '?source=0'
    if (location && location.search) {
      source = location.search;
    }
    const FormConfig = [
      { fieldId: 'account', label: '账号', fieldType: 'input', rules: getRules({ required: true, label: '账号', min: 6, max: 20 }) },
      { fieldId: 'password', label: '密码', fieldType: 'password', rules: getRules({ required: true, label: '密码', min: 6, max: 20 }) },
      { fieldId: 'companyName', label: '企业名', fieldType: 'input', labelSpan: 8, rules: getRules({ required: true, label: '企业名', max: 6 }) },
      { fieldId: 'contacts', label: '联系人', fieldType: 'input', rules: getRules({ required: true, label: '联系人', max: 50 }) },
      { fieldId: 'cellphone', label: '手机', fieldType: 'input', labelSpan: 8, rules: getRules({ required: true, label: '手机', type: 'cellphone' }) },
      { fieldId: 'notifyByCellphone', label: '短信通知', fieldType: 'switch' },
      { fieldId: 'phone', label: '固话', fieldType: 'input', rules: getRules({ required: true, label: '固话', type: 'phone' }) },
      { fieldId: 'email', label: '邮件', fieldType: 'input', labelSpan: 8, fieldProps: { type: 'email' }, rules: getRules({ required: true, label: '邮件', type: 'email' }) },
      { fieldId: 'notifyByEmail', label: '邮件通知', fieldType: 'switch' },
      { fieldId: 'regionToken', label: 'regionToken', fieldType: 'input', colLayout: { span: 0 } },
      // { fieldId: 'regionNames', label: '地区', fieldType: 'regionCascader',labelSpan:8,fieldProps:{form}, rules: getRules({ required: true,label: '地区',type:'object' }) },
      { fieldId: 'regionNames', label: '地区', fieldType: 'regionCascader', labelSpan: 8, fieldProps: { form }, rules: getRules({ required: true, label: '地区' }) },
      { fieldId: 'licenseCompanyName', label: '执照企业', fieldType: 'input', labelSpan: 8, rules: getRules({ required: true, label: '执照企业', max: 50 }) },
      { fieldId: 'address', label: '地址', fieldType: 'textArea', colLayout: { span: 24 }, rules: getRules({ label: '地址', max: 200 }) },
      { fieldId: 'fax', label: '传真', fieldType: 'input', rules: getRules({ label: '传真号码', type: 'fax' }) },
      // { fieldId: 'foundedDate', label: '注册时间', fieldType: 'datePicker', rules: getRules({ label: '注册时间' }) },
      { fieldId: 'foundedDate', label: '上市时间', fieldType: 'datePicker', labelSpan: 8, rules: getRules({ required: true, label: '上市时间' }) },
      { fieldId: 'website', label: '企业网站', fieldType: 'input', labelSpan: 8, rules: getRules({ label: '企业网站', type: 'url' }) },
      // { fieldId: 'coverImage', label: '主图', fieldType: 'node', fieldNode: this.imgUpload({ maxNum: 1, property: 'coverImage', type: "COMPANY" }), colLayout: { span: 24 }, rules: getRules({ required: true, label: '主图' }) },
      // { fieldId: 'logoImage', label: 'LOGO', fieldType: 'node', fieldNode: this.imgUpload({ maxNum: 1, property: 'logoImage', type: "COMPANY" }), colLayout: { span: 24 }, rules: getRules({ required: true, label: '企业LOGO' }) },
      { fieldId: 'description', label: '企业简介', fieldType: 'node', fieldNode: <CustomEditor onChange={this.onEditorChange} />, colLayout: { span: 24 } },
      { fieldId: 'version', label: '版本', fieldType: 'input', colLayout: { span: 0 } },
    ];

    const initialFormData = { version: 0 }

    return (
      <div className={styles.main}>
        <h2>
          <FormattedMessage id="app.register.register" />
        </h2>
        <Card>
          <Tabs defaultActiveKey={RegisterType} onChange={this.onTabChange}>
            <TabPane tab="普通用户" key="Normal">
              <CustomForm
                form={form}
                modalFormConfig={FormConfig}
                initialFormData={initialFormData}
              />
            </TabPane>
            <TabPane tab="ESR用户" key="ESR">
              <CustomForm
                form={form}
                modalFormConfig={FormConfig}
                initialFormData={initialFormData}
              />
            </TabPane>
          </Tabs>
          <FormItem>
            <Button
              size="large"
              loading={submitting}
              className={styles.submit}
              type="primary"
              htmlType="submit"
              onClick={this.handleSubmit}
            >
              <FormattedMessage id="app.register.register" />
            </Button>
            <Link className={styles.login} to={`/enterprise/user/login${source}`}>
              <FormattedMessage id="app.register.sing-in" />
            </Link>
          </FormItem>
        </Card>
        {/* <Form onSubmit={this.handleSubmit}>
          <FormItem>
            {getFieldDecorator('mail', {
              rules: [
                {
                  required: true,
                  message: formatMessage({ id: 'validation.email.required' }),
                },
                {
                  type: 'email',
                  message: formatMessage({ id: 'validation.email.wrong-format' }),
                },
              ],
            })(
              <Input size="large" placeholder={formatMessage({ id: 'form.email.placeholder' })} />
            )}
          </FormItem>
          <FormItem help={help}>
            <Popover
              content={
                <div style={{ padding: '4px 0' }}>
                  {passwordStatusMap[this.getPasswordStatus()]}
                  {this.renderPasswordProgress()}
                  <div style={{ marginTop: 10 }}>
                    <FormattedMessage id="validation.password.strength.msg" />
                  </div>
                </div>
              }
              overlayStyle={{ width: 240 }}
              placement="right"
              visible={visible}
            >
              {getFieldDecorator('password', {
                rules: [
                  {
                    validator: this.checkPassword,
                  },
                ],
              })(
                <Input
                  size="large"
                  type="password"
                  placeholder={formatMessage({ id: 'form.password.placeholder' })}
                />
              )}
            </Popover>
          </FormItem>
          <FormItem>
            {getFieldDecorator('confirm', {
              rules: [
                {
                  required: true,
                  message: formatMessage({ id: 'validation.confirm-password.required' }),
                },
                {
                  validator: this.checkConfirm,
                },
              ],
            })(
              <Input
                size="large"
                type="password"
                placeholder={formatMessage({ id: 'form.confirm-password.placeholder' })}
              />
            )}
          </FormItem>
          <FormItem>
            <InputGroup compact>
              <Select
                size="large"
                value={prefix}
                onChange={this.changePrefix}
                style={{ width: '20%' }}
              >
                <Option value="86">+86</Option>
                <Option value="87">+87</Option>
              </Select>
              {getFieldDecorator('mobile', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'validation.phone-number.required' }),
                  },
                  {
                    pattern: /^\d{10}$/,
                    message: formatMessage({ id: 'validation.phone-number.wrong-format' }),
                  },
                ],
              })(
                <Input
                  size="large"
                  style={{ width: '80%' }}
                  placeholder={formatMessage({ id: 'form.phone-number.placeholder' })}
                />
              )}
            </InputGroup>
          </FormItem>
          <FormItem>
            <Row gutter={8}>
              <Col span={16}>
                {getFieldDecorator('captcha', {
                  rules: [
                    {
                      required: true,
                      message: formatMessage({ id: 'validation.verification-code.required' }),
                    },
                  ],
                })(
                  <Input
                    size="large"
                    placeholder={formatMessage({ id: 'form.verification-code.placeholder' })}
                  />
                )}
              </Col>
              <Col span={8}>
                <Button
                  size="large"
                  disabled={count}
                  className={styles.getCaptcha}
                  onClick={this.onGetCaptcha}
                >
                  {count
                    ? `${count} s`
                    : formatMessage({ id: 'app.register.get-verification-code' })}
                </Button>
              </Col>
            </Row>
          </FormItem>
          <FormItem>
            <Button
              size="large"
              loading={submitting}
              className={styles.submit}
              type="primary"
              htmlType="submit"
            >
              <FormattedMessage id="app.register.register" />
            </Button>
            <Link className={styles.login} to="/User/Login">
              <FormattedMessage id="app.register.sing-in" />
            </Link>
          </FormItem>
        </Form> */}

      </div>
    );
  }
}

export default Register;
