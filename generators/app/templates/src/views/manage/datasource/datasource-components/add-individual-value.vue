<template>
  <div
    class="manage-datasource-add-individual-value"
    v-loading="loading['manage-datasource-individual-value-info']">
    <el-form
      label-width="100px"
      ref="individualValueForm"
      size="medium"
      :model="individualValueData"
      :rules="individualValueRules"
      :validateOnRuleChange="false">
      <el-row>
        <el-col>
          <el-form-item
            label="数据源名称"
            prop="datasourceId">
            <el-select
              v-model="individualValueData.datasourceId"
              placeholder="请选择"
              popper-class="test-roleId"
              style="width: 100%">
              <el-option
                v-for="item in datasourceNameList"
                :key="item.key"
                :label="item.value"
                :value="item.key"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col>
          <el-form-item
            label="字段值"
            prop="individualValue"
            :error="individualValueRulesErrors.individualValue">
            <el-input
              v-model.trim="individualValueData.individualValue"
              placeholder="请输入字段值"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col>
          <el-form-item
            label="字段值名称"
            prop="individualLogName"
            :error="individualValueRulesErrors.individualLogName">
            <el-input
              v-model.trim="individualValueData.individualLogName"
              placeholder="请输入字段值名称"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col>
          <el-form-item
            label="设备名称"
            prop="individualEqptName"
            :error="individualValueRulesErrors.individualEqptName">
            <el-input
              v-model.trim="individualValueData.individualEqptName"
              placeholder="请输入设备名称"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col>
          <el-form-item
            label="topic名称"
            prop="topic"
            :error="individualValueRulesErrors.topic">
            <el-input
              v-model.trim="individualValueData.topic"
              placeholder="请输入topic名称"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col>
          <el-form-item
            label="描述"
            prop="individualDescName"
            :error="individualValueRulesErrors.individualDescName">
            <el-input
              v-model.trim="individualValueData.individualDescName"
              placeholder="请输入描述"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="el-dialog-footer idss-txt--center">
      <el-button
        type="primary"
        size="medium"
        @click="saveIndividualValue">保存</el-button>
      <el-button
        size="medium"
        @click="resetForm">重置</el-button>
      <el-button
        size="medium"
        @click="$emit('back')">取消</el-button>
    </div>
  </div>
</template>
<script>

import { getErrorMsgByEnd } from '@/custom/utils/base.js'
import service from '../datasource-individual-value-service.js'
import globalMixins from '@/mixins/globalMixins.js'
import { debounce } from 'fusion-utils'

// individualValueData 初始值
const individualValueData = {
  id: '',                 // 主键
  datasourceId: '',       // 数据源id
  individualValue: '',    // 字段值
  individualLogName: '',  // 字段值名称
  individualEqptName: '', // 设备名称
  topic: '', // topic名称
  individualDescName: ''  // 描述
}
/**
 *  设置校验规则 公共
 */
export default {
  name: 'manage-datasource-add-individual-value',
  props: {
    id: {
      type: String,
      default: ''
    }
  },
  mixins: [globalMixins, service],

  data () {
    return {
      individualValueData: JSON.parse(JSON.stringify(individualValueData)),
      datasourceNameList: [],  // 数据源下拉框
      // 接口校验错误信息
      individualValueRulesErrors: {
      },
      individualValueRules: {
        // 数据源
        datasourceId: [
          { required: true, message: '请选择数据源', trigger: 'blur' }

        ],
        // 字段值
        individualValue: [
          { required: true, message: '请输入字段值', trigger: 'blur' },
          { max: 100, message: '长度100以内', trigger: 'blur' }
        ],
        // 字段值名称
        individualLogName: [
          { required: true, message: '请输入字段值名称', trigger: 'blur' },
          { max: 30, message: '长度30以内', trigger: 'blur' }
        ],
        // 设备名称
        individualEqptName: [
          { max: 30, message: '长度30以内', trigger: 'blur' }
        ],
        // topic名称
        topic: [
          { max: 255, message: '长度255以内', trigger: 'blur' }
        ],
        // 描述
        individualDescName: [
          { max: 30, message: '长度30以内', trigger: 'blur' }
        ]
      }

    }
  },
  methods: {
    // 初始化函数
    async init () {
      try {
        // 编辑状态获取字段信息
        if (this.id) {
          await this.getIndividualValueInfo(this.id, 'isEdit')
        }

        this.$refs['individualValueForm'] && this.$refs['individualValueForm'].clearValidate()
        // 获取数据源列表
        this.getDatasourceNameList()
      } catch (err) {
        this.showMessage(err.message, 'error')
      }
    },

    /**
       * 重置表单
       */
    resetForm () {
      // 编辑状态
      if (this.id) {
        this.getIndividualValueInfo(this.id)
      } else {
        // 添加状态
        this.$set(this, 'individualValueData', JSON.parse(JSON.stringify(individualValueData)))
      }
      this.$refs['individualValueForm'].clearValidate()
    },

    /**
     *  共通组名称 select显示隐藏
     */
    visibleChange (isVisible) {
      if (!isVisible) {
        this.groupName = ''
        this.isAddGroup = false
      }
    },

    /**
     * 保存数据源信息
     */
    saveIndividualValue: debounce(function () {
      this.$set(this, 'individualValueRulesErrors', {})
      this.$refs['individualValueForm'].validate(async (valid) => {
        if (valid) {
          try {
            await this.saveOrEditIndividualValue(this.individualValueData, this.id)
            // 成功提示
            this.showMessage(this.id ? '编辑字段成功' : '新增字段成功')
            // 触发父组件，父组件监听保存成功
            this.$emit('save')
          } catch (err) {
            // 判断编辑用户接口返回校验错误
            this.$set(this, 'individualValueRulesErrors', getErrorMsgByEnd(err))
          }
        }
      })
    }, 300)
  },
  created () {
    this.init()
  }
}
</script>
