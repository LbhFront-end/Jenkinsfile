/* eslint-disable react/no-danger */
import React, { Component } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import {Line,Bar,Pie} from '@/components/MyCharts';
import { Card, Tabs, Divider, Table, Row, Col, Radio,Select,DatePicker } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { TimeRange } from '@/utils/Enum';
import {getIndicatorProduct,getGraph,getCategory,getCompany,getViewTimes} from '@/services/commodityGrowth';
import styles from './CommodityGrowth.less';

const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');


const { TabPane } = Tabs;
const { Option } = Select;
const { RangePicker } = DatePicker;
const buttonConfig = [
    { name: '上架商品', value: 'onTimes' },
   { name: '下架商品', value: 'offTimes' },
   { name: '新增商品', value: 'createTimes' },
   { name: '累计商品', value: 'total' }
]

class CommodityGrowth extends Component {
  state = {
    rangeValue: 'SEVEN',
    TimeRangeValue: undefined,
    type:'onTimes',
    indicatorProductData:{},
    graphData:{},
    tabActiveKey:'growth',
    categoryGraphData:[],
    categoryData:{},
    companyData:{},
    viewTimesData:{},
  }

  componentDidMount() {
    const {rangeValue} = this.state;
    this.getIndicatorProductData();
    this.getGraphData({range: rangeValue,line:'line'});
    this.getCategoryGraphData();
    this.getCategoryData();
    this.getCompanyData();
    this.getViewTimesData();
  }

  getIndicatorProductData = ()=>{
    getIndicatorProduct().then(res=>{
      if (res && res.code === 0) {
        this.setState({ indicatorProductData: res.elem })
      }
    })
  }

  getGraphData = (params) => {
    const { type } = this.state;
    getGraph({ type, ...params }).then(res => {
      if (res && res.code === 0) {
        this.setState({ graphData: res.elems })
      }
    })
  }

  getCategoryGraphData = (params)=>{
    getCategory({...params}).then(res=>{
      if (res && res.code === 0) {
        this.setState({ categoryGraphData: res.elems })
      }
    })
  }

  getCategoryData = (params)=>{
    getCategory({...params}).then(res=>{
      if (res && res.code === 0) {
        this.setState({
          categoryData: {
            list: res.elems,
            pagination: {
              currentPage: res.page + 1,
              pageSize: res.size,
              total: res.elemTotal,
            }
          }
        })
      }
    })
  }

  getCompanyData = (params)=>{
    getCompany({...params}).then(res=>{
      if (res && res.code === 0) {
        this.setState({
          companyData: {
            list: res.elems,
            pagination: {
              currentPage: res.page + 1,
              pageSize: res.size,
              total: res.elemTotal,
            }
          }
        })
      }
    })
  }

  getViewTimesData = (params)=>{
    getViewTimes({...params}).then(res=>{
      if (res && res.code === 0) {
        this.setState({
          viewTimesData: {
            list: res.elems,
            pagination: {
              currentPage: res.page + 1,
              pageSize: res.size,
              total: res.elemTotal,
            }
          }
        })
      }
    })
  }

  handleType = e => {
    const type = e.target.value;
    this.setState({type,rangeValue: 'SEVEN',TimeRangeValue: undefined,})
    this.getGraphData({type,line:'line',range:'SEVEN'});
  }

  handleTabChange = (value)=>{
    this.setState({tabActiveKey:value})
  }


  handleRangeChange = value => {
    this.setState({ rangeValue: value })
    this.getGraphData({range: value,line:'line'})
  }

  handleTimeRangeChange = value => {
    this.setState({ TimeRangeValue: value })
    let dateU;
    let dateL;
    if(value.length > 1){
      dateL = value[0].format('YYYY-MM-DD HH:mm:ss.SSS');
      dateU = value[1].format('YYYY-MM-DD HH:mm:ss.SSS');
    }
    if(dateU && dateL){
      this.getGraphData({dateU,dateL,line:'line2'})
    }
  }


  handleCompanyTableChange = (pagination, filtersArg, sorter) => {
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});
    const params = {
      // currentPage: pagination.current,
      // pageSize: pagination.pageSize,
      page: pagination.current - 1,
      size: 10,
      ...filters,
    }
    this.getCompanyData({ ...params });
  }

  handleCategoryTableChange = (pagination, filtersArg, sorter) => {
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});
    const params = {
      // currentPage: pagination.current,
      // pageSize: pagination.pageSize,
      page: pagination.current - 1,
      size: 10,
      ...filters,
    }
    this.getCategoryData({ ...params });
  }

  handleViewTimesTableChange = (pagination, filtersArg, sorter) => {
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});
    const params = {
      // currentPage: pagination.current,
      // pageSize: pagination.pageSize,
      page: pagination.current - 1,
      size: 10,
      ...filters,
    }
    this.getViewTimesData({ ...params });
  }

  renderKeyIndicator = () => {
    const {indicatorProductData} = this.state;
    return (
      <div className={styles.indicator}>
        <div>
          <h3>上架商品</h3>
          <p>
            日
            <span className={styles.indicatorCount}>{indicatorProductData.onDayCount || '--'}</span>
          </p>
          <p>
            周
            <span className={styles.indicatorCount}>{indicatorProductData.onWeekCount || '--'}</span>
          </p>
          <p>
            月
            <span className={styles.indicatorCount}>{indicatorProductData.onMonthCount || '--'}</span>
          </p>
        </div>
        <Divider type="vertical" />
        <div>
          <h3>下架商品</h3>
          <p>
            日
            <span className={styles.indicatorCount}>{indicatorProductData.offDayCount || '--'}</span>
          </p>
          <p>
            周
            <span className={styles.indicatorCount}>{indicatorProductData.offWeekCount || '--'}</span>
          </p>
          <p>
            月
            <span className={styles.indicatorCount}>{indicatorProductData.offMonthCount || '--'}</span>
          </p>
        </div>
        <Divider type="vertical" />
        <div>
          <h3>新增商品</h3>
          <p>
            日
            <span className={styles.indicatorCount}>{indicatorProductData.createDayCount || '--'}</span>
          </p>
          <p>
            周
            <span className={styles.indicatorCount}>{indicatorProductData.createWeekCount || '--'}</span>
          </p>
          <p>
            月
            <span className={styles.indicatorCount}>{indicatorProductData.createMonthCount || '--'}</span>
          </p>
        </div>
        <Divider type="vertical" />
        <div>
          <h3>累计商品</h3>
          <div className={styles.indicatorTotal}>{indicatorProductData.total || '--'}</div>
        </div>
      </div>
    )
  }

  render() {
    const companyColumns = [
      { title: '企业名称', dataIndex: 'companyName', key: 'companyName' },
      { title: '商品数量', dataIndex: 'createTimes', key: 'createTimes', sorter: (a, b) => a.createTimes - b.createTimes, },
    ]
    const viewTimesColumns = [
      { title: '商品名称', dataIndex: 'productName', key: 'productName' },
      { title: '浏览次数', dataIndex: 'viewTimes', key: 'viewTimes', sorter: (a, b) => a.viewTimes - b.viewTimes, },
    ]
    const categoryColumns = [
      { title: '分类名称', dataIndex: 'categoryName', key: 'categoryName' },
      { title: '商品数量', dataIndex: 'createTimes', key: 'createTimes', sorter: (a, b) => a.createTimes - b.createTimes, },
    ]
    const {rangeValue,type,graphData,TimeRangeValue,tabActiveKey,categoryData,companyData,viewTimesData,categoryGraphData} = this.state;
    return (
      <PageHeaderWrapper bordered={false}>
        <Tabs defaultActiveKey={tabActiveKey}>
          <TabPane tab="商品增长" key="growth" onChange={this.handleTabChange}>
            <Card title="昨日关键指标">
              <Row gutter={16}>
                <Col span={24}>
                  {this.renderKeyIndicator()}
                </Col>
              </Row>
              <Row gutter={16}>
                <Radio.Group defaultValue={type} onChange={this.handleType} style={{margin:'40px 0'}}>
                  {
                    buttonConfig.map(i => <Radio.Button value={i.value} key={i.value}>{i.name}</Radio.Button>)
                  }
                </Radio.Group>
                <Col style={{ marginTop: 20 }}>
                  <Select value={rangeValue} style={{ width: 120 }} onChange={this.handleRangeChange} placeholder='请选择时间段'>
                    {
                      TimeRange.map(i => <Option key={i.value} value={i.value}>{i.desc}</Option>)
                    }
                  </Select>
                  <RangePicker
                    showTime
                    format="YYYY-MM-DD"
                    value={TimeRangeValue}
                    onChange={this.handleTimeRangeChange}
                  />
                  <Bar
                    dataSource={graphData}
                    type={type}
                  />
                </Col>
              </Row>
            </Card>
          </TabPane>
          <TabPane tab="商品属性" key="property">
            <Row gutter={16}>
              <Col span={24}>
                <Card title="类目分布">
                  <Pie
                    dataSource={categoryGraphData}
                    fieldNames={{value:'createTimes',name:'categoryName'}}
                  />
                  <Table
                    rowKey='token'
                    dataSource={categoryData.list}
                    columns={categoryColumns}
                    onChange={this.handleCategoryTableChange}
                  />
                </Card>
              </Col>
              <Col span={12}>
                <Card title="浏览分布">
                  <Table
                    rowKey='token'
                    dataSource={viewTimesData.list}
                    columns={viewTimesColumns}
                    onChange={this.handleViewTimesTableChange}
                  />
                </Card>
              </Col>
              <Col span={12}>
                <Card title="企业分布">
                  <Table
                    rowKey='token'
                    dataSource={companyData.list}
                    columns={companyColumns}
                    onChange={this.handleCompanyTableChange}
                  />
                </Card>
              </Col>
            </Row>
          </TabPane>
        </Tabs>
      </PageHeaderWrapper>
    )
  }
}


export default CommodityGrowth;
