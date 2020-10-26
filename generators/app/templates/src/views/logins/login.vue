<!--
 * @Author: guozp
 * @Date: 2020-07-16 11:08:06
 * @LastEditTime: 2020-10-14 19:20:36
 * @LastEditors: guozp
 * @Description: Do not edit
 * @FilePath: /argus-fe-template/src/views/logins/login.vue
-->
<template>
  <component :is="viewLogin"></component>
</template>

<script>
import layoutDefault from './plan3/index.vue'
export default {
  name: 'login',
  components: {
    layoutDefault
  },
  props: {
    viewLogin: {
      type: String,
      default: 'layoutDefault'
    }
  }
}
</script>
