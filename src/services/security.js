import { stringify } from 'qs';
import request from '@/utils/request';

export async function login(params) {
  return request('/api/admin/login', {
    method: 'POST',
    data: params,
  });
}

export async function logout() {
  return request(`/api/admin/logout`);
}

export async function register(params) {
  return request(`/api/admin/manager`, {
    method: 'POST',
    data: params,
  });
}



export async function getOpts() {
  return request(`/api/admin/esr/managers/opts`);
}

