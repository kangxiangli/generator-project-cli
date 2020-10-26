const BASE_URL = '/api'

const API = {
  // license信息查询接口
  LICENSE_QUERY: {
    url: BASE_URL + '/license',
    tag: 'manage-license-query',
    method: 'get'
  }
}

export default {
  methods: {
    /**
     * license信息查询接口
     */
    async getLicenseQuery () {
      const data = await this.$request({
        ...API.LICENSE_QUERY
      })
      this.licenseInfo = data || {}
    }
  }
}