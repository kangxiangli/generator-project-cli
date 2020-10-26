<!--
 * @Author: guozp
 * @Date: 2020-10-12 14:24:39
 * @LastEditTime: 2020-10-14 14:34:35
 * @LastEditors: guozp
 * @Description: Do not edit
 * @FilePath: /argus-fe-template/src/views/logins/plan4/password-reset.vue
-->
<template>
  <div
    class="idss-login"
    v-loading="loading['login']"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading">
    <div class="idss-login-header">
      <div class="idss-login-header_yd idss-bg-common"></div>
      <div class="idss-login-header_title">数据安全管控平台</div>
    </div>
    <div ref="login" class="idss-login-box">
      <div class="idss-login-left idss-bg-common">
        <div class="idss-login-title-box">
          <div class="idss-login-title-left"></div>
          <div class="idss-login-title-right"></div>
        </div>
      </div>
      <div class="idss-login-right idss-bg-common">
        <!-- 登录 start -->
        <div class="idss-login-right-inner is-active">
          <div class="idss-login-title-outer">
            <span class="idss-login-logo"></span>
          </div>
          <password-reset></password-reset>
        </div>
        <!-- 登录 end -->
      </div>
    </div>
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
      loading: {}
    }
  }
}
</script>
<style scoped>
@import "./login.css";
</style>
