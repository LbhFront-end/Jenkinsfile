import { stringify } from 'qs';
import request from '@/utils/request';

// 统计获取商品指标
export async function getIndicatorProduct() {
  return request(`/api/admin/statistics/metrics/product`)
}

// 商品增长图
export async function getGraph(params) {
  return request(`/api/admin/statistics/${params.line}/product/${params.type}?${stringify(params)}`)
}

// 获取商品分类分布
export async function getCategory(params) {
  return request(`/api/admin/statistics/chart/product/category?${stringify(params)}`)
}

// 获取商品企业分布
export async function getCompany(params) {
  return request(`/api/admin/statistics/chart/product/company?${stringify(params)}`)
}

// 获取商品浏览分布
export async function getViewTimes(params) {
  return request(`/api/admin/statistics/chart/product/viewTimes?${stringify(params)}`)
}
