
const BASE_URL = '/api/monitor'

const API = {
  // 服务器监控
  CHART_DATA: {
    tag: 'chart-data-loading',
    url: BASE_URL + '/host',
    method: 'get'
  },
  // 服务器监控-查询
  SEARCH_CHART_DATA: {
    tag: 'chart-data-loading',
    url: BASE_URL + '/host/query',
    method: 'post'
  }
}

export default {
  methods: {
    // 服务器监控
    async getChartData (type) {
      let { ipinfo, interval } = await this.$request({
        ...API.CHART_DATA
      })
      if (type !== 'refresh') {
        // 设置页面刷新间隔
        this.interval = interval

        // 下拉菜单数据
        this.selectList = ipinfo
        // 取得选中数据
        this.selectCurrent = []
        this.selectList.forEach(v => {
          if (v.checked === 1) {
            this.selectCurrent.push(v.ip)
          }
        })
        // @deprecated 这里不从detail获取数据，直接触发表格
        // this.chartData = detail || [{ data: [] }]
      }
      this.tableChange({ type: 'init' }, this.chartData, this.searchChartData)
    },
    // 服务器监控-查询
    async searchChartData (type) {
      let ips = []
      // WTF，提供全力数据查询？只提供ip不可以吗？
      this.selectCurrent.forEach(v => {
        ips.push(this.selectList.find(d => d.ip === v))
      })
      // 轮询时，不要loading
      if (type) {
        API.SEARCH_CHART_DATA.tag = ''
      }
      this.chartData = await this.requestTable({
        ...API.SEARCH_CHART_DATA,
        currentObj: this.chartData,
        params: {
          ips: ips
        }
      }, { noTime: true })
    }
  }
}
