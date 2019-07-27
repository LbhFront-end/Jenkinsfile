import {
  getEmailTemplate,
  getEmailTemplateOpts,
  getEmailTemplateDetail,
  add,
  update,
} from '@/services/admin/emailTemplate';

import { formatRes } from '@/utils/admin/commonFunction';

export default {
  namespace: 'emailTemplate',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(getEmailTemplate, payload);
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
    *opts({ payload, callback }, { call }) {
      const response = yield call(getEmailTemplateOpts, payload);
      if (callback) callback(response);
    },
    *update({ payload, callback }, { call }) {
      const response = yield call(update, payload);
      if (callback) callback(response);
    },
    *detail({ payload, callback }, { call }) {
      const response = yield call(getEmailTemplateDetail, payload);
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
