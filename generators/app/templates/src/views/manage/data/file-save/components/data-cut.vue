<template>
  <div class="dataCut">
    <el-form :model="dataCut" :rules="rules" size="small" ref="dataCut" label-width="0">
      <el-row :gutter="10">
        <el-col :span="8">
          <el-form-item>
            <el-input v-model="dataCut.field" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="startIndex">
            <el-input v-model.number="dataCut.startIndex" placeholder="请输入截取开始位置"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="length">
            <el-input v-model.number="dataCut.length" placeholder="请输入截取长度"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row style="margin-top:20px" class="idss-txt--center">
        <el-button size="small" @click="cancel('dataCut')">取消</el-button>
        <el-button size="small" @click="save('dataCut')" type="primary">确定</el-button>
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
      dataCut: {
        field: '',
        startIndex: undefined,
        length: undefined
      },
      options: [],
      rules: {
        startIndex: [ { validator: validateNumber } ],
        length: [ { validator: validateNumber } ]
      }
    }
  },
  watch: {
    message: {
      immediate: true,
      deep: true,
      handler: function (val, oldVal) {
        // 字段
        this.dataCut.field = val['oldData']['fieldName']
        // 后台字段动态（存在，才有该字段，所以需要如此之判断）
        /**
         ruleEntity: {
           subConditionList: [{
              field: "severity"
              length: 3
              startIndex: 3
           }]
         }
        */
        val && val['oldData']['ruleEntity'] && val['oldData']['ruleEntity']['subConditionList'] && (this.dataCut = Object.assign(this.dataCut, val['oldData']['ruleEntity']['subConditionList'][0]))
      }
    }
  },
  methods: {
    save (formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) return false
        this.$emit('close', [1, 'subConditionList', [this.dataCut]])
      })
    }
  }
}
</script>
