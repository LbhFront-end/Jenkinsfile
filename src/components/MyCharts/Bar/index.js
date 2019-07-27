import React, { Component } from 'react'
import ReactEcharts from 'echarts-for-react'
import { formatTime } from '@/utils/enterprise/commonFunction'
// require('./theme/macarons.js')
const colorPalette = [
  '#008acd',
  '#b6a2de',
  '#5ab1ef',
  '#ffb980',
  '#d87a80',
  '#8d98b3',
  '#e5cf0d',
  '#97b552',
  '#95706d',
  '#dc69aa',
  '#07a2a4',
  '#9a7fd1',
  '#588dd5',
  '#f5994e',
  '#c05050',
  '#59678c',
  '#c9ab00',
  '#7eb00a',
  '#6f5553',
  '#c14089',
]
class Bar extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }


  getOption = () => {
    const { dataSource, type } = this.props;
    const date = [];
    const count = [];
    if (dataSource.length > 0) {
      dataSource.forEach(i => {
        date.push(formatTime(i.date));
        count.push(i[type]);
      })
    }
    const option = {
      color: colorPalette,
      title: {
        // text: '询问表',
      },
      tooltip: {
        trigger: 'axis',
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: [{
        type: 'category',
        data: date,
        axisLabel: {
          // formatter: '{value} 次',
        }
      }],
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: '{value} 次',
        }
      },
      series: [{
        type: 'bar',
        data: count,
      }],
    }
    return option;
  }

  render() {
    return (
      <div className="bar">
        <div className="parent">
          <ReactEcharts
            option={this.getOption()}
            style={{ height: '350px', width: '100%' }}
            className="react_for_echarts"
          />
        </div>
      </div>
    )
  }
}

export default Bar
