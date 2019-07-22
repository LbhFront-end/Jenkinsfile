import { stringify } from 'qs';
import request from '@/utils/request';

// 通过模板发送邮箱
export async function sendEmailByTemplate(params) {
  return request(`/api/admin/email/template/to/${params.companyTokens}`, {
    method: 'POST',
    data: params,
  });
}
// 通过富文本框发送邮箱
export async function sendEmailByEditor(params) {
  return request(`/api/admin/email/to/${params.companyTokens}`, {
    method: 'POST',
    data: params,
  });
}
