import {
  getEnterpriseDetail,
  getEnterpriseForm,
  notice,
  update,
} from '@/services/enterprise/enterpriseManagement';
import {
  getLanguageForm,
  addLanguage,
  updateLanuage
} from '@/services/enterprise/enterpriseLanguage'
import { formatRes } from '@/utils/enterprise/commonFunction';
import { getCache } from '@/utils/cache';

const cache = getCache();
const { companyToken } = cache;

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
      const response = yield call(getEnterpriseDetail, { ...payload, companyToken });
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *update({ payload, callback }, { call }) {
      const response = yield call(update, { ...payload, companyToken });
      if (callback) callback(response);
    },
    *form({ payload, callback }, { call }) {
      const response = yield call(getEnterpriseForm, { ...payload, companyToken });
      if (callback) callback(formatRes(response));
    },
    *detail({ payload, callback }, { call }) {
      const response = yield call(getEnterpriseDetail, { ...payload, companyToken });
      if (callback) callback(formatRes(response));
    },
    *notice({ payload, callback }, { call }) {
      const response = yield call(notice, { ...payload, companyToken });
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
        data: action.payload,
      };
    },
  },
};
