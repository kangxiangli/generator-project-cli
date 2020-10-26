<!--
 * @Author: guozp
 * @Date: 2020-09-16 13:47:28
 * @LastEditTime: 2020-10-14 14:33:37
 * @LastEditors: guozp
 * @Description: Do not edit
 * @FilePath: /argus-fe-template/src/views/logins/plan3/password-reset.vue
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
      <h1 >{{projectName}}</h1>
    </header>
    <section class="idss-login-content">
      <div ref="login" class="idss-login-box">
        <div class="idss-login-left">
        </div>
        <div class="idss-login-right">
          <div class="idss-login-right-inner is-active">
            <password-reset></password-reset>
          </div>
        </div>
      </div>
    </section>
    <footer class="idss-login-footer">
      <p v-show='copyright'>{{copyright}}</p>
    </footer>
  </div>
</template>
<script>
import PasswordReset from '../components/password-reset.vue'
export default {
  components: {
    PasswordReset
  },
  data () {
    return {
      projectName: '项目平台名称',
      copyright: '©xxxxxxxxxx版权所有',
      loading: {}
    }
  }
}
</script>
<style scoped lang="postcss">
@import "./login.css";
</style>
