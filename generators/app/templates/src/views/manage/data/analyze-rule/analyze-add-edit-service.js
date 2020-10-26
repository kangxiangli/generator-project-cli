const BASE_URL = '/api/setting/etl/rule-manage'
const API = {
  // 获取所有设备类型
  DEVICE_LIST: BASE_URL + '/library-tree-menu',
  // 获取所有厂商类型
  FACTORY_LIST: BASE_URL + '/factory-get-all',
  // 获取所有日志类型
  LOG_LIST: BASE_URL + '/log-catetory-get-all',
  // 获取单个规则库详情
  LIBRARY_INFO: BASE_URL + '/library-get',
  // 自动识别字段
  AUTO_FIELD: BASE_URL + '/library-auto-field-names'
}

export default {
  methods: {
    /*
    *  获取所有设备
    */
    async getAllDevice () {
      this.$request({
        url: API.DEVICE_LIST,
        method: 'get'
      }).then((content) => {
        this.deviceoptions = content
      }, (error) => {
        this.showMessage(error.message, 'error')
      })
    },
    /*
    *  获取所有厂商
    */
    async getAllFactory () {
      this.$request({
        url: API.FACTORY_LIST,
        method: 'get'
      }).then((content) => {
        this.factoryoptions = content
      }, (error) => {
        this.showMessage(error.message, 'error')
      })
    },
    /*
    *  获取所有日志类型
    */
    async getAllLog () {
      this.$request({
        url: API.LOG_LIST,
        method: 'get'
      }).then((content) => {
        this.logoptions = content
      }, (error) => {
        this.showMessage(error.message, 'error')
      })
    },
    /*
    *  获取单个规则库
    */
    async getLibraryInfo (id) {
      this.$request({
        url: API.LIBRARY_INFO + '?uuid=' + id,
        method: 'get'
      }).then((content) => {
        this.ruleForm = Object.assign({}, this.ruleForm, content)
        this.ruleForm['backData'] = []
        if (this.ruleForm.extractType === 'kv') {
          [this.ruleForm['firstField'], this.ruleForm['secondField']] = JSON.parse(this.ruleForm.extractor)
        }
      }, (error) => {
        this.showMessage(error.message, 'error')
      })
    },
    /*
    *  自动识别字段
    */
    getField () {
      // 定义不同提取方式对应映射识别的部分表单
      let fieldList = {
        'json': ['rawData'],
        'cef': ['rawData'],
        'kv': ['rawData', 'firstField', 'secondField'],
        'splitChar': ['rawData', 'extractor']
      }
      let promise = []
      fieldList[this.ruleForm.extractType].forEach((value, index) => {
        promise.push(new Promise((resolve, reject) => {
          this.$refs.ruleForm.validateField(value, (err) => {
            resolve(err)
          })
        }))
      })
      Promise.all(promise).then((value) => {
        value.every(item => !item) && this.checkFields()
      })
    },
    checkFields () {
      let param = this.ruleForm.extractType === 'kv' ? (this.ruleForm.firstField + ',' + this.ruleForm.secondField).split(',') : this.ruleForm.extractor
      this.$request({
        url: API.AUTO_FIELD,
        method: 'post',
        data: {
          extractType: this.ruleForm.extractType,
          pattern: JSON.stringify(param),
          rawLog: this.ruleForm.rawData
        }
      }).then((content) => {
        this.showMessage('自动识别成功', 'success') && this.$set(this.ruleForm, 'extractFieldName', content)
      }, (error) => {
        this.showMessage(error.message, 'error')
      })
    },
    // 正则校验
    async checkRegex () {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          let param = this.ruleForm.extractType === 'kv' ? [this.ruleForm.firstField, this.ruleForm.secondField] : this.ruleForm.extractor
          this.$request({
            method: 'post',
            url: '/api/setting/regex/verifyRegex/query',
            data: {
              extractType: this.ruleForm.extractType,
              pattern: param,
              oldContent: this.ruleForm.rawData,
              fieldName: this.ruleForm.extractFieldName
            }
          }).then((content) => {
            this.showMessage('验证成功', 'success')
            let newarr = []
            for (let obj in content.matcherExample) {
              newarr.push({ 'name': obj, 'value': content.matcherExample[obj] })
            }
            this.ruleForm['backData'] = newarr
            this.isCheck = true
          }, (error) => {
            this.isCheck = false
            this.showMessage(error.message, 'error')
          })
        }
      })
    },
    saveRule (formName) {
      let kvType = this.ruleForm.extractType === 'kv' ? [this.ruleForm.firstField, this.ruleForm.secondField] : this.ruleForm.extractor
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.isCheck) {
            this.$request({
              method: 'post',
              url: '/api/setting/etl/rule-manage/library-add',
              data: Object.assign({ extractor: JSON.stringify(kvType) }, this.ruleForm)
            }).then((content) => {
              this.showMessage('保存成功!', 'success')
              // 刷新父级页面，并返回到父级页面
              this.$refreshParentPage()
              this.$router.backToFromPath(this.$route, { isClose: true })
            }, (error) => {
              this.showMessage(error.message, 'error')
            })
          } else {
            this.showMessage('先验证配置的提取器,并确保验证通过!', 'warning')
          }
        } else {
          return false
        }
      })
    }
  },
  mounted () {
    this.getAllDevice()
    this.getAllFactory()
    this.getAllLog()
  }
}
