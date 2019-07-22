import { stringify } from 'qs';
import request from '@/utils/request';

// 获取企业列表
export async function getEnterprises(params) {
  return request(`/api/admin/companies?${stringify(params)}`)
}
// 获取企业列表(回收站)
export async function getEnterprisesByRecycle(params) {
  return request(`/api/admin/companies/recycle?${stringify(params)}`)
}
// 获取企业单项详情
export async function getEnterpriseDetail(params) {
  return request(`/api/admin/company/${params.companyTokens}/detail`)
}
// 企业获取选项
export async function getOpts(params) {
  return request(`/api/admin/companies/opts?${stringify(params)}`)
}
// 企业操作：审核（通过，驳回）、启用、禁用
export async function operation(params) {
  return request(`/api/admin/company/${params.companyTokens}/${params.prefix}/${params.action}`, {
    method: 'PATCH',
    data: params,
  });
}
