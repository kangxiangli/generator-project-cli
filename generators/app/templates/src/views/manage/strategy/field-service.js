import { getErrorMsgByEnd } from '@/custom/utils/base.js'
const BASE_URL = '/api/ueba/dict/manage'
const API = {
  DICT_DATA: {
    tag: 'list-page',
    url: BASE_URL + '/data/dictData/query'
  },
  DICT_DATA_INFO: {
    tag: 'dict-data-info',
    url: BASE_URL + '/data/dictDataInfo/query'
  },
  DICT_CAT_TREE: {
    tag: 'dict-data',
    url: BASE_URL + '/category/dictCatTree/query'
  },
  ADD_DICT_NODE: {
    tag: 'add-dict-cat',
    url: BASE_URL + '/category/addDictCat'
  },
  DELETE_DICT_NODE: {
    tag: 'delete-dict-cat',
    url: BASE_URL + '/category/delDictCat'
  },
  ADD_DICT_DATA: {
    tag: 'add-dict-data',
    url: BASE_URL + '/data/addDictData'
  },
  UPDATE_DICT_DATA: {
    tag: 'update-dict-data',
    url: BASE_URL + '/data/updDictData'
  },
  DOWNLOAD_FILE: {
    tag: 'download-file',
    url: BASE_URL + '/data/downloadFile'
  },
  DEL_DICT_DATA: {
    tag: 'del-dict-data',
    url: BASE_URL + '/data/delDictData'
  }
}
export default {
  methods: {
    async getDictDataTable () {
      let { tag, url } = API.DICT_DATA
      let params = this.serachDataParm
      let result = await this.requestTable({
        url: url,
        currentObj: this.dictDataTable,
        params
      }, {
        tag: tag,
        noTime: true
      })
      this.dictDataTable = Object.assign({}, this.dictDataTable, result)
    },
    async getDictInfo (id) {
      let { url, tag } = API.DICT_DATA_INFO
      await this.$request({
        method: 'post',
        url: url,
        data: { id: id }
      }, {
        tag: tag
      }).then(data => {
        this.dictInfo = data
      })
    },
    async dealDictInfo (id) {
      let { url, tag } = API.DICT_DATA_INFO
      await this.$request({
        method: 'post',
        url: url,
        data: { id: id }
      }, {
        tag: tag
      }).then(data => {
        this.dictInfoFrom = Object.assign({}, this.dictInfoFrom, data)
        if (this.dictInfoFrom.seg1 !== null) {
          this.dictInfoFrom.params.push({ seg: this.dictInfoFrom.seg1, desc: this.dictInfoFrom.seg1Desc })
        }
        if (this.dictInfoFrom.seg2 !== null) {
          this.dictInfoFrom.params.push({ seg: this.dictInfoFrom.seg2, desc: this.dictInfoFrom.seg2Desc })
        }
        if (this.dictInfoFrom.seg3 !== null) {
          this.dictInfoFrom.params.push({ seg: this.dictInfoFrom.seg3, desc: this.dictInfoFrom.seg3Desc })
        }
      })
    },
    async delDictInfo (id) {
      let { url } = API.DEL_DICT_DATA
      try {
        await this.$request({
          url: url,
          method: 'post',
          data: {
            id: id
          }
        })
        this.showMessage('删除成功')
        this.list('submit')
        this.$set(this.expends, 'deldictinfo' + id, false)
      } catch (error) {
        this.$set(this.expends, 'deldictinfo' + id, false)
        this.showMessage(error.message, 'error')
      }
    },
    async opearDictInfo () {
      if (this.dictInfoFrom.id === undefined) {
        let { url } = API.ADD_DICT_DATA
        try {
          await this.$request({
            url: url,
            method: 'post',
            data: this.dictInfoFrom
          })
          this.showMessage('新增成功')
          this.list('submit')
          this.$set(this.expends, 'operadictinfo', false)
          this.closeDictDialog()
        } catch (error) {
          this.$set(this.expends, 'operadictinfo', false)
          if (Array.isArray(error.message)) {
            this.diFromError = getErrorMsgByEnd(error)
          } else {
            this.showMessage((error && error.message) || '保存失败', 'error')
          }
        }
      } else {
        let { url } = API.UPDATE_DICT_DATA
        try {
          await this.$request({
            url: url,
            method: 'post',
            data: this.dictInfoFrom
          })
          this.showMessage('更新成功')
          this.list('submit')
          this.$set(this.expends, 'operadictinfo', false)
          this.closeDictDialog()
        } catch (error) {
          this.$set(this.expends, 'operadictinfo', false)
          if (Array.isArray(error.message)) {
            this.diFromError = getErrorMsgByEnd(error)
          } else {
            this.showMessage((error && error.message) || '保存失败', 'error')
          }
        }
      }
    },
    async addDictNode () {
      let { url, tag } = API.ADD_DICT_NODE
      try {
        await this.$request({
          method: 'post',
          url: url,
          data: this.nodeInfoFrom
        }, {
          tag: tag
        })
        this.getDictCatTree()
        this.expandedIds = [this.nodeInfoFrom.id]
        this.showMessage('保存成功', 'success')
        this.$set(this.expends, 'adddictnode', false)
        this.dictDialog.treeVisible = false
      } catch (error) {
        if (Array.isArray(error.message)) {
          this.niFromError = getErrorMsgByEnd(error)
        } else {
          this.showMessage((error && error.message) || '保存失败', 'error')
        }
        this.$set(this.expends, 'adddictnode', false)
      }
    },
    async delDictNode (id) {
      let { url } = API.DELETE_DICT_NODE
      try {
        await this.$request({
          url: url,
          method: 'post',
          data: {
            id: id
          }
        })
        this.expandedIds = []
        this.showMessage('删除成功')
        this.getDictCatTree()
      } catch (error) {
        this.showMessage(error.message, 'error')
      }
    },
    async getDictCatTree () {
      let { url, tag } = API.DICT_CAT_TREE
      await this.$request({
        method: 'get',
        url: url
      }, {
        tag: tag
      }).then(data => {
        this.logDictData = data.children
        this.opeLogDictData = JSON.parse(JSON.stringify(data.children))
      })
    },
    open () {
      return this.$request({
        url: API.DOWNLOAD_FILE.url
      })
    }
  }
}
