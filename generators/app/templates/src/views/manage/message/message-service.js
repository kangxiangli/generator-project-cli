/**
 * Created by ligang on 2018/10/16.
 */
// 基础路径
const BASE_URL = '/api/mail-configuration'

const API = {
  // 表格数据（表格）
  MESSAGE: {
    url: BASE_URL + '/list',
    tag: 'message-list'
  }
}

export default {
  methods: {
    /**
     * 获取表格数据
     * @returns {Promise.<void>}
     */
    async getTableData () {
      const result = await this.requestTable({
        url: API.MESSAGE.url + '/query',
        tag: API.MESSAGE.tag,
        currentObj: this.messageTableData,
        params: {
          condition: this.condition
        }
      }, { noTime: true })
      this.messageTableData = Object.assign({}, result)
    },
    /**
     * 删除
     * @param id
     * @returns {Promise.<void>}
     */
    async deleteMessage (ids) {
      this.confirmBox().then(async () => {
        try {
          await this.$request({
            url: API.MESSAGE.url + '/delete',
            tag: API.MESSAGE.tag,
            method: 'post',
            data: { ids }
          })
          this.showMessage('删除成功')
          this.getTableData()
        } catch (error) {
          this.showMessage(error.message, 'error')
        }
      })
    }
  }
}
