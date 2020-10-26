import { upload } from '@/custom/utils/upload-download.js'
const BASE_URL = '/api/sys/license'
const API = {
  // 注册信息
  REGISTER_INFO: {
    url: BASE_URL + '/register-detail',
    method: 'get',
    tag: 'register-info'
  },
  // 确认注册
  CONFIRM_REGISTER: {
    url: BASE_URL + '/register',
    method: 'post',
    tag: 'confirm-register'
  }
}
export default {
  methods: {
    // 注册信息
    async getRegisterInfo () {
      this.form = await this.$request({
        ...API.REGISTER_INFO
      })
    },
    // 确认注册
    async getConfirmRegister () {
      try {
        await upload.call(this, {
          ...API.CONFIRM_REGISTER,
          uploadFiles: this.$refs['upload'].uploadFiles,
          data: {
            snNumber: this.form.snNumber,
            version: this.form.version
          }
        })
        this.getRegisterInfo()
        this.$refs['upload'].clearFiles()
        this.showMessage('注册成功请重新登录', 'success')
        // 注册成功后跳转到登录页面
        location.href = this.$router.resolve({ name: 'login' }).href
      } catch (error) {
        this.showMessage(error.message || '注册失败', 'error d')
      }
    }
  }
}
