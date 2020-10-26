<template>
  <div id="kafka">
    <el-form label-width="120px" size="small" :model="kafkaData" :rules="rules" ref="kafkaData">
      <el-form-item label="标题名称" prop="title">
        <el-input v-model="kafkaData.title" placeholder="请输入标题名称"></el-input>
      </el-form-item>
      <el-form-item label="采集节点IP" prop="collectNodeIps">
        <el-select v-model="kafkaData.collectNodeIps" placeholder="请选择" style="width: 100%">
          <el-option
            v-for="item in options"
            :key="item.workerIp"
            :label="item.workerIp"
            :value="item.workerIp"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="数据源地址" prop="sourceAddr">
        <el-input v-model="kafkaData.sourceAddr" placeholder="请输入数据源地址"></el-input>
      </el-form-item>
      <el-form-item>
        <p class="example_d">示例：192.168.1.100:2181</p>
        <p class="example_d">多个地址用逗号 ',' 隔开，如 192.168.1.100:2181,192.168.1.100:2181</p>
      </el-form-item>
      <el-form-item label="数据源topic" prop="sourceTopic">
        <el-input v-model="kafkaData.sourceTopic" placeholder="请输入数据源topic"></el-input>
      </el-form-item>
      <el-form-item label="protocol:" style="margin-bottom: 0">
        <el-input v-model="kafkaData.protocol" placeholder="请输入protocol"></el-input>
      </el-form-item>
      <el-form-item style="margin-bottom: 0">
        <p class="example_d">示例：SSL</p>
      </el-form-item>
      <el-row class="demoLine">
        <el-form-item style="margin-bottom: 0" label-width="60px">
          <h4 style="font-weight: 500">truststore</h4>
        </el-form-item>
        <el-col :span="12">
          <el-form-item label="Location:" style="margin-bottom: 0">
            <el-input v-model="kafkaData.truststoreLocation" placeholder="请输入truststoreLocation"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item style="margin-bottom: 0" label="Password:">
            <el-input
              v-model="kafkaData.truststorePassword"
              type="password"
              placeholder="请输入truststorePassword"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item style="margin-bottom: 0" label-width="120px">
        <p class="example_d">示例：/home/certificates/kafka.truststore</p>
      </el-form-item>
      <el-row class="demoLine">
        <el-form-item style="margin-bottom: 0" label-width="60px">
          <h4 style="font-weight: 500">keystore</h4>
        </el-form-item>
        <el-col :span="12">
          <el-form-item label="Location:" style="margin-bottom: 0">
            <el-input v-model="kafkaData.keystoreLocation" placeholder="请输入keystoreLocation"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item style="margin-bottom: 0" label="Password:">
            <el-input
              v-model="kafkaData.keystorePassword"
              type="password"
              placeholder="请输入keystorePassword"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item style="margin-bottom: 0" label-width="120px">
        <p class="example_d">示例：/home/certificates/kafka.keystore</p>
      </el-form-item>
      <el-form-item label="keyPassword:">
        <el-input v-model="kafkaData.keyPassword" type="password" placeholder="请输入keyPassword"></el-input>
      </el-form-item>
      <el-form-item class="extendBtn">
        <p style="text-align: center;" @click="extendBtn()">
          <i class="el-icon-caret-bottom" v-if="!down_top">展开</i>
          <i class="el-icon-caret-top" v-if="down_top">收起</i>
        </p>
      </el-form-item>
      <el-form-item label="日志源IP" v-if="down_top">
        <el-input v-model="kafkaData.clientIp" placeholder="请输入日志源IP" @blur="checkIP($event)"></el-input>
      </el-form-item>
      <el-form-item label="日志源设备类型" v-if="down_top">
        <el-select v-model="kafkaData.logType" placeholder="请选择" class="select" style="width: 100%">
          <el-option
            v-for="item in deviceTypes"
            :key="item.value"
            :label="item.label"
            :value="item.value"></el-option>
        </el-select>
      </el-form-item>
    </el-form>

    <el-row v-if="message===undefined" style="text-align:center;">
      <el-button size="small" custom type="primary" @click="save('kafkaData')">确定</el-button>
      <el-button size="small" custom @click="closeDialog('kafkaData', 'add')">取消</el-button>
    </el-row>

    <el-row v-if="message!==undefined" style="text-align:center;">
      <el-button size="small" custom type="primary" @click="edit_save('kafkaData')">保存</el-button>
      <el-button size="small" custom @click="closeDialog('kafkaData', 'edit')">取消</el-button>
    </el-row>
  </div>
</template>

<script>
import globalMixins from '@/mixins/globalMixins.js'
import dictionary from '@/views/manage/data/file-save/dictionary.js'
import inputCommonService from './input-common-service.js'
import service from '@/views/manage/data/data/out-file/out-common-service.js'

export default {
  name: 'idss-input-kafka',
  mixins: [globalMixins, service, inputCommonService],
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
            if (obj === '7') {
              this.kafkaData = Object.assign(this.kafkaData, val['data'][obj])
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
          if (val.data && val.type === 'kafka') {
            this.kafkaData = Object.assign(this.kafkaData, val.data)
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
      options: [],
      nodeList: [],
      deviceTypes: dictionary.deviceTypes,
      kafkaData: {
        collectNodeIps: '',
        title: '',
        logType: '',
        sourceAddr: '',
        sourceTopic: '',
        protocol: '',
        truststoreLocation: '',
        truststorePassword: '',
        keystoreLocation: '',
        keystorePassword: '',
        keyPassword: '',
        clientIp: ''
      },
      rules: {
        title: [
          { required: true, message: '请输入标题名称', trigger: 'blur' }
        ],
        collectNodeIps: [
          { required: true, message: '请选择采集节点IP', trigger: 'change' }
        ],
        sourceAddr: [
          { required: true, message: '请输入数据源地址', trigger: 'blur' }
        ],
        sourceTopic: [
          { required: true, message: '请输入数据源topic', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    save (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$emit('close', 1)
          this.$emit('change-data', [this.kafkaData, 'kafka'])
        } else {
          return false
        }
      })
    },
    edit_save (formName) {
      this.editfileData = {
        jobSerialNumber: this.message['num'],
        collect: {
          collect_src_type: 7,
          kafka: this.kafkaData
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
            this.$emit('change-data', [this.kafkaData, 'kafka'])
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
