import React from 'react'
import ReactEcharts from 'echarts-for-react'

require('echarts/map/js/china.js')

class ChinaMapChart extends React.Component {
  constructor() {
    super()
    this.timeTicket = null
    // const randomData = () => Math.round(Math.random() * 1000)

    const option = {
      title: {
        text: '用户数',
        subtext: '截止今天',
        left: 'center',
      },
      tooltip: {
        trigger: 'item',
      },
      geo: {
        map: 'china',
        label: {
          emphasis: {
            show: false
          }
        },
        roam: false,
        silent: true,
        itemStyle: {
          normal: {
            areaColor: '#37376e',
            borderColor: '#000'
          },
          emphasis: {
            areaColor: '#2a333d'
          }
        }
      },
      visualMap: {
        min: 0,
        max: 30,
        left: 'left',
        top: 'bottom',
        text: ['高', '低'], // 文本，默认为数值文本
        calculable: true,
      },
      toolbox: {
        show: false,
        orient: 'vertical',
        left: 'right',
        top: 'center',
        feature: {
          dataView: { readOnly: false },
          restore: {},
          saveAsImage: {},
        },
      },
      series: [
        {
          name:'用户数',
          type: 'map',
          mapType: 'china',
          roam: false,
          label: {
            normal: {
              show: false,
            },
            emphasis: {
              show: false,
            },
          },
          data: [
            {
              "value": "11",
              "name": "北京"
            },
            {
              "value": "12",
              "name": "天津"
            },
            {
              "value": "13",
              "name": "河北"
            },
            {
              "value": "14",
              "name": "山西"
            },
            {
              "value": "15",
              "name": "内蒙古"
            },
            {
              "value": "21",
              "name": "辽宁"
            },
            {
              "value": "22",
              "name": "吉林"
            },
            {
              "value": "23",
              "name": "黑龙江"
            },
            {
              "value": "31",
              "name": "上海"
            },
            {
              "value": "32",
              "name": "江苏"
            },
            {
              "value": "33",
              "name": "浙江"
            },
            {
              "value": "34",
              "name": "安徽"
            },
            {
              "value": "35",
              "name": "福建"
            },
            {
              "value": "36",
              "name": "江西"
            },
            {
              "value": "37",
              "name": "山东"
            },
            {
              "value": "41",
              "name": "河南"
            },
            {
              "value": "42",
              "name": "湖北"
            },
            {
              "value": "43",
              "name": "湖南"
            },
            {
              "value": "44",
              "name": "广东"
            },
            {
              "value": "45",
              "name": "广西"
            },
            {
              "value": "46",
              "name": "海南"
            },
            {
              "value": "50",
              "name": "重庆"
            },
            {
              "value": "51",
              "name": "四川"
            },
            {
              "value": "52",
              "name": "贵州"
            },
            {
              "value": "53",
              "name": "云南"
            },
            {
              "value": "54",
              "name": "西藏"
            },
            {
              "value": "61",
              "name": "陕西"
            },
            {
              "value": "62",
              "name": "甘肃"
            },
            {
              "value": "63",
              "name": "青海"
            },
            {
              "value": "64",
              "name": "宁夏"
            },
            {
              "value": "65",
              "name": "新疆"
            },
            {
              "value": "66",
              "name": "台湾"
            }
          ],
        },
      ],
    }
    this.state = {
      option,
    }
  }

  componentDidMount() {
    if (this.timeTicket) {
      clearInterval(this.timeTicket)
    }
    this.timeTicket = setInterval(() => {
      const { option } = this.state
      this.setState({ option })
    }, 1000)
  }

  componentWillUnmount() {
    if (this.timeTicket) {
      clearInterval(this.timeTicket)
    }
  }

  render() {
    const {option}=this.state;
    return (
      <div className="examples">
        <div className="parent">
          <ReactEcharts
            option={option}
            style={{ height: '800px', width: '100%' }}
            className="react_for_echarts"
          />
        </div>
      </div>
    )
  }
}

export default ChinaMapChart
