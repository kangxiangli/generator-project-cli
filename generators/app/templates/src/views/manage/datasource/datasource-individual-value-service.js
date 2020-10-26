const BASE_URL = '/api'
const API = {
  // 获取字段列表
  GET_INDIVIDUAL_LIST: {
    url: BASE_URL + '/sys/datasource-individual-type/list/query',
    tag: 'manage-datasource-individual-value-list',
    method: 'POST'
  },
  // 字段详情
  GET_INDIVIDUAL_INFO: {
    url: BASE_URL + '/sys/datasource-individual-type',
    tag: 'manage-datasource-individual-value-info'
  },
  // 新增
  ADD_INDIVIDUAL: {
    url: BASE_URL + '/sys/datasource-individual-type',
    method: 'POST'
  },
  // 编辑
  EDIT_INDIVIDUAL: {
    url: BASE_URL + '/sys/datasource-individual-type',
    method: 'PUT'
  },
  // 删除
  DEL_INDIVIDUAL: {
    url: BASE_URL + '/sys/datasource-individual-type/delete',
    method: 'POST'
  },
  // 获取数据源list
  GET_DATASOURCE_LIST: {
    url: BASE_URL + '/sys/datasource-field/datasource',
    tag: 'manage-datasource-name-list',
    method: 'GET'
  }

}
export default {
  methods: {
    /**
     * 获取字段列表
     */
    async getIndividualValueList () {
      try {
        // 删除多余数据
        const params = JSON.parse(JSON.stringify(this.searchData))
        delete params.data
        delete params.total
        this.searchData = await this.requestTable({
          url: API.GET_INDIVIDUAL_LIST.url,
          currentObj: params,
          params
        }, {
          tag: API.GET_INDIVIDUAL_LIST.tag,
          noTime: true
        })
      } catch (err) {
        this.showMessage(err.message, 'error')
      }
    },

    /**
     * 获取字段详情
     * @param {string} id
     * @param {string} isEdit  判断是否是为编辑铺数据
     */
    async getIndividualValueInfo (id, isEdit) {
      let data = null
      data = await this.$request({
        url: `${API.GET_INDIVIDUAL_INFO.url}/${id}`,
        tag: API.GET_INDIVIDUAL_INFO.tag
      })

      if (isEdit) {
        let oData = JSON.parse(JSON.stringify(data))
        this.individualValueData = oData
      } else {
        this.individualValueData = data
      }
    },

    /**
     * 获取下拉框内容 数据源
     */
    async getDatasourceNameList () {
      const data = await this.$request({
        url: `${API.GET_DATASOURCE_LIST.url} `
      })
      this.datasourceNameList = data || []
    },

    /**
     * 保存/编辑数据源
     * @param {object} param 请求体
     * @param {string} id 字段id
     */
    async saveOrEditIndividualValue (param, id) {
      const data = JSON.parse(JSON.stringify(param))
      const url = id ? (API.EDIT_INDIVIDUAL.url) : API.ADD_INDIVIDUAL.url
      const method = id ? API.EDIT_INDIVIDUAL.method : API.ADD_INDIVIDUAL.method
      // 新增状态
      if (!id) {
        delete data.id
      } else {
        // 编辑状态
      }
      console.log(method)
      const res = await this.$request({
        url,
        method,
        data
      })
      return res
    },

    /**
     * 删除数据源
     * @param {array} ids
     */
    async batchDeleteIndividualValue (ids) {
      await this.$request({
        ...API.DEL_INDIVIDUAL,
        data: ids
      })
    }
  }
}
