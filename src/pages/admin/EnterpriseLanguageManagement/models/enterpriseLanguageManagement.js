import {
  getEnterpriseLanguage,
  getEnterpriseLanguageDetail,
  getEnterpriseLanguageByRecycle,
  operationLanguage
} from '@/services/admin/enterpriseLanguageManagement';

import { formatRes } from '@/utils/admin/commonFunction';

export default {
  namespace: 'enterpriseLanguageManagement',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(getEnterpriseLanguage, payload);
      if (response.code === 0) {
        yield put({
          type: 'save',
          payload: response,
        });
      }
    },
    *detail({ payload, callback }, { call }) {
      const response = yield call(getEnterpriseLanguageDetail, payload);
      if (callback) callback(formatRes(response));
    },
    *recycle({ payload }, { call, put }) {
      const response = yield call(getEnterpriseLanguageByRecycle, payload);
      if (response.code === 0) {
        yield put({
          type: 'save',
          payload: response,
        });
      }
    },
    *operation({ payload, callback }, { call }) {
      const response = yield call(operationLanguage, payload);
      if (callback) callback(response);
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: {
          list: action.payload.elems,
          pagination: {
            currentPage: action.payload.page + 1,
            pageSize: action.payload.size,
            total: action.payload.elemTotal,
          }
        },
      };
    },
  },
};
