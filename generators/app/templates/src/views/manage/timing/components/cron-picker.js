/**
 * 定时任务组件 core
 * 拆分seconds, minutes, hours, day, month, week, year 七组数据
 * 获取定时任务结果 父组件订阅事件 getCronValue
 * 编辑态，父组件传输 value属性，子组件监听处理
 * 该组件方便其他组件组件继承
 * | 数据类型                       | 说明         |  允许操作类型                                |
 * | ---------------------------- | ------------ | -------------------------------------------|
 * | seconds                      |  秒位处理     | every,point,interval,range                  |
 * | minutes                      |  分为处理     | every,point,interval,range                  |
 * | hours                        |  小时处理     | every,point,interval,range                  |
 * | day                          |  天处理       | every,point,interval,range,last             |
 * | month                        |  月处理       | every,point,interval,range                  |
 * | week                         |  周处理       | every,point,range,last,workday,dayOfWeek    |
 * | year                         |  年处理       | every,point,range                           |
 *
 * 操作类型说明
 * | 操作类型   | 说明                                   |  数据类型                       |
 * | --------- |---------------------------------------|-------------------------------|
 * | every     | 所有，每个                              |  字符串 *                      |
 * | range     | 某个范围，周期                           |  数组(长度为2的数字数组)          |
 * | interval  | 间隔(周和年不支持)                       |  数组(长度为2的数字数组)          |
 * | point     | 指定n数据                               |  数组(长度为n的数字数组)          |
 * | last      | 日当月最后一天，周代表最后一周周几(支持周/日) |  数字 1个                      |
 * | workday   | 表示为最近工作日(只支持日)                 |  数字 1个                      |
 * | dayOfWeek | 每月第n个工作日 (只支持周)                 |  数组(长度为2的数字数组)         |
 */

export default {
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      date: {
        seconds: {
          checked: false,
          type: 'point',
          data: []
        },
        minutes: {
          checked: false,
          type: 'point',
          data: []
        },
        hours: {
          checked: false,
          type: 'point',
          data: []
        },
        day: {
          checked: false,
          type: 'point',
          data: []
        },
        month: {
          checked: false,
          type: 'point',
          data: []
        },
        week: {
          checked: false,
          type: 'point',
          data: []
        },
        year: {
          checked: false,
          type: 'point',
          data: []
        }
      },
      // 周一 ~ 周日 数据
      weekList: [
        { key: 2, name: '周一' },
        { key: 3, name: '周二' },
        { key: 4, name: '周三' },
        { key: 5, name: '周四' },
        { key: 6, name: '周五' },
        { key: 7, name: '周六' },
        { key: 1, name: '周日' }
      ],
      dayList: [...new Array(32).keys()].slice(1, 32), // 每月 1-31 日期
      monthList: [...new Array(13).keys()].slice(1, 13), // 每年月份列表
      cronValue: '' // 定时任务值
    }
  },
  watch: {
    // 监听value变化
    value: {
      immediate: true,
      handler (newValue, oldValue) {
        this.cronValue = this.value
        // 将cron串构建成date对象
        this.reBuildCron(newValue)
        // 监听使用组件变化，调用组件钩子函数
        this.handleValueWatch && this.handleValueWatch()
      }
    },
    // 监听周期所有数据变化，获取定时任务时间戳
    date: {
      deep: true,
      handler (newObj, oldValue) {
        // 生成定时任务值
        this.cronValue = this.formatToCorn(newObj)
        this.$emit('getCronValue', this.cronValue)
      }
    }
  },
  methods: {
    /**
     * 格式化为corn时间
     * @param {object} seconds 秒配置
     * @param {object} minutes 分钟配置
     * @param {object} hours 小时配置
     * @param {object} dayOfMonth 月的某一天的配置
     * @param {object} month 月配置
     * @param {object} dayOfWeek 周配置
     * @param {object} year 年配置
     */
    formatToCorn ({ seconds, minutes, hours, day, month, week, year }) {
      const res = []
      res.push(this.formatDate(seconds, 'seconds'))
      res.push(this.formatDate(minutes, 'minutes'))
      res.push(this.formatDate(hours, 'hours'))
      res.push(this.formatDate(day, 'day'))
      res.push(this.formatDate(month, 'month'))
      res.push(this.formatDate(week, 'week'))
      res.push(this.formatDate(year, 'year'))
      return res.join(' ')
    },

    /**
     *  格式化数据
     * @param {string} 处理数据类型
     * @param {object|array|string} data
     * @param {string} step  seconds, minutes, hours, day, month, week, year
     * @description 参数结构 {type: string, data: arrayList}
     * type: 'every' => 所有  data类型（*）
     * 'range' => 周期  data类型（数组）
     * 'interval' => 间隔(周和年不支持)  data类型（数组）
     * 'point' => 指定某几个数据  data类型（数组）
     * 'last' => 支持周/日 (日当月最后一天，周代表最后一周周几)  data类型（number）
     * 'workday' => 表示为最近工作日 (只支持日)  data类型（number）
     * 'dayOfWeek' => 每月第n个工作日 (只支持周) data类型（数组）
     */
    formatDate ({ type, data, checked }, step) {
      const everything = '*'
      if (!checked) {
        return everything
      }
      switch (type) {
        case 'every': // 通配符，匹配所有
          return everything
        case 'range': // 周期 只能接受两个数
          if (Array.isArray(data) && data.length === 2) {
            const min = Math.min.apply(null, data)
            const max = Math.max.apply(null, data)
            return `${min}-${max}`
          }
          return everything
        case 'interval': // 间隔(周和年不支持) 只能接受两个数
          if (step !== 'week' && step !== 'year' && Array.isArray(data) && data.length === 2) {
            return `${data[0]}/${data[1]}`
          }
          return everything
        case 'point': // 指定某几个数据
          if (Array.isArray(data) && data.length) {
            return data.join(',')
          }
          return everything
        case 'last': // 用在日表示一个月中的最后一天，用在周表示该月最后一个星期X
          if (step === 'week' && typeof data === 'number') {
            return `${data}L`
          } else if (step === 'day') {
            return 'L'
          }
          return everything
        case 'workday': // 表示为最近工作日 (只支持日)
          if (step === 'day' && typeof data === 'number') {
            return `${data}W`
          }
          return everything
        case 'dayOfWeek': // 每月第n个工作日 (只支持周)
          if (step === 'week' && Array.isArray(data) && data.length === 2) {
            return `${data[0]}#${data[1]}`
          }
          return everything
        default:
          return everything
      }
    },

    /**
     * 将cron字符串解析成组件需要的date对象
     * @param {string} cronStr
     */
    reBuildCron (cronStr) {
      if (!cronStr.trim()) {
        return
      }
      // 获取date对象的索引数组，方便做cron对象
      const dateArr = Object.keys(this.date)
      const cronList = cronStr.split(' ')
      // 补全cron数组为7位
      if (cronList.length && cronList.length < 7) {
        cronList.push(...new Array(7 - cronList.length).fill('*'))
      }
      // 解析类型
      cronList.map((item, index) => {
        this.reBuilCronType(item, dateArr[index])
      })
    },

    /**
     * 解析cron类型和数据
     * @param {string} value
     * @param {string} step seconds, minutes, hours, day, month, week, year
     * 该方法主要用于识别不同的数据类型
     */
    reBuilCronType (value, step) {
      // every 类型 data类型为 *
      if (value.indexOf('*') !== -1) {
        this.$set(this.date, step, {
          checked: false, // 不选中
          type: 'every',
          data: []
        })
      } else if (value.match(/^\d+-\d+$/)) {
        // range 类型 data类型为 数组
        this.$set(this.date, step, {
          checked: true,
          type: 'range',
          data: value.split('-').map(item => +item)
        })
      } else if (value.match(/^\d+\/\d+$/) && step !== 'week' && step !== 'year') {
        // interval data类型为 数组
        this.$set(this.date, step, {
          checked: true,
          type: 'interval',
          data: value.split('/').map(item => +item)
        })
      } else if (value.match(/^\d+(,\d+)*$/)) {
        // point data类型为 数组
        this.$set(this.date, step, {
          checked: true,
          type: 'point',
          data: value.split(',').map(item => +item)
        })
      } else if (value.endsWith('L') && (step === 'week' || step === 'day')) {
        // last data类型为 数值
        this.$set(this.date, step, {
          checked: true,
          type: 'last',
          data: +value.split('L')[0]
        })
      } else if (value.endsWith('W') && step === 'day') {
        // workday data类型为 数值
        this.$set(this.date, step, {
          checked: true,
          type: 'last',
          data: +value.split('W')[0]
        })
      } else if (value.match(/^\d+#\d+$/) && step === 'week') {
        // dayOfWeek data类型为 数组
        this.$set(this.date, step, {
          checked: true,
          type: 'dayOfWeek',
          data: value.split('#').map(item => +item)
        })
      }
    }
  }
}
