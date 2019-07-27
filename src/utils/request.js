/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import { extend } from 'umi-request';
import { notification } from 'antd';
import router from 'umi/router';

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  401001: '未认证（未登录）',
  401002: '账号未注册（手机号码或者邮箱地址）',
  401003: '账号密码不匹配',
  401004: '账号被禁用',
  401005: '用户信息缓存失效',
  403: '用户得到授权，但是访问是被禁止的。',
  403001: '网关超时。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  404001: '不存在',
  406: '请求的格式不可得。',
  409002: '不可编辑',
  409003: '编辑超时',
  409101: '批处理不可操作',
  409301: '级数超出设置',
  409302: '级数不等于设置',
  410: '请求的资源被永久删除，且不会再得到的。',
  417001: '见响应字段 message',
  422: '当创建一个时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

// const renderDialogByStatus = response => {
//   if (response.status >= 200 && response.status < 300) {
//     return;
//   }
//   const errortext = codeMessage[response.status] || response.statusText;
//   notification.error({
//     message: `请求错误 ${response.status}: ${response.url}`,
//     description: errortext,
//   });
//   const error = new Error(errortext);
//   error.name = response.status;
//   error.response = response;
//   throw error;
// };


const errorHandler = error => {
  const statusReg = /(401|403|404|409|417)/;
  const { response = {}, data } = error;
  const errortext = codeMessage[response.status] || response.statusText;
  const { status, url } = response;
  const description = data.message || codeMessage[data.code] || errortext;
  if (statusReg.test(status)) {
    if (status === 401) {
      notification.error({
        message: description,
        duration: 3,
        onClose: router.push('/enterprise/user/login')
      })
      return;
    }
    notification.error({
      message: description,
    })
    return;
  }
  // 生产
  notification.error({
    message: "服务器繁忙",
    description: "请稍后再试",
  })
}

const request = extend({
  errorHandler,
  credentials: 'include'
})


request.interceptors.response.use((response, options) => {
  // console.log(options);
  return response;
});

export default request;
