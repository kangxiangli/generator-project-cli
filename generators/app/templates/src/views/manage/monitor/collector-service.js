import { data2Cartesian, data2DetailPie } from 'fusion-charts/lib/data-factory'
// 基础路径
const BASE_URL = '/api/monitor/monitor-collection'

const API = {
  // 采集器下拉框
  COLLECTOR_SELECT_LIST: {
    url: BASE_URL + '/collection-list/query',
    method: 'get'
  },
  // 采集器详细信息
  COLLECTOR_DETAIL_INFO: {
    url: BASE_URL + '/collection-detail/query',
    method: 'post'
  },
  // 所有采集器日志总量(柱形图/折线图)
  ALL_COLLECTOR_DATA: {
    url: BASE_URL + '/collection-column/query',
    tag: 'all-collector-log-chart',
    method: 'post'
  },
  // 采集器信息（表格）
  COLLECTOR_MES_TABLE: {
    url: BASE_URL + '/collection-page/query',
    tag: 'collector-mes-table',
    method: 'post'
  },
  // 采集器信息（饼图）
  COLLECTOR_MES_CHARTS: {
    url: BASE_URL + '/collection-task-pie/query',
    tag: 'collector-mes-charts',
    method: 'post'
  }
}
export default {
  methods: {
    // 采集器下拉框
    async getCollectorSel () {
      this.collectors = await this.$request({
        ...API.COLLECTOR_SELECT_LIST
      })
      // 默认选中返回数据第一个
      this.collector = this.collectors[0].worker_ip
    },
    // 采集器详细信息
    async getCollectorDetailInfo (params) {
      this.collectorDetailInfo = await this.$request({
        ...API.COLLECTOR_DETAIL_INFO,
        data: {
          collectionIp: params,
          ...this.globalTime
        }
      })
    },
    // 采集器总日志量(柱图/折线图)
    async getAllCollectorLog () {
      let data = await this.$request({
        ...API.ALL_COLLECTOR_DATA,
        data: {
          ...this.globalTime
        }
      })
      this.allLogData = data2Cartesian(data)
    },
    // 采集器信息（表格）
    async getCollectorMesTableData () {
      this.collectorMesTable = await this.requestTable({
        ...API.COLLECTOR_MES_TABLE,
        currentObj: this.collectorMesTable,
        params: {
          ...this.globalTime,
          collectionIp: this.collector
        }
      })
    },
    // 采集器信息（富文本饼图）
    async getCollectorMesChartsData (id) {
      let data = await this.$request({
        ...API.COLLECTOR_MES_CHARTS,
        data: {
          ...this.globalTime,
          collectionIp: this.collector,
          taskId: id
        }
      })
      const res = data2DetailPie(data.data, data.total)
      this.collectorMesChartsData = {
        ...res
      }
    }

  }
}
