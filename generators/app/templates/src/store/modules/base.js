/**
 * Created by ligang on 2018/6/1.
 */
import { BASE } from '@/store/type'
import { request } from '@/custom/plugins/request.js'
import Message from 'element-ui/packages/message/index.js'

const API = {
  USER_INFO: {
    url: '/api/sys/sys-users/current-login',
    method: 'get'
  }
}

export default {
  namespaced: true,
  state () {
    return {
      isReLogin: false,
      token: '',
      userInfo: {},
      globalConfig: {},
      theme: ''
    }
  },
  mutations: {
    [BASE.IS_RE_LOGIN] (state, payload) {
      state.isReLogin = payload
    },
    [BASE.TOKEN] (state, payload) {
      state.token = payload
    },
    [BASE.USER_INFO] (state, payload) {
      state.userInfo = payload
    },
    [BASE.GLOBAL_CONFIG] (state, payload) {
      state.globalConfig = payload
    },
    [BASE.THEME] (state, payload) {
      state.theme = payload
    }
  },
  getters: {
    [BASE.TOKEN] (state) {
      return state.token || window.localStorage.getItem(`base/${BASE.TOKEN}`)
    },
    [BASE.GLOBAL_CONFIG] (state) {
      return function (key) {
        let globalConfigInfo = JSON.stringify(state.globalConfig) !== '{}' ? state.globalConfig : JSON.parse(window.localStorage.getItem(`base/${BASE.GLOBAL_CONFIG}`)) || state.globalConfig
        return key ? globalConfigInfo[key] : globalConfigInfo
      }
    },
    [BASE.USER_INFO] (state) {
      return JSON.stringify(state.userInfo) !== '{}' ? state.userInfo : JSON.parse(window.localStorage.getItem(`base/${BASE.USER_INFO}`)) || state.userInfo
    },
    [BASE.THEME] (state) {
      return state.theme || window.localStorage.getItem(`base/${BASE.THEME}`)
    }
  },
  actions: {
    async [BASE.USER_INFO] ({ commit }) {
      try {
        const content = await request({
          ...API.USER_INFO
        })
        commit(BASE.USER_INFO, content)
      } catch {
        Message({
          type: 'error',
          message: '用户信息获取失败'
        })
      }
    },
    /**
     * 获取前端默认配置
     * @param commit
     * @returns {Promise.<void>}
     */
    async [BASE.GLOBAL_CONFIG] ({ state, commit }) {
      if (JSON.stringify(state.globalConfig) !== '{}') {
        return state.globalConfig
      }
      const response = await request({
        url: '/config.js',
        method: 'get'
      }, {
        responseType: 'text'
      })
      // eslint-disable-next-line
      commit(BASE.GLOBAL_CONFIG, window.eval(response.data))
    }
  }
}
