import {
  getCountry,
  getAsk,
  getViewTimes,
} from '@/services/enterprise/commodityGrowth';
import { formatRes } from '@/utils/enterprise/commonFunction';



export default {
  namespace: 'commodityGrowth',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *country({ payload }, { call, put }) {
      const response = yield call(getCountry, { ...payload, companyToken });
      if (response.code === 0) {
        yield put({
          type: 'save',
          payload: response,
        });
      }
    },
    *ask({ payload }, { call, put }) {
      const response = yield call(getAsk, { ...payload, companyToken });
      if (response.code === 0) {
        yield put({
          type: 'save',
          payload: response,
        });
      }
    },
    *viewTimes({ payload }, { call, put }) {
      const response = yield call(getViewTimes, { ...payload, companyToken });
      if (response.code === 0) {
        yield put({
          type: 'save',
          payload: response,
        });
      }
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
