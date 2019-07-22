import { parse } from 'url';
import { CommonEnum } from '../src/utils/Enum'
import mockjs from 'mockjs';

const { StateType,CensorType } = CommonEnum;

const state = Object.keys(StateType);
const stateLength = state.length-1;

const censor = Object.keys(CensorType);
const censorLength = censor.length-1;


// mock tableListDataSource
const tableListDataSource = [];
for (let i = 1; i < 46; i += 1) {
  tableListDataSource.push({
    key: i,
    account: `ESR账号${i}`,
    censor: censor[`${i%censorLength}`],
    state: state[`${i%stateLength}`],
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

const operation=(req,res)=>{
  const {companyToken,managerTokens } = req.params;
  return res.json({
    "batchTotal": 0,
    "code": 0,
    "error": [
      {
        "code": 0,
        "message": "string",
        "token": "string",
        companyToken,
        managerTokens
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
  'GET /admin/managers': getAdministratorSettings,
  // 成员获取列表（回收站）
  'GET /admin/managers/recycle': getAdministratorSettings,

  // 成员操作：删除/锁定/解锁/清除/还原/解锁/
  'PATCH /admin/manager/:managerTokens/state/delete': operation,
  'PATCH /admin/manager/:managerTokens/state/lock': operation,
  'PATCH /admin/manager/:managerTokens/state/redelete': operation,
  'PATCH /admin/manager/:managerTokens/state/revert': operation,
  'PATCH /admin/manager/:managerTokens/state/unlock': operation,
}



