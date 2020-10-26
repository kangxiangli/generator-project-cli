
import { treeToList } from 'fusion-utils'
const BASE_URL = '/api/ueba/system/policy'
const API = {
  QUERY_SCENE_TREE: {
    url: '/api/ueba/dict/select/event-type-tree',
    tag: 'query-scene-tree'
  },
  DELETE: {
    tag: 'delete',
    url: BASE_URL + '/realtime/del'
  },
  COPY_STRATEGY: {
    tag: 'copy-strategy',
    url: BASE_URL + '/realtime/copy'
  },
  ENABLE: {
    tag: 'enable',
    url: BASE_URL + '/realtime/enable'
  },
  QUERY_PAGE: {
    url: BASE_URL + '/realtime/page/query',
    tag: 'query-page'
  },
  EXPORT_STRATEGY: {
    tag: 'export',
    url: BASE_URL + '/realtime/export',
    method: 'post'
  },
  QUERY_REALTIME_STATUS: {
    method: 'post',
    url: BASE_URL + '/realtime/status/query',
    tag: 'realtime-status'
  }
}
export default {
  methods: {
    getDictTable () {
      this.requestTable({
        ...API.QUERY_PAGE,
        currentObj: this.dictTable,
        params: {
          nameLike: this.serachParm.nameLike,
          riskType: this.serachParm.riskType
        }
      }).then(data => {
        this.dictTable = JSON.parse(JSON.stringify(data))
        this.dictTable.data.map(item => {
          let tem = this.sceneTreeArry.filter(o => item.riskType === o.id)
          item.riskTypeName = (tem[0] || {}).name || 'N/A'
        })
      })
    },
    /**
     * 递归处理分类
     */
    dealSceneTree (data) {
      return data.children.map(item => {
        if (item.count === undefined) {
          item.label = item.name
        } else {
          item.label = item.name + '(' + item.count + ')'
        }
        if (Array.isArray(item.children)) {
          return this.dealSceneTree(item)
        } else {
          return item
        }
      })
    },
    // 删除table ids
    async delTableIds () {
      let { url, tag } = API.DELETE
      let ids = this.multipleSelection.map(v => v.id).join(',')
      await this.$request({
        url: url,
        method: 'post',
        data: {
          idList: ids
        }
      }, {
        tag: tag
      })
      this.showMessage('批量删除成功')
      this.delDlgVisible = false
      this.list('submit')
    },
    // table复制事件
    async copyDict (row, val) {
      let { url } = API.COPY_STRATEGY
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
    },
    // 设置是否启用状态
    setEnable (row) {
      let { url } = API.ENABLE
      this.$request({
        url: url,
        method: 'post',
        data: {
          id: row.id,
          status: !row.status
        }
      }).then(data => {
        row.status = !row.status
        this.showMessage('设置成功')
        let inx = this.dictTable.data.findIndex(item => item.id === data.id)
        if (inx !== -1) {
          this.dictTable.data[inx].enableStatus = data.enableStatus
          this.dictTable.data[inx].statusComment = data.statusComment
        }
      })
    },
    // 分类tree
    querySceneTree () {
      this.$request({
        ...API.QUERY_SCENE_TREE,
        method: 'get'
      }).then(data => {
        this.sceneTree = [
          {
            id: 0,
            name: '所有分类',
            children: data
          }
        ]
        this.sceneTree.map(item => {
          if (item.count === undefined) {
            item.label = item.name
          } else {
            item.label = item.name + '(' + item.count + ')'
          }
          if (Array.isArray(item.children)) {
            return this.dealSceneTree(item)
          } else {
            return item
          }
        })
        /**
         * tree 扁平化处理
         */
        this.sceneTreeArry = treeToList(this.sceneTree)
        this.serachParm.riskType = this.sceneTreeArry.map(item => item.id).join(',')
        this.list('submit')
      })
    },
    // 更新状态
    updateRealTimeStatus () {
      let obj = []
      this.dictTable.data.map(item => {
        obj.push({ id: item.id, status: item.enableStatus })
      })
      if (!obj.length) return
      this.$request({
        ...API.QUERY_REALTIME_STATUS,
        data: {
          statusList: obj
        }
      }).then(data => {
        data.statusList.map(obj => {
          let inx = this.dictTable.data.findIndex(item => item.id === obj.id)
          if (inx !== -1) {
            this.dictTable.data[inx].enableStatus = obj.enableStatus
            this.dictTable.data[inx].status = obj.status
            this.dictTable.data[inx].statusComment = obj.statusComment
          }
        })
      })
    },
    // 导出
    open () {
      let ids = this.multipleSelection.map(v => v.id).join(',')
      this.upLoading = true
      return this.$request({
        ...API.EXPORT_STRATEGY,
        data: {
          idList: ids
        }
      })
    }
  }
}
