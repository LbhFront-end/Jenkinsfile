import {
  getAdministratorSettingss,
  getOpts,
  getAdministratorSettingsByRecycle,
  add,
  operation
} from '@/services/enterprise/administratorSettings';
import { formatRes } from '@/utils/enterprise/commonFunction'
import { getCache } from '@/utils/cache';

const cache = getCache();
const { companyToken } = cache;

export default {
  namespace: 'administratorSettings',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(getAdministratorSettingss, { ...payload, companyToken });
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
    *opts({ payload, callback }, { call }) {
      const response = yield call(getOpts, { ...payload, companyToken });
      if (callback) callback(formatRes(response));
    },
    *recycle({ payload }, { call, put }) {
      const response = yield call(getAdministratorSettingsByRecycle, { ...payload, companyToken });
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
