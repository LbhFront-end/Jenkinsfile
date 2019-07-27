import { parse } from 'url';
import { CommonEnum } from '../src/utils/Enum'
import mockjs from 'mockjs';

const { CensorType, StateType, SaleType } = CommonEnum;
const censor = Object.keys(CensorType);
const censorLength = censor.length;
const state = Object.keys(StateType);
const stateLength = state.length;
const sale = Object.keys(SaleType);
const saleLength = sale.length;

// mock tableListDataSource
const tableListDataSource = [];
for (let i = 1; i < 46; i += 1) {
  tableListDataSource.push({
    key: i,
    productName: `商品${i}-跳详页`,
    brand: `品牌${i}`,
    model: `型号${i}`,
    categoryName: `分类${i}`,
    createDate: "2019-06-06T10:21:31.841Z",
    saleDate: "2019-06-06T10:21:31.841Z",
    censor: censor[`${i % censorLength}`],
    sale: sale[`${i % saleLength}`],
    state: state[`${i % stateLength}`],
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

const operation = (req, res) => {
  const { companyToken, productTokens } = req.params;
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
  'GET /enterprise/company/:companyToken/products': getProduct,
  // 商品获取选项（默认）
  'GET /enterprise/company/:companyToken/products/opts': (req, res) => {
    const { companyToken, page = 0, productName, size = 10 } = req.params;
    res.send({
      "code": 0,
      "elemTotal": 0,
      "elems": [
        {
          "productName": "string",
          "token": "string"
        }
      ],
      "page": 0,
      "pageTotal": 0,
      "size": 0
    })
  },
  // 商品获取列表（回收站）
  'GET /enterprise/company/:companyToken/products/recycle': getProduct,
  // 商品获取单项（表单）
  'GET /enterprise/company/:companyToken/product/:productToken/form': (req, res) => {
    const { companyToken, productToken } = req.params;
    res.send({
      "code": 0,
      "elemTotal": 0,
      "elems": [
        {
          "brand": "品牌",
          "categoryNames": [
            "category1-1-1",
            "category2-2-2",
            "category3-3-3",
          ],
          "categoryToken": "15",
          "coverImage": "https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg",
          "description": "描述描述（小于1000）",
          "images": [
            "https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg",
            "https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg",
            "https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg",
            "https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg",
            "https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg"
          ],
          "markets": [
            "出口市场1"
          ],
          "model": "型号1",
          "price": 100,
          "productName": "商品名",
          "saleDate": "2019-06-11T04:03:17.533Z",
          "specs": "商品规格",
          "unit": "单位"
        }
      ],
      "page": 0,
      "pageTotal": 0,
      "size": 0
    })
  },
  // 商品获取单项（详情）
  'GET /enterprise/company/:companyToken/product/:productToken/detail': (req, res) => {
    const { companyToken, productToken } = req.params;
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
            "productName": "商品名",
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
            "productName": "商品名",
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
  // 商品添加
  'POST /enterprise/company/:companyToken/product': (req, res) => {
    const { companyToken } = req.params;
    const {
      brand,
      categoryNames,
      categoryToken,
      coverImage,
      description,
      images,
      markets,
      model,
      price,
      productName,
      saleDate,
      specs,
      unit
    } = req.body;
    res.send({
      "code": 0,
      "elem": {
        brand,
        categoryNames,
        categoryToken,
        coverImage,
        description,
        images,
        markets,
        model,
        price,
        productName,
        saleDate,
        specs,
        unit
      },
      "token": "string"
    })
  },
  // 商品更新
  'PUT /enterprise/company/:companyToken/product/:productToken': (req, res) => {
    const { companyToken } = req.params;
    const {
      brand,
      categoryNames,
      categoryToken,
      coverImage,
      description,
      images,
      markets,
      model,
      price,
      productName,
      saleDate,
      specs,
      unit
    } = req.body;
    res.send({
      "code": 0,
      "elem": {
        brand,
        categoryNames,
        categoryToken,
        coverImage,
        description,
        images,
        markets,
        model,
        price,
        productName,
        saleDate,
        specs,
        unit
      },
      "token": "string"
    })
  },

  // 商品销售下架/上架/删除/锁定/解锁/清除/还原/解锁/
  'PATCH /enterprise/company/:companyToken/product/:productTokens/sale/off': operation,
  'PATCH /enterprise/company/:companyToken/product/:productTokens/sale/on': operation,
  'PATCH /enterprise/company/:companyToken/product/:productTokens/state/delete': operation,
  'PATCH /enterprise/company/:companyToken/product/:productTokens/state/lock': operation,
  'PATCH /enterprise/company/:companyToken/product/:productTokens/state/redelete': operation,
  'PATCH /enterprise/company/:companyToken/product/:productTokens/state/revert': operation,
  'PATCH /enterprise/company/:companyToken/product/:productTokens/state/unlock': operation,
  // 商品语言
  // 商品语言获取单项（表单）
  'GET /enterprise/company/:companyToken/product/:productToken/language/:languageToken/form': (req, res) => {
    const { companyToken, languageToken, productToken } = req.params;
    res.send({
      "code": 0,
      "elem": {
        "brand": "品牌",
        "description": "描述",
        "language": "ZH_CN",
        "productName": "商品名",
        "saleDate": "2019-06-11T08:59:26.593Z",
        "specs": "规格",
        "unit": "单位"
      },
      "token": "string"
    })
  },
  // 商品语言更新
  'PUT /enterprise/company/:companyToken/product/:productToken/language/:languageToken': (req, res) => {
    console.log(req.params, req.body);
    const { companyToken } = req.params;
    const {
      brand,
      description,
      language,
      productName,
      saleDate,
      specs,
      unit
    } = req.body;
    res.send({
      "code": 0,
      "elem": {
        brand,
        description,
        language,
        productName,
        saleDate,
        specs,
        unit
      },
      "token": "string"
    })
  },
  // 商品语言新增
  'POST /enterprise/company/:companyToken/product/:productToken/language': (req, res) => {
    console.log(req.params, req.body)
    const { companyToken } = req.params;
    const {
      brand,
      description,
      language,
      productName,
      saleDate,
      specs,
      unit
    } = req.body;
    res.send({
      "code": 0,
      "elem": {
        brand,
        description,
        language,
        productName,
        saleDate,
        specs,
        unit
      },
      "token": "string"
    })
  },

}



// https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg|https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg|https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg|https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg|https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg
