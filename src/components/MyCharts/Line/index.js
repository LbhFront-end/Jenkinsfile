import React from 'react'
import ReactEcharts from 'echarts-for-react'

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
const Line = (props) => {
  const {key,config,data} = props;
  const option = {
    color:colorPalette,
    title: {
      // text: '',
    },
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      // data: ['邮件营销', '联盟广告', '视频广告'],
    },
    // toolbox: {
    //   lineStyle: {
    //     color: '#008acd',
    //   },
    // },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      },
    ],
    yAxis: [
      {
        type: 'value',
      },
    ],
    series: [
      {
        name: '用户量',
        type: 'line',
        stack: '总量',
        // areaStyle: { normal: {} },
        data: [120, 132, 101, 134, 90, 230, 210],
      }
    ],
  }
  return (
    <div className="examples">
      <div className="parent">
        <ReactEcharts
          option={option}
          style={{ height: '350px', width: '100%' }}
          className="react_for_echarts"
        />
      </div>
    </div>
  )
}

export default Line
