import { stringify } from 'qs';
import request from '@/utils/request';

// 获取询问列表
export async function getAsks(params) {
  return request(`/api/enterprise/company/${params.companyToken}/asks?${stringify(params)}`)
}
// 获取询问单项详情
export async function getAskDetail(params) {
  return request(`/api/enterprise/company/${params.companyToken}/ask/${params.askTokens}/detail?${stringify(params)}`)
}
// 获取询问单项表单
// export async function getAskForm(params){
//   return request(`/api/enterprise/company/${params.companyToken}/ask/${params.askTokens}/form?${stringify(params)}`)
// }
// 询问获取选项
// export async function getOpts(params){
//   return request(`/api/enterprise/company/${params.companyToken}/asks/opts?${stringify(params)}`)
// }
// 询问更新添加标签
export async function sign(params) {
  console.log(params);
  return request(`/api/enterprise/company/${params.companyToken}/ask/${params.askTokens}/sign?submit=${params.submit}`, {
    method: 'POST',
    data: params,
  })
}

// 询问回收站列表
export async function getAskByRecycle(params) {
  return request(`/api/enterprise/company/${params.companyToken}/asks/recycle?${stringify(params)}`)
}
// 询问添加
// export async function add(params) {
//   return request(`/api/enterprise/company/${params.companyToken}/ask?${stringify(params)}`, {
//     method: 'POST',
//     body: {
//       ...params,
//       method: 'POST',
//     },
//   });
// }
// 询问更新
// export async function update(params) {
//   return request(`/api/enterprise/company/${params.companyToken}/ask/${params.askTokens}s?${stringify(params)}`, {
//     method: 'PUT',
//     body: {
//       ...params,
//       method: 'PUT',
//     },
//   });
// }
// 询问销售：上下架,锁定、解锁、删除、还原、清除
export async function operation(params) {
  return request(`/api/enterprise/company/${params.companyToken}/ask/${params.askTokens}/${params.prefix}/${params.action}`, {
    method: 'PATCH',
    data: params,
  });
}
