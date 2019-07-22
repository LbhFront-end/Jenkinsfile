import { parse } from 'url';
import { CommonEnum } from '../src/utils/Enum'
import mockjs from 'mockjs';

const { CensorType, StateType, SaleType,ProhibitType } = CommonEnum;
const censor = Object.keys(CensorType);
const censorLength = censor.length;
const state = Object.keys(StateType);
const stateLength = state.length;
const sale = Object.keys(SaleType);
const saleLength = sale.length;
const prohibit = Object.keys(ProhibitType);
const prohibitLength = prohibit.length-1;

// mock tableListDataSource
const tableListDataSource = [];
for (let i = 1; i < 46; i += 1) {
  tableListDataSource.push({
    key: i,
    productName: `商品${i}-跳详页`,
    companyName: `企业${i}`,
    brand: `品牌${i}`,
    model: `型号${i}`,
    price: `${i}`,
    categoryName: `分类${i}`,
    createDate: "2019-06-06T10:21:31.841Z",
    saleDate: "2019-06-06T10:21:31.841Z",
    prohibit:prohibit[`${i%prohibitLength}`],
    censor: censor[`${i%censorLength}`],
    sale: sale[`${i%saleLength}`],
    state: state[`${i%stateLength}`],
    token: `token${i}`,
  })
}

function getProduct(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = parse(url, true).query;

  let dataSource = tableListDataSource;

  if (params.sorter) {
    const s = params.sorter.split('_');
    dataSource = dataSource.sort((prev, next) => {
      if (s[1] === 'descend') {
        return next[s[0]] - prev[s[0]];
      }
      return prev[s[0]] - next[s[0]];
    });
  }

  if (params.status) {
    const status = params.status.split(',');
    let filterDataSource = [];
    status.forEach(s => {
      filterDataSource = filterDataSource.concat(
        dataSource.filter(data => parseInt(data.status, 10) === parseInt(s[0], 10))
      );
    });
    dataSource = filterDataSource;
  }

  if (params.name) {
    dataSource = dataSource.filter(data => data.name.indexOf(params.name) > -1);
  }

  let pageSize = 10;
  if (params.pageSize) {
    pageSize = params.pageSize * 1;
  }

  const result = {
    list: dataSource,
    pagination: {
      total: dataSource.length,
      pageSize,
      current: parseInt(params.currentPage, 10) || 1,
    },
  };

  return res.json(result);
}

const operation=(req,res)=>{
  const {companyToken,productTokens } = req.params;
  return res.json({
    "batchTotal": 0,
    "code": 0,
    "error": [
      {
        "code": 0,
        "message": "string",
        "token": "string",
        companyToken,
        productTokens
      }
    ],
    "success": [
      {
        "token": "string"
      }
    ]
  })
}

export default {
  // 商品获取列表（默认）
  'GET /admin/products': getProduct,
  // 商品获取列表（回收站）
  'GET /admin/products/recycle': getProduct,
  // 商品获取单项（详情）
  'GET /admin/product/:productToken/detail': (req,res)=>{
    const {companyToken,productToken} = req.params;
    res.send({
      "code": 0,
      "elem": {
        "brand": "品牌",
        "categoryNames": [
          "category1-1-1",
          "category2-2-2",
          "category3-3-3",
        ],
        "censor": "DISABLE",
        "coverImage": "https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg",
        "createDate": "2019-06-11T07:35:22.659Z",
        "description": "描述",
        "images": [
          "https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg",
          "https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg",
          "https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg",
          "https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg",
          "https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg"
        ],
        "languages": [
          {
            "brand": "品牌",
            "censor": "DISABLE",
            "description": "描述",
            "language": "ZH_CN",
            "productName": "商品名称",
            "prohibit": "TRUE",
            "saleDate": "2019-06-11T07:35:22.659Z",
            "specs": "规格",
            "state": "DISABLE",
            "token": "string",
            "unit": "单位"
          },
          {
            "brand": "品牌",
            "censor": "DISABLE",
            "description": "描述",
            "language": "ZH_TW",
            "productName": "商品名称",
            "prohibit": "TRUE",
            "saleDate": "2019-06-11T07:35:22.659Z",
            "specs": "规格",
            "state": "DISABLE",
            "token": "string",
            "unit": "单位"
          }
        ],
        "markets": [
          "string"
        ],
        "model": "型号1",
        "price": 100,
        "productName": "商品名",
        "prohibit": "TRUE",
        "sale": "ON",
        "saleDate": "2019-06-11T07:35:22.659Z",
        "specs": "规格",
        "state": "DISABLE",
        "token": "string",
        "unit": "单位"
      },
      "records": [
        {}
      ]
    })
  },

  // 商品操作：审核（通过驳回）、启用、禁用
  'PATCH /admin/product/:productTokens/censor/pass': operation,
  'PATCH /admin/product/:productTokens/censor/return': operation,
  'PATCH /admin/product/:productTokens/prohibit/off': operation,
  'PATCH /admin/product/:productTokens/prohibit/on': operation,

}



