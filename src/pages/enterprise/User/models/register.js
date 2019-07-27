import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
import { registerEnterprise } from '@/services/enterprise/security';
import { setAuthority } from '@/utils/authority';
import { reloadAuthorized } from '@/utils/Authorized';

export default {
  namespace: 'register',

  state: {
    status: undefined,
  },

  effects: {
    *submit({ payload }, { call, put }) {
      const response = yield call(registerEnterprise, payload);
      if (response.code === 0) {
        yield put(
          routerRedux.push({
            pathname: '/enterprise/user/login'
          })
        );
      }
    },
  },

  reducers: {
    registerHandle(state, { payload }) {
      setAuthority('user');
      reloadAuthorized();
      return {
        ...state,
        status: payload.status,
      };
    },
  },
};
