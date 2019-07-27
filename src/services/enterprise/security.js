import { stringify } from 'qs';
import request from '@/utils/request';

export async function loginEnterprise(params) {
  return request('/api/enterprise/login', {
    method: 'POST',
    data: params,
  });
}

export async function registerEnterprise(params) {
  return request(`/api/enterprise/register${params.RegisterType === 'ESR' ? '/esr/' : ''}?source=${params.source}`, {
    method: 'POST',
    data: params,
  });
}

export async function getOpts(params) {
  return request(`/api/enterprise/company/${params.companyToken}/managers/opts`);
}

export async function logoutEnterprise() {
  return request(`/api/enterprise/logout`);
}
