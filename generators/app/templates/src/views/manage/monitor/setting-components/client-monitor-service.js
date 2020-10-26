const BASE_URL = '/api/monitor'

const API = {
  CLIENT_CONFIG: {
    url: BASE_URL + '/configuration-client'
  },
  CLIENT_MONITOR_STATUS: {
    url: BASE_URL + '/configuration-client/monitor',
    method: 'put'
  }
}

export default {
  methods: {
    // 获取表格数据
    async getTableData () {
      this.tableData = await this.requestTable({
        url: API.CLIENT_CONFIG.url + '/query',
        method: 'post',
        tag: 'table-data',
        params: {
          ...this.formData
        },
        currentObj: this.tableData
      }, { noTime: true })
    },
    // 删除数据
    async deleteClientConfigData (ids) {
      this.confirmBox().then(async () => {
        try {
          await this.$request({
            url: API.CLIENT_CONFIG.url + '/delete',
            method: 'post',
            data: { ids }
          })
          this.showMessage('删除成功')
          this.getTableData()
        } catch (error) {
          this.showMessage(error.message, 'error')
        }
      })
    },
    // 监控|取消监控
    async modifyClientMonitorStatus (dataAry) {
      try {
        await this.$request({
          ...API.CLIENT_MONITOR_STATUS,
          data: { info: dataAry }
        })
        this.showMessage('监控状态修改成功')
        this.getTableData()
      } catch (error) {
        this.showMessage(error.message, 'error')
      }
    }
  }
}
