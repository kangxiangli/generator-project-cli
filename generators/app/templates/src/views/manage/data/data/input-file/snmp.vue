<template>
  <div id="snmp">
    <el-form label-width="120px" size="small" :model="snmpData" :rules="rules" ref="snmpData">
      <el-form-item label="标题名称" prop="title">
        <el-input v-model="snmpData.title" placeholder="请输入标题名称"></el-input>
      </el-form-item>
      <el-form-item label="采集节点IP" prop="collectNodeIps">
        <el-select v-model="snmpData.collectNodeIps" placeholder="请选择" style="width: 100%">
          <el-option
            v-for="item in options"
            :key="item.workerIp"
            :label="item.workerIp"
            :value="item.workerIp"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="端口" prop="port">
        <el-input v-model.number="snmpData.port" placeholder="请输入端口"></el-input>
      </el-form-item>
      <el-form-item label="字符编码" prop="sourceCharset">
        <el-select
          v-model="snmpData.sourceCharset"
          clearable
          filterable
          allow-create
          placeholder="请选择"
          style="width: 100%">
          <el-option
            v-for="item in charsets"
            :key="item.value"
            :label="item.label"
            :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="extendBtn">
        <p style="text-align: center;" @click="extendBtn()">
          <i class="el-icon-caret-bottom" v-if="!down_top">展开</i>
          <i class="el-icon-caret-top" v-if="down_top">收起</i>
        </p>
      </el-form-item>
      <el-form-item label="日志源IP" v-if="down_top">
        <el-input v-model="snmpData.clientIp" placeholder="请输入日志源IP" @blur="checkIP($event)"></el-input>
      </el-form-item>
      <el-form-item label="日志源设备类型" v-if="down_top">
        <el-select v-model="snmpData.logType" placeholder="请选择" class="select" style="width: 100%">
          <el-option
            v-for="item in deviceTypes"
            :key="item.value"
            :label="item.label"
            :value="item.value"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <el-row v-if="message===undefined" style="text-align:center;">
      <el-button size="small" custom @click="save('snmpData')" type="primary">确定</el-button>
      <el-button size="small" custom @click="closeDialog('snmpData', 'add')">取消</el-button>
    </el-row>
    <el-row v-if="message!==undefined" style="text-align:center;">
      <el-button size="small" custom @click="edit_save('snmpData')" type="primary">保存</el-button>
      <el-button size="small" custom @click="closeDialog('snmpData','edit')">取消</el-button>
    </el-row>
  </div>
</template>

<script>
import globalMixins from '@/mixins/globalMixins.js'
import dictionary from '@/views/manage/data/file-save/dictionary.js'
import service from './input-common-service.js'
export default {
  mixins: [globalMixins, service],
  props: {
    message: Object,
    sendMsg: Object
  },
  watch: {
    message: {
      handler (val, oldVal) {
        if (val !== undefined) {
          this.deptUid = val.uid
          for (var obj in val['data']) {
            if (obj === '8') {
              this.snmpData = Object.assign(this.snmpData, val['data'][obj])
              this.snmpData.port = parseInt(val['data'][obj].port)
            }
          }
        }
      },
      deep: true,
      immediate: true
    },
    sendMsg: {
      handler (val, oldVal) {
        if (val) {
          this.deptUid = val.uid
          if (val.data && val.type === 'snmp') {
            this.snmpData = Object.assign(this.snmpData, val.data)
          }
        }
      },
      deep: true,
      immediate: true
    }
  },
  data () {
    return {
      deptUid: '',
      down_top: false,
      deviceTypes: dictionary.deviceTypes,
      options: [],
      charsets: dictionary.charsets,
      ip_true: false,
      snmpData: {
        title: '',
        clientIp: '',
        collectNodeIps: '',
        port: '',
        logType: '',
        sourceCharset: 'UTF-8'
      },
      editfileData: {},
      rules: {
        title: [
          { required: true, message: '请输入标题名称', trigger: 'blur' }
        ],
        collectNodeIps: [
          { required: true, message: '请选择采集节点IP', trigger: 'change' }
        ],
        port: [
          { required: true, message: '请输入端口', trigger: 'blur' },
          { type: 'number', min: 0, max: 65535, message: '长度在0到65535之间', trigger: 'change' }
        ],
        sourceCharset: [
          { required: false, message: '请输入编码格式', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    save (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$emit('close', 1)
          this.$emit('change-data', [this.snmpData, 'snmp_trap'])
        } else {
          return false
        }
      })
    },
    edit_save (formName) {
      this.editfileData = {
        jobSerialNumber: this.message['num'],
        collect: {
          collect_src_type: 8,
          snmp_trap: this.snmpData
        }
      }
      this.$refs[formName].validate((valid) => {
        var this_ = this
        if (valid) {
          this_.$request({
            method: 'post',
            url: '/api/setting/etl/job/ui/collect-edit',
            data: this_.editfileData
          }).then((content) => {
            this_.$message({
              type: 'success',
              message: '修改成功'
            })
            this_.$emit('close', 1)
            this.$emit('change-data', [this.snmpData, 'snmp_trap'])
          }, (error) => {
            console.log(error)
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style scoped lang="postcss">
#idssAgentlog .el-form-item .el-input--small .el-input__inner {
  height: 40px;
  line-height: 40px;
}
.extendBtn >>> .el-form-item__content {
  margin-left: 0 !important;
}
</style>
