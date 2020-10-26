<!--
 * @Author: guozp
 * @Date: 2020-07-24 11:05:06
 * @LastEditTime: 2020-07-24 11:16:00
 * @LastEditors: guozp
 * @Description: Do not edit
 * @FilePath: /argus-fe-template/src/views/manage/iframe/iframe.vue
-->
<template>
  <div>
    <layout view-layout="layoutIframe" :iframe="iframe"></layout>
  </div>
</template>
<script>
import layout from '@/views/layouts/layout.vue'
export default {
  name: 'iframe',
  components: {
    layout
  },
  data () {
    return {
      iframe: {
        // iframeSrc: this.$store.getters['base/globalConfig$$']().MANAGE,
        iframeSrc: 'http://www.baidu.com',
        height: '946px'
      }
    }
  }
}
</script>
