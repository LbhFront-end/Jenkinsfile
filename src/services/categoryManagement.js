import { stringify } from 'qs';
import request from '@/utils/request';

// 获取分类列表
export async function getCategorys(params) {
  return request(`/api/admin/categories?${stringify(params)}`)
}
// 获取分类单项详情
export async function getCategoryDetail(params) {
  return request(`/api/admin/category/${params.categoryTokens}/detail`)
}
// 获取分类单项表单
export async function getCategoryForm(params) {
  return request(`/api/admin/category/${params.categoryTokens}/form`)
}
// 分类获取选项
export async function getOpts() {
  return request(`/api/admin/categories/opts`)
}
// 分类回收站列表
export async function getCategoryByRecycle(params) {
  return request(`/api/admin/categories/recycle?${stringify(params)}`)
}
// 分类添加
export async function add(params) {
  return request(`/api/admin/category?submit=${params.submit}`, {
    method: 'POST',
    data: params,
  });
}
// 分类更新
export async function update(params) {
  return request(`/api/admin/category/${params.categoryTokens}?submit=${params.submit}`, {
    method: 'PUT',
    data: params,
  });
}
// 分类操作：删除/锁定/解锁/清除/还原/解锁/启用
export async function operation(params) {
  return request(`/api/admin/category/${params.categoryTokens}/${params.prefix}/${params.action}`, {
    method: 'PATCH',
    data: params,
  });
}
export async function sequence(params) {
  return request(`/api/admin/category/${params.categoryTokens}/sequence?sequence=${params.sequence}`, {
    method: 'PATCH',
    data: params,
  });
}

