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
    categoryName: `分类${i}`,
    language: `语言${i}`,
    censor: censor[`${i % censorLength}`],
    state: state[`${i % stateLength}`],
    token: `token${i}`,
  })
}

function getCategoryLanguageManagement(req, res, u) {
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
  const { languageTokens } = req.params;
  return res.json({
    "batchTotal": 0,
    "code": 0,
    "error": [
      {
        "code": 0,
        "message": "string",
        "token": "string",

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
  // 分类语言获取列表（默认）
  'GET /admin/category/languages': getCategoryLanguageManagement,
  // 分类语言获取列表（回收站）
  'GET /admin/category/languages/recycle': getCategoryLanguageManagement,
  // 分类语言获取单项（表单）
  'GET /admin/category/language/:languageToken/form': (req, res) => {
    const { languageToken } = req.params;
    res.send({
      "code": 0,
      "elem": {
        "categoryName": "分类1",
        "categoryNames": [
          "多级分类1"
        ],
        "description": "string",
        "language": "ZH_CN"
      },
      "token": "string"
    })
  },
  // 分类语言添加
  'POST /admin/category/:categoryToken/language': (req, res) => {
    const { companyToken } = req.params;
    const {
      categoryName,
      categoryNames,
      description,
      parentToken,
      sequence,
    } = req.body;
    res.send({
      "code": 0,
      "elem": {
        categoryName,
        categoryNames,
        description,
        parentToken,
        sequence,
      },
      "token": "string"
    })
  },
  // 分类语言更新
  'PUT /admin/category/language/:languageToken': (req, res) => {
    const { companyToken } = req.params;
    const {
      categoryName,
      categoryNames,
      description,
      parentToken,
      sequence,
    } = req.body;
    res.send({
      "code": 0,
      "elem": {
        categoryName,
        categoryNames,
        description,
        parentToken,
        sequence,
      },
      "token": "string"
    })
  },

  // 分类语言操作：删除/锁定/解锁/清除/还原/解锁/启用
  'PATCH /admin/category/language/:languageTokens/state/delete': operation,
  'PATCH /admin/category/language/:languageTokens/state/enable': operation,
  'PATCH /admin/category/language/:languageTokens/state/lock': operation,
  'PATCH /admin/category/language/:languageTokens/state/redelete': operation,
  'PATCH /admin/category/language/:languageTokens/state/revert': operation,
  'PATCH /admin/category/language/:languageTokens/state/unlock': operation,

}
