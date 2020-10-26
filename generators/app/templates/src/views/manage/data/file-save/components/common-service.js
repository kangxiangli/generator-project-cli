const BASE_URL = '/api/setting/etl/rule-manage'
const API = {
  // 获取所有设备类型
  DEVICE_LIST: BASE_URL + '/library-tree-menu',
  // 获取所有厂商类型
  FACTORY_LIST: BASE_URL + '/factory-get-all',
  // 获取所有日志类型
  LOG_LIST: BASE_URL + '/log-catetory-get-all',
  // 自动识别字段
  AUTO_FIELD: BASE_URL + '/library-auto-field-names',
  LIBRARY_LIST: {
    url: BASE_URL + '/library-query-page',
    tag: 'library-list'
  },
  // 获取单个规则库详情
  LIBRARY_INFO: BASE_URL + '/library-get'
}
export default {
  methods: {
    async getLibraryData (params) {
      this.requestTable({
        ...API.LIBRARY_LIST,
        currentObj: this.tableData,
        params: params
      }, {
        noTime: true
      }).then((res) => {
        this.tableData = Object.assign({}, res)
      })
    },
    // 获取原始数据
    async getNomalData (param) {
      this.$request({
        method: 'get',
        url: '/api/setting/etl/kafka/topic/input-preview?jobSerialNumber=' + param,
        tag: 'nomal-data-list'
      }).then((content) => {
        if (content) {
          this.businessData['data'] = content
          this.pagedata = content.slice(0, 100)
          this.businessData.total = content.length
        }
      }, (error) => {
        this.$message({
          type: 'warning',
          message: error.message
        })
      })
    },
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
        this.$set(this.pickerData.data[0], 'extractor', content.extractor)
        this.$set(this.pickerData.data[0], 'oldContent', content.rawData)
        this.$set(this.pickerData.data[0], 'extractType', content.extractType)
        this.$set(this.pickerData.data[0], 'logCategoryUuid', content.logCategoryUuid)
        this.$set(this.pickerData.data[0], 'factoryUuid', content.factoryUuid)
        this.$set(this.pickerData.data[0], 'deviceTypeUuid', content.deviceTypeUuid)
        content['extractType'] === 'json' && this.$set(this.pickerData.data[0].tempExtractData['json'], 'fieldName', content.extractFieldName)
        content['extractType'] === 'splitChar' && this.$set(this.pickerData.data[0].tempExtractData['splitChar'], 'extractData', content.extractor) && this.$set(this.pickerData.data[0].tempExtractData['splitChar'], 'fieldName', content.extractFieldName)
        content['extractType'] === 'regex' && this.$set(this.pickerData.data[0].tempExtractData.regex, 'extractData', content.extractor)
        content['extractType'] === 'grok' && this.$set(this.pickerData.data[0].tempExtractData['grok'], 'fieldName', content.extractor)
        content['extractType'] === 'kv' && this.$set(this.pickerData.data[0].tempExtractData['kv'], 'firstField', JSON.parse(content.extractor)[0]) && this.$set(this.pickerData.data[0].tempExtractData['kv'], 'secondField', JSON.parse(content.extractor)[1]) && this.$set(this.pickerData.data[0].tempExtractData['kv'], 'fieldName', content.extractFieldName)
        content['extractType'] === 'cef' && this.$set(this.pickerData.data[0].tempExtractData['cef'], 'fieldName', content.extractFieldName)
      })
    },
    /*
      *  自动识别字段
      */
    async getField (picker) {
      let param = null
      picker.extractType === 'kv' ? param = JSON.stringify([picker.tempExtractData['kv'].firstField, picker.tempExtractData['kv'].secondField]) : param = picker.extractData
      picker.extractType === 'splitChar' && (param = picker.tempExtractData['splitChar']['extractData'])
      this.$request({
        url: API.AUTO_FIELD,
        method: 'post',
        data: {
          extractType: picker.extractType,
          pattern: param,
          rawLog: picker.oldContent
        }
      }).then((content) => {
        content && this.showMessage('自动识别成功', 'success') && this.$set(picker.tempExtractData[picker.extractType], 'fieldName', content)
      }, (error) => {
        this.showMessage(error.message, 'error')
      })
    },
    // 正则校验
    async checkRegex () {
      let param = null
      this.pickerData.extractType === 'kv' ? param = [this.pickerData.firstField, this.pickerData.secondField] : param = this.pickerData.extractData
      this.pickerData.extractType === 'json' && this.validateSomeForm(['oldContent', 'fieldName'], param)
      this.pickerData.extractType === 'splitChar' && this.validateSomeForm(['oldContent', 'extractData', 'fieldName'], param)
      this.pickerData.extractType === 'kv' && this.validateSomeForm(['oldContent', 'firstField', 'secondField', 'fieldName'], param)
      this.pickerData.extractType === 'grok' && this.validateSomeForm(['oldContent', 'extractData'], param)
      this.pickerData.extractType === 'regex' && this.validateSomeForm(['oldContent', 'extractData'], param)
      this.pickerData.extractType === 'cef' && this.validateSomeForm(['oldContent', 'fieldName'], param)
    },
    cancel (formName) {
      this.$refs[formName].resetFields()
      this.$emit('closeDialog')
    },
    // 保存提取器
    savePicker () {
      this.$request({
        method: 'get',
        url: '/api/setting/etl/job/ui/get-job?jobSerialNumber=' + this.pickerData.jobSerialNumber
      }).then((content) => {
        if (content.jobStatus === -1) {
          this.showMessage('任务不存在,无法保存!', 'error')
        } else {
          this.$request({
            method: 'post',
            url: '/api/setting/etl/job/ui/extract-save',
            data: {
              data: [this.pickerData]
            }
          }).then((content) => {
            var paramList = {
              name: this.$route.name,
              params: this.$route.params,
              path: this.$route.path,
              query: this.$route.query,
              title: this.$route.meta.title,
              _r: this.$route.query._r
            }
            this.$store.dispatch('delVisitedViews', paramList).then((views) => {
              this.$router.push({ name: 'manage-data-extractor-setting', query: { id: this.pickerData.jobSerialNumber, type: 'single' } })
            })
          }, (error) => {
            this.showMessage(error.message, 'error')
          })
        }
      }, (error) => {
        console.log(error)
      })
    },
    validateSomeForm (eFields, param) {
      let validateStatus = []
      eFields.map((val) => {
        this.$refs.pickerData.validateField(val, (error) => {
          if (!error) {
            validateStatus.push('1')
          } else {
            validateStatus.push('0')
            return false
          }
        })
      })
      if (!validateStatus.includes('0')) {
        this.$request({
          method: 'post',
          url: '/api/setting/regex/verifyRegex',
          data: {
            extractType: this.pickerData.extractType,
            pattern: param,
            oldContent: this.pickerData.oldContent,
            fieldName: this.pickerData.fieldName
          }
        }).then((content) => {
          this.$message({
            type: 'success',
            message: '验证成功'
          })
          let newarr = []
          for (let obj in content.matcherExample) {
            newarr.push({ 'name': obj, 'value': content.matcherExample[obj] })
          }
          this.$set(this.pickerData, 'extractDataSample', newarr)
        }, (err) => {
          this.$message({
            type: 'error',
            message: err.message
          })
        })
      }
    }
  },
  mounted () {
    this.getAllDevice()
    this.getAllFactory()
    this.getAllLog()
  }
}
