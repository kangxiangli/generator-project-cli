import { getErrorMsgByEnd } from '@/custom/utils/base.js'
export default {
  methods: {
    // 编辑全局设置
    async editGlobalSettings () {
      try {
        this.formError = {}
        this.form.sign.errorSignLockTimeShow = this.errorSignLockHandle === -1
          ? -1
          : this.form.sign.errorSignLockTimeShow
        await this.$request({
          url: '/api/global-settings',
          method: 'put',
          data: {
            ...this.form
          }
        })
        this.showMessage('保存成功！')
      } catch (err) {
        this.formError = getErrorMsgByEnd(err)
      }
    },
    // 获取全局设置
    async getGlobalSettings () {
      this.fileList = []
      let data = await this.$request({
        url: '/api/global-settings'
      })
      let { https, sign } = data
      // 如果登录失败处理值是锁定，后面的时间输入框隐藏，但是要传值-1给后台作为锁定的标识
      this.errorSignLockHandle = sign.errorSignLockTimeShow === -1 ? -1 : 1
      // 详情时需要展示证书列表
      https.pem && this.fileList.push({ name: https.pem })
      https.key && this.fileList.push({ name: https.key })
      this.form = data
      // 用于重置时使用
      this.resetForm = JSON.parse(JSON.stringify(data))
    },
    // 全局证书上传
    uploadCertificate (data) {
      this.$request({
        url: '/api/global-settings/upload',
        method: 'post',
        data
      }).then(res => {
        this.form.https.ssl = Object.assign({}, res)
        this.showMessage((res && res.message) || '证书上传成功！')
      })
    }
  }
}
