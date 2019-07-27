import {
  getCategorys,
  getCategoryByRecycle,
  getCategoryDetail,
  getCategoryForm,
  getOpts,
  add,
  update,
  operation,
  sequence
} from '@/services/admin/categoryManagement';

import { formatRes } from '@/utils/admin/commonFunction';

export default {
  namespace: 'categoryManagement',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(getCategorys, payload);
      if (response.code === 0) {
        yield put({
          type: 'save',
          payload: response,
        });
      }
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
      const response = yield call(getCategoryForm, payload);
      if (callback) callback(formatRes(response));
    },
    *detail({ payload, callback }, { call }) {
      const response = yield call(getCategoryDetail, payload);
      if (callback) callback(formatRes(response));
    },
    *recycle({ payload }, { call, put }) {
      const response = yield call(getCategoryByRecycle, payload);
      if (response.code === 0) {
        yield put({
          type: 'save',
          payload: response,
        });
      }
    },
    *operation({ payload, callback }, { call }) {
      const response = yield call(operation, payload);
      if (callback) callback(response);
    },
    *sequence({ payload, callback }, { call }) {
      const response = yield call(sequence, payload);
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
