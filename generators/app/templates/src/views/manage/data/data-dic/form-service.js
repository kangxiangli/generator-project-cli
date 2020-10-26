/**
 * Created by ligang on 2017/10/13.
 */
// 基础路径
const BASE_URL = '/api/setting/etl/dict'

const API = {
  // 字典定义
  dict_define: BASE_URL + '/define',
  // 字典列表
  DICT_LIST: {
    url: BASE_URL + '/list',
    method: 'get',
    tag: 'dict-list'
  },
  // 字典删除
  DELETE_DICTIONARY: {
    url: BASE_URL + '/many/delete',
    method: 'post'
  },
  // 模糊查询
  SEARCH_DICTIONARY: BASE_URL + '/list/filter'
}

export default {
  methods: {
    // 初始化字典列表
    async getTableData () {
      this.tableData = await this.$request({
        ...API.DICT_LIST
      })
    },
    // 字典删除
    deleteDictionary () {
      this.$request({
        ...API.DELETE_DICTIONARY,
        data: {
          list: this.checkSelection
        }
      }).then((content) => {
        this.showMessage('删除成功')
        this.getTableData()
      }, (error) => {
        this.showMessage(error.message, 'error')
      })
    },
    // 查询
    async searchName () {
      this.tableData = await this.$request({
        method: 'get',
        url: API.SEARCH_DICTIONARY + '?dictName=' + this.dictionaryName,
        data: {}
      })
    }
  }
}
