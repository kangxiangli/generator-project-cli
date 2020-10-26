/**
 * Created by ligang on 2017/10/13.
 */
import { getErrorMsgByEnd } from '@/custom/utils/base.js'
// 基础路径
const BASE_URL = ''

const API = {

  // 表格数据（表格）
  DICTIONARY_LIST: {
    url: BASE_URL + '/api/sys/dictionary-data/list/query',
    tag: 'dictionary-list'
  },

  // 字典信息 增加
  ADD_DICTIONARY: {
    url: '/api/sys/dictionary-data',
    method: 'post'
  },
  // 删除 字典
  DELETE_DICTIONARY: {
    url: '/api/sys/dictionary-data/delete',
    method: 'post'
  },
  // 更新 字典
  UPDATE_DICTIONARY: {
    url: '/api/sys/dictionary-data',
    method: 'PUT'
  },
  // 根据id查询字典
  GET_DICTIONARY_INFO: {
    url: '/api/sys/dictionary-data',
    method: 'get'
  },
  // 查询 字典树
  DICTIONARY_TREE: {
    url: '/api/argus-common/dict-tree',
    method: 'GET',
    tag: 'manage-base-data-dict-list'
  }
}

export default {
  methods: {
    // 获取字典分类（参数列表）
    async initDictionaryTree (ck) {
      try {
        await this.$request({
          url: API.DICTIONARY_TREE.url,
          method: API.DICTIONARY_TREE.method
        }, {
          tag: API.DICTIONARY_TREE.tag
        }).then(data => {
          ck ? ck(data) : this.dictionaryList = data
        })
      } catch (err) {
        this.showMessage(err.message, 'error')
      }
    },

    /**
     * 表格数据
     * "itemId": "D0001",                    //分类编码
     * "createTime": 1497861647000,          //创建时间
     * "updateUser": "admin",                //更新用户
     * "dictName": "性别",                   //字典名称
     * "comment": "1：男，2：女",            //字典描述
     * "createUser": "system",              //创建者
     * "updateTime": 1504075660000,         //更新时间
     * "dictId": "000"                      //字典编码
     */
    async getTableData () {
      const result = await this.requestTable({
        ...API.DICTIONARY_LIST,
        currentObj: this.dictionaryTableData,
        params: {
          name: this.name
        }
      })
      this.dictionaryTableData = Object.assign({}, result)
    },

    /**
     * 添加|编辑字典数据
     * @param params
     * {
     *    method: 'post|put',
     *    data: {}
     * }
     * @param visibleObj
     * @param reloadTable
     */
    addOrEditDictionary (params, visibleObj, reloadTable) {
      return this.$request({
        ...params,
        url: API.ADD_DICTIONARY.url
      }).then(() => {
        // 关闭相关弹窗
        this[visibleObj] = false
        // 重新获取表格数据
        reloadTable && this.getTableData()
      }, err => {
        return Promise.reject(getErrorMsgByEnd(err))
      })
    },

    // 删除字典数据
    async deleteDictionary (param) {
      try {
        await this.$request({
          method: API.DELETE_DICTIONARY.method,
          url: API.DELETE_DICTIONARY.url,
          data: { ids: param }
        })
        this.getTableData()
        Promise.resolve()
      } catch (e) {
        Promise.reject(e)
      }
    },
    // 获取字典详情
    async getDictionaryInfo (id) {
      try {
        await this.$request({
          method: API.GET_DICTIONARY_INFO.method,
          url: API.GET_DICTIONARY_INFO.url + '/' + id
        }).then(data => {
          this.dict = data
        })
        // this.dict = result
        // console.log(this.dict)
        // this.getTableData()
        Promise.resolve()
      } catch (e) {
        Promise.reject(e)
      }
    }
  }
}
