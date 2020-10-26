<template>
  <div>
    <el-form size="medium" label-width="120px" :model="formData" :rules="formRules" ref="form">
      <el-form-item class="idss-txt--right" v-if="type === 'add'">
        <el-button size="medium" @click="importClientMonitor">批量导入</el-button>
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item label="IP地址" prop="ip" :error="formError.ip">
            <el-input v-model="formData.ip" placeholder="请输入IP地址"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="日志类型" prop="logType" :error="formError.logType">
            <el-input v-model="formData.logType" placeholder="请输入日志类型"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="设备类型" prop="deviceType" :error="formError.deviceType">
            <el-input v-model="formData.deviceType" placeholder="请输入设备类型"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="设备物理地址" prop="macAddr" :error="formError.macAddr">
            <el-input v-model="formData.macAddr" placeholder="请输入设备物理地址"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="设备逻辑地址" prop="logicAddr" :error="formError.logicAddr">
            <el-input v-model="formData.logicAddr" placeholder="请输入设备逻辑地址"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="主机名" prop="hostName" :error="formError.hostName">
            <el-input v-model="formData.hostName" placeholder="请输入主机名"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="负责人" prop="ownerName" :error="formError.ownerName">
            <el-input v-model="formData.ownerName" placeholder="请输入负责人"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="采集日志方式" prop="collectType" :error="formError.collectType">
            <el-input v-model="formData.collectType" placeholder="请输入采集日志方式"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="对应采集器IP" prop="collectorIp" :error="formError.collectorIp">
            <el-input v-model="formData.collectorIp" placeholder="请输入对应采集器IP"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否采集" prop="collectFlg">
            <el-switch
              size="medium"
              v-model="formData.collectFlg"
              :inactive-value="0"
              :active-value="1"
              inactive-text="关"
              active-text="开"></el-switch>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="是否监控" prop="monitorFlg">
            <el-switch
              size="medium"
              v-model="formData.monitorFlg"
              :inactive-value="0"
              :active-value="1"
              inactive-text="关"
              active-text="开"></el-switch>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="dialog-footer idss-txt--center">
      <el-button size="medium" @click="save" type="primary">保存</el-button>
      <el-button size="medium" @click="reset">重置</el-button>
      <el-button size="medium" @click="close">取消</el-button>
    </div>

    <el-dialog
      title="批量导入"
      :visible.sync="importDialogVisible"
      :close-on-click-modal="false"
      width="50%"
      append-to-body>
      <client-monitor-import-dialog :key="importDialogKey" :visible.sync="importDialogVisible"></client-monitor-import-dialog>
    </el-dialog>
  </div>
</template>
<script>
import validator from 'validator'
import { getErrorMsgByEnd } from '@/custom/utils/base.js'
import clientMonitorImportDialog from '@/views/manage/monitor/setting-components/client-monitor-import-dialog.vue'
export default {
  name: 'client-monitor-dialog',
  components: {
    clientMonitorImportDialog
  },
  props: {
    type: String,
    data: {
      type: Object,
      default: function () {
        return {
          id: '',
          ip: '',
          logType: '',
          deviceType: '',
          macAddr: '',
          logicAddr: '',
          hostName: '',
          ownerName: '',
          collectorIp: '',
          collectType: '',
          collectFlg: 1,
          monitorFlg: 1
        }
      }
    }
  },
  data () {
    var isIP = (rule, value, callback) => {
      if (!validator.isIP(value)) {
        callback(new Error('IP地址格式不正确'))
      } else {
        callback()
      }
    }
    return {
      formData: {},
      formRules: {
        ip: [
          { required: true, message: '请输入IP地址', trigger: 'blur' },
          { validator: isIP, trigger: 'blur' }
        ],
        collectorIp: [
          { required: true, message: '请输入对应采集器IP', trigger: 'blur' },
          { validator: isIP, trigger: 'blur' }
        ]
      },
      formError: {},
      importDialogVisible: false,
      importDialogKey: undefined
    }
  },
  methods: {
    save () {
      this.$refs['form'].validate(async (valid) => {
        if (valid) {
          this.formError = {}
          let method = 'post'
          let { id, ...data } = this.formData
          if (this.type === 'edit') {
            method = 'put'
            data.id = id
          }
          try {
            // 【弹窗调用】保存、编辑数据
            await this.$request({
              url: '/api/monitor/configuration-client',
              method,
              data
            }, { isPromptError: false })
            this.close()
            // 触发父页面刷新
            this.$emit('updated')
          } catch (error) {
            this.formError = getErrorMsgByEnd(error)
          }
        }
      })
    },
    reset () {
      this.$refs['form'].resetFields()
    },
    close () {
      this.$emit('update:visible', false)
    },
    /* *************** 批量导入 **************** */
    importClientMonitor () {
      this.importDialogVisible = true
      this.importDialogKey = +new Date()
    }
  },
  created () {
    this.formData = JSON.parse(JSON.stringify(this.data))
  }
}
</script>
