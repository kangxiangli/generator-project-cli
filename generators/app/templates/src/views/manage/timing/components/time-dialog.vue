<template>
  <el-dialog
    class="time-dialog"
    custom
    :title="title"
    :close-on-click-modal="false"
    :visible="isShow"
    :before-close="closeHandle"
    @open="dialogInit"
    width="800px">
    <div v-loading="loading['loadTask']">
      <!-- 业务逻辑处理 start-->
      <template v-if="editTaskType === 'internal-assets'">
        <el-form ref="time-dialog-form" :model="internalAssetsData">
          <el-row>
            <el-col>
              <idss-widget title="未知资产发现配置" padding="10px 0 0 35px" class="time-dialog__unknown-asset">
                <el-form-item
                  prop="srcType"
                  :rules="internalAssetsRule.srcType"
                  :error="externalAssetsError.srcType"
                  label-width="120px"
                  label="数据类型：">
                  <el-row>
                    <el-col :span="12">
                      <el-checkbox v-model="internalAssetsData.srcType.fromFlux">从流量解析中获取资产</el-checkbox>
                    </el-col>
                    <el-col :span="12">
                      <el-checkbox v-model="internalAssetsData.srcType.fromLog">从日志解析中获取资产</el-checkbox>
                    </el-col>
                  </el-row>
                </el-form-item>
                <el-form-item
                  prop="ipType"
                  :rules="internalAssetsRule.ipType"
                  label="匹配类型："
                  label-width="120px"
                  :error="externalAssetsError.ipType">
                  <el-row>
                    <el-col :span="12">
                      <el-checkbox v-model="internalAssetsData.ipType.fromSrcIp">仅从DST中获取</el-checkbox>
                    </el-col>
                    <el-col :span="12">
                      <el-checkbox v-model="internalAssetsData.ipType.fromDstIp">仅从SRC中获取</el-checkbox>
                    </el-col>
                  </el-row>
                </el-form-item>
              </idss-widget>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <idss-widget>
                <idss-widget-tool slot="tool" title padding="10px">
                  资产解析掩码配置
                </idss-widget-tool>
                <el-table
                  style="width: 100%"
                  :data="internalAssetsData.rangeList">
                  <el-table-column
                    label="掩码范围"
                    align="center">
                    <template slot-scope="scope">
                      <el-row>
                        <el-col :span="11">
                          <el-form-item
                            :error="externalAssetsError['rangeList['+scope.$index+'].fromIp']"
                            :rules="internalAssetsRule['rangeList.fromIp']"
                            :prop="'rangeList[' + scope.$index + '].fromIp'">
                            <el-input
                              size="small"
                              :rows="1"
                              v-model="scope.row.fromIp"
                              placeholder="请输入内容">
                            </el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="2" style="line-height: 30px">
                          -
                        </el-col>
                        <el-col :span="11">
                          <el-form-item
                            :error="externalAssetsError['rangeList['+scope.$index+'].toIp']"
                            :rules="internalAssetsRule['rangeList.toIp']"
                            :prop="'rangeList[' + scope.$index + '].toIp'">
                            <el-input
                              size="small"
                              :rows="1"
                              v-model="scope.row.toIp"
                              placeholder="请输入内容">
                            </el-input>
                          </el-form-item>
                        </el-col>
                      </el-row>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="解析策略"
                    width="200"
                    align="center">
                    <template slot-scope="scope">
                      <el-form-item
                        :prop="'rangeList[' + scope.$index + '].toMatch'"
                        :error="externalAssetsError['rangeList['+scope.$index+'].toMatch']"
                        :rules="internalAssetsRule['rangeList.toMatch']">
                        <el-select
                          v-model="scope.row.toMatch"
                          placeholder="请选择"
                          size="small">
                          <el-option
                            v-for="item in solutionData"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="操作"
                    width="100"
                    align="center">
                    <template slot-scope="scope">
                      <el-form-item>
                        <button type="text" class="idss-button-icon idss-svg_delete-hover" @click.prevent="deleteConfig(scope.$index)">
                          <idss-icon-svg name="delete-hover"></idss-icon-svg>
                          删除
                        </button>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="备注"
                    width="150"
                    align="center">
                    <template slot-scope="scope">
                      <el-form-item>
                        <el-input
                          size="small"
                          :rows="1"
                          v-model="scope.row.memo"
                          placeholder="请输入内容"
                          resize="none"
                          type="textarea">
                        </el-input>
                      </el-form-item>
                    </template>
                  </el-table-column>
                </el-table>
              </idss-widget>
            </el-col>
          </el-row>
          <!-- 资产解析掩码配置校验错误提示 -->
          <el-row class="idss-margin--b-m">
            <el-col>
              <el-button type="text" custom size="small" @click="addConfig">
                <idss-icon-svg name="plus"></idss-icon-svg>
                {{internalAssetsData.rangeList.length ? '继续添加' : '添加配置'}}
              </el-button>
            </el-col>
          </el-row>
        </el-form>
      </template>
      <!-- 业务逻辑处理 end-->
      <template v-else>
        <!-- 定时任务处理 start -->
        <idss-cron-picker :data="cronData" :cronRuleError="cronRuleError" ref="cornPicker"></idss-cron-picker>
        <!-- 定时任务处理 end -->
      </template>
      <div class="el-dialog-footer idss-txt--center">
        <el-button type="primary" size="small" @click="saveCron" custom>确定</el-button>
        <el-button size="small" @click="dialogInit" custom>重置</el-button>
        <el-button size="small" @click="closeHandle" custom>取消</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { getErrorMsgByEnd } from '@/custom/utils/base.js'
import globalMixins from '@/mixins/globalMixins.js'
import service from '../timing-service.js'
import { debounce } from 'fusion-utils'
export default {
  name: 'time-dialog',
  mixins: [globalMixins, service],
  props: {
    title: {
      type: String,
      default: ''
    },
    isShow: {
      type: Boolean,
      default: false
    },
    editId: {
      type: [String, Number],
      required: true
    },
    editTaskType: String
  },
  data () {
    return {
      // 内部未知资产发现周期数据
      internalAssetsData: {
        srcType: {
          fromFlux: true,
          fromLog: true
        },
        ipType: {
          fromSrcIp: true,
          fromDstIp: true
        },
        rangeList: []
      },
      // 内部未知资产发现周期数据错误
      externalAssetsError: {},
      // cronRule 定时任务接口返回错误
      cronRuleError: {},
      // task任务数据
      taskData: {},
      // 定时任务数据
      cronData: {}
    }
  },
  methods: {
    closeHandle () {
      this.$emit('closeDialog')
    },
    /**
       * 弹框打开事件处理
       */
    async dialogInit () {
      this.$set(this, 'externalAssetsError', {})
      this.$set(this, 'cronRuleError', {})
      // 加载任务详情
      if (this.editId) {
        try {
          // 内部未知资产发现
          if (this.editTaskType === 'internal-assets') {
            await this.getAssetTaskConfig()
            // 表单重置
            this.$refs['time-dialog-form'] && this.$refs['time-dialog-form'].clearValidate()
          } else {
            // 非内部未知资产加载定时任务
            await this.loadTaskDetail(this.editId)
            // 调用定时任务表单重置
            this.$refs['cornPicker'] && this.$refs['cornPicker'].resetForm()
          }
        } catch (err) {
          this.showMessage(err.message, 'error')
        }
      }
    },

    /**
       *  添加资产解析掩码配置
       */
    addConfig () {
      // 判断数据不存在时处理
      if (!this.internalAssetsData.rangeList) {
        this.$set(this.internalAssetsData, 'rangeList', [])
      }
      this.internalAssetsData.rangeList.push({
        fromIp: '',
        toIp: '',
        toMatch: '',
        memo: ''
      })
    },
    /**
       * 删除 添加资产解析掩码配置
       * @param {number} index
       */
    deleteConfig (index) {
      this.internalAssetsData.rangeList.splice(index, 1)
    },

    /**
       * 保存定时任务
       */
    saveCron: debounce(async function () {
      this.$set(this, 'cronRuleError', {})
      // 设置保存触发接口配置api
      const apis = []
      // 获取定时任务数据(内部资产不需要获取定时任务)
      if (this.editTaskType !== 'internal-assets') {
        const cronData = await this.$refs['cornPicker'].getCronData()
        // 定时任务处理校验未通过
        if (!cronData) {
          return
        }
        // 定时任务接口
        apis.push(this.updateTaskCron(this.editId, cronData))
      }
      // 判断当前为未知资产发现配置
      if (this.editTaskType === 'internal-assets') {
        this.$set(this, 'externalAssetsError', {})
        // form 校验
        const isValidate = await this.$refs['time-dialog-form'].validate()
        if (isValidate) {
          // 未知资产发现配置数据保存
          apis.push(this.saveAssetTaskConfig(this.internalAssetsData))
        } else {
          return
        }
      }
      try {
        // 发送任务请求
        await Promise.all(apis)
        // 保存成功
        this.showMessage('配置成功')
        // 触发父级组件save
        this.$emit('save')
      } catch (err) {
        // 判断普通错误
        if (typeof err.message === 'string') {
          this.showMessage(err.message, 'error')
        } else if (Object.prototype.toString.call(err.message) === '[object Array]') {
          if (JSON.stringify(err.message).match(/srcType|ipType|rangeList/)) {
            // 判断接口返回校验错误
            this.$set(this, 'externalAssetsError', getErrorMsgByEnd(err))
          } else {
            // 判断接口返回校验错误
            this.$set(this, 'cronRuleError', getErrorMsgByEnd(err))
          }
        }
      }
    }, 300),
    /**
       * 校验srcType
       * @param {object} rule
       * @param {string|number|array} value
       * @param {function} callback
       */
    srcTypeValidator (rule, value, callback) {
      if (!this.internalAssetsData.srcType.fromFlux && !this.internalAssetsData.srcType.fromLog) {
        callback(new Error('请至少选择一个数据类型'))
      } else {
        callback()
      }
    },

    /**
       * 校验ipType
       * @param {object} rule
       * @param {string|number|array} value
       * @param {function} callback
       */
    ipTypeValidator (rule, value, callback) {
      if (!this.internalAssetsData.ipType.fromSrcIp && !this.internalAssetsData.ipType.fromDstIp) {
        callback(new Error('请至少选择一个匹配数据'))
      } else {
        callback()
      }
    }
  },
  created () {
    this.solutionData = [
      { value: true, label: '匹配模式' },
      { value: false, label: '排除模式' }
    ]
    // 校验规则
    this.internalAssetsRule = {
      srcType: [
        { validator: this.srcTypeValidator }
      ],
      ipType: [
        { validator: this.ipTypeValidator }
      ],
      'rangeList.fromIp': [
        { required: true, pattern: /^((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))$/, message: '请输入掩码', trigger: 'blur' }
      ],
      'rangeList.toIp': [
        { required: true, pattern: /^((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))$/, message: '请输入掩码', trigger: 'blur' }
      ],
      'rangeList.toMatch': [
        { required: true, message: '请选择解析策略', trigger: 'blur' }
      ]
    }
  }
}
</script>

<style scoped lang="postcss">
  .time-dialog {
    >>> .el-form-item {
      margin-bottom: 18px;
    }
    >>> .el-form-item__content, >>> .el-form-item__label {
      line-height: 25px;
    }

  }
</style>
