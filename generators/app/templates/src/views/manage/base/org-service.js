const BASE_URL = '/api'
const API = {
  GET_ORG_LIST: {
    url: BASE_URL + '/sys/depts/structure',
    method: 'get',
    tag: 'manage-base-organization'
  }
}
export default {
  methods: {
    /**
     * 获取角色列表
     */
    async getOrgist () {
      try {
        const data = await this.$request({
          ...API.GET_ORG_LIST
        })
        // 判断是否存在根节点
        if (Array.isArray(data) && data.length) {
          // 部门列表数据赋值为根目录下面的树
          this.list = data[0].children
        } else {
          this.list = []
        }
      } catch (err) {
        this.showMessage(err.message, 'error')
      }
    }
  }
}
