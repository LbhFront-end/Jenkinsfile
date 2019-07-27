import { stringify } from 'qs';
import request from '@/utils/request';

// 获取企业语言列表
export async function getEnterpriseLanguage(params){
  return request(`/api/admin/company/languages/?${stringify(params)}`)
}
// 获取企业语言列表(回收站)
export async function getEnterpriseLanguageByRecycle(params){
  return request(`/api/admin/company/languages/recycle?${stringify(params)}`)
}
// 获取企业语言单项详情
export async function getEnterpriseLanguageDetail(params){
  return request(`/api/admin/company/language/${params.languageTokens}/detail`)
}
// 企业语言操作：审核（通过，驳回）、启用、禁用
export async function operationLanguage(params) {
  return request(`/api/admin/company/language/${params.languageTokens}/${params.prefix}/${params.action}`, {
    method: 'PATCH',
    data:params,
  });
}
