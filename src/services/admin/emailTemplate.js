import { stringify } from 'qs';
import request from '@/utils/request';

// 获取邮件模板列表
export async function getEmailTemplate(params) {
  return request(`/api/admin/email/template?${stringify(params)}`)
}
// // 邮件模板回收站列表
// export async function getEmailTemplateByRecycle(params){
//   return request(`/api/admin/email/template/recycle?${stringify(params)}`)
// }
// 获取邮件模板单项详情
export async function getEmailTemplateDetail(params) {
  return request(`/api/admin/email/template/${params.emailTemplateTokens}/detail`)
}

// 获取邮件模板选项
export async function getEmailTemplateOpts(params) {
  return request(`/api/admin/email/template/opts?${stringify(params)}`)
}

// 更新邮件模板
export async function add(params) {
  return request(`/api/admin/email/template`, {
    method: 'POST',
    data: params,
  });
}

// 更新邮件模板
export async function update(params) {
  return request(`/api/admin/email/template/${params.emailTemplateTokens}`, {
    method: 'POST',
    data: params,
  });
}

// 邮件模板操作：审核（通过驳回）、启用、禁用
// export async function operation(params) {
//   return request(`/api/admin/email/template/${params.emailTemplateTokens}/${params.prefix}/${params.action}`, {
//     method: 'PATCH',
//     data: params,
//   });
// }
