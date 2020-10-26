
import { POLICY } from '@/store/type'
import { mapActions } from 'vuex'
import globalMixins from '@/mixins/globalMixins.js'
export default {
  data () {
    return {
      isFrist: true,
      // 组件
      groupId: this.$route.params.groupId,
      // 标记模式， 1 编辑， 2 添加， 3 查看
      componentMode: 2,
      strategy: {
        name: '',
        description: '',
        status: true,
        type: this.$route.params.groupId // 1实时 2离线 3基线
      },
      timeWindow: {
        step: 1,
        stepType: 's',
        window: 1,
        windowType: 's',
        time: {
          timeFlag: 2,
          startTime: +new Date() - 24 * 3600 * 1000,
          endTime: +new Date()
        }
      },
      dataset: {
        datasetOneId: null,
        datasetTwoId: null
      },
      filterConfig: {
        filterRule: {
          rules: ''
        },
        filterAgg: [{
          dataCollection1: 0,
          keyBy1: null,
          dataCollection2: 0,
          keyBy2: null
        }]
      },
      baselineStrategy: {
        groupByFields: '',
        time: '',
        field: '',
        function: '',
        paramType: [],
        param: []
      },
      actionConfig: {
        riskType: '',
        riskLevel: '',
        eventType: '',
        eventName: '',
        noticeStation: false,
        noticeUsers: '',
        killChainStage: '',
        riskScore: 1,
        alarmCondition: '',
        mailNotice: false,
        mailAddress: '',
        internalEvent: '1',
        eventDeviceType: '',
        earlyWarning: false
      },
      outConfig: {
        outPutList: []
      },
      actionCondition: {
        repaceType: 'n',
        repaceValue: '',
        timerCron: '',
        repaceTime: ''
      },
      defaultOutput: [] // 默认输出属性
    }
  },
  mixins: [globalMixins],
  methods: {
    ...mapActions('policy', {
      getLogDict: POLICY.LOG_DICT,
      getstrategyFun: POLICY.FILTER_FUN,
      getFilterFun: POLICY.STRATEGY_FUN,
      getOperator: POLICY.OPERATION,
      getBaseline: POLICY.BASE_LINE,
      getBaselineTop: POLICY.BASE_LINE_TOP,
      getRoster: POLICY.LIST_TAGS,
      getOperatorOne: POLICY.LIST_OPERATION,
      getDatasetData: POLICY.LIST_DATASET
    }),
    async buildData () {
      try {
        return Promise.all([
          this.getDatasetData(),
          this.getLogDict(),
          this.getstrategyFun(),
          this.getFilterFun(),
          this.getBaseline(),
          this.getBaselineTop(),
          this.getRoster(),
          this.getOperatorOne(),
          this.getOperator()])
      } catch (error) {
        this.showMessage(error.message, 'error')
      }
    },
    async getDefaultOutput () { // 获取默认的输出属性
      await this.$request({
        method: 'get',
        url: '/api/ueba/dict/select/output-default'
      }, { isPromptError: true }).then(data => {
        this.defaultOutput = data
      })
    },
    async getPolicyById (id) { // 获取策略配置
      let reuslt = await this.$request({
        url: '/api/ueba/system/policy/query-merge/query',
        method: 'post',
        data: { id: id }
      }, {
        isPromptError: true
      })
      this.isFrist = false
      this.strategy = Object.assign({}, this.strategy, reuslt.strategy)
      this.timeWindow = Object.assign({}, this.timeWindow, reuslt.timeWindow)
      this.filterConfig = Object.assign({}, this.filterConfig, reuslt.filterConfig)
      if (this.filterConfig.filterRule.rules === '') {
        this.isFrist = true
      }
      this.dataset = Object.assign({}, this.dataset, reuslt.dataset)
      if (this.groupId === '2') {
        this.actionConfig = Object.assign({}, this.actionConfig, reuslt.actionConfig)
        if (this.outConfig.length === 0) {
          this.getDefaultOutput().then(_ => {
            let jsonData = JSON.parse(JSON.stringify(this.defaultOutput))
            this.outConfig = Object.assign({}, this.outConfig, { outPutList: jsonData })
          })
        } else {
          this.outConfig = Object.assign({}, this.outConfig, { outPutList: reuslt.outPutList })
        }
      } else {
        this.baselineStrategy = Object.assign({}, this.baselineStrategy, reuslt.baselineStrategy)
      }
      this.actionCondition = Object.assign({}, this.actionCondition, reuslt.actionCondition)
      this.$set(this.loading, 'load-page', false)
    },
    async savePolicy () {
      let param = Object.assign({}, { strategy: this.strategy }, { timeWindow: this.timeWindow }, { dataset: this.dataset }, { filterConfig: this.filterConfig }, { actionCondition: this.actionCondition })
      if (this.groupId === '2') {
        param = Object.assign({}, param, { actionConfig: this.actionConfig }, this.outConfig)
      } else {
        param = Object.assign({}, param, { baselineStrategy: this.baselineStrategy })
      }
      try {
        await this.$request({
          method: 'post',
          url: '/api/ueba/system/policy/save-merge',
          data: param,
          tag: 'save-policy'
        })
        if (this.componentMode === 2) {
          this.showMessage('保存成功')
        } else {
          this.showMessage('修改成功')
        }
        if (this.groupId === '2') {
          // 跳转并关闭当前tags
          this.$router.replaceTagPush({
            name: 'manage-strategy-manage',
            query: {
              _r: this.$route.query.id
            }
          }, this.$route)
        } else {
          // 跳转并关闭当前tags
          this.$router.replaceTagPush({
            name: 'manage-baseline-manage'
          }, this.$route)
        }
      } catch (error) {
        if (this.componentMode === 2) {
          this.showMessage((error && error.message) || '保存失败', 'error')
        } else {
          this.showMessage((error && error.message) || '修改失败', 'error')
        }
      }
    },
    revert () {
      if (this.groupId === '2') {
        // 跳转并关闭当前tags
        this.$router.replaceTagPush({
          name: 'manage-strategy-manage'
        }, this.$route)
      } else {
        // 跳转并关闭当前tags
        this.$router.replaceTagPush({
          name: 'manage-baseline-manage'
        }, this.$route)
      }
    },
    onSubmit () {
      let ptfFlag = this.$refs['policyTypeFrom'].submitForm()
      let tcfFlag = this.$refs['timeConfigFrom'].submitForm()
      let dcfFlag = this.$refs['datasetConfigFrom'].submitForm()
      let pcfFlag = this.$refs['policyConfigFrom'].submitForm()
      let cfFlag = this.$refs['conditionFrom'].submitForm()
      if (this.groupId === '2') {
        let acfFlag = this.$refs['actionConfigFrom'].submitForm()
        if (ptfFlag && tcfFlag && dcfFlag && pcfFlag && acfFlag && cfFlag) {
          this.$refs['policyConfigFrom'].updateRule()
          this.savePolicy()
        }
      } else {
        let acfFlag = this.$refs['baselineConfigFrom'].submitForm()
        if (ptfFlag && tcfFlag && dcfFlag && pcfFlag && acfFlag && cfFlag) {
          this.$refs['policyConfigFrom'].updateRule()
          this.savePolicy()
        }
      }
    },
    restForm () {
      this.$refs['policyTypeFrom'].resetForm()
    },
    initData () {
      let self = this
      self.filterConfig = Object.assign({}, self.filterConfig, { filterRule: { rules: '' }, filterAgg: [{ dataCollection1: self.dataset.datasetOneId || 0, dataCollection2: self.dataset.datasetTwoId || 0 }] })
    }
  },
  watch: {
    // 监听父组件 传递的data变化
    dataset: {
      deep: true,
      handler: function () {
        if (this.isFrist) {
          this.initData()
        }
        this.isFrist = true
      }
    }
  },
  created () {
    if (this.$route.name === 'manage-strategy-manage-config-add' || this.$route.name === 'manage-baseline-manage-config-add') {
      this.$set(this.loading, 'load-page', false)
    } else {
      this.$set(this.loading, 'load-page', true)
    }
  }
}
