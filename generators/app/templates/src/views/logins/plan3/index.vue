<!--
 * @Author: guozp
 * @Date: 2020-09-16 13:47:28
 * @LastEditTime: 2020-10-14 14:32:31
 * @LastEditors: guozp
 * @Description: Do not edit
 * @FilePath: /argus-fe-template/src/views/logins/plan3/index.vue
-->
<template>
  <div
    class="idss-login"
    v-loading="loading['login']"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading">
    <header class="idss-login-header">
      <img  src="./images/yidong_logo.png" alt="">
      <div class="idss-login-header-line"></div>
      <img  src="./images/guan_logo.png" alt="">
      <h1 >{{projiectName}}</h1>
    </header>
    <main class="idss-login-content">
      <div ref="login" class="idss-login-box">
        <div class="idss-login-left">
        </div>
        <div class="idss-login-right">
          <div class="idss-login-right-inner" :class="{'is-active': currentMode === 'login'}">
            <login-form :authToken="authToken" :authCodeSrc='authCodeSrc' @changeMode='changeMode' @getAuthCode='getAuthCode'></login-form>
          </div>
          <div class="idss-login-right-inner" :class="{'is-active': currentMode === 'forgotPwd'}">
            <password-forgot @changeMode='changeMode'></password-forgot>
          </div>
        </div>
      </div>
    </main>
    <footer class="idss-login-footer">
      <p v-show='copyright'>{{copyright}}</p>
    </footer>
  </div>
</template>
<script>
import service from '../components/login-form-service.js'
export default {
  mixins: [service],
  data () {
    return {
      projiectName: '项目平台名称',
      copyright: '©xxxxxxxxxx版权所有'
    }
  }
}
</script>
<style scoped lang="postcss">
@import "./login.css";
</style>
