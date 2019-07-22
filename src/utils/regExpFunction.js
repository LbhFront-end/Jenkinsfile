const typeReg = /(object|array|number|string|boolean|regexp)/;

const getRequired = props => {
  const { label, required, type } = props;
  if (typeReg.test(type)) {
    return {
      type,
      required,
      message: `${label}不可为空`,
    }
  }
  return {
    required,
    message: `${label}不可为空`,
  }
}

const getLength = (props) => {
  const { max, min, label, type } = props;
  if (typeReg.test(type)) {
    if (max && min >= 0) {
      return {
        type,
        min,
        max,
        message: `${label}长度在${min}与${max}之间`,
      }
    }
    if (max && !min) {
      return {
        type,
        max,
        message: `${label}长度应小于${max}`,
      }
    }
    if (!max && min) {
      return {
        type,
        min,
        message: `${label}长度应大于${max}`,
      }
    }
  } else {
    if (max && min >= 0) {
      return {
        min,
        max,
        message: `${label}长度在${min}与${max}之间`,
      }
    }
    if (max && !min) {
      return {
        max,
        message: `${label}长度应小于${max}`,
      }
    }
    if (!max && min) {
      return {
        min,
        message: `${label}长度应大于${max}`,
      }
    }
  }

  return [];

}

const getType = (type) => {
  switch (type) {
    case 'cellphone':
      return {
        pattern: /^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,1,2,5-9])|(177))\d{8}$/,
        message: '请输入11位正确格式的手机号码'
      };
    case 'phone':
      return {
        pattern: /^0\d{2,3}-\d{7,8}(|([-\u8f6c]{1}\d{1,5}))$/,
        message: '请输入正确格式的固定电话(xxx-xxxxxxxx)'
      };
    case 'email':
      return {
        pattern: /([a-z0-9A-Z]+[-|\.]?)+[a-z0-9A-Z]@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\.)+[a-zA-Z]{2,}$/,
        message: '请输入正确格式的邮箱地址'
      };
    case 'fax':
      return {
        pattern: /^0\d{2,3}-\d{7,8}(|([-\u8f6c]{1}\d{1,5}))$/,
        message: '请输入正确格式的传真电话(xxx-xxxxxxxx)'
      };
    case 'url':
      return {
        pattern: /^((https|http|ftp|rtsp|mms){0,1}(:\/\/){0,1})www\.(([A-Za-z0-9-~]+)\.)+([A-Za-z0-9-~\/])+$/,
        message: '请输入正确格式的网站'
      }
    default:
      return [];
  }
}

const getRules = (props) => {
  const rules = []
  const { required, label, min, max, type } = props;
  const typeRule = getType(type);
  const lengthRule = getLength({ label, min, max, type })

  rules.push(getRequired({ label, required, type }))

  if (lengthRule.length !== 0) {
    rules.push(lengthRule)
  }
  if (typeRule.length !== 0) {
    rules.push(typeRule)
  }
  return rules;
}

export default getRules;
