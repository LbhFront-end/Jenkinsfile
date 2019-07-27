import { query as queryUsers, queryCurrent } from '@/services/enterprise/user';


// const companyToken = localStorage.getItem('companyToken')
const userName = localStorage.getItem('userName')
const avatar = localStorage.getItem('avatar')

export default {
  namespace: 'user',

  state: {
    list: [],
    currentUser: {},
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchCurrent(_, { call, put }) {
      yield put({
        type: 'saveCurrentUser',
        payload: {
          name: userName,
          avatar
        },
      });
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: {
          name: action.payload.name || '',
          avatar: action.payload.avatar || '',
        }
      };
    },
    changeNotifyCount(state, action) {

      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload,
        },
      };
    },
  },
};
