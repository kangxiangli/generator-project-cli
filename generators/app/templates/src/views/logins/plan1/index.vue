<!--
 * @Author: guozp
 * @Date: 2020-09-16 13:47:28
 * @LastEditTime: 2020-10-14 19:56:42
 * @LastEditors: guozp
 * @Description: Do not edit
 * @FilePath: /argus-fe-template/src/views/logins/plan1/index.vue
-->
<template>
  <div class="idss-login">
    <!-- 登录 start -->
    <div ref="login" class="idss-login-box idss-loading" :class="{'is-active': currentMode === 'login'}" v-loading="loading['login']">
      <div class="idss-login-logo">
        <img height="80px" :src="require('./images/logo-idss.png')"/>
      </div>
      <div class="idss-login-title idss-txt--center">{{title}}</div>
      <login-form :authToken="authToken" :authCodeSrc='authCodeSrc' @setUserId='setUserId' @changeMode='changeMode' @getAuthCode='getAuthCode'></login-form>
    </div>
    <!-- 登录 end -->
    <!-- 忘记密码 start -->
    <div ref="forgotPwd" class="idss-login-box idss-loading" :class="{'is-active': currentMode === 'forgotPwd'}" v-loading="loading['login']">
      <h1 class="idss-login-logo">
        <img
          height="80px"
          :src="require('./images/logo-idss.png')"/>
      </h1>
      <h2 class="idss-login-title idss-txt--center">{{title}}</h2>
      <password-forgot @changeMode='changeMode'></password-forgot>
    </div>
    <!-- 忘记密码 end -->
    <!-- 修改密码 start -->
    <div ref="modifyPwd" class="idss-login-box idss-loading" :class="{'is-active': currentMode === 'modifyPwd'}" v-loading="loading['login']">
      <div class="idss-login-logo">
        <img height="80px" :src="require('./images/logo.png')"/>
      </div>
      <div class="idss-login-title idss-txt--center">{{title}}</div>
      <password-modify :userId='userId' @changeMode='changeMode'></password-modify>
    </div>
    <!-- 修改密码 end -->
  </div>
</template>
<script>
import service from '../components/login-form-service.js'
export default {
  mixins: [service],
  data () {
    return {
      title: this.$store.getters['base/globalConfig$$']('GLOBAL_TITLE')
    }
  }
}
</script>
<style scoped lang="postcss">
@import "./login.css";
</style>
