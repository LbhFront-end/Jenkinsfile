export default{
  // 企业获取单项（表单）
  'GET /enterprise/company/:companyToken/form': (req, res) => {
    const {companyToken='enterpriseID'} = req.params;
    res.send({
      "code": 0,
      "elem": {
        companyToken,
        "address": "详细地址详细地址详细地址详细地址（不为空，长度小于200）",
        "cellphone": "188260798632",
        "companyName": "企业名（长度小于100）",
        "contacts": "联系人（长度小于50）",
        "description": "企业简介企业简介企业简介企业简介企业简介（长度小于500）",
        "email": "7974321378@qq.com",
        "fax": "32362-321321321",
        "foundedDate": "2019-06-11T02:33:03.529Z",
        "notifyByCellphone": true,
        "notifyByEmail": true,
        "phone": "0663-32367324",
        "regionNames": [
          "string"
        ],
        "regionToken": "string",
        "website": "http://laibh.top"
      },
      "token": "string"
    })
  },
  // 企业获取单项（详情）
  'GET /enterprise/company/:companyToken/detail': (req, res) => {
    const {companyToken='enterpriseID'} = req.params;
    res.send({
      "code": 0,
      "elem": {
        "address": "详细地址详细地址详细地址详细地址详细地址",
        "cellphone": "188454578",
        "companyName": "企业名企业名",
        "contacts": "联系人A",
        "description": "企业简介企业简介简介简介企业简介企业简介简介简介",
        "email": "479127894@qq.com",
        "esrCode": "ESR企业代码",
        "fax": "312321-3213213",
        "foundedDate": "2019-06-11T02:48:11.765Z",
        "languages": [
          {
            "address": "详细地址详细地址详细地址详细地址",
            "censor": "DISABLE",
            "companyName": "公司名称公司名称",
            "contacts": "联系人联系人",
            "description": "企业简介企业简介企业简介",
            "foundedDate": "2019-06-11T02:48:11.765Z",
            "language": "ZH_CN",
            "regionNames": [
              "string"
            ],
            "state": "DISABLE",
            "token": 'UUID'
          }
        ],
        "licenseCompanyName": "string",
        "notifyByCellphone": true,
        "notifyByEmail": true,
        "phone": "string",
        "regionNames": [
          "string"
        ],
        "website": "http://laibh.top"
      }
    })
  },
  // 企业更新
  'PUT /enterprise/company/:companyToken': (req, res) => {
    const {
    address,
    cellphone,
    componyName,
    contacts,
    description,
    email,
    fax,
    foundedData,
    notifyByCellphone,
    notifyByEmail,
    phone,
    regionNames,
    regionToken,
    website
  } = req.body;
  const {companyToken='enterpriseID',submit} = req.params;
    res.send({
      "code": 0,
      "elem": {
        address,
        cellphone,
        componyName,
        contacts,
        description,
        email,
        fax,
        foundedData,
        notifyByCellphone,
        notifyByEmail,
        phone,
        regionNames,
        regionToken,
        website,
        submit
      },
      "token": companyToken
    })
  },
  // 企业邮件通知（启用）
  'PATCH /enterprise/company/:companyToken/email/notice/on': (req, res) => {
    const {companyToken='enterpriseID'} = req.params;
    res.send({
      "batchTotal": 0,
      "code": 0,
      "error": [
        {
          "code": 0,
          "message": "string",
          "token": "string"
        }
      ],
      "success": [
        {
          "token": companyToken
        }
      ]
    })
  },
  // 企业邮件通知（停用）
  'PATCH /enterprise/company/:companyToken/email/notice/off': (req, res) => {
    const {companyToken='enterpriseID'} = req.params;
    res.send({
      "batchTotal": 0,
      "code": 0,
      "error": [
        {
          "code": 0,
          "message": "string",
          "token": "string"
        }
      ],
      "success": [
        {
          "token": companyToken
        }
      ]
    })
  },
  // 企业短信通知（启用）
  'PATCH /enterprise/company/:companyToken/cellphone/notice/on': (req, res) => {
    const {companyToken='enterpriseID'} = req.params;
    res.send({
      "batchTotal": 0,
      "code": 0,
      "error": [
        {
          "code": 0,
          "message": "string",
          "token": "string"
        }
      ],
      "success": [
        {
          "token": companyToken
        }
      ]
    })
  },
  // 企业短信通知（停用）
  'PATCH /enterprise/company/:companyToken/cellphone/notice/off': (req, res) => {
    const {companyToken='enterpriseID'} = req.params;
    res.send({
      "batchTotal": 0,
      "code": 0,
      "error": [
        {
          "code": 0,
          "message": "string",
          "token": "string"
        }
      ],
      "success": [
        {
          "token": companyToken
        }
      ]
    })
  },
  // 企业语言
  // 企业语言获取单项（表单）
  'GET /enterprise/company/:companyToken/language/{languageToken}': (req, res) => {
    const {languageToken="EN"} = req.params;
    res.send({
      "code": 0,
      "elem": {
        "address": "详细地址详细地址",
        "companyName": "企业名企业名",
        "contacts": "联系人",
        "description": "企业简介",
        "foundedDate": "2019-06-11T03:03:06.378Z",
        "language": languageToken
      },
      "token": languageToken
    })
  },
  // 企业语言更新（表单）
  'POST /enterprise/company/:companyToken/language/{languageToken}': (req, res) => {
    // const {companyToken='enterpriseID'} = req.params;
    const {address,companyName,contacts,description,foundedData,language="EN"} = req.body;
    res.send({
      "code": 0,
      "elem": {
        address,
        companyName,
        contacts,
        description,
        foundedData,
        language
      },
      "token": language
    })
  },
  // 企业语言新增
  'POST /enterprise/company/:companyToken/language': (req, res) => {
    // const {companyToken='enterpriseID'} = req.params;
    const {address,companyName,contacts,description,foundedData,language="EN"} = req.body;
    res.send({
      "code": 0,
      "elem": {
        address,
        companyName,
        contacts,
        description,
        foundedData,
        language
      },
      "token": language
    })
  },
}
