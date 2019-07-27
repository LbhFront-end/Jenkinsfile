import { parse } from 'url';
import { CommonEnum } from '../src/utils/Enum'
import mockjs from 'mockjs';

const { StateType } = CommonEnum;

const state = Object.keys(StateType);
const stateLength = state.length;


// mock tableListDataSource
const tableListDataSource = [];
for (let i = 1; i < 46; i += 1) {
  tableListDataSource.push({
    key: i,
    account: `ESR账号${i}`,
    createDate: "2019-06-13T09:08:34.060Z",
    state: state[`${i % stateLength}`],
    token: `token${i}`,
  })
}

function getAdministratorSettings(req, res, u) {
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
  const { companyToken, memberTokens } = req.params;
  return res.json({
    "batchTotal": 0,
    "code": 0,
    "error": [
      {
        "code": 0,
        "message": "string",
        "token": "string",
        companyToken,
        memberTokens
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
  // 成员获取列表（默认）
  'GET /enterprise/company/:companyToken/members': getAdministratorSettings,
  // 获取ESR管理员
  'GET /enterprise/company/:companyToken/esrManagers/opts': (req, res) => {
    const { companyToken } = req.params;
    res.send({
      "code": 0,
      "elemTotal": 0,
      "elems": [
        {
          "account": "管理员1",
          "id": 1
        },
        {
          "account": "管理员2",
          "id": 2
        },
        {
          "account": "管理员3",
          "id": 3
        },
      ]
    })
  },
  // 成员获取列表（回收站）
  'GET /enterprise/company/:companyToken/members/recycle': getAdministratorSettings,
  // 成员获取单项（表单）
  'GET /enterprise/company/:companyToken/member/:memberToken/form': (req, res) => {
    const { companyToken, memberToken } = req.params;
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
          "productName": "成员名",
          "saleDate": "2019-06-11T04:03:17.533Z",
          "specs": "成员规格",
          "unit": "单位"
        }
      ],
      "page": 0,
      "pageTotal": 0,
      "size": 0
    })
  },
  // 成员获取单项（详情）
  'GET /enterprise/company/:companyToken/member/:memberToken/detail': (req, res) => {
    const { companyToken, memberToken } = req.params;
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
            "productName": "成员名称",
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
            "language": "EN",
            "productName": "成员名称",
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
        "productName": "成员名",
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
  // 成员添加
  'POST /enterprise/company/:companyToken/member': (req, res) => {
    const { companyToken } = req.params;
    const {
      account,
    } = req.body;
    res.send({
      "code": 0,
      "elem": {
        account
      },
      "token": "string"
    })
  },
  // 成员更新
  'PUT /enterprise/company/:companyToken/member/:memberToken': (req, res) => {
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

  // 成员销售下架/上架/删除/锁定/解锁/清除/还原/解锁/
  'PATCH /enterprise/company/:companyToken/member/:memberTokens/sale/off': operation,
  'PATCH /enterprise/company/:companyToken/member/:memberTokens/sale/on': operation,
  'PATCH /enterprise/company/:companyToken/member/:memberTokens/state/delete': operation,
  'PATCH /enterprise/company/:companyToken/member/:memberTokens/state/lock': operation,
  'PATCH /enterprise/company/:companyToken/member/:memberTokens/state/redelete': operation,
  'PATCH /enterprise/company/:companyToken/member/:memberTokens/state/revert': operation,
  'PATCH /enterprise/company/:companyToken/member/:memberTokens/state/unlock': operation,
}



