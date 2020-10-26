const BASE_URL = '/api/setting/etl/dept'

const API = {
  // 部门列表
  DEPT_LIST: BASE_URL + '/get-all',
  // 编辑部门
  DEPT_EDIT: BASE_URL + '/set-deptName',
  // 新增部门
  DEPT_SAVE: BASE_URL + '/save',
  // 删除部门
  DEPT_DELETE: BASE_URL + '/delete',
  // 设为主部门
  DEPT_SET: BASE_URL + '/set-master'
}
export default {
  methods: {
    // 部门列表
    getDeptList () {
      this.$request({
        method: 'get',
        url: API.DEPT_LIST
      }, {
        tag: 'dept_list'
      }).then((content) => {
        this.deptData = content
        this.canSet = !(Array.isArray(content) && content.length > 0)
        content.forEach((item, index) => {
          if (item.level === 'master') {
            this.canSet = true
          }
        })
      }, (error) => {
        this.showMessage(error.message, 'error')
      })
    },
    //  保存-编辑
    async saveDept (params) {
      let self = this
      let requestHead = ''
      let alertMsg = ''
      let tipMessage = function (param) {
        self.showMessage(param, 'success')
      }

      // 保存前校验
      let isValid = false
      this.$refs['deptForm'].validate((valid) => {
        isValid = valid
      })
      if (!isValid) return

      // 发送请求
      if (this.operType === 'add') {
        requestHead = self.$request({
          method: 'post',
          url: API.DEPT_SAVE,
          data: {
            deptName: self.deptForm.deptName,
            kafkaAddr: self.deptForm.kafkaAddr
          }
        })
        alertMsg = '新增成功!'
      } else if (this.operType === 'edit') {
        requestHead = self.$request({
          method: 'post',
          url: API.DEPT_EDIT,
          data: this.deptForm
        })
        alertMsg = '保存成功!'
      }
      requestHead.then((content) => {
        tipMessage(alertMsg)
        this.getDeptList()
        this.dialogVisible = false
      }, (error) => {
        this.showMessage(error.message, 'error')
      })
    },
    // 删除部门
    async deleteDept () {
      if (this.multipleSelection === '') {
        this.showMessage('请选择要删除的部门!', 'warning')
      } else {
        this.$confirm('是否确认删除该部门？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$request({
            method: 'post',
            url: API.DEPT_DELETE,
            data: {
              uIds: this.multipleSelection
            }
          }).then((content) => {
            this.showMessage('删除成功!', 'success')
            this.getDeptList()
          }, (error) => {
            console.log(error)
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
      }
    },
    // 设为主部门
    async setDept () {
      if (this.multipleSelection === '') {
        this.showMessage('请选择要设置的部门!', 'warning')
      } else {
        var len = this.multipleSelection.split(',').length
        if (len > 1) {
          this.showMessage('主部门只能有一个，请重新选择!', 'warning')
        } else {
          this.$request({
            method: 'post',
            url: API.DEPT_SET,
            data: {
              uId: this.multipleSelection
            }
          }).then((content) => {
            this.showMessage('成功设置为主部门', 'success')
            this.getDeptList()
          }, (error) => {
            this.showMessage(error.message, 'error')
          })
        }
      }
    },
    init () {
      this.getDeptList()
    }
  }
}
