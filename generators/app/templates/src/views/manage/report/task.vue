<template>
  <div class="idss-manage-report" v-loading="loading['full-screen']">
    <el-form ref="formInfo" :model="formInfo" :rules="rules"
      label-width="130px">
      <!-- 基本信息 && 执行频率 -->
      <el-row type="flex">
        <!-- 基本信息 start -->
        <el-col :span="12">
          <idss-widget padding="10px" style="height: 310px;">
            <idss-widget-tool title border-bottom padding="10px" slot="tool">
              基本信息
            </idss-widget-tool>
            <el-row>
              <el-col :span="13">
                <el-form-item label="任务名：" prop="taskName">
                  <el-input size="small" v-model="formInfo.taskName"></el-input>
                </el-form-item>
                <el-form-item label="备注：" prop="comment">
                  <el-input size="small" v-model="formInfo.comment"></el-input>
                </el-form-item>
                <el-form-item label="任务组：" prop="reportType" class="idss-txt--left">
                  <el-select style="width: 100%;"  size="small" v-model="formInfo.reportType" placeholder="请选择任务组">
                    <el-option
                      v-for="item in reportTypeList"
                      :key="item.key"
                      :label="item.name"
                      :value="item.key">
                    </el-option>
                  </el-select>
                  <el-button @click="dialogAddReport=true" size="medium" type="primary" class="idss-report-addTask">新增任务组</el-button>
                </el-form-item>
                <el-form-item label="报表输出格式：" prop="outputType">
                  <el-checkbox-group v-model="formInfo.outputType">
                    <el-checkbox label="EXCEL" name="outputType" disabled></el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
              </el-col>
            </el-row>
          </idss-widget>
        </el-col>
        <!-- 基本信息 end -->
        <!-- 执行频率 start -->
        <el-col :span="12">
          <idss-widget padding="10px 20px" style="height: 310px;">
            <idss-widget-tool slot="tool" title border-bottom padding="10px">
              执行频率
            </idss-widget-tool>
            <template>
              <el-form-item prop="frequency" class="idss-manage-report__title" label-width="0">
                <el-radio-group v-model="formInfo.frequency">
                  <el-radio label="notExecute">不执行</el-radio>
                  <el-radio label="once">一次</el-radio>
                  <el-radio label="repeat">重复</el-radio>
                </el-radio-group>
              </el-form-item>
              <!-- 当执行频率为 "重复" 时显示 -->
              <div v-if="formInfo.frequency === 'repeat'" class="idss-report__frequency">
                <el-radio-group v-model="formInfo.cycle" @change="cycleChange">
                  <el-radio label="day">日</el-radio>
                  <el-radio label="week">周</el-radio>
                  <el-radio label="month">月</el-radio>
                </el-radio-group>
                <div>
                  <el-form-item v-if="formInfo.cycle === 'day'" prop="day" ref="day" label-width="0">
                    <div class="idss-margin--t22">
                      <el-time-picker
                        v-model="formInfo.day"
                        placeholder="请选择时间">
                      </el-time-picker>
                    </div>
                  </el-form-item>
                  <el-form-item v-if="formInfo.cycle === 'week'" prop="week" ref="week" label-width="0">
                    <div class="idss-report__input idss-margin--t22">
                      <span>每周的第</span>
                      <el-input size="mini"  value="number" :maxlength=1 v-model.number="formInfo.week"></el-input>
                      <span>天</span>
                    </div>
                  </el-form-item>
                  <el-form-item v-if="formInfo.cycle === 'month'" prop="month" ref="month" label-width="0">
                    <div class="idss-report__input idss-margin--t22" >
                      <span>每个月的第</span>
                      <el-input size="mini" value="number" :maxlength=2
                        v-model.number="formInfo.month"></el-input>
                      <span>天</span>
                    </div>
                  </el-form-item>
                </div>
              </div>
              <!-- 开始时间：当执行频率为 "不执行 " 时，不显示 -->
              <el-form-item v-if="formInfo.frequency !== 'notExecute'" prop="startTime" required
                label="开始时间：" label-width="100px" class="idss-txt--left" >
                <el-date-picker
                  v-model="formInfo.startTime"
                  type="datetime"
                  format="yyyy-MM-dd HH:mm"
                  placeholder="选择日期时间">
                </el-date-picker>
              </el-form-item>
            </template>
          </idss-widget>
        </el-col>
        <!-- 执行频率 end -->
      </el-row>
      <!-- 报表数据 start -->
      <el-row>
        <el-col :span="24">
          <idss-widget padding="10px 20px">
            <idss-widget-tool slot="tool" title border-bottom padding="10px">
              报表数据
            </idss-widget-tool>
            <el-form-item label-width="0" prop="statistics">
              <el-tabs v-model="currentReport">
                <!-- 日统计 -->
                <el-tab-pane name="day">
                  <span slot="label">
                    <el-checkbox v-model="statistics.day"
                      @change="(val)=>{handleCheckAllChange('day', val)}"
                      :indeterminate="indeterminate.day"></el-checkbox>
                    <i>日统计</i>
                  </span>
                  <div>
                    <el-checkbox-group
                      @change="checkboxChange('day', formInfo.statistics.day)"
                      v-model="formInfo.statistics.day"
                      class="idss-report__checklist">
                      <el-checkbox
                        v-for="item in reportData.day"
                        :key="item.key"
                        :label="item.key"
                        :name="item.key">
                        {{item.name}}
                      </el-checkbox>
                    </el-checkbox-group>
                  </div>
                </el-tab-pane>
                <!-- 周统计 -->
                <el-tab-pane name="week">
                  <span slot="label">
                    <el-checkbox v-model="statistics.week"
                      @change="(val)=>{handleCheckAllChange('week', val)}"
                      :indeterminate="indeterminate.week"></el-checkbox>
                    <i>周统计</i>
                  </span>
                  <div>
                    <el-checkbox-group
                      v-model="formInfo.statistics.week"
                      @change="checkboxChange('week', formInfo.statistics.week)"
                      class="idss-report__checklist">
                      <el-checkbox
                        v-for="item in reportData.week"
                        :key="item.key"
                        :label="item.key"
                        :name="item.key">
                        {{item.name}}
                      </el-checkbox>
                    </el-checkbox-group>
                  </div>
                </el-tab-pane>
                <!-- 月统计 -->
                <el-tab-pane name="month">
                  <span slot="label">
                    <el-checkbox
                      @change="(val)=>{handleCheckAllChange('month', val)}"
                      v-model="statistics.month"
                      :indeterminate="indeterminate.month"></el-checkbox>
                    <i>月统计</i>
                  </span>
                  <div>
                    <el-checkbox-group
                      v-model="formInfo.statistics.month"
                      @change="checkboxChange('month', formInfo.statistics.month)"
                      class="idss-report__checklist">
                      <el-checkbox
                        v-for="item in reportData.month"
                        :key="item.key"
                        :label="item.key"
                        :name="item.key">
                        {{item.name}}
                      </el-checkbox>
                    </el-checkbox-group>
                  </div>
                </el-tab-pane>
              </el-tabs>
            </el-form-item>
          </idss-widget>
        </el-col>
      </el-row>
      <!-- 报表数据 end -->
      <el-row>
        <el-col :span="24" align="center">
          <el-button @click="submitForm" size="medium" type="primary" class="idss-margin--b-m">保存任务</el-button>
        </el-col>
      </el-row>
    </el-form>

    <!-- 新增任务组弹窗 start -->
    <add-report :visible.sync="dialogAddReport"
      @addSuccess="addReportSuccess"></add-report>
    <!-- 新增任务组弹窗 end -->
  </div>
</template>

<script>
import globalMixins from '@/mixins/globalMixins'
import service from '@/views/manage/report/task-service.js'
import AddReport from './components/add-report'

export default {
  name: 'manage-report-task',
  mixins: [globalMixins, service],
  components: { AddReport },
  data () {
    return {
      // 任务管理状态 1.add: 添加  2.edit：编辑
      status: 'add',
      reportTypeList: [],  // 任务组列表
      // 表单信息
      originalForm: {},    // 表单原始信息
      formInfo: {
        taskName: '',            // 任务名
        comment: '',             // 备注
        reportType: '',          // 报表分类
        outputType: ['EXCEL'],   // 报表输出格式
        frequency: 'repeat',     // 执行频率
        cycle: 'month',          // 周期：日/周/月
        cycleTime: '',           // 周期具体时间： 每月1号
        startTime: new Date(),   // 开始时间
        statistics: {
          day: [],
          week: [],
          month: []
        },
        // 执行频率，不用于向后台传递
        day: new Date(),
        week: '',
        month: ''
      },
      rules: {
        taskName: [{ required: true, message: '任务名不能为空', trigger: 'change' }],
        reportType: [{ required: true, message: '报表分类不能为空', trigger: 'change' }],
        startTime: [{ type: 'date', validator: this.checkTime, trigger: 'change' }],
        statistics: [{ validator: this.checkStatics }],
        day: [{ required: true, message: '时间不能为空' }],
        week: [
          { required: true, message: '请选择时间' },
          { type: 'number', message: '只允许输入数字1-7' },
          { validator: this.weekTimeValidate, trigger: 'change' }
        ],
        month: [
          { required: true, message: '请选择时间' },
          { type: 'number', message: '只允许输入数字1-31' },
          { validator: this.monthTimeValidate, trigger: 'change' }
        ]
      },
      // 报表数据统计 - 是否全选
      statistics: {
        day: false,
        week: false,
        month: false
      },
      // 报表数据统计 - 是否选择大于一个
      indeterminate: {
        day: false,
        week: false,
        month: false
      },
      // 报表数据 - 统计列表 (静态)
      currentReport: 'month', // 当前 ‘月统计’ 可见
      reportData: {
        day: [],
        week: [],
        month: []
      },
      // 新增任务组弹窗
      dialogAddReport: false
    }
  },
  methods: {
    /**
       *【添加任务组】添加任务组成功
       */
    async addReportSuccess (name) {
      this.showMessage('添加成功')
      // 更新任务组列表，将新添加的任务组设置为第一项
      await this.initReportTypes()
      let reportTypeObj = this.reportTypeList.find(item => item.name === name)
      reportTypeObj && (this.formInfo.reportType = reportTypeObj.key)
    },

    /* ============ 以下报表数据操作相关 ================== */
    /**
       * 手动改变选择项时触发
       */
    checkboxChange (type, selection) {
      this.statistics[type] = this.reportData[type].length === selection.length
      this.indeterminate[type] = selection.length > 0 && this.reportData[type].length > selection.length
    },

    /**
       * 全选、非全选控制
       */
    handleCheckAllChange (type, val) {
      let ary = []
      for (let item of this.reportData[type]) {
        ary.push(item.key)
      }
      this.formInfo.statistics[type] = val ? ary : []
      this.indeterminate[type] = false
    },

    /**
       * 初始化 选项对应
       */
    initCheckStatus () {
      let ary = ['day', 'week', 'month']
      for (let item of ary) {
        let currentStaLen = this.formInfo.statistics[item].length
        let orgLen = this.reportData[item].length
        this.statistics[item] = currentStaLen === orgLen
        this.indeterminate[item] = currentStaLen > 0 && currentStaLen < orgLen
      }
    },

    /**
       * 报表数据校验
       */
    checkStatics (rule, value, callback) {
      let dayLen = this.formInfo.statistics.day.length
      let weekLen = this.formInfo.statistics.week.length
      let monthLen = this.formInfo.statistics.month.length
      if (dayLen === 0 && weekLen === 0 && monthLen === 0) {
        callback(new Error('请至少选择一项'))
      } else {
        callback()
      }
    },
    /**
       * ============ 表单校验 & 提交 ==================
       */
    /**
       *【submit】表单提交
       */
    submitForm () {
      this.$refs['formInfo'].validate((valid, object) => {
        if (valid) {
          let requestData = Object.assign({}, JSON.parse(JSON.stringify(this.formInfo)))
          requestData.cycleTime = requestData[requestData.cycle]
          // 格式化时间
          if (requestData.cycle === 'day') {
            requestData.cycleTime = +new Date(requestData.day)
          }
          if (requestData.startTime) {
            requestData.startTime = +new Date(requestData.startTime)
          }
          // 不执行 和 执行一次时清空循环参数
          if (requestData.frequency === 'notExecute' || requestData.frequency === 'once') {
            requestData.cycle = ''
            requestData.cycleTime = ''
          }
          // 删除不必要的参数
          delete requestData.day
          delete requestData.week
          delete requestData.month
          // 提交表单
          this.saveTaskForm(requestData)
        }
      })
    },

    /**
       *【校验】任务开始时间验证
       */
    checkTime (rule, value, callback) {
      if (this.formInfo.frequency === 'notExecute') {
        callback()
      } else if (!value) {
        callback(new Error('请选择开始时间'))
      } else {
        callback()
      }
    },

    /**
       *【验证】月时间输入验证
       */
    monthTimeValidate (rule, value, callback) {
      if (value > 31 || value < 1) {
        callback(new Error('只允许输入数字1-31'))
      } else {
        callback()
      }
    },

    /**
       *【验证】周时间输入验证
       */
    weekTimeValidate (rule, value, callback) {
      if (value > 7 || value < 1) {
        callback(new Error('只允许输入数字1-7'))
      } else {
        callback()
      }
    },

    /**
       * 移除表单项的校验结果, radio切换时触发
       */
    cycleChange (label) {
      this.$refs[label] && this.$refs[label].clearValidate()
    }
  },
  async created () {
    // 【拷贝】原始数据
    this.originalForm = JSON.stringify(this.formInfo)
    this.initReportData()           // 报表数据列表
    await this.initReportTypes()    // 任务组列表

    let { taskId, reportType } = this.$route.query
    // 根据传入参数初始化任务组
    if (reportType !== undefined) {
      let curReportType = this.reportTypeList.find(item => item.name === reportType)
      curReportType && (this.formInfo.reportType = curReportType.key)
    }
    // 如果有 taskId，则进入编辑
    if (taskId) {
      this.status = 'edit'
      this.getReportForm(taskId)   // 获取详情
    }
  }
}
</script>

<style scoped lang="postcss">
  /* 标题 */
  .idss-manage-report__title {
    margin-bottom: 10px;
    line-height: 1;
    border-bottom: var(--border-default);
  }

  /* 执行频率 */
  .idss-report__frequency {
    display: flex;
    align-items: center;
    border-bottom: var(--border-default);
    padding-bottom: 10px;
    margin-bottom: 10px;

    .el-radio-group {
      display: inline-flex;
      flex-direction: column;
      padding-right: 30px;
      border-right: var(--border-default);
      margin-right: 30px;
      margin: 10px 30px 10px 0;
    }

    .el-radio + .el-radio {
      margin-left: 0;
      padding-top: 20px;
    }
  }
  /* 执行频率 - 周月 input */
  .idss-report__input {
    display: inline-flex;
    align-items: center;

    span {
      display: inline-block;
      white-space: nowrap;
    }

    & >>> .el-input__inner {
      border: none;
      border-bottom: var(--border-default);
      width: 50px;
      padding: 0 10px;
      border-radius: 0;
      font-size: 1.4rem;
    }
  }
  /* 报表数据 */
  .idss-report__checklist {
    text-align: left;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    max-height: 240px;
    padding: 10px 20px;

    & .el-checkbox {
      width: 40%;
    }
    & .el-checkbox + .el-checkbox {
      margin-left: 0;
    }
  }
  /* 新增任务组按钮 */
  .idss-report-addTask {
    position: absolute;
    top: 4px;
    left: 100%;
    margin-left: 10px;
  }
</style>
