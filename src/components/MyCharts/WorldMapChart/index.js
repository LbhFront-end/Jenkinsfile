import React from 'react'
import ReactEcharts from 'echarts-for-react'

require('echarts/map/js/world.js')

class WorldMapChart extends React.Component {
  constructor(props) {
    super(props)
    this.timeTicket = null
    // const randomData = () => Math.round(Math.random() * 1000)
  }



  // componentDidMount() {
  //   if (this.timeTicket) {
  //     clearInterval(this.timeTicket)
  //   }
  //   this.timeTicket = setInterval(() => {
  //     const { option } = this.state
  //     this.setState({ option })
  //   }, 1000)
  // }

  // componentWillUnmount() {
  //   if (this.timeTicket) {
  //     clearInterval(this.timeTicket)
  //   }
  // }

  getOption = ()=>{
    const {dataSource,fieldNames} = this.props;
    const data = [];
    dataSource.forEach(i=>{
      data.push({value:i[fieldNames.value],name:i[fieldNames.name]})
    })
    const option = {
      title: {
        text: '询问数',
        subtext: '截止今天',
        left: 'center',
      },
      tooltip: {
        trigger: 'item',
      },
      geo: {
        map: 'world',
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
        max: 100,
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
          name:'询问数',
          type: 'map',
          mapType: 'world',
          roam: false,
          label: {
            normal: {
              show: false,
            },
            emphasis: {
              show: false,
            },
          },
          data,
          nameMap: {
            "Hong Kong": "中国香港",
            "Taiwan": "中国台湾",
            "Macao": "中国澳门",
            "United States": "美国",
            "Argentina": "阿根廷",
            "Andorra": "安道尔",
            "United Arab Emirates": "阿联酋",
            "Afghanistan": "阿富汗",
            "Antigua & Barbuda": "安提瓜和巴布达",
            "Anguilla": "安圭拉",
            "Albania": "阿尔巴尼亚",
            "Armenia": "亚美尼亚",
            "Angola": "安哥拉",
            "Antarctica": "南极洲",
            "American Samoa": "美属萨摩亚",
            "Austria": "奥地利",
            "Australia": "澳大利亚",
            "Aruba": "阿鲁巴",
            "Aland Island": "奥兰群岛",
            "Azerbaijan": "阿塞拜疆",
            "Bosnia & Herzegovina": "波黑",
            "Barbados": "巴巴多斯",
            "Bangladesh": "孟加拉",
            "Belgium": "比利时",
            "Burkina": "布基纳法索",
            "Bulgaria": "保加利亚",
            "Bahrain": "巴林",
            "Burundi": "布隆迪",
            "Benin": "贝宁",
            "Saint Barthélemy": "圣巴泰勒米岛",
            "Bermuda": "百慕大",
            "Brunei": "文莱",
            "Bolivia": "玻利维亚",
            "Caribbean Netherlands": "荷兰加勒比区",
            "Brazil": "巴西",
            "The Bahamas": "巴哈马",
            "Bhutan": "不丹",
            "Bouvet Island": "布韦岛",
            "Botswana": "博茨瓦纳",
            "Belarus": "白俄罗斯",
            "Belize": "伯利兹",
            "Canada": "加拿大",
            "Cocos (Keeling) Islands": "科科斯群岛",
            "Democratic Republic of the Congo": "刚果（金）",
            "Central African Republic": "中非",
            "Republic of the Congo": "刚果（布）",
            "Switzerland": "瑞士",
            "Cote d'Ivoire": "科特迪瓦",
            "Cook Islands": "库克群岛",
            "Chile": "智利",
            "Cameroon": "喀麦隆",
            "China": "中国",
            "Colombia": "哥伦比亚",
            "Costa Rica": "哥斯达黎加",
            "Cuba": "古巴",
            "Cape Verde": "佛得角",
            "Curacao": "库拉索",
            "Christmas Island": "圣诞岛",
            "Cyprus": "塞浦路斯",
            "Czech Republic": "捷克",
            "Germany": "德国",
            "Djibouti": "吉布提",
            "Denmark": "丹麦",
            "Dominica": "多米尼克",
            "Dominican Republic": "多米尼加",
            "Algeria": "阿尔及利亚",
            "Ecuador": "厄瓜多尔",
            "Estonia": "爱沙尼亚",
            "Egypt": "埃及",
            "Western Sahara": "西撒哈拉",
            "Eritrea": "厄立特里亚",
            "Spain": "西班牙",
            "Ethiopia": "埃塞俄比亚",
            "Finland": "芬兰",
            "Fiji": "斐济群岛",
            "Falkland Islands": "马尔维纳斯群岛（福克兰）",
            "Federated States of Micronesia": "密克罗尼西亚联邦",
            "Faroe Islands": "法罗群岛",
            "France": "法国 法国",
            "Gabon": "加蓬",
            "Great Britain (United Kingdom; England)": "英国",
            "Grenada": "格林纳达",
            "Georgia": "格鲁吉亚",
            "French Guiana": "法属圭亚那",
            "Guernsey": "根西岛",
            "Ghana": "加纳",
            "Gibraltar": "直布罗陀",
            "Greenland": "格陵兰",
            "Gambia": "冈比亚",
            "Guinea": "几内亚",
            "Guadeloupe": "瓜德罗普",
            "Equatorial Guinea": "赤道几内亚",
            "Greece": "希腊",
            "South Georgia and the South Sandwich Islands": "南乔治亚岛和南桑威奇群岛",
            "Guatemala": "危地马拉",
            "Guam": "关岛",
            "Guinea-Bissau": "几内亚比绍",
            "Guyana": "圭亚那",
            "Heard Island and McDonald Islands": "赫德岛和麦克唐纳群岛",
            "Honduras": "洪都拉斯",
            "Croatia": "克罗地亚",
            "Haiti": "海地",
            "Hungary": "匈牙利",
            "Indonesia": "印尼",
            "Ireland": "爱尔兰",
            "Israel": "以色列",
            "Isle of Man": "马恩岛",
            "India": "印度",
            "British Indian Ocean Territory": "英属印度洋领地",
            "Iraq": "伊拉克",
            "Iran": "伊朗",
            "Iceland": "冰岛",
            "Italy": "意大利",
            "Jersey": "泽西岛",
            "Jamaica": "牙买加",
            "Jordan": "约旦",
            "Japan": "日本",
            "Kenya": "肯尼亚",
            "Kyrgyzstan": "吉尔吉斯斯坦",
            "Cambodia": "柬埔寨",
            "Kiribati": "基里巴斯",
            "The Comoros": "科摩罗",
            "St. Kitts & Nevis": "圣基茨和尼维斯",
            "Dem.Rep.Korea": "朝鲜",
            "Korea": "韩国",
            "Kuwait": "科威特",
            "Cayman Islands": "开曼群岛",
            "Kazakhstan": "哈萨克斯坦",
            "Laos": "老挝",
            "Lebanon": "黎巴嫩",
            "St. Lucia": "圣卢西亚",
            "Liechtenstein": "列支敦士登",
            "Sri Lanka": "斯里兰卡",
            "Liberia": "利比里亚",
            "Lesotho": "莱索托",
            "Lithuania": "立陶宛",
            "Luxembourg": "卢森堡",
            "Latvia": "拉脱维亚",
            "Libya": "利比亚",
            "Morocco": "摩洛哥",
            "Monaco": "摩纳哥",
            "Moldova": "摩尔多瓦",
            "Montenegro": "黑山",
            "Saint Martin (France)": "法属圣马丁",
            "Madagascar": "马达加斯加",
            "Marshall islands": "马绍尔群岛",
            "Republic of Macedonia (FYROM)": "马其顿",
            "Mali": "马里",
            "Myanmar (Burma)": "缅甸",
            "Mongolia": "蒙古国",
            "Northern Mariana Islands": "北马里亚纳群岛",
            "Martinique": "马提尼克",
            "Mauritania": "毛里塔尼亚",
            "Montserrat": "蒙塞拉特岛",
            "Malta": "马耳他",
            "Mauritius": "毛里求斯",
            "Maldives": "马尔代夫",
            "Malawi": "马拉维",
            "Mexico": "墨西哥",
            "Malaysia": "马来西亚",
            "Mozambique": "莫桑比克",
            "Namibia": "纳米比亚",
            "New Caledonia": "新喀里多尼亚",
            "Niger": "尼日尔",
            "Norfolk Island": "诺福克岛",
            "Nigeria": "尼日利亚",
            "Nicaragua": "尼加拉瓜",
            "Netherlands": "荷兰",
            "Norway": "挪威",
            "Nepal": "尼泊尔",
            "Nauru": "瑙鲁",
            "Niue": "纽埃",
            "New Zealand": "新西兰",
            "Oman": "阿曼",
            "Panama": "巴拿马",
            "Peru": "秘鲁",
            "French polynesia": "法属波利尼西亚",
            "Papua New Guinea": "巴布亚新几内亚",
            "The Philippines": "菲律宾",
            "Pakistan": "巴基斯坦",
            "Poland": "波兰",
            "Saint-Pierre and Miquelon": "圣皮埃尔和密克隆",
            "Pitcairn Islands": "皮特凯恩群岛",
            "Puerto Rico": "波多黎各",
            "Palestinian territories": "巴勒斯坦",
            "Portugal": "葡萄牙",
            "Palau": "帕劳",
            "Paraguay": "巴拉圭",
            "Qatar": "卡塔尔",
            "Réunion": "留尼汪",
            "Romania": "罗马尼亚",
            "Serbia": "塞尔维亚",
            "Russian Federation": "俄罗斯",
            "Rwanda": "卢旺达",
            "Saudi Arabia": "沙特阿拉伯",
            "Solomon Islands": "所罗门群岛",
            "Seychelles": "塞舌尔",
            "Sudan": "苏丹",
            "Sweden": "瑞典",
            "Singapore": "新加坡",
            "St. Helena & Dependencies": "圣赫勒拿",
            "Slovenia": "斯洛文尼亚",
            "Svalbard and Jan Mayen": "斯瓦尔巴群岛和扬马延岛",
            "Slovakia": "斯洛伐克",
            "Sierra Leone": "塞拉利昂",
            "San Marino": "圣马力诺",
            "Senegal": "塞内加尔",
            "Somalia": "索马里",
            "Suriname": "苏里南",
            "South Sudan": "南苏丹",
            "Sao Tome & Principe": "圣多美和普林西比",
            "El Salvador": "萨尔瓦多",
            "Sint Maarten": "荷属圣马丁",
            "Syria": "叙利亚",
            "Swaziland": "斯威士兰",
            "Turks & Caicos Islands": "特克斯和凯科斯群岛",
            "Chad": "乍得",
            "French Southern Territories": "法属南部领地",
            "Togo": "多哥",
            "Thailand": "泰国",
            "Tajikistan": "塔吉克斯坦",
            "Tokelau": "托克劳",
            "Timor-Leste (East Timor)": "东帝汶",
            "Turkmenistan": "土库曼斯坦",
            "Tunisia": "突尼斯",
            "Tonga": "汤加",
            "Turkey": "土耳其",
            "Trinidad & Tobago": "特立尼达和多巴哥",
            "Tuvalu": "图瓦卢",
            "Tanzania": "坦桑尼亚",
            "Ukraine": "乌克兰",
            "Uganda": "乌干达",
            "United States Minor Outlying Islands": "美国本土外小岛屿",
            "Uruguay": "乌拉圭",
            "Uzbekistan": "乌兹别克斯坦",
            "Vatican City (The Holy See)": "梵蒂冈",
            "St. Vincent & the Grenadines": "圣文森特和格林纳丁斯",
            "Venezuela": "委内瑞拉",
            "British Virgin Islands": "英属维尔京群岛",
            "United States Virgin Islands": "美属维尔京群岛",
            "Vietnam": "越南",
            "Vanuatu": "瓦努阿图",
            "Wallis and Futuna": "瓦利斯和富图纳",
            "Samoa": "萨摩亚",
            "Yemen": "也门",
            "Mayotte": "马约特",
            "South Africa": "南非",
            "Zambia": "赞比亚",
            "Zimbabwe": "津巴布韦"
         }
        },
      ],
    }
    return option;
  }

  render() {
    return (
      <div className="worldMap">
        <div className="parent">
          <ReactEcharts
            option={this.getOption()}
            style={{ height: '800px', width: '100%' }}
            className="react_for_echarts"
          />
        </div>
      </div>
    )
  }
}

export default WorldMapChart
