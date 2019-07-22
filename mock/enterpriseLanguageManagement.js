import { parse } from 'url';
import { CommonEnum } from '../src/utils/Enum'
import mockjs from 'mockjs';

const { CensorType, StateType, SaleType,ProhibitType } = CommonEnum;
const censor = Object.keys(CensorType);
const censorLength = censor.length-1;
const state = Object.keys(StateType);
const stateLength = state.length-1;
const sale = Object.keys(SaleType);
const saleLength = sale.length-1;
const prohibit = Object.keys(ProhibitType);
const prohibitLength = prohibit.length-1;

// mock tableListDataSource
const tableListDataSource = [];
for (let i = 1; i < 46; i += 1) {
  tableListDataSource.push({
    key: i,
    companyName: `企业名称${i}`,
    contacts: `联系人${i}`,
    description: `企业简介${i}`,
    language: `语言${i}`,
    regionNames: [`地区名${i}`],
    prohibit:prohibit[`${i%prohibitLength}`],
    censor: censor[`${i%censorLength}`],
    state: state[`${i%stateLength}`],
    token: `token${i}`,
  })
}

function getEnterpriseLanguage(req, res, u) {
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
  const {languageTokens } = req.params;
  return res.json({
    "batchTotal": 0,
    "code": 0,
    "error": [
      {
        "code": 0,
        "message": "string",
        "token": "string",
        languageToken,

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
  // 企业语言获取列表（默认）
  'GET /admin/company/languages': getEnterpriseLanguage,
  // 企业语言获取列表（回收站）
  'GET /admin/company/languages/recycle': getEnterpriseLanguage,
  // 企业语言获取单项（详情）
  'GET /admin/company/language/:languageToken/detail': (req,res)=>{
    const {languageToken} = req.params;
    res.send({
      "code": 0,
      "elem": {
        "address": "地址地址地址",
        "censor": "DISABLE",
        "companyName": "企业名称1",
        "contacts": "联系人1",
        "description": "企业简介",
        "foundedDate": "2019-06-14T01:30:20.901Z",
        language:'ZH_TW',
        "prohibit": "TRUE",
        "regionNames": [
          "某某地区"
        ],
        "state": "DISABLE",
        "token": "token",
      },
      "records": [
        {}
      ]
    })
  },

  // 企业语言审核（通过、驳回）、启用、禁用
  'PATCH /admin/company/language/:languageTokens/censor/pass': operation,
  'PATCH /admin/company/language/:languageTokens/censor/return': operation,
  'PATCH /admin/company/language/:languageTokens/prohibit/off': operation,
  'PATCH /admin/company/language/:languageTokens/prohibit/on': operation,
}



