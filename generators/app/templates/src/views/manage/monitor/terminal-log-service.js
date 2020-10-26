import { data2Cartesian } from 'fusion-charts/lib/data-factory'
const BASE = '/api/monitor/client'
const API = {
  TOP20: {
    url: BASE + '/logscnt/query',
    method: 'post',
    tag: 'top20'
  },
  GENERAL_NUMS: {
    url: BASE + '/general-nums/query',
    method: 'post',
    tag: 'general-nums'
  },
  LIST: {
    url: BASE + '/list/query',
    method: 'post',
    tag: 'list'
  }
}
export default {
  methods: {
    getTop20 () {
      this.$request({
        ...API.TOP20,
        data: this.globalTime
      }, {
        isPromptError: true
      }).then(result => {
        this.logSendTop = data2Cartesian(result)
        this.logSendTop.series.forEach(item => {
          item.itemStyle = {
            barBorderRadius: 2
          }
          item.barWidth = '15%'
        })
      })
    },
    getSingleValue () {
      this.$request({
        ...API.GENERAL_NUMS,
        data: this.globalTime
      }, {
        isPromptError: true
      }).then(result => {
        console.log(result)
        for (const key in result) {
          this.singleValueData[key].value = result[key]
        }
      })
    },
    getTableData () {
      this.requestTable({
        ...API.LIST,
        currentObj: this.tableData,
        params: {
          ...this.queryData,
          ...this.globalTime,
          type: this.currentActive
        }
      }, {
        isPromptError: true
      }).then(result => {
        this.tableData = result
      })
    }
  }
}
