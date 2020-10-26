<!--
 * @Author: guozp
 * @Date: 2020-09-16 13:47:28
 * @LastEditTime: 2020-10-14 15:54:48
 * @LastEditors: guozp
 * @Description: Do not edit
 * @FilePath: /argus-fe-template/src/views/logins/plan2/index.vue
-->
<template>
  <div
    class="idss-login"
    v-loading="loading['login']"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading">
    <div ref="login" class="idss-login-box">
      <div class="idss-login-left">
        <div class="idss-login-title-box">
          <div class="idss-login-title-left"></div>
          <div class="idss-login-title-right">
            <div class="idss-login-title-zh">登录</div>
            <div class="idss-login-title-en">Login Please</div>
          </div>
        </div>
      </div>
      <div class="idss-login-right">
        <!-- 登录 start -->
        <div class="idss-login-right-inner" :class="{'is-active': currentMode === 'login'}">
          <div class="idss-login-title-outer">
            <div class="idss-login-logo"></div>
            <div class="idss-login-title idss-txt--center">{{title}}</div>
          </div>
          <login-form :authToken="authToken" :authCodeSrc='authCodeSrc' @changeMode='changeMode' @getAuthCode='getAuthCode'></login-form>
        </div>
        <!-- 登录 end -->
        <!-- 忘记密码 start -->
        <div class="idss-login-right-inner" :class="{'is-active': currentMode === 'forgotPwd'}">
          <div class="idss-login-title-outer">
            <div class="idss-login-logo"></div>
            <div class="idss-login-title idss-txt--center">{{title}}</div>
          </div>
          <password-forgot @changeMode='changeMode'></password-forgot>
        </div>
        <!-- 忘记密码 end -->
      </div>
    </div>
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
