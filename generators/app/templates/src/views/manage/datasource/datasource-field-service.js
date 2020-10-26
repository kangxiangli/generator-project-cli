const BASE_URL = '/api'
const API = {
  // 获取字段列表
  GET_INDIVIDUAL_LIST: {
    url: BASE_URL + '/sys/datasource-field/list/query',
    tag: 'manage-datasource-field-list',
    method: 'POST'
  },
  // 字段详情
  GET_INDIVIDUAL_INFO: {
    url: BASE_URL + '/sys/datasource-field',
    tag: 'manage-datasource-field-info'
  },
  // 新增
  ADD_INDIVIDUAL: {
    url: BASE_URL + '/sys/datasource-field',
    method: 'POST'
  },
  // 编辑
  EDIT_INDIVIDUAL: {
    url: BASE_URL + '/sys/datasource-field',
    method: 'PUT'
  },
  // 删除
  DEL_INDIVIDUAL: {
    url: BASE_URL + '/sys/datasource-field/delete',
    method: 'POST'
  },
  // 获取数据源list
  GET_DATASOURCE_LIST: {
    url: BASE_URL + '/sys/datasource-field/datasource',
    tag: 'manage-datasource-name-list',
    method: 'GET'
  },
  // 获取数据源list
  GET_INDIVIDUAL_VALUE_LIST: {
    url: BASE_URL + '/sys/datasource-individual-type/data-list',
    tag: 'manage-datasource-individual-value-list',
    method: 'GET'
  },
  // 指定code下拉框字典取得
  GET_DIC: {
    url: BASE_URL + '/argus-common/dict',
    method: 'GET'
  },
  // 所有字典list取得
  GET_DIC_LIST: {
    url: BASE_URL + '/sys/datasource-name/dict/list/query',
    tag: 'manage-dic-list',
    method: 'GET'
  },
  // 共通分组名称列表取得
  GET_GROUP_NAME_LIST: {
    url: BASE_URL + '/sys/datasource-group-name/query',
    tag: 'manage-group-name-list',
    method: 'GET'
  },
  // 共通分组名称列表追加
  ADD_GROUP_NAME: {
    url: BASE_URL + '/sys/datasource-group-name',
    method: 'POST'
  },
  // 共通分组名称列表删除
  DEL_GROUP_NAME: {
    url: BASE_URL + '/sys/datasource-group-name',
    method: 'DELETE'
  }
}
export default {
  methods: {
    /**
     * 获取字段列表
     */
    async getFieldList () {
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
    async getFieldInfo (id, isEdit) {
      let data = null
      data = await this.$request({
        url: `${API.GET_INDIVIDUAL_INFO.url}/${id}`,
        tag: API.GET_INDIVIDUAL_INFO.tag
      })

      if (isEdit) {
        let oData = JSON.parse(JSON.stringify(data))
        // 对 dspOrder返回String类型 *特殊处理*
        if (oData.dspOrder) {
          oData.dspOrder = oData.dspOrder * 1
        }
        // 对 groupId返回null *特殊处理*
        if (!oData.groupId) {
          oData.groupId = []
        }
        this.fieldData = oData
      } else {
        this.fieldData = data
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
     * 获取下拉框内容 数据源对应的个别字段值list
     */
    async getIndividualValueList (datasourceId) {
      const data = await this.$request({
        url: API.GET_INDIVIDUAL_VALUE_LIST.url + '/' + datasourceId
      })
      // 下拉框的list
      this.individualValueList = data || []
    },

    /**
     * 获取下拉框内容  字段类型
     */
    async getTypeList () {
      const data = await this.$request({
        url: `${API.GET_DIC.url}/field-type `
      })
      this.typeList = data || []
    },

    /**
     * 获取下拉框内容
     */
    async getDictionaryList () {
      const data = await this.$request({
        url: `${API.GET_DIC_LIST.url} `
      })
      this.dictionaryList = data || []
    },

    /**
     * 获取共同分组名称列表
     */
    async getGroupNameList () {
      const data = await this.$request({
        url: `${API.GET_GROUP_NAME_LIST.url} `
      })
      this.groupNameList = data || []
    },

    /**
     * 获取共同分组名称列表 添加
     */
    async getAddGroup (name) {
      this.confirmBox({
        message: '确定添加该分组名称吗？',
        successMessage: '添加成功!',
        cancelMessage: '已取消添加'
      }).then(async () => {
        try {
          await this.$request({
            ...API.ADD_GROUP_NAME,
            data: {
              name: name
            }
          })
          // 请求共同分组名称列表
          this.getGroupNameList()
        } catch (error) {
          this.showMessage(error.message, 'error')
        }
      })
    },

    /**
     * 获取共同分组名称列表 删除
     */
    async getDeleteGroup (id) {
      this.confirmBox().then(async () => {
        try {
          await this.$request({
            url: API.DEL_GROUP_NAME.url + '/' + id,
            method: API.DEL_GROUP_NAME.method
          })
          this.showMessage('删除成功')
          // 请求共同分组名称列表
          this.getGroupNameList()
          // 从已选择的列表中去除被删除的字段
          this.fieldData.groupId = this.fieldData.groupId.filter(val => val !== id)
        } catch (error) {
          this.showMessage(error.message, 'error')
        }
      })
    },

    /**
     * 获取下拉框内容 运算符
     */
    async getComputeTypesList () {
      const data = await this.$request({
        url: `${API.GET_DIC.url}/compute-types `
      })
      this.computeTypesList = data || []
    },

    /**
     * 获取下拉框内容 过滤条件
     */
    async getOperatorsRefersList () {
      const data = await this.$request({
        url: `${API.GET_DIC.url}/refer-oper `
      })
      this.operatorsRefersList = data || []
    },

    /**
     * 保存/编辑数据源
     * @param {object} param 请求体
     * @param {string} id 字段id
     */
    async saveOrEditField (param, id) {
      const data = JSON.parse(JSON.stringify(param))
      // 设置 computeTypesStr
      let computetypesStr = data.computeTypes.join(',')
      // computeTypesStr 还要放到data中
      data.computetypesStr = computetypesStr

      const url = id ? API.EDIT_INDIVIDUAL.url : API.ADD_INDIVIDUAL.url
      const method = id
        ? API.EDIT_INDIVIDUAL.method
        : API.ADD_INDIVIDUAL.method
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
    async batchDeleteField (ids) {
      await this.$request({
        ...API.DEL_INDIVIDUAL,
        data: ids
      })
    }
  }
}
