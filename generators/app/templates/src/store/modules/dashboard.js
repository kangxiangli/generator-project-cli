import { DASHBOARD } from '../type'
import { request } from '@/custom/plugins/request.js'
import { Bus } from '@bus'
export default {
  namespaced: true,
  state: {
    columnsRule: {},  // 配置中数据表的分组字段的规则
    dictionary: {},   // 用于配置中过滤条的字典表
    isProxy: '',      // url 是否使用代理
    checkGraph: {},   // 用于配置中 每个图表对应的运算属性的配置
    dataSource: {},
    groupList: [],
    dashboardList: []
  },
  getters: {
    [DASHBOARD.COLUMNS_RULE] (state) {
      Bus.$emit(`dashboard/${DASHBOARD.COLUMNS_RULE}`)
      return state.columnsRule
    },
    [DASHBOARD.IS_PROXY] (state) {
      Bus.$emit(`dashboard/${DASHBOARD.IS_PROXY}`)
      return state.isProxy
    },
    [DASHBOARD.CHECK_GRAPH] (state) {
      Bus.$emit(`dashboard/${DASHBOARD.CHECK_GRAPH}`)
      return state.checkGraph
    }
  },
  mutations: {
    [DASHBOARD.COLUMNS_RULE] (state, result) {
      state.columnsRule = result
    },
    [DASHBOARD.DICTIONARY] (state, result) {
      // 将具体的数据结构放入对应的类型中
      state.dictionary = {
        ...state.dictionary,
        [result.type]: {
          [result.key]: result.value
        }
      }
    },
    [DASHBOARD.IS_PROXY] (state, payload) {
      state.isProxy = payload
    },
    [DASHBOARD.CHECK_GRAPH] (state, result) {
      state.checkGraph = result
    },
    [DASHBOARD.DATA_SOURCE] (state, result) {
      const map = {}
      result.content.map(val => {
        map[val.field] = val.name
      })
      state.dataSource[result.key] = {
        list: result.content,
        map
      }
    },
    // 组件组列表
    [DASHBOARD.GROUP_LIST] (state, payload) {
      switch (payload.type) {
        case 'all':
          // 处理全部列表
          state.groupList = payload.data
          break
        case 'modify':
          // 修改名称
          state.groupList[payload.index]['name'] = payload.name
          break
        case 'delete':
          // 删除
          state.groupList.splice(payload.index, 1)
          break
      }
    },
    // 大盘列表
    [DASHBOARD.DASHBOARD_LIST] (state, payload) {
      switch (payload.type) {
        case 'all':
          // 处理全部列表
          state.dashboardList = payload.data
          break
        case 'modify':
          // 修改名称
          state.dashboardList[payload.index]['name'] = payload.name
          break
        case 'delete':
          // 删除
          state.dashboardList.splice(payload.index, 1)
          break
      }
    }
  },
  actions: {
    async [DASHBOARD.COLUMNS_RULE] ({ commit }) {
      const content = await request({
        method: 'get',
        url: '/api/dashboard/component/check-rule'
      })
      commit(DASHBOARD.COLUMNS_RULE, content.graphColCount)
      commit(DASHBOARD.CHECK_GRAPH, content.graphCal)
    },
    async [DASHBOARD.DICTIONARY] ({ commit }, data) {
      const path = data.type === 'tree' ? 'tree' : 'list'
      const content = await request({
        method: 'get',
        url: '/api/system/filter/cache/' + path + '/' + data.key
      })
      commit(DASHBOARD.DICTIONARY, {
        ...data,
        value: content
      })
    },
    // 代理
    async [DASHBOARD.IS_PROXY] ({ commit }) {
      const content = await request({
        method: 'get',
        url: '/api/dashboard/common/isProxy'
      })
      commit(DASHBOARD.IS_PROXY, content['isProxy'])
    },
    // 数据联动
    async [DASHBOARD.DATA_SOURCE] ({ commit }, key) {
      const content = await request({
        method: 'get',
        url: '/api/dashboard/component/table/columns/' + key
      })
      commit(DASHBOARD.DATA_SOURCE, {
        key,
        content: content.columns
      })
    },
    // 获取组件组列表
    async [DASHBOARD.GROUP_LIST] ({ commit }) {
      const content = await request({
        method: 'post',
        url: '/api/dashboard/component/group/list/query'
      })
      commit(DASHBOARD.GROUP_LIST, {
        type: 'all',
        data: content
      })
    },
    // 获取组件组列表
    async [DASHBOARD.DASHBOARD_LIST] ({ commit }) {
      const content = await request({
        method: 'post',
        url: '/api/dashboard/dashboard/list/query'
      })
      commit(DASHBOARD.DASHBOARD_LIST, {
        type: 'all',
        data: content
      })
    }
  }
}
