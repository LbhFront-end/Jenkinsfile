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
    productName: `企业${i}-跳详页`,
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

function getEnterprise(req, res, u) {
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
  const { companyTokens } = req.params;
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
  // 企业获取列表（默认）
  'GET /enterprise/company/:companyToken': getEnterprise,
  // 企业获取选项（默认）
  'GET /enterprise/company/:companyToken/opts': (req, res) => {
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
  // 企业获取列表（回收站）
  'GET /enterprise/company/:companyToken/recycle': getEnterprise,
  // 企业获取单项（表单）
  'GET /enterprise/company/:companyToken/form': (req, res) => {
    const { companyToken } = req.params;
    res.send({
      "code": 0,
      "elem": {
        "address": "地址地址地址",
        "cellphone": "0663-32132132",
        "companyName": "企业名1",
        "contacts": "联系人1",
        "coverImage": "https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg",
        "description": "企业简介",
        "logoImage": "https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg",
        "email": "邮箱地址",
        "fax": "3232-33213123",
        "foundedDate": "2019-06-14T01:30:20.901Z",
        "notifyByCellphone": true,
        "notifyByEmail": true,
        "phone": "1882654545",
        "regionNames": [
          "某某地区"
        ],
        "regionToken": "regionToken",
        "website": "http://laibh.top"
      },
      "token": "string"
    })
  },
  // 企业获取单项（详情）
  'GET /enterprise/company/:companyToken/detail': (req, res) => {
    const { companyToken } = req.params;
    res.send({
      "code": 0,
      "elem": {
        "address": "地址地址地址",
        "cellphone": "0663-32132132",
        "companyName": "企业名1",
        "contacts": "联系人1",
        "coverImage": "https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg",
        "description": "企业简介",
        "logoImage": "https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg",
        "email": "邮箱地址",
        "esrCode": "string",
        "fax": "3232-33213123",
        "foundedDate": "2019-06-14T01:30:20.901Z",
        "languages": [
          {
            "address": "地址地址地址",
            "censor": "DISABLE",
            "companyName": "企业名1",
            "contacts": "联系人1",
            "description": "企业简介",
            "foundedDate": "2019-06-14T01:30:20.901Z",
            "language": "ZH_CN",
            "regionNames": [
              "某某地区"
            ],
            "state": "DISABLE",
            "token": "string",
          },
          {
            "address": "地址地址地址1",
            "censor": "DISABLE",
            "companyName": "企业名2",
            "contacts": "联系人2",
            "productName": "企业名1",
            "description": "企业简介2",
            "foundedDate": "2019-06-14T01:30:20.901Z",
            "language": "ZH_TW",
            "regionNames": [
              "某某地区"
            ],
            "state": "DISABLE",
            "token": "string",
          }
        ],
        "licenseCompanyName": "string",
        "notifyByCellphone": true,
        "notifyByEmail": true,
        "phone": "1882654545",
        "regionNames": [
          "某某地区"
        ],
        "website": "http://laibh.top"
      },
    })
  },
  // 企业添加
  'POST /enterprise/company/:companyToken': (req, res) => {
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
  // 企业更新
  'PUT /enterprise/company/:companyToken': (req, res) => {
    const { companyToken } = req.params;
    const {
      address,
      cellphone,
      companyName,
      contacts,
      description,
      email,
      fax,
      foundedDate,
      notifyByCellphone,
      notifyByEmail,
      phone,
      regionNames,
      website
    } = req.body;
    res.send({
      "code": 0,
      "elem": {
        address,
        cellphone,
        companyName,
        contacts,
        description,
        email,
        fax,
        foundedDate,
        notifyByCellphone,
        notifyByEmail,
        phone,
        regionNames,
        website
      },
      "token": "string"
    })
  },

  // 企业销售下架/上架/删除/锁定/解锁/清除/还原/解锁/短信通知（启用、停用）/邮件通知（启用、停用）
  'PATCH /enterprise/company/:companyToken/sale/off': operation,
  'PATCH /enterprise/company/:companyToken/sale/on': operation,
  'PATCH /enterprise/company/:companyToken/state/delete': operation,
  'PATCH /enterprise/company/:companyToken/state/lock': operation,
  'PATCH /enterprise/company/:companyToken/state/redelete': operation,
  'PATCH /enterprise/company/:companyToken/state/revert': operation,
  'PATCH /enterprise/company/:companyToken/state/unlock': operation,
  'PATCH /enterprise/company/:companyToken/cellphone/notice/off': operation,
  'PATCH /enterprise/company/:companyToken/cellphone/notice/on': operation,
  'PATCH /enterprise/company/:companyToken/email/notice/off': operation,
  'PATCH /enterprise/company/:companyToken/email/notice/on': operation,
  // 企业语言
  // 企业语言获取单项（表单）
  'GET /enterprise/company/:companyToken/language/:languageToken/form': (req, res) => {
    const { companyToken, languageToken } = req.params;
    res.send({
      "code": 0,
      "elem": {
        "address": "地址1",
        "companyName": "公司名1",
        "contacts": "联系人1",
        "description": "企业简介1",
        "foundedDate": "2019-06-14T01:53:43.328Z",
        "language": "ZH_CN"
      },
      "token": "string"
    })
  },
  // 企业语言更新
  'PUT /enterprise/company/:companyToken/language/:languageToken': (req, res) => {
    const { companyToken } = req.params;
    const {
      address,
      companyName,
      contacts,
      description,
      foundedDate,
      language,
    } = req.body;
    res.send({
      "code": 0,
      "elem": {
        address,
        companyName,
        contacts,
        description,
        foundedDate,
        language,
      },
      "token": "string"
    })
  },
  // 企业语言新增
  'POST /enterprise/company/:companyToken/language': (req, res) => {
    const { companyToken } = req.params;
    const {
      address,
      companyName,
      contacts,
      description,
      foundedDate,
      language,
    } = req.body;
    res.send({
      "code": 0,
      "elem": {
        address,
        companyName,
        contacts,
        description,
        foundedDate,
        language,
      },
      "token": "string"
    })
  },

}



