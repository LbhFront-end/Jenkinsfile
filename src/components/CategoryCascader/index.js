import React, { Component } from 'react';
import { Cascader } from 'antd';
import { getCategoriesOpts } from '@/services/enterprise/tool';
import { getOpts } from '@/services/admin/categoryManagement';
import { getCache, getCacheStatus } from '@/utils/cache';

const status = getCacheStatus();
const getCategoryOptions = status === 'enterprise' ? getCategoriesOpts : status === 'admin' ? getOpts : null;

class CategoryCascader extends Component {

  state = {
    categories: [],
    value: [],
    initialValue: []
  }

  componentDidMount() {
    const { initialValue } = this.props;
    const cache = getCache();
    const { companyToken } = cache;
    getCategoryOptions({ companyToken }).then(res => {
      if (res && res.code === 0) {
        this.setState({
          categories: res.elems,
          initialValue,
        })
      }
    })
  }

  componentWillReceiveProps(nextProps) {
    // eslint-disable-next-line react/destructuring-assignment
    if (this.props.value !== nextProps.value) {
      this.setState({ value: nextProps.value })
      this.setState({ initialValue: [] })
    }
  }

  loadData = () => {

  }


  renderCategoryTokens = (array) => {
    const { categories } = this.state;
    const result = [];
    if (array && array.length > 0) {
      categories.forEach(category => array.forEach(categoryName => {
        if (categoryName === category.categoryName) {
          result.push(category.token);
        }
      }))
    }
    return result;
  }

  renderCategoryNames = (array) => {
    const { categories } = this.state;
    const result = [];
    if (array && array.length > 0) {
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
    const { categories, value, initialValue } = this.state;
    const { changeOnSelect } = this.props;
    const realValue = initialValue.length > 0 ? initialValue : value;
    const finallyValue = this.renderCategoryTokens(realValue);
    return (
      <Cascader
        value={finallyValue}
        changeOnSelect={changeOnSelect}
        placeholder='请选择'
        fieldNames={{ label: 'categoryName', value: 'token', children: 'children' }}
        options={this.formatCategories(categories, "")}
        onChange={this.handleCategoryChange}
      />
    )
  }
}

export default CategoryCascader;
