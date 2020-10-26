
import { download } from '@/custom/utils/upload-download.js'
const BASE_URL = '/api'
const API = {
  GET_LOG_LIST: {
    url: BASE_URL + '/sys/log-main/list/query',
    method: 'post',
    tag: 'manage-base-logger-list'
  },
  // 日志删除
  BATCH_DEL: {
    url: BASE_URL + '/sys/logs',
    method: 'delete'
  },
  // 日志备份
  BACKUP_LOG: {
    url: BASE_URL + '/sys/logs/export',
    method: 'POST'
  },

  // 日志类型常量
  LOG_TYPE: {
    url: BASE_URL + '/sys/logs/opttype',
    method: 'get'
  }
}
export default {
  methods: {
    /**
     * 获取日志列表
     */
    async getLogList () {
      try {
        // 删除多余数据
        const params = JSON.parse(JSON.stringify(this.searchData))
        delete params.data
        delete params.total
        this.searchData = await this.requestTable({
          ...API.GET_LOG_LIST,
          currentObj: params,
          params
        }, {
          noTime: true,
          tag: API.GET_LOG_LIST.tag
        })
      } catch (err) {
        this.showMessage(err.message, 'error')
      }
    },

    /**
     * 备份日志
     * @param {object} query 请求对象
     */
    async backupLog (query) {
      const data = JSON.parse(JSON.stringify(query))
      delete data.data
      delete data.total
      delete data.pageSize
      delete data.pageNum
      const content = await this.$request({
        ...API.BACKUP_LOG,
        data
      })
      if (content.fileName) {
        // 下载文件
        download(content.fileName)
      }
    },

    /**
     * 批量删除
     * @param {array} logIds
     */
    async batchDelete (logIds) {
      await this.$request({
        ...API.BATCH_DEL,
        data: logIds
      })
    },

    // 获取日志操作类型列表
    async getLogTypeList () {
      this.operateTypeList = await this.$request({
        ...API.LOG_TYPE
      })
    }
  }
}
