import { MESSAGE } from '../type'
import { request } from '@/custom/plugins/request.js'
import { Bus } from '@bus'

export default {
  namespaced: true,
  state: {
    statusList: [],    // 消息状态
    messageSourceList: [],  // 发送源
    messageTypeList: [] // 消息类型
  },
  getters: {
    [MESSAGE.STATUS] (state) {
      Bus.$emit(`message/${MESSAGE.STATUS}`)
      return state.statusList
    },
    [MESSAGE.SOURCE] (state) {
      Bus.$emit(`message/${MESSAGE.SOURCE}`)
      return state.messageSourceList
    },
    [MESSAGE.TYPE] (state) {
      Bus.$emit(`message/${MESSAGE.TYPE}`)
      return state.messageTypeList
    }
  },
  mutations: {
    [MESSAGE.STATUS] (state, result) {
      state.statusList = result
    },
    [MESSAGE.SOURCE] (state, result) {
      state.messageSourceList = result
    },
    [MESSAGE.TYPE] (state, result) {
      state.messageTypeList = result
    }
  },
  actions: {
    async [MESSAGE.STATUS] ({ commit }) {
      const content = await request({
        url: '/api/argus-common/dict/message-status'
      })
      content.unshift({
        key: '',
        name: '全部'
      })
      commit(MESSAGE.STATUS, content)
    },
    async [MESSAGE.SOURCE] ({ commit }) {
      const content = await request({
        url: '/api/argus-common/dict/message-source'
      })
      content.unshift({
        key: '',
        name: '全部'
      })
      commit(MESSAGE.SOURCE, content)
    },
    async [MESSAGE.TYPE] ({ commit }) {
      const content = await request({
        url: '/api/argus-common/dict/message-type'
      })
      content.unshift({
        key: '',
        name: '全部'
      })
      commit(MESSAGE.TYPE, content)
    }
  }
}
