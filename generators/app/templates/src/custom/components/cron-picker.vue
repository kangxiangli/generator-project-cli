<template>
  <el-form
    ref="idss-corn-form"
    label-width="125px"
    :model="cronData"
    :rules="cronDataRules"
    class="idss-corn-form">
    <!-- 日期 -->
    <el-form-item label="日期：" prop="startDate" :error="cronRuleError.startDate">
      <el-col :span="8">
        <el-date-picker
          size="small"
          v-model="cronData.startDate"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
          style="width: 100%;"
          :editable="false">
        </el-date-picker>
      </el-col>
    </el-form-item>
    <!-- 时间 -->
    <el-form-item label="时间：" prop="time" :error="cronRuleError.time">
      <el-row>
        <el-col :span="8">
          <el-time-picker
            size="small"
            v-model="pickTime"
            placeholder="请选择时间"
            format="HH:mm"
            value-format="HH:mm"
            style="width: 100%">
          </el-time-picker>
        </el-col>
        <el-col :span="8" class="add-date-btn idss-margin--l15">
          <el-button
            plain
            size="small"
            @click="addTime('time')">
            添加时间
          </el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col class="reset-tags">
          <el-tag
            v-for="(tag, index) in this.cronData.time"
            :key="tag"
            closable
            :disable-transitions="true"
            @close="deleteTime(index, 'time')">
            {{tag}}
          </el-tag>
        </el-col>
      </el-row>
    </el-form-item>
    <!-- 单次执行 -->
    <el-form-item label-width="0" prop="model">
      <el-radio v-model="cronData.model" label="single">单次</el-radio>
    </el-form-item>
    <!-- 间隔执行 -->
    <el-row>
      <el-col :span="4">
        <el-form-item label-width="0">
          <el-radio v-model="cronData.model" label="interval" @change="intervalChange">间隔时间执行</el-radio>
        </el-form-item>
      </el-col>
      <el-col :span="20">
        <el-form-item label-width="0" prop="interval" :error="cronRuleError.interval">
          <el-row :gutter="5">
            <el-col :span="5">
              <el-input-number
                size="small"
                v-model="intervalDate.day"
                :controls="false"
                :min="0"
                style="width: 85%"
                :disabled="cronData.model !== 'interval'"
                @change="intervalDateChange">
              </el-input-number>
              天
            </el-col>
            <el-col :span="5">
              <el-input-number
                v-model="intervalDate.hour"
                size="small"
                :controls="false"
                :min="0"
                :max="24"
                style="width: 85%"
                :disabled="cronData.model !== 'interval'"
                @change="intervalDateChange">
              </el-input-number>
              时
            </el-col>
            <el-col :span="5">
              <el-input-number
                size="small"
                v-model="intervalDate.minute"
                :controls="false"
                :min="0"
                :max="60"
                style="width: 85%"
                :disabled="cronData.model !== 'interval'"
                @change="intervalDateChange">
              </el-input-number>
              分
            </el-col>
          </el-row>
        </el-form-item>
      </el-col>
    </el-row>
    <!-- 周期执行 -->
    <el-form-item label-width="0">
      <el-row>
        <el-col :span="4">
          <el-radio v-model="cronData.model" label="cycle">周期执行配置</el-radio>
        </el-col>
        <el-col :span="20">
          <!-- 每天 -->
          <el-row>
            <el-col>
              <el-checkbox v-model="cronData.everyday" :disabled="cronData.model !== 'cycle'">每天</el-checkbox>
            </el-col>
          </el-row>
          <!-- 周 -->
          <el-row>
            <el-col :span="3">
              <el-checkbox
                v-model="pickData.isWeek"
                :disabled="cronData.model !== 'cycle' || this.cronData.everyday">
                周
              </el-checkbox>
            </el-col>
            <el-col :span="21">
              <div class="reset-checkbox">
                <el-checkbox-group v-model="cronData.weekDay">
                  <el-checkbox
                    v-for="item in weekList"
                    :label="item.key"
                    :key="item.key"
                    :disabled="!pickData.isWeek">{{item.name}}</el-checkbox>
                </el-checkbox-group>
              </div>
            </el-col>
          </el-row>
          <!-- 月 -->
          <el-row>
            <el-col :span="3">
              <el-checkbox v-model="pickData.isMonth" :disabled="cronData.model !== 'cycle' || this.cronData.everyday">月</el-checkbox>
            </el-col>
            <el-col :span="21">
              <div class="reset-checkbox">
                <el-checkbox-group v-model="cronData.monthDay">
                  <el-checkbox
                    v-for="item in dayList"
                    :label="item.key"
                    :key="item.key"
                    :disabled="!pickData.isMonth">{{item.key}}</el-checkbox>
                </el-checkbox-group>
              </div>
            </el-col>
          </el-row>
          <!-- 年 -->
          <el-row>
            <el-col :span="3">
              <el-checkbox v-model="pickData.isYear" :disabled="cronData.model !== 'cycle' || this.cronData.everyday">年</el-checkbox>
            </el-col>
            <el-form-item prop="cycle" :error="cronRuleError.cycle">
              <el-col :span="21">
                <el-row :gutter="10">
                  <el-col :span="8">
                    <el-date-picker
                      ref="yearDatePicker"
                      size="small"
                      v-model="pickYear"
                      format="MM-dd"
                      value-format="MM-dd"
                      placeholder="选择日期"
                      style="width: 100%;"
                      :disabled="!pickData.isYear"
                      :picker-options="yeaarOptions"
                      :editable="false"
                      @focus="yearDatePickerFocusBlur(false)"
                      @blur="yearDatePickerFocusBlur(true)">
                    </el-date-picker>
                  </el-col>
                  <el-col :span="12" class="add-date-btn">
                    <el-button
                      size="small"
                      plain
                      @click="addTime('yearDay')"
                      :disabled="!pickData.isYear">添加日期</el-button>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col class="reset-tags">
                    <el-tag
                      v-for="(tag, index) in cronData.yearDay"
                      :key="tag"
                      closable
                      :disable-transitions="true"
                      @close="deleteTime(index, 'yearDay')">
                      {{tag}}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-form-item>
          </el-row>
        </el-col>
      </el-row>
    </el-form-item>
  </el-form>
</template>

<script>
/**
   * 定时任务组件 使用
   * 1.定时任务组件规则：
   *   > 日期、时间必填项
   *   > 执行方式： 单次执行、间隔时间执行、周期执行
   * 2. 三种执行方式区别：
   *   > 单次执行：时间可以设置多个，对满足时间和日期的固定时间进行执行
   *   > 间隔时间执行：时间设置按照第一个时间匹配，从设置日期开始，按照固定间隔时间进行执行
   *   > 周期执行：1方式每天与(周、月、年)互斥，设置每天执行，则不能选择周年月，反之亦然
   *             2 周、年、月为并集，任意字段都可以保存，但是该并集不能为空
   * 3. 使用方式：
   *   > 引用方式：  <idss-cron-picker :data="cronRules"></idss-cron-picker>
   *   > 获取定时任务规则： 父组件调用该组件方法 getCronData, 该方法会进行校验，检验通过返回cronRules，否则返回false
   * 4. 其他：
   *  > cronPickerService.js 文件提供将周、年、月、间隔时间转换为相应的展示文字的方法
   * 5. cronRules 字段介绍：
   *   >  model: '', // 执行方式 single => 单次   interval=> 间隔   cycle=>周期
   *   >  startDate:  // 执行开始日期
   *   >  time: [], // 执行时间
   *   >  interval: 0, // 间隔周期（单位/分钟）
   *   >  everyday: false, // 周期模式下是否每天执行 true=> 每天执行
   *   >  weekDay: [], // 星期数据
   *   >  monthDay: [], // 月数据
   *   >  yearDay: [] // date数据
   */
import { formatDate } from 'fusion-utils'
import globalMixins from '@/mixins/globalMixins.js'
import cronPickerService from './cron-picker-service.js'
import { getDomStyle } from '@/custom/utils/dom.js'
export default {
  name: 'idss-cron-picker',
  mixins: [globalMixins, cronPickerService],
  props: {
    data: {
      type: Object,
      default: () => ({})
    },
    // cronRules 后端错误校验数据
    cronRuleError: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      pickYear: '',
      pickTime: '',
      pickData: {
        isWeek: false,
        isMonth: false,
        isYear: false
      },
      intervalDate: {
        day: 0,
        hour: 0,
        minute: 0
      },
      // 定时任务所需数据
      cronData: {},
      // year日期选择参数
      yeaarOptions: {
        disabledDate: this.checkDisableDate
      }
    }
  },
  watch: {
    // 监听周选中
    'pickData.isWeek' (newV, oldV) {
      if (!newV) {
        this.cronData.weekDay = []
      }
    },
    // 监听周选中
    'pickData.isMonth' (newV, oldV) {
      if (!newV) {
        this.cronData.monthDay = []
      }
    },
    // 监听周选中
    'pickData.isYear' (newV, oldV) {
      if (!newV) {
        this.cronData.yearDay = []
      }
    },
    // 判断周期执行，每天执行条件
    'cronData.everyday' (newV) {
      // 校验everyday字段
      this.$refs['idss-corn-form'].validateField('cycle')
      // 周期执行 和每天执行监控
      this.isCheckCycleEveryDay()
    },
    'cronData.model' () {
      // 定时任务模式切换处理
      this.switchModel()
    },
    'cronData.weekDay' () {
      // 校验everyday字段
      this.$refs['idss-corn-form'].validateField('cycle')
    },
    'cronData.monthDay' () {
      // 校验everyday字段
      this.$refs['idss-corn-form'].validateField('cycle')
    },
    intervalDate: {
      handler () {
        const hour = 60
        const day = 60 * 24
        this.cronData.interval = this.intervalDate.day * day + this.intervalDate.hour * hour + this.intervalDate.minute
      },
      deep: true
    },
    // 监听props data数据
    data: {
      handler () {
        this.init()
      },
      deep: true
    }
  },
  methods: {
    // 组件初始化
    init () {
      // 设置定时任务数据(编辑状态)
      this.$set(this, 'cronData', Object.assign(this.defaultCronData, this.filterCronData(this.data)))
      // 设置执行周期选择数据
      this.$set(this, 'pickData', {
        isWeek: !!(this.cronData.weekDay && this.cronData.weekDay.length),
        isMonth: !!(this.cronData.monthDay && this.cronData.monthDay.length),
        isYear: !!(this.cronData.yearDay && this.cronData.yearDay.length)
      })
      // 初始化interval数据
      this.initInterval()
    },
    /**
       * 父级组件 获取当前定时任务组件的定时数据
       */
    async getCronData () {
      // 表单校验
      const validate = await this.$refs['idss-corn-form'].validate()
      if (validate) {
        return this.filterCronData(this.cronData)
      }
      return validate
    },
    /**
       * form表单重置
       * 用于父级组件调用
       */
    resetForm () {
      this.$refs['idss-corn-form'].clearValidate()
    },
    initInterval () {
      const hour = 60
      const day = 60 * 24
      this.$set(this, 'intervalDate', {
        day: Math.floor(this.cronData.interval / day),
        hour: Math.floor((this.cronData.interval % day) / hour),
        minute: (this.cronData.interval % day) % hour
      })
    },
    /**
       * 删除日期/时间
       * @param {number} index
       * @param {string} type yearDay/time
       */
    deleteTime (index, type) {
      this.cronData[type].splice(index, 1)
      this.$nextTick(() => {
        // 校验time/everyday字段
        this.$refs['idss-corn-form'].validateField(type === 'time' ? 'time' : 'cycle')
      })
    },

    /**
       * 添加时间/日期
       * @param {string} type yearDay/time
       */
    addTime (type) {
      const typeData = {
        yearDay: {
          msg: '日期',
          field: 'pickYear',
          validateField: 'cycle'
        },
        time: {
          msg: '时间',
          field: 'pickTime',
          validateField: 'time'
        }
      }
      let time = this[typeData[type].field]
      if (!time) {
        return this.showMessage(`请选择将要添加的${typeData[type].msg}！`, 'warning')
      }
      if (this.cronData[type].indexOf(time) !== -1) {
        this.$message.error(`${typeData[type].msg}重复，请重新选择！`)
      } else {
        this.cronData[type].push(time)
      }
      // 监听当前执行间隔时处理
      if (type === 'time' && this.cronData.model === 'interval') {
        this.intervalChange()
      }
      this[typeData[type].field] = ''
      this.$nextTick(() => {
        // 校验time/everyday字段
        this.$refs['idss-corn-form'].validateField(typeData[type].validateField)
      })
    },

    /**
       * 间隔执行选中监听事件
       */
    intervalChange () {
      if (this.cronData.time.length > 1) {
        return this.showMessage('只能配置一个时间', 'warning')
      }
    },

    /**
       * 间隔执行时间变化触发
       */
    intervalDateChange (value) {
      if (typeof value !== 'number') {
        Object.keys(this.intervalDate).map(name => {
          if (typeof this.intervalDate[name] !== 'number') {
            this.$nextTick(() => {
              this.$set(this.intervalDate, name, 0)
            })
          }
        })
      }
    },

    /**
       * 周期执行 每天执行监控
       */
    isCheckCycleEveryDay () {
      // 判断选中状态(周期执行且选中每天)),周数据、月数据、年数据都清空且禁止
      if (this.cronData.everyday && this.cronData.model === 'cycle') {
        this.pickData.isWeek = this.pickData.isMonth = this.pickData.isYear = false
        this.cronData.weekDay = []
        this.cronData.monthDay = []
        this.cronData.yearDay = []
        this.pickYear = ''
      }
    },

    /**
       * 定时任务切换模式
       */
    switchModel () {
      // 单次执行 / 间隔执行时对 周期数据的影响
      if (this.cronData.model === 'single' || this.cronData.model === 'interval') {
        this.pickData.isWeek = this.pickData.isMonth = this.pickData.isYear = false
        this.cronData.weekDay = []
        this.cronData.monthDay = []
        this.cronData.yearDay = []
        this.cronData.everyday = false
        this.pickYear = ''
      }

      // 单次执行/ 周期执行时 对间隔着执行的处理
      if (this.cronData.model === 'single' || this.cronData.model === 'cycle') {
        this.cronData.interval = 0
        // 初始化interval数据
        this.initInterval()
      }
      // 周期执行 和每天执行监控
      this.isCheckCycleEveryDay()
    },

    /**
       * 校验interval
       * @param {object} rule
       * @param {string|number|array} value
       * @param {function} callback
       */
    intervalValidator (rule, value, callback) {
      if (this.cronData.model === 'interval' && value <= 0) {
        callback(new Error('请输入间隔时间'))
      } else {
        callback()
      }
    },

    /**
       * 周期执行组合校验
       * @param {object} rule
       * @param {string|number|array} value
       * @param {function} callback
       */
    cycleValidator (rule, value, callback) {
      // 周期执行时，非每天执行校验规则
      if (this.cronData.model === 'cycle' &&
          !this.cronData.everyday &&
          !this.cronData.weekDay.length &&
          !this.cronData.monthDay.length &&
          !this.cronData.yearDay.length) {
        callback(new Error('周期执行数据不能为空'))
      } else {
        callback()
      }
    },
    /**
       * 根据cron规则过滤所需的cron数据
       * @param {object} data cronData数据
       */
    filterCronData (data) {
      if (!data.model) return {}
      const res = {
        model: data.model,
        startDate: data.startDate,
        time: JSON.parse(JSON.stringify(data.time))
      }
      switch (data.model) {
        case 'interval':
          res.interval = data.interval
          break
        case 'cycle':
          res.everyday = data.everyday
          if (!data.everyday) {
            res.weekDay = JSON.parse(JSON.stringify(data.weekDay))
            res.monthDay = JSON.parse(JSON.stringify(data.monthDay))
            res.yearDay = JSON.parse(JSON.stringify(data.yearDay))
          }
          break
        default:
          break
      }
      return res
    },

    /**
       * 校验选择日期是否在2018年范围内
       */
    checkDisableDate (time) {
      return time < 1514736000000 || time > 1546271999000
    },

    /**
       * year年份选择日期时，日期唤起/隐退事件
       * @FIXME 当前操作处理，依赖element data-picker内部处理，如版本变更，需要测试
       * @paran {Boolean} isShowBtn 是否显示相关按钮
       */
    yearDatePickerFocusBlur (isShowBtn) {
      this.$nextTick(() => {
        const picker = this.$refs['yearDatePicker']
        if (!picker || !picker.popperElm) return
        // 获取picker的zIndex
        const zIndex = getDomStyle(picker.popperElm, 'zIndex')
        // 获取当前日期选择器（zIndex过滤）
        const parent = Array.from(document.querySelectorAll('.el-date-picker')).filter(el => el.style.zIndex === zIndex)[0]
        if (!parent) return
        const header = parent.querySelector('.el-date-picker__header')
        const childrenBtn = header.querySelectorAll('button')
        childrenBtn[0].style.display =
            childrenBtn[2].style.display =
            header.querySelector('span').style.display = isShowBtn ? '' : 'none'
        // 当前日期框 唤起之后，按钮处理
        this.datePickerShowBtn(this.pickYear, childrenBtn)
        // 监听 datepicker date数据变化
        if (!isShowBtn) {
          // 隐藏按钮，添加watch监听，监听picker的date变化
          this.pickerWatch = this.$refs['yearDatePicker'].picker.$watch('date', (value) => {
            // 判断当前按钮显示处理
            this.datePickerShowBtn(value, childrenBtn)
          })
        } else {
          childrenBtn[3].style.display = childrenBtn[1].style.display = ''
          // 取消watch监听
          this.pickerWatch && this.pickerWatch()
        }
      })
    },
    /**
       * 判断当前picker日期，对应按钮操作处理
       * @param {date} time 日期
       * @param {array} btnList 按钮列表
       */
    datePickerShowBtn (time, btnList) {
      const month = new Date(time).getMonth()
      // 当月份大于等于12，右侧按钮不显示
      btnList[3].style.display = month >= 11 ? 'none' : ''
      // 当月份小于等于1，左侧按钮不显示
      btnList[1].style.display = month <= 0 ? 'none' : ''
    }
  },
  created () {
    // 校验规则
    this.cronDataRules = {
      model: [
        { type: 'enum', enum: ['single', 'interval', 'cycle'], required: true, message: '请选择执行方式' }
      ],
      startDate: [
        { pattern: /^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/, required: true, message: '请选择执行开始时间', trigger: 'blur' }
      ],
      time: [
        { type: 'array', pattern: /^(20|21|22|23|[0-1]\d):[0-5]\d$/, required: true, message: '请选择执行时间' }
      ],
      interval: [
        { validator: this.intervalValidator }
      ],
      cycle: [
        { validator: this.cycleValidator }
      ]
    }
    // 定时任务所需数据
    this.defaultCronData = {
      model: '', // 执行方式 single => 单次   interval=> 间隔   cycle=>周期
      startDate: formatDate.call(new Date(), 'yyyy-MM-dd'), // 执行开始日期
      time: [], // 执行时间
      interval: 0, // 间隔周期
      everyday: false, // 周期模式下是否每天执行
      weekDay: [], // 星期数据
      monthDay: [], // 月数据
      yearDay: [] // date数据
    }
    this.init()
  },
  beforeDestroy () {
    // 清除datepicker 修改全局样式,显示datepicker所有按钮
    this.yearDatePickerFocusBlur(true)
  }
}
</script>
<style scoped lang="postcss">
  .idss-corn-form {
    .el-form-item .el-form-item {
      margin-bottom: 10px
    }

    /* 复选框 */
    .reset-checkbox .el-checkbox{
      margin-left: 10px;
      width: 52px;
    }

    /* 添加日期标签 */
    .reset-tags {
      margin-top: 5px;

      & span.el-tag {
        margin-right: 15px;
      }
    }
  }
</style>
