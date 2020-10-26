
const BASE_URL = '/api/monitor'

const API = {
  // 数据质量监控
  CHART_DATA: {
    url: BASE_URL + '/data-quality'
  },
  // 数据质量监控-查询
  SEARCH_CHART_DATA: {
    tag: 'chart-data-loading',
    url: BASE_URL + '/data-quality/query',
    method: 'post'
  }
}

export default {
  methods: {
    // 获取提取器名称下拉框数据
    async getSelList () {
      let { jobInfo = [] } = await this.$request({
        ...API.CHART_DATA
      })
      this.selectList = jobInfo
      this.selectCurrent = jobInfo.reduce((prev, current) => {
        if (current.checked === 1) {
          prev.push(current.key)
        }
        return prev
      }, [])
    },
    // 获取图表列表数据
    async getChartData () {
      this.chartData = await this.requestTable({
        ...API.SEARCH_CHART_DATA,
        currentObj: this.chartData,
        params: {
          jobInfo: this.selectCurrent
        }
      }, { noTime: true })
    }
  }
}
