import React, { Component } from 'react';
import { Form, Button, Icon } from 'antd';
import CustomForm from '@/components/CustomForm';
// import TestForm from '@/components/TestForm';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './index.less';

@Form.create()
class ConditionQuery extends Component {
  static propTypes = {
    modalFormConfig: PropTypes.array,
    onQuery: PropTypes.func.isRequired,
  };

  static defaultProps = {
    modalFormConfig: [],
  };

  state = {
    expandForm: false,
  };

  handleSubmit = () => {
    const { form, onQuery } = this.props;
    form.validateFields((error, value) => {
      if (!error) {
        const v = value;
        delete v.buttonGroup;
        Object.keys(v).forEach(item => {
          if (v[item] === undefined) delete v[item]
        })
        onQuery(v);
      }
    });
  };

  handleFormReset = () => {
    const { form, onQuery } = this.props;
    form.resetFields();
    onQuery();
  };

  toggleForm = () => {
    this.setState(prevState => ({
      expandForm: !prevState.expandForm,
    }));
  };

  render() {
    const { expandForm } = this.state;
    const { form, modalFormConfig } = this.props;
    const btn = (
      <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
        {expandForm ? '收起' : '展开'} {expandForm ? <Icon type="up" /> : <Icon type="down" />}
      </a>
    );
    const buttonGroup = (
      <div style={{ overflow: 'hidden' }}>
        <div className={classNames(styles.buttonGroupClose, { [styles.buttonGroupOpen]: expandForm })}>
          <Button type="primary" onClick={this.handleSubmit}>
            查询
          </Button>
          <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
            重置
          </Button>
          {modalFormConfig.length >= 3 ? btn : null}
        </div>
      </div>
    );

    const btnGroupConfig = { fieldId: 'buttonGroup', fieldType: 'node', fieldNode: buttonGroup, colLayout: { span: 8, offset: expandForm ? 16 : 0 } }
    modalFormConfig.forEach(i => {
      if (i.fieldId === 'categoryNames') {
        Object.assign(i, { fieldProps: { form, ...i.fieldProps } })
      }
    })
    const [c1, c2, ...leftConfig] = modalFormConfig;
    const config1 = [...modalFormConfig, btnGroupConfig];
    const config2 = c1 ? (c2 ? [c1, c2, btnGroupConfig] : [c1, btnGroupConfig]) : [];
    const newConfig = expandForm ? config1 : config2;
    return <CustomForm form={form} modalFormConfig={newConfig} compact />;
  }
}


export default ConditionQuery;
