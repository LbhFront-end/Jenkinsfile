import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Form, Col, Row, Select, Input, Checkbox, InputNumber, DatePicker } from 'antd';
import CustomCascader from '@/components/CustomCascader';
import CustomSelect from '@/components/CustomSelect';

import styles from './index.less';

const FormItem = Form.Item;
const SelectOption = Select.Option;
const CheckboxGroup = Checkbox.Group;
const { TextArea } = Input;
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;

export default class ModalForm extends PureComponent {
  static propTypes = {
    form: PropTypes.object.isRequired,
    modalFormConfig: PropTypes.array.isRequired,
    defaultSpan: PropTypes.number,
    initialFormData: PropTypes.object,
    compact: PropTypes.bool,
  };

  static defaultProps = {
    defaultSpan: 8,
    initialFormData: {},
    compact: false,
  };

  render() {
    const {
      gutter=32,
      defaultSpan,
      modalFormConfig,
      initialFormData,
      compact,
      form: { getFieldDecorator },
    } = this.props;
    const style = compact ? { margin: 0 } : {};

    return (
      <Form layout="inline" className={styles.tableListForm} style={style}>
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
              labelSpan,
            } = item;
            const { span, offset } = { span: defaultSpan, offset: 0, ...colLayout };
            const colConfig = { span, offset, key: fieldId };
            const formItemConfig = {
              label,
              labelCol: { span: labelSpan || (span === 8 ? 6 : span === 12 ? 4 : 2) },
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
              case 'datePicker':
                {
                  let picker;
                  switch (fieldProps.type) {
                    case 'range':
                      picker = <RangePicker style={{width:'100%'}} {...fieldProps} />; break;
                    case 'month':
                      picker = <MonthPicker style={{width:'100%'}} {...fieldProps} />; break;
                    case 'week':
                      picker = <WeekPicker style={{width:'100%'}} {...fieldProps} />; break;
                    default:
                      picker = <DatePicker style={{width:'100%'}} {...fieldProps} />; break;
                  }
                  return (
                    <Col {...colConfig}>
                      <FormItem {...formItemConfig}>
                        {getFieldDecorator(fieldId, { rules, initialValue: initV })(
                          picker
                        )}
                      </FormItem>
                    </Col>
                  );
                }
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
              case 'searchSelect':
                return (
                  <Col {...colConfig}>
                    <FormItem {...formItemConfig}>
                      {getFieldDecorator(fieldId, { rules, initialValue: initV })(
                        <CustomSelect {...fieldProps} />
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
              default:
                return null;
            }
          })}
        </Row>
      </Form>
    );
  }
}
