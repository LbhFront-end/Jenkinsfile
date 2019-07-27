import { stringify } from 'qs';
import request from '@/utils/request';

// 获取商品语言列表
export async function getProductLanguage(params) {
  return request(`/api/enterprise/company/${params.companyToken}/product/languages?${stringify(params)}`)
}
// 获取商品语言列表(回收站)
export async function getProductLanguageByRecycle(params) {
  return request(`/api/enterprise/company/${params.companyToken}/product/languages/recycle?${stringify(params)}`)
}
// 获取商品选项
export async function getProductOpts(params) {
  return request(`/api/enterprise/company/${params.companyToken}/products/opts?${stringify(params)}`)
}

// 获取商品语言单项详情
export async function getProductLanguageDetail(params) {
  return request(`/api/enterprise/company/${params.companyToken}/product/language/${params.languageTokens}/detail`)
}
// 获取商品语言单项表单
export async function getProductLanguageForm(params) {
  return request(`/api/enterprise/company/${params.companyToken}/product/language/${params.languageTokens}/form`)
}
// 商品语言添加
export async function addLanguage(params) {
  return request(`/api/enterprise/company/${params.companyToken}/product/${params.productTokens}/language?submit=${params.submit}`, {
    method: 'POST',
    data: params,
  });
}
// 商品语言更新
export async function updateLanguage(params) {
  return request(`/api/enterprise/company/${params.companyToken}/product/language/${params.languageTokens}?submit=${params.submit}`, {
    method: 'PUT',
    data: params,
  });
}
// 商品语言操作：删除/锁定/解锁/清除/还原/解锁
export async function operationLanguage(params) {
  return request(`/api/enterprise/company/${params.companyToken}/language/${params.languageTokens}/${params.prefix}/${params.action}`, {
    method: 'PATCH',
    data: params,
  });
}
