const BASE_URL = '/api/argus-system-setting'
const API = {
  // 地址获取方式列表
  BOOTPROTO_LIST: {
    url: '/api/argus-common/dict/bootproto',
    method: 'get'
  },
  // 网络设置：详情
  NETWORK_DETAIL (id) {
    return {
      url: `${BASE_URL}/interface/${id}`,
      method: 'get',
      tag: 'form-list'
    }
  },
  // 网络设置：保存
  NETWORK_SAVE: {
    url: `${BASE_URL}/change/interface`,
    method: 'put',
    tag: 'form-list'
  }
}

export default {
  methods: {
    // 地址获取方式列表
    async getBootprotoListData () {
      this.bootprotoListData = await this.$request({
        ...API.BOOTPROTO_LIST
      })
    },
    // 网络设置：详情
    async getNetworkDetailData ({ id }) {
      let result = await this.$request({
        ...API.NETWORK_DETAIL(id)
      })
      this.cacheData = result
      this.formData = Object.assign({}, result)
    },
    // 网络设置：保存
    async reqNetworkSaveData () {
      await this.$request({
        ...API.NETWORK_SAVE,
        data: this.formData
      })
      this.showMessage('保存成功！')
    }
  }
}
