import {
  getProductLanguage,
  getProductLanguageByRecycle,
  getProductLanguageForm,
  getProductLanguageDetail,
  operationLanguage,
  addLanguage,
  updateLanuage
} from '@/services/enterprise/productLanguage'
import { formatRes } from '@/utils/enterprise/commonFunction';
import { getCache } from '@/utils/cache';

const cache = getCache();
const { companyToken } = cache;

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
      const response = yield call(getProductLanguage, { ...payload, companyToken });
      if (response.code === 0) {
        yield put({
          type: 'save',
          payload: response,
        });
      }
    },
    *add({ payload, callback }, { call }) {
      const response = yield call(addLanguage, { ...payload, companyToken });
      if (callback) callback(response);
    },
    *update({ payload, callback }, { call }) {
      const response = yield call(updateLanuage, { ...payload, companyToken });
      if (callback) callback(response);
    },
    *form({ payload, callback }, { call }) {
      const response = yield call(getProductLanguageForm, { ...payload, companyToken });
      if (callback) callback(formatRes(response));
    },
    *detail({ payload, callback }, { call }) {
      const response = yield call(getProductLanguageDetail, { ...payload, companyToken });
      if (callback) callback(formatRes(response));
    },
    *recycle({ payload }, { call, put }) {
      const response = yield call(getProductLanguageByRecycle, { ...payload, companyToken });
      if (response.code === 0) {
        yield put({
          type: 'save',
          payload: response,
        });
      }
    },
    *operation({ payload, callback }, { call }) {
      const response = yield call(operationLanguage, { ...payload, companyToken });
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
