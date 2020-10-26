<template>
  <div id="dataTask">
    <idss-widget
      shadow="never"
      style="margin: 0;"
      :header-style="{padding: '0 15px 15px'}"
      class="idss-widget-padding">
      <!-- 按钮操作 -->
      <template slot="title-left">
        <el-button size="mini" plain type="primary"
          :disabled="checkSelection.length < 1"
          @click="disableTaskOperate">
          <idss-icon-svg name="off"></idss-icon-svg>
          批量关闭
        </el-button>
        <el-button size="mini" plain type="primary"
          :disabled="checkSelection.length < 1"
          @click="startTaskOperate">
          <idss-icon-svg name="start"></idss-icon-svg>
          批量开启
        </el-button>
        <el-button size="mini" plain type="primary"
          :disabled="checkSelection.length < 1"
          @click="batchChangeTaskControl">
          <idss-icon-svg name="clocks"></idss-icon-svg>
          批量调度
        </el-button>
        <el-button size="mini" plain type="danger"
          :disabled="checkSelection.length < 1"
          @click="delTask">
          <idss-icon-svg name="delete-hover"></idss-icon-svg>
          删除
        </el-button>
      </template>
      <template slot="title-right">
        <el-button size="mini" plain
          @click="addTask">
          <idss-icon-svg name="add"></idss-icon-svg>
          新增任务
        </el-button>
      </template>

      <!-- 任务表格 -->
      <el-table
        border
        stripe
        class="taskTable"
        v-loading="loading['task-search-list']"
        :data="tableData.data"
        :row-key="getRowKeys"
        @selection-change="handleSelectionChange">
        <template slot="empty">
          <idss-no-data></idss-no-data>
        </template>
        <el-table-column
          type="selection"
          align="center"
          width="40">
        </el-table-column>
        <el-table-column
          type="expand"
          prop="children"
          width="40">
          <template slot-scope="scope">
            <el-collapse
              v-model="scope.row.activeCollapse"
              @change="manualCollapseTask($event, scope)"
              align="left">
              <!-- 输入配置 -->
              <el-collapse-item title="输入设置" name="1">
                <data-input-config
                  v-if="scope.row.activeCollapse && scope.row.activeCollapse.includes('1')"
                  :data="{deptInfo: deptInfo, taskInfo: scope.row}"></data-input-config>
              </el-collapse-item>

              <!-- 提取器配置 -->
              <el-collapse-item v-if="scope.row.isExtractRule==='1'" title="提取器设置" name="2">
                <extractor-config
                  v-if="scope.row.activeCollapse && scope.row.activeCollapse.includes('2')"
                  :data="{deptInfo: deptInfo, taskInfo: scope.row}"></extractor-config>
              </el-collapse-item>

              <!-- 输出配置: 只有主部门有输出设置 -->
              <el-collapse-item v-if="deptInfo.level === 'master'" title="输出设置" name="3">
                <data-output-config
                  v-if="scope.row.activeCollapse && scope.row.activeCollapse.includes('3')"
                  :data="{deptInfo: deptInfo, taskInfo: scope.row}"></data-output-config>
              </el-collapse-item>
            </el-collapse>
          </template>
        </el-table-column>
        <el-table-column
          type="index"
          label="序号"
          align="center"
          width="50">
        </el-table-column>
        <el-table-column
          prop="jobDescription"
          align="center"
          label="任务描述"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="jobSerialNumber"
          align="center"
          label="任务ID"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          align="center"
          label="任务状态"
          show-overflow-tooltip width="130">
          <template slot-scope="scope">
            <p class="t_time">采集: {{scope.row.collectState}}</p>
            <p class="t_time">输出: {{scope.row.outputState}}</p>
          </template>
        </el-table-column>
        <el-table-column align="center" label="时间" show-overflow-tooltip width="220">
          <template slot-scope="scope">
            <p class="t_time">创建时间: {{scope.row.createTime}}</p>
            <p class="t_time">更新时间: {{scope.row.updateTime?scope.row.updateTime: '-'}}</p>
          </template>
        </el-table-column>
        <el-table-column align="center" label="调度信息" show-overflow-tooltip width="160">
          <template slot-scope="scope">
            <p
              class="t_time">开始时间: {{scope.row.scheduledStartTime?scope.row.scheduledStartTime: '-'}}</p>
            <p class="t_time">结束时间: {{scope.row.scheduledEndTime?scope.row.scheduledEndTime: '-'}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="status" align="center" label="开关" width="120">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.jobStatus"
              :active-value="1"
              :inactive-value="0"
              @change="statusChangeByOne($event, scope.$index, scope.row)"
              :disabled="disableList[scope.$index]"></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="timerConf" align="center" label="调度" width="70">
          <template slot-scope="scope">
            <el-button
              @click="manualChangeControl(scope.row)"
              type="text"
              size="small"
              class="timeDo">
              <svg
                class="icon"
                :class="{'is-active': scope.row.timerStatus === 'open'}"
                aria-hidden="true">
                <use xlink:href="#icon-history-data" />
              </svg>
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <idss-pagination
        style="padding: 10px;"
        :tableData="tableData"
        @size-change="taskTableChange"
        @page-change="taskTableChange"></idss-pagination>
    </idss-widget>

    <!-- 任务调度 - 弹窗 -->
    <el-dialog
      title="任务调度"
      :visible.sync="taskControlDialogVisiable"
      @closed="taskControlClose"
      width="400px"
      custom>
      <el-form ref="taskSetForm" :model="taskSetForm" :rules="timeRules"
        size="small"
        label-width="100px">
        <el-form-item label="开始时间:" prop="startTime">
          <el-time-picker
            v-model="taskSetForm.startTime"
            placeholder="选择开始时间"
            value-format="HH:mm:ss"></el-time-picker>
        </el-form-item>
        <el-form-item label="结束时间:" prop="endTime">
          <el-time-picker
            v-model="taskSetForm.endTime"
            placeholder="选择结束时间"
            value-format="HH:mm:ss"></el-time-picker>
        </el-form-item>
        <el-form-item label="周期配置:" prop="day">
          <el-checkbox v-model="taskSetForm.day" :true-label="1" :false-label="0" disabled>天</el-checkbox>
        </el-form-item>
        <el-form-item label="开关:" prop="timerStatus">
          <el-switch v-model="taskSetForm.timerStatus" active-value="open" inactive-value="close"></el-switch>
        </el-form-item>
        <div style="text-align: center;">
          <el-button @click="saveTaskControl" size="small" type="primary">保存</el-button>
          <el-button @click="taskControlClose" size="small">取消</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import globalMixins from '@/mixins/globalMixins.js'
import service from './data-task-service.js'
import dataInputConfig from './data-input-config.vue'
import dataOutputConfig from './data-output-config.vue'
import extractorConfig from './extractor-config.vue'

export default {
  name: 'dataTask',
  mixins: [globalMixins, service],
  components: {
    dataInputConfig,
    dataOutputConfig,
    extractorConfig
  },
  props: {
    // 部门信息
    deptInfo: {
      type: Object,
      default () {
        return {
          uid: '',
          level: ''
        }
      }
    },
    // 请求参数
    requestParams: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      tableData: {},
      checkSelection: [],

      taskControlDialogVisiable: false,
      taskSetForm: {
        jobSerialNumber: '',
        day: 1,
        startTime: '',
        endTime: '',
        timerStatus: ''
      },
      timeRules: {
        startTime: [
          { required: true, message: '请选择任务开始时间', trigger: 'blur' }
        ],
        endTime: [
          { required: true, message: '请选择任务结束时间', trigger: 'blur' },
          { validator: this.checkTime, trigger: 'blur' }
        ]
      },
      disableList: []
    }
  },
  methods: {
    // 时间验证
    checkTime (rule, value, callback) {
      if (this.taskSetForm['startTime'] >= this.taskSetForm['endTime']) {
        return callback(new Error('结束时间必须大于开始时间'))
      } else {
        callback()
      }
    },

    // 获取row的key值
    getRowKeys (row) {
      return row.jobSerialNumber
    },

    // 选中项发生改变时触发
    handleSelectionChange (selection) {
      this.checkSelection = selection
    },

    /**
     * 单个编辑任务调度
     * FIXME: 是否支持批量修改调度
     */
    manualChangeControl (row) {
      this.taskSetForm['endTime'] = row.scheduledEndTime
      this.taskSetForm['startTime'] = row.scheduledStartTime
      this.taskSetForm['timerStatus'] = row.timerStatus
      this.taskSetForm['jobSerialNumber'] = row.jobSerialNumber
      this.taskControlDialogVisiable = true
    },

    /**
     * 批量编辑任务调度
     * FIXME: 是否支持批量修改调度
     */
    batchChangeTaskControl () {
      if (this.checkSelection.length === 0) {
        this.showMessage('请选择要调度的任务!', 'warning')
      } else {
        this.taskSetForm.jobSerialNumber = this.checkSelection.map(item => item.jobSerialNumber).join(',')
        this.taskControlDialogVisiable = true
      }
    },

    /**
     * 关闭调度任务弹窗
     */
    taskControlClose () {
      this.$refs['taskSetForm'].resetFields()
      this.taskControlDialogVisiable = false
    },

    /**
     * 新增任务
     */
    addTask () {
      this.$router.push({
        name: 'manage-data-server',
        query: { uid: this.deptInfo.uid }
      })
    },

    /**
     * 删除任务 FIXME: 是否支持批量删除
     */
    delTask () {
      if (this.checkSelection.length === 0) {
        this.showMessage('没有选择删除数据', 'waring', {
          showClose: true
        })
      } else {
        this.deleteConfirm()
      }
    },

    /**
     * 确认删除提示
     */
    deleteConfirm () {
      if (this.checkSelection.length > 1) {
        this.showMessage('任务只能逐个删除。', 'warning')
      } else {
        this.$confirm('此操作将永久删除已选项, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deletetask()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      }
    },

    /**
     * 任务表格改变
     */
    taskTableChange (params) {
      this.tableChange(params, this.tableData, this.getTableData)
    },

    /**
     * 任务数据展开
     * @params {Array} activeCollapseNames
     * @params {}
     */
    manualCollapseTask (activeCollapseNames, scope) {
      let { $index } = scope
      this.$set(this.tableData.data[$index], 'activeCollapse', activeCollapseNames)
    }
  },
  mounted () {
    this.getTableData()
  }
}
</script>

<style scope lang="postcss">
.t_time {
  text-align: left;
}
/* 调度图标 */
.timeDo svg {
  width: 30px;
  height: 30px;
  fill: var(--idss-manage-taskTable-row-svg-color);
  &.is-active {
    fill: #5d87dd;
  }
}
.taskTable .el-table__body .expanded:nth-child(3n-1) {
  background: var(--idss-manage-taskTable-row-blue-color)
}
.taskTable .el-table__body .expanded:nth-child(3n) {
  background: var(--idss-manage-taskTable-row-red-color)
}
.taskTable .el-table__body .expanded:nth-child(3n + 1) {
  background: var(--idss-manage-taskTable-row-green-color)
}
.taskTable .expanded:nth-child(3n-1) td {
  border: 1px solid var(--color-primary);
  border-left: none;

}
.taskTable .expanded:nth-child(3n) td {
  border: 1px solid var(--idss-manage-taskTable-row-rered-color);
  border-left: none;
}

.taskTable .expanded:nth-child(3n + 1) td {
  border: 1px solid var(--idss-manage-taskTable-row-regreen-color);
  border-left: none;
}

/* 绿色 */
.taskTable .el-table__body tbody tr:nth-child(3n-1) td.el-table__expanded-cell,
.taskTable .el-table__body tbody tr:nth-child(3n-1) td.el-table__expanded-cell:hover {
  background: var(--idss-manage-taskTable-row-green-color)!important;
}
/* 蓝色 */
.taskTable .el-table__body tbody tr:nth-child(3n) td.el-table__expanded-cell,
.taskTable .el-table__body tbody tr:nth-child(3n) td.el-table__expanded-cell:hover {
  background: var(--idss-manage-taskTable-row-blue-color)!important;
}
/* 红色 */
.taskTable .el-table__body tbody tr:nth-child(3n + 1) td.el-table__expanded-cell,
.taskTable .el-table__body tbody tr:nth-child(3n + 1) td.el-table__expanded-cell:hover {
  background: var(--idss-manage-taskTable-row-red-color)!important;
}
</style>
