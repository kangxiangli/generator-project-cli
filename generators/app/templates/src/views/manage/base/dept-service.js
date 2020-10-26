const BASE_URL = '/api'
const API = {
  // 部门树
  GET_DEPT_LIST: {
    url: BASE_URL + '/sys/department/tree',
    method: 'post',
    tag: 'manage-base-user-dept-list'
  },
  GET_DEPT_INFO: {
    url: BASE_URL + '/sys/department',
    method: 'get',
    tag: 'manage-base-dept-detail'
  },
  BATCH_DELETE_DEPT: {
    url: BASE_URL + '/sys/department/delete',
    method: 'post'
  },
  ADD_DEPT: {
    url: BASE_URL + '/sys/department',
    method: 'post'
  },
  EDIT_DEPT: {
    url: BASE_URL + '/sys/department',
    method: 'put'
  },
  GET_SYS_ROLES_LIST: {
    url: BASE_URL + '/sys/sys-roles/query',
    method: 'POST',
    tag: 'manage-base-user-role-list'
  }
}
export default {
  methods: {
    /**
     * 获取部门列表
     */
    async getDeptList () {
      try {
        const data = await this.$request({
          ...API.GET_DEPT_LIST,
          data: this.searchRole

        })
        let oData = data.departments[0].children

        // 判断是否存在根节点
        if (Array.isArray(oData) && oData.length) {
          // 部门列表数据赋值为根目录下面的树
          this.deptList = oData
        } else {
          this.deptList = []
        }
      } catch (err) {
        this.showMessage(err.message, 'error')
      }
    },

    /**
     * 获取部门详情
     * @param {string} deptId 部门id
     */
    async getDeptInfo (deptId) {
      try {
        this.deptDetail = await this.$request({
          url: API.GET_DEPT_INFO.url + '/' + deptId,
          tag: API.GET_DEPT_INFO.tag
        })
      } catch (err) {
        this.showMessage(err.message, 'error')
      }
    },

    /**
     * 批量删除部门
     * @param {object} data
     */
    async batchDeleteDept (data) {
      await this.$request({
        ...API.BATCH_DELETE_DEPT,
        data
      })
    },

    /**
     * 部门新增、编辑
     * @param {object} deptDetail
     * @param {string} deptId
     */
    async addOrEditDept (deptDetail, deptId) {
      const url = deptId ? API.EDIT_DEPT.url : API.ADD_DEPT.url
      const method = deptId ? API.EDIT_DEPT.method : API.ADD_DEPT.method
      const data = JSON.parse(JSON.stringify(deptDetail))
      delete data.parentDeptName

      const res = await this.$request({
        url,
        method,
        data
      })
      return res
    },
    /**
     * 获取角色列表
     */
    async getSysRoleList () {
      const data = await this.$request({
        ...API.GET_SYS_ROLES_LIST
      })
      this.sysRolesData = data || []
      this.sysRolesList = data || []
    }
  }
}
