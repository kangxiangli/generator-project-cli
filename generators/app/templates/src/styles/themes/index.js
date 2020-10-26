const baseThemePath = 'src/styles/themes'
module.exports = {
  // vue cli3主题配置
  option: {
    themePath: baseThemePath,
    isDeleteHtmlThemeCss: true,
    themePrefix: 'theme'
  },
  // 主题列表
  themeList: [
    {
      key: 'default',
      name: '默认'
    },
    {
      key: 'dark',
      name: '灰色'
    }
  ]
}
