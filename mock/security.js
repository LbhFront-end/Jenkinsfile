import { parse } from 'url';
import { CommonEnum } from '../src/utils/Enum'


export default {
  // ESR 获取企业管理员
  'GET /enterprise/company/:companyTokens/managers/opts': (req, res) => {
    const { companyToken } = req.params;
    res.send({
      "code": 0,
      "elemTotal": 0,
      "elems": [
        {
          "account": "ESR账号",
          "userName": "某某某"
        }
      ]
    })
  },
  // 登录
  'POST /enterprise/login': (req, res) => {
    const { account, password } = req.body;
    res.send(
      {
        "code": 0,
        "elem": {
          account,
          "companyName": "公司名称1",
          "companyToken": "公司token",
          "gender": "DEFAULT",
          "imageUrl": "string",
          "root": true,
          "userName": "用户名"
        }
      }
    )
  },
  // 企业注册
  'POST /enterprise/regiser': (req, res) => {
    const {
      account,
      company,
      password,
    } = req.body;
    res.send({
      "code": 0,
      "elem": {
        ...company
      },
      "token": "string"
    })
  },
  // 企业ESR注册
  'POST /enterprise/register/esr': (req, res) => {
    const {
      account,
      company,
      password,
    } = req.body;
    res.send({
      "code": 0,
      "elem": {
        ...company
      },
      "token": "string"
    })
  },

}



