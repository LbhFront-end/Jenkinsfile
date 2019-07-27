import request from '@/utils/request';

export async function getCity(city) {
  return request(`/data/city/${city}`);
}

export async function queryCity1(province) {
  return request(`/api/geographic/city/${province}`);
}
