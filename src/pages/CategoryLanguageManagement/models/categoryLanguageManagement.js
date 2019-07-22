import {
  getCategoryLanguage,
  getCategoryLanguageByRecycle,
  getCategoryLanguageForm,
  getCategoryLanguageDetail,
  add,
  update,
  operation,
} from '@/services/categoryLanguageManagement';


const formatRes = (res)=>{
  if(!res) return false;
  if(res.elems){
    return res.elems[0];
  }
  if(res.elem) return res.elem
  return false;
}

export default {
  namespace: 'categoryLanguageManagement',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(getCategoryLanguage, payload);
      // console.log(response);
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
    *form({ payload, callback }, { call }) {
      const response = yield call(getCategoryLanguageForm, payload);
      if (callback) callback(formatRes(response));
    },
    *detail({ payload, callback }, { call }) {
      const response = yield call(getCategoryLanguageDetail, payload);
      if (callback) callback(formatRes(response));
    },
    *recycle({ payload }, { call,put }) {
      const response = yield call(getCategoryLanguageByRecycle, payload);
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
