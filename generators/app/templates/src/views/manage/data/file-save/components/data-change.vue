<template>
  <div class="data-change-container">
    <el-form
      :model="dynamic_replace"
      :rules="rules"
      hide-required-asterisk
      ref="dynamicReplace"
      label-width="0">
      <!-- 条件「当」 -->
      <el-row :gutter="10" type="flex" align="middle">
        <el-col :span="6">
          <el-form-item prop="dictName" label="当" label-width="30px">
            <el-select
              size="small"
              stretch
              v-model="dynamic_replace.dictName"
              clearable
              placeholder="请选择表单"
              @clear="resetForm"
              @change="initDictSchema">
              <el-option
                v-for="item in dictList"
                :key="item.dictName"
                :label="item.dictChName"
                :value="item.dictName">
                <span style="float: left">{{ item.dictChName }}</span>
                <span
                  style="float: right; color: #8492a6; margin-left: 10px;">{{ item.dictName }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item prop="fillUpKey">
            <el-select
              size="small"
              stretch
              v-model="dynamic_replace.fillUpKey"
              multiple
              clearable
              :disabled="!dynamic_replace.dictName"
              placeholder="请选择表单字段"
              @change="updateForm">
              <el-option
                v-for="(item, index) in curGroupList"
                v-show="item && item.visibleFlag"
                :key="index"
                :label="item.label"
                :value="item.label"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="9">
          <el-form-item
            prop="fieldName"
            label="匹配日志字段"
            label-width="110px">
            <el-select
              size="small"
              v-model="dynamic_replace.fieldName"
              placeholder="请选择字段"
              disabled
              stretch>
              <el-option
                v-for="item in options"
                :key="item.fieldName"
                :label="item.fieldName"
                :value="item.fieldName"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 结果「将」 -->
      <div class="add-content">
        <el-row
          :gutter="10"
          v-for="(item, index) in dynamic_replace.groups"
          :key="index">
          <el-col :span="6">
            <el-form-item
              :prop="'groups.' + index + '.dictName'"
              :rules="{
                required: true,
                message: '请选择表单'
              }"
              label="将"
              label-width="30px">
              <el-select
                size="small"
                v-model="item.dictName"
                disabled
                clearable
                stretch
                placeholder="请选择表单">
                <el-option
                  v-for="item in dictList"
                  :key="item.dictName"
                  :label="item.dictChName"
                  :value="item.dictName">
                  <span style="float: left">{{ item.dictChName }}</span>
                  <span
                    style="float: right; color: #8492a6; margin-left: 10px;">{{ item.dictName }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item
              :prop="'groups.' + index + '.fillUpKey'"
              :rules="{
                required: true,
                message: '请选择表单字段'
              }">
              <el-select
                size="small"
                stretch
                v-model="item.fillUpKey"
                clearable
                :disabled="!item.dictName"
                placeholder="请选择表单字段"
                @change="updateForm">
                <el-option
                  v-for="(item, index) in curGroupList"
                  v-show="item && item.visibleFlag"
                  :key="index"
                  :label="item.label"
                  :value="item.label">{{ item.label }}
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item
              :prop="'groups.' + index + '.fieldName'"
              :rules="{
                required: true,
                message: '请选择字段名'
              }"
              label="写入日志字段"
              label-width="110px">
              <el-select
                v-model="item.fieldName"
                size="small"
                stretch
                placeholder="请选择字段名"
                filterable
                style="width: 100%">
                <el-option-group
                  v-for="group in systemFields"
                  :key="group.name"
                  :label="group.name">
                  <el-option
                    v-for="item in group.children"
                    :key="item.id"
                    :label="item.field + '/' + item.name"
                    :value="item.field">
                    <span style="float: left;">{{ item.field }}</span>
                    <span
                      style="float: right; color: #8492a6; font-size: 13px; margin-left: 10px;">{{ item.name }}</span>
                  </el-option>
                </el-option-group>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-form-item>
              <el-button
                type="danger"
                plain
                icon="el-icon-delete"
                size="mini"
                v-if="dynamic_replace.groups.length !== 1"
                @click.stop.prevent="removeGroup(item)"></el-button>
              <el-button
                type="primary"
                plain
                icon="el-icon-plus"
                size="mini"
                v-if="index === dynamic_replace.groups.length - 1"
                @click.stop.prevent="addGroup"></el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </el-form>
    <el-row class="idss-txt--center">
      <el-button custom size="small" @click="cancel('dynamicReplace')">取消</el-button>
      <el-button custom size="small" @click="save" type="primary">确定</el-button>
    </el-row>
  </div>
</template>

<script>
import globalMixins from '@/mixins/globalMixins.js'
import service from '../extractor-setting-service.js'
export default {
  mixins: [globalMixins, service],
  name: 'dataChange',
  props: ['message'],
  data () {
    return {
      dynamic_replace: {
        /* 当 */
        dictName: '',  // 表单
        fillUpKey: [], // 表单字段
        fieldName: '',  // 字段名
        /* 将 */
        groups: [{
          dictName: '',   // 表单
          fillUpKey: '',  // 表单字段
          fieldName: ''   // 字段名
        }],
        /* 映射关系 { fillUpKey: fieldName }
         * 例如 { name_test: "sso_name" }
         */
        aliasMapping: {}
      },

      rules: {
        dictName: [{ required: true, message: '请选择表单' }],
        fillUpKey: [{ required: true, message: '请选择表单字段' }],
        fieldName: [{ required: true, message: '请选择字段' }]
      },

      dic: [],  // 当前表--关联的字段
      curGroupList: [], //  WTF，和dic区别？
      // 业务字典列表
      dictList: [],
      options: [],
      // 属性集中的字段列表
      systemFields: [],
      // 示例
      demoData: ''
    }
  },
  /** watch 都不执行啊，大哥 */
  // watch: {
  //   message (val) {
  //     console.log('watch', val)
  //     this.options = val
  //   }
  // },
  methods: {
    // 重置条件选择表单时触发（情况「当」的表单，「将」还原成如下？）
    resetForm () {
      this.$refs['dynamic_replace'].resetFields()
    },
    /**
       * 表单选择更新,选择的表单visibleFlag为false时不可见
       * 每次修改将所有的visibleFlag的状态置为true，将已选择添加的置为false和当前的置为false
       * */
    updateForm (label) {
      // 都置为可见？
      this.curGroupList.forEach(temp => {
        this.$set(temp, 'visibleFlag', true)
      })
      // 被选中的设置为 不可见
      this.setFlag()

      // 刚选中的也置为 不可见
      if (Array.isArray(label)) {
        label.map((val, index) => {
          let item = this.hasValueFromArray(this.curGroupList, 'label', val).value
          item && this.$set(item, 'visibleFlag', false)
        })
      } else {
        let item = this.hasValueFromArray(this.curGroupList, 'label', label).value
        item && this.$set(item, 'visibleFlag', false)
      }
    },

    /**
     * 什么鬼？
    */
    setFlag () {
      // 被选中的设置为 不可见
      this.dynamic_replace.fillUpKey.map((val, index) => {
        let toVisibleForm = this.hasValueFromArray(this.curGroupList, 'label', val).value
        toVisibleForm && this.$set(toVisibleForm, 'visibleFlag', false)
      })
      this.dynamic_replace.groups.forEach(item => { // 表单字段将条件项添加visibleFlag
        if (item.fillUpKey) {
          let toVisibleForm = this.hasValueFromArray(this.curGroupList, 'label', item.fillUpKey).value
          toVisibleForm && this.$set(toVisibleForm, 'visibleFlag', false)
        }
      })
    },
    /**
     * 删除表单，把删除的表单的visibleFlag置为true在选择中可见
     */
    removeGroup (item) {
      let index = this.dynamic_replace.groups.indexOf(item)
      if (index !== -1) {
        this.dynamic_replace.groups.splice(index, 1)
        let toVisibleForm = this.hasValueFromArray(this.curGroupList, 'label', item.fillUpKey).value
        toVisibleForm && this.$set(toVisibleForm, 'visibleFlag', true)
      }
    },
    /**
     * 新增表单，当新增表单长度等于当前可选择表单列表的长度时候，不让新增
     * 当最后表单如果没有值，则不让新增
     */
    addGroup () {
      let selected = this.dynamic_replace.groups
      let allGroup = this.curGroupList
      if (!selected.length || selected.length === allGroup.length) {
        return false
      }
      if (selected[selected.length - 1].fillUpKey) {
        this.dynamic_replace.groups.push({
          dictName: this.dynamic_replace.dictName,
          fillUpKey: ''
        })
      } else {
        this.showMessage('请选择表单字段', 'warning')
      }
    },
    /**
     * 判断数组对象中是否存在某个对象
     * @param arr 数组对象
     * @param key(String)要匹配的某个字段
     * @param value 要匹配的字段值
     * @return 匹配的对象和下标，找不到则返回null
     */
    hasValueFromArray (arr, key, value) {
      if (!Array.isArray(arr)) {
        // 抛出错误然后呢？
        // throw new Error('arr 不是一个数组')
        return {}
      }
      let result = {
        index: -1,
        value: null
      }
      for (let i = 0; i < arr.length; i++) {
        if (arr[i][key] === value) {
          result.index = i
          result.value = arr[i]
          break
        }
      }
      return result
    },

    save () {
      let groupsIsNotEmpty = this.dynamic_replace.groups.filter(item => {
        return item.fillUpKey && item.fieldName
      }).length > 0
      if (this.dynamic_replace.dictName || this.dynamic_replace.fillUpKey.length || groupsIsNotEmpty) {
        // 全空不校验
        this.$refs['dynamicReplace'].validate((valid) => {
          if (valid) {
            // 填充 aliasMapping 数据
            this.dynamic_replace.groups.forEach(element => {
              if (element.fillUpKey) {
                this.dynamic_replace.aliasMapping[element.fillUpKey] = element.fieldName || ''
              }
            })
            this.$emit('close', [1, 'fillUpConditionList', [this.dynamic_replace]])
          }
        })
      } else {
        this.$emit('close', [1, 'fillUpConditionList', []])
      }
    }
  },
  mounted () {
    // 获取表单
    this.getDictList()
    // 写入日志字段
    this.getLogDict()
    /*
      fieldRulesList = {
        fieldName: "create_time"
        fieldRuleSetId: 1347
        fieldSource: "2"
        fieldType: "String"
        index: 2
        ruleEntity: Object
      }
    */

    // 当前表格数据
    this.options = this.message.fieldRulesList
    // demo数据
    this.demoData = this.message.demoData
    // oldData 当前行数据
    this.dynamic_replace.fieldName = this.message['oldData'].fieldName
    const ruleEntity = this.message['oldData'].ruleEntity
    // 编辑时
    if (ruleEntity && ruleEntity.fillUpConditionList && ruleEntity.fillUpConditionList.length) {
      const sendAllData = ruleEntity.fillUpConditionList[0]
      this.dynamic_replace.fieldName = sendAllData.fieldName
      this.dynamic_replace.dictName = sendAllData.dictName
      this.dynamic_replace.fillUpKey = Array.isArray(sendAllData.fillUpKey) ? sendAllData.fillUpKey : sendAllData.fillUpKey.split(',')

      // 还原每个属性设置好的字段值
      let ary = []
      for (let key in (sendAllData.aliasMapping || {})) {
        ary.push({
          dictName: sendAllData.dictName,
          fillUpKey: key,
          fieldName: sendAllData.aliasMapping[key]
        })
      }
      // 不存在（非编辑），新增一个空
      this.dynamic_replace.groups = ary.length ? ary : [{
        dictName: '',
        fillUpKey: '',
        fieldName: ''
      }]

      // 初始化 选择表单字段
      this.initDictSchema(this.dynamic_replace.dictName)
    }
  }
}
</script>

<style scoped lang="postcss">
.data-change-container {
  &.add-content {
    background-color: #f9f9f9;
  }
  & >>> .el-form .el-form-item__label {
    font-size: var(--font-size-4);
  }
}
</style>
