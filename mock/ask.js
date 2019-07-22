import { parse } from 'url';
import { CommonEnum } from '../src/utils/Enum'
import mockjs from 'mockjs';

const { StateType,CensorType } = CommonEnum;
const censor = Object.keys(CensorType);
const censorLength = censor.length-1;
const state = Object.keys(StateType);
const stateLength = state.length-1;

// mock tableListDataSource
const tableListDataSource = [];
for (let i = 1; i < 46; i += 1) {
  tableListDataSource.push({
    key: i,
    productName: `商品${i}`,
    email: `54428949${i}@qq.com`,
    country: `国家${i}`,
    marks: `标签${i}`,
    createDate: "2019-06-06T10:21:31.841Z",
    // censor: 'PASS',
    censor: censor[`${i%censorLength}`],
    state: state[`${i%stateLength}`],
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

const operation=(req,res)=>{
  const {companyToken,askTokens } = req.params;
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
  'GET /admin/asks': getAsk,
  // 询问获取列表（回收站）
  'GET /admin/asks/recycle': getAsk,

  // 询问操作：下架/上架/删除/锁定/解锁/清除/还原/解锁/审核（通过、不通过）
  'PATCH /admin/ask/:askTokens/censor/off': operation,
  'PATCH /admin/ask/:askTokens/censor/on': operation,
  'PATCH /admin/ask/:askTokens/state/delete': operation,
  'PATCH /admin/ask/:askTokens/state/lock': operation,
  'PATCH /admin/ask/:askTokens/state/redelete': operation,
  'PATCH /admin/ask/:askTokens/state/revert': operation,
  'PATCH /admin/ask/:askTokens/state/unlock': operation,

}



