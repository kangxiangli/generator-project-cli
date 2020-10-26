import { REALTIME } from '../type'
import { request } from '@/custom/plugins/request.js'
export default {
  namespaced: true,
  state: {
    filedDicts: [],        // 字段列表
    moulds: [],            // 语句模板语法
    operations: [],        // 运算
    operationOne: [],      // 运算
    baseline: [],          // 基线
    baselineTop: [],       // 基线top
    tags: [],              // 名单
    datasets: [],          // 数据集
    mouldDictionary: {},   // 全部模板语法
    realDictionary: {}     // 获取实时字典
  },
  getters: {
  },
  mutations: {
    [REALTIME.FILED_DICTS] (state, result) {
      state.filedDicts = result
    },
    [REALTIME.MOULDS] (state, result) {
      state.moulds = result
    },
    [REALTIME.OPERATIONS] (state, result) {
      state.operations = result
    },
    [REALTIME.OPERATION_ONE] (state, result) {
      state.operationOne = result
    },
    [REALTIME.BASELINE] (state, result) {
      state.baseline = result
    },
    [REALTIME.BASELINE_TOP] (state, result) {
      state.baselineTop = result
    },
    [REALTIME.TAGS] (state, result) {
      state.tags = result
    },
    [REALTIME.DATASETS] (state, result) {
      state.datasets = result
    },
    [REALTIME.REAL_DICTIONARY] (state, result) {
      state.realDictionary = result
    },
    [REALTIME.MOULD_DICTIONARY] (state, result) {
      state.mouldDictionary = result
    }
  },
  actions: {
    async [REALTIME.FILED_DICTS] ({ commit }) {
      const content = await request({
        method: 'get',
        url: '/api/ueba/dict/select/dict-fields-log'
      })
      commit(REALTIME.FILED_DICTS, content)
    },
    async [REALTIME.MOULD_DICTIONARY] ({ commit }) {
      const content = await request({
        method: 'get',
        url: '/api/ueba/system/policy/filter-template/realtime/query-all'
      })
      commit(REALTIME.MOULD_DICTIONARY, content)
    },
    async [REALTIME.MOULDS] ({ commit }, type) {
      const content = await request({
        method: 'post',
        url: '/api/ueba/system/policy/filter-template/realtime/query',
        data: { type: type }
      })
      commit(REALTIME.MOULDS, content)
    },
    async [REALTIME.OPERATIONS] ({ commit }, data) {
      const content = await request({
        method: 'get',
        url: '/api/ueba/dict/select/getOperation'
      })
      commit(REALTIME.OPERATIONS, content)
    },
    async [REALTIME.OPERATION_ONE] ({ commit }, data) {
      const content = await request({
        method: 'get',
        url: '/api/ueba/dict/select/getListOperation'
      })
      commit(REALTIME.OPERATION_ONE, content)
    },
    async [REALTIME.BASELINE] ({ commit }, data) {
      const content = await request({
        method: 'get',
        url: '/api/ueba/baseline/list'
      })
      commit(REALTIME.BASELINE, content)
    },
    async [REALTIME.BASELINE_TOP] ({ commit }, data) {
      const content = await request({
        method: 'get',
        url: '/api/ueba/baseline/list-top'
      })
      commit(REALTIME.BASELINE_TOP, content)
    },
    async [REALTIME.TAGS] ({ commit }, data) {
      const content = await request({
        method: 'post',
        url: '/api/ueba/listManage/tag/listTags/query'
      })
      commit(REALTIME.TAGS, content)
    },
    async [REALTIME.DATASETS] ({ commit }, data) {
      const content = await request({
        method: 'post',
        url: '/api/ueba/system/policy/dataset/queryAll/query'
      })
      commit(REALTIME.DATASETS, content)
    },
    async [REALTIME.REAL_DICTIONARY] ({ commit }, data) {
      const content = await request({
        method: 'get',
        url: '/api/ueba/dict/select/realtime-init-filter'
      })
      commit(REALTIME.REAL_DICTIONARY, content)
    }
  }
}
