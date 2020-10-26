<template>
  <div class="manage-monitor-components-container">
    <idss-widget :globalStyle="{'padding': '15px 15px 0 15px'}">
      <el-form inline >
        <el-form-item>
          <span class="idss-title-filtrate">筛选条件</span>
        </el-form-item>
        <el-form-item label="组件名称" label-width="70px">
          <el-select
            style="width: 260px;"
            v-model="moduleCurrent"
            multiple
            collapse-tags
            @change="changeModule"
            placeholder="请选择">
            <el-option
              v-for="item in moduleList"
              :key="item.module"
              :label="item.module"
              :value="item.module"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="IP" label-width="40px">
          <el-select
            style="width: 250px;"
            v-model="ipCurrent"
            multiple
            collapse-tags
            @change="changeIp"
            placeholder="请选择">
            <el-option-group v-for="group in ipList" :key="group.label" :label="group.label">
              <el-option
                v-for="item in group.options"
                :key="item.value"
                :label="item.label"
                :value="item.value"></el-option>
            </el-option-group>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="search" type="primary">查询</el-button>
        </el-form-item>
      </el-form>
    </idss-widget>

    <idss-widget :footer-style="{padding: '6px 0'}">
      <!-- 遍历 -->
      <idss-widget
        class="custom-widget-container"
        v-loading="loading['chart-data-loading']"
        v-for="(item, index) in chartData.data"
        :key="index"
        shadow="never">
        <template slot="title-left">组件名: {{ item.module }} IP: {{ item.ip }}</template>
        <el-row>
          <el-col :span="9">
            <idss-widget
              class="custom-widget"
              shadow="never"
              :header-style="{'padding': '0 15px 0'}">
              <template slot="title-left">CPU使用情况(%)</template>
              <idss-line-chart
                symbol="emptyCircle"
                :data="getSingleChartData(item.cpu)"
                :option="chartConfig"
                style="height: 160px;"
                v-loading="loading['cpu-loading']"></idss-line-chart>
            </idss-widget>
          </el-col>
          <el-col :span="9">
            <idss-widget
              class="custom-widget"
              shadow="never"
              :header-style="{'padding': '0 15px 0'}">
              <template slot="title-left">内存使用情况(%)</template>
              <idss-line-chart
                symbol="emptyCircle"
                :data="getSingleChartData(item.memory)"
                :option="chartConfig"
                style="height: 160px;"
                v-loading="loading['memory-loading']"></idss-line-chart>
            </idss-widget>
          </el-col>
          <el-col :span="6">
            <idss-widget
              class="custom-widget"
              shadow="never"
              :header-style="{'padding': '0 15px 0'}">
              <template slot="title-left">存活状态</template>
              <div class="manage-monitor-type">
                <div class="type" :class="item.processExsits ? 'normal' : 'danger'">
                  <idss-icon-svg
                    class="custom-icon-svg"
                    :name="item.processExsits ? 'zhihangchenggong' : 'circle-alert'"></idss-icon-svg>
                  {{ item.processExsits ? '正常' : '异常'}}
                </div>
              </div>
            </idss-widget>
          </el-col>
        </el-row>
      </idss-widget>

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
import service from '@/views/manage/monitor/component-service.js'
import SearchComponent from '@/views/manage/monitor/search-components/search-component.js'

export default {
  name: 'manage-monitor-components',
  mixins: [globalMixins, service, SearchComponent],
  watch: {
    ipCurrent: {
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
      interval: this.$store.getters['base/globalConfig$$']('COMPONENTS_MONITER_TIMEOUT'),
      intervalId: null,
      chartParam: [],
      // 下拉列表 (组件)
      moduleList: [],
      moduleCurrent: [],
      // 下拉列表 (IP)
      ipList: [],
      ipCurrent: [],
      multiData: undefined,
      // 图表数据
      barlineData: undefined,
      // 刷新时间
      // 缓存数据
      chartData: {
        pageSize: 10
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
        item.markPoint = { symbolSize: 35, data: [{ name: '最大值', type: 'max' }] }
        item.areaStyle = { opacity: 0.6 }
        item.lineStyle = { width: 2 }
      })
      return result
    },
    // 查询
    search () {
      this.chartParam = this.translateData(true)
      this.tableChange({ type: 'submit' }, this.chartData, this.searchChartData)
      clearInterval(this.intervalId) // 点击查询时清空定时器
      this.refreshInterval()
    },
    async init () {
      // 获取图表数据
      await this.getChartData()
      this.refreshInterval()
    },
    refreshInterval () {
      if (!this.ipCurrent.length) return
      this.intervalId = setInterval(_ => {
        // 获取图表数据
        this.tableChange({ type: 'init' }, this.chartData, this.searchChartData)
      }, this.interval)
    }
  },
  mounted () {
    this.chartConfig = {
      grid: { top: '30px', bottom: '15px', left: '20px' }
    }
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
.manage-monitor-components-container {
  & .custom-widget-container {
    border-bottom: 1px dashed #dcdfe6;
    margin-right: 0;
  }
  & .custom-widget {
    >>> .title-left {
      font-size: var(--font-size-4);
      font-weight: normal;
    }
  }

  & .manage-monitor-type {
    width: 60%;
    height: 160px;
    text-align: center;
    font-size: 18px;
    margin: 0 auto;
    padding-top: 30px;
    & .custom-icon-svg {
      fill: var(--color-font-5);
    }
    & .type {
      height: 90px;
      line-height: 90px;
      font-size: 18px;
      color: var(--color-font-5);
      border-radius: 4px;
    }
    & .type.normal {
      background-color: var(--color-low);
    }
    & .type.danger {
      background-color: var(--color-emergency);
    }
  }
}
</style>
