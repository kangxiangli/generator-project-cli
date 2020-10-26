<template>
  <div class="dataDim">
    <el-form :model="dataDim" :rules="rules" ref="dataDim" size="small" label-width="0">
      <el-row :gutter="10">
        <el-col :span="8">
          <el-form-item>
            <el-input v-model="dataDim.field" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="start">
            <el-input v-model.number="dataDim.start" placeholder="请输入模糊开始位置"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="end">
            <el-input v-model.number="dataDim.end" placeholder="请输入模糊结束位置"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row style="margin-top:20px" class="idss-txt--center">
        <el-button size="small" @click="cancel('dataDim')">取消</el-button>
        <el-button size="small" @click="save('dataDim')" type="primary">确定</el-button>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import service from './common-service.js'
import { isNumber } from 'fusion-components/lib/util/base.js'
export default {
  mixins: [service],
  props: {
    message: Object
  },
  data () {
    const validateNumber = (rule, value, callback) => {
      if (!value || isNumber(value)) return callback()
      return callback(new Error('必须是数字!'))
    }
    return {
      dataDim: {
        field: '',
        start: undefined,
        end: undefined
      },
      options: [],
      rules: {
        start: [ { validator: validateNumber } ],
        end: [ { validator: validateNumber } ]
      }
    }
  },
  watch: {
    message: {
      immediate: true,
      deep: true,
      handler: function (val, oldVal) {
        this.dataDim.field = val['oldData']['fieldName']
        // 后台字段动态（存在，才有该字段，所以需要如此之判断）
        val && val['oldData']['ruleEntity'] && val['oldData']['ruleEntity']['desensitizationCondition'] && (this.dataDim = Object.assign(val['oldData']['ruleEntity']['desensitizationCondition'][0]))
      }
    }
  },
  methods: {
    save (formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) return false
        this.$emit('close', [1, 'desensitizationCondition', [this.dataDim]])
      })
    }
  }
}
</script>
