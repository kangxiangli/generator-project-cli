import { getErrorMsgByEnd } from '@/custom/utils/base.js'

const BASE_URL = '/api/monitor'

const API = {
  // 监控配置（服务器）- 加载列表
  SERVICE_TABlE_DATA: {
    tag: 'service-table-loading',
    url: BASE_URL + '/configuration-host/list',
    method: 'post'
  },
  // 监控配置（服务器）- 删除
  SERVICE_DELETE_DATA: {
    url: BASE_URL + '/configuration-host',
    method: 'delete'
  },
  // 监控配置（服务器）- 新增
  SERVICE_ADD_DATA: {
    url: BASE_URL + '/configuration-host',
    method: 'post'
  },
  // 监控配置（服务器）- 告警配置初始显示
  SERVICE_CONFIG_QUERY_DATA: {
    tag: 'service-dialog-loading',
    url: BASE_URL + '/configuration-host',
    method: 'get'
  },
  // 监控配置（服务器）- 告警配置保存
  SERVICE_CONFIG_SAVE_DATA: {
    url: BASE_URL + '/configuration-host',
    method: 'put'
  },

  // 监控配置（组件）- 初始显示
  PLATFORM_DATA: {
    tag: 'platform-data-loading',
    url: BASE_URL + '/configuration-module',
    method: 'get'
  },
  // 监控配置（组件）- 保存
  PLATFORM_SAVE_DATA: {
    url: BASE_URL + '/configuration-module/host',
    method: 'post'
  },
  // 监控配置（组件）- 告警配置初始显示
  PLATFORM_CONFIG_DATA: {
    tag: 'platform-dialog-loading',
    url: BASE_URL + '/configuration-module/config',
    method: 'post'
  },
  // 监控配置（组件）- 告警配置保存
  PLATFORM_CONFIG_SAVE_DATA: {
    url: BASE_URL + '/configuration-module/module',
    method: 'post'
  },

  // 监控配置（数据质量）- 加载列表
  INFO_TABlE_DATA: {
    tag: 'info-table-loading',
    url: BASE_URL + '/configuration-data-quality/list',
    method: 'post'
  },
  // 监控配置（数据质量）- 删除
  INFO_DELETE_DATA: {
    url: BASE_URL + '/configuration-data-quality',
    method: 'delete'
  },
  // 监控配置（数据质量）- 新增 下拉
  INFO_DATA_LIST: {
    url: BASE_URL + '/configuration-data-quality/jobs',
    method: 'get'
  },
  // 监控配置（数据质量）- 新增
  INFO_ADD_DATA: {
    url: BASE_URL + '/configuration-data-quality',
    method: 'post'
  },
  // 监控配置（数据质量）- 告警配置初始显示
  INFO_CONFIG_QUERY_DATA: {
    tag: 'info-dialog-loading',
    url: BASE_URL + '/configuration-data-quality',
    method: 'get'
  },
  // 监控配置（数据质量）- 告警配置保存
  INFO_CONFIG_SAVE_DATA: {
    url: BASE_URL + '/configuration-data-quality',
    method: 'put'
  }
}

export default {
  methods: {
    // 监控配置（服务器）- 加载列表
    async getServiceTableData () {
      await this.$request({
        ...API.SERVICE_TABlE_DATA
      }).then(data => {
        this.table.dataAll = data.data
        this.table.total = data.total
        this.limit()
      })
    },
    // 监控配置（服务器）- 删除
    async deleteServiceData (id) {
      try {
        await this.$request({
          method: API.SERVICE_DELETE_DATA.method,
          url: API.SERVICE_DELETE_DATA.url + '/' + id
        })
        this.showMessage('删除成功')
        this.list('refresh')
      } catch (err) {
        this.showMessage((err && err.message) || '删除失败', 'error')
      }
    },
    // 监控配置（服务器）- 新增
    async addServiceData () {
      try {
        this.editBtnLoading = true
        await this.$request({
          ...API.SERVICE_ADD_DATA,
          data: {
            ...this.editForm
          }
        })
        this.editDialogVisible = false
        this.editBtnLoading = false
        this.showMessage('新增成功')
        this.list('refresh')
      } catch (err) {
        this.editBtnLoading = false
        if (Array.isArray(err.message)) {
          this.editFormError = {}
          this.$nextTick(_ => {
            this.editFormError = getErrorMsgByEnd(err)
          })
        } else {
          this.showMessage((err && err.message) || '新增失败', 'error')
        }
      }
    },
    // 监控配置（服务器）- 告警配置初始显示
    async queryConfigServiceData (id) {
      try {
        let data = await this.$request({
          tag: API.SERVICE_CONFIG_QUERY_DATA.tag,
          method: API.SERVICE_CONFIG_QUERY_DATA.method,
          url: API.SERVICE_CONFIG_QUERY_DATA.url + '/' + id
        })
        this.configForm = data
        this.configFormClone = JSON.parse(JSON.stringify(data))
        this.configDialogLoading = false
      } catch (err) {
        this.configDialogLoading = false
        this.showMessage((err && err.message) || 'error', 'error')
      }
    },
    // 监控配置（服务器）- 告警配置保存
    async saveConfigServiceData (id) {
      try {
        await this.$request({
          method: API.SERVICE_CONFIG_SAVE_DATA.method,
          url: API.SERVICE_CONFIG_SAVE_DATA.url + '/' + id,
          data: this.configForm
        })
        this.configDialogVisible = false
        this.showMessage('告警配置保存成功')
        this.list('refresh')
      } catch (err) {
        if (Array.isArray(err.message)) {
          this.configFormError = getErrorMsgByEnd(err)
        } else {
          this.showMessage((err && err.message) || '告警配置保存失败', 'error')
        }
      }
    },

    // 监控配置（组件）- 初始显示
    async getPlatformData () {
      let data = await this.$request({
        ...API.PLATFORM_DATA
      })
      this.translateData(data)
    },
    // 监控配置（组件）- 保存
    async addPlatformData (data) {
      try {
        await this.$request({
          method: API.PLATFORM_SAVE_DATA.method,
          url: API.PLATFORM_SAVE_DATA.url,
          data: {
            request_info: data
          }
        })
        this.showMessage('保存成功')
      } catch (err) {
        if (Array.isArray(err.message)) {
          this.editFormError = {}
          this.$nextTick(_ => {
            this.editFormError = getErrorMsgByEnd(err)
          })
        } else {
          this.showMessage((err && err.message) || '保存失败', 'error')
        }
      }
    },
    // 监控配置（组件）- 告警配置初始显示
    async queryConfigPlatformData (type, row) {
      try {
        let data = await this.$request({
          ...API.PLATFORM_CONFIG_DATA,
          data: {
            ips: row.ips,
            module: row.module
          }
        })
        this.configForm = data
        this.configFormClone = JSON.parse(JSON.stringify(data))
        this.configDialogLoading = false
      } catch (err) {
        this.configDialogLoading = false
      }
    },
    // 监控配置（组件）- 告警配置保存
    async saveConfigPlatformData () {
      try {
        await this.$request({
          method: API.PLATFORM_CONFIG_SAVE_DATA.method,
          url: API.PLATFORM_CONFIG_SAVE_DATA.url,
          data: this.configForm
        })
        this.configDialogVisible = false
        this.showMessage('告警配置保存成功')
        this.getPlatformData()
      } catch (err) {
        if (Array.isArray(err.message)) {
          this.configFormError = getErrorMsgByEnd(err)
        } else {
          this.showMessage((err && err.message) || '告警配置保存失败', 'error')
        }
      }
    },

    // 监控配置（数据质量）- 加载列表
    async getInfoTableData () {
      await this.$request({
        ...API.INFO_TABlE_DATA
      }).then(data => {
        this.table.dataAll = data.data
        this.table.total = data.total
        this.limit()
      })
    },
    // 监控配置（数据质量）- 删除
    async deleteInfoData (id) {
      try {
        await this.$request({
          method: API.INFO_DELETE_DATA.method,
          url: API.INFO_DELETE_DATA.url + '/' + id
        })
        this.showMessage('删除成功')
        this.list('refresh')
      } catch (err) {
        this.showMessage((err && err.message) || '删除失败', 'error')
      }
    },
    // 获取作业名称列表
    async getInfoDataList () {
      let { data } = await this.$request({
        ...API.INFO_DATA_LIST
      })
      this.editForm.jobList = data
    },
    // 监控配置（数据质量）- 新增
    async addInfoData (job) {
      try {
        this.editBtnLoading = true
        await this.$request({
          method: API.INFO_ADD_DATA.method,
          url: API.INFO_ADD_DATA.url + '/' + job
        })
        this.editDialogVisible = false
        this.editBtnLoading = false
        this.showMessage('新增成功')
        this.list('refresh')
      } catch (err) {
        this.editBtnLoading = false
        if (Array.isArray(err.message)) {
          this.editFormError = {}
          this.$nextTick(_ => {
            this.editFormError = getErrorMsgByEnd(err)
          })
        } else {
          this.showMessage((err && err.message) || '新增失败', 'error')
        }
      }
    },
    // 监控配置（数据质量）- 告警配置初始显示
    async queryConfigInfoData (id) {
      try {
        let data = await this.$request({
          tag: API.INFO_CONFIG_QUERY_DATA.tag,
          method: API.INFO_CONFIG_QUERY_DATA.method,
          url: API.INFO_CONFIG_QUERY_DATA.url + '/' + id
        })
        this.configForm = data
        this.configFormClone = JSON.parse(JSON.stringify(data))
        this.configDialogLoading = false
      } catch (err) {
        this.configDialogLoading = false
      }
    },
    // 监控配置（数据质量）- 告警配置保存
    async saveConfigInfoData (id) {
      try {
        await this.$request({
          method: API.INFO_CONFIG_SAVE_DATA.method,
          url: API.INFO_CONFIG_SAVE_DATA.url + '/' + id,
          data: this.configForm
        })
        this.configDialogVisible = false
        this.showMessage('告警配置保存成功')
        this.list('refresh')
      } catch (err) {
        if (Array.isArray(err.message)) {
          this.configFormError = getErrorMsgByEnd(err)
        } else {
          this.showMessage((err && err.message) || '告警配置保存失败', 'error')
        }
      }
    }
  }
}
