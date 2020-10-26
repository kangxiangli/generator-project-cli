/*
 * @Author: guozp
 * @Date: 2020-04-07 14:42:17
 * @LastEditTime: 2020-10-14 16:34:26
 * @LastEditors: guozp
 * @Description: Do not edit
 * @FilePath: /argus-fe-template/src/main.js
 */
import Vue from 'vue'
import ElementUI from 'element-ui'

// 样式引用
import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/theme-rules/rule.var.css'
import '@/styles/theme-rules/zindex.css'
import '@/styles/base.css'
import '@/styles/font.css'     // 引入特殊字体
import '@/styles/element.css'  // Element UI样式
import '@/styles/business.css' // 业务类定义
import 'fusion-charts/lib/index.css' // 图表样式引用

// 图标引用
import '@/assets/icons'

// 公共组件引用
import App from './App.vue'
import Probe from './Probe.vue'
import Store from '@/store'
import Router from '@/routers'

import '@/monitors'        // 错误监控模块 暂时不开启，后续稳定后处理
import '@/custom/components'  // 引入业务组件库
import '@/custom/directives'  // 引入自定义指令【permission 指令】

// 插件引用【Request、Vue扩展、Websocket】
import Request from '@/custom/plugins/request.js'
import VueExtend from '@components/lib/plugins/vue-extend'
import Websocket from '@components/lib/plugins/socket.js'
import FusionComponents from 'fusion-components'
import FunsionCharts from 'fusion-charts'

Vue.config.productionTip = false

Vue.use(Request)
Vue.use(ElementUI)
Vue.use(Websocket)
Vue.use(VueExtend)
Vue.use(FunsionCharts)
Vue.use(FusionComponents)

// eslint-disable-next-line
new Vue({
  el: '#app',
  router: Router,
  store: Store,
  components: { App, Probe },
  // 这里注册 Probe 组件便于全局监听变化（menu以及vuex部分请求需要同app同级别 ）如：监听store值的变化
  template: `<div style="height: 100%;">
              <app></app>
              <probe></probe>
            </div>`,
  beforeCreate () {
    // 获取前端全局配置
    this.$store.dispatch('base/globalConfig$$')
  },
  beforeDestroy () {
    this.$socketClose()           // 断开 soket
    window.localStorage.clear()   // 清楚localStorage
  }
})
