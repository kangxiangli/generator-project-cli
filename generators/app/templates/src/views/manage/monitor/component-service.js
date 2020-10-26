
const BASE_URL = '/api/monitor'

const API = {
  // 组件监控
  CHART_DATA: {
    tag: 'chart-data-loading',
    url: BASE_URL + '/module',
    method: 'get'
  },
  // 组件监控-查询
  SEARCH_CHART_DATA: {
    tag: 'chart-data-loading',
    url: BASE_URL + '/module/search',
    method: 'post'
  }
  // 组件监控-间隔时间请求
  // INTERVAL_CHART_DATA: {
  //   url: BASE_URL + '/module/interval/query',
  //   method: 'post'
  // }
}

export default {
  methods: {
    // 组件监控
    getChartData (type) {
      this.$request({
        ...API.CHART_DATA
      }).then(data => {
        // 设置页面刷新间隔
        // this.interval = data.interval
        // 下拉菜单数据(组件)
        this.moduleList = data.moduleInfo
        // 取得选中数据(组件)
        this.moduleCurrent = []
        // 下拉菜单数据(IP)
        this.ipList = []
        // 取得选中数据(IP)
        this.ipCurrent = []
        this.moduleList.forEach(v => {
          if (v.moduleChecked === 1) {
            this.moduleCurrent.push(v.module)
          }
          // IP下拉框的处理
          let item = { label: v.module, options: [] }
          v.ipinfo.forEach(d => {
            // @特殊处理, el-select的分组无法区分组, 采用拼接字符串来分组
            let value = v.module + '~' + d.ip
            if (d.ipChecked === 1) {
              this.ipCurrent.push(value)
            }
            item.options.push({ value: value, label: d.ip, ipChecked: d.ipChecked })
          })
          this.ipList.push(item)
        })
        this.chartParam = this.translateData(true)
        this.tableChange({ type: 'init' }, this.chartData, this.searchChartData)
      })
    },

    // 组件监控-查询
    searchChartData () {
      this.requestTable({
        ...API.SEARCH_CHART_DATA,
        currentObj: this.chartData,
        params: {
          modules: this.chartParam
        }
      }, { noTime: true }).then(data => {
        this.chartData = data
      })
    }
  }
}
