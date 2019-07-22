import React, { Component } from 'react';
import { Select, Pagination, Spin } from 'antd';
import PropTypes from 'prop-types';

const { Option } = Select;
const companyToken = localStorage.getItem('companyToken');

export default class CustomSelect extends Component {
  static propTypes = {
    pageSize: PropTypes.number,
    searchType: PropTypes.string.isRequired,
    getDataList: PropTypes.func.isRequired,
    optionFieldNames: PropTypes.object,
    valueType: PropTypes.oneOf(['keyValue', 'key']),
  };

  static defaultProps = {
    pageSize: 10,
    optionFieldNames: {
      key: 'id',
      value: 'id',
      label: 'name',
    },
    valueType: 'key',
  };

  constructor(props) {
    super(props);
    const { mode, value } = props;
    const initValue = mode === 'multiple' ? (value || []) : (value || '');

    this.state = {
      value: initValue,
      optionList: [],
      loading: false,
      total: 0,
      index: 1,
    }
  }

  static getDerivedStateFromProps(nextProps) {
    const { value } = nextProps;

    if (value) return { value };

    return null;
  }

  componentDidMount() {
    this.loadOptionData({ size: 10, page: 0 });
  }

  loadOptionData = parmas => {
    const { getDataList } = this.props;
    this.setState({ loading: true })
    getDataList({
      t: new Date().getTime(),
      companyToken,
      ...parmas
    })
      .then(res => {
        this.setState({ loading: false })
        if (res && res.code === 0) {
          this.setState({ optionList: res.elems, total: res.elemTotal });
        }
      })
  }

  covertValue = value => {
    const { optionFieldNames } = this.props;
    if (typeof value === 'object') {
      if (value instanceof Array) {
        return value.map(item => (item[optionFieldNames.value] || item))
      }
      return value[optionFieldNames.value]
    }
    return value;
  }

  handleSearch = value => {
    const { searchType } = this.props;
    this.loadOptionData({ [searchType]: value })
  }

  handlePageChange = (index, size) => {
    this.setState({ index })
    this.loadOptionData({ page: index - 1, size })
  }

  handleChange = (value, option) => {
    // eslint-disable-next-line react/destructuring-assignment
    if (!this.props.value) this.setState({ value })
    this.triggerChange(value, option);
  }

  triggerChange = (value, option) => {
    const { onChange, valueType, mode, optionFieldNames } = this.props;
    let fieldsValue;
    if (valueType === 'keyValue') {
      if (mode === 'multiple') {
        fieldsValue = option.map(v => ({
          [optionFieldNames.value]: v.props.value,
          [optionFieldNames.label]: v.props.children,
        }))
      } else {
        fieldsValue = {
          [optionFieldNames.value]: option.props.value,
          [optionFieldNames.label]: option.props.children,
        }
      }
    } else {
      fieldsValue = value;
    }
    if (onChange) {
      onChange(fieldsValue, option);
    }
  };

  render() {
    const { value, optionList, loading, total, index } = this.state;
    const { mode, optionFieldNames, pageSize, disabled } = this.props;
    return (
      <Select
        showSearch
        showArrow
        mode={mode}
        style={{ width: '100%' }}
        placeholder="请选择"
        notFoundContent={loading ? <Spin size="small" /> : null}
        onSearch={this.handleSearch}
        onChange={this.handleChange}
        value={this.covertValue(value) || undefined}
        filterOption={false}
        getPopupContainer={triggerNode => triggerNode.parentNode}
        disabled={disabled}
      >
        {optionList.map(v => (
          <Option
            key={(v[optionFieldNames.token])}
            value={v[optionFieldNames.value]}
            token={v[optionFieldNames.token]}
          >
            {v[optionFieldNames.label]}
          </Option>
        ))}
        {total > pageSize ? (
          <Option key='pagination' disabled style={{ textAlign: 'center' }}>
            <Pagination size="small" current={index} pageSize={pageSize} total={total} onChange={this.handlePageChange} />
          </Option>
        ) : null
        }

      </Select>
    );
  }
}
