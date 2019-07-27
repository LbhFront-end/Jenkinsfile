const CommonEnum = {
  CensorType: {
    WAIT: { code: 'WAIT', desc: '待审核' },
    DISABLE: { code: 'DISABLE', desc: '未提交' },
    RETURN: { code: 'RETURN', desc: '已驳回' },
    PASS: { code: 'PASS', desc: '已通过' },
    UNPASS: { code: 'UNPASS', desc: '不通过' },
    ING: { code: 'ING', desc: '审核中' },
    ABNORMAL: { code: '', desc: '状态异常' },
  },
  StateType: {
    ENABLE: { code: 'ENABLE', desc: '已启用' },
    DISABLE: { code: 'DISABLE', desc: '未启用' },
    LOCK: { code: 'LOCK', desc: '已锁定' },
    UNLOCK: { code: 'UNLOCK', desc: '已解锁' },
    RECYCLE: { code: 'RECYCLE', desc: '已删除' },
    CLEAR: { code: 'CLEAR', desc: '已清除' },
    ABNORMAL: { code: '', desc: '状态异常' },
  },
  SaleType: {
    ON: { code: 'ON', desc: '已上架' },
    OFF: { code: 'OFF', desc: '已下架' },
    DISABLE: { code: 'DISABLE', desc: '待上架' },
    ABNORMAL: { code: '', desc: '状态异常' },
  },
  ProhibitType: {
    TRUE: { code: true, desc: '是' },
    FALSE: { code: false, desc: '否' },
    ABNORMAL: { code: '', desc: '状态异常' },
  }
}
const MockSelect = {
  stateSelect: [
    { value: 'DISABLE', label: '未启用' },
    { value: 'ENABLE', label: '已启用' },
    { value: 'LOCK', label: '已锁定' },
    { value: 'RECYCLE', label: '已删除' }
  ],
  categoryTokenSelect: [
    { value: 'DISABLE', label: 'DISABLE' },
    { value: 'RETURN', label: 'RETURN' },
    { value: 'WAIT', label: 'WAIT' },
    { value: 'ING', label: 'ING' },
    { value: 'PASS', label: 'PASS' },
    { value: 'UNPASS', label: 'UNPASS' },
  ],
  prohbitSelect: [
    { value: true, label: '是' },
    { value: false, label: '否' },
  ],
  marketSelect: [
    { value: '市场1', label: '市场1' },
    { value: '市场2', label: '市场3' },
    { value: '市场3', label: '市场4' },
  ],
  censorSelect: [
    { value: 'DISABLE', label: '未提交' },
    { value: 'RETURN', label: '已驳回' },
    { value: 'WAIT', label: '待审核' },
    { value: 'ING', label: '审核中' },
    { value: 'PASS', label: '已通过' },
    { value: 'UNPASS', label: '不通过' },
  ],
  languageSelect: [
    { value: 'EN', label: '英文' },
    { value: 'ZH_CN', label: '中文(简体)' },
    { value: 'ZH_TW', label: '中文(繁体)' },
  ],
  countrySelect: [
    { value: '国家1', label: '国家1' },
    { value: '国家2', label: '国家2' },
    { value: '国家3', label: '国家3' },
  ],
  regionNameSelect: [
    { value: '地区1', label: '地区1' },
    { value: '地区2', label: '地区2' },
    { value: '地区3', label: '地区3' },
  ],
  province: [
    {
      "url": "beijing",
      "map": "北京"
    },
    {
      "url": "tianjin",
      "map": "天津"
    },
    {
      "url": "hebei",
      "map": "河北"
    },
    {
      "url": "shangxi",
      "map": "山西"
    },
    {
      "url": "neimenggu",
      "map": "内蒙古"
    },
    {
      "url": "liaoning",
      "map": "辽宁"
    },
    {
      "url": "jilin",
      "map": "吉林"
    },
    {
      "url": "heilongjiang",
      "map": "黑龙江"
    },
    {
      "url": "shanghai",
      "map": "上海"
    },
    {
      "url": "jiangsu",
      "map": "江苏"
    },
    {
      "url": "zhejiang",
      "map": "浙江"
    },
    {
      "url": "anhui",
      "map": "安徽"
    },
    {
      "url": "fujian",
      "map": "福建"
    },
    {
      "url": "jiangxi",
      "map": "江西"
    },
    {
      "url": "shangdong",
      "map": "山东"
    },
    {
      "url": "henan",
      "map": "河南"
    },
    {
      "url": "hubei",
      "map": "湖北"
    },
    {
      "url": "hunan",
      "map": "湖南"
    },
    {
      "url": "guangdong",
      "map": "广东"
    },
    {
      "url": "guangxi",
      "map": "广西"
    },
    {
      "url": "hainan",
      "map": "海南"
    },
    {
      "url": "chongqin",
      "map": "重庆"
    },
    {
      "url": "sichuan",
      "map": "四川"
    },
    {
      "url": "guizhou",
      "map": "贵州"
    },
    {
      "url": "yunnan",
      "map": "云南"
    },
    {
      "url": "xizang",
      "map": "西藏"
    },
    {
      "url": "shanxi1",
      "map": "陕西"
    },
    {
      "url": "gansu",
      "map": "甘肃"
    },
    {
      "url": "qinghai",
      "map": "青海"
    },
    {
      "url": "ningxia",
      "map": "宁夏"
    },
    {
      "url": "xinjiang",
      "map": "新疆"
    },
    {
      "url": "taiwan",
      "map": "台湾"
    },
    {
      "url": "xianggang",
      "map": "香港"
    },
    {
      "url": "aomen",
      "map": "澳门"
    }
  ]
}

const AllButtonConfig = {
  Censor: {
    PASS: { actionName: '审核通过', action: 'pass', prefix: 'censor' },
    UNPASS: { actionName: '审核不通过', action: 'unpass', prefix: 'censor' },
    ING: { actionName: '审核中', action: 'ing', prefix: 'censor' },
    RETURN: { actionName: '审核驳回', action: 'return', prefix: 'censor' },
  },
  State: {
    ENABLE: { actionName: '启用', action: 'enable', prefix: 'state' },
    DISABLE: { actionName: '停用', action: 'disable', prefix: 'state' },
    LOCK: { actionName: '锁定', action: 'lock', prefix: 'state' },
    UNLOCK: { actionName: '解锁', action: 'unlock', prefix: 'state' },
    DELETE: { actionName: '删除', action: 'delete', prefix: 'state' },
    REDELETE: { actionName: '删除', action: 'redelete', prefix: 'state' },
    REVERT: { actionName: '还原', action: 'revert', prefix: 'state' },
  },
  Sale: {
    ON: { actionName: '上架', action: 'on', prefix: 'sale' },
    OFF: { actionName: '下架', action: 'off', prefix: 'sale' },
  },
  Prohibit: {
    ON: { actionName: '禁用', action: 'on', prefix: 'prohibit' },
    OFF: { actionName: '解禁', action: 'off', prefix: 'prohibit' },
  },
  Change: {
    EDIT: { actionName: '编辑', action: 'form' },
  }
}

const BatchButtonConfig = {
  Censor: {
    PASS: {
      TRUE: { actionName: '审核通过', action: 'pass', prefix: 'censor', boolean: true },
      FALSE: { actionName: '审核通过', action: 'pass', prefix: 'censor', boolean: false }
    },
    UNPASS: {
      TRUE: { actionName: '审核不通过', action: 'unpass', prefix: 'censor', boolean: true },
      FALSE: { actionName: '审核不通过', action: 'unpass', prefix: 'censor', boolean: false },
    },
    ING: {
      TRUE: { actionName: '审核中', action: 'ing', prefix: 'censor', boolean: true },
      FALSE: { actionName: '审核中', action: 'ing', prefix: 'censor', boolean: false },
    },
    RETURN: {
      TRUE: { actionName: '审核驳回', action: 'return', prefix: 'censor', boolean: true },
      FALSE: { actionName: '审核驳回', action: 'return', prefix: 'censor', boolean: false },
    },
  },
  State: {
    ENABLE: {
      TRUE: { actionName: '启用', action: 'enable', prefix: 'state', boolean: true },
      FALSE: { actionName: '启用', action: 'enable', prefix: 'state', boolean: false },
    },
    DISABLE: {
      TRUE: { actionName: '停用', action: 'disable', prefix: 'state', boolean: true },
      FALSE: { actionName: '停用', action: 'disable', prefix: 'state', boolean: false },
    },
    LOCK: {
      TRUE: { actionName: '锁定', action: 'lock', prefix: 'state', boolean: true },
      FALSE: { actionName: '锁定', action: 'lock', prefix: 'state', boolean: false },
    },
    UNLOCK: {
      TRUE: { actionName: '解锁', action: 'unlock', prefix: 'state', boolean: true },
      FALSE: { actionName: '解锁', action: 'unlock', prefix: 'state', boolean: false },
    },
    DELETE: {
      TRUE: { actionName: '删除', action: 'delete', prefix: 'state', boolean: true },
      FALSE: { actionName: '删除', action: 'delete', prefix: 'state', boolean: false },
    },
    REDELETE: {
      TRUE: { actionName: '删除', action: 'redelete', prefix: 'state', boolean: true },
      FALSE: { actionName: '删除', action: 'redelete', prefix: 'state', boolean: false },
    },
    REVERT: {
      TRUE: { actionName: '还原', action: 'revert', prefix: 'state', boolean: true },
      FALSE: { actionName: '还原', action: 'revert', prefix: 'state', boolean: false },
    }
  },
  Sale: {
    ON: {
      TRUE: { actionName: '上架', action: 'on', prefix: 'sale', boolean: true },
      FALSE: { actionName: '上架', action: 'on', prefix: 'sale', boolean: false },
    },
    OFF: {
      TRUE: { actionName: '下架', action: 'off', prefix: 'sale', boolean: true },
      FALSE: { actionName: '下架', action: 'off', prefix: 'sale', boolean: false },
    }
  },
  Prohibit: {
    ON: {
      TRUE: { actionName: '禁用', action: 'on', prefix: 'prohibit', boolean: true },
      FALSE: { actionName: '禁用', action: 'on', prefix: 'prohibit', boolean: false },
    },
    OFF: {
      TRUE: { actionName: '解禁', action: 'off', prefix: 'prohibit', boolean: true },
      FALSE: { actionName: '解禁', action: 'off', prefix: 'prohibit', boolean: false },
    },
  },
}


const TimeRange = [
  { value: 'SEVEN', desc: '最近7天' },
  { value: 'FIFTEEN', desc: '最近15天' },
  { value: 'THIRTY', desc: '最近一个月' },
]

const Source = [
  { name: '无', value: 'NONE' },
  { name: 'ESR外贸综合服务平台', value: 'ESR_TRADE' },
  { name: '新安怀官网', value: 'AH_SITE' },
  { name: '佛山市服务贸易共享平台', value: 'FS_SHARE' },
]


export {
  CommonEnum,
  MockSelect,
  AllButtonConfig,
  BatchButtonConfig,
  TimeRange,
  Source
}
