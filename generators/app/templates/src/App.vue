<template>
  <div id="app" style="height: 100%;">
    <router-view></router-view>
    <el-tooltip ref="idss-tooltip" v-bind="tooltipOpt"/>
  </div>
</template>

<script>
import { throttle } from 'fusion-utils'
import BusFactory, { EventName } from '@bus'
import themeService from '@components/theme/switch-theme.service'
// 必须使用动态引入样式方式（设置默认主题）
const themeKey = window.localStorage.getItem('base/theme$$') || 'default'

let bus
export default {
  name: 'App',
  mixins: [themeService],
  data () {
    return {
      tooltipOpt: {}
    }
  },
  methods: {
    // 初始化主题
    initTheme () {
      this.themeChange(themeKey)
    },
    // 初始化侦听事件
    initEventListener () {
      bus = BusFactory(this)
      // 对 windows resize 事件内部进行节流控制(再chrome下已对回调函数的调用频率进行了控制)
      let resizeFn = (event) => {
        bus.$emit(EventName.WINDOW_RESIZE, event)
      }
      window.addEventListener('resize', throttle(resizeFn))

      // 监听滚动
      let scrollFn = event => {
        bus.$emit(EventName.SCROLL_EVENT, event)
      }
      window.addEventListener('scroll', throttle(scrollFn))

      // 浏览器关闭或刷新时清空uuidList
      window.addEventListener('unload', e => {
        e = e || window.event
        if (!e) return
        let { name } = this.$route
        let param = name === 'analysis-inquire-event-board' ? this.$route.query : undefined  // 为了判断浏览器刷新时，当前保留的tag是否为事件调查看板
        this.$store.dispatch('clearUUid', { type: 'closeOtherTags', data: param })
      })
      // 监听鼠标移出屏幕
      document.addEventListener('mouseleave', event => {
        bus.$emit(EventName.MOUSE_LEAVE_BROWSER, event)
      })
    },
    /**
     * 路由回滚
     * @FIXME 借助路由队列，通过pushState将路由队列覆盖，然后对路由进行回滚到第一个历史记录，继续覆盖
     * 这种处理存在bug，history.length为2，始终保持原来进入页面的第一个路由
     */
    historyGoBack () {
      // 处理原有路由query对象
      let query = this.paramUrl()
      let pathname = this.location.pathname
      // @FIXME 这里不能用 1 - history.length，如果跳转到空白页面，进行路由push有bug
      history.go(2 - history.length)
      this.$router.push({ path: pathname, query: query })
    },

    /**
     * 解析url to param对象
     */
    paramUrl () {
      const query = {}
      if (this.location.search) {
        const a = this.location.search.split('?')[1].split('&')
        a.forEach(item => {
          const q = item.split('=')
          if (q.length) {
            query[q[0]] = q[1]
          }
        })
      }
      return query
    },
    // 初始化
    init () {
      this.initTheme()
      this.initEventListener()
      // this.historyGoBack() // 获取回退最后历史记录
    }
  },
  created () {
    this.init()
  }
}
</script>
