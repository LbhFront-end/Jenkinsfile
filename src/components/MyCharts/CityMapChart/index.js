/* eslint-disable global-require */
import React from 'react'
import ReactEcharts from 'echarts-for-react'

class CityMapChart extends React.Component {
  constructor() {
    super()
    this.timeTicket = null
    // const randomData = () => Math.round(Math.random() * 1000)
    // this.state = {
    //   option,
    // }
  }

  componentDidMount() {
    const {url} = this.props;
    require(`echarts/map/js/province/${url}.js`)
    // if (this.timeTicket) {
    //   clearInterval(this.timeTicket)
    // }
    // this.timeTicket = setInterval(() => {
    //   const { option } = this.state
    //   this.setState({ option })
    // }, 1000)
  }

  componentWillReceiveProps(nextProps){
    const {url} = nextProps;
    require(`echarts/map/js/province/${url}.js`)
  }

  componentWillUnmount() {
    if (this.timeTicket) {
      clearInterval(this.timeTicket)
    }
  }

  render() {
    const {map,url} = this.props;
    const option = {
      title: {
        text: `${map}用户数`,
        subtext: '截止今天',
        left: 'center',
      },
      tooltip: {
        trigger: 'item',
      },
      geo: {
        map,
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
          name:`${map}用户数`,
          type: 'map',
          mapType: map,
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
              "name": "揭阳市"
            },
            {
              "value": "12",
              "name": "佛山市"
            },
          ],
        },
      ],
    }
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

export default CityMapChart
