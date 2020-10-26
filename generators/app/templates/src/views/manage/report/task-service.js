
const API = {
  REPORT_TYPES: '/api/manage/report/task/report-types',
  REPORT_DATA: '/api/manage/report/task/statistics-types',
  REPORT_FORM: {
    url: '/api/manage/report/task/task-details/query',
    tag: 'full-screen'
  },
  REPORT_FORM_Add: {
    url: '/api/manage/report/task/task-details',
    tag: 'full-screen'
  }
}

export default {
  methods: {
    /**
     * 获取报表任务组列表数据
     */
    async initReportTypes () {
      this.reportTypeList = await this.$request({
        url: API.REPORT_TYPES
      })
    },

    /**
     * 获取任务组列表
     */
    async initReportData () {
      this.reportData = await this.$request({
        url: API.REPORT_DATA
      })
      this.initCheckStatus()
    },

    /**
     * 获取任务详情 - 表单
     */
    async getReportForm (taskId) {
      let content = await this.$request({
        method: 'post',
        ...API.REPORT_FORM,
        data: {
          id: taskId
        }
      })
      this.formInfo = Object.assign({}, this.formInfo, content)
      if (this.formInfo.startTime) {
        this.formInfo.startTime = new Date(+this.formInfo.startTime)
      }
      this.formInfo[this.formInfo.cycle] = +this.formInfo.cycleTime
      if (this.formInfo.day) {
        this.formInfo.day = new Date(+this.formInfo.day)
      }
      this.initCheckStatus()
    },

    /**
     * 提交表单
     */
    async saveTaskForm (requestData) {
      await this.$request({
        ...API.REPORT_FORM_Add,
        method: this.status === 'add' ? 'post' : 'put',
        data: requestData
      })
      this.$refs['formInfo'].resetFields()
      this.formInfo = Object.assign({}, JSON.parse(this.originalForm), {
        day: new Date(),
        startTime: new Date()
      })
      this.initCheckStatus()
      this.showMessage('任务保存成功!')
      this.$nextTick(() => {
        this.$refs['formInfo'].clearValidate()
      })
    }
  }
}
