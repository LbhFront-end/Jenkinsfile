import { stringify } from 'qs';
import request from '@/utils/request';

// 获取成员列表
export async function getAdministratorSettings(params) {
  return request(`/api/admin/managers?${stringify(params)}`)
}
// 成员回收站列表
export async function getAdministratorSettingsByRecycle(params) {
  return request(`/api/admin/managers/recycle?${stringify(params)}`)
}
// 成员操作：锁定、解锁、删除、还原、清除
export async function operation(params) {
  return request(`/api/admin/manager/${params.managerTokens}/${params.prefix}/${params.action}`, {
    method: 'PATCH',
    data: params,
  });
}

// 成员获取选项
export async function getOpts(){
  return request(`/api/admin/esr/managers/opts`)
}

// 成员添加
export async function add(params) {
  return request(`/api/admin/manager`, {
    method: 'POST',
    data: params,
  });
}