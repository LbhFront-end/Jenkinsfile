import {
  getProducts,
  getProductDetail,
  getProductForm,
  getOpts,
  getProductByRecycle,
  add,
  update,
  operation
} from '@/services/admin/product';
import {
  getLanguageForm,
  addLanguage,
  updateLanuage
} from '@/services/admin/productLanguage'
import { formatRes } from '@/utils/admin/commonFunction';

export default {
  namespace: 'askAboutGrowth',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(getProducts, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *add({ payload, callback }, { call }) {
      const response = yield call(add, payload);
      if (callback) callback(response);
    },
    *update({ payload, callback }, { call }) {
      const response = yield call(update, payload);
      if (callback) callback(response);
    },
    *opts({ payload, callback }, { call }) {
      const response = yield call(getOpts, payload);
      if (callback) callback(response);
    },
    *form({ payload, callback }, { call }) {
      const response = yield call(getProductForm, payload);
      if (callback) callback(formatRes(response));
    },
    *detail({ payload, callback }, { call }) {
      const response = yield call(getProductDetail, payload);
      if (callback) callback(formatRes(response));
    },
    *recycle({ payload, callback }, { call }) {
      const response = yield call(getProductByRecycle, payload);
      if (callback) callback(response);
    },
    *operation({ payload, callback }, { call }) {
      const response = yield call(operation, payload);
      if (callback) callback(response);
    },
    *formL({ payload, callback }, { call }) {
      const response = yield call(getLanguageForm, payload);
      if (callback) callback(formatRes(response));
    },
    *addL({ payload, callback }, { call }) {
      const response = yield call(addLanguage, payload);
      if (callback) callback(formatRes(response));
    },
    *updateL({ payload, callback }, { call }) {
      const response = yield call(updateLanuage, payload);
      if (callback) callback(formatRes(response));
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
  },
};
