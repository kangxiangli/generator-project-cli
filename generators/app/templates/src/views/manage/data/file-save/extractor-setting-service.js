const BASE_URL = '/api/setting'
const API = {
  // 部门列表
  DEPT_LIST: '/api/setting/etl/dept/get-all',
  // 获取所有厂商类型
  FACTORY_LIST: BASE_URL + '/etl/rule-manage/factory-get-all',
  // 获取所有设备类型
  DEVICE_LIST: BASE_URL + '/etl/rule-manage/library-tree-menu',
  // 获取所有日志类型
  LOG_LIST: BASE_URL + '/etl/rule-manage/log-catetory-get-all',
  // 规则名称
  LIBRARY_LIST: BASE_URL + '/etl/rule-manage/library-query-page'
}
export default {
  methods: {
    async getTableData () {
      this.requestTable({
        url: API.LIBRARY_LIST,
        currentObj: this.tableData,
        params: this.SearchForm
      }, {
        noTime: true
      }).then((res) => {
        this.tableData = Object.assign({}, res)
      })
    },
    // 部门列表
    async getDeptList () {
      this.deptList = await this.$request({
        method: 'get',
        url: API.DEPT_LIST
      }, {
        tag: 'dept_list'
      })
    },

    // 测试转换json
    isJSON (index) {
      var str = this.pickerData.nomalData[index].fieldName
      var flag = true
      var fieldArr = str.split(',')
      if (fieldArr.length === 0) {
        return false
      }
      for (var i = 0; i < fieldArr.length; i++) {
        var valArr = fieldArr[i].split('->')
        if (valArr.length !== 2) {
          flag = false
          break
        }
      }
      this.jsonTip = flag
      return flag
    },

    // 获取正则表达式 FIXME: 暂时没有用到
    getRegexPattern (param, idx) {
      var this_ = this
      this_.request('post', BASE_URL + '/regex/getRegexPattern/query', param).then(function (response) {
        this_.$set(this_.pickerData.nomalData[idx], 'taskRule', response.content)
      }).catch(function (error) {
        console.log(error)
      })
    },
    // 获取去重后的提取器id（提取器左侧列表）
    getextractId () {
      return this.$request({
        method: 'get',
        url: BASE_URL + '/etl/job/ui/get-extractId?jobSerialNumber=' + this.taskids
      }).then((content) => {
        // 置空时啥意思？
        this.tableData = []

        if (content.length > 0) {
          this.scheme = content
          // 先找到当前的提取器
          let currentExtractor = content.find((item, index) => {
            if (item.jobSerialNumber === this.taskids) {
              // 如果没有 curId 默认取 jobSerialNumber 中的第一个 @fixme 哥，this.$route.query 写到一块不行吗？
              this.defaultActiveExtactorId = this.$route.query.curId || item.id
              return item
            }
          })
          // 这个字段要干啥
          this.matchExample = JSON.parse(currentExtractor.extractDataSample || '{}')
          if (currentExtractor.jsonRegexExtractList && currentExtractor.jsonRegexExtractList.length) {
            // 这个有啥是啥？
            this.jsonRegexMatchExample = JSON.parse(currentExtractor.jsonRegexExtractList[0].extractDataSample)
          }
          // 获取当前提取器的相关规则
          this.getrules(this.defaultActiveExtactorId)
        }
      }, (error) => {
        console.log(error)
      })
    },

    // 获取每个extractId 的schema和规则（右侧表格）
    getrules (param) {
      this.$request({
        method: 'get',
        url: BASE_URL + '/etl/job/ui/get-rules?extractId=' + param
      }).then((content) => {
        this.tableData = content
        this.sendMessage.fieldRulesList = content.fieldRulesList
      }, (error) => {
        console.log(error)
      })
    },

    // 保存schema和规则
    rulesave (param) {
      this.$refs['mergeForm'].validate((valid) => {
        if (valid) {
          var params = JSON.parse(JSON.stringify(param))
          params.fieldRulesList.map(val => {
            if (val.ruleEntity && val.ruleEntity['fillUpConditionList']) {
              val.ruleEntity['fillUpConditionList'].map(rule => {
                Array.isArray(rule['fillUpKey']) && (rule['fillUpKey'] = rule['fillUpKey'].join(','))
              })
            }
          })
          this.$request({
            method: 'post',
            url: BASE_URL + '/etl/job/ui/rules-save',
            data: params
          }).then((content) => {
            this.$message({
              type: 'success',
              message: '保存成功!'
            })
            this.$store.dispatch('delVisitedViews', this.$route).then((views) => {
              this.$router.push({ name: 'manage-data-job' })
            })
          }, (error) => {
            this.showMessage(error.message, 'error')
          })
        } else {
          return false
        }
      })
    },

    /**
     * dataChange.vue
     * 表单
    */
    async getDictList () {
      this.dictList = await this.$request({
        method: 'get',
        url: BASE_URL + '/etl/dict/list'
      })
    },

    /**
     * dataChange.vue
     * 选择表单 change事件
     * @param dictName 目前选中值
    */
    async initDictSchema (dictName) {
      if (!dictName) {
        return
      }
      // 获取字段
      let content = await this.$request({
        method: 'get',
        url: BASE_URL + '/etl/dict/query?dictName=' + dictName
      })
      /**
          dictChName: "测试用"
          dictEditable: true
          dictName: "etl_xuying2"
          dictQuerySql: null
          dictSchema: "{
            "dictChName":"测试用",
            "dictFields":[
              {"fieldLength":0,"fieldName":"int1","fieldType":"long"},
              {"fieldLength":0,"fieldName":"int2","fieldType":"long"}
            ],
            "dictName":"etl_xuying2"
          }"
          id: 16
        */
      this.dic = JSON.parse((content || {}).dictSchema).dictFields
      for (let i = 0; i < this.dic.length; i++) {
        this.dic[i]['label'] = this.dic[i].fieldName
        this.dic[i]['value'] = ''
      }

      // 这一坨，在这里是混乱的，初始化时处理即可！！！
      // // 设置属性集
      // let fillUpConditionList = this.message['oldData'].ruleEntity && this.message['oldData'].ruleEntity['fillUpConditionList']
      // if (fillUpConditionList) {
      //   var sendAllData = fillUpConditionList[0]
      //   // 还原每个属性设置好的字段值
      //   if (Object.keys(sendAllData.aliasMapping).length > 0) {
      //     let ary = []
      //     for (var key in sendAllData.aliasMapping) {
      //       ary.push({
      //         dictName: sendAllData.dictName,
      //         fillUpKey: key,
      //         fieldName: sendAllData.aliasMapping[key]
      //       })
      //     }
      //     this.dynamic_replace.groups = ary
      //   }
      // }
      // 默认 「将」 表单赋值为当前 「当」 数据
      this.dynamic_replace.groups[0].dictName = dictName

      this.curGroupList = this.dic
      this.curGroupList.forEach(item => {
        this.$set(item, 'visibleFlag', true)
      })
      // ?
      // this.setFlag()
    },

    cancel () {
      this.$emit('close', [1])
    },

    // 写入日志字段
    async getLogDict () {
      const result = await this.$request({
        method: 'get',
        url: '/api/pipeline/dict/select/getLogDict'
      })
      // this.$nextTick() 干啥子
      this.$nextTick(function () {
        this.systemFields = result
      })
    },
    async checkRegex (picker) {
      let param = null
      picker.extractType === 'kv' ? param = (picker.firstField + ',' + picker.secondField).split(',') : param = picker.extractor
      this.$request({
        method: 'post',
        url: '/api/setting/regex/verifyRegex',
        data: {
          extractType: picker.extractType,
          pattern: param,
          oldContent: picker.oldContent,
          fieldName: picker.tempExtractData[picker.extractType].fieldName
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
        picker['matcherList'] = newarr
        // this.$forceUpdate()
      }, (error) => {
        this.$message({
          type: 'error',
          message: error.message
        })
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
    getTypeId (type, value) {
      this.tableData.data = []
      this.searchData[type] = value
      type === 'deviceTypeId' && this.filterDevice(value)
      this.getLibraryData(this.searchData)
    },
    filterDevice (id) {
      this.deviceoptions.forEach((item, index) => {
        id = item.uuid && (this.searchData['level'] = item.level)
      })
    },
    // 删除静态字段
    deleteStaticField (param) {
      this.$confirm('是否确认删除此字段?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$request({
          method: 'delete',
          url: '/api/setting/etl/job/ui/del-rule-static-field/' + param.fieldRuleSetId
        }).then((content) => {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          this.getextractId()
          this.getLogDict()
        }, (error) => {
          console.log(error)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  },
  // 这是一个 mixins，mounted优先级和是否有必要考虑了？
  // 以及这么多页面共同mixins了它，都有必要请求吗？
  mounted () {
    this.getAllDevice()
    this.getAllFactory()
    this.getAllLog()
  }
}
