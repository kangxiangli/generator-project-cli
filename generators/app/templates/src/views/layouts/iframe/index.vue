<!--
 * @Author: guozp
 * @Date: 2020-07-24 10:53:25
 * @LastEditTime: 2020-07-24 11:09:29
 * @LastEditors: guozp
 * @Description: Do not edit
 * @FilePath: /argus-fe-template/src/views/layouts/iframe/index.vue
-->
<template>
  <div class="container">
    <iframe
      ref="iframe"
      :src="iframeOption.iframeSrc"
      :height="iframeOption.height"
      :width="iframeOption.width"
      :scrolling="iframeOption.scrolling">
    </iframe>
  </div>
</template>
<script>
const IFRAME_OPTION = {
  iframeSrc: '',
  height: '',
  width: '100%',
  scrolling: 'no'
}
export default {
  name: 'idss-iframe',
  props: {
    iframe: {
      type: Object
    }
  },
  watch: {
    '$route': {
      deep: true,
      immediate: true,
      handler (to, from) {
        let { meta } = to
        this.iframeOption = this.iframe ? Object.assign(IFRAME_OPTION, this.iframe) : Object.assign(IFRAME_OPTION, meta)
      }
    }
  },
  data () {
    return {
      iframeOption: {}
    }
  }
}
</script>
<style scoped lang="postcss">
.container {
  > iframe {
    border: none;
  }
}
</style>
