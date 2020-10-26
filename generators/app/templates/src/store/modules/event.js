import { EVENT } from '../type'
import { request } from '@/custom/plugins/request.js'
import { Bus } from '@bus'
const API = {
  EVENT_SEVERITY: {
    url: '/api/event/monitor/event-severity',
    method: 'get'
  },
  WARN_STATUS_LIST: {
    url: '/api/event/monitor/warn-status',
    method: 'get'
  }
}

export default {
  namespaced: true,
  state: {
    severity: [],    // 事件威胁等级
    warnStatusList: []
  },
  getters: {
    [EVENT.SEVERITY] (state) {
      Bus.$emit(`event/${EVENT.SEVERITY}`)
      return state.severity
    },
    [EVENT.WARN_STATUS_LIST] (state) {
      Bus.$emit(`event/${EVENT.WARN_STATUS_LIST}`)
      return state.warnStatusList
    }
  },
  mutations: {
    [EVENT.SEVERITY] (state, result) {
      state.severity = result
    },
    [EVENT.WARN_STATUS_LIST] (state, result) {
      state.warnStatusList = result
    }
  },
  actions: {
    async [EVENT.SEVERITY] ({ commit }) {
      const content = await request({
        ...API.EVENT_SEVERITY
      })
      commit(EVENT.SEVERITY, content)
    },
    async [EVENT.WARN_STATUS_LIST] ({ commit }) {
      const content = await request({
        ...API.WARN_STATUS_LIST
      })
      commit(EVENT.WARN_STATUS_LIST, content)
    }
  }
}
