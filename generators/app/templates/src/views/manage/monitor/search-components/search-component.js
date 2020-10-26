export default {
  name: 'search-component',
  methods: {
    // 联动, 将右侧的对应的IP选中
    changeModule () {
      // 特殊处理
      // 业务规则1: moduleChecked = 0, ipinfo 全部为 0,
      // 业务规则2: 之前 moduleChecked = 0, 选中 moduleChecked = 1, ipinfo 全部为 1,
      // 业务规则3: 之前 moduleChecked = 1, 现在 moduleChecked = 1, ipinfo 可以为 1, 0,
      this.handleIpChecked()
      this.handleModuleChecked()
      this.ipCurrent = []
      this.ipList.forEach(v => {
        v.options.forEach(d => {
          let mod = this.moduleList.find(f => f.module === v.label)
          // 设置业务规则
          if (mod.moduleChecked === 0) {
            d.ipChecked = 0
          } else if (mod.moduleChecked === 1 && mod.oldChecked === 0) {
            d.ipChecked = 1
          }
          // 设置IP选中
          if (d.ipChecked === 1) {
            this.ipCurrent.push(d.value)
          }
        })
      })
    },
    // 联动, 将左侧的对应的模块选中
    changeIp () {
      let arr = []
      this.ipCurrent.forEach(v => {
        let module = v.split('~')[0]
        if (!arr.includes(module)) {
          arr.push(module)
        }
      })
      this.moduleCurrent = arr
    },
    // 将模块下拉菜单的数据重新刷新选中
    handleModuleChecked () {
      this.moduleList.forEach(v => {
        v.oldChecked = v.moduleChecked
        v.moduleChecked = this.moduleCurrent.includes(v.module) ? 1 : 0
      })
    },
    // 将IP下拉菜单的数据重新刷新选中
    handleIpChecked () {
      this.ipList.forEach(v => {
        v.options.forEach(d => {
          d.oldChecked = d.ipChecked
          d.ipChecked = this.ipCurrent.includes(d.value) ? 1 : 0
        })
      })
    },
    // 拼接查询条件
    translateData (isChecked) {
      // 格式转换
      let modules = []
      this.ipCurrent.forEach(v => {
        let arr = v.split('~')
        let module = arr[0]
        let ip = arr[1]
        // 转换
        const findMod = modules.find(f => f.module === module)
        // 不存在则新增
        if (!findMod) {
          modules.push({
            module: module,
            ipinfo: [{
              ip: ip
            }]
          })
          // 存在, 插入ip
        } else {
          findMod.ipinfo.push({ ip: ip })
        }
      })
      return modules
    }
  }
}
