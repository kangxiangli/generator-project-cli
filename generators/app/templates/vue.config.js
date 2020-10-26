const isProduction = process.env.NODE_ENV === 'production'
const path = require('path')
// mock 资源文件的绝对路径
const mockPath = path.join(__dirname, 'mock')

// 获取css主题切换配置
const themeSwitchFn = require('fusion-components/theme/vue.theme.config.js')
// 获取全局主题配置
const themeOpt = require('./src/styles/themes/index')
const themeSwitchWebpack = themeSwitchFn(themeOpt.option)

// 获取 webpack allias别名
const webpackAlias = require('./webpack.alias.config')
module.exports = {
  runtimeCompiler: true,
  chainWebpack: (config) => {
    // css 主题 提取
    themeSwitchWebpack.chainWebpackConfig(config)
    // alias 别名添加
    webpackAlias(config)
  },
  devServer: {
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'http://localhost:18080',
        headers: { 'mock-server': 'argus-fe-template', 'mock-path': mockPath },
        changeOrigin: true
      },
      '^/websocket': {
        target: 'ws://localhost:18080',
        headers: { 'mock-server': 'argus-fe-template' },
        changeOrigin: true,
        ws: true
      }
    }
  },
  // 在开发环境下，在每次保存时 lint 代码
  lintOnSave: !isProduction
}
