<template>
  <div id="fileidssAgent">
    <el-form size="small" label-width="120px" :model="monitorData" :rules="rules" ref="monitorData">
      <el-form-item label="标题名称" prop="title">
        <el-input v-model="monitorData.title" placeholder="请输入标题名称"></el-input>
      </el-form-item>
      <el-form-item label="采集节点IP" prop="collectNodeIps">
        <el-select
          v-model="monitorData.collectNodeIps"
          placeholder="请选择"
          style="width: 100%">
          <el-option
            v-for="item in options"
            :key="item.workerIp"
            :label="item.workerIp"
            :value="item.workerIp"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="源类型">
        <el-radio v-model="fileType" label="file" @change="change">文件</el-radio>
        <el-radio v-model="fileType" label="spool" @change="change">目录</el-radio>
      </el-form-item>
      <el-form-item v-if="fileType==='file'" label="文件" prop="filePath">
        <el-input v-model="monitorData.filePath" placeholder="请输入文件路径"></el-input>
      </el-form-item>
      <el-form-item v-if="fileType==='spool'" label="目录" prop="spoolDir">
        <el-input v-model="monitorData.spoolDir" placeholder="请输入目录"></el-input>
      </el-form-item>
      <el-form-item label="字符编码" prop="sourceCharset">
        <el-select
          v-model="monitorData.sourceCharset"
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
      <el-row class="idss-margin--b-l">
        <p style="text-align: center;" @click="extendBtn()">
          <i class="el-icon-caret-bottom" v-if="!down_top">展开</i>
          <i class="el-icon-caret-top" v-if="down_top">收起</i>
        </p>
      </el-row>

      <el-form-item v-if="down_top && fileType==='spool'" label="正则匹配" prop="filePattern">
        <el-input type="textarea" v-model="monitorData.filePattern" placeholder="正则匹配所要采集的文件"></el-input>
      </el-form-item>

      <el-form-item v-if="down_top" label="日志源IP" prop="clientIp">
        <el-input v-model="monitorData.clientIp" placeholder="请输入日志源IP" @blur="checkIP($event)"></el-input>
        <div class="el-form-item__error" v-if="ip_true">请输入正确的ip</div>
      </el-form-item>

      <el-form-item v-if="down_top" label="日志源设备类型" prop="logType">
        <el-select
          v-model="monitorData.logType"
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

    <el-row v-if="message===undefined" style="text-align:center;">
      <el-button size="small" custom type="primary" @click="save('monitorData')">确定</el-button>
      <el-button size="small" custom @click="closeDialog('monitorData','add')">取消</el-button>
    </el-row>

    <el-row v-if="message!==undefined" style="text-align:center;">
      <el-button size="small" custom type="primary" @click="edit_save('monitorData')">保存</el-button>
      <el-button size="small" custom @click="closeDialog('monitorData','edit')">取消</el-button>
    </el-row>
  </div>
</template>

<script>
import globalMixins from '@/mixins/globalMixins.js'
import dictionary from '@/views/manage/data/file-save/dictionary.js'
import service from './input-common-service.js'

export default {
  name: 'idss-input-file',
  mixins: [globalMixins, service],
  props: {
    message: Object,  // 编辑使用
    sendMsg: Object   // 新增使用
  },
  watch: {
    message: {
      handler (val, oldVal) {
        if (val) {
          this.deptUid = val.uid
          for (var typeIndex in val['data']) {
            // 类别索引1和4均为文件目录
            if (typeIndex === '1' || typeIndex === '4') {
              this.monitorData = Object.assign(this.monitorData, val['data'][typeIndex])
              // 包含spoolDir则为 目录，否则为文件 源类型，目录|文件
              this.fileType = this.monitorData.spoolDir ? 'spool' : 'file'
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
          this.fileType = val.type
          if (val.data) {
            this.monitorData = Object.assign(this.monitorData, val.data)
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
      fileType: 'file',
      filename: '文件',
      down_top: false,
      deviceTypes: dictionary.deviceTypes,
      options: [],
      charsets: dictionary.charsets,
      ip_true: false,
      monitorData: {
        title: '',
        collectNodeIps: '',
        filePath: '', // 文件
        spoolDir: '', // 目录
        sourceCharset: 'UTF-8',
        clientIp: '',
        filePattern: '',
        logType: ''
      },
      editfileData: {},
      rules: {
        title: [
          { required: true, message: '请输入标题名称', trigger: 'blur' }
        ],
        collectNodeIps: [
          { required: true, message: '请选择采集节点IP', trigger: 'change' }
        ],
        filePath: [
          { required: true, message: '请输入文件路径', trigger: 'blur' }
        ],
        spoolDir: [
          { required: true, message: '请输入目录路径', trigger: 'blur' }
        ],
        sourceCharset: [
          { required: false, message: '请输入编码格式', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    change (item) {
      if (item === 'file') {
        this.filename = '文件:'
        // this.monitorData.filePath = ''
        this.$refs.monitorData.validateField('filePath')
        // delete this.monitorData.spoolDir
      } else if (item === 'spool') {
        this.filename = '目录:'
        this.$refs.monitorData.validateField('spoolDir')
        // this.monitorData.spoolDir = ''
        // delete this.monitorData.filePath
      }
    },

    save (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // if (this.fileType === 'file') {
          //   delete this.monitorData.spoolDir
          // } else if (this.fileType === 'spool') {
          //   delete this.monitorData.filePath
          // }
          this.$emit('close', 1)
          this.$emit('change-data', [this.monitorData, this.fileType])
        } else {
          return false
        }
      })
    },
    edit_save (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let monitorData = JSON.parse(JSON.stringify(this.monitorData))
          if (this.fileType === 'file') {
            this.editfileData = {
              jobSerialNumber: this.message['num'],
              collect: {
                collect_src_type: 1,
                file: monitorData
              }
            }
            delete monitorData.spoolDir
          } else if (this.fileType === 'spool') {
            this.editfileData = {
              jobSerialNumber: this.message['num'],
              collect: {
                collect_src_type: 4,
                spool: monitorData
              }
            }
            delete monitorData.filePath
          }
          this.$request({
            method: 'post',
            url: '/api/setting/etl/job/ui/collect-edit',
            data: this.editfileData
          }).then((content) => {
            this.$message({
              type: 'success',
              message: '修改成功'
            })
            this.$emit('close', 1)
            this.$emit('data-change', [this.monitorData, this.fileType])
          }, (error) => {
            this.$message({
              type: 'error',
              message: error.message
            })
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>
