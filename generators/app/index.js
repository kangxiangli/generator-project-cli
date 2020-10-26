const Generator = require('yeoman-generator');

module.exports = class extends Generator {
  prompting() {
    return this.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Your project name',
        default: this.appname
      }
    ])
    .then(answers => {
      this.answers = answers;
    })
  }
  writing() {
    const templates = [
      '.browserslistrc',
      '.editorconfig',
      '.eslintrc.js',
      '.gitignore',
      '.gitlab-ci.yml',
      '前端工程介绍.md',
      'babel.config.js',
      'jsconfig.json',
      'package.json',
      'pm2.mock.config.json',
      'postcss.config.js',
      'README.md',
      'vue.config.js',
      'webpack.alias.config.js',
      'mock/server.js',
      'mock/sys/menus.json',
      'git-hooks/eslint-pre-commit.js',
      'git-hooks/verify-commit-msg.js',
      'public/favicon.ico',
      'public/index.html',
      'public/config.js',
      'src/App.vue',
      'src/Probe.vue',
      'src/main.js',

      'src/routers',

      'src/assets/fonts/DS-DIGI.ttf',
      'src/assets/geojson',
      'src/assets/icons',
      'src/assets/images',

      'src/custom/components',
      'src/custom/directives/index.js',
      'src/custom/directives/permission.js',
      'src/custom/filters/index.js',
      'src/custom/plugins/request.js',
      'src/custom/utils/base.js',
      'src/custom/utils/bus.js',
      'src/custom/utils/dom.js',
      'src/custom/utils/format.js',
      'src/custom/utils/generate-sql.js',
      'src/custom/utils/password.js',
      'src/custom/utils/upload-download.js',
      
      'src/mixins/globalMixins.js',
      'src/mixins/userMixins.js',

      'src/store/index.js',
      'src/store/type.js',

      'src/store/modules/base.js',
      'src/store/modules/clear-uuid.js',
      'src/store/modules/dashboard.js',
      'src/store/modules/event.js',
      'src/store/modules/index.js',
      'src/store/modules/log.js',
      'src/store/modules/message.js',
      'src/store/modules/permission.js',
      'src/store/modules/realtime.js',
      'src/store/modules/tags-view.js',

      'src/store/plugins/index.js',
      'src/store/plugins/init.js',
      'src/store/plugins/persistent-state.js',

      'src/styles/base.css',
      'src/styles/business.css',
      'src/styles/element.css',
      'src/styles/element.var.css',
      'src/styles/font.css',

      'src/styles/themes/index.js',
      'src/styles/themes/default/common.css',
   
      'src/views/layouts/layout.vue',
      'src/views/layouts/components/app-main.vue',
      'src/views/layouts/iframe/index.vue',

      'src/views/logins/login.vue',
      'src/views/logins/components/login-form.vue',
      'src/views/logins/components/login-form-service.js',
      'src/views/logins/components/password-forgot.vue',
      'src/views/logins/components/password-modify.vue',
      'src/views/logins/components/password-reset.vue',

      'src/views/logins/login.vue',
      'src/views/logins/password-reset.vue',

      'src/views/permission',
      'src/views/empty.vue',

      


    ];
    templates.forEach(item => {
      this.fs.copyTpl(
        this.templatePath(item),
        this.destinationPath(item),
        this.answers
      )
    })
  }
}