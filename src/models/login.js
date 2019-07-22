import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
import { login, logout } from '@/services/security';
import { message } from 'antd';
import { setAuthority } from '@/utils/authority';
import { getPageQuery, rsa } from '@/utils/utils';
import { reloadAuthorized } from '@/utils/Authorized';

export default {
  namespace: 'login',

  state: {
    status: undefined,
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
        const { imageUrl, userName,companyName } = response.elem;
        localStorage.setItem('companyName', companyName)
        localStorage.setItem('userName', userName)
        localStorage.setItem('avatar', imageUrl)
        reloadAuthorized();
        const urlParams = new URL(window.location.href);
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
        yield put(routerRedux.replace(redirect || '/'));
      }
    },

    // *getCaptcha({ payload }, { call }) {
    //   yield call(getFakeCaptcha, payload);
    // },

    *logout(_, { call, put }) {
      yield call(logout);
      message.success('登出成功')
      localStorage.clear();
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: false,
          currentAuthority: 'guest',
        },
      });
      reloadAuthorized();
      yield put(
        routerRedux.push({
          pathname: '/user/login',
        })
      );
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      if (payload.elem) {
        if (payload.elem.root) {
          setAuthority('admin');
        } else {
          setAuthority('user');
        }
      } else {
        setAuthority('guest');
      }
      return {
        ...state,
        code: payload.code,
        type: 'account',
      };
    },
  },
};
