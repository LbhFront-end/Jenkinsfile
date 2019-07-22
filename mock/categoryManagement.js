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
    parentToken: '',
    depth: 1,
    sequence: `${i}`,
    censor: censor[`${i % censorLength}`],
    state: state[`${i % stateLength}`],
    token: `token${i}`,
  })
}

function getCategoryManagement(req, res, u) {
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
  const { categoryTokens } = req.params;
  return res.json({
    "batchTotal": 0,
    "code": 0,
    "error": [
      {
        "code": 0,
        "message": "string",
        "token": "string",

        categoryTokens
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
  // 分类获取列表（默认）
  'GET /admin/categories': getCategoryManagement,
  // 分类获取选项（默认）
  'GET /admin/categories/opts': (req, res) => {
    const { page = 0, categoryName, size = 10 } = req.params;
    res.send({
      "code": 0,
      "elemTotal": 0,
      "elems": [
        {
          "categoryName": "category1",
          "depth": 1,
          "parentToken": "",
          "token": "1"
        },
        {
          "categoryName": "category2",
          "depth": 1,
          "parentToken": "",
          "token": "2"
        },
        {
          "categoryName": "category3",
          "depth": 1,
          "parentToken": "",
          "token": "3"
        },
        {
          "categoryName": "category1-1",
          "depth": 2,
          "parentToken": "1",
          "token": "4"
        },
        {
          "categoryName": "category1-2",
          "depth": 2,
          "parentToken": "1",
          "token": "5"
        },
        {
          "categoryName": "category1-3",
          "depth": 2,
          "parentToken": "1",
          "token": "6"
        },
        {
          "categoryName": "category2-1",
          "depth": 2,
          "parentToken": "2",
          "token": "7"
        },
        {
          "categoryName": "category2-2",
          "depth": 2,
          "parentToken": "2",
          "token": "8"
        },
        {
          "categoryName": "category2-3",
          "depth": 2,
          "parentToken": "2",
          "token": "9"
        },
        {
          "categoryName": "category3-1",
          "depth": 2,
          "parentToken": "2",
          "token": "10"
        },
        {
          "categoryName": "category3-2",
          "depth": 2,
          "parentToken": "2",
          "token": "11"
        },
        {
          "categoryName": "category3-3",
          "depth": 2,
          "parentToken": "2",
          "token": "12"
        },
        {
          "categoryName": "category1-1-1",
          "depth": 3,
          "parentToken": "4",
          "token": "13"
        },
        {
          "categoryName": "category2-2-2",
          "depth": 3,
          "parentToken": "8",
          "token": "14"
        },
        {
          "categoryName": "category3-3-3",
          "depth": 3,
          "parentToken": "12",
          "token": "15"
        },
      ]
    })
  },
  // 分类获取列表（回收站）
  'GET /admin/categories/recycle': getCategoryManagement,
  // 分类获取单项（表单）
  'GET /admin/category/:categoryToken/form': (req, res) => {
    const { categoryToken } = req.params;
    res.send({
      "code": 0,
      "elemTotal": 0,
      "elem": {
        "categoryName": "分类1",
        "categoryNames": [
          "多级分类1"
        ],
        "description": "描述",
        "parentToken": "",
        "sequence": 1
      },
      "page": 0,
      "pageTotal": 0,
      "size": 0
    })
  },
  // 分类获取单项（详情）
  'GET /admin/category/:categoryToken/detail': (req, res) => {
    const { categoryToken } = req.params;
    res.send({
      "code": 0,
      "elem": {
        "categoryName": "分类1",
        "censor": "DISABLE",
        "createDate": "2019-06-18T00:45:43.832Z",
        "depth": 1,
        "description": "描述",
        "languages": [
          {
            "categoryName": "分类1",
            "censor": "DISABLE",
            "description": "描述1",
            "language": "ZH_CN",
            "state": "DISABLE",
            "token": "string"
          }
        ],
        "sequence": 1,
        "state": "DISABLE",
        "token": "string"
      },
      "records": [
        {}
      ]
    })
  },
  // 分类添加
  'POST /admin/category': (req, res) => {
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
  // 分类更新
  'PUT /admin/category/:categoryToken': (req, res) => {
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

  // 分类操作：排序/删除/锁定/解锁/清除/还原/解锁/启用
  'PATCH /admin/category/:categoryTokens/sequence': operation,
  'PATCH /admin/category/:categoryTokens/state/delete': operation,
  'PATCH /admin/category/:categoryTokens/state/enable': operation,
  'PATCH /admin/category/:categoryTokens/state/lock': operation,
  'PATCH /admin/category/:categoryTokens/state/redelete': operation,
  'PATCH /admin/category/:categoryTokens/state/revert': operation,
  'PATCH /admin/category/:categoryTokens/state/unlock': operation,

}






