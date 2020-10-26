/**
 * Created by ligang on 2018/6/12.
 */

import Message from 'element-ui/packages/message/index.js'
/**
 * 获取后台错误提示语
 * @param message
 * 兼容三种message模式
 * 1. 字符串 {message:'XXXX'}
 * 2. 数组模式 {message: [item: 'xxx', message: 'xxxx']}
 * 3. 混合模式 {message: [item: ['name1', 'name2'], message: 'xxxx]}
 * @param {string} customErrorMsg 自定义错误消息
 * @returns {{}}
 */
const getErrorMsgByEnd = function ({ message = [] }, customErrorMsg) {
  try {
    // 后台错误提示语
    let errors = {}
    // 兼容非校验错误处理
    if (!Array.isArray(message)) {
      throw new Error(message)
    }
    message.map(obj => {
      if (typeof obj.item === 'string') {
        Object.assign(errors, { [obj.item]: obj.message })
      } else if (Array.isArray(obj.item)) {
        // 兼容返回item为数组处理
        obj.item.map(filed => {
          Object.assign(errors, { [filed]: obj.message })
        })
      } else {
        // 其他错误结构抛出异常
        throw new Error('接口校验错误结构返回异常！')
      }
    })
    return errors
  } catch (err) {
    Message({
      type: 'error',
      message: err.message || customErrorMsg
    })
    return false
  }
}

export {
  getErrorMsgByEnd
}
