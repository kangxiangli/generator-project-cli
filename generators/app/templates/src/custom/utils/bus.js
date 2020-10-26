/*
 * @Author: guozp
 * @Date: 2020-09-16 16:34:27
 * @LastEditTime: 2020-09-16 16:34:29
 * @LastEditors: guozp
 * @Description: Do not edit
 * @FilePath: /argus-fe-template/src/custom/utils/bus.js
 */
import BusFactory, { Bus } from 'vue-happy-bus'
const EventName = {
  /** 全局事件名称 */
  WINDOW_RESIZE: 'window-resize',
  SCROLL_EVENT: 'scroll-event',
  MOUSE_LEAVE_BROWSER: 'mouse-leave-browser',
  MENU_TOGGLE_STATUS: 'menu-toggle-status',
  // tags-view 动态tab
  TAGS_VIEW_CLOSE: 'tags-view-close',
  // insight大盘系统组件刷新
  INSIGHT_REFRESH: 'insight-refresh',
  // 拖拽指令监听拖拽元素大小变化
  DRAG_RESIZE: 'drag-resize',
  TOOLBAR_REFRESH: 'toolbar-refresh',
  /** websocket事件名称 */
  WEBSOCKET_ASSET_ANALYSIS: 'websocket_asset_analysis',
  WEBSOCKET_TI_ANALYSIS: 'websocket_ti_analysis',
  WEBSOCKET_UEBA_PARSING: 'websocket_ueba_parsing',
  WEBSOCKET_EXPOSED_ASSET_ANALYSIS: 'websocket_exposed_asset_analysis'
}

export default BusFactory
export { Bus, EventName }
