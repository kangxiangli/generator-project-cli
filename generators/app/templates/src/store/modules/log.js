import { LOG } from '../type'
import { Bus } from '@bus'
import { request } from '@/custom/plugins/request.js'

export default {
  namespaced: true,
  state: {
    logSourceList: []
  },
  getters: {
    [LOG.SOURCE_LIST] (state) {
      Bus.$emit(`log/${LOG.SOURCE_LIST}`)
      return state.logSourceList
    }
  },
  mutations: {
    [LOG.SOURCE_LIST] (state, result) {
      state.logSourceList = result
    }
  },
  actions: {
    async [LOG.SOURCE_LIST] ({ commit }) {
      const content = await request({
        url: '/api/argus-service-eventretrieval/search/log-device-type'
      })
      commit(LOG.SOURCE_LIST, content)
    }
  }
}
