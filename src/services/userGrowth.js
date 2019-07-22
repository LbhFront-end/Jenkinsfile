import { stringify } from 'qs';
import request from '@/utils/request';

// 统计获取企业指标
export async function getIndicatorCompany() {
  return request(`/api/admin/statistics/metrics/company`)
}

// 企业增长图
export async function getGraph(params) {
  return request(`/api/admin/statistics/${params.line}/company/${params.type}?${stringify(params)}`)
}

// 获取企业城市分布
export async function getCity(params) {
  return request(`/api/admin/statistics/chart/company/city?${stringify(params)}`)
}

// 获取企业省份分布
export async function getProvince(params) {
  return request(`/api/admin/statistics/chart/company/province?${stringify(params)}`)
}

// 获取企业引流源分布
export async function getSource(params) {
  return request(`/api/admin/statistics/chart/company/source?${stringify(params)}`)
}
