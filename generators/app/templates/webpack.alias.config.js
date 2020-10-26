/*
 * @Author: guozp
 * @Date: 2020-03-16 13:46:48
 * @LastEditTime: 2020-09-16 16:34:44
 * @LastEditors: guozp
 * @Description: Do not edit
 * @FilePath: /argus-fe-template/webpack.alias.config.js
 */
const path = require('path')
function resolve (dir) {
  return path.join(__dirname, dir)
}
/**
 * vue cli3配置webpack alias别名
 */
module.exports = function (config) {
  config.resolve.alias
    .set('@utils', 'fusion-utils') // utils 工具库别名
    .set('@charts', 'fusion-charts') // charts 图标别名
    .set('@components', 'fusion-components') // components 组件别名
    .set('@directives', 'fusion-components/lib/directives') // directives 指令
    .set('@bus', resolve('./src/custom/utils/bus.js')) // bus 组件别名
}
