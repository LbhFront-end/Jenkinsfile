import React, { Component } from 'react';
import { Card, Tabs, Divider, Table, Row, Col, Radio, Select, DatePicker } from 'antd';
import { Bar, WorldMapChart } from '@/components/MyCharts'
import { getIndicator, getGraph, getCountry, getAsk } from '@/services/enterprise/askAboutGrowth';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { TimeRange } from '@/utils/Enum';
import styles from './AskAboutGrowth.less';

const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');import { getCache } from '@/utils/cache';

const cache = getCache();
const { companyToken } = cache;

const { TabPane } = Tabs;
const { Option } = Select;
const { RangePicker } = DatePicker;

class AskAboutGrowth extends Component {
  state = {
    indicatorData: {},
    rangeValue: 'SEVEN',
    TimeRangeValue: undefined,
    graphData: [],
    countryTotalData: [],
    countryData: {},
    askData: {},
    type: 'createTimes',
    tabActiveKey: 'growth'
  }

  componentDidMount() {
    const { rangeValue } = this.state;
    this.getIndicatorData();
    this.getCountryData();
    this.getCountryTotalData({ size: 300 });
    this.getGraphData({ range: rangeValue, line: 'line' });
    this.getAskData();
  }

  getCountryData = (params) => {
    getCountry({ companyToken, ...params }).then(res => {
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

  getAskData = (params) => {
    getAsk({ companyToken, ...params }).then(res => {
      if (res && res.code === 0) {
        this.setState({
          askData: {
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
    getCountry({ companyToken, ...params }).then(res => {
      if (res && res.code === 0) {
        this.setState({ countryTotalData: res.elems })
      }
    })
  }

  getIndicatorData = (params) => {
    getIndicator({ companyToken, ...params }).then(res => {
      if (res && res.code === 0) {
        this.setState({ indicatorData: res.elem })
      }
    })
  }

  getGraphData = (params) => {
    const { type } = this.state;
    getGraph({ type, companyToken, ...params }).then(res => {
      if (res && res.code === 0) {
        this.setState({ graphData: res.elems })
      }
    })
  }

  handleTabChange = (value) => {
    this.setState({ tabActiveKey: value })
  }

  handleType = e => {
    const type = e.target.value;
    this.setState({ type, rangeValue: 'SEVEN', TimeRangeValue: undefined, })
    this.getGraphData({ type, line: 'line', range: 'SEVEN' });
  }

  handleCountryTableChange = (pagination, filtersArg, sorter) => {
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

  handleAskTableChange = (pagination, filtersArg, sorter) => {
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
    this.getAskData({ ...params });
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


  renderKeyIndicator = () => {
    const { indicatorData } = this.state;
    return (
      <div className={styles.indicator}>
        <div>
          <h3>新增询问</h3>
          <p>
            日
            <span className={styles.indicatorCount}>{indicatorData.createDayCount || '--'}</span>
          </p>
          <p>
            周
            <span className={styles.indicatorCount}>{indicatorData.createMonthCount || '--'}</span>
          </p>
          <p>
            月
            <span className={styles.indicatorCount}>{indicatorData.createWeekCount || '--'}</span>
          </p>
        </div>
        <Divider type="vertical" />
        <div>
          <h3>累计询问</h3>
          <div className={styles.indicatorTotal}>{indicatorData.total || '--'}</div>
        </div>
      </div>
    )
  }

  render() {
    const { rangeValue, TimeRangeValue, graphData, type, countryTotalData, tabActiveKey, countryData, askData } = this.state;
    const askColumns = [
      { title: '商品名', dataIndex: 'productName', key: 'productName' },
      { title: '询问次数', dataIndex: 'createTimes', key: 'createTimes', sorter: (a, b) => a.createTimes - b.createTimes, },
    ]
    const countryColumns = [
      { title: '国家', dataIndex: 'country', key: 'country' },
      { title: '询问数', dataIndex: 'createTimes', key: 'createTimes', sorter: (a, b) => a.createTimes - b.createTimes, },
    ]
    const buttonConfig = [{ name: '新增询问', value: 'createTimes' }, { name: '累计询问', value: 'total' }]
    return (
      <PageHeaderWrapper bordered={false}>
        <Tabs defaultActiveKey={tabActiveKey} onChange={this.handleTabChange}>
          <TabPane tab="询问增长" key="growth">
            <Card title="昨日关键指标">
              <Row gutter={16}>
                <Col span={24}>
                  {this.renderKeyIndicator()}
                </Col>
              </Row>
              <Row gutter={16}>
                <Col>
                  <Radio.Group defaultValue={type} onChange={this.handleType}>
                    {
                      buttonConfig.map(i => <Radio.Button value={i.value} key={i.value}>{i.name}</Radio.Button>)
                    }
                  </Radio.Group>
                </Col>
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
                    rowKey='token'
                    dataSource={countryData.list}
                    columns={countryColumns}
                    onChange={this.handleCountryTableChange}
                  />
                </Col>
              </Row>
            </Card>
            <Row>
              <Col span={24}>
                <Card title="商品分布">
                  <Table
                    rowKey='token'
                    dataSource={askData.list}
                    columns={askColumns}
                    onChange={this.handleAskTableChange}
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

