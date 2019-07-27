import { stringify } from 'qs';
import request from '@/utils/request';

// 获取企业单项详情
export async function getEnterpriseDetail(params) {
  return request(`/api/enterprise/company/${params.companyToken}/detail`)
}
// 获取企业单项表单
export async function getEnterpriseForm(params) {
  return request(`/api/enterprise/company/${params.companyToken}/form`)
}

// 企业邮件email/短信cellphone通知(启用、停用)
export async function notice(params) {
  return request(`/api/enterprise/company/${params.companyToken}/${params.noticeType}/notice/${params.action}`, {
    method: 'PATCH',
    //     data: params,
  })
}


// 企业更新
export async function update(params) {
  return request(`/api/enterprise/company/${params.companyToken}?submit=${params.submit}`, {
    method: 'PUT',
    data: params,
  });
}
// 企业销售：上下架,锁定、解锁、删除、还原、清除、邮件|短信通知（启动/停用）、
// export async function operation(params) {
//   return request(`/api/enterprise/company/${params.companyToken}/${params.prefix}/${params.action}`, {
//     method: 'PATCH',
//     data: params,
//   });
// }
