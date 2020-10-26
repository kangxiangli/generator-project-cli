import { searchTreeByNode } from 'fusion-utils'
const BASE_URL = '/api/ueba/system/policy'
const DICT_URL = '/api/ueba/dict/select'
const API = {
  POLICYS: {
    tag: 'realtime-template',
    url: BASE_URL + '/realtime-template/query'
  },
  SCENE_TREE: {
    method: 'get',
    tag: 'scene-tree',
    url: DICT_URL + '/getSceneTree'
  },
  RISK_LEVEL: {
    method: 'get',
    tag: 'risk-level',
    url: DICT_URL + '/getRiskLevel'
  },
  HARM_STAGE: {
    method: 'get',
    tag: 'harm-stage',
    url: DICT_URL + '/getHarmStage'
  },
  EVENT_DEVICE_TYPE: {
    method: 'get',
    tag: 'event-device-type',
    url: DICT_URL + '/event_device_type'
  },
  EVENT_FILEDS: {
    method: 'get',
    tag: 'event-fields',
    url: DICT_URL + '/event-fields'
  },
  EVENT_TYPE_TREE: {
    method: 'get',
    tag: 'event-type-tree',
    url: DICT_URL + '/event-type-tree'
  },
  WINDOW_TIME_FIELD: {
    method: 'get',
    tag: 'window-time-field',
    url: DICT_URL + '/window-time-field'
  },
  DATA_STREAM: {
    method: 'get',
    tag: 'data-stream',
    url: BASE_URL + '/datastream/query-all'
  },
  REALTIME_SAVE: {
    method: 'post',
    tag: 'realtime-save',
    url: BASE_URL + '/realtime/save'
  },
  QUERY_REALTIME: {
    url: BASE_URL + '/realtime/query',
    method: 'post',
    tag: 'realtime-save'
  },
  FILTER_EXPRESSION: {
    url: BASE_URL + '/datastream/filter-expression',
    method: 'post',
    tag: 'filter-expression'
  },
  REALTIME_INIT_DICT: {
    url: DICT_URL + '/realtime-init-dict',
    method: 'get',
    tag: 'realtime-init-dict'
  }
}
export default {
  methods: {
    // 获取分险类型
    async getSceneRisk () {
      await this.$request({
        ...API.SCENE_TREE
      }).then(data => {
        this.sceneRiskList = data
      })
    },
    // 策略分类
    async getEventTypeTree () {
      await this.$request({
        ...API.EVENT_TYPE_TREE
      }).then(data => {
        this.riskTypeTree = data
      })
    },
    // 时间窗口字段
    async getWindowTimeFields () {
      await this.$request({
        ...API.WINDOW_TIME_FIELD
      }).then(data => {
        this.windowTimeFieldsList = data
      })
    },
    // 获取杀伤链阶段
    async getHarmStage () {
      await this.$request({
        ...API.HARM_STAGE
      }).then(data => {
        this.darmStageList = data
      })
    },
    // 获取事件设备分类
    async getEventDeviceType () {
      await this.$request({
        ...API.EVENT_DEVICE_TYPE
      }).then(data => {
        this.eventDeviceList = data
      })
    },
    // 获取风险级别
    async getRiskLevel () {
      await this.$request({
        ...API.RISK_LEVEL
      }).then(data => {
        this.riskLevelList = data
      })
    },
    // 获取事件字典
    async getEventFields () {
      await this.$request({
        ...API.EVENT_FILEDS
      }).then(data => {
        this.eventFieldList = data
      })
    },
    // 初始化字典 [getEventFields,getRiskLevel, getHarmStage,getEventDeviceType,getWindowTimeFields,getEventTypeTree,getSceneRisk] 接口废弃
    async initRealTimeDict () {
      await this.$request({
        ...API.REALTIME_INIT_DICT
      }).then(data => {
        // 获取分险类型
        this.sceneRiskList = data.sceneTree
        // 策略分类
        this.riskTypeTree = data.eventTypeTree
        // 时间窗口字段
        this.windowTimeFieldsList = data.windowTimeField
        // 获取杀伤链阶段
        this.darmStageList = data.harmStage
        // 获取事件设备分类
        this.eventDeviceList = data.eventDeviceType
        // 获取风险级别
        this.riskLevelList = data.riskLevel
        // 获取事件字典
        this.eventFieldList = data.eventFields
        // 获取资源配置字段
        this.resourceConfigList = data.resourceConfig.map(item => {
          item.value = isNaN(Number.parseInt(item.seg1)) ? (item.seg1 || '') : Number.parseInt(item.seg1)
          item.min = item.seg2 && (isNaN(Number.parseInt(item.seg2.split(',')[0])) ? 0 : Number.parseInt(item.seg2.split(',')[0]))
          item.max = item.seg2 && (isNaN(Number.parseInt(item.seg2.split(',')[1])) ? 999999 : Number.parseInt(item.seg2.split(',')[1]))
          item.unit = item.seg3 || ''
          return item
        })
        // 获取用户列表字典
        // 转化为tree
        let temTree = data.deptUserTree
        temTree.map(item => {
          if (!item.deptName) {
            item.id = item.userId
          }
          item.name = item.userName || item.deptName
          if (Array.isArray(item.children)) {
            this.dealDeptUserTree(item)
          } else {
            return item
          }
        })
        this.noticeUsersList = temTree
      })
    },
    // 用户列表字典递归处理
    dealDeptUserTree (data) {
      return data.children.map(item => {
        if (!item.deptName) {
          item.id = item.userId
        }
        item.name = item.userName || item.deptName
        if (Array.isArray(item.children)) {
          return this.dealDeptUserTree(item)
        } else {
          return item
        }
      })
    },
    // 获取事件源
    async getEvents () {
      return this.$request({
        ...API.DATA_STREAM
      })
    },
    // 编辑
    async realtimeQuery (id) {
      return this.$request({
        ...API.QUERY_REALTIME,
        data: {
          id: id
        }
      })
    },
    // 获取策略模板
    async getPolicys () {
      let { url } = API.POLICYS
      await this.$request({
        url: url,
        method: 'get'
      }).then(data => {
        this.policyList = data
      })
    },
    async realtimeSave () {
      let tem = JSON.parse(JSON.stringify(this.realtimeForm))
      delete tem.resourceConfig
      let params = {
        ...tem,
        resourceConfig: this.realtimeForm.resourceConfig.map(item => {
          let obj = {}
          obj.id = item.id
          obj.alias = item.alias
          obj.value = item.value
          return obj
        })
      }
      await this.$request({
        ...API.REALTIME_SAVE,
        data: {
          ...params
        }
      }).then(data => {
        this.$router.replaceTagPush({
          name: 'manage-realtime-manage',
          query: {
            _r: this.$route.query.id
          }
        }, this.$route)
      })
    },
    // 编辑调用的方法
    async editBuildData () {
      this.abList = []
      let tem = this.policyList.filter(item => item.id === this.realtimeForm.ruleTemplate)[0]
      this.templateObj = tem
      if (this.realtimeForm.events.length === 2) {
        // 第一个
        let logType = this.realtimeForm.events[0].radioType
        if (logType === 'global') {
          let tId = this.realtimeForm.events[0].temEventId.split(',')[0]
          let obj = this.eventListObj.eventList.filter(item => item.id === parseInt(tId))[0]
          this.abList.push({
            value: this.realtimeForm.events[0].as,
            label: `${this.realtimeForm.events[0].as}.${obj.name}`,
            type: logType
          })
        } else {
          let nameStr = logType === 'single' ? '分类日志' : '内部事件'
          this.abList.push({
            value: this.realtimeForm.events[0].as,
            label: `${this.realtimeForm.events[0].as}.${nameStr}`,
            type: logType
          })
        }
        // 第二个
        logType = this.realtimeForm.events[1].radioType
        if (logType === 'global') {
          let tId = this.realtimeForm.events[1].temEventId.split(',')[0]
          let obj = this.eventListObj.eventList.filter(item => item.id === parseInt(tId))[0]
          this.abList.push({
            value: this.realtimeForm.events[1].as,
            label: `${this.realtimeForm.events[1].as}.${obj.name}`,
            type: logType
          })
        } else {
          let nameStr = logType === 'single' ? '分类日志' : '内部事件'
          this.abList.push({
            value: this.realtimeForm.events[1].as,
            label: `${this.realtimeForm.events[1].as}.${nameStr}`,
            type: logType
          })
        }
      } else {
        let logType = this.realtimeForm.events[0].radioType
        if (logType === 'global') {
          let tId = this.realtimeForm.events[0].temEventId.split(',')[0]
          let obj = this.eventListObj.eventList.filter(item => item.id === parseInt(tId))[0]
          this.abList.push({
            value: this.realtimeForm.events[0].as,
            label: `${this.realtimeForm.events[0].as}.${obj.name}`,
            type: logType
          })
        } else {
          let nameStr = logType === 'single' ? '分类日志' : '内部事件'
          this.abList.push({
            value: this.realtimeForm.events[0].as,
            label: `${this.realtimeForm.events[0].as}.${nameStr}`,
            type: logType
          })
        }
      }
      await this.$nextTick()
      this.$refs['realtimeForm'].clearValidate()
    },
    // 生成字符串
    buildFilterExpression (obj) {
      return this.$request({
        ...API.FILTER_EXPRESSION,
        data: obj
      })
    },
    getDataList (dataType) {
      switch (dataType) {
        case 'compare':
          return this.operations
        case 'baseline':
          return this.baseline
        case 'baseline_top':
          return this.baselineTop
        case 'list':
          return this.tags
        case 'include':
          return this.operationOne
        default:
          return []
      }
    },
    buildTerms (data) {
      let strArry = []
      data.terms.some(term => {
        let mould = this.moulds.filter(item => item.id === term.id)[0]
        let temStr = mould.template.substring(1, mould.template.length - 1)
        mould.params.some((item, index) => {
          let tem
          switch (item.type) {
            case 'tree':
              tem = searchTreeByNode(this.filedDicts, term[item.value], { id: 'id', name: 'name', children: 'children' })
              temStr = temStr.replace('？', `${tem.node.name}`)
              break
            case 'select':
              tem = this.getDataList(item.dataType).filter(p => p.id === term[item.value])[0]
              temStr = temStr.replace('？', `${tem.name}`)
              break
            default:
              temStr = temStr.replace('？', `${term[item.value]}`)
              break
          }
        })
        strArry.push(`(${temStr})`)
      })
      return strArry
    },
    buildFilterExpression1 (data) {
      // debugger
      // let t = this.buildTerms(data)
      // debugger
    }
  }
}
