<!--
 * @Author: guozp
 * @Date: 2020-10-12 14:24:39
 * @LastEditTime: 2020-10-14 20:02:47
 * @LastEditors: guozp
 * @Description: Do not edit
 * @FilePath: /argus-fe-template/src/views/logins/plan4/index.vue
-->
<template>
  <div
    class="idss-login"
    v-loading="loading['login']"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading">
    <div class="idss-login-header">
      <div class="idss-login-header_yd idss-bg-common"></div>
      <div class="idss-login-header_ga idss-bg-common" v-if="isShow"></div>
      <div class="idss-login-header_title">数据安全管控平台</div>
    </div>
    <div ref="login" class="idss-login-box">
      <div class="idss-login-left idss-bg-common ">
        <div class="idss-login-left_main_title">{{loginConfig.title}}</div>
        <div class="idss-login-left_sub_title">{{loginConfig.subTitle}}</div>
      </div>
      <div class="idss-login-right idss-bg-common">
        <!-- 登录 start -->
        <div class="idss-login-right-inner" :class="{'is-active': currentMode === 'login'}">
          <div class="idss-login-right-title">欢迎登录</div>
          <login-form :authToken="authToken" :authCodeSrc='authCodeSrc' @setUserId='setUserId' @changeMode='changeMode' @getAuthCode='getAuthCode'></login-form>
        </div>
        <!-- 登录 end -->
        <!-- 忘记密码 start -->
        <div class="idss-login-right-inner" :class="{'is-active': currentMode === 'forgotPwd'}">
          <span class="idss-login-right-title">欢迎登录</span>
          <password-forgot @changeMode='changeMode'></password-forgot>
        </div>
        <!-- 忘记密码 end -->
        <!-- 修改密码 start -->
        <div class="idss-login-right-inner" :class="{'is-active': currentMode === 'modifyPwd'}">
          <span class="idss-login-right-title">欢迎登录</span>
          <password-modify :userId='userId' @changeMode='changeMode'></password-modify>
        </div>
        <!-- 修改密码 end -->
      </div>
    </div>
  </div>
</template>
<script>
import service from '../components/login-form-service.js'
const API = {
  LOGIN_PAGE_CONFIG: {
    url: '/api/sys/login-page/config',
    method: 'get'
  }
}
export default {
  mixins: [service],
  computed: {
    isShow: function () {
      return this.loginConfig.logoEnable || false
    }
  },
  data () {
    return {
      loginConfig: {
        logoEnable: false,
        subTitle: '',
        title: ''
      }
    }
  },
  methods: {
    /**
     * 获取页面相关展示内容
     */
    async getLoginPageConfig () {
      let content = await this.$request({
        ...API.LOGIN_PAGE_CONFIG
      })
      this.loginConfig = Object.assign({}, this.loginConfig, content)
    }
  },
  created () {
    // 获取登录页面相关内容配置
    // this.getLoginPageConfig()
  }
}
</script>
<style scoped>
@import "./login.css";
</style>
