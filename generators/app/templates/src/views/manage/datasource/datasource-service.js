
const BASE_URL = '/api'
const API = {
  // 获取数据源列表
  GET_DATASOURCE_LIST: {
    url: BASE_URL + '/sys/datasource-name/list/query',
    tag: 'manage-datasource-datasource-list',
    method: 'POST'
  },
  // 数据源详情
  GET_DATASOURCE_INFO: {
    url: BASE_URL + '/sys/datasource-name',
    tag: 'manage-datasource-datasource-info'
  },
  // 新增
  ADD_DATASOURCE: {
    url: BASE_URL + '/sys/datasource-name',
    method: 'POST'
  },
  // 编辑
  EDIT_DATASOURCE: {
    url: BASE_URL + '/sys/datasource-name',
    method: 'PUT'
  },
  // 删除
  DEL_DATASOURCE: {
    url: BASE_URL + '/sys/datasource-name/delete',
    method: 'POST'
  },
  // 共通组名称list取得
  GET_COMMON_GROUP_INFO: {
    url: BASE_URL + '/sys/datasource-group-name/query',
    tag: 'manage-datasource-group-list'
  },
  // 新增
  ADD_COMMON_GROUP: {
    url: BASE_URL + '/sys/datasource-group-name/',
    method: 'POST'
  },
  // 编辑
  EDIT_COMMON_GROUP: {
    url: BASE_URL + '/sys/datasource-group-name/',
    method: 'PUT'
  },
  // 删除
  DEL_COMMON_GROUP: {
    url: BASE_URL + '/sys/datasource-group-name/delete',
    method: 'POST'
  },
  // 共通组字段list取得
  GET_COMMON_FIELDS_INFO: {
    url: BASE_URL + '/sys/datasource-common-field-ref/query',
    tag: 'manage-datasource-field-list',
    method: 'POST'
  },
  // 下拉框字典取得
  GET_DIC: {
    url: BASE_URL + '/argus-common/dict',
    method: 'GET'
  }
}
export default {
  methods: {
    /**
     * 获取数据源列表
     */
    async getDatasourceList () {
      try {
        // 删除多余数据
        const params = JSON.parse(JSON.stringify(this.searchData))
        delete params.data
        delete params.total
        this.searchData = await this.requestTable({
          url: API.GET_DATASOURCE_LIST.url,
          currentObj: params,
          params
        }, {
          tag: API.GET_DATASOURCE_LIST.tag,
          noTime: true
        })
      } catch (err) {
        this.showMessage(err.message, 'error')
      }
    },

    /**
     * 获取数据源详情
     * @param {string} id
     * @param {string} isEdit  判断是否是为编辑铺数据
     */
    async getDatasourceInfo (id, isEdit) {
      let data = null
      data = await this.$request({
        url: `${API.GET_DATASOURCE_INFO.url}/${id}`,
        tag: API.GET_DATASOURCE_INFO.tag
      })

      if (isEdit) {
        let oData = JSON.parse(JSON.stringify(data))
        this.datasourceData = oData
      } else {
        this.datasourceData = data
      }
    },

    /**
     * 获取下拉框内容
     */
    async getCanUseGraphList () {
      const data = await this.$request({
        url: `${API.GET_DIC.url}/can-use-graph `
      })
      this.canUseGraphList = data || []
    },

    /**
     * 获取下拉框内容
     */
    async getDbTypeList () {
      const data = await this.$request({
        url: `${API.GET_DIC.url}/db-type `
      })
      this.dbTypeList = data || []
    },

    /**
     * 获取下拉框内容
     */
    async getUrlKeyList () {
      const data = await this.$request({
        url: `${API.GET_DIC.url}/data-go-deep `
      })
      this.urlKeyList = data || []
    },

    /**
     * 所有的共通组名称取得
     */
    async getCommonGroupIdList () {
      const data = await this.$request({
        url: `${API.GET_COMMON_GROUP_INFO.url} `
      })
      this.commonGroupIdList = data || []
    },

    /**
     * 根据选中的共通组id，查询对应的字段列表
     */
    async getCommonFieldList (id) {
      const data = await this.$request({
        url: `${API.GET_COMMON_FIELDS_INFO.url} `,
        method: 'POST',
        data: { groupId: id }
      })
      this.commonFieldIdList = data || []
    },

    /**
     * 保存/编辑数据源
     * @param {object} param 请求体
     * @param {string} datasourceId 数据源id
     */
    async saveOrEditDatasource (param, datasourceId) {
      const data = JSON.parse(JSON.stringify(param))
      const url = datasourceId ? (API.EDIT_DATASOURCE.url) : API.ADD_DATASOURCE.url
      const method = datasourceId ? API.EDIT_DATASOURCE.method : API.ADD_DATASOURCE.method
      // 新增状态
      if (!datasourceId) {
        delete data.datasourceId
      } else {
        // 编辑状态
      }
      console.log(method)
      // 删除多余字段
      // delete data.sysDepart
      // delete data.roleId
      // delete data.roleName
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
    async batchDeleteDatasource (ids) {
      await this.$request({
        ...API.DEL_DATASOURCE,
        data: ids
      })
    }
  }
}
