import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getCategoryData, getRegionData } from '@/services/api';
import {  Cascader } from 'antd';

class CustomCascader extends Component {
  static propTypes = {
    type: PropTypes.oneOf(['category', 'region']).isRequired,
    value: PropTypes.array,
  };

  static defaultProps = {
    value: [],
  }

  static getDerivedStateFromProps(nextProps, state) {
    const initState = {};
    const { value, type } = nextProps;

    if (state.ids.length === 0) initState.ids = value;
    initState.getData = type === 'category' ? getCategoryData : getRegionData;

    return {...initState};
  }

  state = {
    ids: [],
    options: [],
  };

  componentDidMount() {
    const { getData } = this.state;
    const { value, type } = this.props;
    getData({
      isFirst: true,
    }).then(data => {
      this.setState({
        options: data[type].map(v => ({ ...v, isLeaf: false })),
      })
    }).then(() => {
      const { options } = this.state;
      if (value.length) {
        getData({ id: value[0] }).then(v => {
          options.forEach((opt, index) => {
            if (opt.id === v[type][0].id) options[index][type] = v[type][0][type];
          });
        }).then(() => {
          this.setState({options:[...options]})
        })
      }
    })
  }

  // 异步获取基础类目分类json
  loadData = (selectedOptions) => {
    const { getData } = this.state;
    const { type } = this.props;
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;
    getData({
      id: targetOption.id,
    }).then(v => {
      targetOption[type] = v[type][0][type];
      targetOption.loading = false;
      this.setState(prevState => ({
        options: [...prevState.options],
      }));
    });
  }

  // 根据所选分类获取 分类属性-属性值 列表
  onChange = (value, selectedOptions) => {
    if (selectedOptions.length === 3) {
      this.setState({ids:value})
      this.triggerChange(value, selectedOptions)
    }
  }

  triggerChange = (value, selectedOptions) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(value, selectedOptions);
    }
  };

  render() {
    const { ids, options } = this.state;
    const { type } = this.props;
    return (
      <Cascader
        options={options}
        loadData={this.loadData}
        onChange={this.onChange}
        value={ids}
        style={{ width: '100%' }}
        placeholder='请选择'
        fieldNames={{ label: 'name', value: 'id', children: type }}
      />
    )
  }
}

export default CustomCascader;
