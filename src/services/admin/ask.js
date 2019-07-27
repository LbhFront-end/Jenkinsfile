import { stringify } from 'qs';
import request from '@/utils/request';

// 获取询问列表
export async function getAsks(params){
  return request(`/api/admin/asks?${stringify(params)}`)
}
// 询问回收站列表
export async function getAskByRecycle(params){
  return request(`/api/admin/asks/recycle?${stringify(params)}`)
}
// 获取询问单项详情
export async function getAskDetail(params){
  return request(`/api/admin/ask/${params.askTokens}/detail`)
  // return request(`/api/admin/ask/${params.askTokens}`)
}
// 询问操作：下架/上架/删除/锁定/解锁/清除/还原/解锁/审核（通过、不通过）
export async function operation(params) {
  return request(`/api/admin/ask/${params.askTokens}/${params.prefix}/${params.action}`, {
    method: 'PATCH',
    data:params,
  });
}
