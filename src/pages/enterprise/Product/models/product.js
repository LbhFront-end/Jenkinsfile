import {
  getProducts,
  getProductDetail,
  getProductForm,
  getOpts,
  getProductByRecycle,
  add,
  update,
  operation
} from '@/services/enterprise/product';
import {
  getLanguageForm,
  addLanguage,
  updateLanuage
} from '@/services/enterprise/productLanguage'
import { formatRes } from '@/utils/enterprise/commonFunction';
import { getCache } from '@/utils/cache';

const cache = getCache();
const { companyToken } = cache;

export default {
  namespace: 'product',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(getProducts, { ...payload, companyToken });
      if (response.code === 0) {
        yield put({
          type: 'save',
          payload: response,
        });
      }
    },
    *add({ payload, callback }, { call }) {
      const response = yield call(add, { ...payload, companyToken });
      if (callback) callback(response);
    },
    *update({ payload, callback }, { call }) {
      const response = yield call(update, { ...payload, companyToken });
      if (callback) callback(response);
    },
    *opts({ payload, callback }, { call }) {
      const response = yield call(getOpts, { ...payload, companyToken });
      if (callback) callback(response);
    },
    *form({ payload, callback }, { call }) {
      const response = yield call(getProductForm, { ...payload, companyToken });
      if (callback) callback(formatRes(response));
    },
    *detail({ payload, callback }, { call }) {
      const response = yield call(getProductDetail, { ...payload, companyToken });
      if (callback) callback(formatRes(response));
    },
    *recycle({ payload }, { call, put }) {
      const response = yield call(getProductByRecycle, { ...payload, companyToken });
      if (response.code === 0) {
        yield put({
          type: 'save',
          payload: response,
        });
      }
    },
    *operation({ payload, callback }, { call }) {
      const response = yield call(operation, { ...payload, companyToken });
      if (callback) callback(response);
    },
    *formL({ payload, callback }, { call }) {
      const response = yield call(getLanguageForm, { ...payload, companyToken });
      if (callback) callback(formatRes(response));
    },
    *addL({ payload, callback }, { call }) {
      const response = yield call(addLanguage, { ...payload, companyToken });
      if (callback) callback(response);
    },
    *updateL({ payload, callback }, { call }) {
      const response = yield call(updateLanuage, { ...payload, companyToken });
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
