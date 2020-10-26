<template>
  <div></div>
</template>
<script>
import { Message } from 'element-ui'
export default {
  name: 'Probe',
  watch: {
    // 检测是否需要重新登录
    '$store.state.base.isReLogin': {
      handler (val, oldVal) {
        if (val) {
          Message.error({
            message: '登录信息已失效，请重新登录',
            duration: 1000,
            onClose: () => {
              // 销毁vue实例
              this.$root.$destroy()
              // 跳转到登录
              location.href = this.$router.resolve({ name: 'login' }).href
            }
          })
        }
      },
      immediate: true
    }
  }
}
</script>
