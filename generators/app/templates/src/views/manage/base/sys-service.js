// 基础路径
const BASE_URL = '/api/setting/etl/component'

const API = {
  PARAMS_LIST: BASE_URL + '/all',
  PARAMS_SAVE: BASE_URL + '/save',
  PARAMS_DEL: BASE_URL + '/node'
}

export default {
  methods: {
    // 获取表格列表
    async getListDataByType (type) {
      this[type].data = await this.$request({
        method: 'get',
        url: API.PARAMS_LIST + '?componentType=' + type
      })
    },

    // 保存
    async save (params, type, apiType) {
      var this_ = this
      params['componentType'] = type
      this.$request({
        method: 'post',
        url: API.PARAMS_SAVE,
        data: params
      }).then((content) => {
        if (apiType === 'add') {
          this_.$message({
            message: '新增成功',
            type: 'success'
          })
        } else {
          this_.$message({
            message: '编辑成功',
            type: 'success'
          })
        }
        this_.initData()
        this_.configDialogVisible = false
      }, (error) => {
        console.log(error)
      })
    },

    // 删除配置数据
    async deleteConfig (param) {
      var this_ = this
      this.$request({
        method: 'delete',
        url: API.PARAMS_DEL + '/' + param + '/delete'
      }).then((content) => {
        this_.initData()
        this_.$message({
          type: 'success',
          message: '删除成功！'
        })
      }, (error) => {
        console.log(error)
      })
    }
  }
}
