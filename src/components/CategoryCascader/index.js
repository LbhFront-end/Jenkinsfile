import React, { Component } from 'react';
import { Cascader } from 'antd';
import { getOpts } from '@/services/categoryManagement';

class CategoryCascader extends Component {

  state = {
    categories: [],
    value: [],
  }

  componentDidMount() {
    getOpts().then(res => {
      if (res && res.code === 0) {
        this.setState({ categories: res.elems })
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


  renderCategoryTokens = (array) => {
    const reg = /[\u4e00-\u9fa5]/;
    const { categories } = this.state;
    const result = [];
    if (array && array.length > 0) {
      const change = array.map(i => reg.test(i)).every(j => j);
      if (!change) {
        return array;
      }
      const initCategory = array.map(i => i.replace(/\\/i, ''));
      categories.forEach(category => initCategory.forEach(categoryName => {
        if (categoryName === category.categoryName) {
          result.push(category.token);
        }
      }))
    }
    return result;
  }

  renderCategoryNames = (array) => {
    const reg = /[\u4e00-\u9fa5]/;
    const { categories } = this.state;
    const result = [];
    if (array && array.length > 0) {
      const change = array.map(i => reg.test(i)).every(j => j);
      if (change) {
        return array;
      }
      categories.forEach(category => array.forEach(token => {
        if (token === category.token) {
          result.push(category.categoryName);
        }
      }))
    }
    return result;
  }

  formatCategories = (data, token) => {
    const itemArr = [];
    for (let i = 0; i < data.length; i += 1) {
      const node = data[i];
      if (node.parentToken === token) {
        const newNode = {};
        newNode.token = node.token;
        newNode.categoryName = node.categoryName;
        newNode.depth = node.depth;
        newNode.parentToken = node.parentToken;
        newNode.children = this.formatCategories(data, node.token);
        itemArr.push(newNode);
      }
    }
    return itemArr;
  }


  handleCategoryChange = (value) => {
    const { form, setFieldId } = this.props;
    this.setState({ value }, () => {
      // eslint-disable-next-line react/destructuring-assignment
      const categoryNames = this.renderCategoryNames(this.state.value);
      form.setFields({ 'categoryNames': { value: categoryNames } })
      form.setFields({ [setFieldId]: { value: value[value.length - 1] } })
    })
  }

  render() {
    const { categories, value } = this.state;
    const { changeOnSelect } = this.props;
    const finallyValue = this.renderCategoryTokens(value);
    return (
      <Cascader
        changeOnSelect={changeOnSelect}
        value={finallyValue}
        placeholder='请选择'
        fieldNames={{ label: 'categoryName', value: 'token', children: 'children' }}
        options={this.formatCategories(categories, "")}
        onChange={this.handleCategoryChange}
      />
    )
  }
}

export default CategoryCascader;
