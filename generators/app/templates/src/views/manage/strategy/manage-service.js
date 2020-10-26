const BASE_URL = '/api/ueba/system/policy'
const API = {
  QUERY_PAGE: {
    url: BASE_URL + '/queryPage/query',
    tag: 'query-page'
  },
  QUERY_SCENE_TREE: {
    url: BASE_URL + '/querySceneTree/query',
    tag: 'query-scene-tree'
  },
  DELETE: {
    tag: 'delete',
    url: BASE_URL + '/del'
  },
  COPY_STRATEGY: {
    tag: 'copy-strategy',
    url: BASE_URL + '/copyStrategy'
  },
  ENABLE: {
    tag: 'enable',
    url: BASE_URL + '/enable'
  }
}
export default {
  methods: {
    getDictTable () {
      let { tag, url } = API.QUERY_PAGE
      Promise.all([
        this.$request({
          method: 'get',
          url: '/api/ueba/dict/select/getRiskTypeList'
        }), this.requestTable({
          url: url,
          currentObj: this.dictTable,
          params: {
            nameLike: this.serachDataParm.name,
            riskType: this.serachDataParm.riskType
          }
        }, {
          tag: tag
        })]).then((res) => {
        let data1 = res[0]
        let data2 = Object.assign({}, res[1])
        for (let index = 0; index < data2.data.length; index++) {
          for (let inx = 0; inx < data1.length; inx++) {
            if (data2.data[index].riskType !== 0 && data2.data[index].riskType !== null) {
              if (data2.data[index].riskType === data1[inx].id) {
                data2.data[index].riskType = data1[inx].name
              }
            } else {
              data2.data[index].riskType = 'N/A'
            }
          }
        }
        this.dictTable = Object.assign({}, this.dictTable, data2)
      })
    },
    async delDict () {
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
    async copyDict (row, val) {
      let { url } = API.COPY_STRATEGY
      try {
        await this.$request({
          url: url,
          method: 'post',
          data: {
            strategyId: row.id,
            newName: val
          }
        })
        this.showMessage('复制' + val + '成功')
        this.list('submit')
      } catch (error) {
        this.showMessage(error.message, 'error')
      }
    },
    dealSceneTree (data) {
      return data.children.map(item => {
        if (Array.isArray(item.children)) {
          if (item.count === undefined) {
            item.label = item.name
          } else {
            item.label = item.name + '(' + item.count + ')'
          }
          return this.dealSceneTree(item)
        } else {
          if (item.count === undefined) {
            item.label = item.name
          } else {
            item.label = item.name + '(' + item.count + ')'
          }
          return item
        }
      })
    },
    async querySceneTree () {
      let { url, tag } = API.QUERY_SCENE_TREE
      await this.$request({
        method: 'post',
        url: url,
        data: {
          nameLike: this.serachDataParm.name
        }
      }, {
        tag: tag
      }).then(data => {
        this.sceneTree = [
          {
            id: 0,
            name: '所有分类',
            children: data
          }
        ]
        // this.sceneTree = data
        // this.sceneTree.splice(0, 0, {name: '所有分类', id: 0})
        this.sceneTree.map(item => {
          if (Array.isArray(item.children)) {
            if (item.count === undefined) {
              item.label = item.name
            } else {
              item.label = item.name + '(' + item.count + ')'
            }
            return this.dealSceneTree(item)
          } else {
            if (item.count === undefined) {
              item.label = item.name
            } else {
              item.label = item.name + '(' + item.count + ')'
            }
            return item
          }
        })
      })
    },
    async setEnable (row) {
      let { url } = API.ENABLE
      try {
        await this.$request({
          url: url,
          method: 'post',
          data: {
            id: row.id,
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
