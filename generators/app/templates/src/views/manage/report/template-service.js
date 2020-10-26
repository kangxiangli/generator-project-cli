
const API = {
  REPORTS: {
    url: '/api/manage/report/template/reports',
    tag: 'reportlist'
  },
  TABLE: {
    url: '/api/manage/report/template/report-details/query',
    tag: 'table'
  },
  REPORTS_DELETE: '/api/manage/report/template/report-details/delete',
  DOWNLOAD: {
    url: '/api/manage/report/template/filesDownload',
    method: 'post',
    tag: 'table'
  }
}

export default {
  methods: {
    /**
     * 获取报表分类列表
     */
    async getReportList () {
      let content = await this.$request({
        ...API.REPORTS,
        method: 'get'
      })
      this.reportList = content
    },

    /**
     * 删除 任务列表
     */
    async deleteTaskRequest (param) {
      await this.$request({
        method: 'post',
        url: API.REPORTS.url + '/delete',
        data: param
      })
      this.getReportList()  // 获取报表分类列表
      this.showMessage('删除成功!')
    },

    /**
     * ====================== table 相关 ======================
     */
    /**
     * 获取表格数据
     */
    async getTableData () {
      const result = await this.requestTable({
        ...API.TABLE,
        params: {
          reportId: this.currentReport.reportId,
          taskId: this.currentReport.taskId,
          fileName: this.fileName
        },
        currentObj: this.tableData
      }, {
        tag: 'table'
      })
      this.tableData = Object.assign({}, result)
    },

    /**
     * 删除 任务列表
     */
    async deleteRequest (param) {
      await this.$request({
        method: 'post',
        url: API.REPORTS_DELETE,
        data: param
      })
      // 重新获取表格数据
      this.getTableData()
      this.showMessage('删除成功')
    },

    /**
     * 文件下载请求
     */
    downloadRequest (params) {
      let ids = params.map(item => item.id)
      return this.$request({
        ...API.DOWNLOAD,
        data: {
          ids: ids
        }
      })
    }
  }
}
