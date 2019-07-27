import request from '@/utils/request';

export async function queryProvince() {
  return request('/api/geographic/province');
}

export async function queryCity(province) {
  return request(`/api/geographic/city/${province}`);
}

// 获取级联信息

// 获取省级分类json
export async function getRegionData(params) {
  const { isFirst = false, id } = params;
  const url = isFirst ? '/data/region.json' : `/data/region/region${id}.json`
  // const url = '/data/category.json'
  return request(url, { method: 'GET' }, false)
}
