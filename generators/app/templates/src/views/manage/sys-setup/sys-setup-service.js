const BASE_URL = '/api/argus-system-setting'
const API = {
  MENU_LIST: {
    url: `${BASE_URL}/menu/list`,
    method: 'get',
    tag: 'tree-list'
  },
  INTERFACE_LIST: {
    url: `${BASE_URL}/interface/list`,
    method: 'get',
    tag: 'tree-list'
  }
}
export default {
  methods: {
    // 树形列表
    async getTreelistData () {
      let result = await this.$request({
        ...API.MENU_LIST
      })
      this.treeListData = result
    },
    // 子菜单列表
    async getInterfaceListData () {
      return this.$request({
        ...API.INTERFACE_LIST
      })
    }
  }
}
