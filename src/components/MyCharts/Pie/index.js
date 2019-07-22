import React,{Component} from 'react'
import ReactEcharts from 'echarts-for-react'

class Pie extends Component{
  constructor(props){
    super(props)
  }

  //   const onChartReady = echart => {
  //   /* eslint-disable */
  //   console.log('echart is ready', echart)
  // }
  // const onChartLegendselectchanged = (param, echart) => {
  //   console.log(param, echart)
  // }
  // const onChartClick = (param, echart) => {
  //   console.log(param, echart)
  // }

  getOption = ()=>{
    const {dataSource,fieldNames} = this.props;
    const data = [];
    dataSource.forEach(i=>{
      data.push({value:i[fieldNames.value],name:i[fieldNames.name]})
    })
    const option = {
      title: {
        text: '商品分类分布',
        subtext: '截止今日',
        x: 'center',
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)',
      },
      // legend: {
      //   orient: 'vertical',
      //   left: 'left',
      //   data: ['分类1', '分类2', '分类3', '分类4', '分类5'],
      // },
      series: [
        {
          name: '商品分类',
          type: 'pie',
          radius: '55%',
          center: ['50%', '60%'],
          data,
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


  render(){
    // let onEvents = {
    //   click: onChartClick,
    //   legendselectchanged: onChartLegendselectchanged,
    // }

    return(
      <div className="Pie">
        <div className="parent">
          <ReactEcharts
            option={this.getOption()}
            style={{ height: 300 }}
            // onChartReady={onChartReady}
            // onEvents={onEvents}
          />
        </div>
      </div>
    )
  }
}

export default Pie
