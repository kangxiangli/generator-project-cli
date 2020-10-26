
import { aesEncrypt } from 'fusion-utils'
const BASE_URL = '/api'
const API = {
  // 获取用户列表
  GET_USER_LIST: {
    url: BASE_URL + '/sys/sys-users/list/query',
    tag: 'manage-base-user-list',
    method: 'post'
  },
  // 用户详情
  GET_USER_INFO: {
    url: BASE_URL + '/sys/sys-users',
    tag: 'manage-base-user-info'
  },
  // 角色
  GET_ROLE_LIST: {
    url: BASE_URL + '/sys/sys-roles/query',
    method: 'POST',
    tag: 'manage-base-user-role-list'
  },
  // 新增
  ADD_USER: {
    url: BASE_URL + '/sys/sys-users',
    method: 'post'
  },
  // 编辑
  EDIT_USER: {
    url: BASE_URL + '/sys/sys-users',
    method: 'put'
  },
  // 删除
  DEL_USER: {
    url: BASE_URL + '/sys/sys-users/delete',
    method: 'POST'
  },
  // 更新密码
  EDIT_PWD: {
    url: BASE_URL + '/sys/sys-users/update-password',
    method: 'post'
  },
  // 查询登陆策略
  LOGIN_STRATEGY: {
    url: BASE_URL + '/sys/sys-users/login-strategy/query'
  }
}
export default {
  methods: {
    /**
     * 获取用户列表
     */
    async getUserList () {
      try {
        // 删除多余数据
        const params = JSON.parse(JSON.stringify(this.searchData))
        delete params.data
        delete params.total
        this.searchData = await this.requestTable({
          url: API.GET_USER_LIST.url,
          currentObj: params,
          params
        }, {
          tag: API.GET_USER_LIST.tag,
          noTime: true
        })
      } catch (err) {
        this.showMessage(err.message, 'error')
      }
    },

    /**
     * 获取用户详情
     * @param {string} userId
     * @param {string} isEdit  判断是否是为编辑铺数据 处理获取用户详情时 角色为字符串
     */
    async getUserInfo (userId, isEdit) {
      let data = null
      data = await this.$request({
        url: `${API.GET_USER_INFO.url}/${userId}`,
        tag: API.GET_USER_INFO.tag
      })
      let oData = JSON.parse(JSON.stringify(data))
      oData.sysRoleIds = oData.sysRoleIds ? oData.sysRoleIds.split(',') : []
      this.userData = oData
    },

    /**
     * 获取用户角色列表
     */
    async getUserRoleList () {
      const data = await this.$request({
        ...API.GET_ROLE_LIST
      })
      this.userRoleData = data || []
    },

    /**
     * 保存/编辑用户
     * @param {object} param 请求体
     * @param {string} userId 用户id
     */
    async saveOrEditUser (param, userId) {
      const data = JSON.parse(JSON.stringify(param))
      const url = userId ? (API.EDIT_USER.url) : API.ADD_USER.url
      const method = userId ? API.EDIT_USER.method : API.ADD_USER.method
      // 新增状态
      if (!userId) {
        delete data.sysUsersId
        data.enabled = true
        // 加密密码
        data.saltValue = aesEncrypt(data.saltValue)
      } else {
        // 编辑状态不可修改用户账号
      }
      // 删除多余字段
      delete data.sysDepart
      delete data.roleId
      delete data.roleName
      const res = await this.$request({
        url,
        method,
        data
      })
      return res
    },

    /**
     * 删除用户
     * @param {array} userIdList
     */
    async batchDeleteUser (userIdList) {
      await this.$request({
        ...API.DEL_USER,
        data: userIdList
      })
    },

    /**
     * 修改用户密码
     * @param {object} param
     * @param {string} userId
     * @param {string} userName
     */
    async editPwd (param, userId) {
      // 添加userName
      const data = JSON.parse(JSON.stringify(param))
      let savePassword = {}
      savePassword.id = userId
      savePassword.saltValue = aesEncrypt(data.password)
      // aesEncrypt(data.password)
      const res = await this.$request({
        ...API.EDIT_PWD,
        data: { ...savePassword }
      })
      return res
    },
    /* 获取登陆策略 */
    async getLoginStrategy () {
      try {
        this.loginStrategy = await this.$request({ url: API.LOGIN_STRATEGY.url })
      } catch (err) {
        this.showMessage(err.message, 'error')
      }
    }
  }
}
