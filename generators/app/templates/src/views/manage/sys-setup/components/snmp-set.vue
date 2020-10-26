<template>
  <div>
    <idss-widget>
      <template slot="title-left">SNMP设置</template>
      <el-row>
        <el-col :span="19">
          <el-form
            plain
            :model="formData"
            :rules="formRules"
            label-width="190px"
            ref="form"
            v-loading="loading['form-list']">
            <el-form-item label="配置类型：" prop="snmpType">
              <el-select v-model="formData.snmpType" size="small" placeholder="请选择协议">
                <el-option
                  v-for="item in snmpTypeListData"
                  :key="item.key"
                  :label="item.value"
                  :value="item.key"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="snmp版本：" prop="snmpVersion">
              <el-select v-model="formData.snmpVersion" size="small" placeholder="请选择协议">
                <el-option
                  v-for="item in snmpVersionListData"
                  :key="item.key"
                  :label="item.value"
                  :value="item.key"></el-option>
              </el-select>
            </el-form-item>
            <el-row :gutter="10">
              <el-col :span="9">
                <el-form-item label="信任地址：">
                  <el-select v-model="trustDesti" size="small" placeholder="请选择">
                    <el-option label="IP" value="ip"></el-option>
                    <el-option label="Network" value="network"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item prop="trustDestiVal" label-width="0">
                  <el-input size="small" v-model.trim="formData.trustDestiVal"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-button type="primary" size="medium" custom @click="add">添加</el-button>
                <el-button
                  size="medium"
                  custom
                  :disabled="!formData.trustDesti.length"
                  @click="remove">删除</el-button>
              </el-col>
            </el-row>
            <el-form-item prop="trustDesti">
              <div class="box">
                <div v-for="(item, index) in formData.trustDesti" :key="index">
                  <el-button size="small" custom @click="currentIndex = index">{{item}}</el-button>
                </div>
              </div>
            </el-form-item>
            <el-form-item label="团体字符(Community)：" prop="commuName">
              <el-input size="small" v-model="formData.commuName"></el-input>
            </el-form-item>
            <el-form-item label="访问模式：" prop="visitMode">
              <el-select v-model="formData.visitMode" size="small" placeholder="请选择访问模式">
                <el-option
                  v-for="item in visitModeListData"
                  :key="item.key"
                  :label="item.value"
                  :value="item.key"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="medium" custom @click="save">保存</el-button>
              <el-button size="medium" custom @click="reset">重置</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </idss-widget>
  </div>
</template>
<script>
import globalMixins from '@/mixins/globalMixins.js'
import service from './snmp-set-service.js'
import validator from 'validator'
export default {
  name: 'snmp-set',
  mixins: [globalMixins, service],
  data () {
    // 验证 IP
    var validateIp = (rule, value, callback) => {
      let regNetwork = /((2[0-4]\d|25[0-5]|[01]?\d\d?)\.){3}(2[0-4]\d|25[0-5]|[01]?\d\d?)\/(?:0|[1-9]|[12][0-9]|3[012])$/
      if (!value) {
        return callback()
      }
      if (this.trustDesti === 'ip' && !validator.isIP(value)) {
        callback(new Error('请输入正确的IP地址'))
      }
      if (this.trustDesti === 'network' && !regNetwork.test(value)) {
        callback(new Error('请输入正确的Network地址'))
      }
      callback()
    }
    return {
      isActive: false,
      snmpTypeListData: [], // 配置类型列表
      snmpVersionListData: [], // snmp 版本列表
      visitModeListData: [], // 访问模式列表
      formData: {
        snmpType: '',  // 配置类型
        snmpVersion: '', // snmp版本
        trustDestiVal: '',
        trustDesti: [], // 信任地址
        commuName: '', // 团体名
        visitMode: '' // 访问模式
      },
      trustDesti: 'ip',
      formRules: {
        trustDestiVal: [
          { validator: validateIp, trigger: 'blur' }
        ],
        commuName: [
          { required: true, trigger: 'blur', message: '请输入团体字符' }
        ]
      }
    }
  },
  methods: {
    // 保存
    save () {
      this.$refs['form'].validate(async (valid) => {
        if (valid) {
          await this.getSnmpSaveData()
        } else {
          return false
        }
      })
    },
    // 重置
    reset () {
      this.formData = Object.assign({}, this.formData, this.cacheData)
    },
    // 添加
    add () {
      this.$refs['form'].validateField('trustDestiVal', (message) => {
        // 当此字段验证通过时，message 为空
        if (!message) {
          this.formData.trustDesti.unshift(this.formData.trustDestiVal)
        }
      })
    },
    // 删除
    remove () {
      this.formData.trustDesti.splice(this.currentIndex, 1)
    },
    init () {
      this.getSnmpTypeListData()
      this.getSnmpVersionListData()
      this.getVisitModeListData()
      this.getSnmpFormData()
    }
  },
  created () {
    this.init()
  }
}
</script>
<style scoped lang="postcss">
.box {
  max-height: 100px;
  min-height: 70px;
  border: 1px solid #dcdfe6;
  overflow-y: auto;
  >>> .el-button {
    width: 100%;
    text-align: left;
    border: none;
  }
}
</style>
