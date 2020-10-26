<template>
  <div class="data-filter-container">
    <el-form
      ref="dataTime"
      :model="filterData"
      :rules="rules"
      hide-required-asterisk
      size="small"
      label-width="0">
      <el-row :gutter="10" type="flex" align="middle">
        <el-col :span="6">
          <el-form-item prop="fieldName" label="当" label-width="30px">
            <el-select
              size="small"
              v-model="filterData.fieldName"
              placeholder="请选择字段"
              stretch
              disabled>
              <el-option
                v-for="item in options"
                :key="item.fieldName"
                :label="item.fieldName"
                :value="item.fieldName"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item prop="originalFormat">
            <el-select
              size="small"
              v-model="filterData.originalFormat"
              clearable
              stretch
              placeholder="请选择原格式"
              :default-first-option="true"
              :allow-create="true"
              :filterable="true"
              @change="getId()">
              <el-option
                v-for="item in fromDateFormats"
                :key="item.dateFormat"
                :label="item.dateFormat"
                :value="item.dateFormat">
                <span style="float: left">{{ item.dateFormat }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{
                  item.dateExample
                }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="changeFormat" label="转化为" label-width="60px">
            <el-select
              size="small"
              v-model="filterData.changeFormat"
              clearable
              placeholder="请选择转换格式"
              :default-first-option="true"
              :allow-create="true"
              :filterable="true"
              :disabled="checkedValue"
              stretch>
              <el-option
                v-for="item in fromDateFormats"
                :key="item.dateFormat"
                :label="item.dateFormat"
                :value="item.dateFormat">
                <span style="float: left">{{ item.dateFormat }}</span>
                <span
                  style="float: right; color: #8492a6; font-size: 13px; margin-left: 10px;">{{ item.dateExample }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="2">
          <el-form-item>
            <el-button custom size="medium" @click="checkTime">测试</el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <p>示例数据: {{ demoData }}</p>
      </el-row>
      <el-row>
        <p v-show="IsResult" class="IsResult">
          转换数据:
          <span>{{ checkResult }}</span>
        </p>
      </el-row>
      <el-row class="idss-txt--center">
        <el-button custom size="small" @click="cancel('dataTime')">取消</el-button>
        <el-button custom size="small" @click="save()" type="primary">确定</el-button>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import globalMixins from '@/mixins/globalMixins.js'
import service from '../extractor-setting-service.js'
export default {
  mixins: [globalMixins, service],
  name: 'dataFilter',
  props: ['message'],
  watch: {
    message (val) {
      this.options = val
    }
  },
  data () {
    return {
      // WTF，名称！！！这样的偷懒，后续问题更多！
      filterData: {
        fieldName: '',
        originalFormat: '',
        changeFormat: '',
        originalId: ''
      },
      rules: {
        originalFormat: [{ required: true, message: '请选择原格式' }],
        changeFormat: [{ required: true, message: '请选择转换格式' }]
      },
      options: [],
      condition: [],
      fromDateFormats: [],
      changeFormat: [],
      demoData: '',
      checkedValue: false,
      IsResult: false,
      checkResult: ''
    }
  },
  methods: {
    getId () {
      if (!this.filterData.originalFormat) {
        this.filterData.originalId = ''
      }
      let result
      for (let key in this.fromDateFormats) {
        if (this.filterData.originalFormat === this.fromDateFormats[key]['dateFormat']) {
          result = this.fromDateFormats[key]
        }
      }
      this.filterData.originalId = result ? result['id'] : ''
    },
    async getDateFormatTemplates () {
      let content = await this.$request({
        method: 'get',
        url: '/api/setting/etl/date/formats'
      })
      this.fromDateFormats = content
      this.toDateFormats = content
    },
    // 时间校验
    checkTime () {
      this.$refs['dataTime'].validate(async (valid) => {
        if (valid) {
          var param = {
            originalData: this.message['demoData'],
            fieldName: this.filterData['fieldName'],
            originalFormat: this.filterData['originalFormat'],
            changeFormat: this.filterData['changeFormat']
          }
          try {
            let content = await this.$request({
              method: 'post',
              url: '/api/setting/regex/verifyRuleTime/query',
              data: param
            })
            this.IsResult = true
            this.checkResult = content
          } catch (error) {
            this.IsResult = false
            this.$message({
              type: 'error',
              message: error.message
            })
          }
        }
      })
    },
    // 保存
    save () {
      // 一个存在，另一个必须存在（可以同时为空）
      if ((this.filterData.originalFormat && this.filterData.changeFormat) || (!this.filterData.originalFormat && !this.filterData.changeFormat)) {
        this.$emit('close', [1, 'timeConvertCondition', this.filterData])
      } else {
        // 否则触发验证方法
        this.$refs['dataTime'].validate()
      }
    }
  },
  mounted () {
    /*
    timeConvertCondition: {
      fieldName: '',
      originalFormat: '',
      changeFormat: '',
      originalId: ''
    }
    */
    this.getDateFormatTemplates()
    this.options = this.message.fieldRulesList
    this.demoData = this.message.demoData

    const oldData = this.message['oldData']
    this.filterData.fieldName = oldData.fieldName
    // create_time 很特殊吗???
    if (this.filterData.fieldName === 'create_time') {
      this.filterData.changeFormat = 'UTC Timestamp Millisecond'
      this.checkedValue = true
    }
    // 还原已设置的数据
    if (oldData.ruleEntity !== undefined && oldData.ruleEntity.timeConvertCondition !== undefined) {
      const data = oldData.ruleEntity.timeConvertCondition
      this.filterData.fieldName = data.fieldName
      this.filterData.originalFormat = data.originalFormat
      this.filterData.changeFormat = data.changeFormat
      this.filterData.originalId = data.originalId
    }
  }
}
</script>
<style scoped lang="postcss">
.data-filter-container {
  & >>> .el-form .el-form-item__label {
    font-size: var(--font-size-4);
  }
  .IsResult span {
    color: #409eff;
    font-weight: 500;
  }
}
</style>
