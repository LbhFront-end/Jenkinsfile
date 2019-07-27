import { stringify } from 'qs';
import request from '@/utils/request';

// 获取商品列表
export async function getProducts(params){
  return request(`/api/admin/products?${stringify(params)}`)
}
// 商品回收站列表
export async function getProductByRecycle(params){
  return request(`/api/admin/products/recycle?${stringify(params)}`)
}
// 获取商品单项详情
export async function getProductDetail(params){
  return request(`/api/admin/product/${params.productTokens}/detail`)
}
// 商品操作：审核（通过驳回）、启用、禁用
export async function operation(params) {
  return request(`/api/admin/product/${params.productTokens}/${params.prefix}/${params.action}`, {
    method: 'PATCH',
    data:params,
  });
}
