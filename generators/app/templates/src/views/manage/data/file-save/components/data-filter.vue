<template>
  <div class="data-filter-container">
    <el-form
      ref="dataFilter"
      :model="formData"
      hide-required-asterisk
      label-width="0">
      <el-row class="idss-margin--b-l">
        <el-button
          icon="el-icon-circle-plus"
          type="primary"
          size="small"
          @click="addDataFilter">新增</el-button>
      </el-row>
      <el-row
        :gutter="10"
        type="flex"
        align="middle"
        v-for="(domain, index) in formData.filterData"
        :key="index">
        <el-col :span="1">
          <el-form-item>
            <div @click="delDataFilter(index)">-</div>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
            label="当"
            label-width="30px"
            :prop="'filterData.' + index + '.fieldName'"
            :rules="{
              required: true,
              message: '请选择字段'
            }">
            <el-select
              size="small"
              v-model="domain.fieldName"
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
          <el-form-item
            :prop="'filterData.' + index + '.condition'"
            :rules="{
              required: true,
              message: '请选择条件'
            }">
            <el-select
              size="small"
              v-model="domain.condition"
              placeholder="请选择条件"
              stretch>
              <el-option
                v-for="item in condition"
                :key="item"
                :label="item"
                :value="item"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            :prop="'filterData.' + index + '.filterValue'"
            :rules="{
              required: true,
              message: '请输入值'
            }">
            <el-input
              size="small"
              v-model="domain.filterValue"
              placeholder></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="1">
          <el-form-item label="忽略日志" label-width="70px"></el-form-item>
        </el-col>
      </el-row>
      <el-row class="idss-margin--b-l">
        <p>示例:{{ demoData }}</p>
      </el-row>
      <el-row class="idss-txt--center">
        <el-button custom size="small" @click="cancel('dataFilter')">取消</el-button>
        <el-button custom size="small" type="primary" @click="save">确定</el-button>
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
  props: {
    message: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      // 使用formData包裹一层为了使用el-form验证
      formData: { filterData: [] },
      // 字段列表
      options: [],
      // 选择的条件
      condition: ['=', '!=', 'not in', 'in', '>', '>=', '<', '<=', 'eq', 'not equal', 'like', 'regex'],
      demoData: this.message.demoData
    }
  },
  methods: {
    addDataFilter () {
      this.formData.filterData.push({ 'fieldName': this.message['oldData'].fieldName, 'condition': '', 'filterValue': '' })
    },
    delDataFilter (idx) {
      this.formData.filterData.splice(idx, 1)
    },
    save () {
      this.$refs['dataFilter'].validate((valid) => {
        valid && this.$emit('close', [1, 'filterConditionList', this.formData.filterData])
      })
    }
  },
  mounted () {
    /**
      filterConditionList: [{
        condition: "not in"
        fieldName: "severity"
        filterValue: "1"
      }]
    */
    this.options = this.message.fieldRulesList
    this.demoData = this.message.demoData
    const oldData = this.message['oldData']
    if (oldData.ruleEntity && oldData.ruleEntity['filterConditionList']) {
      this.formData.filterData = oldData.ruleEntity['filterConditionList']
    }
  }
}
</script>
<style scoped lang="postcss">
.data-filter-container {
  & >>> .el-form .el-form-item__label {
    font-size: var(--font-size-4);
  }
}
</style>
