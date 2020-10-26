module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  extends: '@idss/eslint-config-vue',
  parserOptions: {
    // 指定解析器 parser
    parser: 'babel-eslint'
  }
}
