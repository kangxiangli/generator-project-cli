<!--
 * @Author: guozp
 * @Date: 2020-09-16 13:47:28
 * @LastEditTime: 2020-09-16 14:02:04
 * @LastEditors: guozp
 * @Description: Do not edit
 * @FilePath: /argus-fe-template/src/views/layouts/components/app-main.vue
-->
<template>
  <section class="app-main-container">
    <idss-router-keep-alive :include="cacheViews" :isByName="false" :isNoCache="isNoCache">
      <router-view ref="router-view" :key="$route.fullPath"></router-view>
    </idss-router-keep-alive>
  </section>
</template>

<script>
export default {
  name: 'app-main',
  computed: {
    cacheViews () {
      const res = []
      this.$store.state.tagsView.cachedViews.forEach(item => {
        res.push(item.fullPath)  // 将原来的 item.name 修改 item.fullPath，
      })
      return res
    },
    key () {
      return this.$route.fullPath
    },
    isNoCache () {
      return this.$store.getters['base/globalConfig$$']('TAGS_VIEW')['isNoCache']
    }
  }
}
</script>
<style scoped lang="postcss">
.app-main-container {
  flex: auto;
  position: relative;
  margin: 12px 4px 0 16px;
}
</style>
