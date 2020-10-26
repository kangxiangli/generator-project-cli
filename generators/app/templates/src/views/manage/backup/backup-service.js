/**
 * Created by sundong on 2019/6/10.
 */
// 基础路径
const BASE_URL = '/api/sys/bak-manage'

const API = {
  // 结构树查询
  GET_TREE: {
    url: BASE_URL + '/fuzzy/query',
    method: 'post',
    tag: 'backup-tree'
  }
}

export default {
  methods: {
    // 获取备份结构树
    async getTreeList () {
      let result = await this.$request({
        ...API.GET_TREE,
        data: {
          name: this.backupForm.search
        }
      })
      this.backupTree = result.bakManage
    },
    // 删除备份
    deleteBackup (id, url) {
      this.$request({
        url: url + '/' + id,
        method: 'delete'
      }).then(_ => {
        this.showMessage('删除成功！')
        this.parentId = ''
        this.$refs['backupTree'].setCurrentKey(null)  // 删除成功后取消高亮
        this.resetComponent()
        this.getTreeList() // 重新获取
      })
    }
  }
}
