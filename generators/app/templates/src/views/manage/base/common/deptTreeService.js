const BASE_URL = '/api'
const API = {
  // dept list
  GET_DEPT_LIST: {
    url: BASE_URL + '/sys/department/tree',
    method: 'post',
    tag: 'manage-base-user-dept-list'
  }
}
export default {
  methods: {
    /**
     * 获取部门列表
     */
    async getDeptList (ck) {
      try {
        await this.$request({
          url: API.GET_DEPT_LIST.url,
          method: API.GET_DEPT_LIST.method,
          data: { 'roleId': '' }
        }, {
          tag: API.GET_DEPT_LIST.tag
        }).then(data => {
          ck ? ck(data) : this.deptList = data['departments']
        })
      } catch (err) {
        this.showMessage(err.message, 'error')
      }
    }
  }
}
