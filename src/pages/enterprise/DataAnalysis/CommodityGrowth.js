import React, { Component } from 'react';
import { Card, Tabs, Table, Row, Col } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { getViewTimes } from '@/services/enterprise/commodityGrowth';


const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');import { getCache } from '@/utils/cache';

const cache = getCache();
const { companyToken } = cache;

const { TabPane } = Tabs;

class CommodityGrowth extends Component {
  state = {
    viewTimesData: {},
  }

  componentDidMount() {
    this.getViewTimesData();
  }

  getViewTimesData = (params) => {
    getViewTimes({ companyToken, ...params }).then(res => {
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


  handleViewTimeTableChange = (pagination, filtersArg, sorter) => {
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

  render() {
    const { viewTimesData } = this.state;
    const viewTimesColumns = [
      { title: '商品名', dataIndex: 'productName', key: 'productName' },
      { title: '浏览次数', dataIndex: 'viewTimes', key: 'viewTimes', sorter: (a, b) => a.viewTimes - b.viewTimes, },
    ]
    return (
      <PageHeaderWrapper bordered={false}>
        <Tabs>
          <TabPane tab="商品属性" key="property">
            <Row gutter={16}>
              <Col span={24}>
                <Card title="浏览分布">
                  <Table
                    rowKey='token'
                    dataSource={viewTimesData.list}
                    columns={viewTimesColumns}
                    onChange={this.handleViewTimeTableChange}
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
