import {
  getAsks,
  getAskDetail,
  getAskByRecycle,
  operation,
  sign
} from '@/services/enterprise/ask';
import { getOpts } from '@/services/enterprise/product'
import { formatRes } from '@/utils/enterprise/commonFunction';
import { getCache } from '@/utils/cache';

const cache = getCache();
const { companyToken } = cache;

export default {
  namespace: 'askManagement',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(getAsks, { ...payload, companyToken });
      if (response.code === 0) {
        yield put({
          type: 'save',
          payload: response,
        });
      }
    },
    *sign({ payload, callback }, { call }) {
      const response = yield call(sign, { ...payload, companyToken });
      if (callback) callback(response);
    },
    *detail({ payload, callback }, { call }) {
      const response = yield call(getAskDetail, { ...payload, companyToken });
      if (callback) callback(formatRes(response));
    },
    *optsOfProduct({ payload, callback }, { call }) {
      const response = yield call(getOpts, { ...payload, companyToken });
      if (callback) callback(formatRes(response));
    },
    *recycle({ payload }, { call, put }) {
      const response = yield call(getAskByRecycle, { ...payload, companyToken });
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
