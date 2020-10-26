<template>
  <div>
    <idss-widget
      :global-style="{margin: '2px 0 0'}"
      :header-style="{padding: '10px 15px 10px'}"
      :footer-style="{padding: '6px 0'}">
      <template slot="title-right">
        <el-button size="small" @click="editConfirm('add')">
          <idss-icon-svg name="add"></idss-icon-svg>
          <span>&nbsp;新建服务器</span>
        </el-button>
      </template>

      <el-table
        :data="table.data"
        :max-height="TABLE_HEIGHT.HIGH"
        style="width: 100%"
        border
        stripe
        v-loading="loading['service-table-loading']">
        <template slot="empty">
          <idss-no-data></idss-no-data>
        </template>
        <el-table-column type="index" width="45" label="序号" align="center"></el-table-column>
        <el-table-column prop="hostName" label="服务器名称" align="center"></el-table-column>
        <el-table-column prop="ip" label="服务器IP" align="center"></el-table-column>
        <el-table-column prop="use" label="服务器用途" align="center"></el-table-column>
        <el-table-column prop="system" label="操作系统" align="center"></el-table-column>
        <el-table-column label="操作" width="126" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              plain
              @click="editConfirm('config', scope.row)">设置</el-button>
            <el-button size="mini" type="danger" plain  @click="delConfirm(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <template slot="footer">
        <!-- @fixme 不能前端分页啊!! -->
        <!-- <div class="idss-txt--center padding-10"> -->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="table.pageNum"
          :page-sizes="[20, 50, 100, 200]"
          :page-size="table.pageSize"
          layout="total, prev, pager, next, jumper"
          :total="table.total"></el-pagination>
        <!-- </div> -->
      </template>
    </idss-widget>

    <!-- 添加服务器dialog -->
    <el-dialog
      title="添加服务器"
      :visible.sync="editDialogVisible"
      width="500px"
      :close-on-click-modal="false"
      @close="resetEditForm()">
      <el-form
        size="medium"
        label-width="100px"
        :model="editForm"
        :rules="editFormRules"
        ref="editForm"
        @submit.native.prevent>
        <el-form-item label="服务器名称" prop="hostName" :error="editFormError.hostName">
          <el-input v-model.trim="editForm.hostName" placeholder="输入服务器名称"></el-input>
        </el-form-item>
        <el-form-item label="服务器IP" prop="ip" :error="editFormError.ip">
          <el-input v-model="editForm.ip" placeholder="输入服务器IP"></el-input>
        </el-form-item>
        <el-form-item label="服务器用途" prop="use" :error="editFormError.use">
          <el-input v-model="editForm.use" placeholder="输入服务器用途"></el-input>
        </el-form-item>
        <el-form-item label="服务器系统" prop="system" :error="editFormError.system">
          <el-input v-model="editForm.system" placeholder="输入服务器系统"></el-input>
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
      width="650px"
      :close-on-click-modal="false"
      @close="resetConfigForm()">
      <el-form
        v-loading="loading['service-dialog-loading']"
        label-width="100px"
        :inline="true"
        :model="configForm"
        :rules="configFormRules"
        ref="configForm"
        size="medium"
        @submit.native.prevent>
        <el-form-item label="服务器IP">{{ configForm.ip }}</el-form-item>
        <el-form-item label="显示" prop="showFlg" :error="configFormError.showFlg">
          <el-switch
            size="medium"
            v-model="configForm.showFlg"
            :inactive-value="0"
            :active-value="1"
            active-text="开"
            inactive-text="关"></el-switch>
        </el-form-item>

        <idss-widget shadow="never">
          <template slot="title-left">告警条件</template>
          <el-form-item label="CPU使用率:" prop="cpuOperator" :error="configFormError.cpuOperator">
            <el-select v-model="configForm.cpuOperator" placeholder="请选择">
              <el-option
                v-for="item in operatorList"
                :key="item.value"
                :label="item.label"
                :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label prop="cpuVal" :error="configFormError.cpuVal">
            <el-input v-model="configForm.cpuVal" placeholder="请输入百分比"></el-input>
          </el-form-item>
          <el-form-item label prop="cpuFlg" :error="configFormError.cpuFlg">
            <el-switch
              size="medium"
              v-model="configForm.cpuFlg"
              :inactive-value="0"
              :active-value="1"
              active-text="开"
              inactive-text="关"></el-switch>
          </el-form-item>
          <!-- <br /> -->
          <el-form-item label="内存使用率" prop="memOperator" :error="configFormError.memOperator">
            <el-select v-model="configForm.memOperator" placeholder="请选择">
              <el-option
                v-for="item in operatorList"
                :key="item.value"
                :label="item.label"
                :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label prop="memVal" :error="configFormError.memVal">
            <el-input v-model="configForm.memVal" placeholder="请输入百分比"></el-input>
          </el-form-item>
          <el-form-item label prop="memFlg" :error="configFormError.memFlg">
            <el-switch
              size="medium"
              v-model="configForm.memFlg"
              :inactive-value="0"
              :active-value="1"
              active-text="开"
              inactive-text="关"></el-switch>
          </el-form-item>
          <el-form-item label="硬盘使用率" prop="diskOperator" :error="configFormError.diskOperator">
            <el-select v-model="configForm.diskOperator" placeholder="请选择">
              <el-option
                v-for="item in operatorList"
                :key="item.value"
                :label="item.label"
                :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label prop="diskVal" :error="configFormError.diskVal">
            <el-input v-model="configForm.diskVal" placeholder="请输入百分比"></el-input>
          </el-form-item>
          <el-form-item label prop="diskFlg" :error="configFormError.diskFlg">
            <el-switch
              size="medium"
              v-model="configForm.diskFlg"
              :inactive-value="0"
              :active-value="1"
              active-text="开"
              inactive-text="关"></el-switch>
          </el-form-item>
          <el-form-item
            label="网络吞吐量"
            prop="networkOperator"
            :error="configFormError.networkOperator">
            <el-select v-model="configForm.networkOperator" placeholder="请选择">
              <el-option
                v-for="item in operatorList"
                :key="item.value"
                :label="item.label"
                :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label prop="networkVal" :error="configFormError.networkVal">
            <el-input v-model="configForm.networkVal" placeholder="请输入数值(kbps)"></el-input>
          </el-form-item>
          <el-form-item label prop="networkFlg" :error="configFormError.networkFlg">
            <el-switch
              size="medium"
              v-model="configForm.networkFlg"
              :inactive-value="0"
              :active-value="1"
              active-text="开"
              inactive-text="关"></el-switch>
          </el-form-item>
          <template slot="footer">
            <el-button @click="save" type="primary">保存</el-button>
            <el-button @click="reset">重置</el-button>
            <el-button @click="configDialogVisible = false">取消</el-button>
          </template>
        </idss-widget>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import validator from 'validator'
import globalMixins from '@/mixins/globalMixins.js'
import service from '@/views/manage/monitor/setting-service.js'
export default {
  name: 'service-monitor',
  mixins: [globalMixins, service],
  data () {
    // 自定义验证 验证IP
    let validateIP = (rule, value, callback) => {
      let ip = this.editForm.ip
      if (!validator.isIP(ip)) {
        callback(new Error('请输入正确的IP地址'))
      } else {
        callback()
      }
    }

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

    // 自定义验证 验证数字
    let validateNumber = (rule, value, callback) => {
      const val = value * 1
      if (!Number.isInteger(val)) {
        callback(new Error('请输入数值'))
      } else {
        if (val < 0) {
          callback(new Error('数值应该大于0'))
        } else {
          callback()
        }
      }
    }

    return {
      defaultSort: { prop: 'ip', order: 'descending' },
      table: {
        total: 0,
        pageNum: 1,
        pageSize: 20,
        data: [],
        dataAll: [],
        sorts: ['-ip']
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
        ip: '',
        hostName: '',
        use: '',
        system: ''
      },
      editFormError: {},
      editFormRules: {
        hostName: [
          { required: true, message: '字段不能为空', trigger: 'blur' },
          { max: 50, message: '最长50个字符', trigger: 'blur' }
        ],
        ip: [
          { required: true, message: '字段不能为空', trigger: 'blur' },
          { validator: validateIP, trigger: 'blur' }
        ],
        use: [
          { max: 12, message: '最长12个字符', trigger: 'blur' }
        ],
        system: [
          { max: 50, message: '最长50个字符', trigger: 'blur' }
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
        'ip': '',
        'cpuOperator': 1,
        'cpuVal': 0,
        'cpuFlg': 0,
        'memOperator': 1,
        'memVal': 0,
        'memFlg': 1,
        'diskOperator': 1,
        'diskVal': 0,
        'diskFlg': 1,
        'networkOperator': 1,
        'networkVal': 0,
        'networkFlg': 1,
        'showFlg': 1
      },
      configFormClone: {},    // 重置表单使用
      configFormError: {},
      configFormRules: {
        cpuVal: [
          // { required: true, message: '字段不能为空', trigger: 'blur' },
          { validator: validateRangeNumber, trigger: 'blur' }
        ],
        memVal: [
          // { required: true, message: '字段不能为空', trigger: 'blur' },
          { validator: validateRangeNumber, trigger: 'blur' }
        ],
        diskVal: [
          // { required: true, message: '字段不能为空', trigger: 'blur' },
          { validator: validateRangeNumber, trigger: 'blur' }
        ],
        networkVal: [
          // { required: true, message: '字段不能为空', trigger: 'blur' },
          { validator: validateNumber, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 新增 & 告警配置
    editConfirm (type, row) {
      if (type === 'add') {
        this.editDialogVisible = true
      } else if (type === 'config') {
        this.configRow = row
        this.configDialogLoading = true
        this.configDialogVisible = true
        this.queryConfigServiceData(this.configRow.id)
      }
    },
    add () {
      // 表单验证
      this.$refs['editForm'].validate((valid) => {
        if (valid) {
          this.addServiceData()
        }
      })
    },
    // 表单重置
    resetEditForm () {
      this.$refs['editForm'].resetFields()
      this.editForm = {
        ip: '',
        hostName: '',
        use: '',
        system: ''
      }
      this.$refs['editForm'].clearValidate()
    },
    // 告警配置 保存
    save () {
      // 表单验证
      this.$refs['configForm'].validate((valid) => {
        if (valid) {
          this.saveConfigServiceData(this.configRow.id)
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
        'ip': '',
        'cpuOperator': 1,
        'cpuVal': 0,
        'cpuFlg': 0,
        'memOperator': 1,
        'memVal': 0,
        'memFlg': 1,
        'diskOperator': 1,
        'diskVal': 0,
        'diskFlg': 1,
        'networkOperator': 1,
        'networkVal': 0,
        'networkFlg': 1,
        'showFlg': 1
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
      this.deleteServiceData(this.delRow.id)
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
      this.getServiceTableData()
    },
    init () {
      this.list('init')           // 列表
    }
  }
}
</script>
