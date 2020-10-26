<template>
  <div class="collector-container">
    <idss-widget
      :globalStyle="{padding: '15px 15px 0 15px'}"
      v-loading="loading['chart-data-loading']">
      <el-form label-width="60px" inline >
        <el-form-item>
          <span class="idss-title-filtrate">筛选条件</span>
        </el-form-item>
        <el-form-item label="时间">
          <idss-time-select
            :time.sync="globalTime"
            formatter="yyyy-MM-dd"
            style="width: 300px;"></idss-time-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
        </el-form-item>
      </el-form>
    </idss-widget>

    <!--所有采集器总日志量趋势图 start-->
    <idss-widget
      :header-style="{padding: '10px 15px'}"
      :main-style="{padding: '0 10px 10px'}">
      <template slot="title-left">所有采集器总日志量趋势图</template>
      <!-- list header start -->
      <template slot="title-right">
        <button
          class="idss-button"
          size="micro"
          :class="{'is-active': allLogChartsType === 'bar'}"
          @click="allLogChartsType = 'bar'">
          <idss-icon-svg name="bar"></idss-icon-svg>
        </button>
        <button
          class="idss-button"
          size="micro"
          :class="{'is-active': allLogChartsType === 'line'}"
          @click="allLogChartsType = 'line'">
          <idss-icon-svg name="line"></idss-icon-svg>
        </button>
      </template>
      <idss-bar-chart
        :option="{
          grid: {top: '25px', bottom: '30px', right: '30px', left: '30px'},
          legend: {_idssTmpl: 'horizontal'},
          dataZoom: [{show: false}, {show: false, _idssTmpl: 'inside'}],
          yAxis: {
            name: '(单位)',
            nameLocation: 'end',
            nameTextStyle: {color: '#ccd3d9', padding: [0, 0, -8, -30]}
          }
        }"
        stack
        :data="allLogData"
        :style="{height: '200px'}"
        v-loading="loading['all-collector-log-chart']"
        v-show="allLogChartsType === 'bar'"></idss-bar-chart>
      <idss-line-chart
        :option="{
          grid: {top: '25px', bottom: '30px', right: '30px', left: '30px'},
          legend: {_idssTmpl: 'horizontal'},
          dataZoom: [{show: false}, {_idssTmpl: 'inside'}],
          yAxis: {
            name: '(单位)',
            nameLocation: 'end',
            nameTextStyle: {color: '#ccd3d9', padding: [0, 0, -8, -30]}
          }
        }"
        :data="allLogData"
        :style="{height: '200px'}"
        v-loading="loading['all-collector-log-chart']"
        v-show="allLogChartsType === 'line'"></idss-line-chart>
    </idss-widget>
    <!--所有采集器总日志量趋势图  end-->

    <!--采集器信息表格 && 采集器信息图表 start-->
    <idss-widget style="padding: 10px">
      <el-row class="collector-info">
        <el-col :span="4">
          <el-select
            style="width: 100%"
            v-model="collector"
            :popper-append-to-body="false"
            placeholder="请选择采集器"
            @change="changeOption">
            <el-option
              v-for="item in collectors"
              :key="item.worker_ip"
              :label="item.node_tag_name"
              :value="item.worker_ip"></el-option>
          </el-select>
        </el-col>
        <el-col :span="19">
          <p class="collector-select">
            <span>IP：{{ collectorDetailInfo.collectionIp }}</span>
            <span>接收日志：{{ collectorDetailInfo.total }}</span>
            <span>忽略日志：{{ collectorDetailInfo.errorCount }}</span>
            <span>未解析日志：{{ collectorDetailInfo.unknownCount }}</span>
          </p>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <idss-widget
            :main-style="{paddingTop: '10px'}"
            :footer-style="{padding: '10px'}"
            shadow="never">
            <el-table
              ref="collectorMesTable"
              :data="collectorMesTable.data"
              stripe
              border
              :height="254"
              :max-height="254"
              empty-text="暂无数据"
              v-loading="loading['collector-mes-table']">
              <template slot="empty">
                <idss-no-data></idss-no-data>
              </template>
              <el-table-column
                type="index"
                label="序号"
                align="center"
                width="50"></el-table-column>
              <el-table-column
                prop="taskName"
                label="采集任务名称"
                align="center"
                show-overflow-tooltip>
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    size="mini"
                    custom
                    @click="toShowPie(scope.row.id)">
                    {{ scope.row.taskName }}
                  </el-button>
                </template>
              </el-table-column>
              <el-table-column
                prop="count"
                label="处理日志数量"
                align="center"></el-table-column>
              <el-table-column
                prop="strategyCount"
                label="采集策略数"
                align="center"></el-table-column>
              <el-table-column
                prop="activeStrategyCount"
                label="活跃策略数"
                align="center"></el-table-column>
              <el-table-column
                prop="errorCount"
                label="忽略日志数量"
                align="center"></el-table-column>
              <el-table-column
                prop="unknownCount"
                label="未解析日志数量"
                align="center"></el-table-column>
            </el-table>
            <div slot="footer">
              <idss-pagination
                :tableData="collectorMesTable"
                @size-change="collectorMesTableChange"
                @page-change="collectorMesTableChange"></idss-pagination>
            </div>
          </idss-widget>
        </el-col>
        <el-col :span="12">
          <idss-widget shadow="never">
            <idss-pie-detail-chart
              idss-tmpl="default"
              :gradientColor="gradientPieColor"
              :detailStyle="{width: '15%', height: 20}"
              :highlight-index="0"
              :option="chartOption"
              show-rate
              :data="collectorMesChartsData"
              style="height: 234px;"
              v-loading="loading['collector-mes-charts']"></idss-pie-detail-chart>
          </idss-widget>
        </el-col>
      </el-row>
      <!--采集器信息表格 && 采集器信息图表  end-->
    </idss-widget>
  </div>
</template>
<script>
import globalMixins from '@/mixins/globalMixins.js'
import collectorService from './collector-service.js'
export default {
  name: 'manage-monitor-collector',
  mixins: [globalMixins, collectorService],
  data () {
    return {
      allLogChartsType: 'bar',
      collector: '',                     // 采集器下拉框选中
      collectors: [],                    // 采集器下拉框数据
      allLogData: undefined,             // 所有采集器总日志量趋势图
      collectorMesTable: {},             // 采集任务表格
      collectorMesChartsData: undefined, // 采集任务饼图
      collectorDetailInfo: {},          // 采集器详细信息
      gradientPieColor: [               // 富文本饼图渐变色
        ['#829CF8', '#abbcf5'],
        ['#C39EE8', '#b1bded'],
        ['#94D6F7', '#bfe1f6'],
        ['#C3C092', '#d3d2ba'],
        ['#DF9C9B', '#e2bcba'],
        ['#A77CE0', '#beabe2'],
        ['#85A5FF', '#b3c3f1'],
        ['#69C0FF', '#a7d3f8'],
        ['#81C0CB', '#b4d1d7'],
        ['#AF91D0', '#c4b5da'],
        ['#91D5FF', '#bce0fe'],
        ['#4A90E2', '#8eb3e5'],
        ['#9CB6B6', '#bdcdcc'],
        ['#75B3F0', '#a9caf0'],
        ['#ADC6FF', '#c9d6f8']
      ]
    }
  },
  methods: {
    /**
     * 初始化数据
     */
    async init () {
      await this.getCollectorSel()                                         // 获取采集器下拉框数据
      this.getAllCollectorLog()                                            // 所有采集器总日志量趋势图
      await this.getCollectorMesTableData()                                // 采集器信息（表格）
      this.getCollectorMesChartsData(this.collectorMesTable.data[0].id)    // 采集器信息（饼图）
      this.getCollectorDetailInfo(this.collector)                          // 采集器信息
    },
    /**
     * 查询
     */
    search () {
      this.init()
    },
    /**
     * 采集器信息表格分页
     */
    collectorMesTableChange (params) {
      this.tableChange(params, this.collectorMesTable, this.getCollectorMesTableData)
    },
    /**
     * 采集任务名称
    */
    toShowPie (id) {
      this.getCollectorMesChartsData(id)
    },
    /**
     * 采集器下拉框
    */
    changeOption () {
      this.getCollectorDetailInfo(this.collector)                          // 采集器信息
      this.getCollectorMesTableData()                                      // 采集器信息（表格）
      this.getCollectorMesChartsData(this.collectorMesTable.data[0].id)    // 采集器信息（饼图）
    }
  },
  beforeCreate () {
    this.chartOption = {
      title: {
        left: '40%',
        textStyle: {
          rich: {
            text: {
              padding: [0, 10, 0, 30],
              width: 55,
              align: 'center'
            }
          }
        }
      },
      series: [{
        radius: ['40%', '55%'],
        center: ['25%', '50%'],
        label: {
          normal: {
            customFormatter (item) {
              return [
                `{title|${item.name}}`,
                `{rate|${item.rate}} {detailValue|${item.detailValue}}`
              ].join('\n')
            },
            textStyle: {
              rich: {
                title: {
                  fontSize: 14,
                  lineHeight: 20
                },
                detailValue: {
                  fontSize: 20,
                  lineHeight: 30,
                  padding: [0, 0, 0, -5]
                },
                rate: {
                  fontSize: 12,
                  lineHeight: 30
                }
              }
            }
          }
        },
        hoverOffset: 5
      }]
    }
  },
  created () {
    this.init()
  }
}
</script>
<style lang="postcss" scoped>
.collector-container {
  & .collector-info {
    border-bottom: 1px dashed #EBEEF5;
    padding-bottom: 10px;
    & .collector-select {
      line-height: 32px;
      margin-left: 10px;
      span {
        margin-right: 30px;
      }
    }
  }
}
</style>
