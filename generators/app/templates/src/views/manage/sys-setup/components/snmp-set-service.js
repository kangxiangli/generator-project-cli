const BASE_URL = '/api/argus-system-setting'
const API = {
  // 配置类型列表
  SNMP_TYPE_LIST: {
    url: '/api/argus-common/dict/snmp-config-type',
    method: 'get'
  },
  // snmp 版本列表
  SNMP_VERSION_LIST: {
    url: '/api/argus-common/dict/snmp-edition',
    method: 'get'
  },
  // 访问模式列表
  VISIT_MODE_LIST: {
    url: '/api/argus-common/dict/snmp-mode',
    method: 'get'
  },
  // SNMP 设置列表
  SNMP_FORM: {
    url: `${BASE_URL}/snmp/get`,
    method: 'get',
    tag: 'form-list'
  },
  // SNMP 保存
  SNMP_SAVE: {
    url: `${BASE_URL}/change/snmp`,
    method: 'put',
    tag: 'form-list'
  }
}
export default {
  methods: {
    // 配置类型列表
    async getSnmpTypeListData () {
      this.snmpTypeListData = await this.$request({
        ...API.SNMP_TYPE_LIST
      })
    },
    // snmp 版本列表
    async getSnmpVersionListData () {
      this.snmpVersionListData = await this.$request({
        ...API.SNMP_VERSION_LIST
      })
    },
    // 访问模式列表
    async getVisitModeListData () {
      this.visitModeListData = await this.$request({
        ...API.VISIT_MODE_LIST
      })
    },
    // SNMP 设置列表
    async getSnmpFormData () {
      let result = await this.$request({
        ...API.SNMP_FORM
      })
      result.trustDesti = result.trustDesti.split(',')
      this.cacheData = result
      this.formData = Object.assign({}, result)
    },
    // SNMP 保存
    async getSnmpSaveData () {
      delete this.formData.id
      delete this.formData.trustDestiVal
      await this.$request({
        ...API.SNMP_SAVE,
        data: Object.assign({}, this.formData, { trustDesti: this.formData.trustDesti.toString() })
      })
      this.showMessage('保存成功！')
    }
  }
}
