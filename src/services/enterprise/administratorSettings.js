import { stringify } from 'qs';
import request from '@/utils/request';

// 获取成员列表
export async function getAdministratorSettingss(params){
  return request(`/api/enterprise/company/${params.companyToken}/members?${stringify(params)}`)
}
// 获取成员单项详情
// export async function getAdministratorSettingsDetail(params){
//   return request(`/api/enterprise/company/${params.companyToken}/member/memberToken/detail?${stringify(params)}`)
// }
// 获取成员单项表单
// export async function getAdministratorSettingsForm(params){
//   return request(`/api/enterprise/company/${params.companyToken}/member/memberToken/form?${stringify(params)}`)
// }
// 成员获取选项
export async function getOpts(params){
  return request(`/api/enterprise/company/${params.companyToken}/managers/opts?${stringify(params)}`)
}
// 成员回收站列表
export async function getAdministratorSettingsByRecycle(params){
  return request(`/api/enterprise/company/${params.companyToken}/members/recycle?${stringify(params)}`)
}
// 成员添加
export async function add(params) {
  return request(`/api/enterprise/company/${params.companyToken}/member?submit=${params.submit}`, {
    method: 'POST',
    data: params,
  });
}
// 成员更新
// export async function update(params) {
//   return request(`/api/enterprise/company/${params.companyToken}/member/${params.memberTokens}?${stringify(params)}`, {
//     method: 'PUT',
//     body: {
//       ...params,
//       method: 'PUT',
//     },
//   });
// }
// 成员销售：上下架,锁定、解锁、删除、还原、清除
export async function operation(params) {
  return request(`/api/enterprise/company/${params.companyToken}/member/${params.memberTokens}/${params.prefix}/${params.action}`, {
    method: 'PATCH',
    body: {
      ...params,
      method: 'PATCH',
    },
  });
}
