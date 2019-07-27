import {
  getEnterprises,
  getEnterpriseDetail,
  getOpts,
  getEnterprisesByRecycle,
  operation
} from '@/services/admin/enterpriseManagement';

import { formatRes } from '@/utils/admin/commonFunction';

export default {
  namespace: 'enterpriseManagement',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(getEnterprises, payload);
      if (response.code === 0) {
        yield put({
          type: 'save',
          payload: response,
        });
      }
    },
    *opts({ payload, callback }, { call }) {
      const response = yield call(getOpts, payload);
      if (callback) callback(response);
    },
    *detail({ payload, callback }, { call }) {
      const response = yield call(getEnterpriseDetail, payload);
      if (callback) callback(formatRes(response));
    },
    *recycle({ payload }, { call, put }) {
      const response = yield call(getEnterprisesByRecycle, payload);
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
