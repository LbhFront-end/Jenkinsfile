import React, { Component } from 'react';
import { Icon, Input, AutoComplete } from 'antd';
import PropTypes from 'prop-types';

const { Option } = AutoComplete;

export default class SearchSelect extends Component {
  static propTypes = {
    index: PropTypes.number,
    total: PropTypes.number,
    pageSize: PropTypes.number,
    dataList: PropTypes.array,
    searchType: PropTypes.string.isRequired,
    getdataList: PropTypes.func.isRequired,
    optionFieldNames:PropTypes.object,
    onSelect:PropTypes.func,
  }

  static defaultProps = {
    index: 1,
    total: 0,
    pageSize: 10,
    dataList: [],
    optionFieldNames: {
      key: 'id',
      value: 'id',
      label: 'name',
    },
    onSelect: ()=>{},
  }

  handlePaging = (e) => {
    const { index, getdataList } = this.props;
    const value = e.target.getAttribute('value')
    getdataList({
      index: (value === "prev") ? (index - 1) : (index + 1)
    });
  }

  handleSearch = (value) => {
    const { getdataList, searchType } = this.props;
    getdataList({[searchType]: value});
  }

  render() {
    const { total, index, pageSize, dataList, onSelect, optionFieldNames, value, ...leftProps } = this.props;
    const { key, value:val, label } = { key: 'id', value: 'id', label: 'name', ...optionFieldNames };
    const options = dataList.length>0?dataList.map(opt => (
      <Option key={opt[key]} value={`${opt[val]}`}>
        {opt[label]}
      </Option>
    )).concat([
      <Option disabled key="all" className="show-all">
        <a
          disabled={index === 1}
          style={{ float: 'left' }}
          onClick={(e) => this.handlePaging(e)}
        >
          <Icon type="left" theme="outlined" />
          <span value="prev">上一页</span>
        </a>
        <a
          disabled={index === Math.ceil(total / pageSize)}
          style={{ float: 'right' }}
          onClick={(e) => this.handlePaging(e)}
        >
          <span value="next">下一页</span>
          <Icon type="right" theme="outlined" />
        </a>
      </Option>,
      ]):[<Option key='null' disabled>找不到匹配项</Option>];

    return (
      <AutoComplete
        dataSource={options}
        placeholder='请选择'
        value={value && value[label] || value}
        onSearch={this.handleSearch}
        onSelect={(v, option) => { onSelect(v, option) }}
        {...leftProps}
      >
        <Input suffix={<Icon type="search" className="certain-category-icon" />} />
      </AutoComplete>
    );
  }
}
