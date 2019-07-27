import { stringify } from 'qs';
import request from '@/utils/request';

// 统计获取询问指标
export async function getIndicatorAsk() {
  return request(`/api/admin/statistics/metrics/ask`)
}

// 询问增长图
export async function getGraph(params) {
  return request(`/api/admin/statistics/${params.line}/ask/${params.type}?${stringify(params)}`)
}

// 获取询问分类分布
export async function getCategory(params) {
  return request(`/api/admin/statistics/chart/ask/category?${stringify(params)}`)
}

// 获取询问企业分布
export async function getCompany(params) {
  return request(`/api/admin/statistics/chart/ask/company?${stringify(params)}`)
}

// 获取询问国家分布
export async function getCountry(params) {
  return request(`/api/admin/statistics/chart/ask/country?${stringify(params)}`)
}

// 获取询问商品分布
export async function getProduct(params) {
  return request(`/api/admin/statistics/chart/ask/product?${stringify(params)}`)
}
