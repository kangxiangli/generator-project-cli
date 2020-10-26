<template>
  <div class="manage-monitor-quality-container">
    <idss-widget :globalStyle="{'padding': '15px 15px 0 15px'}">
      <!-- 手工搜索 -->
      <el-form inline>
        <el-form-item>
          <span class="idss-title-filtrate">筛选条件</span>
        </el-form-item>
        <el-form-item label="提取器名称"
          label-width="80px">
          <el-select style="width: 400px;"
            v-model="selectCurrent"
            multiple
            collapse-tags
            placeholder="请选择">
            <el-option v-for="item in selectList"
              :key="item.key"
              :label="item.name"
              :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            @click="search"
            type="primary">查询</el-button>
        </el-form-item>
      </el-form>
    </idss-widget>
    <idss-widget :globalStyle="{'padding': '10px 0 10px 10px'}">
      <el-row v-if="Array.isArray(chartData.data) && chartData.data.length"
        class="extractor-row"
        v-loading="loading['chart-data-loading']">
        <el-col :span="8"
          v-for="(item, index) in chartData.data"
          :key="index">
          <idss-widget class="custom-widget"
            shadow="never">
            <template slot="title-left">
              <idss-tooltip placement="top"
                :over-width-display="true"
                :content="`${item.jobName}提取器（总数：${item.totalCount}）`">
                <div class="idss-text-overflow">{{`${item.jobName}提取器（${item.totalCount}）`}}</div>
              </idss-tooltip>
            </template>
            <el-row>
              <el-col :span="24">
                <div>
                  <!-- 饼图 -->
                  <idss-pie-detail-chart :ref="'pie' + index"
                    idss-tmpl="default"
                    :gradientColor="[['#c3c092', '#df9c9c']]"
                    show-rate
                    :highlight-index="0"
                    :detail-style="{width: '40%', height: 30}"
                    :option="pieDetailChartConfig"
                    :data="formatterChartData(item.dataInfo)"
                    style="height: 180px;"
                    v-loading="loading['single']">
                  </idss-pie-detail-chart>
                  <div class="time-line">时间: {{ item.startTime }} - {{ item.endTime }}</div>
                </div>
              </el-col>
            </el-row>
          </idss-widget>
        </el-col>
      </el-row>
      <idss-no-data v-else></idss-no-data>
      <!-- 分页 - 前端分页 -->
      <template slot="footer">
        <idss-pagination :pageSizes="[3,10,20,50,100]"
          :tableData="chartData"
          @size-change="handleTableChange"
          @page-change="handleTableChange"></idss-pagination>
      </template>
    </idss-widget>
    <idss-widget>
      <p class="hint">
        <em>*</em> 日志某段时间内的数据量趋势图及日志数据量的TopN，在大盘页面展示。
      </p>
    </idss-widget>
  </div>
</template>
<script>
import globalMixins from '@/mixins/globalMixins.js'
import service from '@/views/manage/monitor/quality-service.js'
import { data2DetailPie } from 'fusion-charts/lib/data-factory'

export default {
  name: 'manage-monitor-quality',
  mixins: [globalMixins, service],
  data () {
    return {
      selectList: [],  // 提取器名称下拉框数据
      selectCurrent: [],  // 提取器名称下拉框默认展示
      // 字典
      dictionary: {
        'total': { display: '采集总量', color: '' },
        'match': { display: '匹配量', color: '' },
        'normal': { display: '落地量', color: '' },  // match 子
        'filter': { display: '过滤量', color: '' },  // match 子
        'failure': { display: '失败量', color: '' },
        'other': { display: '其他', color: '' }
      },
      chartData: {
        pageSize: 6
      }
    }
  },
  methods: {
    // 修改分页数量
    handleTableChange (params) {
      this.tableChange(params, this.chartData, this.getChartData)
    },
    /**
     * 图表数据格式化处理
     * @return [{key: '测试',value: 1, name: '测试', children: []}] => [{key: '', name: '', value: [{key: '测试', name: '测试',value: 1}]}]
     */
    formatterChartData (data) {
      let copyData = JSON.parse(JSON.stringify(data))
      let total = 0
      let newData = copyData.reduce((prev, current) => {
        let obj = {
          key: '',
          name: '',
          value: []
        }
        obj.key = current.key
        // 英文转换成中文
        obj.name = (this.dictionary[current.name] || {}).display
        if (Array.isArray(current.children) && current.children.length) {
          current.children.forEach(subItem => {
            subItem.name = (this.dictionary[subItem.name] || {}).display
            total += subItem.value
          })
          obj.value = current.children
        } else {
          total += current.value
          obj.value = current.value
        }
        prev.push(obj)
        return prev
      }, [])
      return data2DetailPie(newData, undefined, total) // @fixme：后期饼图组件优化传参后，可能会改成对象传参。
    },
    // 查询
    search () {
      this.tableChange({ type: 'submit' }, this.chartData, this.getChartData)
    },
    async init () {
      // 获取提取器名称下拉框数据
      await this.getSelList()
      // 获取图表列表数据
      this.getChartData()
    }
  },
  mounted () {
    this.init()
  },
  beforeCreate () {
    this.pieDetailChartConfig = {
      series: [
        {
          center: ['25%', '50%'],
          label: {
            normal: {
              // 继承formatter返回的格式，如需在该魔板上自定义，使用customFormatter。如果定义formatter直接覆盖式设置formatter
              customFormatter (item) {
                return ''
              }
            }
          }
        }
      ]
    }
  }
}
</script>
<style lang="postcss" scoped>
.manage-monitor-quality-container {
  & .custom-widget {
    border: 1px solid #dcdfe6;
  }
  & .time-line {
    color: var(--color-primary);
    font-weight: 400;
    font-size: var(--font-size-4);
    padding-bottom: 6px;
    padding-left: 15px;
  }

  & p {
    line-height: 42px;
    padding-left: 12px;
    font-size: var(--font-size-4);
    em {
      color: #ff0000;
    }
  }
}
</style>
