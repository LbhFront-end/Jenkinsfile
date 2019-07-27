import { stringify } from 'qs';
import request from '@/utils/request';


// 询问国家分布
export async function getCountry(params) {
  return request(`/api/enterprise/company/${params.companyToken}/statistics/chart/ask/country`)
}

// 统计获取询问指标
export async function getIndicator(params) {
  return request(`/api/enterprise/company/${params.companyToken}/statistics/metrics/ask`)
}

// 询问新增图
export async function getGraph(params) {
  return request(`/api/enterprise/company/${params.companyToken}/statistics/${params.line}/ask/${params.type}?${stringify(params)}`)
}

// 询问商品次数分布
export async function getAsk(params) {
  return request(`/api/enterprise/company/${params.companyToken}/statistics/chart/ask/product`)
}

// // 商品国家分布
// export async function getCountry(params) {
//   return request(`/api/enterprise/company/${params.companyToken}/statistics/distribution/ask/country`)
// }

// // 商品国家分布
// export async function getCountry(params) {
//   return request(`/api/enterprise/company/${params.companyToken}/statistics/distribution/ask/country`)
// }
