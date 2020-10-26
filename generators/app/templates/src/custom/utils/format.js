import crypto from 'crypto'
import Identicon from 'identicon.js'

import { formatDate } from 'fusion-utils'

const TIME_UNIT = {
  s: '秒',
  m: '分钟',
  h: '小时',
  d: '天',
  w: '周',
  M: '月'
}
/**
 * 日期对象格式化为文本
 * @param time
 * @returns string
 */
function formatTimeToText (time) {
  let { timeFlag, startTime, endTime, timeInterval, timeUnit } = time
  if (timeFlag === 2) { // 绝对时间
    startTime = formatDate.call(new Date(startTime), 'yyyy-MM-dd hh:mm:ss')
    endTime = formatDate.call(new Date(endTime), 'yyyy-MM-dd hh:mm:ss')
    return `${startTime} - ${endTime}（绝对时间）`
  } else if (timeFlag === 3) { // 相对时间
    return `最近${timeInterval}${TIME_UNIT[timeUnit]}`
  } else {
    console.log('formatTimeToText 参数错误！')
    return ''
  }
}

/**
 * 生成哈希头像
 * @param str
 * @returns {*}
 */
function strConvertImg (str) {
  if (str === undefined) {
    str = 'idss'
  }
  let hash = crypto.createHash('md5')
  hash.update(str)
  let imgData = new Identicon(hash.digest('hex')).toString()
  return 'data:image/png;base64,' + imgData
}
/**
 * 把秒转换成时分秒
 * @param {Number} num 秒数
 */
function formatTime (num) { // @FIXME:暂不支持单位自定义
  let time = num / 1000
  let hourTime = Math.floor(time / 60 / 60) // 小时
  let minuteTime = Math.floor(time / 60) % 60// 分
  let secondTime = Math.floor(time) % 60 // 秒
  return `${hourTime}小时${minuteTime}分${secondTime}秒`
}

export {
  formatTimeToText,
  strConvertImg,
  formatTime
}
