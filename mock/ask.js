import { parse } from 'url';
import { CommonEnum } from '../src/utils/Enum'
import mockjs from 'mockjs';

const { StateType } = CommonEnum;

const state = Object.keys(StateType);
const stateLength = state.length - 1;

// mock tableListDataSource
const tableListDataSource = [];
for (let i = 1; i < 46; i += 1) {
  tableListDataSource.push({
    key: i,
    productName: `商品${i}-跳详页`,
    email: `54428949${i}@qq.com`,
    country: `国家${i}`,
    description: '内容描述',
    marks: i % 2 ? [`标签${i}`] : null,
    createDate: "2019-06-06T10:21:31.841Z",
    state: state[`${i % stateLength}`],
    token: `token${i}`,
  })
}

function getAsk(req, res, u) {
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
  const { companyToken, askTokens } = req.params;
  return res.json({
    "batchTotal": 0,
    "code": 0,
    "error": [
      {
        "code": 0,
        "message": "string",
        "token": "string",
        companyToken,
        askTokens
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
  // 询问获取列表（默认）
  'GET /enterprise/company/:companyToken/asks': getAsk,
  // 询问获取列表（回收站）
  'GET /enterprise/company/:companyToken/asks/recycle': getAsk,
  // 询问更新/添加标签
  'POST /enterprise/company/:companyToken/ask/askToken/sign': (req, res) => {
    const { companyToken, askToken } = req.params;
    const { marks } = req.body;
    res.send({
      "code": 0,
      "elem": {
        marks
      },
      "token": "string"
    })
  },
  // 询问获取单项（详情）
  'GET /enterprise/company/:companyToken/ask/:askToken/detail': (req, res) => {
    const { companyToken, askToken } = req.params;
    res.send({
      "code": 0,
      "elem": {
        "country": "string",
        "createDate": "2019-06-13T06:45:32.254Z",
        "description": "内容描述",
        "email": "3218932189@qq.com",
        "marks": [
          "标签1"
        ],
        "productName": "商品1",
        "state": "DISABLE"
      }
    })
  },
  // 询问添加
  'POST /enterprise/company/:companyToken/ask': (req, res) => {
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
  // 询问更新
  'PUT /enterprise/company/:companyToken/ask': (req, res) => {
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

  // 询问销售下架/上架/删除/锁定/解锁/清除/还原/解锁/
  'PATCH /enterprise/company/:companyToken/ask/:askTokens/sale/off': operation,
  'PATCH /enterprise/company/:companyToken/ask/:askTokens/sale/on': operation,
  'PATCH /enterprise/company/:companyToken/ask/:askTokens/state/delete': operation,
  'PATCH /enterprise/company/:companyToken/ask/:askTokens/state/lock': operation,
  'PATCH /enterprise/company/:companyToken/ask/:askTokens/state/redelete': operation,
  'PATCH /enterprise/company/:companyToken/ask/:askTokens/state/revert': operation,
  'PATCH /enterprise/company/:companyToken/ask/:askTokens/state/unlock': operation,

}



