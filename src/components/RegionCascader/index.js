import React, { Component } from 'react';
import { Cascader } from 'antd';
import { getRegionsOpts } from '@/services/enterprise/tool';

class RegionCascader extends Component {

  state = {
    provinces: [],
    value: [],
  }

  componentDidMount() {
    getRegionsOpts().then(res => {
      if (res && res.code === 0) {
        this.setState({ provinces: res.elems })
      }
    })
  }

  componentWillReceiveProps(nextProps) {
    // eslint-disable-next-line react/destructuring-assignment
    if (this.props.value !== nextProps.value) {
      this.setState({ value: nextProps.value })
    }
  }

  loadData = () => {

  }


  renderRegionTokens = (array) => {
    const reg = /[\u4e00-\u9fa5]/;
    const { provinces } = this.state;
    const result = [];
    if (array && array.length > 0) {
      const change = array.map(i => reg.test(i)).every(j => j);
      if (!change) {
        return array;
      }
      const initRegion = array.map(i => i.replace(/\\/i, ''));
      provinces.forEach(province => initRegion.forEach(name => {
        if (name === province.name) {
          result.push(province.token);
        }
      }))
    }
    return result;
  }

  renderRegionNames = (array) => {
    const reg = /[\u4e00-\u9fa5]/;
    const { provinces } = this.state;
    const result = [];
    if (array && array.length > 0) {
      const change = array.map(i => reg.test(i)).every(j => j);
      if (change) {
        return array;
      }
      provinces.forEach(province => array.forEach(token => {
        if (token === province.token) {
          result.push(province.name);
        }
      }))
    }
    return result;
  }

  formatProvinces = (data) => {
    const provinces = data.filter(i => i.depth === 1);
    provinces.forEach(i => {
      if (!i.children) {
        Object.assign(i, { children: [] })
      }
      i.children.push(...data.filter(j => j.parentCode === i.code));
      i.children = [...new Set(i.children)]
    });
    return provinces;
  }


  handleAreaChange = (value) => {
    const { form } = this.props;
    this.setState({ value }, () => {
      // eslint-disable-next-line react/destructuring-assignment
      const regionNames = this.renderRegionNames(this.state.value);
      form.setFields({ 'regionToken': { value: value[value.length - 1] } })
      form.setFields({ 'regionNames': { value: regionNames } })
    })
  }

  render() {
    const { provinces, value } = this.state;
    // console.log(this.props)
    const finallyValue = this.renderRegionTokens(value);
    return (
      <Cascader
        value={finallyValue}
        placeholder='请选择'
        fieldNames={{ label: 'name', value: 'token', children: 'children' }}
        options={this.formatProvinces(provinces)}
        onChange={this.handleAreaChange}
      />
    )
  }
}

export default RegionCascader;
