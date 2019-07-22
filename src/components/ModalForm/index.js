import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Form, Col, Row, Modal, Spin, Select, Input, Checkbox, InputNumber } from 'antd';
import SearchSelect from '@/components/SearchSelect';
import CustomCascader from '@/components/CustomCascader';
import CustomSelect from '@/components/CustomSelect';

import styles from './index.less';

const FormItem = Form.Item;
const SelectOption = Select.Option;
const CheckboxGroup = Checkbox.Group;
const { TextArea } = Input;

export default class ModalForm extends PureComponent {
  static propTypes = {
    form: PropTypes.object.isRequired,
    modalFormConfig: PropTypes.array.isRequired,
    loading: PropTypes.bool,
    defaultSpan: PropTypes.number,
    initialFormData: PropTypes.object,
  };

  static defaultProps = {
    loading: false,
    defaultSpan: 8,
    initialFormData: {},
  };

  render() {
    const {
      visible,
      onCancel,
      onOk,
      footer,
      title,
      width=1200,
      gutter=32,
      loading,
      defaultSpan,
      modalFormConfig,
      initialFormData,
      form: { getFieldDecorator, setFieldsValue },
      ...leftProps
    } = this.props;

    return (
      <Modal
        title={title}
        width={width}
        visible={visible}
        className={styles.tableListForm}
        onCancel={onCancel}
        onOk={onOk}
        footer={footer}
        destroyOnClose
        {...leftProps}
      >
        <Spin spinning={loading} size="large">
          <Form layout="inline">
            <Row gutter={gutter}>
              {modalFormConfig.map(item => {
                const {
                  fieldId,
                  fieldType,
                  label,
                  colLayout,
                  initialValue,
                  rules = [],
                  fieldProps = {},
                  fieldNode,
                } = item;
                const { span, offset } = { span: defaultSpan, offset: 0, ...colLayout };
                const colConfig = { span, offset, key: fieldId };
                const formItemConfig = {
                  label,
                  labelCol: { span: span === 8 ? 6 : span === 12 ? 4 : 2 },
                };
                const initV = initialFormData[fieldId] || initialValue;
                switch (fieldType) {
                  case 'input':
                    return (
                      <Col {...colConfig}>
                        <FormItem {...formItemConfig}>
                          {getFieldDecorator(fieldId, { rules, initialValue: initV })(
                            <Input
                              {...{
                                style: { width: '100%' },
                                placeholder: `请输入${label}`,
                                ...fieldProps,
                              }}
                            />
                          )}
                        </FormItem>
                      </Col>
                    );
                  case 'inputNumber':
                    return (
                      <Col {...colConfig}>
                        <FormItem {...formItemConfig}>
                          {getFieldDecorator(fieldId, { rules, initialValue: initV })(
                            <InputNumber
                              {...{
                                style: { width: '100%' },
                                placeholder: `请输入${label}`,
                                min: 0,
                                ...fieldProps,
                              }}
                            />
                          )}
                        </FormItem>
                      </Col>
                    );
                  case 'textArea':
                    return (
                      <Col {...colConfig}>
                        <FormItem {...formItemConfig}>
                          {getFieldDecorator(fieldId, { rules, initialValue: initV })(
                            <TextArea
                              {...{ style: { width: '100%' }, autosize: true, ...fieldProps }}
                            />
                          )}
                        </FormItem>
                      </Col>
                    );
                  case 'select':
                    return (
                      <Col {...colConfig}>
                        <FormItem {...formItemConfig}>
                          {getFieldDecorator(fieldId, { rules, initialValue: initV })(
                            <Select
                              {...{
                                style: { width: '100%' },
                                placeholder: `请选择${label}`,
                                ...fieldProps,
                              }}
                              getPopupContainer={triggerNode => triggerNode.parentNode}
                            >
                              {fieldProps.options instanceof Array
                                ? fieldProps.options.map(opt => (
                                  <SelectOption value={opt.value} key={opt.value}>
                                    {opt.label}
                                  </SelectOption>
                                ))
                                : null}
                            </Select>
                          )}
                        </FormItem>
                      </Col>
                    );
                  case 'checkbox':
                    return (
                      <Col {...colConfig}>
                        <FormItem {...formItemConfig}>
                          {getFieldDecorator(fieldId, { rules, initialValue: initV||[] })(
                            <CheckboxGroup {...fieldProps} />
                          )}
                        </FormItem>
                      </Col>
                    );
                  case 'searchSelect':
                    return (
                      <Col {...colConfig}>
                        <FormItem {...formItemConfig}>
                          {getFieldDecorator(fieldId, { rules, initialValue: initV&&initV.name })(
                            <SearchSelect {...fieldProps} />
                          )}
                        </FormItem>
                      </Col>
                    );
                  case 'node':
                    return (
                      <Col {...colConfig}>
                        <FormItem {...formItemConfig}>
                          {getFieldDecorator(fieldId, { rules, initialValue: initV })(
                            <Fragment>{fieldNode || null}</Fragment>
                          )}
                        </FormItem>
                      </Col>
                    );
                  case 'cascader':
                    return (
                      <Col {...colConfig}>
                        <FormItem {...formItemConfig}>
                          {getFieldDecorator(fieldId, { rules, initialValue: initV })(
                            <CustomCascader {...fieldProps} />
                          )}
                        </FormItem>
                      </Col>
                    );
                  case 'customSelect':
                    return (
                      <Col {...colConfig}>
                        <FormItem {...formItemConfig}>
                          {getFieldDecorator(fieldId, { rules, initialValue: initV })(
                            <CustomSelect {...fieldProps} />
                          )}
                        </FormItem>
                      </Col>
                    );
                  default:
                    return null;
                }
              })}
            </Row>
          </Form>
        </Spin>
      </Modal>
    );
  }
}
