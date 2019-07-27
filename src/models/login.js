import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
// import { fakeAccountLogin, getFakeCaptcha } from '@/services/api';
import { message } from 'antd';
import { loginEnterprise, logoutEnterprise } from '@/services/enterprise/security';
import { loginAdmin, logoutAdmin } from '@/services/admin/security';
import { setAuthority } from '@/utils/authority';
import { getPageQuery, rsa } from '@/utils/utils';
import { reloadAuthorized } from '@/utils/Authorized';
import { setCache } from '@/utils/cache';

const url = window.location.href;
let conflictParams = {
  login: null,
  logout: null,
  redirectFinal: '/',
  pathname: '/'
};
if (url.includes('enterprise')) {
  conflictParams = {
    login: loginEnterprise,
    redirectFinal: '/enterprise',
    logout: logoutEnterprise,
    pathname: '/enterprise/user/login'
  }
} else if (url.includes('admin')) {
  conflictParams = {
    login: loginAdmin,
    redirectFinal: '/admin',
    logout: logoutAdmin,
    pathname: '/admin/user/login'
  }
}

const { login, redirectFinal, logout, pathname } = conflictParams;


export default {
  namespace: 'login',

  state: {
    code: undefined,
  },

  effects: {
    *login({ payload }, { call, put }) {
      // const publicKey = '';
      // const response = yield call(login, {
      //   account: payload.account,
      //   password: rsa(payload.password, publicKey),
      // });
      const response = yield call(login, payload);
      // Login successfully
      if (response && response.code === 0) {
        yield put({
          type: 'changeLoginStatus',
          payload: response,
        });
        setCache(response.elem);
        reloadAuthorized();
        const urlParams = new URL(url);
        const params = getPageQuery();
        let { redirect } = params;
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.startsWith('/#')) {
              redirect = redirect.substr(2);
            }
          } else {
            window.location.href = redirect;
            return;
          }
        }
        message.success('登录成功')
        yield put(routerRedux.replace(redirect || redirectFinal));
      }
    },

    *logout(_, { call, put }) {
      yield call(logout);
      message.success('登出成功')
      localStorage.clear();
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: false,
          currentAuthority: 'user',
        },
      });
      reloadAuthorized();
      yield put(routerRedux.push({ pathname }));
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      let authorityCharacter = 'user';
      if (payload.elem) {
        const { root } = payload.elem;
        if (url.includes('enterprise')) {
          authorityCharacter = root ? 'enterprise_root' : 'enterprise';
        } else if (url.includes('admin')) {
          authorityCharacter = root ? 'admin_root' : 'admin';
        }
      }
      setAuthority(authorityCharacter);
      return {
        ...state,
        code: payload.code,
        type: 'account',
      };
    },
  },
};
