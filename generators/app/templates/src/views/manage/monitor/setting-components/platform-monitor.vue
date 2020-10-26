<template>
  <!-- 监控配置 -->
  <div class="platform-monitor-container">
    <el-row>
      <!-- 采集组件 -->
      <el-col :span="8" v-loading="loading['platform-data-loading']">
        <idss-widget shadow="never" class="idss-widget-box" :main-style="{padding: '10px'}">
          <template slot="title-left">采集组件</template>
          <el-form plain size="medium" ref="collectForm" @submit.native.prevent>
            <el-form-item
              v-for="(item, idx) in collectData"
              :key="idx"
              :label="item.module"
              prop="ips">
              <el-row :gutter="10">
                <el-col :span="18">
                  <el-input placeholder="请输入IP" v-model="item.ips">
                    <el-button
                      slot="append"
                      type="primary"
                      @click="configConfirm('collect', item)">设置</el-button>
                  </el-input>
                </el-col>
                <el-col :span="1">
                  <el-tooltip content="例：192.198.21.881,198.214.1.11" placement="right">
                    <i class="el-icon-question icon"></i>
                  </el-tooltip>
                </el-col>
              </el-row>
            </el-form-item>
          </el-form>
          <div class="idss-txt--center">
            <el-button size="medium" custom @click="save('collect')" type="primary">保存</el-button>
            <el-button size="medium" custom @click="reset('collect')">重置</el-button>
          </div>
        </idss-widget>
      </el-col>

      <!-- 程序组件 -->
      <el-col :span="8" v-loading="loading['platform-data-loading']">
        <idss-widget shadow="never" class="idss-widget-box" :main-style="{padding: '10px'}">
          <template slot="title-left">程序组件</template>
          <el-form plain size="medium" label-width="100px" ref="programForm" @submit.native.prevent>
            <el-form-item
              v-for="(item, idx) in programData"
              :key="idx"
              :label="item.module"
              prop="ips">
              <el-row :gutter="10">
                <el-col :span="18">
                  <el-input placeholder="请输入IP" v-model="item.ips" class="input-with-select">
                    <el-button
                      slot="append"
                      type="primary"
                      @click="configConfirm('program', item)">设置</el-button>
                  </el-input>
                </el-col>
                <el-col :span="1">
                  <el-tooltip content="例：192.198.21.881,198.214.1.11" placement="right">
                    <i class="el-icon-question icon"></i>
                  </el-tooltip>
                </el-col>
              </el-row>
            </el-form-item>
            <div class="idss-txt--center">
              <el-button size="medium" custom @click="save('program')" type="primary">保存</el-button>
              <el-button size="medium" custom @click="reset('program')">重置</el-button>
            </div>
          </el-form>
        </idss-widget>
      </el-col>

      <!-- 分析组件 -->
      <el-col :span="8" v-loading="loading['platform-data-loading']">
        <idss-widget shadow="never" class="idss-widget-box" :main-style="{padding: '10px'}">
          <template slot="title-left">分析组件</template>
          <el-form plain size="medium" label-width="100px" ref="analysisForm" @submit.native.prevent>
            <el-form-item
              v-for="(item, idx) in analysisData"
              :key="idx"
              :label="item.module"
              prop="ips">
              <el-row :gutter="10">
                <el-col :span="18">
                  <el-input placeholder="请输入IP" v-model="item.ips" class="input-with-select">
                    <el-button
                      slot="append"
                      type="primary"
                      @click="configConfirm('analysis', item)">设置</el-button>
                  </el-input>
                </el-col>
                <el-col :span="1">
                  <el-tooltip content="例：192.198.21.881,198.214.1.11" placement="right">
                    <i class="el-icon-question icon"></i>
                  </el-tooltip>
                </el-col>
              </el-row>
            </el-form-item>
            <div class="idss-txt--center">
              <el-button size="medium" custom @click="save('analysis')" type="primary">保存</el-button>
              <el-button size="medium" custom @click="reset('analysis')">重置</el-button>
            </div>
          </el-form>
        </idss-widget>
      </el-col>
    </el-row>

    <!-- list配置dialog -->
    <el-dialog
      title="告警配置"
      :visible.sync="configDialogVisible"
      width="640px"
      :close-on-click-modal="false"
      @close="resetConfigForm()">
      <el-form
        plain
        size="medium"
        label-width="110px"
        :inline="true"
        :model="configForm"
        :rules="configFormRules"
        ref="configForm"
        v-loading="loading['platform-dialog-loading']"
        @submit.native.prevent>
        <el-form-item label="组件名称">{{ configForm.module }}</el-form-item>
        <el-form-item label="服务器IP">
          <el-tooltip
            :content="configForm.ips"
            class="ip-content"
            placement="top-start"
            effect="dark">
            <span>{{configForm.ips}}</span>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="显示">
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
          <el-form-item label="CPU使用率" prop="cpuOperator" :error="configFormError.cpuOperator">
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
          <br />
          <el-form-item label="内存使用率" prop="memOperator" :error="configFormError.memOperator">
            <el-select v-model="configForm.memOperator" placeholder="请选择">
              <el-option
                v-for="item in operatorList"
                :key="item.value"
                :label="item.label"
                :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="memVal" :error="configFormError.memVal">
            <el-input v-model="configForm.memVal" placeholder="请输入百分比"></el-input>
          </el-form-item>
          <el-form-item prop="memFlg" :error="configFormError.memFlg">
            <el-switch
              size="medium"
              v-model="configForm.memFlg"
              :inactive-value="0"
              :active-value="1"
              active-text="开"
              inactive-text="关"></el-switch>
          </el-form-item>
          <br />
          <el-form-item label="进程监控">
            <el-switch
              size="medium"
              v-model="configForm.processFlg"
              :inactive-value="0"
              :active-value="1"
              active-text="监控"
              inactive-text="不监控"></el-switch>
          </el-form-item>
          <template slot="footer">
            <el-button size="medium" @click="saveConfig" type="primary">保存</el-button>
            <el-button size="medium" @click="resetConfig">重置</el-button>
            <el-button size="medium" @click="configDialogVisible = false">取消</el-button>
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
  name: 'platform-monitor',
  mixins: [globalMixins, service],
  data () {
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

    return {
      // 当前弹窗的类型
      currentType: '',
      // 字典
      dictionary: [
        {
          name: 'collect',
          display: '采集组件',
          modules: ['flume', 'kafka']
        },
        {
          name: 'program',
          display: '程序组件',
          modules: ['hbase', 'elasticsearch', 'spark', 'flink']
        },
        {
          name: 'analysis',
          display: '分析组件',
          modules: ['nginx', '.jar', 'tomcat']
        }
      ],
      // 采集组件
      collectData: [],
      collectDataClone: {},    // 重置表单使用
      // 程序组件
      programData: [],
      programDataClone: {},    // 重置表单使用
      // 分析组件
      analysisData: [],
      analysisDataClone: {},    // 重置表单使用
      // 弹窗相关
      configDialogVisible: false,
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
      configForm: {
        'module': '',
        'ips': '',
        'cpuOperator': 1,
        'cpuVal': 0,
        'cpuFlg': 0,
        'memOperator': 1,
        'memVal': 0,
        'memFlg': 0,
        'processFlg': 1,
        'showFlg': 0
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
        ]
      }
    }
  },
  methods: {
    save (type) {
      let data = this[type + 'Data']
      // 表单验证 IP地址
      for (let v of data) {
        if (v.ips && typeof v.ips === 'string') {
          let ips = v.ips.split(',')
          for (let ip of ips) {
            if (!validator.isIP(ip)) {
              return this.showMessage('请输入正确的IP地址', 'error')
            }
          }
        }
      }
      this.addPlatformData(data)
    },
    // 重置
    reset (type) {
      this[type + 'Data'] = JSON.parse(JSON.stringify(this[type + 'DataClone']))
    },
    // 告警配置 弹框
    configConfirm (type, row) {
      this.currentType = type
      this.configDialogVisible = true
      this.queryConfigPlatformData(type, row)
    },
    // 告警配置 保存
    saveConfig (type) {
      // 表单验证
      this.$refs['configForm'].validate((valid) => {
        if (valid) {
          this.saveConfigPlatformData()
        }
      })
    },
    // 告警配置 重置
    resetConfig () {
      this.configForm = JSON.parse(JSON.stringify(this.configFormClone))
    },
    // 告警配置 清空
    resetConfigForm () {
      this.$refs['configForm'].resetFields()
      this.$refs['configForm'].clearValidate()
    },
    // 转换分类数据
    translateData (data) {
      this.collectData = []
      this.programData = []
      this.analysisData = []
      data.forEach(v => {
        // 取得大类型
        let name
        this.dictionary.forEach(f => {
          if (f.modules.includes(v.module) || /\.jar$/.test(v.module)) {
            name = f.name
          }
        })
        if (name) {
          v.name = name
          this[name + 'Data'].push(v)
        }
      })
      // 复制
      this.collectDataClone = JSON.parse(JSON.stringify(this.collectData))
      this.programDataClone = JSON.parse(JSON.stringify(this.programData))
      this.analysisDataClone = JSON.parse(JSON.stringify(this.analysisData))
    },
    init () {
      this.getPlatformData()
    }
  }
}
</script>
<style lang="postcss" scoped>
.platform-monitor-container {
  & .idss-widget-box {
    min-height: 380px;
    >>> .title-left {
      font-size: var(--font-size-4);
    }
  }

  & .el-icon-question {
    color: var(--color-medium);
  }
}
</style>
