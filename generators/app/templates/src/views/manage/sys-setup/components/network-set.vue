<template>
  <div>
    <idss-widget>
      <template slot="title-left">网络设置</template>
      <el-row>
        <el-col :span="14">
          <el-form
            plain
            :model="formData"
            :rules="formRules"
            label-width="160px"
            ref="form"
            v-loading="loading['form-list']">
            <el-form-item label="接口：" prop="device">
              <el-input size="small" disabled v-model="formData.device"></el-input>
            </el-form-item>
            <el-form-item label="接口别名：" prop="aliasName">
              <el-input size="small" v-model="formData.aliasName"></el-input>
            </el-form-item>
            <el-form-item label="地址获取方式：" prop="bootproto">
              <el-select
                v-model="formData.bootproto"
                @change="change"
                size="small"
                placeholder="请选择协议">
                <el-option
                  v-for="item in bootprotoListData"
                  :key="item.key"
                  :label="item.value"
                  :value="item.key"></el-option>
              </el-select>
            </el-form-item>
            <el-row>
              <el-col :span="17">
                <el-form-item label="IP地址：" prop="ipAddr">
                  <el-input
                    size="small"
                    :disabled="formData.bootproto === 'dhcp'"
                    v-model.trim="formData.ipAddr"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="1">
                <div class="idss-txt--center" style="font-size: 26px; color: #acb0b7;">/</div>
              </el-col>
              <el-col :span="6">
                <el-form-item prop="maskInt" label-width="0">
                  <el-input
                    size="small"
                    :disabled="formData.bootproto === 'dhcp'"
                    v-model.number="formData.maskInt"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="网关地址：" prop="gateWay">
              <el-input
                size="small"
                :disabled="formData.bootproto === 'dhcp'"
                v-model.trim="formData.gateWay"></el-input>
            </el-form-item>
            <el-form-item label="Alias mac address：" prop="aliasMac">
              <el-input size="small" v-model.trim="formData.aliasMac"></el-input>
            </el-form-item>
            <el-form-item label="启用：">
              <el-switch active-text="是" inactive-text="否" v-model="formData.orOpen" custom></el-switch>
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
import service from './network-set-service.js'
import validator from 'validator'
export default {
  name: 'network-set',
  mixins: [globalMixins, service],
  props: {
    data: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  watch: {
    data: {
      deep: true,
      immediate: true,
      handler (newVal, oldVal) {
        this.getNetworkDetailData(newVal)
      }
    }
  },
  data () {
    // 验证 IP
    var validateIp = (rule, value, callback) => {
      if (this.formData.bootproto === 'dhcp' || !value) {
        callback()
      }
      if (!validator.isIP(value)) {
        callback(new Error('请输入正确的IP地址'))
      } else {
        callback()
      }
    }
    // 验证 Mac
    var validateMac = (rule, value, callback) => {
      if (!value) {
        callback()
      } else if (!validator.isMACAddress(value)) {
        callback(new Error('请输入正确的Mac地址'))
      } else {
        callback()
      }
    }
    // 验证 数字
    var validateNumber = (rule, value, callback) => {
      if (this.formData.bootproto === 'dhcp') {
        callback()
      }
      if (!Number.isInteger(value)) {
        callback(new Error('请输入数字值'))
      } else {
        if (value > 33) {
          callback(new Error('请输入0-32数字'))
        } else {
          callback()
        }
      }
    }
    return {
      bootprotoListData: [],
      formData: {
        device: '',  // 接口
        aliasName: '', // 接口别名
        bootproto: '', // 地址获取方式
        ipAddr: '', // ip地址
        maskInt: 0,
        gateWay: '', // 网关地址
        aliasMac: '', // mac别名
        orOpen: false
      },
      formRules: {
        device: [
          { required: true, message: '请输入接口名称', trigger: 'blur' }
        ],
        bootproto: [
          { required: true, message: '请输入接口名称', trigger: 'blur' }
        ],
        ipAddr: [
          { validator: validateIp, trigger: 'blur' }
        ],
        maskInt: [
          { type: 'number', validator: validateNumber, trigger: 'blur' }
        ],
        gateWay: [
          { validator: validateIp, trigger: 'blur' }
        ],
        aliasMac: [
          { validator: validateMac, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 保存
    async save () {
      await this.$refs['form'].validate(async (valid) => {
        if (valid) {
          await this.reqNetworkSaveData()
          await this.getNetworkDetailData(this.data)
        } else {
          return false
        }
      })
    },
    // 地址获取方式
    change (param) {
      if (param === 'dhcp') {
        this.formData.ipAddr = ''
        this.formData.maskInt = ''
        this.formData.gateWay = ''
        this.$refs['form'].clearValidate('ipAddr')
        this.$refs['form'].clearValidate('maskInt')
        this.$refs['form'].clearValidate('gateWay')
      } else {
        this.formData.ipAddr = this.cacheData.ipAddr
        this.formData.maskInt = this.cacheData.maskInt
        this.formData.gateWay = this.cacheData.gateWay
      }
    },
    // 重置
    reset () {
      this.formData = Object.assign({}, this.formData, this.cacheData)
    },
    init () {
      this.getBootprotoListData()
    }
  },
  created () {
    this.init()
  }
}
</script>
