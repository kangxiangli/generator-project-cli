const BASE_URL = '/api/argus-system-setting'
const API = {
  // 下一跳接口列表
  INTERFACE_LIST: {
    url: `${BASE_URL}/interface/list`,
    method: 'get',
    tag: 'interface-list'
  },
  // 网络路由设置列表
  ROUTE_LIST: {
    url: `${BASE_URL}/route/list`,
    method: 'get',
    tag: 'table-list'
  },
  // 新增
  ROUTE_ADD: {
    url: `${BASE_URL}/add/route`,
    method: 'post',
    tag: 'table-list'
  },
  // 删除
  ROUTE_DELETE (id) {
    return {
      url: `${BASE_URL}/delete/route/${id}`,
      method: 'delete',
      tag: 'table-list'
    }
  },
  // 更新
  ROUTE_UPDATE: {
    url: `${BASE_URL}/change/route`,
    method: 'put',
    tag: 'table-list'
  }
}
export default {
  methods: {
    // 下一跳接口
    async getInterfaceListData () {
      let result = await this.$request({
        ...API.INTERFACE_LIST
      })
      this.interfaceListData = result
    },
    // 网络路由设置列表
    async getRouteListData () {
      let result = await this.$request({
        ...API.ROUTE_LIST
      })
      this.tableData = result.map(item => Object.assign({}, item, { flag: false }))
      this.tableData.push({ ...this.empty })
    },
    // 新增
    async reqRouteAdd (data) {
      let { desNet, pathCost, nextInterface, nextIp } = data
      await this.$request({
        ...API.ROUTE_ADD,
        data: { desNet, pathCost, nextInterface, nextIp }
      })
      this.showMessage('新增成功！', 'success')
    },
    // 删除
    async reqRouteDelete (data) {
      await this.$request({
        ...API.ROUTE_DELETE(data.id)
      })
      this.showMessage('删除成功！', 'success')
    },
    // 更新
    async reqRouteUpdate (data) {
      let { id, desNet, pathCost, nextInterface, nextIp } = data
      await this.$request({
        ...API.ROUTE_UPDATE,
        data: { id, desNet, pathCost, nextInterface, nextIp }
      })
      this.showMessage('更新成功！', 'success')
    }
  }
}
