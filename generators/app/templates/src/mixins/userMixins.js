const API = {
  LOGOUT: {
    url: '/api/logout',
    method: 'post'
  }
}

export default {
  methods: {
    logout () {
      this.$request({
        ...API.LOGOUT
      }).then(() => {
        this.$socketClose()                                // 断开 soket
        window.localStorage.removeItem('base/token$$')     // 清除 token
        window.localStorage.removeItem('base/userInfo$$')  // 清除 token
        this.$store.dispatch('delAllViews')                // 清空所有 tagViews
        const logoutRedirect = this.$store.getters['base/globalConfig$$']('LOGOUT_REDIRECT')
        if (logoutRedirect) {
          // 跳到配置的 登录页面
          location.href = logoutRedirect
        } else {
          // 去默认的登录页
          location.href = this.$router.resolve({ name: 'login' }).href       // 调转到登录页
        }
      })
    }
  }
}
