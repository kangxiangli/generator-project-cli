const BASE_URL = '/api/setting'

const API = {
  collec_tNode: BASE_URL + '/etl/worker/workers',
  table_Name: BASE_URL + '/db/getTableName/query',
  Date_Format: BASE_URL + '/etl/date/formats'
}
export default {
  methods: {
    extendBtn () {
      this.down_top = !this.down_top
    },

    checkIP (val) {
      var patern = /^((25[0-5]|2[0-4]\d|[01]?\d\d?)($|(?!\.$)\.)){4}$/
      if (!patern.test(val.target.value)) {
        this.ip_true = true
      } else {
        this.ip_true = false
      }
    },

    checkIPRule (rule, value, cb) {
      var patern = /^((25[0-5]|2[0-4]\d|[01]?\d\d?)($|(?!\.$)\.)){4}$/
      if (!patern.test(value)) {
        cb(new Error('请输入正确的IP地址'))
      } else {
        cb()
      }
    },
    /**
     * 关闭弹框清除表单
     * @param {string} formName 表单ref名称
     */
    closeDialog (formName) {
      this.$refs[formName].resetFields()
      this.$emit('close', 1)
    },

    async getcollectNode (deptUid) {
      let result = await this.$request({
        method: 'get',
        url: API.collec_tNode + '?workerType=collect&deptUId=' + deptUid,
        tag: 'collectNode'
      })
      this.options = result
    },

    async getTable (param) {
      this.$request({
        method: 'post',
        url: API.table_Name,
        data: param
      }).then((content) => {
        this.tableList = content
        this.isTest = true
        this.$message({
          type: 'success',
          message: '测试通过!'
        })
      }, (error) => {
        console.log(error)
        this.isTest = false
      })
    },

    // 获取时间格式
    async getDateFormatTemplates () {
      var this_ = this
      let result = await this.$request({
        method: 'get',
        url: API.Date_Format,
        data: {}
      })
      this_.fromDateFormats = result
    }
  },
  created () {
    // 只请求一次
    this.getcollectNode(this.deptUid)
  }
}
