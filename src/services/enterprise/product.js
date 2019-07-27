import { stringify } from 'qs';
import request from '@/utils/request';


// 获取商品列表
export async function getProducts(params) {
  return request(`/api/enterprise/company/${params.companyToken}/products?${stringify(params)}`)
}
// 获取商品单项详情
export async function getProductDetail(params) {
  return request(`/api/enterprise/company/${params.companyToken}/product/${params.productTokens}/detail?${stringify(params)}`)
}
// 获取商品单项表单
export async function getProductForm(params) {
  return request(`/api/enterprise/company/${params.companyToken}/product/${params.productTokens}/form?${stringify(params)}`)
}
// 商品获取选项
export async function getOpts(params) {
  return request(`/api/enterprise/company/${params.companyToken}/products/opts?${stringify(params)}`)
}
// 商品回收站列表
export async function getProductByRecycle(params) {
  return request(`/api/enterprise/company/${params.companyToken}/products/recycle?${stringify(params)}`)
}
// 商品添加
export async function add(params) {
  return request(`/api/enterprise/company/${params.companyToken}/product?submit=${params.submit}`, {
    method: 'POST',
    data: params,
  });
}
// 商品更新
export async function update(params) {
  return request(`/api/enterprise/company/${params.companyToken}/product/${params.productTokens}?submit=${params.submit}`, {
    method: 'PUT',
    data: params
  });
}
// 商品销售：上下架,锁定、解锁、删除、还原、清除
export async function operation(params) {
  return request(`/api/enterprise/company/${params.companyToken}/product/${params.productTokens}/${params.prefix}/${params.action}`, {
    method: 'PATCH',
  });
}
