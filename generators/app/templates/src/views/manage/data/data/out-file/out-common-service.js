const BASE_URL = '/api/setting/etl/component'
const API = {
  link_info: BASE_URL + '/clusters/url',
  add_out: '/api/setting/etl/job/ui/output-add'
}

export default {
  methods: {
    // 输入建议
    querySearch (queryString, cb) {
      var nodeList = this.nodeList
      var results = queryString ? nodeList.filter(this.createFilter(queryString)) : nodeList
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter (queryString) {
      return (nodeList) => {
        return (nodeList.clusterUrl.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },

    /**
     * 关闭弹框清除表单
     * @param {string} formName 表单ref名称
     */
    closeDialog (formName) {
      this.$refs[formName] && this.$refs[formName].resetFields()
      this.$emit('close', 1)
    },

    /**
     * 获取集群
     * @param {string} type
     */
    async getCluster (type) {
      let result = await this.$request({
        method: 'get',
        url: API.link_info + '?componentType=' + type,
        data: {}
      })
      this.nodeList = result
    },

    /**
     * 数据保存请求
     * @param {Object} requestData 请求数据
     */
    async saveOutputDataRequest (requestData) {
      this.$request({
        method: 'post',
        url: API.add_out,
        data: requestData
      }).then((content) => {
        this.$message({
          message: '编辑成功',
          type: 'success'
        })
        this.$emit('close', 1)
        this.$emit('change-data', requestData)
      }, (error) => {
        this.showMessage(error.message, 'error')
      })
    }
  }
}
