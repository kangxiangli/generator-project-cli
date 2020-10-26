/**
 * Created by ligang on 2017/10/13.
 */
// 基础路径
const BASE_URL = '/api/setting/etl/job'

const API = {
  // 部门列表
  DEPT_LIST: {
    url: '/api/setting/etl/dept/get-all',
    method: 'get'
  },
  // 部门任务列表
  TASK_LIST: {
    url: BASE_URL + '/ui/task-search/list/query',
    tag: 'task-search-list',
    method: 'post'
  },
  // FIXME: 任务操作
  TASK_STATUS_START (id) {
    return {
      url: `${BASE_URL}/ui/option/${id}/start`,
      method: 'get'
    }
  },
  TASK_STATUS_DISABLE (id) {
    return {
      url: `${BASE_URL}/ui/option/${id}/disable`,
      method: 'get'
    }
  },
  // 任务调度
  PUT_TASK_CONTROL: {
    url: BASE_URL + '/set-timer',
    method: 'post'
  },
  // 任务删除
  DELETE_TASK (id) {
    return {
      url: `${BASE_URL}/ui/option/${id}/deleted`,
      method: 'get'
    }
  }
}
export default {
  methods: {
    /**
     * 获取部门列表
     */
    async getDeptList () {
      let result = await this.$request({ ...API.DEPT_LIST })
      if (!result || (Array.isArray(result) && !result.length)) {
        this.$alert('暂时没有部门信息，前往部门管理页面配置!', '提示', {
          confirmButtonText: '确定',
          callback: action => {
            this.$router.push({ name: 'manage-data-deptEtl' })
          }
        })
      } else {
        this.deptList = result
        // 找到主部门并默认显示
        let acitveDept = result.find(dept => dept.level === 'master')
        this.activeDeptId = acitveDept ? acitveDept['uid'] : result[0].uid
      }
    },

    /**
     * 部门任务列表获取
     */
    async getTableData () {
      const result = await this.requestTable({
        ...API.TASK_LIST,
        currentObj: this.tableData,
        params: {
          deptUId: this.deptInfo.uid,
          ...this.requestParams
        }
      }, {
        noTime: true
      })

      this.tableData = Object.assign({}, result)

      // FIXME: 初始化禁用列表
      result.data.forEach((value, index, array) => {
        this.disableList.push(false)
      })
    },

    /**
     * 批量开启
     * FIXME: 循环发送请求方式，不可取
     */
    async startTaskOperate () {
      let promise = []
      this.checkSelection.forEach((value, index) => {
        if (value.jobStatus === 1) return
        promise.push(this.$request({
          ...API.TASK_STATUS_START(value.jobSerialNumber)
        }))
      })

      promise.length && Promise.all(promise).then((value) => {
        this.showMessage('任务状态已修改。')
        this.getTableData()
      })
    },

    /**
     * 批量关闭
     * FIXME: 循环发送请求方式，不可取
     */
    async disableTaskOperate () {
      let promise = []
      this.checkSelection.forEach((value, index) => {
        if (value.jobStatus === 0) return
        promise.push(this.$request({
          ...API.TASK_STATUS_DISABLE(value.jobSerialNumber)
        }))
      })

      promise.length && Promise.all(promise).then((value) => {
        this.showMessage('任务状态已修改。')
        this.getTableData()
      })
    },

    /**
     * 单独改变开关状态
     * @param {*} status
     * @param {*} idx
     * @param {*} row
     */
    statusChangeByOne (status, idx, row) {
      let apiKey = status === 1 ? `TASK_STATUS_START` : 'TASK_STATUS_DISABLE'
      this.$request({
        ...API[apiKey](row.jobSerialNumber)
      }).then((content) => {
        this.showMessage('任务状态已修改。')
        this.tableData.data[idx].jobStatus = status

        // 注意：禁用开关 15秒钟
        this.$set(this.disableList, idx, true)
        let timer = setTimeout(() => {
          clearTimeout(timer)
          this.$set(this.disableList, idx, false)
        }, 15000)
      })
    },

    /**
     * 任务调度保存
     */
    saveTaskControl () {
      this.$refs['taskSetForm'].validate(async (valid) => {
        if (valid) {
          await this.$request({
            ...API.PUT_TASK_CONTROL,
            data: this.taskSetForm
          })
          this.showMessage('调度设置成功。')
          this.$refs['taskSetForm'].resetFields()
          this.taskControlDialogVisiable = false
          this.getTableData()
        } else {
          return false
        }
      })
    },

    /**
     * 任务删除
     */
    async deletetask (params) {
      this.$request({
        ...API.DELETE_TASK(this.checkSelection[0].jobSerialNumber)
      }).then((content) => {
        this.$message({
          message: '删除成功',
          type: 'success'
        })
        this.getTableData()
      })
    },

    // 更新采集器顺序 FIXME: 使用情景未知
    // async updateExtract (ids) {
    //   this.$request({
    //     method: 'post',
    //     url: API.update_extract,
    //     data: {
    //       data: ids
    //     }
    //   }).then((content) => {
    //     this.getExtractList('', this.currentEvent)
    //     this.activeType = '2'
    //   }, (error) => {
    //     console.log(error)
    //   })
    // },

    // 模糊查询 FIXME: 使用情景未知
    async searchName () {
      var params = {
        pageNum: 1,
        pageSize: this.tableData.pageSize ? this.tableData.pageSize : 20,
        jobSerialNumber: this.searchForm.jobSerialNumber,
        jobDescription: this.searchForm.jobDescription,
        deptUId: this.tabData.uid,
        collectIp: this.searchForm.collectIp
      }
      let result = await this.$request({
        method: 'post',
        url: API.TASK_LIST,
        data: params
      }, {
        tag: 'task-search-list'
      })
      this.tableData = result
      this.tableData.data = result.data
    }
  }
}
