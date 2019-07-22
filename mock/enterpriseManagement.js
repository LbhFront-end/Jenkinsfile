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
    createDate: "2019-06-06T10:21:31.841Z",
    foundedDate: "2019-06-06T10:21:31.841Z",
    cellphone: `1882654687`,
    regionNames: [`地区名${i}`],
    website:`http://laibh.top`,
    prohibit:prohibit[`${i%prohibitLength}`],
    censor: censor[`${i%censorLength}`],
    state: state[`${i%stateLength}`],
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

const operation=(req,res)=>res.json({
  "batchTotal": 0,
  "code": 0,
  "error": [
    {
      "code": 0,
      "message": "string",
      "token": "string",

    }
  ],
  "success": [
    {
      "token": "string"
    }
  ]
})

export default {
  // 企业获取列表（默认）
  'GET /admin/companies': getEnterprise,
  // 企业获取选项（默认）
  'GET /admin/companise/opts': (req,res)=>{
    const {companyToken,page=0,companyName,size=10}=req.params;
    res.send({
      "code": 0,
      "elemTotal": 0,
      "elems": [
        {
          "companyName": "企业名称",
          "token": "string"
        }
      ],
      "page": 0,
      "pageTotal": 0,
      "size": 0
    })
  },
  // 企业获取列表（回收站）
  'GET /admin/company/recycle': getEnterprise,
  // 企业获取单项（详情）
  'GET /admin/company/:companyToken/detail': (req,res)=>{
    const {companyToken} = req.params;
    res.send({
      "code": 0,
      "elem": {
        "address": "地址地址地址",
        "cellphone": "0663-32132132",
        "companyName": "企业名称1",
        "censor": "DISABLE",
        "state": "DISABLE",
        "contacts": "联系人1",
        "coverImage": "https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg",
        "description": "企业简介",
        "logoImage": "https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg",
        "email": "邮箱地址",
        "esrCode": "string",
        "fax": "3232-33213123",
        "createDate": "2019-06-15T05:44:31.662Z",
        "foundedDate": "2019-06-14T01:30:20.901Z",
        "languages": [
          {
            "address": "地址地址地址",
            "censor": "DISABLE",
            "companyName": "企业名称1",
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
            "companyName": "企业名称2",
            "contacts": "联系人2",
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
        "phone": "1882654545",
        "prohibit": "TRUE",
        "regionNames": [
          "某某地区"
        ],
        "website": "http://laibh.top"
      },
      "records": [
        {}
      ]
    })
  },

  // 企业审核（通过、驳回）、启用、禁用
  'PATCH /admin/company/:companyTokens/censor/pass': operation,
  'PATCH /admin/company/:companyTokens/censor/return': operation,
  'PATCH /admin/company/:companyTokens/prohibit/off': operation,
  'PATCH /admin/company/:companyTokens/prohibit/on': operation,
}



