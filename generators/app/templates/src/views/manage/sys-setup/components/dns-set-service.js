const BASE_URL = '/api/argus-system-setting'
const API = {
  // DNS设置列表
  DNS_LIST: {
    url: `${BASE_URL}/dns/list`,
    method: 'get',
    tag: 'table-list'
  },
  // 新增
  DNS_ADD: {
    url: `${BASE_URL}/add/dns`,
    method: 'post',
    tag: 'table-list'
  },
  // 删除
  DNS_DELETE (id) {
    return {
      url: `${BASE_URL}/delete/dns/${id}`,
      method: 'delete',
      tag: 'table-list'
    }
  },
  // 更新
  DNS_UPDATE: {
    url: `${BASE_URL}/change/dns`,
    method: 'put',
    tag: 'table-list'
  }
}
export default {
  methods: {
    // DNS设置列表
    async getDnsListData () {
      let result = await this.$request({
        ...API.DNS_LIST
      })
      this.tableData = result.map(item => Object.assign({}, item, { flag: false }))
      this.tableData.push({ ...this.empty })
    },
    // 新增
    async reqDnsAdd (data) {
      await this.$request({
        ...API.DNS_ADD,
        data
      })
      this.showMessage('新增成功！', 'success')
    },
    // 删除
    async reqDnsDelete (data) {
      await this.$request({
        ...API.DNS_DELETE(data.id)
      })
      this.showMessage('删除成功！', 'success')
    },
    // 更新
    async reqDnsUpdate (data) {
      await this.$request({
        ...API.DNS_UPDATE,
        data
      })
      this.showMessage('更新成功！', 'success')
    }
  }
}
