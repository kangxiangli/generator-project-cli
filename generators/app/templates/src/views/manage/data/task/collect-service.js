/**
 * Created by ligang on 2017/10/13.
 */
// 基础路径
const BASE_URL = '/api/setting/etl/collect-node'
const API = {
  // 采集列表
  NODE_LIST: {
    method: 'post',
    url: BASE_URL + '/page-search',
    tag: 'node-search-list'
  },
  // 采集编辑
  NODE_EDIT: {
    method: 'post',
    url: BASE_URL + '/update-node'
  }
}
export default {
  methods: {
    /**
     * 采集列表
     */
    async getNodeData () {
      const result = await this.$request({
        ...API.NODE_LIST,
        data: {
          workerIp: this.nodeForm.ip,
          nodeTagName: this.nodeForm.name
        }
      })
      this.nodeData = Object.assign({}, result)
    },

    /**
     * 采集编辑请求
     */
    async editNodeRequest () {
      await this.$request({
        ...API.NODE_EDIT,
        data: this.nodeEditForm
      })
      this.$message({
        message: '编辑成功',
        type: 'success'
      })
      this.nodeEditDialogVisible = false
      for (let item in this.nodeEditForm) {
        this.nodeData.data[this.$currentEditNodeIndex][item] = this.nodeEditForm[item]
      }
    }
  }
}
