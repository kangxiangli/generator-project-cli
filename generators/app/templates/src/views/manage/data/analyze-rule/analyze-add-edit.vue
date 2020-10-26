<template>
  <div class="commonEdit">
    <idss-widget style="padding: 16px">
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" size="small" label-width="100px">
        <el-form-item label="日志分类" prop="logCategoryUuid">
          <el-select v-model="ruleForm.logCategoryUuid" placeholder="请选择日志分类" :disabled="canEdit">
            <el-option
              v-for="item in logoptions"
              :key="item.uuid"
              :label="item.chName"
              :value="item.uuid"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="厂商" prop="factoryUuid">
          <el-select v-model="ruleForm.factoryUuid" placeholder="请选择厂商" :disabled="canEdit">
            <el-option
              v-for="item in factoryoptions"
              :key="item.uuid"
              :label="item.chName"
              :value="item.uuid"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="资产类型" prop="deviceTypeUuid">
          <idss-select-tree-filter
            :data="deviceoptions"
            size="medium"
            :selected.sync="ruleForm.deviceTypeUuid"
            :defaultProps="{
              children: 'children',
              label: 'label',
              id: 'id'
            }"
            :disabled="canEdit"></idss-select-tree-filter>
          <!-- <el-select v-model="ruleForm.deviceTypeUuid" placeholder="请选择设备分类" :disabled="canEdit">
            <el-option v-for="item in deviceoptions" :key="item.uuid" :label="item.chName":value="item.uuid"></el-option>
          </el-select>-->
        </el-form-item>
        <el-form-item label="规则名称" prop="ruleName">
          <el-input v-model="ruleForm.ruleName" placeholder="请输入规则名称" :disabled="canEdit"></el-input>
        </el-form-item>
        <el-form-item label="规则描述" prop="description">
          <el-input
            type="textarea"
            v-model="ruleForm.description"
            placeholder="请输入规则描述"
            :disabled="canEdit"></el-input>
        </el-form-item>
        <el-form-item label="原始数据" prop="rawData">
          <el-input
            type="textarea"
            v-model="ruleForm.rawData"
            placeholder="请输入原始数据"
            :disabled="canEdit"></el-input>
        </el-form-item>
        <el-form-item label="提取方式">
          <el-radio-group v-model="ruleForm.extractType" @change="changeType()" :disabled="canEdit">
            <el-radio
              v-for="(item, index) in extractTypes"
              :label="item.value"
              :key="index">{{item.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- JSON -->
        <el-form-item label="映射判断" prop="extractFieldName" v-if="ruleForm.extractType === 'json'">
          <el-input
            type="textarea"
            v-model="ruleForm.extractFieldName"
            placeholder="请输入json字段"
            :disabled="canEdit"></el-input>
        </el-form-item>
        <!-- 分隔符 -->
        <el-row v-if="ruleForm.extractType === 'splitChar'">
          <el-form-item label="分隔符" prop="extractor" style="width:50%">
            <el-input v-model="ruleForm.extractor" placeholder="分隔符(转义字符加'\')" :disabled="canEdit"></el-input>
          </el-form-item>
          <el-form-item label="映射判断" prop="extractFieldName">
            <el-input
              type="textarea"
              v-model="ruleForm.extractFieldName"
              placeholder="字段用逗号隔开"
              :disabled="canEdit"></el-input>
          </el-form-item>
        </el-row>
        <!-- 键值对 -->
        <el-row v-if="ruleForm.extractType === 'kv'">
          <el-col :span="6">
            <el-form-item label="字段分隔符" prop="firstField">
              <el-input
                v-model="ruleForm.firstField"
                placeholder="分隔符(转义字符加'\')"
                :disabled="canEdit"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="键值分隔符" prop="secondField">
              <el-input
                v-model="ruleForm.secondField"
                placeholder="分隔符(转义字符加'\')"
                :disabled="canEdit"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="映射字段" prop="extractFieldName">
              <el-input
                type="textarea"
                v-model="ruleForm.extractFieldName"
                placeholder="请输入映射字段"
                :disabled="canEdit"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- GROK -->
        <el-form-item label="GROK" prop="extractor" v-if="ruleForm.extractType === 'grok'">
          <el-input
            type="textarea"
            v-model="ruleForm.extractor"
            placeholder="请输入GROK"
            :disabled="canEdit"></el-input>
        </el-form-item>
        <!-- CEF -->
        <el-form-item label="映射关系" prop="extractFieldName" v-if="ruleForm.extractType === 'cef'">
          <el-input
            type="textarea"
            v-model="ruleForm.extractFieldName"
            placeholder="请输入CEF"
            :disabled="canEdit"></el-input>
        </el-form-item>
        <!-- 正则表达式 -->
        <el-form-item label="正则表达式" prop="extractor" v-if="ruleForm.extractType === 'regex'">
          <el-input
            type="textarea"
            v-model="ruleForm.extractor"
            placeholder="请输入正则表达式"
            :disabled="canEdit"></el-input>
        </el-form-item>
        <!-- JSON+正则表达式 -->
        <el-form-item
          label="JSON+正则表达式"
          prop="extractor"
          v-if="ruleForm.extractType === 'jsonRegex'">
          <el-input
            type="textarea"
            v-model="ruleForm.extractor"
            placeholder="请输入正则表达式"
            :disabled="canEdit"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            size="small"
            custom
            @click="getField()"
            v-if="['json', 'splitChar', 'kv', 'cef'].includes(ruleForm.extractType)"
            :disabled="canEdit">映射识别</el-button>
          <el-button @click="checkRegex()" size="small" custom>验证原始数据</el-button>
          <el-button @click="resetRuleForm()" size="small" custom :disabled="canEdit">重置</el-button>
          <el-button
            size="small"
            custom
            type="primary"
            @click="saveRule('ruleForm')"
            :disabled="canEdit">保存</el-button>
        </el-form-item>
        <el-row style="min-height:340px">
          <el-form-item label="验证结果:" v-if="ruleForm.backData && ruleForm.backData.length > 0">
            <el-table :data="ruleForm.backData" style="width: 100%" border>
              <el-table-column prop="name" label="字段" width="200"></el-table-column>
              <el-table-column prop="value" label="值">
                <template slot-scope="scope">
                  <p
                    style="white-space:pre-wrap;background: #409eff;display: inline;color: white">{{scope.row.value}}</p>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </el-row>
      </el-form>
    </idss-widget>
  </div>
</template>
<script>
import globalMixins from '@/mixins/globalMixins.js'
import service from './analyze-add-edit-service.js'
export default {
  mixins: [globalMixins, service],
  data: function () {
    return {
      ruleForm: {
        extractType: 'json',
        backData: []
      },
      logoptions: [],
      factoryoptions: [],
      deviceoptions: [],
      extractTypes: [{
        label: 'JSON',
        value: 'json'
      }, {
        label: 'CEF',
        value: 'cef'
      }, {
        label: 'GROK',
        value: 'grok'
      }, {
        label: '键值对',
        value: 'kv'
      }, {
        label: '分隔符',
        value: 'splitChar'
      }, {
        label: '正则表达式',
        value: 'regex'
      }],
      rules: {
        logCategoryUuid: [{ required: true, message: '请选择日志分类', trigger: 'change' }],
        factoryUuid: [{ required: true, message: '请选择厂商', trigger: 'change' }],
        deviceTypeUuid: [{ required: true, message: '请选择设备分类', trigger: 'change' }],
        ruleName: [{ required: true, message: '请输入规则名称', trigger: 'blur' }],
        rawData: [{ required: true, message: '请输入原始数据', trigger: 'blur' }],
        extractor: [{ required: true, message: '请输入分隔符', trigger: 'blur' }],
        description: [{ required: true, message: '请输入规则描述', trigger: 'blur' }],
        extractFieldName: [{ required: true, message: '请输入映射字段', trigger: 'blur' }],
        firstField: [{ required: true, message: '请输入字段分隔符', trigger: 'blur' }],
        secondField: [{ required: true, message: '请输入键值分隔符', trigger: 'blur' }],
        fieldName: [{ required: true, message: '请输入映射字段', trigger: 'blur' }]
      },
      canEdit: false,
      isCheck: false
    }
  },
  methods: {
    resetRuleForm () {
      this.ruleForm.backData = []
      this.$refs['ruleForm'].resetFields()
    },
    changeType () {
      this.$refs['ruleForm'].clearValidate(['extractFieldName', 'extractor'])
    }
  },
  mounted () {
    this.$route.query.id && this.getLibraryInfo(this.$route.query.id)
    this.$route.query.type === 'Edit' || this.$route.query.type === 'Add' ? this.canEdit = false : this.canEdit = true
  }
}
</script>
