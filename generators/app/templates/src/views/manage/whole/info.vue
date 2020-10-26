<template>
  <div class="whole-info">
    <idss-widget
      :global-style="{padding: '20px 10%'}"
      shadow="never">
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="120px">
        <el-row
          :gutter="10"
          align="middle"
          type="flex">
          <el-col :span="22">
            <el-form-item
              label="密码复杂度："
              :error="formError['password.strength']"
              prop="password.strength">
              <el-input
                :disabled="isDisabled"
                v-model.number="form.password.strength"
                placeholder="请输入密码复杂度得分要求">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="2" style="marginBottom: 16px">
            <span style="marginRight: 5px">分</span>
            <el-popover
              width="500"
              placement="left"
              trigger="hover">
              <!-- 密码强度工具 -->
              <div class="popover-container">
                <idss-widget
                  shadow="never"
                  :header-style="{padding: '10px 0'}"
                  :main-style="{padding: '0 10px'}">
                  <template slot="title-left">
                    密码强度工具
                  </template>
                  <div>密码强度校验通过以下因素及权重，依次计算密码强度得分</div>
                  <div>参数值（以下参数值均可配）</div>
                  <el-row>
                    <el-col v-for="item in pwPopover['PARAM_VALUE']" :key="item.name">
                      <div>{{`- ${item.name}: ${item.value}`}}</div>
                      <el-row style="marginLeft:12px" v-if="Array.isArray(item.children) && item.children.length">
                        <el-col v-for="subItem in item.children" :key="subItem.name">
                          <div>{{`- ${subItem.name}: ${subItem.value}  ${subItem.case}`}}</div>
                        </el-col>
                      </el-row>
                    </el-col>
                  </el-row>
                </idss-widget>
                <!-- 基础得分算法 -->
                <idss-widget
                  :header-style="{padding: '10px 0'}"
                  :main-style="{padding: '0 10px'}"
                  shadow="never">
                  <template slot="title-left">
                    基础得分算法
                  </template>
                  <el-row>
                    <el-col v-for="item in pwPopover['SCORE']" :key="item.name">
                      <div>{{`- ${item.name}: ${item.value}`}}</div>
                      <el-row style="marginLeft:12px" v-if="Array.isArray(item.children) && item.children.length">
                        <el-col v-for="subItem in item.children" :key="subItem.name">
                          <div>{{`- ${subItem.name}: ${subItem.value}  ${subItem.case}`}}</div>
                        </el-col>
                      </el-row>
                    </el-col>
                  </el-row>
                </idss-widget>
                <!-- 正则扣分算法 -->
                <idss-widget
                  :header-style="{padding: '10px 0'}"
                  :main-style="{padding: '0 10px'}"
                  shadow="never">
                  <template slot="title-left">
                    正则扣分算法
                  </template>
                  <div>{{pwPopover['DEDUCTION']}}</div>
                </idss-widget>
              </div>

              <idss-icon-svg slot="reference" style="cursor:pointer" name="notes"></idss-icon-svg>
            </el-popover>
          </el-col>
        </el-row>
        <el-row
          :gutter="10"
          align="middle"
          type="flex">
          <el-col :span="23">
            <el-form-item
              label="登录失败次数："
              :error="formError['sign.maxErrorCount']"
              prop="sign.maxErrorCount">
              <el-input
                :disabled="isDisabled"
                v-model.number="form.sign.maxErrorCount"
                placeholder="请输入0-99">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="1" style="marginBottom: 16px">
            <span>次</span>
          </el-col>
        </el-row>
        <el-row type="flex">
          <el-col>
            <el-form-item label="登录失败处理：">
              <el-select
                stretch
                :disabled="isDisabled"
                @change="errorSignLockChange"
                v-model="errorSignLockHandle"
                placeholder="请选择">
                <el-option
                  label="抑制"
                  :value="1"></el-option>
                <el-option
                  label="锁定"
                  :value="-1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col v-if="errorSignLockHandle !== -1">
            <el-form-item
              label-width="10px"
              prop="sign.errorSignLockTimeShow">
              <el-input
                :disabled="isDisabled"
                v-model.number="form.sign.errorSignLockTimeShow"
                placeholder="请输入(默认5分钟)">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col v-if="errorSignLockHandle !== -1">
            <el-form-item
              label-width="10px"
              prop="sign.lockTimeUnit">
              <el-select
                stretch
                :disabled="isDisabled"
                v-model="form.sign.lockTimeUnit"
                placeholder="请选择">
                <el-option
                  label="分钟"
                  :value="2"></el-option>
                <el-option
                  label="时"
                  :value="1"></el-option>
                <el-option
                  label="天"
                  :value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex">
          <el-col>
            <el-form-item
              label="密码修改周期："
              :error="formError['password.durationShow']"
              prop="password.durationShow">
              <el-row
                :gutter="10"
                type="flex">
                <el-col :span="22">
                  <el-input
                    :disabled="isDisabled"
                    v-model.number="form.password.durationShow"
                    placeholder="请输入0-365（默认为0）">
                  </el-input>
                </el-col>
                <el-col :span="2">
                  <span class="password-label">天</span>
                </el-col>
              </el-row>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item prop="password.isLockForExpiration">
              <el-checkbox
                medium
                :disabled="isDisabled"
                v-model="form.password.isLockForExpiration">超期密码未修改锁定</el-checkbox>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="5">
            <el-form-item
              label="web访问方式："
              prop="http.enable">
              <el-checkbox
                medium
                :disabled="isDisabled"
                v-model="form.http.enable">HTTP</el-checkbox>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item
              label-width="0"
              :error="formError['http.port']"
              prop="http.port">
              <el-input
                :disabled="isDisabled || !form.http.enable"
                v-model="form.http.port"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item prop="https.enable">
              <el-checkbox
                medium
                :disabled="isDisabled"
                v-model="form.https.enable">HTTPS</el-checkbox>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item
              label-width="0"
              prop="https.port">
              <el-input
                :disabled="isDisabled || !form.https.enable"
                :error="formError['https.port']"
                v-model="form.https.port"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item
          label="SSL证书："
          placeholder="默认ssl证书">
          <el-upload
            multiple
            :auto-upload="false"
            :disabled="isDisabled || !form.https.enable"
            :file-list="fileList"
            ref="upload"
            :on-change="importChange"
            :on-remove="importRemoveFileList"
            :on-exceed="uploadExceed"
            :headers="{
              authToken: $store.getters['base/token$$']
            }"
            :show-file-list="true"
            action="/api/global-settings/upload">
            <el-button
              :disabled="isDisabled || !form.https.enable"
              slot="trigger"
              type="primary">
              选取证书
            </el-button>
            <el-button
              :disabled="isDisabled || !form.https.enable"
              style="marginLeft: 10px"
              @click="uploadSubmit"
              type="success">
              上传证书
            </el-button>
          </el-upload>
        </el-form-item>
        <el-form-item
          label="web访问限制："
          :error="formError['server.accessControl']"
          prop="server.accessControl">
          <el-input
            :disabled="isDisabled"
            type="textarea"
            v-model="form.server.accessControl"></el-input>
        </el-form-item>
        <el-form-item>
          <el-row
            type="flex"
            justify="center"
            align="middle"
            style="marginTop:20px">
            <el-button
              v-if="isDisabled"
              type="primary"
              @click="isDisabled=false">编辑</el-button>
            <el-button
              v-if="!isDisabled"
              type="primary"
              @click="save">保存</el-button>
            <el-button
              @click="reset">恢复默认</el-button>
          </el-row>
        </el-form-item>
      </el-form>
    </idss-widget>
  </div>
</template>
<script>
import globalMixins from '@/mixins/globalMixins'
import Service from '@/views/manage/whole/info-service.js'
import { PASSWORD } from '@/views/manage/whole/dictionary.js'
export default {
  name: 'manage-whole-info',
  mixins: [globalMixins, Service],
  data () {
    const fieldCheck = (maxVal, minVal, message) => {
      return (r, v, cb) => {
        if (v === '') return cb(new Error(message))
        if (!Number.isInteger(v)) return cb(new Error('请输入数字！'))
        if (v > maxVal || v < minVal) return cb(new Error(`请输入${minVal}-${maxVal}之间的数字！`))
        cb()
      }
    }
    return {
      pwPopover: PASSWORD,  // 密码复杂度提示
      errorSignLockHandle: 1,  // 登录失败处理默认值
      isDisabled: true,
      fileList: [],  // 上传证书列表
      resetForm: {},   // 用于重置表单数据
      form: {
        password: {
          strength: '',
          durationShow: 0,
          isLockForExpiration: true
        },
        sign: {
          maxErrorCount: 0,  // 登录失败次数
          errorSignLockTimeShow: 5,  // 登录失败锁定处理
          lockTimeUnit: 2   // 登录失败锁定时间单位
        },
        http: {
          enable: true,
          port: 80
        },
        https: {
          enable: true,
          port: 443,
          ssl: {
            key: '',
            pem: ''
          }
        },
        server: {
          accessControl: ''   // web访问限制
        }
      },
      formError: {},  // 表单错误信息提示
      rules: {
        // 密码复杂度
        'password.strength': [
          { validator: fieldCheck(100, 0, '请输入密码复杂度！'), required: true, trigger: 'blur' }
        ],
        // 登录失败次数
        'sign.maxErrorCount': [
          { required: true, validator: fieldCheck(99, 0, '请输入登录失败次数！'), trigger: 'blur' }
        ],
        // 密码修改周期
        'password.durationShow': [
          { validator: fieldCheck(365, 0, '请输入密码修改周期！'), required: true, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    /**
     * 初始化数据
     */
    init () {
      // 获取全局设置
      this.getGlobalSettings()
    },
    /**
     * 保存
     */
    save () {
      // 如果采用https访问方式，需要选择证书以及密钥才可以进行保存
      if (this.form.https.enable && this.fileList.length < 2) {
        this.showMessage('请先选择需要上传的证书', 'warning')
        return false
      }
      // 表单格式校验
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.editGlobalSettings()
        } else {
          return false
        }
      })
    },
    /**
     * 恢复默认
     */
    reset () {
      this.form = this.resetForm
    },
    /**
     * 登录失败处理下拉框值改变时重置锁定时间与单位
     */
    errorSignLockChange () {
      this.form.sign.errorSignLockTimeShow = 5
      this.form.sign.lockTimeUnit = 2
    },
    /**
     * 上传格式校验
     */
    importBeforeUpload (file, ck) {
      let reg = /\.key$|\.pem$/
      if (reg.test(file.name)) {
        this.fileList.push(file)
        return true
      } else {
        this.showMessage('证书格式不正确请重新上传', 'error')
        ck && ck()
        return false
      }
    },
    /**
     * 证书改变时的钩子
     */
    importChange (file, fileList) {
      this.importBeforeUpload(file, _ => {
        this.$refs.upload.clearFiles()
      })
    },
    /**
     * 移除证书
     */
    importRemoveFileList (file, filelist) {
      this.fileList = filelist
    },
    /**
     * 证书超出两个时的钩子
     */
    uploadExceed () {
      this.showMessage('证书不能同时上传超过两个!', 'warning')
    },
    /**
     * 上传证书
     */
    uploadSubmit () {
      // 处理不能重复上传已上传的证书
      let flag = this.fileList.every(item => !item.raw)
      if (flag) {
        this.showMessage('请重新选择需要上传的证书', 'warning')
        return false
      } else {
        let formData = new FormData()
        this.fileList.forEach(file => {
          formData.append('file', file.raw)
        })
        this.uploadCertificate(formData)
      }
    }
  },
  /**
   * 初始化获取数据
   */
  created () {
    this.init()
  }
}
</script>
<style scoped lang="postcss">
.popover-container {
     height: 500px;
     overflow-y: auto;
     overflow-x: hidden;
   }
.password-label {
   color:var(--color-font-default);
   font-size:14px;
}
</style>
