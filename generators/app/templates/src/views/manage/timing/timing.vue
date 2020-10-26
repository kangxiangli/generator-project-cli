<template>
  <div class="idss-timing">
    <!-- 趋势分析 start -->
    <idss-widget padding="0">
      <idss-widget-tool slot="tool" padding="10px" title>{{targetType['trend-analysis']}}</idss-widget-tool>
      <!-- tbale -->
      <template slot="title-left">
        趋势分析
      </template>
      <el-table
        :data="trendAnalysisData"
        style="width: 100%"
        border
        v-loading="loading['trend-analysis']" :row-style="{height: '100px'}">
        <el-table-column
          prop="taskName"
          label="任务名称"
          align="center">
        </el-table-column>
        <el-table-column
          prop="finshDatetime"
          label="上一次执行完成时间"
          align="center">
          <template slot-scope="scope">
            <template v-if="scope.row.finshDatetime">
              {{scope.row.finshDatetime|formatDate('M月dd日 hh:mm')}}
            </template>
            <template v-else>-</template>
          </template>
        </el-table-column>
        <el-table-column
          label="上一次执行时长"
          align="center">
          <template slot-scope="scope">
            <template v-if="scope.row.runTime && scope.row.runTime !== '0'">
              {{scope.row.runTime|formatTime}}
            </template>
            <template v-else>-</template>
          </template>
        </el-table-column>
        <el-table-column
          label="下次执行时间"
          align="center">
          <template slot-scope="scope">
            <template v-if="scope.row.lastDatetime">
              {{scope.row.lastDatetime|formatDate('M月dd日 hh:mm')}}
            </template>
            <template v-else>-</template>
          </template>
        </el-table-column>
        <el-table-column
          prop="n5"
          label="当前设置参数"
          align="center">
          <template slot-scope="scope">
            <div class="idss-txt--left" v-if="scope.row.cronRule && scope.row.cronRule.model">
              <p>执行周期：<span class="modelsquare">{{scope.row.cronRule.startDate}}</span>天</p>
              <p>开始时间：<span class="modelsquare">{{timeToCn(scope.row.cronRule.time)}}</span></p>
            </div>
            <template v-else>
              -
            </template>
          </template>
        </el-table-column>
        <el-table-column
          label="任务状态"
          align="center">
          <template slot-scope="scope">
            <span :class="'idss-timing_'+statusType[scope.row.taskStatus].class">
              {{statusType[scope.row.taskStatus].name}}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="n7"
          label="任务控制"
          align="center">
          <template slot-scope="scope">
            <button class="idss-button-text" @click="excuteTaskStatus(scope.row.id, '1', scope.$index, 'trendAnalysisData')">
              <idss-icon-svg name="start"></idss-icon-svg>
            </button>
            <button class="idss-button-text" @click="excuteTaskStatus(scope.row.id, '0', scope.$index, 'trendAnalysisData')">
              <idss-icon-svg name="pause"></idss-icon-svg>
            </button>
            <button class="idss-button-text" @click="immediateRunTask(scope.row.id, scope.$index, 'trendAnalysisData')">
              <idss-icon-svg name="start-execute"></idss-icon-svg>
            </button>
            <button class="idss-button-text" @click="excuteTaskStatus(scope.row.id, '2', scope.$index, 'trendAnalysisData')">
              <idss-icon-svg name="stop"></idss-icon-svg>
            </button>
          </template>
        </el-table-column>
      </el-table>
    </idss-widget>
    <!-- 趋势分析 end -->
    <!-- 内部未知资产发现周期配置 start -->
    <idss-widget padding="0">
      <idss-widget-tool slot="tool" padding="10px" title>{{targetType['internal-assets']}}</idss-widget-tool>
      <template slot="title-left">
        内部未知资产发现周期配置
      </template>
      <!-- tbale -->
      <el-table
        :data="internalAssetsData"
        style="width: 100%"
        v-loading="loading['internal-assets']"
        border>
        <el-table-column
          prop="taskName"
          label="任务名称"
          align="center">
        </el-table-column>
        <el-table-column
          prop="finshDatetime"
          label="上一次执行完成时间"
          align="center">
          <template slot-scope="scope">
            <template v-if="scope.row.finshDatetime">
              {{scope.row.finshDatetime|formatDate('M月dd日 hh:mm')}}
            </template>
            <template v-else>-</template>
          </template>
        </el-table-column>
        <el-table-column
          label="上一次执行时长"
          align="center">
          <template slot-scope="scope">
            <template v-if="scope.row.runTime && scope.row.runTime !== '0'">
              {{scope.row.runTime|formatTime}}
            </template>
            <template v-else>-</template>
          </template>
        </el-table-column>
        <el-table-column
          label="下次执行时间"
          align="center">
          <template slot-scope="scope">
            <template v-if="scope.row.lastDatetime">
              {{scope.row.lastDatetime|formatDate('M月dd日 hh:mm')}}
            </template>
            <template v-else>-</template>
          </template>
        </el-table-column>
        <el-table-column
          prop="n5"
          label="当前设置参数"
          align="center">
          <template slot-scope="scope">
            <div class="idss-txt--left" v-if="scope.row.cronRule && scope.row.cronRule.model">
              <p>执行周期：{{scope.row.cronRule.startDate}}天</p>
              <p>执行时间：{{timeToCn(scope.row.cronRule.time)}}</p>
            </div>
            <template v-else>
              -
            </template>
          </template>
        </el-table-column>
        <el-table-column
          label="任务状态"
          align="center">
          <template slot-scope="scope">
            <span :class="'idss-timing_'+statusType[scope.row.taskStatus].class">
              {{statusType[scope.row.taskStatus].name}}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="n7"
          label="任务控制"
          align="center">
          <template slot-scope="scope">
            <button class="idss-button-text" @click="editCron(scope.row.id, scope.row.taskName, 'internal-assets')">
              <idss-icon-svg name="bianji"></idss-icon-svg>
            </button>
          </template>
        </el-table-column>
      </el-table>
    </idss-widget>
    <!-- 内部未知资产发现周期配置 end -->

    <!-- 外部资产监控周期配置 start -->
    <!-- <idss-widget padding="0">
      <idss-widget-tool slot="tool" padding="10px" title>{{targetType.externalAssets}}</idss-widget-tool>
      <el-table
        :data="externalAssetsData"
        style="width: 100%"
        v-loading="loading['externalAssets']"
        border>
        <el-table-column
          prop="taskName"
          label="任务名称"
          align="center">
        </el-table-column>
        <el-table-column
          prop="finshDatetime"
          label="上一次执行完成时间"
          align="center">
        </el-table-column>
        <el-table-column
          prop="runTime"
          label="上一次执行时长"
          align="center">
        </el-table-column>
        <el-table-column
          prop="lastDatetime"
          label="下次执行时间"
          align="center">
        </el-table-column>
        <el-table-column
          prop="n5"
          label="当前设置参数"

          align="center">
          <template slot-scope="scope">
            <div>
              <p>执行周期：{{ scope.row.n5 }}</p>
              <p>开始时间：{{ scope.row.n5 }}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="n7"
          label="任务控制"
          align="center">
          <template slot-scope="scope">
            <button class="idss-button-text">
              <idss-icon-svg name="start"></idss-icon-svg>
            </button>
            <button class="idss-button-text">
              <idss-icon-svg name="stop"></idss-icon-svg>
            </button>
            <button class="idss-button-text"  @click="editCron(scope.row.id, scope.row.taskName, scope.row.taskGroupCode)">
              <idss-icon-svg name="bianji"></idss-icon-svg>
            </button>
          </template>
        </el-table-column>
      </el-table>
    </idss-widget> -->
    <!-- 外部资产监控周期配置 end -->

    <!-- 安全威胁情报分析周期配置 start -->
    <idss-widget padding="0">
      <idss-widget-tool slot="tool" padding="10px" title>{{targetType.ti}}</idss-widget-tool>
      <template slot="title-left">
        安全威胁情报分析周期配置
      </template>
      <!-- tbale -->
      <el-table
        :data="securityThreatData"
        style="width: 100%"
        v-loading="loading['ti']"
        border>
        <el-table-column
          prop="taskName"
          label="任务名称"
          align="center">
        </el-table-column>
        <el-table-column
          prop="finshDatetime"
          label="上一次执行完成时间"
          align="center">
          <template slot-scope="scope">
            <template v-if="scope.row.finshDatetime">
              {{scope.row.finshDatetime|formatDate('M月dd日 hh:mm')}}
            </template>
            <template v-else>-</template>
          </template>
        </el-table-column>
        <el-table-column
          label="上一次执行时长"
          align="center">
          <template slot-scope="scope">
            <template v-if="scope.row.runTime && scope.row.runTime !== '0'">
              {{scope.row.runTime|formatTime}}
            </template>
            <template v-else>-</template>
          </template>
        </el-table-column>
        <el-table-column
          label="下次执行时间"
          align="center">
          <template slot-scope="scope">
            <template v-if="scope.row.lastDatetime">
              {{scope.row.lastDatetime|formatDate('M月dd日 hh:mm')}}
            </template>
            <template v-else>-</template>
          </template>
        </el-table-column>
        <el-table-column
          prop="n5"
          label="当前设置参数"
          align="center">
          <template slot-scope="scope">
            <div class="idss-txt--left" v-if="scope.row.cronRule && scope.row.cronRule.model">
              <p>首次执行日期：{{scope.row.cronRule.startDate}}</p>
              <p>执行时间：{{timeToCn(scope.row.cronRule.time)}}</p>
              <p v-if="scope.row.cronRule.model === 'single'">单次执行</p>
              <p v-else-if="scope.row.cronRule.model === 'interval'">间隔时间执行：{{minuteToDays(scope.row.cronRule.interval)}}</p>
              <p v-else>
                执行周期：
                <span v-if="scope.row.cronRule.everyday">每天</span>
                <span v-else>
                  {{weeksToCn(scope.row.cronRule.weekDay)}}
                  {{monthDaysToCn(scope.row.cronRule.monthDay)}}
                  {{yearDaysTocn(scope.row.cronRule.yearDay)}}
                </span>
              </p>
            </div>
            <template v-else>
              -
            </template>
          </template>
        </el-table-column>
        <el-table-column
          label="任务状态"
          align="center">
          <template slot-scope="scope">
            <span :class="'idss-timing_'+statusType[scope.row.taskStatus].class">
              {{statusType[scope.row.taskStatus].name}}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="n7"
          label="任务控制"
          align="center">
          <template slot-scope="scope">
            <button class="idss-button-text"
              v-if="scope.row.taskStatus !== '1'"
              @click="excuteTaskStatus(scope.row.id, '1', scope.$index, 'securityThreatData')">
              <idss-icon-svg name="start"></idss-icon-svg>
            </button>
            <button class="idss-button-text" v-else @click="excuteTaskStatus(scope.row.id, '0', scope.$index, 'securityThreatData')">
              <idss-icon-svg name="stop"></idss-icon-svg>
            </button>
            <button class="idss-button-text"  @click="editCron(scope.row.id, scope.row.taskName, 'ti')">
              <idss-icon-svg name="bianji"></idss-icon-svg>
            </button>
          </template>
        </el-table-column>
      </el-table>
    </idss-widget>
    <!-- 安全威胁情报分析周期配置 end -->

    <!-- 弹框 -->
    <timeDialog
      :title="dialogTitle"
      :editId="editId"
      :editTaskType="editTaskType"
      :isShow="isShowDialog"
      @closeDialog="isShowDialog = false"
      @save="handleSave">
    </timeDialog>

  </div>
</template>

<script>
import globalMixins from '@/mixins/globalMixins.js'
import service from './timing-service.js'
import timeDialog from './components/time-dialog.vue'
import cronPickerService from '@/custom/cron-picker-service.js'
import { debounce } from 'fusion-utils'
export default {
  name: 'manage-timing',
  mixins: [globalMixins, service, cronPickerService],
  components: {
    timeDialog
  },
  data () {
    return {
      dialogTitle: '', // 弹框title
      isShowDialog: false, // 是否展示任务弹框
      editTaskType: '', // 编辑任务类型
      editId: '', // 编辑任务Id
      trendAnalysisData: [], // 趋势分析任务
      internalAssetsData: [], // 内部未知资产发现周期配置
      // externalAssetsData: [], // 外部资产监控周期配置
      securityThreatData: [] // 安全威胁情报分析周期配置
    }
  },
  methods: {
    // 页面初始化方法
    init () {
      // 获取所有任务列表
      this.getAllTaskList()
    },

    /**
       * 触发编辑定时任务弹框
       * @param {string} id
       * @param {string} type
       * @param {string} taskName
       * @param {string} taskType 任务组类型 trend-analysis/nternal-assets/ti
       */
    editCron (id, taskName, taskType) {
      this.editId = id
      this.editTaskType = taskType
      this.dialogTitle = `${taskName}配置`
      this.isShowDialog = true
    },

    /**
       * 定时任务弹框保存触发事件
       * trend-analysis: '趋势分析'
       * internal-assets: '内部未知资产发现周期配置'
       * externalAssets: '外部资产监控周期配置'
       * ti: '安全威胁情报分析周期配置'
       */
    async handleSave () {
      // gropcode和 data中数据对象对应
      const dataType = {
        'trend-analysis': 'trendAnalysisData',
        'internal-assets': 'internalAssetsData',
        'ti': 'securityThreatData'
      }
      this.isShowDialog = false
      const data = await this.getCronData(this.editTaskType)
      // 刷新当前操作taskgroup
      this.$set(this, dataType[this.editTaskType], data)
    },

    /**
       * 修改task任务状态
       * @param {string} id taskid
       * @param {string} taskStatus 0中止1启用2暂停
       * @param {number} index
       * @param {string} dataType
       */
    excuteTaskStatus: debounce(async function (id, taskStatus, index, dataType) {
      try {
        const data = await this.updateTaskStatus({
          id,
          taskStatus
        })
        // 更新状态
        Object.assign(this[dataType][index], data)
        this.showMessage('更新状态成功')
      } catch (err) {
        this.showMessage(err.message, 'error')
      }
    }, 300),
    /**
       * 立即执行task
       * @param {string} id taskid
       * @param {number} index
       * @param {string} dataType
       */
    immediateRunTask: debounce(async function (id, index, dataType) {
      try {
        const data = await this.runTask(id)
        // 更新状态
        Object.assign(this[dataType][index], data)
        this.showMessage('立即执行成功')
      } catch (err) {
        this.showMessage(err.message, 'error')
      }
    }, 300)
  },
  async created () {
    // 定时任务类型
    this.targetType = {
      'trend-analysis': '趋势分析',
      'internal-assets': '内部未知资产发现周期配置',
      // 'external-assets': '外部资产监控周期配置',
      'ti': '安全威胁情报分析周期配置'
    }
    // 任务状态
    this.statusType = {
      '0': {
        name: '已暂停',
        class: 'stop'
      },
      '1': {
        name: '待执行',
        class: 'waiting'
      },
      '2': {
        name: ' 执行中',
        class: 'running'
      },
      '3': {
        name: '运行完成',
        class: 'success'
      }
    }
    // 初始化
    await this.init()
  }
}
</script>

<style scoped lang="postcss">
  .idss-timing {
    /* @fixme待优化 */
    --color-success: #66ccff; /* 成功状态的颜色 */
    --color-warning: #e6a23c; /* 告警状态的颜色 */
    --color-error: #f56c6c; /* 失败状态的颜色 */
    --color-info: #909399;
    .modelsquare {
      border: 1px solid #cccccc;
      padding: 5px 10px;
      margin-top: 5px;
      margin-right: 5px;
    }
    >>> .el-table .cell, .el-table th div {
      overflow: visible;
    }
    &_waiting {
      font-weight: 400;
      color: #ff0000;
    }
    &_stop {
      font-weight: 400;
      color: var(--color-warning);
    }

    &_success {
      font-weight: 400;
      color: var(--color-success);
    }

    &_running {
      font-weight: 400;
      color: var(--color-medium);
    }
  }

</style>
