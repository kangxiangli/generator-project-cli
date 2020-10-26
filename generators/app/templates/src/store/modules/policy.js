import { POLICY } from '../type'
import { request } from '@/custom/plugins/request.js'
import { Bus } from '@bus'
export default {
  namespaced: true,
  state: {
    logDictData: [], // 获取统计字段列表
    logDictOneData: [],
    filterFunData: [], // 获取筛选函数字典
    strategyFunData: [], // 获取统计函数字典
    operatorData: [], // 获取运算符字典
    baselineData: [], // 获取基线数据字典
    baselineTop: [], // 获取TOP函数基线列表
    rosterData: [], // 获取名单列表
    operatorOneData: [], // 获取运算符字典2
    datasetData: [] // 获取数据集
  },
  getters: {
    [POLICY.LOG_DICT] (state) {
      Bus.$emit(`policy/${POLICY.LOG_DICT}`)
      return state.logDictData
    },
    [POLICY.LOG_DICT_ONE] (state) {
      Bus.$emit(`policy/${POLICY.LOG_DICT_ONE}`)
      return state.logDictOneData
    },
    [POLICY.FILTER_FUN] (state) {
      Bus.$emit(`policy/${POLICY.FILTER_FUN}`)
      return state.filterFunData
    },
    [POLICY.STRATEGY_FUN] (state) {
      Bus.$emit(`policy/${POLICY.STRATEGY_FUN}`)
      return state.strategyFunData
    },
    [POLICY.OPERATION] (state) {
      Bus.$emit(`policy/${POLICY.OPERATION}`)
      return state.operatorData
    },
    [POLICY.BASE_LINE] (state) {
      Bus.$emit(`policy/${POLICY.BASE_LINE}`)
      return state.baselineData
    },
    [POLICY.BASE_LINE_TOP] (state) {
      Bus.$emit(`policy/${POLICY.BASE_LINE_TOP}`)
      return state.baselineTop
    },
    [POLICY.LIST_TAGS] (state) {
      Bus.$emit(`policy/${POLICY.LIST_TAGS}`)
      return state.rosterData
    },
    [POLICY.LIST_OPERATION] (state) {
      Bus.$emit(`policy/${POLICY.LIST_OPERATION}`)
      return state.operatorOneData
    },
    [POLICY.LIST_DATASET] (state) {
      Bus.$emit(`policy/${POLICY.LIST_DATASET}`)
      return state.datasetData
    }
  },
  mutations: {
    [POLICY.LOG_DICT] (state, result) {
      state.logDictData = result
    },
    [POLICY.LOG_DICT_ONE] (state, result) {
      state.logDictOneData = result
    },
    [POLICY.FILTER_FUN] (state, result) {
      state.filterFunData = result
    },
    [POLICY.STRATEGY_FUN] (state, result) {
      state.strategyFunData = result
    },
    [POLICY.OPERATION] (state, result) {
      state.operatorData = result
    },
    [POLICY.BASE_LINE] (state, result) {
      state.baselineData = result
    },
    [POLICY.BASE_LINE_TOP] (state, result) {
      state.baselineTop = result
    },
    [POLICY.LIST_TAGS] (state, result) {
      state.rosterData = result
    },
    [POLICY.LIST_OPERATION] (state, result) {
      state.operatorOneData = result
    },
    [POLICY.LIST_DATASET] (state, result) {
      state.datasetData = result
    }
  },
  actions: {
    async [POLICY.LOG_DICT] ({ commit }) {
      const content = await request({
        method: 'get',
        url: '/api/ueba/dict/select/dict-fields-log'
      })
      commit(POLICY.LOG_DICT, content)
    },
    async [POLICY.LOG_DICT_ONE] ({ commit }, id) {
      const content = await request({
        method: 'post',
        url: '/api/ueba/dict/manage/data/dictCatData/query',
        data: { categoryId: id }
      })
      commit(POLICY.LOG_DICT_ONE, content)
    },
    async [POLICY.FILTER_FUN] ({ commit }) {
      const content = await request({
        method: 'get',
        url: '/api/ueba/dict/select/getFilterFun'
      })
      commit(POLICY.FILTER_FUN, content)
    },
    async [POLICY.STRATEGY_FUN] ({ commit }) {
      const content = await request({
        method: 'get',
        url: '/api/ueba/dict/select/getStrategyFun'
      })
      commit(POLICY.STRATEGY_FUN, content)
    },
    async [POLICY.OPERATION] ({ commit }) {
      const content = await request({
        method: 'get',
        url: '/api/ueba/dict/select/getOperation'
      })
      commit(POLICY.OPERATION, content)
    },
    async [POLICY.BASE_LINE] ({ commit }) {
      const content = await request({
        method: 'get',
        url: '/api/ueba/baseline/list'
      })
      commit(POLICY.BASE_LINE, content)
    },
    async [POLICY.BASE_LINE_TOP] ({ commit }) {
      const content = await request({
        method: 'get',
        url: '/api/ueba/baseline/list-top'
      })
      commit(POLICY.BASE_LINE_TOP, content)
    },
    async [POLICY.LIST_TAGS] ({ commit }) {
      const content = await request({
        method: 'post',
        url: '/api/ueba/listManage/tag/listTags/query'
      })
      commit(POLICY.LIST_TAGS, content)
    },
    async [POLICY.LIST_OPERATION] ({ commit }) {
      const content = await request({
        method: 'get',
        url: '/api/ueba/dict/select/getListOperation'
      })
      commit(POLICY.LIST_OPERATION, content)
    },
    async [POLICY.LIST_DATASET] ({ commit }) {
      const content = await request({
        method: 'post',
        url: '/api/ueba/system/policy/dataset/queryAll/query'
      })
      commit(POLICY.LIST_DATASET, content)
    }
  }
}
