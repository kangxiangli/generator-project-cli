import Vue from 'vue'
import { Message } from 'element-ui'

if (process.env.NODE_ENV === 'production') {
  /**
   * 说明：[Promise未捕获错误]
   * 开发模式下，错误全部抛出
   * 生产模式下，在控制台输入window.localStorage.isDebug = true，会开启；否则隐藏
   */
  window.addEventListener('unhandledrejection', event => {
    // 会阻止异常继续抛出，不让Uncaught(in promise) Error产生
    event.preventDefault()
    // @todo 采集错误上报
    window.localStorage.isDebug && console.log(event, event.reason)
    let { message = '', errorCode } = event.reason
    // 401、403、500直接调整页面，不展示错误提示
    if (errorCode === 200) {
      message && Message.error(message)
    }
    return true
  })

  /**
   * 说明：[系统运行时错误]
   * 开发模式下，错误全部抛出
   * 生产模式下，在控制台输入window.localStorage.isDebug = true，会开启；否则隐藏
   */
  window.addEventListener('error', (msg, url, row, col, error) => {
    // @todo 采集错误上报
    window.localStorage.isDebug && console.error(msg, url, row, col, error)
    return true
  }, true)

  /**
   * Vue渲染和观察期间未捕获错误的处理
   */
  Vue.config.errorHandler = function (err, vm, info) {
    Vue.nextTick(() => {
      // @todo 采集错误上报
      window.localStorage.isDebug && console.error(err, info)
    })
  }
}
