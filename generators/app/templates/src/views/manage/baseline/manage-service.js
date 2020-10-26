const BASE_URL = '/api/ueba/baseline'
const API = {
  QUERY: {
    tag: 'query',
    url: BASE_URL + '/query'
  },
  DELETE: {
    tag: 'delete',
    url: BASE_URL + '/del'
  },
  COPY: {
    tag: 'copy',
    url: BASE_URL + '/copy'
  },
  VALLIST: {
    tag: 'values-list',
    url: BASE_URL + '/values/list'
  },
  ENABLE: {
    tag: 'enable',
    url: '/api/ueba/system/policy/enable'
  }
}
export default {
  methods: {
    async getBaseLineDataTable () {
      let { tag, url } = API.QUERY
      let result = await this.requestTable({
        url: url,
        currentObj: this.baseLineDataTable,
        params: {
          name: this.serachDataParm.name
        }
      }, {
        tag: tag
      })
      this.baseLineDataTable = Object.assign({}, this.baseLineDataTable, result)
    },
    async getVListDataTable () {
      let { tag, url } = API.VALLIST
      let result = await this.requestTable({
        url: url,
        currentObj: this.vListTable,
        params: {
          key: this.dgValList.search,
          baselineId: this.dgValList.baselineId
        }
      }, {
        tag: tag
      })
      this.vListTable = Object.assign({}, this.vListTable, result)
    },
    async delBaseLine () {
      let { url } = API.DELETE
      let ids = this.multipleSelection.map(v => v.id).join(',')
      try {
        await this.$request({
          url: url,
          method: 'post',
          data: {
            idList: ids
          }
        })
        this.showMessage('批量删除成功')
        this.delBatchBtnLoading = false
        this.delBatchDialogVisible = false
        this.list('submit')
      } catch (error) {
        this.delBatchBtnLoading = false
        this.showMessage(error.message, 'error')
      }
    },
    async copyBaseLine (row, val) {
      let { url } = API.COPY
      try {
        await this.$request({
          url: url,
          method: 'post',
          data: {
            id: row.id,
            newName: val
          }
        })
        this.showMessage('复制' + val + '成功')
        this.list('submit')
      } catch (error) {
        this.showMessage(error.message, 'error')
      }
    },
    async setEnable (row) {
      let { url } = API.ENABLE
      try {
        await this.$request({
          url: url,
          method: 'post',
          data: {
            id: row.strategyId,
            status: row.status
          }
        })
        this.showMessage('设置成功')
      } catch (error) {
        row.status = !row.status
        this.showMessage(error.message, 'error')
      }
    }
  }
}
