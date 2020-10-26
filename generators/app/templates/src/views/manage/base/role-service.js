const BASE_URL = '/api'
const API = {
  // 角色管理列表
  GET_ROLE_LIST: {
    url: BASE_URL + '/sys/sys-roles/list/query',
    method: 'post',
    tag: 'manage-base-user-role-list'
  },
  // 获取角色详情
  GET_ROLE_DETAIL: {
    url: BASE_URL + '/sys/sys-roles',
    method: 'get',
    tag: 'manage-base-role-detail'
  },
  // 删除
  DELETE_ROLE: {
    url: BASE_URL + '/sys/sys-roles/delete',
    method: 'post'
  },
  // 新增
  ADD_ROLE: {
    url: BASE_URL + '/sys/sys-roles',
    method: 'post'
  },
  // 编辑
  EDIT_ROLE: {
    url: BASE_URL + '/sys/sys-roles',
    method: 'put'
  },
  // 角色树
  GET_OPERATION_LIST: {
    url: BASE_URL + '/sys/modules/tree',
    method: 'get',
    tag: 'manage-base-user-role-function-permission'
  },
  BATCH_AUTH: {
    url: BASE_URL + '/sys/roles/batch-oauth',
    method: 'put'
  },
  // 批量授权获取组织架构
  GET_DEPT_USER_LIST: {
    url: BASE_URL + '/sys/depts/users',
    method: 'get',
    tag: 'organiztion-dialog'
  }
}

export default {
  methods: {
    /**
     * 获取角色列表
     */
    async getRoleist () {
      // 删除多余数据
      const params = JSON.parse(JSON.stringify(this.roleSearch))
      delete params.data
      delete params.total
      try {
        this.roleSearch = await this.requestTable({
          url: API.GET_ROLE_LIST.url,
          currentObj: params,
          params
        }, {
          tag: API.GET_ROLE_LIST.tag,
          noTime: true
        })
      } catch (err) {
        this.showMessage(err.message, 'error')
      }
    },

    /**
     * 获取角色详情
     */
    async getRoleDetail (roleID) {
      let data = await this.$request({
        url: API.GET_ROLE_DETAIL.url + '/' + roleID,
        method: API.GET_ROLE_DETAIL.method,
        tag: API.GET_ROLE_DETAIL.tag
      })

      // moduleIds转为数组
      let oData = JSON.parse(JSON.stringify(data))
      oData.moduleIds = oData.moduleIds.split(',')
      this.roleInfo = oData
    },

    /**
     * 批量删除role
     * @param {object} data
     */
    async batchDeleteRole (data) {
      await this.$request({
        ...API.DELETE_ROLE,
        data
      })
    },

    /**
     * role新增、编辑
     * @param {object} roleData
     * @param {string} roleId
     */
    async addOrEditRole (roleData, roleId) {
      const url = roleId ? API.EDIT_ROLE.url : API.ADD_ROLE.url
      const method = roleId ? API.EDIT_ROLE.method : API.ADD_ROLE.method
      const data = JSON.parse(JSON.stringify(roleData))
      // 因默认时将editDele负值为2，新增或者编辑时是不需要传editDele
      roleId || delete data.sysRolesId
      let res = await this.$request({
        url,
        method,
        data: {
          enable: data.enable,
          moduleIds: data.moduleIds,
          parentId: data.parentId,
          roleDesc: data.roleDesc,
          roleName: data.roleName,
          sysRolesId: data.sysRolesId
        }
      })
      return res
    },

    /**
     * 获取权限操作树
     */
    async getOperationList () {
      try {
        const { routers } = await this.$request({
          ...API.GET_OPERATION_LIST
        })
        // 为操作树添加数据
        this.operationList = this._filterOperationRouter(routers)
      } catch (err) {
        this.showMessage(err.message, 'error')
      }
    },

    // 只展示可以展示的页面（部分页面在列表中不显示 {meta: {manageFree: true}}）
    _filterOperationRouter (routers) {
      return routers.filter(item => {
        if (item.meta && item.meta.manageFree) {
          return false
        }
        if (Array.isArray(item.children) && item.children.length > 0) {
          item.children = this._filterOperationRouter(item.children)
        }

        return true
      })
    },

    /**
     * 切换操作权限数据/数据权限disable状态
     * @param {string} listType operationList dataPermissionList
     * @param {boolean} isDisabled
     */
    switchFuncDisable (listType, isDisabled) {
      function setChild (item) {
        if (!item.children || !item.children.length) {
          item.disabled = isDisabled
          return item
        } else {
          item.disabled = isDisabled
          item.children = item.children.map(items => {
            return setChild(items)
          })
          return item
        }
      }
      // 设置当前对应的某个数据权限数据
      this.$set(this, listType, this[listType].map(item => {
        return setChild(item)
      }))
    },

    /**
     * 用户批量授权
     * @param {array} userList
     * @param {array} roleList
     * @TODOS 接口错误，待接口
     */
    async batchAuthUsers (userList, roleList) {
      await this.$request({
        url: API.BATCH_AUTH.url + '/' + roleList[0],
        method: API.BATCH_AUTH.method,
        data: userList
      })
    },

    /**
     * 获取批量授权组织架构人员
     */
    async getDeptsUsers () {
      this.list = await this.$request({
        ...API.GET_DEPT_USER_LIST
      })
    }
  }
}
