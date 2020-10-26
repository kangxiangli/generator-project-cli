<!--
 * @Author: guozp
 * @Date: 2020-07-16 17:13:47
 * @LastEditTime: 2020-10-14 19:20:22
 * @LastEditors: guozp
 * @Description: Do not edit
 * @FilePath: /argus-fe-template/src/views/logins/password-reset.vue
-->
<template>
  <component :is="viewLayout"></component>
</template>
<script>
import layoutDefault from './plan3/password-reset.vue'
export default {
  name: 'password-reset',
  components: {
    layoutDefault
  },
  props: {
    viewLayout: {
      type: String,
      default: 'layoutDefault'
    }
  }
}
</script>
