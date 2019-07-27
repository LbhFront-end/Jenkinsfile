/* eslint-disable react/no-danger */
import React, { Component } from 'react';
import { Bar, ChinaMapChart, CityMapChart } from '@/components/MyCharts';
import { Card, Tabs, Divider, Table, Row, Col, Radio, Select, DatePicker } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { getIndicatorCompany, getGraph, getCity, getProvince, getSource } from '@/services/admin/userGrowth';
import { MockSelect, TimeRange } from '@/utils/Enum';
import { formatSource } from '@/utils/admin/commonFunction';
import styles from './UserGrowth.less';

const { province } = MockSelect;
const { TabPane } = Tabs;
const { Option } = Select;
const { RangePicker } = DatePicker;

const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');



const buttonConfig = [
  { name: '新增用户', value: 'createTimes' },
  { name: '上线用户', value: 'onlineTimes' },
  { name: '累计用户', value: 'total' }
]

class UserGrowth extends Component {
  state = {
    rangeValue: 'SEVEN',
    indicatorCompanyData: {},
    TimeRangeValue: undefined,
    type: 'createTimes',
    graphData: {},
    sourceData: {},
    cityData: {},
    totalCityData: [],
    provinceData: {},
    totalProvinceData: [],
    tabActiveKey: 'property',
    cityUrl: 'guangdong',
    cityMap: '广东'
  }

  componentDidMount() {
    const { rangeValue } = this.state;
    this.getIndicatorCompanyData();
    this.getGraphData({ range: rangeValue, line: 'line' });
    this.getCityData();
    this.getTotalCityData();
    this.getTotalProvinceData();
    this.getSourceData();
    this.getProvinceData();
  }

  getIndicatorCompanyData = () => {
    getIndicatorCompany().then(res => {
      if (res && res.code === 0) {
        this.setState({ indicatorCompanyData: res.elem })
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

  getTotalProvinceData = (params) => {
    getProvince({ ...params, size: 300 }).then(res => {
      if (res && res.code === 0) {
        this.setState({
          totalProvinceData: res.elems,
        })
      }
    })
  }

  getCityData = (params) => {
    getCity({ ...params }).then(res => {
      if (res && res.code === 0) {
        this.setState({
          cityData: {
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

  getTotalCityData = (params) => {
    getCity({ ...params, size: 999 }).then(res => {
      if (res && res.code === 0) {
        this.setState({
          totalCityData: res.elems,
        })
      }
    })
  }

  getSourceData = (params) => {
    getSource({ ...params }).then(res => {
      if (res && res.code === 0) {
        this.setState({
          sourceData: {
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

  getProvinceData = (params) => {
    getProvince({ ...params }).then(res => {
      if (res && res.code === 0) {
        this.setState({
          provinceData: {
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

  onCityChange = value => {
    this.setState({ cityMap: value })
    this.getCityUrl(value)
  }

  getCityUrl = map => {
    province.forEach(i => {
      if (i.map === map) {
        this.setCityUrl(i.url);
      }
      return null;
    })
  }

  setCityUrl = url => {
    this.setState({ cityUrl: url })
  }


  handleSourceChange = (pagination, filtersArg, sorter) => {
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
    this.getSourceData({ ...params });
  }

  handleCityChange = (pagination, filtersArg, sorter) => {
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
    this.getCityData({ ...params });
  }

  handleProvinceChange = (pagination, filtersArg, sorter) => {
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
    this.getProvinceData({ ...params });
  }

  renderKeyIndicator = () => {
    const { indicatorCompanyData } = this.state;
    return (
      <div className={styles.indicator}>
        <div>
          <h3>新增用户</h3>
          <p>
            日
            <span className={styles.indicatorCount}>{indicatorCompanyData.createDayCount || '--'}</span>
          </p>
          <p>
            周
            <span className={styles.indicatorCount}>{indicatorCompanyData.createWeekCount || '--'}</span>
          </p>
          <p>
            月
            <span className={styles.indicatorCount}>{indicatorCompanyData.createMonthCount || '--'}</span>
          </p>
        </div>
        <Divider type="vertical" />
        <div>
          <h3>上线用户</h3>
          <p>
            日
            <span className={styles.indicatorCount}>{indicatorCompanyData.onlineDayCount || '--'}</span>
          </p>
          <p>
            周
            <span className={styles.indicatorCount}>{indicatorCompanyData.onlineWeekCount || '--'}</span>
          </p>
          <p>
            月
            <span className={styles.indicatorCount}>{indicatorCompanyData.onlineMonthCount || '--'}</span>
          </p>
        </div>
        <Divider type="vertical" />
        <div>
          <h3>累计用户</h3>
          <div className={styles.indicatorTotal}>{indicatorCompanyData.total || '--'}</div>
        </div>
      </div>
    )
  }

  render() {
    const { cityUrl, cityMap, type, tabActiveKey, graphData, TimeRangeValue, rangeValue, provinceData, cityData, sourceData, totalProvinceData, totalCityData } = this.state;
    console.log(totalCityData)
    const cityColumns = [
      { title: '城市名称', dataIndex: 'cityName', key: 'cityName' },
      { title: '统计数量', dataIndex: 'count', key: 'count', sorter: (a, b) => a.count - b.count, },
    ]
    const sourceColumns = [
      { title: '引流源', dataIndex: 'source', key: 'source' },
      { title: '统计数量', dataIndex: 'count', key: 'count', sorter: (a, b) => a.count - b.count, },
    ]
    const provinceColumns = [
      { title: '省份名称', dataIndex: 'provinceName', key: 'provinceName' },
      { title: '统计数量', dataIndex: 'count', key: 'count', sorter: (a, b) => a.count - b.count, },
    ]
    return (
      <PageHeaderWrapper bordered={false}>
        <Tabs defaultActiveKey={tabActiveKey}>
          <TabPane tab="用户增长" key="growth" onChange={this.handleTabChange}>
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
          <TabPane tab="用户属性" key="property">
            <Row gutter={16}>
              <Card title="省份分布">
                <Col span={12}>
                  <ChinaMapChart
                    dataSource={totalProvinceData}
                    fieldNames={{ value: 'count', name: 'provinceName' }}
                  />
                </Col>
                <Col span={12}>
                  <Table
                    rowKey='provinceName'
                    dataSource={provinceData.list}
                    columns={provinceColumns}
                    onChange={this.handleProvinceChange}
                  />
                </Col>
              </Card>
              <Card title="城市分布">
                <Col span={12}>
                  <Select style={{ width: 120 }} onChange={this.onCityChange} defaultValue={cityMap}>
                    {
                      province.map(i => <Option value={i.map} key={i.url}>{i.map}</Option>)
                    }
                  </Select>
                  <CityMapChart
                    dataSource={totalCityData}
                    fieldNames={{ value: 'count', name: 'cityName' }}
                    map={cityMap}
                    url={cityUrl}
                  />
                </Col>
                <Col span={12}>
                  <Table
                    rowKey='cityName'
                    dataSource={cityData.list}
                    columns={cityColumns}
                    onChange={this.handleCityChange}
                  />
                </Col>
              </Card>
              <Col span={24}>
                <Card title="引流分布">
                  <Table
                    rowKey='source'
                    dataSource={formatSource(sourceData.list)}
                    columns={sourceColumns}
                    onChange={this.handleSourceChange}
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


export default UserGrowth;
