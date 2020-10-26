<template>
  <div class="data-monitor-container">
    <idss-widget
      :global-style="{margin: '2px 0 0'}"
      :header-style="{padding: '10px 15px 10px'}"
      :footer-style="{padding: '6px 0'}">
      <template slot="title-right">
        <el-button size="small" @click="editConfirm('add')">
          <idss-icon-svg name="add"></idss-icon-svg>&nbsp;新建作业
        </el-button>
      </template>
      <el-table
        :data="table.data"
        :max-height="TABLE_HEIGHT.HIGH"
        style="width: 100%"
        border
        stripe
        v-loading="loading['info-table-loading']">
        <template slot="empty">
          <idss-no-data></idss-no-data>
        </template>
        <el-table-column type="index" width="45" label="序号" align="center"></el-table-column>
        <el-table-column prop="job" label="任务ID" align="center"></el-table-column>
        <el-table-column prop="jobDescription" label="任务描述" align="center"></el-table-column>
        <el-table-column label="操作" width="126" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              plain
              type="primary"
              @click="editConfirm('config', scope.row)">设置</el-button>
            <el-button size="mini" plain  type="danger" @click="delConfirm(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <template slot="footer">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="table.pageNum"
          :page-sizes="[20, 50, 100, 200]"
          :page-size="table.pageSize"
          layout="total, prev, pager, next, jumper"
          :total="table.total"></el-pagination>
      </template>
    </idss-widget>

    <!-- 添加服务器dialog -->
    <el-dialog
      title="添加作业"
      :visible.sync="editDialogVisible"
      width="500px"
      :close-on-click-modal="false"
      @close="resetEditForm()">
      <el-form
        label-width="120px"
        :model="editForm"
        :rules="editFormRules"
        ref="editForm"
        size="medium"
        @submit.native.prevent>
        <el-form-item label="作业名称" prop="job" :error="editFormError.job">
          <el-select v-model="editForm.job" placeholder="请选择要追加的作业">
            <el-option
              v-for="job in editForm.jobList"
              :key="job.key"
              :label="job.name"
              :value="job.key"></el-option>
          </el-select>
        </el-form-item>
        <div class="idss-txt--center">
          <el-button :loading="editBtnLoading" @click="add" type="primary">确定</el-button>
          <el-button @click="editDialogVisible = false">取消</el-button>
        </div>
      </el-form>
    </el-dialog>

    <!-- list配置dialog -->
    <el-dialog
      title="告警配置"
      :visible.sync="configDialogVisible"
      width="680px"
      :close-on-click-modal="false"
      @close="resetConfigForm()">
      <el-form
        label-width="180px"
        size="medium"
        :inline="true"
        :model="configForm"
        :rules="configFormRules"
        ref="configForm"
        v-loading="loading['info-dialog-loading']"
        @submit.native.prevent>
        <el-form-item label-width="70px" label="任务ID">{{ configForm.job }}</el-form-item>
        <el-form-item label-width="100px" label="任务描述">{{ configForm.jobDescription }}</el-form-item>
        <idss-widget shadow="never" :footer-style="{padding: '6px 0'}">
          <template slot="title-left">告警条件</template>
          <el-form-item
            label-width="150px"
            label="匹配条数/总条数占比"
            prop="dataOperator"
            :error="configFormError.dataOperator">
            <el-select v-model="configForm.dataOperator" placeholder="请选择">
              <el-option
                v-for="item in operatorList"
                :key="item.value"
                :label="item.label"
                :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label prop="dataVal" :error="configFormError.dataVal">
            <el-input v-model="configForm.dataVal" placeholder="请输入百分比"></el-input>
          </el-form-item>
          <el-form-item label prop="dataFlg" :error="configFormError.dataFlg">
            <el-switch
              size="medium"
              v-model="configForm.dataFlg"
              :inactive-value="0"
              :active-value="1"
              active-text="开"
              inactive-text="关"></el-switch>
          </el-form-item>
          <template slot="footer">
            <el-button size="medium" @click="save" type="primary">保存</el-button>
            <el-button size="medium" @click="reset">重置</el-button>
            <el-button size="medium" @click="configDialogVisible = false">取消</el-button>
          </template>
        </idss-widget>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import globalMixins from '@/mixins/globalMixins.js'
import service from '@/views/manage/monitor/setting-service.js'
export default {
  name: 'service-monitor',
  mixins: [globalMixins, service],
  data () {
    // 自定义验证 验证数字范围
    let validateRangeNumber = (rule, value, callback) => {
      const val = value * 1
      if (!Number.isInteger(val)) {
        callback(new Error('请输入数值'))
      } else {
        if (val < 0 || val > 100) {
          callback(new Error('数值应该在0 - 100之间'))
        } else {
          callback()
        }
      }
    }

    return {
      defaultSort: { prop: 'job', order: 'descending' },
      table: {
        total: 0,
        pageNum: 1,
        pageSize: 20,
        data: [],
        dataAll: [],
        sorts: ['-job']
      },
      // 删除弹窗
      delRow: {},                     // 删除时当前临时记录
      delDialogVisible: false,        // 删除弹出框弹出框显示状态
      // 新增
      editRow: {},                    // 编辑时当前临时记录
      editBtnLoading: false,          // 编辑按钮的加载状态
      editDialogVisible: false,       // 编辑弹出框显示状态
      // 新增 - 表单 & 验证
      editForm: {
        jobList: [],
        job: ''
      },
      editFormError: {},
      editFormRules: {
        job: [
          { required: true, message: '字段不能为空', trigger: 'blur' }
        ]
      },
      // 告警配置
      configRow: {},
      configDialogVisible: false,       // 告警配置弹出框显示状态
      configDialogLoading: false,       // 告警配置弹出框Loading
      operatorList: [
        {
          value: 1,
          label: '>'
        }, {
          value: 2,
          label: '>='
        }, {
          value: 3,
          label: '='
        }, {
          value: 4,
          label: '<'
        }, {
          value: 5,
          label: '<='
        }
      ],
      // 告警配置 - 表单 & 验证
      configForm: {
        'job': '',
        'jobDescription': '',
        'dataOperator': 1,
        'dataVal': 0,
        'dataFlg': 0
      },
      configFormClone: {},    // 重置表单使用
      configFormError: {},
      configFormRules: {
        dataVal: [
          // { required: true, message: '字段不能为空', trigger: 'blur' },
          { validator: validateRangeNumber, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 新增 & 告警配置
    async editConfirm (type, row) {
      if (type === 'add') {
        await this.getInfoDataList()
        this.editDialogVisible = true
      } else if (type === 'config') {
        this.configRow = row
        this.configDialogLoading = true
        this.configDialogVisible = true
        this.queryConfigInfoData(this.configRow.id)
      }
    },
    add () {
      // 表单验证
      this.$refs['editForm'].validate((valid) => {
        if (valid) {
          this.addInfoData(this.editForm.job)
        }
      })
    },
    // 表单重置
    resetEditForm () {
      this.$refs['editForm'].resetFields()
      this.editForm = {
        job: ''
      }
      this.$refs['editForm'].clearValidate()
    },
    // 告警配置 保存
    save () {
      // 表单验证
      this.$refs['configForm'].validate((valid) => {
        if (valid) {
          this.saveConfigInfoData(this.configRow.id)
        }
      })
    },
    // 告警配置 重置
    reset () {
      this.configForm = JSON.parse(JSON.stringify(this.configFormClone))
    },
    // 表单重置 清空
    resetConfigForm () {
      this.$refs['configForm'].resetFields()
      this.configForm = {
        'job': '',
        'jobDescription': '',
        'dataOperator': 1,
        'dataVal': 0,
        'dataFlg': 0
      }
      this.$refs['configForm'].clearValidate()
    },
    // 删除框
    delConfirm (row) {
      this.delRow = row
      // 确认提示
      this.confirmBox({
        message: `是否要删除数据吗?`,
        title: '提示',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(_ => {
        this.del()
      })
    },
    // 删除
    del () {
      this.deleteInfoData(this.delRow.id)
    },
    // table 相关方法
    limit () {
      this.table.data = this.table.dataAll.slice(
        (this.table.pageNum - 1) * this.table.pageSize,
        this.table.pageNum * this.table.pageSize)
    },
    // 修改分页数量
    handleSizeChange (val) {
      this.table.pageSize = val
      this.limit()
    },
    // 切换分页
    handleCurrentChange (val) {
      this.table.pageNum = val
      this.limit()
    },
    // 加载table的方法
    list (type) {
      this.getInfoTableData()
    },
    init () {
      this.list('init')           // 列表
    }
  }
}
</script>
