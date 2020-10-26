<!--
 * @Author: guozp
 * @Date: 2020-09-16 13:47:28
 * @LastEditTime: 2020-10-14 14:30:16
 * @LastEditors: guozp
 * @Description: Do not edit
 * @FilePath: /argus-fe-template/src/views/logins/plan1/password-reset.vue
-->
<template>
  <div class="idss-login">
    <div class="idss-login-box idss-loading is-active" v-loading="loading['login']">
      <div class="idss-login-logo">
        <img alt="logo" height="80px" :src="require('./images/logo-idss.png')"/>
      </div>
      <div class="idss-login-title idss-txt--center">{{title}}</div>
      <password-reset></password-reset>
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
<style scoped>
@import "./login.css";
</style>
