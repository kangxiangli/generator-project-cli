<template>
  <div class="terminal-log">
    <!-- 时间的筛选条件 -->
    <idss-widget :globalStyle="{'padding': '10px 15px 0 15px'}">
      <el-form inline plain label-width="50px">
        <el-form-item>
          <span class="idss-title-filtrate">筛选条件</span>
        </el-form-item>
        <el-form-item label="时间">
          <idss-time-select placement="bottom-start" :time.sync="globalTime"  style="width: 350px;"></idss-time-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="init">查询</el-button>
        </el-form-item>
      </el-form>
    </idss-widget>

    <!-- top20的柱状图 -->
    <idss-widget>
      <template slot="title-left">主机日志量发送Top20</template>
      <idss-bar-chart
        :option="{
          grid: {top: '15px', bottom: '15px', right: '30px', left: '30px'}
        }"
        :data="logSendTop"
        style="height: 200px;"
        v-loading="loading['top20']"></idss-bar-chart>
    </idss-widget>

    <!-- 表格详情 -->
    <idss-widget :footer-style="{padding: '10px'}">
      <el-tabs custom v-model="currentActive" @tab-click="singleValueClick">
        <!-- 服务器监控配置 -->
        <el-tab-pane
          v-for="({name, value}, key) in singleValueData"
          :key="key"
          :name="key"
          :label="`${name}（${value}）`">
          <!-- <span slot="label">服务器监控配置</span> -->
        </el-tab-pane>
      </el-tabs>
      <!-- 表格自己的过滤条件 -->
      <el-form style="padding: 0 15px;" inline plain label-width="70px">
        <el-form-item>
          <span class="idss-title-filtrate">筛选条件</span>
        </el-form-item>
        <el-form-item label="主机IP">
          <el-input placeholder="请输入主机IP" v-model.trim="queryData.ip"></el-input>
        </el-form-item>
        <el-form-item label="采集器IP">
          <el-input placeholder="请输入采集IP器" v-model.trim="queryData.collector"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button custom type="primary" @click="getTableData">查询</el-button>
        </el-form-item>
      </el-form>
      <!-- 表格内容 -->
      <el-table border stripe v-loading="loading['list']" :data="tableData.data">
        <template slot="empty">
          <idss-no-data></idss-no-data>
        </template>
        <el-table-column width="45" align="center" label="序号" type="index"></el-table-column>
        <el-table-column align="center" label="主机IP" prop="ip"></el-table-column>
        <el-table-column align="center" label="对应采集器" prop="collector"></el-table-column>
        <!-- 只有监控中主机数量才有 资产负责人 -->
        <el-table-column
          v-if="currentActive === 'monitorCount'"
          align="center"
          label="资产负责人"
          prop="ownerName"></el-table-column>
        <el-table-column align="center" label="日志发送量" prop="sendedLogCount"></el-table-column>
        <el-table-column align="center" label="日志类型" prop="logType"></el-table-column>
      </el-table>
      <!-- 分页 -->
      <template slot="footer">
        <idss-pagination
          :tableData="tableData"
          @page-change="tableChangeHandle"
          @size-change="tableChangeHandle"></idss-pagination>
      </template>
    </idss-widget>
  </div>
</template>
<script>
import globalMixins from '@/mixins/globalMixins.js'
import Service from './terminal-log-service.js'
export default {
  name: 'manage-monitor-terminal-log',
  mixins: [ globalMixins, Service ],
  data () {
    return {
      // 当前active的单值
      currentActive: 'monitorCount',
      // 单值数据
      singleValueData: {
        monitorCount: {
          name: '监控中主机',
          value: 0
        },
        sendedCount: {
          name: '发现有日志发送主机',
          value: 0
        },
        notSendedCount: {
          name: '监控中未发送日志主机',
          value: 0
        },
        notMonitorCount: {
          name: '监控外发送日志主机',
          value: 0
        }
      },
      // 柱状图数据
      logSendTop: {
        series: []
      },
      // 表格的查询条件
      queryData: {
        collector: '',
        ip: ''
      },
      // 表格数据
      tableData: {
        data: []
      }
    }
  },
  methods: {
    singleValueClick () {
      // 清空表格的查询条件
      this.queryData = {
        ip: '',
        collector: ''
      }
      // 请求列表数据
      this.getTableData()
    },
    tableChangeHandle (params) {
      this.tableChange(params, this.tableData, this.getTableData)
    },
    init () {
      this.getTop20()
      this.getSingleValue()
      this.getTableData()
    }
  },
  created () {
    this.init()
  }
}
</script>
