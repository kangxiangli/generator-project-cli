<template>
  <div class="dept_data">
    <idss-widget
      v-loading="loading['dept_list']">
      <template slot="title-left">
        部门列表
        <el-button size="mini" plain type="primary" :disabled="canSet"
          @click="setDept" icon="el-icon-star-on">设为主部门</el-button>
        <el-button @click="deleteDept" size="mini" type="danger" plain :disabled="!multipleSelection">
          <idss-icon-svg name="delete-hover"></idss-icon-svg>
          删除
        </el-button>
      </template>
      <template slot="title-right">
        <el-button size="mini" @click="handleDept('add', '')">
          <idss-icon-svg name="add"></idss-icon-svg>
          新建
        </el-button>
      </template>
      <el-table border stripe
        :data="deptData"
        @selection-change="handleSelectionChange">
        <template slot="empty">
          <idss-no-data></idss-no-data>
        </template>
        <el-table-column
          width="40px"
          type="selection"
          align="center">
        </el-table-column>
        <el-table-column
          prop="uid"
          label="部门编号"
          align="center">
        </el-table-column>
        <el-table-column
          prop="deptName"
          label="部门名称"
          show-overflow-tooltip
          align="center">
        </el-table-column>
        <el-table-column
          prop="level"
          label="部门属性"
          show-overflow-tooltip
          align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level === 'master'" type="info" size="mini" plain>主部门</el-tag>
            <span v-else>分部门</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          width="72px">
          <template slot-scope="scope">
            <el-button @click="handleDept('edit', scope.row)"
              size="mini" micro
              type="primary" plain>
              编辑
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </idss-widget>

    <!-- 新建弹窗 -->
    <el-dialog
      :title="deptTitle"
      :visible.sync="dialogVisible"
      width="480px"
      custom>
      <el-form :model="deptForm" :rules="rules" ref="deptForm" label-width="100px" size="small">
        <el-form-item label="部门名称" prop="deptName">
          <el-input v-model.trim="deptForm.deptName" placeholder="请输入部门名称"></el-input>
        </el-form-item>
        <el-form-item label="kafka地址" prop="kafkaAddr">
          <el-input type="textarea"
            v-model.trim="deptForm.kafkaAddr"
            placeholder="请输入kafka地址，多个用逗号分隔" :rows="3">
          </el-input>
        </el-form-item>
        <el-form-item>
          <p class="font-tip">示例：10.10.10.60:9092,10.10.10.127:9092</p>
        </el-form-item>
        <el-form-item style="text-align: center" label-width="0px">
          <el-button size="small" type="primary" @click="saveDept">保存</el-button>
          <el-button size="small" @click="closeDept">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
/**
 * 菜单 - 部门管理入口
 */
import globalMixins from '@/mixins/globalMixins.js'
import service from './dept-service.js'
export default {
  mixins: [globalMixins, service],
  data () {
    return {
      deptData: [],
      dialogVisible: false,
      deptTitle: '查看',
      deptForm: {
        kafkaAddr: '',
        deptName: '',
        uId: ''
      },
      rules: {
        deptName: [
          { required: true, message: '请输入部门名称', trigger: 'blur' }
        ],
        kafkaAddr: [
          { required: true, message: 'kafka地址', trigger: 'blur' }
        ]
      },
      multipleSelection: '',
      operType: 'add',
      canSet: false
    }
  },
  methods: {
    handleDept (type, param) {
      this.operType = type
      switch (type) {
        case 'add':
          this.deptTitle = '新增部门'
          this.deptForm = {
            name: '',
            property: '1'
          }
          break
        case 'edit':
          this.deptTitle = '编辑部门'
          this.deptForm = {
            deptName: param.deptName,
            kafkaAddr: param.kafkaAddr,
            uId: param.uid
          }
          break
      }
      this.dialogVisible = true
    },
    handleSelectionChange (val) {
      var ids = []
      for (let obj in val) {
        ids.push(val[obj].uid)
      }
      this.multipleSelection = ids.join(',')
    },
    closeDept () {
      this.dialogVisible = false
      this.$refs['deptForm'].resetFields()
    }
  },
  mounted () {
    this.init()
  }
}
</script>
<style scoped lang="postcss">
  .font-tip {
    font-size: var(--font-size-default);
    color: #929fb4;
  }
</style>
