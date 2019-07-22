import { stringify } from 'qs';
import request from '@/utils/request';

// 获取分类语言列表
export async function getCategoryLanguage(params) {
  return request(`/api/admin/category/languages?${stringify(params)}`)
}
// 分类语言回收站列表
export async function getCategoryLanguageByRecycle(params) {
  return request(`/api/admin/category/languages/recycle?${stringify(params)}`)
}
// 获取分类语言单项表单
export async function getCategoryLanguageForm(params) {
  return request(`/api/admin/category/language/${params.languageTokens}/form`)
}

// 获取分类语言单项详情
export async function getCategoryLanguageDetail(params) {
  return request(`/api/admin/category/language/${params.languageTokens}/detail`)
}

// 分类语言添加
export async function add(params) {
  return request(`/api/admin/category/${params.categoryToken}/language?submit=${params.submit}`, {
    method: 'POST',
    data: params,
  });
}
// 分类语言更新
export async function update(params) {
  return request(`/api/admin/category/language/${params.languageTokens}?submit=${params.submit}`, {
    method: 'PUT',
    data: params,
  });
}
// 分类语言操作：删除/锁定/解锁/清除/还原/解锁/启用
export async function operation(params) {
  return request(`/api/admin/category/language/${params.languageTokens}/${params.prefix}/${params.action}`, {
    method: 'PATCH',
    data: params,
  });
}

