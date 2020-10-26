const postcssMixinColor = require('fusion-components/theme/mixins')

module.exports = {
  plugins: {
    'postcss-import': {
      path: ['src/styles', 'src/styles/themes/']
    },
    'postcss-mixins': {
      mixins: postcssMixinColor
    },
    'postcss-preset-env': {
      features: {
        'custom-properties': {
          preserve: true
        },
        'color-mod-function': true
      }
    },
    'postcss-calc': {},
    'precss': {}
  }
}
