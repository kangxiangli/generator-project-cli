const BASE_URL = '/api/setting/etl/dept'

const API = {
  // 部门列表
  DEPT_LIST: BASE_URL + '/get-all'
}
export default {
  methods: {
    getDeptList () {
      this.$request({
        method: 'get',
        url: API.DEPT_LIST
      }, {
        tag: 'dept_list'
      }).then((content) => {
        if (content.length === 0) {
          this.$alert('暂时没有部门信息，前往部门管理页面配置!', '提示', {
            confirmButtonText: '确定',
            callback: action => {
              this.$router.push({ name: 'manage-data-deptEtl' })
            }
          })
        } else {
          this.editableTabs = content
          for (let obj in content) {
            if (content[obj].level === 'master') {
              this.masteruId = content[obj].uid
              this.isshow[obj] = true
            } else {
              this.isshow[obj] = false
            }
          }
          if (this.masteruId) {
            this.editableTabsValue = this.masteruId
            this.tabSendData = {
              uid: this.masteruId,
              level: 'master'
            }
          } else {
            this.editableTabsValue = content[0].uid
            this.isshow[0] = true
            this.tabSendData = {
              uid: content[0].uid
            }
          }
          this.checkparam()
        }
      }, (error) => {
        this.showMessage(error.message, 'error')
      })
    },
    init () {
      this.getDeptList()
    }
  }
}
