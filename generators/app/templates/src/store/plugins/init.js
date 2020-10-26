/**
 * 该vuex插件的作用为初始化一些action
 */
import { DASHBOARD, LOG, EVENT, MESSAGE, REALTIME } from '../type'
import { Bus } from '@bus'

const initActionList = [
  'dashboard/' + DASHBOARD.COLUMNS_RULE,
  'dashboard/' + DASHBOARD.IS_PROXY,
  'log/' + LOG.SOURCE_LIST,
  'event/' + EVENT.SEVERITY,
  'event/' + EVENT.WARN_STATUS_LIST,
  'message/' + MESSAGE.STATUS,
  'message/' + MESSAGE.SOURCE,
  'message/' + MESSAGE.TYPE,
  'realtime/' + REALTIME.MOULDS
]

export default function (store) {
  for (let action of initActionList) {
    Bus.$once(action, () => {
      store.dispatch(action)
    })
  }
}
