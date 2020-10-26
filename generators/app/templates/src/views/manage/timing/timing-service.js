const BASE_URL = '/api'
const API = {
  GET_TIME_LIST: {
    url: BASE_URL + '/job/load-task-list',
    method: 'get'
  },
  GET_TASK_INFO: {
    url: BASE_URL + '/job/load-task',
    method: 'get',
    tag: 'loadTask'
  },
  // 更新任务状态
  UPDATE_TASK_STATUS: {
    url: BASE_URL + '/job/updata-task-status',
    method: 'post'
  },
  // 执行任务
  EXCUTE_TASK: {
    url: BASE_URL + '/job/run-task',
    method: 'get'
  },
  // 更新任务执行规则
  EXCUTE_CRON: {
    url: BASE_URL + '/job/updata-task-rule',
    method: 'post'
  },
  // 未知资产扫描任务配置-获取
  ASSET_TASK_CONFIG: {
    url: BASE_URL + '/asset/task-config',
    method: 'get',
    tag: 'loadTask'
  },
  // 未知资产扫描任务配置-保存
  ASSET_TASK_CONFIG_SAVE: {
    url: BASE_URL + '/asset/task-save-config',
    method: 'post'
  }
}
export default {
  methods: {
    /**
     * 趋势分析
     * @param {string} type
     * trend-analysis: '趋势分析'
     * internal-assets: '内部未知资产发现周期配置'
     * externalAssets: '外部资产监控周期配置'
     * ti: '安全威胁情报分析周期配置'
     */
    async getCronData (type) {
      const data = await this.$request({
        url: API.GET_TIME_LIST.url + '/' + type,
        method: API.GET_TIME_LIST.method,
        tag: type
      })
      data.data.forEach(task => {
        let rule = {}
        try {
          if (task.cronRule) {
            rule = JSON.parse(task.cronRule)
          }
        } catch (err) {
        }
        // 判断趋势分析组数据
        if (type === 'trend-analysis') {
          rule.interval = rule.interval ? (rule.interval / 60 / 24) : 0
        }
        task.cronRule = rule
      })
      return data.data
    },

    // 获取所有定时任务列表
    async getAllTaskList () {
      try {
        const [trendAnalysisData, internalAssetsData, securityThreatData] = await Promise.all([
          this.getCronData('trend-analysis'),
          this.getCronData('internal-assets'),
          // this.getCronData('external-assets'),
          this.getCronData('ti')
        ])
        // 趋势分析
        this.trendAnalysisData = trendAnalysisData
        // 内部未知资产发现周期配置
        this.internalAssetsData = internalAssetsData
        // 外部资产监控周期配置
        // this.externalAssetsData = externalAssetsData
        // 安全威胁情报分析周期配置
        this.securityThreatData = securityThreatData
      } catch (err) {
        this.showMessage(err.message, 'error')
      }
    },

    /**
     * 加载定时任务详情
     */
    async loadTaskDetail (id) {
      try {
        const data = await this.$request({
          url: API.GET_TASK_INFO.url + '/' + id,
          method: API.GET_TASK_INFO.method,
          tag: API.GET_TASK_INFO.tag
        })
        if (typeof data.cronRule === 'string') {
          data.cronRule = data.cronRule ? JSON.parse(data.cronRule) : {}
        }
        this.$set(this, 'taskData', data)
        this.$set(this, 'cronData', data.cronRule)
      } catch (err) {
        this.showMessage(err.message, 'error')
      }
    },

    /**
     * 执行任务
     * @param {string} id 任务id
     */
    async runTask (id) {
      const data = await this.$request({
        url: API.EXCUTE_TASK.url + '/' + id,
        method: API.EXCUTE_TASK.method
      })
      return data
    },

    /**
     * 更新任务状态
     * @param {object} data {id, taskStatus}
     */
    async updateTaskStatus (data) {
      const res = await this.$request({
        ...API.UPDATE_TASK_STATUS,
        data
      })
      return res
    },
    /**
     * 更新任务执行规则
     * @param {object} data
     */
    async updateTaskCron (id, data) {
      const res = await this.$request({
        ...API.EXCUTE_CRON,
        data: {
          id,
          cronRule: JSON.stringify(data)
        }
      })
      return res
    },
    /**
     * 未知资产扫描任务配置-获取
     */
    async getAssetTaskConfig () {
      this.internalAssetsData = await this.$request({
        ...API.ASSET_TASK_CONFIG
      })
    },
    /**
     * 未知资产扫描任务配置-保存
     * @param {object} data
     */
    async saveAssetTaskConfig (data) {
      const res = await this.$request({
        ...API.ASSET_TASK_CONFIG_SAVE,
        data
      })
      return res
    }
  }
}
