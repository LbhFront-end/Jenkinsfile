import {
  getProductLanguage,
  getProductLanguageDetail,
  getProductLanguageByRecycle,
  operationLanguage
} from '@/services/admin/productLanguage';
import { getOpts } from '@/services/admin/enterpriseManagement';
import { formatRes } from '@/utils/admin/commonFunction';

export default {
  namespace: 'productLanguage',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(getProductLanguage, payload);
      if (response.code === 0) {
        yield put({
          type: 'save',
          payload: response,
        });
      }
    },
    *detail({ payload, callback }, { call }) {
      const response = yield call(getProductLanguageDetail, payload);
      if (callback) callback(formatRes(response));
    },
    *recycle({ payload }, { call, put }) {
      const response = yield call(getProductLanguageByRecycle, payload);
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
    *optsOfEnterprise({ payload, callback }, { call }) {
      const response = yield call(getOpts, { ...payload });
      if (callback) callback(formatRes(response));
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
