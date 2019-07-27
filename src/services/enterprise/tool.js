import { stringify } from 'qs';
import request from '@/utils/request';

export async function getRegionsOpts() {
  return request('/api/enterprise/regions/opts');
}


export async function getCategoriesOpts(params) {
  return request(`/api/enterprise/company/${params.companyToken}/categories/opts/enable`);
}

export async function upload(params) {
  return request(`/api/enterprise/company/${params.companyToken}/upload?type=${params.type}`, {
    method: 'POST',
    data: params.formData,
  })
}
