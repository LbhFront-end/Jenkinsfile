import React, { Component } from 'react';
import { Card, Tabs, Divider, Table, Row, Col, Radio, Select, DatePicker } from 'antd';
import { Bar, Pie, WorldMapChart } from '@/components/MyCharts';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { getIndicatorAsk, getGraph, getCategory, getCompany, getCountry, getProduct } from '@/services/admin/askAboutGrowth';
import { TimeRange } from '@/utils/Enum';
import styles from './AskAboutGrowth.less';

const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

const { TabPane } = Tabs;
const { Option } = Select;
const { RangePicker } = DatePicker;
const buttonConfig = [{ name: '新增询问', value: 'createTimes' }, { name: '累计询问', value: 'total' }]

class AskAboutGrowth extends Component {
  state = {
    rangeValue: 'SEVEN',
    TimeRangeValue: undefined,
    indicatorAskData: {},
    type: 'createTimes',
    graphData: {},
    tabActiveKey: 'growth',
    categoryGraphData: [],
    countryTotalData: [],
    categoryData: {},
    companyData: {},
    countryData: {},
    productData: {},
  }

  componentDidMount() {
    const { rangeValue } = this.state;
    this.getIndicatorAskData();
    this.getGraphData({ range: rangeValue, line: 'line' });
    this.getCategoryGraphData();
    this.getCategoryData();
    this.getCountryData();
    this.getCountryTotalData();
    this.getCompanyData();
    this.getProductData();
  }

  getIndicatorAskData = () => {
    getIndicatorAsk().then(res => {
      if (res && res.code === 0) {
        this.setState({ indicatorAskData: res.elem })
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

  getProductData = (params) => {
    getProduct({ ...params }).then(res => {
      if (res && res.code === 0) {
        this.setState({
          productData: {
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

  getCountryTotalData = (params) => {
    getCountry({ ...params }).then(res => {
      if (res && res.code === 0) {
        this.setState({ countryTotalData: res.elems })
      }
    })
  }

  getCountryData = (params) => {
    getCountry({ ...params }).then(res => {
      if (res && res.code === 0) {
        this.setState({
          countryData: {
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

  getCategoryGraphData = (params) => {
    getCategory({ ...params }).then(res => {
      if (res && res.code === 0) {
        this.setState({ categoryGraphData: res.elems })
      }
    })
  }

  getCategoryData = (params) => {
    getCategory({ ...params }).then(res => {
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

  getCompanyData = (params) => {
    getCompany({ ...params }).then(res => {
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

  handleType = e => {
    const type = e.target.value;
    this.setState({ type, rangeValue: 'SEVEN', TimeRangeValue: undefined, })
    this.getGraphData({ type, line: 'line', range: 'SEVEN' });
  }

  handleTabChange = (value) => {
    this.setState({ tabActiveKey: value })
  }

  handleRangeChange = value => {
    this.setState({ rangeValue: value })
    this.getGraphData({ range: value, line: 'line' })
  }

  handleTimeRangeChange = value => {
    this.setState({ TimeRangeValue: value })
    let dateU;
    let dateL;
    if (value.length > 1) {
      dateL = value[0].format('YYYY-MM-DD HH:mm:ss.SSS');
      dateU = value[1].format('YYYY-MM-DD HH:mm:ss.SSS');
    }
    if (dateU && dateL) {
      this.getGraphData({ dateU, dateL, line: 'line2' })
    }
  }

  handleCountryChange = (pagination, filtersArg, sorter) => {
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
    this.getCountryData({ ...params });
  }

  handleProductTableChange = (pagination, filtersArg, sorter) => {
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
    this.getProductData({ ...params });
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


  renderKeyIndicator = () => {
    const { indicatorAskData } = this.state;
    return (
      <div className={styles.indicator}>
        <div>
          <h3>新增询问</h3>
          <p>
            日
            <span className={styles.indicatorCount}>{indicatorAskData.createDayCount || '--'}</span>
          </p>
          <p>
            周
            <span className={styles.indicatorCount}>{indicatorAskData.createWeekCount || '--'}</span>
          </p>
          <p>
            月
            <span className={styles.indicatorCount}>{indicatorAskData.createMonthCount || '--'}</span>
          </p>
        </div>
        <Divider type="vertical" />
        <div>
          <h3>累计询问</h3>
          <div className={styles.indicatorTotal}>{indicatorAskData.total || '--'}</div>
        </div>
      </div>
    )
  }

  render() {
    const { tabActiveKey, type, TimeRangeValue, countryTotalData, graphData, rangeValue, categoryGraphData, categoryData, countryData, companyData, productData } = this.state;
    const productColumns = [
      { title: '商品名称', dataIndex: 'productName', key: 'productName' },
      { title: '询问数量', dataIndex: 'createTimes', key: 'createTimes', sorter: (a, b) => a.pageview - b.pageview, },
    ]
    const countryColumns = [
      { title: '国家', dataIndex: 'country', key: 'country' },
      { title: '询问数量', dataIndex: 'createTimes', key: 'createTimes', sorter: (a, b) => a.createTimes - b.createTimes, },
    ]
    const categoryColumns = [
      { title: '分类名称', dataIndex: 'categoryName', key: 'categoryName' },
      { title: '询问数量', dataIndex: 'createTimes', key: 'createTimes', sorter: (a, b) => a.createTimes - b.createTimes, },
    ]
    const companyColumns = [
      { title: '企业名称', dataIndex: 'companyName', key: 'companyName' },
      { title: '询问数量', dataIndex: 'createTimes', key: 'createTimes', sorter: (a, b) => a.createTimes - b.createTimes, },
    ]
    return (
      <PageHeaderWrapper bordered={false}>
        <Tabs defaultActiveKey={tabActiveKey}>
          <TabPane tab="询问增长" key="growth" onChange={this.handleTabChange}>
            <Card title="昨日关键指标">
              <Row gutter={16}>
                <Col span={24}>
                  {this.renderKeyIndicator()}
                </Col>
              </Row>
              <Row gutter={16}>
                <Radio.Group defaultValue={type} onChange={this.handleType} style={{ margin: '40px 0' }}>
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
          <TabPane tab="询问属性" key="property">
            <Card title="国家分布">
              <Row gutter={16}>
                <Col span={24}>
                  <WorldMapChart
                    dataSource={countryTotalData}
                    fieldNames={{ value: 'createTimes', name: 'country' }}
                  />
                </Col>
                <Col span={24}>
                  <Table
                    rowKey='country'
                    dataSource={countryData.list}
                    columns={countryColumns}
                    onChange={this.handleCountryChange}
                  />
                </Col>
              </Row>
            </Card>
            <Row>
              <Col span={24}>
                <Card title="类目分布">
                  <Pie
                    dataSource={categoryGraphData}
                    fieldNames={{ value: 'createTimes', name: 'categoryName' }}
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
                <Card title="商品分布">
                  <Table
                    rowKey='token'
                    dataSource={productData.list}
                    columns={productColumns}
                    onChange={this.handleProductTableChange}
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


export default AskAboutGrowth;

