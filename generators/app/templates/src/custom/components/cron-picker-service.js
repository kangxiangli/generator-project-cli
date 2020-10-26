
export default {
  data () {
    return {}
  },
  methods: {
    /**
     * 分钟转换为 X天X时X分
     * @param {string} value interval周期，单位/分中
     * @param {string} X天X时X分
     */
    minuteToDays (value) {
      if (typeof value !== 'number') return '0分'
      const hour = 60
      const day = 60 * 24
      return `${Math.floor(value / day)} 天 ${Math.floor((value % day) / hour)} 时 ${(value % day) % hour} 分`
    },
    /**
     * 星期数据转为 周X
     * @param {array|string} list weekday数据， ['0','1'...'6']
     * @param {separator} 分离符号
     * @return {string} 周X,周X
     */
    weeksToCn (list, separator = ',') {
      let res = []
      if (Array.isArray(list) && list.length) {
        res = list.map(item => {
          const temp = this.weekList.filter(week => week.key === item)
          if (temp.length) {
            return temp[0].name
          }
        })
        return res.join(separator)
      } else if (typeof list === 'string' && list.match(/^\d+$/)) {
        return this.weekList.filter(week => week.key === list)[0].name
      }
    },
    /**
     * 月份数据转为换 每月X号
     * @param {array|string} list monthDay数据， ['1','2'...'31']
     * @param {separator} 分离符号
     * @return {string} 每月X号,每月X号
     */
    monthDaysToCn (list, separator = ',') {
      let res = []
      if (Array.isArray(list) && list.length) {
        res = list.map(item => {
          const temp = this.dayList.filter(day => day.key === item)
          if (temp.length) {
            return temp[0].value
          }
        })
        return res.join(separator)
      } else if (typeof list === 'string' && list.match(/^\d+$/)) {
        return this.dayList.filter(day => day.key === list)[0].value
      }
    },
    /**
     * 特殊的天转换为 X月X日
     * @param {array|string} list yearDays数据， ['12-08','05-09']
     * @param {separator} 分离符号
     * @return {string} X月X日,X月X日
     */
    yearDaysTocn (list, separator = ',') {
      let res = []
      if (Array.isArray(list) && list.length) {
        res = list.map(item => `${item}号`.replace(/0(\d)/g, '$1').replace('-', '月'))
        return res.join(separator)
      } else if (typeof list === 'string') {
        return `${list}号`.replace(/0(\d)/g, '$1').replace('-', '月')
      }
    },
    /**
    * 日期转换为字符串
    * @param {array|string} list time数据， ['12:08','05:09']
    * @param {separator} 分离符号
    * @return {string} 12:08,05:09
    */
    timeToCn (list, separator = ',') {
      if (Array.isArray(list) && list.length) {
        return list.join(separator)
      } else if (typeof list === 'string') {
        return list
      }
    }
  },
  created () {
    // 周一 ~ 周日 数据
    this.weekList = [
      { key: '1', name: '周一' },
      { key: '2', name: '周二' },
      { key: '3', name: '周三' },
      { key: '4', name: '周四' },
      { key: '5', name: '周五' },
      { key: '6', name: '周六' },
      { key: '0', name: '周日' }
    ]
    // 每月 1-31 日期
    this.dayList = [...new Array(31).keys()].map(item => ({
      key: `${item + 1}`,
      value: `每月${item + 1}号`
    }))
  }
}
