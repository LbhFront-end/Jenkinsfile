import {
  sendEmailByTemplate,
  sendEmailByEditor,
} from '@/services/email';


const formatRes = (res) => {
  if (!res) return false;
  if (res.elems) {
    return res.elems[0];
  }
  if (res.elem) return res.elem
  return false;
}

export default {
  namespace: 'email',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *sendEmailByTemplate({ payload, callback }, { call }) {
      const response = yield call(sendEmailByTemplate, payload);
      if (callback) callback(response);
    },
    *sendEmailByEditor({ payload, callback }, { call }) {
      const response = yield call(sendEmailByEditor, payload);
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
