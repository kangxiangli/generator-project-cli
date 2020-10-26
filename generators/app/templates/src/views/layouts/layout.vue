<template>
  <component :is="viewLayout" v-bind="$attrs"></component>
</template>
<script>
import layoutDefault from './plan1/index.vue'
// import layoutDefault from './plan2/index.vue'
// import layoutDefault from './plan3/index.vue'

import layoutIframe from './iframe/index.vue'

export default {
  name: 'layout',
  components: {
    layoutDefault,
    layoutIframe
  },
  props: {
    viewLayout: {
      type: String,
      default: 'layoutDefault'
    }
  }
}
</script>
