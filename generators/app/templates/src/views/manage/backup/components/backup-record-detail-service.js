/**
 * Created by sundong on 2019/6/10.
 */
// 基础路径
const BASE_URL = '/api/sys/bak-record'

export default {
  methods: {
    // 查看备份记录详情
    async searchBackupRecord () {
      let result = await this.$request({
        url: BASE_URL + '/' + this.id
      })
      this.backupRecordForm = Object.assign({}, this.backupRecordForm, result)
    }
  }
}
