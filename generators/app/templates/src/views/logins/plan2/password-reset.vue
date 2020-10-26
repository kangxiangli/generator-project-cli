<!--
 * @Author: guozp
 * @Date: 2020-09-16 13:47:28
 * @LastEditTime: 2020-10-14 19:20:02
 * @LastEditors: guozp
 * @Description: Do not edit
 * @FilePath: /argus-fe-template/src/views/logins/plan2/password-reset.vue
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
        <div class="idss-login-right-inner is-active">
          <div class="idss-login-title-outer">
            <div class="idss-login-logo"></div>
            <div class="idss-login-title idss-txt--center">{{title}}</div>
          </div>
          <password-reset></password-reset>
        </div>
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
      loading: {},
      title: this.$store.getters['base/globalConfig$$']('GLOBAL_TITLE')
    }
  }
}
</script>
<style scoped lang="postcss">
@import "./login.css";
</style>
