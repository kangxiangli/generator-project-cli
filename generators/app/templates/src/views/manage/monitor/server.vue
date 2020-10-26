<template>
  <div class="server-container">
    <!-- 手工搜索 -->
    <idss-widget :globalStyle="{'padding': '15px 15px 0 15px'}">
      <el-form inline>
        <el-form-item>
          <span class="idss-title-filtrate">筛选条件</span>
        </el-form-item>
        <el-form-item label="IP" label-width="30px">
          <el-select
            :popper-append-to-body="false"
            v-model="selectCurrent"
            collapse-tags
            multiple
            style="width: 350px;"
            placeholder="请选择">
            <el-option v-for="item in selectList" :key="item.ip" :label="item.ip" :value="item.ip">
              <el-tooltip
                :content="`${item.ip}(${item.hostName})`"
                placement="top-start"
                effect="dark">
                <span class="ip-content">{{ item.ip }}({{ item.hostName }})</span>
              </el-tooltip>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="search" type="primary">查询</el-button>
        </el-form-item>
      </el-form>
    </idss-widget>

    <idss-widget :footer-style="{'padding': '10px'}">
      <!-- <template slot="title-left">监控告警</template> -->
      <!-- 遍历 -->
      <el-row class="custom-widget-container" v-for="(item, index) in chartData.data" :key="index">
        <el-col style="padding: 15px 15px 6px; font-weight: bolder;">{{ getChartsTitle(item) }}</el-col>
        <el-col :span="6">
          <idss-widget class="custom-widget" shadow="never" :header-style="{padding: '4px 15px'}">
            <template slot="title-left">CPU使用情况(%)</template>
            <idss-line-chart
              :option="{grid: {top: '10px'}}"
              symbol="emptyCircle"
              :data="getSingleChartData(item.cpu)"
              style="height: 150px;"></idss-line-chart>
          </idss-widget>
        </el-col>
        <el-col :span="6">
          <idss-widget class="custom-widget" shadow="never">
            <template slot="title-left">内存使用情况(%)</template>
            <idss-line-chart
              :option="{grid: {top: '10px'}}"
              symbol="emptyCircle"
              :data="getSingleChartData(item.memory)"
              style="height: 150px;"></idss-line-chart>
          </idss-widget>
        </el-col>
        <el-col :span="6">
          <idss-widget class="custom-widget" shadow="never">
            <template slot="title-left">硬盘使用情况(%)</template>
            <idss-line-chart
              :option="{grid: {top: '10px'}}"
              symbol="emptyCircle"
              :data="getSingleChartData(item.disk)"
              style="height: 150px;"></idss-line-chart>
          </idss-widget>
        </el-col>
        <el-col :span="6">
          <idss-widget class="custom-widget" shadow="never">
            <template slot="title-left">网络吞吐量(bps)</template>
            <idss-line-chart
              :option="{grid: {top: '10px'}}"
              symbol="emptyCircle"
              :data="getSingleChartData(item.network)"
              style="height: 150px;"></idss-line-chart>
          </idss-widget>
        </el-col>
      </el-row>

      <!-- 分页 -->
      <template slot="footer">
        <idss-pagination
          :tableData="chartData"
          @size-change="handleTableChange"
          @page-change="handleTableChange"></idss-pagination>
      </template>
    </idss-widget>
  </div>
</template>
<script>
import globalMixins from '@/mixins/globalMixins.js'
import { data2Cartesian } from 'fusion-charts/lib/data-factory'
import service from '@/views/manage/monitor/server-service.js'

export default {
  name: 'manage-monitor-server',
  mixins: [globalMixins, service],
  watch: {
    selectCurrent: {
      immediate: true,
      deep: true,
      handler (newVal, oldVal) {
        if (!newVal.length) {
          clearInterval(this.intervalId)
        }
      }
    }
  },
  data () {
    return {
      // 下拉列表
      selectList: [],
      selectCurrent: [],
      // 刷新时间
      interval: undefined, // 秒
      // 缓存数据
      chartData: {
      },
      monitorAlarm: false, // 监控告警
      // 监控告警
      formData: {
        cpuAlarm: '75%', // cpu告警标准
        memoryAlarm: '80%', // 内存告警标准
        diskAlarm: '70%', // 硬盘告警标准
        networkAlarm: '80%', // 网络告警标准
        hdfsAlarm: '80%' // HDFS告警标准
      }
    }
  },
  methods: {
    // 修改分页数量
    handleTableChange (params) {
      this.tableChange(params, this.chartData, this.searchChartData)
    },
    getSingleChartData (data) {
      let result = data2Cartesian(data)
      result.series.forEach(item => {
        item.areaStyle = { opacity: 0.6 }
        item.lineStyle = { width: 2 }
      })
      return result
    },
    // 查询
    search () {
      this.tableChange({ type: 'submit' }, this.chartData, this.searchChartData)
      clearInterval(this.intervalId) // 点击查询时清空定时器
      this.refreshInterval()
    },
    // 获取图表title
    getChartsTitle (item) {
      let { ip, hostName, use, system } = item
      let result = `${ip}(${hostName}`
      result += system ? `|${system}` : ''
      result += use ? `|${use}` : ''
      return `${result})`
    },
    // 定时刷新
    refreshInterval () {
      if (!this.selectCurrent.length) return
      this.intervalId = setInterval(_ => {
        // 轮询过程不要loading
        this.tableChange({ type: 'submit' }, this.chartData, this.searchChartData.bind(this, 'no-loading'))
      }, this.interval * 1000)
    },
    async init () {
      // 获取图表数据
      await this.getChartData()
      this.refreshInterval()
    }
  },
  mounted () {
    this.init()
  },
  destroyed () {
    clearInterval(this.intervalId)
  },
  activated () {
    !!this.isActivateFlag && this.refreshInterval()
  },
  deactivated () {
    clearInterval(this.intervalId)
    this.isActivateFlag = true
  }
}
</script>
<style lang="postcss" scoped>
.server-container {
  & .custom-widget-container {
    border-bottom: 1px dashed #dcdfe6;
  }
  & .custom-widget {
    & >>> .title-left {
      font-weight: normal;
      font-size: var(--font-size-default);
    }
  }
}
</style>
