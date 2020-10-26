<template>
  <el-dialog title="新增报表类型"
    :visible.sync="dialogVisible"
    width="400px" custom
    :close-on-click-modal="false">
    <el-form ref="addReport" :model="report" :rules="rules"
      @submit.native.prevent label-width="70px">
      <el-form-item label="名称：" prop="name">
        <el-input
          size="small"
          placeholder=""
          v-model.trim="report.name"
          auto-complete="off">
        </el-input>
      </el-form-item>
    </el-form>
    <div class="idss-txt--center">
      <el-button type="primary" @click="saveAddReport" size="small">保 存</el-button>
      <el-button @click="dialogVisible = false" size="small" plain>取 消</el-button>
    </div>
  </el-dialog>
</template>
<script>
const API = {
  REPORT: {
    method: 'post',
    url: '/api/manage/report/template/reports/add'
  }
}

export default {
  name: 'AddReport',
  props: ['visible'],
  data () {
    return {
      report: {
        name: ''
      },
      rules: {
        name: [
          { required: true, message: '报表名称不能为空', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    dialogVisible: {
      get: function () {
        return this.visible
      },
      set: function (newVal) {
        !newVal && this.$refs['addReport'].resetFields()
        this.$emit('update:visible', newVal)
      }
    }
  },
  methods: {
    /**
       * 保存新增报表
       */
    saveAddReport () {
      this.$refs['addReport'].validate(async (valid) => {
        if (valid) {
          await this.$request({
            ...API.REPORT,
            data: {
              ...this.report
            }
          })
          this.$emit('addSuccess', this.report.name)
          this.$refs['addReport'].resetFields()
          this.dialogVisible = false
        }
      })
    }
  }
}
</script>
