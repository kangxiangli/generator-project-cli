<template>
  <div class="data-replace-container">
    <el-form
      ref="dataReplace"
      :model="formData"
      hide-required-asterisk
      label-width="0">
      <el-row class="idss-margin--b-l">
        <el-button
          icon="el-icon-circle-plus"
          type="primary"
          size="small"
          @click="addDataReplace">新增</el-button>
      </el-row>
      <el-row
        :gutter="10"
        type="flex"
        align="middle"
        v-for="(domain, index) in formData.replaceData"
        :key="index">
        <el-col :span="1">
          <el-form-item>
            <div @click="delDataReplace(index)">-</div>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
            label="当"
            label-width="30px"
            :prop="'replaceData.' + index + '.fieldName'"
            :rules="{
              required: true,
              message: '请选择字段'
            }">
            <el-select
              size="small"
              v-model="domain.fieldName"
              placeholder="请选择字段"
              style="width:100%"
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
        <el-col :span="7">
          <el-form-item
            :prop="'replaceData.' + index + '.condition'"
            :rules="{
              required: true,
              message: '请选择条件'
            }"
            label="匹配"
            label-width="40px">
            <el-select
              size="small"
              stretch
              clearable
              v-model="domain.condition"
              placeholder="请选择条件">
              <el-option
                v-for="item in cOptions"
                :key="item"
                :label="item"
                :value="item"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item
            :prop="'replaceData.' + index + '.matchValue'"
            :rules="{
              required: true,
              message: '请输入值'
            }">
            <el-input
              size="small"
              v-model="domain.matchValue"
              placeholder="请输入值"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            :prop="'replaceData.' + index + '.replaceValue'"
            :rules="{
              required: true,
              message: '请输入替换值'
            }"
            label="替换为"
            label-width="50px">
            <el-input
              size="small"
              v-model="domain.replaceValue"
              placeholder="请输入替换值"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="idss-margin--b-l">
        <p>示例:{{ demoData }}</p>
      </el-row>
      <el-row class="idss-txt--center">
        <el-button custom size="small" @click="cancel('dataReplace')">取消</el-button>
        <el-button custom size="small" type="primary" @click="save()">确定</el-button>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import globalMixins from '@/mixins/globalMixins.js'
import service from '../extractor-setting-service.js'
const C_OPTTIONS = ['=', '!=', 'not in', 'in', '>', '>=', '<', '<=', 'eq', 'not equal', 'like', 'regex']
export default {
  mixins: [globalMixins, service],
  name: 'dataReplace',
  props: ['message'],
  data () {
    return {
      cOptions: C_OPTTIONS,
      // 使用formData包裹一层为了使用el-form验证
      formData: { replaceData: [] },
      value: '',
      options: [],
      demoData: ''
    }
  },
  methods: {
    addDataReplace () {
      this.formData.replaceData.push({ 'fieldName': this.message['oldData'].fieldName, 'condition': '', 'replaceValue': '' })
    },
    delDataReplace (idx) {
      this.formData.replaceData.splice(idx, 1)
    },
    save () {
      this.$refs['dataReplace'].validate((valid) => {
        valid && this.$emit('close', [1, 'replaceConditionList', this.formData.replaceData])
      })
    }
  },
  mounted () {
    /**
     replaceConditionList: [{
        condition: "in"
        fieldName: "severity"
        matchValue: "12"
        replaceValue: "22"
     }]
    */
    this.options = this.message.fieldRulesList
    this.demoData = this.message.demoData
    if (this.message['oldData'].ruleEntity && this.message['oldData'].ruleEntity['replaceConditionList']) {
      this.formData.replaceData = this.message['oldData'].ruleEntity['replaceConditionList']
    }
  }
}
</script>
<style scoped lang="postcss">
.data-replace-container {
  & >>> .el-form .el-form-item__label {
    font-size: var(--font-size-4);
  }
}
</style>
