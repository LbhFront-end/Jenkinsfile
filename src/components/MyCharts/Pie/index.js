import React from 'react'
import ReactEcharts from 'echarts-for-react'

const Pie = () => {
  const onChartReady = echart => {
    /* eslint-disable */
    // console.log('echart is ready', echart)
  }
  const onChartLegendselectchanged = (param, echart) => {
    // console.log(param, echart)
  }
  const onChartClick = (param, echart) => {
    // console.log(param, echart)
  }
  const getOtion = () => {
    const option = {
      title: {
        text: '分类分布',
        subtext: '纯属虚构',
        x: 'center',
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)',
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        data: ['分类1', '分类2', '分类3', '分类4', '分类5'],
      },
      series: [
        {
          name: '访问来源',
          type: 'pie',
          radius: '55%',
          center: ['50%', '60%'],
          data: [
            { value: 335, name: '分类1' },
            { value: 310, name: '分类2' },
            { value: 234, name: '分类3' },
            { value: 135, name: '分类4' },
            { value: 1548, name: '分类5' },
          ],
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    }
    return option
  }

  let onEvents = {
    click: onChartClick,
    legendselectchanged: onChartLegendselectchanged,
  }

  return (
    <div className="examples">
      <div className="parent">
        <ReactEcharts
          option={getOtion()}
          style={{ height: 300 }}
          onChartReady={onChartReady}
          onEvents={onEvents}
        />
      </div>
    </div>
  )
}

export default Pie
