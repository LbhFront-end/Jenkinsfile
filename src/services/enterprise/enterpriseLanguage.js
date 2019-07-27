import { stringify } from 'qs';
import request from '@/utils/request';


// 获取商品语言单项表单
export async function getLanguageForm(params) {
  return request(`/api/enterprise/company/${params.companyToken}/language/${params.languageTokens}/form?${stringify(params)}`)
}

// 商品语言新增
export async function addLanguage(params) {
  return request(`/api/enterprise/company/${params.companyToken}/language?submit=${params.submit}`, {
    method: 'POST',
    data: params,
  });
}

// 商品语言更新
export async function updateLanguage(params) {
  return request(`/api/enterprise/company/${params.companyToken}/language/${params.languageTokens}?submit=${params.submit}`, {
    method: 'PUT',
    data: params,
  });
}

