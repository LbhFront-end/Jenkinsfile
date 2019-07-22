import { stringify } from 'qs';
import request from '@/utils/request';

// 获取商品语言列表
export async function getProductLanguage(params) {
  return request(`/api/admin/product/languages/?${stringify(params)}`)
}
// 获取商品语言列表(回收站)
export async function getProductLanguageByRecycle(params) {
  return request(`/api/admin/product/languages/recycle?${stringify(params)}`)
}
// 获取商品语言单项详情
export async function getProductLanguageDetail(params) {
  return request(`/api/admin/product/language/${params.languageTokens}/detail`)
}
// 商品语言操作：审核（通过，驳回）、启用、禁用
export async function operationLanguage(params) {
  return request(`/api/admin/product/language/${params.languageTokens}/${params.prefix}/${params.action}`, {
    method: 'PATCH',
    data: params,
  });
}
