const BASE_URL = '/api/argus-system-setting'
const API = {
  // NTP设置列表
  NTP_LIST: {
    url: `${BASE_URL}/ntp/list`,
    method: 'get',
    tag: 'table-list'
  },
  // 新增
  NTP_ADD: {
    url: `${BASE_URL}/add/ntp`,
    method: 'post',
    tag: 'table-list'
  },
  // 删除
  NTP_DELETE (id) {
    return {
      url: `${BASE_URL}/delete/ntp/${id}`,
      method: 'delete',
      tag: 'table-list'
    }
  },
  // 更新
  NTP_UPDATE: {
    url: `${BASE_URL}/change/ntp`,
    method: 'put',
    tag: 'table-list'
  }
}
export default {
  methods: {
    // NTP设置列表
    async getNtpListData () {
      let result = await this.$request({
        ...API.NTP_LIST
      })
      this.tableData = result.map(item => Object.assign({}, item, { flag: false }))
      this.tableData.push({ ...this.empty })
    },
    // 新增
    async reqNtpAdd (data) {
      await this.$request({
        ...API.NTP_ADD,
        data
      })
      this.showMessage('新增成功！', 'success')
    },
    // 删除
    async reqNtpDelete (data) {
      await this.$request({
        ...API.NTP_DELETE(data.id)
      })
      this.showMessage('删除成功！', 'success')
    },
    // 更新
    async reqNtpUpdate (data) {
      await this.$request({
        ...API.NTP_UPDATE,
        data
      })
      this.showMessage('更新成功！', 'success')
    }
  }
}
