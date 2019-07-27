import React from 'react';
import { Tag, Badge, Button, Descriptions, message, notification, Icon, Alert } from 'antd';
import _ from 'lodash';
import moment from 'moment';
import { CommonEnum, AllButtonConfig, BatchButtonConfig, Source } from '../Enum';

const { CensorType, StateType, SaleType, ProhibitType } = CommonEnum;
const imgPrefix = 'http://pimg.21silkroad.com';

const formatTime = (time) => {
  if (!time) return false
  return time.split(' ')[0]
}
const formatLanguage = (lang) => {
  switch (lang) {
    case 'EN':
      return '英文';
    case 'ZH_CN':
      return '中文';
    default:
      return lang;
  }
}
const renderCensorText = censor => {
  if (censor) {
    switch (censor) {
      case CensorType.WAIT.code:
        return CensorType.WAIT.desc;
      case CensorType.DISABLE.code:
        return CensorType.DISABLE.desc;
      case CensorType.RETURN.code:
        return CensorType.RETURN.desc;
      case CensorType.PASS.code:
        return CensorType.PASS.desc;
      case CensorType.UNPASS.code:
        return CensorType.UNPASS.desc;
      case CensorType.ING.code:
        return CensorType.ING.desc;
      default:
        return CensorType.ABNORMAL.desc;
    }
  }
  return CensorType.ABNORMAL.desc;
}
const renderStateText = state => {
  if (state) {
    switch (state) {
      case StateType.ENABLE.code:
        return StateType.ENABLE.desc;
      case StateType.DISABLE.code:
        return StateType.DISABLE.desc;
      case StateType.LOCK.code:
        return StateType.LOCK.desc;
      case StateType.UNLOCK.code:
        return StateType.UNLOCK.desc;
      case StateType.RECYCLE.code:
        return StateType.RECYCLE.desc;
      case StateType.CLEAR.code:
        return StateType.CLEAR.desc;
      default:
        return StateType.ABNORMAL.desc;
    }
  }
  return StateType.ABNORMAL.desc;
}
const renderSaleText = sale => {
  if (sale) {
    switch (sale) {
      case SaleType.ON.code:
        return SaleType.ON.desc;
      case SaleType.OFF.code:
        return SaleType.OFF.desc;
      case SaleType.DISABLE.code:
        return SaleType.DISABLE.desc;
      default:
        return SaleType.ABNORMAL.desc;
    }
  }
  return SaleType.ABNORMAL.desc;
}
const renderProhibitText = prohibit => {
  switch (prohibit) {
    case ProhibitType.TRUE.code:
      return ProhibitType.TRUE.desc;
    case ProhibitType.FALSE.code:
      return ProhibitType.FALSE.desc;
    default:
      return CensorType.ABNORMAL.desc;
  }
}

const getStateColor = state => {
  let color = 'red';
  let status = 'error';
  if (state) {
    switch (state) {
      case StateType.ENABLE.code:
        color = 'green';
        status = 'success';
        break;
      case StateType.DISABLE.code:
        color = 'gray';
        status = 'default';
        break;
      case StateType.LOCK.code:
        color = 'orange';
        status = 'default';
        break;
      case StateType.RECYCLE.code:
        color = 'red';
        status = "error"
        break;
      default:
        break;
    }
  }
  return { color, status };
}
const getSaleColor = sale => {
  let color = 'red';
  let status = 'error';
  if (sale) {
    switch (sale) {
      case SaleType.ON.code:
        color = 'green';
        status = 'success';
        break;
      case SaleType.OFF.code:
      case SaleType.DISABLE.code:
        color = 'gray';
        status = 'default';
        break;
      default:
        break;
    }
  }
  return { color, status };
}
const renderStatus = record => {
  let parmas = {};
  let txt = '';
  const { sale, state, censor } = record;
  if (censor === CensorType.PASS.code && state === StateType.ENABLE.code) {
    parmas = getSaleColor(sale);
    txt = renderSaleText(sale)
  }
  parmas = getStateColor(state);
  txt = renderStateText(state)
  return <span><Badge {...parmas} />{txt}</span>
}
const getCensorColor = censor => {
  let color = 'red';
  if (censor) {
    switch (censor) {
      case CensorType.DISABLE.code:
        color = 'gray';
        break;
      case CensorType.ING.code:
        color = 'geekblue';
        break;
      case CensorType.RETURN.code:
        color = 'magenta';
        break;
      case CensorType.PASS.code:
        color = 'green';
        break;
      case CensorType.UNPASS.code:
        color = 'red';
        break;
      case CensorType.WAIT.code:
        color = 'blue';
        break;
      default:
        break;
    }
  }
  return color;
}

const renderStateTag = state => {
  const parmas = getStateColor(state);
  const txt = renderStateText(state)
  return <Tag {...parmas}>{txt}</Tag>
}
const renderSaleTag = sale => {
  const parmas = getSaleColor(sale);
  const txt = renderSaleText(sale)
  return <Tag {...parmas}>{txt}</Tag>
}
const renderCensorTag = censor => {
  const txt = renderCensorText(censor);
  const color = getCensorColor(censor);
  return <Tag color={color}>{txt}</Tag>
}

const getSingleButtonConfig = props => {
  const { property, record, tabActiveKey } = props;
  const { pickState, pickSale, pickCensor, pickProhibit, pickChange, pickOnlyChange } = property;
  const { Censor, State, Sale, Prohibit, Change } = AllButtonConfig;
  const { sale, state, censor, prohibit } = record;
  const config = [];
  // 有变化项目（编辑、更新等）
  if (pickChange && tabActiveKey !== 'recycle') {
    // 待审核与已驳回
    if ([CensorType.DISABLE.code, CensorType.RETURN.code].includes(censor)) {
      config.push(Change.EDIT)
    }
  }
  if (pickOnlyChange) {
    config.push(Change.EDIT)
  }
  if (pickProhibit) {
    switch (prohibit) {
      case ProhibitType.TRUE.code:
        config.push(Prohibit.OFF);
        break;
      case ProhibitType.FALSE.code:
        config.push(Prohibit.ON);
        break;
      default:
        break;
    }
  }
  // 只有 pickState 的时候
  if (pickState && (!pickCensor)) {
    switch (state) {
      case StateType.DISABLE.code:
        config.push(State.ENABLE)
        break;
      case StateType.ENABLE.code:
        config.push(State.LOCK)
        break;
      case StateType.LOCK.code:
        config.push(State.UNLOCK)
        config.push(State.DELETE)
        break;
      case StateType.RECYCLE.code:
        config.push(State.REVERT)
        config.push(State.REDELETE)
        break;
      default:
        break;
    }
  }
  // pickState存在且 pickCensor是 boolean 的时候
  else if (pickState && (typeof pickCensor === 'boolean')) {
    if (CensorType.PASS.code === censor) {
      switch (state) {
        case StateType.DISABLE.code:
          config.push(State.ENABLE)
          break;
        case StateType.ENABLE.code:
          config.push(State.LOCK)
          break;
        case StateType.LOCK.code:
          config.push(State.UNLOCK)
          config.push(State.DELETE)
          break;
        case StateType.RECYCLE.code:
          config.push(State.REVERT)
          config.push(State.REDELETE)
          break;
        default:
          break;
      }
    }
  }
  if (pickSale) {
    if (StateType.ENABLE.code === state) {
      switch (sale) {
        case SaleType.ON.code:
          config.push(Sale.OFF)
          break;
        case SaleType.DISABLE.code:
        case SaleType.OFF.code:
          config.push(Sale.ON)
          break;
        default:
          break;
      }
    }
  }
  if (pickCensor instanceof Array) {
    switch (censor) {
      case CensorType.WAIT.code:
        config.push(Censor.PASS)
        config.push(Censor[pickCensor[0]])
        break;
      case CensorType.DISABLE.code:
      case CensorType.PASS.code:
      case CensorType.UNPASS.code:
      case CensorType.ING.code:
      case CensorType.RETURN.code:
        break;
      default:
        break;
    }
  }
  return config;
}

const setDisabled = (props) => {
  const { config, prefix, action, boolean } = props;
  config.forEach(i => {
    if (i.prefix === prefix && i.action === action) {
      // eslint-disable-next-line no-param-reassign
      i.disabled = boolean;
    }
  })
}

const judgeRecycle = (props) => {
  const { config, selectedRows } = props;
  const { State } = BatchButtonConfig;
  const recycleLength = selectedRows.filter((item) => item.state === StateType.RECYCLE.code).length;
  if (recycleLength) {
    setDisabled({ config, ...State.REDELETE.FALSE })
    setDisabled({ config, ...State.REVERT.FALSE })
  }
  else {
    setDisabled({ config, ...State.REDELETE.TRUE })
    setDisabled({ config, ...State.REVERT.TRUE })
  }
  return config;
}

const judgeSale = (props) => {
  const { config, selectedRows } = props;
  const { Sale } = BatchButtonConfig;
  const onLength = selectedRows.filter((item) => item.sale === SaleType.ON.code).length;
  const offLength = selectedRows.filter((item) => item.sale === SaleType.OFF.code).length;
  const disableLength = selectedRows.filter((item) => item.sale === SaleType.DISABLE.code).length;
  if ([onLength, disableLength].filter(i => i > 0).length > 1 || [onLength, offLength].filter(i => i > 0).length > 1) {
    setDisabled({ config, ...Sale.ON.TRUE })
    setDisabled({ config, ...Sale.OFF.TRUE })
  } else if (disableLength || offLength) {
    setDisabled({ config, ...Sale.ON.FALSE })
  } else if (onLength) {
    setDisabled({ config, ...Sale.OFF.FALSE })
  } else {
    setDisabled({ config, ...Sale.ON.TRUE })
    setDisabled({ config, ...Sale.OFF.TRUE })
  }
  return config;
}

const judgeProhibit = (props) => {
  const { config, selectedRows } = props;
  const { Prohibit } = BatchButtonConfig;
  const offLength = selectedRows.filter((item) => item.prohibit === ProhibitType.TRUE.code).length;
  const onLength = selectedRows.filter((item) => item.prohibit === ProhibitType.FALSE.code).length;
  if ([onLength, offLength].filter(i => i > 0).length > 1) {
    setDisabled({ config, ...Prohibit.ON.TRUE })
    setDisabled({ config, ...Prohibit.OFF.TRUE })
  } else if (onLength) {
    setDisabled({ config, ...Prohibit.ON.FALSE })
  } else if (offLength) {
    setDisabled({ config, ...Prohibit.OFF.FALSE })
  } else {
    setDisabled({ config, ...Prohibit.ON.TRUE })
    setDisabled({ config, ...Prohibit.OFF.TRUE })
  }
  return config;
}

const judgeStateAfterCensor = (props) => {
  const { config, selectedRows } = props;
  const { State } = BatchButtonConfig;
  const disableLength = selectedRows.filter((item) => item.state === StateType.DISABLE.code).length;
  const enableLength = selectedRows.filter((item) => item.state === StateType.ENABLE.code).length;
  const lockLength = selectedRows.filter((item) => item.state === StateType.LOCK.code).length;
  const censorDisable = selectedRows.filter((item) => item.state === CensorType.DISABLE.code).length;
  const censorReturn = selectedRows.filter((item) => item.state === CensorType.RETURN.code).length;
  if ([censorDisable, censorReturn].filter(i => i > 0).length > 0) {
    return config;
  }
  if ([enableLength, lockLength, disableLength].filter(i => i > 0).length > 1) {
    setDisabled({ config, ...State.ENABLE.TRUE })
    setDisabled({ config, ...State.LOCK.TRUE })
    setDisabled({ config, ...State.UNLOCK.TRUE })
    setDisabled({ config, ...State.DELETE.TRUE })
  } else if (disableLength) {
    setDisabled({ config, ...State.ENABLE.FALSE })
  } else if (enableLength) {
    setDisabled({ config, ...State.LOCK.FALSE })
  } else if (lockLength) {
    setDisabled({ config, ...State.UNLOCK.FALSE })
    setDisabled({ config, ...State.DELETE.FALSE })
  } else {
    setDisabled({ config, ...State.ENABLE.TRUE })
    setDisabled({ config, ...State.LOCK.TRUE })
    setDisabled({ config, ...State.UNLOCK.TRUE })
    setDisabled({ config, ...State.DELETE.TRUE })
  }
  return config;
}

const judgeState = (props) => {
  const { config, selectedRows } = props;
  const { State } = BatchButtonConfig;
  const disableLength = selectedRows.filter((item) => item.state === StateType.DISABLE.code).length;
  const enableLength = selectedRows.filter((item) => item.state === StateType.ENABLE.code).length;
  const lockLength = selectedRows.filter((item) => item.state === StateType.LOCK.code).length;
  if ([enableLength, lockLength, disableLength].filter(i => i > 0).length > 1) {
    setDisabled({ config, ...State.ENABLE.TRUE })
    setDisabled({ config, ...State.LOCK.TRUE })
    setDisabled({ config, ...State.UNLOCK.TRUE })
    setDisabled({ config, ...State.DELETE.TRUE })
  } else if (disableLength) {
    setDisabled({ config, ...State.ENABLE.FALSE })
  } else if (enableLength) {
    setDisabled({ config, ...State.LOCK.FALSE })
  } else if (lockLength) {
    setDisabled({ config, ...State.UNLOCK.FALSE })
    setDisabled({ config, ...State.DELETE.FALSE })
  } else {
    setDisabled({ config, ...State.ENABLE.TRUE })
    setDisabled({ config, ...State.LOCK.TRUE })
    setDisabled({ config, ...State.UNLOCK.TRUE })
    setDisabled({ config, ...State.DELETE.TRUE })
  }
  return config;
}

const getBatchButtonConfig = props => {
  const { property, selectedRows, tabActiveKey } = props;
  const { BatchSale, BatchState, BatchProhibit, BatchCensor } = property;
  const { State, Sale, Prohibit } = AllButtonConfig;
  let config = [];
  // if ([CensorType.DISABLE.code, CensorType.RETURN.code].includes(censor)) {
  //   config.push(Change.EDIT)
  // }
  if (tabActiveKey === 'recycle') {
    config.push(State.REVERT)
    config.push(State.REDELETE)
    config = judgeRecycle({ config, selectedRows })
    return config;
  }
  if (BatchProhibit) {
    config.push(Prohibit.ON);
    config.push(Prohibit.OFF);
    config = judgeProhibit({ config, selectedRows })
  }
  if (BatchState && BatchCensor) {
    config.push(State.ENABLE)
    config.push(State.LOCK)
    config.push(State.UNLOCK)
    config.push(State.DELETE)
    config = judgeStateAfterCensor({ config, selectedRows })
  } else if (BatchState) {
    config.push(State.ENABLE)
    config.push(State.LOCK)
    config.push(State.UNLOCK)
    config.push(State.DELETE)
    config = judgeState({ config, selectedRows })
  }
  if (BatchSale) {
    config.push(Sale.OFF)
    config.push(Sale.ON)
    config = judgeSale({ config, selectedRows })
  }
  return config;
}

const renderFunctions = (props) => {
  const { property, record, onClick, tabActiveKey } = props;
  const config = getSingleButtonConfig({ property, record, tabActiveKey });
  return config.map(i =>
    <Button
      size='small'
      style={{ marginRight: "10px" }}
      type="primary"
      key={i.action}
      onClick={() => onClick({ ...i, record })}
    >
      {i.actionName}
    </Button>)
}

const renderBatchFunctions = (props) => {
  const { property, selectedRows, tabActiveKey, onClick } = props;
  const config = getBatchButtonConfig({ property, selectedRows, tabActiveKey });
  return config.map(i =>
    <Button
      style={{ marginRight: "10px" }}
      key={i.action}
      disabled={i.disabled}
      onClick={() => onClick({ ...i, record: selectedRows })}
    >
      {`批量${i.actionName}`}
    </Button>
  )
}


const formatImg = (content) => {
  const style = { width: 40, height: 40 }
  if (typeof content === 'string') {
    return <img alt="封面图" style={style} src={imgPrefix + content} />
  }
  if (typeof content === 'object' && content instanceof Array) {
    return (
      <div>{
        content.map(i => <img alt="图片" style={style} src={imgPrefix + i} key={i} />)
      }
      </div>
    )
  }
  return null;
}

const formatStringArray = (content) => {
  if (content) {
    return <div>{content.map(i => i)}</div>
  }
  return null;
}

const formatKey = (key) => {
  switch (key) {
    case 'account':
      return '账号';
    case 'notifyByEmail':
      return '邮件通知开通';
    case 'notifyByCellphone':
      return '短信通知开通';
    case 'website':
      return '网站';
    case 'esrCode':
      return 'ESR企业代码';
    case 'phone':
      return '固话';
    case 'licenseCompanyName':
      return '执照企业名称';
    case 'fax':
      return '传真';
    case 'companyName':
      return '企业名称';
    case 'cellphone':
      return '手机号码';
    case 'address':
      return '地址';
    case 'foundedDate':
      return '注册日期';
    case 'contacts':
      return '联系人';
    case 'productName':
      return '商品名称';
    case 'token':
      return 'token';
    case 'brand':
      return '品牌';
    case 'categoryName':
    case 'categoryNames':
      return '分类';
    case 'regionNames':
      return '地区';
    case 'censor':
      return '审核状态'
    case 'sale':
      return '上架状态'
    case 'state':
      return '启用状态'
    case 'saleDate':
      return '上架时间'
    case 'coverImage':
      return '封面图';
    case 'images':
      return '图片'
    case 'createDate':
      return '创建时间';
    case 'markets':
      return '出口市场'
    case 'description':
      return '描述'
    case 'model':
      return '型号'
    case 'price':
      return '出厂价'
    case 'specs':
      return '规格'
    case 'unit':
      return '单位'
    case 'prohibit':
      return '禁用';
    case 'language':
      return '语言';
    case 'country':
      return '国家';
    case 'email':
      return '邮箱';
    case 'marks':
      return '标签';
    case 'logoImage':
      return '企业LOGO';
    case 'sequence':
      return '排序';
    case 'depth':
      return '深度';
    case 'code':
      return '代码';
    case 'name':
      return '名称';
    case 'context':
      return '内容';
    default:
      return null;
  }
}

const formatStringToArray = (string) => {
  if (string instanceof Array) {
    return string;
  }
  return string && string.split(',')
};

// eslint-disable-next-line react/no-danger
const formatDescription = (cotent) => <div dangerouslySetInnerHTML={{ __html: cotent }} />

const formatContent = (props) => {
  const { key, content, uncommitted } = props;
  if (content || content === 0 || content === false) {
    if (uncommitted) {
      switch (key) {
        case 'saleDate':
        case 'createDate':
        case 'foundedDate':
          return content.format("YYYY-MM-DD HH:mm:ss.SSS");
        case 'markets':
          return formatStringToArray(content);
        default:
          return content
      }
    } else {
      switch (key) {
        case 'sequence':
        case 'website':
        case 'esrCode':
        case 'phone':
        case 'licenseCompanyName':
        case 'fax':
        case 'companyName':
        case 'cellphone':
        case 'address':
        case 'contacts':
        case 'country':
        case 'email':
        case 'token':
        case 'productName':
        case 'brand':
        case 'model':
        case 'price':
        case 'specs':
        case 'unit':
        case 'categoryName':
        case 'depth':
        case 'marks':
        case 'account':
        case 'code':
        case 'name':
          return content;
        case 'language':
          return formatLanguage(content);
        case 'censor':
          return renderCensorTag(content)
        case 'sale':
          return renderSaleTag(content);
        case 'state':
          return renderStateTag(content);
        case 'markets':
        case 'categoryNames':
        case 'regionNames':
          return formatStringArray(content);
        case 'prohibit':
        case 'notifyByEmail':
        case 'notifyByCellphone':
          return renderProhibitText(content);
        case 'coverImage':
        case 'images':
        case 'logoImage':
          return formatImg(content);
        case 'saleDate':
        case 'createDate':
        case 'foundedDate':
          return formatTime(content)
        case 'description':
        case 'context':
          return formatDescription(content)
        default:
          return null;
      }
    }
  } else {
    switch (key) {
      case 'categoryNames':
      case 'regionNames':
      case 'markets':
      case 'images':
        return [];
      case 'saleDate':
      case 'createDate':
      case 'foundedDate':
        return null;
      default:
        return '';
    }
  }
}

const formatSelectOption = (props) => {
  const { array = [], label, value } = props;
  const result = [];
  array.forEach(i => result.push({ 'label': i[label], 'value': i[value] }))
  return result
}

const formatInitialFormData = (initialFormData) => {
  const result = {};
  Object.keys(initialFormData).forEach(key => {
    switch (key) {
      case 'saleDate':
      case 'createDate':
      case 'foundedDate':
        result[key] = moment(initialFormData[key], "YYYY-MM-DD HH:mm:ss.SSS");
        break;
      default:
        result[key] = initialFormData[key];
        break;
    }
  })
  return result;
}

const formatFieldValue = (fieldValue) => {
  const params = {};
  Object.keys(fieldValue).forEach(key => {
    params[key] = formatContent({ uncommitted: true, key, content: fieldValue[key] })
  })
  return params;
}

const renderTitle = (modalState) => {
  switch (modalState) {
    case 'Add':
      return '新增';
    case 'Edit':
      return '编辑';
    case 'AddSign':
      return '新增/编辑标签';
    case 'AddSequence':
      return '新增/编辑排序';
    case 'Detail':
      return '详情';
    case 'AddLanguage':
      return '添加语言';
    default:
      return '异常';
  }
}

const renderContent = (content) => Object.keys(content).map(key => <Descriptions.Item key={key} label={formatKey(key)}>{formatContent({ key, content: content[key] })}</Descriptions.Item>)

const productLanguageTemplate = ['brand', 'description', 'productName', 'saleDate', 'specs', 'unit']
const renderPickProductLanguage = content => _.pick(content, productLanguageTemplate)
const renderOmitProductLanguage = content => _.omit(content, Object.assign([], productLanguageTemplate, ['token']))

const enterpriseLanguageTemplate = ['address', 'companyName', 'contacts', 'description', 'foundedDate', 'regionNames']
const renderPickEnterpriseLanguage = content => _.pick(content, enterpriseLanguageTemplate)
const renderOmitEnterpriseLanguage = content => _.omit(content, Object.assign([], enterpriseLanguageTemplate, ['token']))

const categoryLanguageTemplate = ['categoryName', 'description']
const renderPickCategoryLanguage = content => _.pick(content, categoryLanguageTemplate)
const renderOmitCategoryLanguage = content => _.omit(content, Object.assign([], categoryLanguageTemplate, ['token']))

const renderItemContent = (content) => content instanceof Array ? content.map(item => (
  <Descriptions column={12} key={item.token}>
    {
      Object.keys(_.omit(item, ['token'])).map(key => <Descriptions.Item key={key} label={formatKey(key)}>{formatContent({ key, content: item[key] })}</Descriptions.Item>)
    }
  </Descriptions>
))
  :
  (
    <Descriptions column={12}>
      {
        Object.keys(_.omit(content, ['token'])).map(key => <Descriptions.Item key={key} label={formatKey(key)}>{formatContent({ key, content: content[key] })}</Descriptions.Item>)
      }
    </Descriptions>
  )


const formatTokensData = (data) => {
  let tokens = [];
  if (data instanceof Array) {
    data.forEach(i => tokens.push(i.token))
  } else {
    tokens.push(data.token)
  }
  tokens = tokens.length > 1 ? tokens.join(',') : tokens.toString();
  return tokens
}

const renderErrorHtml = (props) => {
  const { errorContents } = props;
  return (
    <div>
      {errorContents.map(i => <span key={i} style={{ marginRight: '5px' }}>{i}</span>)}
    </div>
  )
}

const renderErrorItems = (props) => {
  const { content, error, showName } = props;
  const errorTokens = [];
  const errorContents = [];
  error.forEach(i => errorTokens.push(i.token));
  errorTokens.forEach(errToken => {
    if (content instanceof Array) {
      content.forEach(item => {
        if (errToken === item.token) {
          errorContents.push(item[showName])
        }
      })
    } else {
      errorContents.push(content[showName])
    }
  })
  return renderErrorHtml({ errorContents });
}


const handleRes = (props) => {
  const { res, actionName, record, showName, freshData, cleanRows, pagination, onCancel } = props;
  const { currentPage, pageSize, total } = pagination;
  const page = currentPage - 1;
  const { batchTotal, code, error, success, } = res;
  if (code === 0) {
    if (batchTotal === 0) {
      if (success.length > 0) {
        message.success(`${actionName}成功`);
        if (cleanRows) { cleanRows() }
        if (onCancel) { onCancel() }
        if (freshData) { freshData({ page, size: pageSize }) }
      }
    } else if (batchTotal > 0) {
      notification.open({
        message: `下面的内容${actionName}失败`,
        type: 'warning',
        description: renderErrorItems({ content: record, error, showName }),
        onClick: () => {
          if (freshData) { freshData({ page, size: pageSize }) }
          if (onCancel) { onCancel() }
        },
      })
    } else {
      message.success(`${actionName}成功`);
      if (cleanRows) { cleanRows({ page, size: pageSize }) }
      if (onCancel) { onCancel() }
      if (freshData) { freshData({ page, size: pageSize }) }
    }
  }
}

const formatSource = (arr) => {
  const result = [];
  if (arr) {
    arr.forEach(i => {
      Source.forEach(source => {
        if (i.source === source.value) {
          result.push({
            count: i.count,
            source: source.name,
          })
        }
      })
    })
  }
  return result;
}

const getCensorConfig = (configs) => {
  const { Censor } = AllButtonConfig;
  const result = [];
  if (configs && configs.length) {
    configs.forEach(config => {
      result.push(Censor[config])
    })
  }
  return result;
}

const renderCensorButton = (props) => {
  const { onCancel, record, onOperation, pickCensor } = props;
  const { censor } = record;
  if (censor === CensorType.PASS.code) {
    return [<Button key="close" onClick={onCancel}>关闭</Button>]
  }
  const config = getCensorConfig(pickCensor)
  return config.map(i =>
    <Button
      style={{ marginRight: "10px" }}
      type="primary"
      key={i.action}
      onClick={() => onOperation({ ...i, record })}
    >
      {i.actionName}
    </Button>)
}

const renderProhibitInTable = (props) => {
  const { record, name } = props;
  if (name === 'language') {
    return record && record.prohibit ?
      <Badge count={<Icon type="exclamation-circle" style={{ color: '#8c8c8c', paddingLeft: '20px' }} theme="filled" title="已禁用" />}>
        {formatLanguage(record[name])}
      </Badge> : formatLanguage(record[name])
  }
  return record && record.prohibit ?
    <Badge count={<Icon type="exclamation-circle" style={{ color: '#8c8c8c', paddingLeft: '20px' }} theme="filled" title="已禁用" />}>
      {record[name]}
    </Badge> : record[name]
}

const renderProhibitByAlert = (prohibit) => prohibit ? <Alert message="已禁用" type="warning" showIcon style={{ marginBottom: '5px' }} /> : null

const formatRes = (res) => {
  if (!res) return false;
  if (res.elems) {
    return res.elems;
  }
  if (res.elem) return res.elem
  return false;
}

export {
  handleRes,
  formatRes,
  formatTime,
  formatKey,
  formatSource,
  formatContent,
  formatLanguage,
  formatFieldValue,
  formatTokensData,
  formatSelectOption,
  formatInitialFormData,
  renderItemContent,
  formatStringArray,
  renderContent,
  renderTitle,
  renderCensorTag,
  renderStateTag,
  renderSaleTag,
  renderStatus,
  renderProhibitText,
  renderBatchFunctions,
  renderFunctions,
  renderPickProductLanguage,
  renderOmitProductLanguage,
  renderPickEnterpriseLanguage,
  renderOmitEnterpriseLanguage,
  renderPickCategoryLanguage,
  renderOmitCategoryLanguage,
  renderCensorButton,
  renderProhibitInTable,
  renderProhibitByAlert
}
