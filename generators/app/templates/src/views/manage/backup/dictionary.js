const BACKUP_TITLE = {
  'add': '新建备份',
  'edit': '编辑备份'
}
const FORMINIT = {
  fileName: '',
  bakFinishDel: false,
  autoGenerateName: false,
  bakAuto: false,  // 是否自动备份
  bakWay: 'remote',  // 备份方式
  executeCycle: 'day',  // 时间周期
  executeDate: '',
  executeTime: `${new Date().getHours()}:${new Date().getMinutes()}`,
  protocolType: '',   // 备份方式
  account: '',        // 账号
  passwd: '',         // 密码
  bakPath: ''         // 备份路径
}
const WEEKDAY = {
  1: '周一',
  2: '周二',
  3: '周三',
  4: '周四',
  5: '周五',
  6: '周六',
  7: '周日' // @FIXME:Date.getDay 返回 0 的话是周日
}
const CURRENT_DAY_OR_DATE = {
  'day': '',
  'week': `${new Date().getDay()}`,
  'month': `${new Date().getDate()}`
}
export { BACKUP_TITLE, FORMINIT, WEEKDAY, CURRENT_DAY_OR_DATE }
