/**
 * Created by sundong on 2019/6/10.
 */
import { getErrorMsgByEnd } from '@/custom/utils/base.js'
// 基础路径
const BASE_URL = '/api/sys/bak-manage'

const API = {
  // 备份模板
  GET_BACKUP_TEMPLATE: {
    url: BASE_URL + '/template'
  },
  // 备份数据量
  GET_BACKUP_DATA: {
    url: BASE_URL + '/query',
    method: 'post'
  },
  // 测试连接
  CONNECT: {
    url: BASE_URL + '/connect',
    method: 'post'
  },
  // 新增备份
  BACKUP_ADD: {
    url: BASE_URL,
    method: 'post'
  }
}

export default {
  methods: {
    // 备份查询
    async searchBackup () {
      let result = await this.$request({
        url: BASE_URL + '/' + this.id
      })
      this.addBackupForm = Object.assign({}, this.addBackupForm, result)
      this.originForm = Object.assign({}, this.addBackupForm, result)
    },
    // 获取备份模板
    async getBackupTemplateList () {
      let result = await this.$request({
        ...API.GET_BACKUP_TEMPLATE
      })
      let { data } = result
      this.templateList = data
      if (!this.addBackupForm.indexTemplate) {
        this.addBackupForm.indexTemplate = data[0]
      }
      this.getBackupData()
    },
    // 获取预计备份数据量
    async getBackupData () {
      let result = await this.$request({
        ...API.GET_BACKUP_DATA,
        data: {
          indexTemplate: this.addBackupForm.indexTemplate,
          ...this.globalTime
        }
      })
      this.backupDataNum = result.total
    },
    // 测试连接
    testConnect () {
      let { protocolType, account, passwd, bakPath = '' } = this.addBackupForm
      if (!bakPath) {
        this.addBackupFormError = getErrorMsgByEnd({ message: [{ item: 'bakPath', message: '请输入备份路径' }] })
        return
      }
      this.$request({
        ...API.CONNECT,
        data: {
          protocolType,
          account,
          passwd,
          bakPath
        }
      }).then(_ => {
        this.showMessage('连接测试成功！')
      })
    },
    // 新增备份
    backupAdd () {
      this.addBackupFormError = {}
      let param = Object.assign({}, this.addBackupForm)
      this.title === 'add' && delete param.bakId
      this.$request({
        ...API.BACKUP_ADD,
        data: {
          ...param,
          ...this.globalTime
        }
      }).then(_ => {
        this.showMessage(this.title === 'add' ? '新增成功！' : '更新成功！')
        this.$emit('add-success', true)
      }).catch(err => {
        // this.showMessage('新增失败！', 'error')
        this.addBackupFormError = getErrorMsgByEnd(err)
      })
    }
  }
}
