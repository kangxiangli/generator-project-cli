<template>
  <div class="manage-monitor-setting-container">
    <!-- 监控配置 -->
    <idss-widget>
      <el-tabs custom v-model="current" @tab-click="handleClick">
        <!-- 服务器监控配置 -->
        <el-tab-pane name="service-monitor">
          <span slot="label">服务器监控配置</span>
          <service-monitor ref="service-monitor" v-if="current === 'service-monitor'"></service-monitor>
        </el-tab-pane>
        <!-- 平台组件监控配置 -->
        <el-tab-pane name="platform-monitor">
          <span slot="label">平台组件监控配置</span>
          <platform-monitor ref="platform-monitor" v-if="current === 'platform-monitor'"></platform-monitor>
        </el-tab-pane>
        <!-- 数据质量监控配置 -->
        <el-tab-pane name="data-monitor">
          <span slot="label">数据质量监控配置</span>
          <data-monitor ref="data-monitor" v-if="current === 'data-monitor'"></data-monitor>
        </el-tab-pane>
        <!-- 客户终端监控配置 -->
        <el-tab-pane name="client-monitor">
          <span slot="label">客户终端监控配置</span>
          <client-monitor ref="client-monitor" v-if="current === 'client-monitor'"></client-monitor>
        </el-tab-pane>
      </el-tabs>
    </idss-widget>
  </div>
</template>
<script>
import globalMixins from '@/mixins/globalMixins.js'
import dataMonitor from '@/views/manage/monitor/setting-components/data-monitor'
import platformMonitor from '@/views/manage/monitor/setting-components/platform-monitor'
import serviceMonitor from '@/views/manage/monitor/setting-components/service-monitor'
import clientMonitor from '@/views/manage/monitor/setting-components/client-monitor'

export default {
  name: 'manage-monitor-setting',
  mixins: [globalMixins],
  data () {
    return {
      current: 'service-monitor'
    }
  },
  methods: {
    // tabs 按需加载
    handleClick (tab) {
      this.$nextTick(_ => {
        this.$refs[tab.name].init()
      })
    }
  },
  mounted () {
    // 页面加载完默认渲染一次
    this.$refs[this.current].init()
  },
  components: {
    dataMonitor,
    platformMonitor,
    serviceMonitor,
    clientMonitor
  }
}
</script>
