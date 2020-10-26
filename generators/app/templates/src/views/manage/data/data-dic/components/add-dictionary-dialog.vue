<template>
  <div>
    <el-form
      label-width="80px"
      :model="businessForm"
      ref="businessForm"
      :rules="rules"
      size="small">
      <el-form-item label="字典名称" prop="dictName" :error="formError.dictName">
        <el-input v-model.trim="businessForm.dictName" placeholder="请输入字典名称"></el-input>
      </el-form-item>
      <el-form-item label="中文名称" prop="dictChName">
        <el-input v-model="businessForm.dictChName" placeholder="请输入字典中文名称"></el-input>
      </el-form-item>
      <el-form-item label-width="0">
        <el-button @click="addDictionary" size="mini" type="primary" plain icon="el-icon-plus">字段设置</el-button>
      </el-form-item>
      <el-row :gutter="8" v-for="(item,index) in businessForm.dictFields" :key="index">
        <el-col :span="1">
          <el-button @click="deleteDictionary(index)" size="small" type="text" icon="el-icon-minus"></el-button>
        </el-col>
        <el-col :span="11">
          <el-form-item
            label-width="0"
            :prop="'dictFields.' + index + '.fieldName'"
            :rules="[
              {required: true, message: '字段名称不能为空', trigger: 'blur'},
              {validator:fieldNameReg, message: '字典名称不能是id由小写字母开头，并只能由小写字母、数字、下划线组成!', trigger: 'change' }
            ]"
            :key="item.key">
            <el-input v-model="item.fieldName" placeholder="字段名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            label-width="0"
            :prop="'dictFields.' + index + '.fieldType'"
            :rules="{required: true, message: '字段类型不能为空', trigger: 'change'}"
            :key="item.key">
            <el-select size="small" v-model="item.fieldType" placeholder="请选择字段类型" stretch>
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4" v-if="item.fieldType ==='string'">
          <el-form-item
            label-width="0"
            :prop="'dictFields.' + index + '.fieldLength'"
            :rules="[
              {required: true, message: '不能为空', trigger: 'blur'},
              {type: 'number', message: '长度必须为数字值', trigger: 'blur'}
            ]"
            :key="item.key">
            <el-input size="small" v-model.number="item.fieldLength" placeholder="长度"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row style="text-align:center;">
        <el-button size="small" @click="saveBusiness('businessForm')" type="primary" custom>确定</el-button>
        <el-button size="small" @click="closeDialog('businessForm')" custom>取消</el-button>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import globalMixins from '@/mixins/globalMixins.js'
import Service from './add-dictionary-service.js'
export default {
  name: 'add-dictionary-dialog',
  mixins: [globalMixins, Service],
  props: ['visible'],
  data () {
    return {
      businessForm: {
        dictName: '',
        dictChName: '',
        dictFields: [
          {
            fieldLength: '',
            fieldName: '',
            fieldType: ''
          }
        ]
      },
      rules: {
        dictName: [
          { required: true, message: '请输入字典名称' },
          { pattern: /^[a-z][a-z0-9_]*$/, message: '字典名称只能由小写字母开头，并只能由小写字母、数字、下划线组成!', trigger: 'blur' }
        ],
        dictChName: [
          { required: true, message: '请输入字典中文名称', trigger: 'blur' },
          { pattern: /[\u4e00-\u9fa5]/g, message: '仅支持中文', trigger: 'blur' }
        ]
      },
      formError: {},  // 后台返回校验错误提示
      // 字段类型下拉框
      options: [
        {
          label: '字符串',
          value: 'string'
        },
        {
          label: '长整型',
          value: 'long'
        },
        {
          label: '短整型',
          value: 'int'
        },
        {
          label: '时间戳',
          value: 'timestamp'
        },
        {
          label: '布尔',
          value: 'boolean'
        }
      ]
    }
  },
  watch: {
    visible (value) {
      if (!value) {
        this.resetForm()
      }
    }
  },
  methods: {
    fieldNameReg (rule, value, callback) { // 字典名称不能是id由小写字母开头，并只能由小写字母、数字、下划线组成!
      let reg = /^[a-z][a-z0-9_]*$/
      if (!reg.test(value) || value.toLowerCase() === 'id') {
        callback(new Error())
      } else {
        callback()
      }
    },
    // 初始化数据
    init () {
      this.$refs['businessForm'].resetFields()
    },
    // 新增行字段
    addDictionary () {
      this.businessForm.dictFields.push({ 'fieldLength': '', 'fieldType': '', 'fieldName': '' })
    },
    // 删除字段
    deleteDictionary (idx) {
      this.businessForm.dictFields.splice(idx, 1)
    },
    // 新增字典保存
    saveBusiness (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.businessForm.dictFields.length < 2) {
            this.showMessage('字典字段至少创建两个', 'error')
            return
          }
          this.formError = {}
          this.saveData()
        }
      })
    },
    // 重置表单数据
    resetForm () {
      this.$refs['businessForm'].resetFields()
      let length = this.businessForm.dictFields.length
      this.businessForm.dictFields.splice(1, length - 1)
    },
    // 关闭弹窗
    closeDialog (formName, type) {
      this.$emit('update:visible', false)
    }
  }
}
</script>
