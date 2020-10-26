import { request } from '@/custom/plugins/request.js'
const BASE_URL = '/api/setting/etl/rule-manage'

const API = {
  LIBRARY_LIST: {
    url: BASE_URL + '/library-query-page',
    tag: 'library-list'
  },
  DELETE_LIBRARY: BASE_URL + '/library-delete',
  // 复制规则
  COPY_LIBRARY: BASE_URL + '/library-copy',
  // 规则库导出
  EXPORT_LIBRARY: BASE_URL + '/library-export-md5-file',
  // 规则库树形菜单
  LIBRARY_TREE: BASE_URL + '/library-tree-menu'
}

export default {
  methods: {
    async getTableData () {
      this.requestTable({
        ...API.LIBRARY_LIST,
        currentObj: this.tableData,
        params: this.SearchForm
      }, {
        noTime: true
      }).then((res) => {
        this.tableData = Object.assign({}, res)
      })
    },
    // 规则删除确认
    delLibrary (checkSelection) {
      checkSelection = [].concat(checkSelection)
      let ids = []
      checkSelection.forEach(element => {
        ids.push(element.uuid)
      })
      this.$confirm('此操作将永久删除已选项, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.sureDel(ids)
      }).catch(() => {
        this.showMessage('已取消删除', 'info')
      })
    },
    // 规则确认删除
    sureDel (ids) {
      this.$request({
        url: API.DELETE_LIBRARY,
        method: 'post',
        data: {
          ids: ids
        }
      }).then((content) => {
        this.showMessage('删除成功')
        this.getTableData()
      }, (error) => {
        this.showMessage(error.message, 'error')
      })
    },
    // 规则复制
    async copyLibrary (param) {
      await this.$request({
        url: API.COPY_LIBRARY,
        method: 'post',
        data: param
      })
      this.showMessage('复制成功!', 'success') && this.getTableData() && (this.dialogVisible = false)
    },
    // 规则库导出
    async exportLibrary () {
      request({
        url: API.EXPORT_LIBRARY
      }, {
        responseType: 'blob'
      }).then(blob => {
        // 将二进制流转换，放入 a 标签中下载
        const url = window.URL.createObjectURL(blob.data)
        const suffix = blob.headers['content-disposition'] ? blob.headers['content-disposition'].split('.')[1] : ''
        let tagA = document.createElement('a')
        let fileName = blob.headers['content-disposition'].substring(blob.headers['content-disposition'].indexOf('=') + 1, blob.headers['content-disposition'].indexOf('.'))
        tagA.setAttribute('download', fileName + '.' + suffix)
        tagA.setAttribute('href', url)
        tagA.click()
        // 释放
        tagA = null
        window.URL.revokeObjectURL(url)
      })
    },
    // 规则库树形菜单
    async getLibraryTree () {
      this.$request({
        url: API.LIBRARY_TREE,
        method: 'get',
        tag: 'tree-list'
      }).then((res) => {
        this.treeData = res
      })
    }
  }
}
