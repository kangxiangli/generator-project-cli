export default {
  namespaced: true,
  state () {
    return {
      level2Menus: [], // 框架方案3使用
      menuList: [],
      permission: {
        insight: 15
      }
    }
  },
  mutations: {
    SET_MENU_LIST (state, data) {
      state.menuList = data || []
    },
    SET_PERMISSION (state, data) {
      state.permission = data || {}
    },
    SET_LEVEL2_MENUS (state, data) {
      state.level2Menus = data || []
    }
  }
}
