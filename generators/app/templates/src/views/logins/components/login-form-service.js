/*
 * @Author: guozp
 * @Date: 2020-09-16 13:47:28
 * @LastEditTime: 2020-10-13 14:55:05
 * @LastEditors: guozp
 * @Description: Do not edit
 * @FilePath: /argus-fe-template/src/views/logins/components/login-service.js
 */
import LoginForm from './login-form.vue'
import PasswordForgot from './password-forgot.vue'
import PasswordModify from './password-modify.vue'

const API = {
  AUTH_CODE: {
    url: '/api/authcode',
    method: 'get',
    tag: 'auth-code'
  }
}

export default {
  components: {
    LoginForm,
    PasswordForgot,
    PasswordModify
  },
  name: 'login',
  data () {
    return {
      userId: '',
      loading: {},
      currentMode: 'login',   // 'forgotPwd'|'login'|'modifyPwd'
      authToken: '',
      authCodeSrc: ''      // 验证码
    }
  },
  methods: {
    setUserId (userId) {
      this.userId = userId
    },
    /**
       * 改变当前视图模式
       * @params type: 要更改的模式类型
       */
    changeMode (mode) {
      this.currentMode = mode
      this.getAuthCode() // 返回登录时重新请求验证
    },
    /**
       * 获取验证码
       */
    async getAuthCode () {
      let content = await this.$request({
        ...API.AUTH_CODE
      }, {
        responseType: 'blob'
      })
      this.authToken = content.headers.authtoken
      this.authCodeSrc = URL.createObjectURL(new Blob([content.data]))
    }
  },
  created () {
    this.getAuthCode()
  }
}
