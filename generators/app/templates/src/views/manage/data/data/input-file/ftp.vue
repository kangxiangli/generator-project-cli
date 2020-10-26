<template>
  <div id="idssAgentlog">
    <el-form label-width="120px" size="small" :model="ftpData" :rules="rules" ref="ftpData">
      <el-form-item label="标题名称" prop="title">
        <el-input v-model="ftpData.title" placeholder="请输入标题名称"></el-input>
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-select v-model="ftpData.type" placeholder="请选择" style="width: 100%">
          <el-option
            v-for="item in ftpTypes"
            :key="item.value"
            :label="item.label"
            :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="采集节点IP" prop="collectNodeIps">
        <el-select
          v-model="ftpData.collectNodeIps"
          placeholder="请选择"
          style="width: 100%">
          <el-option
            v-for="item in options"
            :key="item.workerIp"
            :label="item.workerIp"
            :value="item.workerIp"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="服务器IP" prop="serverIp">
        <el-input v-model="ftpData.serverIp" placeholder="FTP服务器IP"></el-input>
      </el-form-item>
      <el-form-item label="用户名" prop="user">
        <el-input v-model="ftpData.user" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="ftpData.password" type="password" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item label="目录" prop="directory">
        <el-input v-model="ftpData.directory" placeholder="请输入目录地址"></el-input>
      </el-form-item>
      <el-form-item label="字符编码" prop="sourceCharset">
        <el-select
          v-model="ftpData.sourceCharset"
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
        <el-input
          v-model="ftpData.clientIp"
          placeholder="请输入日志源IP"
          @blur="checkIP($event)"></el-input>
      </el-form-item>
      <el-form-item label="日志源设备类型" v-if="down_top">
        <el-select
          v-model="ftpData.logType"
          placeholder="请选择"
          class="select"
          style="width: 100%">
          <el-option
            v-for="item in deviceTypes"
            :key="item.value"
            :label="item.label"
            :value="item.value"></el-option>
        </el-select>
      </el-form-item>
    </el-form>

    <el-row v-if="message===undefined" style="text-align:center">
      <el-button size="small" custom @click="save('ftpData')" type="primary">确定</el-button>
      <el-button size="small" custom @click="closeDialog('ftpData', 'add')">取消</el-button>
    </el-row>

    <el-row v-if="message!==undefined" style="text-align:center">
      <el-button size="small" custom @click="edit_save('ftpData')" type="primary">保存</el-button>
      <el-button size="small" custom @click="closeDialog('ftpData','edit')">取消</el-button>
    </el-row>
  </div>
</template>

<script>
import globalMixins from '@/mixins/globalMixins.js'
import dictionary from '@/views/manage/data/file-save/dictionary.js'
import service from './input-common-service.js'
export default {
  name: 'idss-input-ftp',
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
            if (obj === '5') {
              this.ftpData = Object.assign(this.ftpData, val['data'][obj])
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
          if (val.data && val.type === 'ftp') {
            this.ftpData = Object.assign(this.ftpData, val.data)
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
      ftpData: {
        title: '',
        type: '',
        collectNodeIps: '',
        serverIp: '',
        user: '',
        password: '',
        directory: '',
        sourceCharset: 'UTF-8',
        logType: '',
        clientIp: ''
      },
      ftpTypes: [{
        label: 'ftp',
        value: 'ftp'
      }, {
        label: 'sftp',
        value: 'sftp'
      }],
      editfileData: {},
      rules: {
        title: [
          { required: true, message: '请选择标题名称', trigger: 'change' }
        ],
        type: [
          { required: true, message: '请选择采集类型', trigger: 'change' }
        ],
        collectNodeIps: [
          { required: true, message: '请选择采集节点IP', trigger: 'change' }
        ],
        serverIp: [
          { required: true, message: '请输入服务器IP', trigger: 'blur' },
          { validator: this.checkIPRule, trigger: 'blur' }
        ],
        user: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        directory: [
          { required: true, message: '请输入文件目录', trigger: 'blur' }
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
          this.$emit('change-data', [this.ftpData, 'ftp'])
        } else {
          return false
        }
      })
    },
    edit_save (formName) {
      this.editfileData = {
        jobSerialNumber: this.message['num'],
        collect: {
          collect_src_type: 5,
          ftp: this.ftpData
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
            this.$emit('change-data', [this.ftpData, 'ftp'])
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
.extendBtn >>> .el-form-item__content {
  margin-left: 0 !important;
}
</style>
