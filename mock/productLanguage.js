import { parse } from 'url';
import { CommonEnum } from '../src/utils/Enum'
import mockjs from 'mockjs';

const { CensorType, StateType, SaleType, ProhibitType } = CommonEnum;
const censor = Object.keys(CensorType);
const censorLength = censor.length;
const state = Object.keys(StateType);
const stateLength = state.length;
const sale = Object.keys(SaleType);
const saleLength = sale.length;
const prohibit = Object.keys(ProhibitType);
const prohibitLength = prohibit.length - 1;

// mock tableListDataSource
const tableListDataSource = [];
for (let i = 1; i < 46; i += 1) {
  tableListDataSource.push({
    key: i,
    productName: `商品${i}`,
    language: `语言${i}`,
    brand: `品牌${i}`,
    specs: `规格${i}`,
    prohibit: prohibit[`${i % prohibitLength}`],
    censor: censor[`${i % censorLength}`],
    state: state[`${i % stateLength}`],
    token: `token${i}`,
  })
}

function getProductLanguage(req, res, u) {
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
  const { companyToken, languageTokens } = req.params;
  return res.json({
    "batchTotal": 0,
    "code": 0,
    "error": [
      {
        "code": 0,
        "message": "string",
        "token": "string",
        companyToken,
        languageTokens
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
  // 商品语言获取列表（默认）
  'GET /enterprise/company/:companyToken/product/languages': getProductLanguage,
  // 商品语言获取列表（回收站）
  'GET /enterprise/company/:companyToken/product/languages/recycle': getProductLanguage,
  // 商品语言获取单项（表单）
  'GET /enterprise/company/:companyToken/product/language/:languageToken/form': (req, res) => {
    const { companyToken, languageToken } = req.params;
    res.send({
      "code": 0,
      "elemTotal": 0,
      "elem": {
        "brand": "品牌1",
        "description": "描述1",
        "language": "ZH_CN",
        "productName": "商品名",
        "saleDate": "2019-06-16T05:24:25.161Z",
        "specs": "规格1",
        "unit": "单位1"
      },
      "page": 0,
      "pageTotal": 0,
      "size": 0
    })
  },
  // 商品语言添加
  'POST /enterprise/company/:companyToken/product/:productToken/language': (req, res) => {
    const { companyToken } = req.params;
    const {
      brand,
      description,
      language,
      productName,
      saleDate,
      specs,
      unit,
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
        unit,
      },
      "token": "string"
    })
  },
  // 商品语言更新
  'PUT /enterprise/company/:companyToken/product/language/:languageToken': (req, res) => {
    const { companyToken } = req.params;
    const {
      brand,
      description,
      language,
      productName,
      saleDate,
      specs,
      unit,
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
        unit,
      },
      "token": "string"
    })
  },

  // 商品语言操作：删除/锁定/解锁/清除/还原/解锁/
  'PATCH /enterprise/company/:companyToken/language/:languageTokens/state/delete': operation,
  'PATCH /enterprise/company/:companyToken/language/:languageTokens/state/lock': operation,
  'PATCH /enterprise/company/:companyToken/language/:languageTokens/state/redelete': operation,
  'PATCH /enterprise/company/:companyToken/language/:languageTokens/state/revert': operation,
  'PATCH /enterprise/company/:companyToken/language/:languageTokens/state/unlock': operation,


}



