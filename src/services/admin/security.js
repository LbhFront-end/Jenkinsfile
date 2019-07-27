import { stringify } from 'qs';
import request from '@/utils/request';

export async function loginAdmin(params) {
  return request('/api/admin/login', {
    method: 'POST',
    data: params,
  });
}

export async function logoutAdmin() {
  return request(`/api/admin/logout`);
}

export async function registerAdmin(params) {
  return request(`/api/admin/manager`, {
    method: 'POST',
    data: params,
  });
}



export async function getOpts() {
  return request(`/api/admin/esr/managers/opts`);
}

