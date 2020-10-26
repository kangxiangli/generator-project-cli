<template>
  <div class="idss-rolling-table" @mouseover="stop" @mouseleave="move" @wheel.prevent="handleScroll">
    <slot></slot>
  </div>
</template>
<script>
import { throttle } from 'fusion-utils'
export default {
  name: 'idss-rolling-table',
  props: {
    data: {
      type: Array,
      default () { return [] }
    },
    // duration 配置，单位s 秒
    duration: {
      type: Number,
      default: 0
    },
    // delay 配置，单位ms 毫秒
    delay: {
      type: Number,
      default: 600
    }
  },
  data () {
    return {
      tableData: this.data
    }
  },
  watch: {
    data: {
      deep: true,
      handler: function () {
        if (this.data.length) {
          this.$nextTick(() => {
            // 保证表格渲染完成，开始滚动控制
            this.init()
            // 运动开始
            this.move()
          })
        }
      }
    }
  },
  methods: {
    /**
       * 鼠标滚轮事件触发
       */
    handleScroll: throttle(function (e) {
      if (e.deltaY > 0) { // 向上滚动
        if (!this.position || !this.position.length) return
        if (this.position[1] === 0) {
          this.direction = 'down'
          return
        }
        this.position.push(this.position.shift())
      } else if (e.deltaY < 0) { // 向下滚动
        if (!this.position || !this.position.length) return
        if (this.position[0] === 0) {
          this.direction = 'up'
          return
        }
        this.position.unshift(this.position.pop())
      }
      this.$tbody.style.transition = null
      this.$tbody.style.transform = `translate3D(0, -${this.position[0]}px, 0)`
    }, 200, 200),

    /**
       * 初始化相关数据
       */
    init () {
      // 停止上次滚动
      this.stop()
      // 初始化位置数据
      this.position = []
      // 滚动方向: 默认为 up
      this.direction = 'up'

      // 保证表格渲染完成，开始滚动控制
      let $rollingTable = this.$el
      let $wrapper = $rollingTable.querySelector('.el-table__body-wrapper')
      this.$tbody = $rollingTable.querySelector('.el-table__body-wrapper tbody')
      if (!this.$tbody || !$wrapper) return
      // 初始化表格位置
      this.$tbody.style.transform = `translate3D(0, 0, 0)`

      // 认为每行高度一致
      let rowHeight = this.$tbody.children[0].scrollHeight
      // 容器可视范围内展示的数量
      let maxDisplaylen = Math.floor($wrapper.clientHeight / rowHeight)
      // 数据量小于可展示数据，没有滚动的必要
      if (this.data.length <= maxDisplaylen) return

      // 位置记录
      for (let i = 0; i <= (this.data.length - maxDisplaylen); i++) {
        this.position[i] = rowHeight * i
      }
    },

    /**
       * 滚动控制
       */
    move () {
      this.timeout && clearTimeout(this.timeout)

      this.timeout = setTimeout(() => {
        if (this.duration && this.$tbody) {
          this.$tbody.style.transition = null
        }
        if (this.direction === 'down') {
          this.rolling('down')
        } else {
          this.rolling('up')
        }
      }, this.duration * 1000 + this.delay)
    },

    /**
       * 停止滚动
       */
    stop () {
      clearTimeout(this.timeout)
    },

    /**
       * 向上滚动控制
       * @param {string} type up/down
       */
    rolling (type) {
      if (!this.position || !this.position.length) return
      // 将队首移动到队尾
      if (type === 'up') {
        this.position.push(this.position.shift())
      } else {
        this.position.unshift(this.position.pop())
      }
      this.$tbody.style.transform = `translate3D(0, -${this.position[0]}px, 0)`
      if (this.duration) {
        this.$tbody.style.transition = `${this.duration}s ease-in-out`
      }
      if (type === 'up' && this.position[1] === 0) {
        this.direction = 'down'
      } else if (type === 'down' && this.position[0] === 0) {
        this.direction = 'up'
      }
      this.move()
    }
  },
  beforeDestroy () {
    this.stop()
  }
}
</script>
<style scoped lang="postcss">
  .idss-rolling-table {
    /* 滚动过渡 */
    & >>> .el-table__body {
      tbody {
        transition-delay: 0;
        transition-duration: 600ms;
        transition-property: transform;
        transition-timing-function: linear;
      }
    }
    /* 隐藏滚动条 */
    & >>> .el-table--scrollable-y .el-table__body-wrapper {
      overflow-x: auto;   /* 处理拉伸《列》线后隐藏其他列问题 */
      overflow-y: hidden;
    }
  }
</style>
