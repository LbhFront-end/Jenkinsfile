import { stringify } from 'qs';
import request from '@/utils/request';


// 询问商品次数分布
export async function getAsk(params) {
  return request(`/api/enterprise/company/${params.companyToken}/statistics/chart/ask/product`)
}

// 商品浏览分布
export async function getViewTimes(params) {
  return request(`/api/enterprise/company/${params.companyToken}/statistics/chart/product/viewtimes`)
}

