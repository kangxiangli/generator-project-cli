<template>
  <div
    class="manage-datasource-add-field"
    v-loading="loading['manage-datasource-field-info']">
    <el-form
      label-width="130px"
      ref="fieldForm"
      size="medium"
      :model="fieldData"
      :rules="fieldRules"
      :validateOnRuleChange="false">
      <el-row>
        <el-col :span="24">
          <el-form-item
            label="字段区分"
            prop="isCommon"
            :error="fieldRulesErrors.isCommon">
            <!-- 如果有id表示是编辑状态， 禁用单选框 -->
            <el-radio-group
              v-model="fieldData.isCommon"
              @change="changedIsCommon"
              :disabled="!!id">
              <el-radio label="1">共通字段</el-radio>
              <el-radio label="0">个别字段</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item
            v-if="!id"
            label="字段名(英文)"
            prop="field"
            :error="fieldRulesErrors.field">
            <el-input
              v-model.trim="fieldData.field"
              placeholder="请输入字段名(英文)"></el-input>
          </el-form-item>
          <el-form-item
            v-if="id"
            label="字段名(英文)">{{fieldData.field}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="字段名(中文) "
            prop="name"
            :error="fieldRulesErrors.dbType">
            <el-input
              v-model.trim="fieldData.name"
              placeholder="请输入字段名(中文)"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item
            label="数据源名称"
            prop="individualDatasourceId"
            :error="fieldRulesErrors.individualDatasourceId">
            <el-select
              v-model="fieldData.individualDatasourceId"
              :disabled="fieldData.isCommon === '1'"
              placeholder="请选择"
              popper-class="test-roleId"
              style="width: 100%"
              @change="getIndividualValueListByDatasourceId">
              <el-option
                v-for="item in datasourceNameList"
                :key="item.key"
                :label="item.value"
                :value="item.key"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="TODO可变"
            prop="fieldValue"
            :error="fieldRulesErrors.individualValue">
            <el-select
              v-model="fieldData.individualValue"
              :disabled="fieldData.isCommon === '1'"
              placeholder="请选择"
              popper-class="test-roleId"
              style="width: 100%">
              <el-option
                v-for="item in individualValueList"
                :key="item.id"
                :label="item.individualValue"
                :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item
            label="共通组名称"
            prop="groupId"
            :error="fieldRulesErrors.groupId">
            <el-select
              multiple
              collapse-tags
              clearable
              placeholder="请选择"
              v-model="fieldData.groupId"
              :disabled="fieldData.isCommon !== '1'"
              @visible-change="visibleChange"
              style="width: 100%">
              <!-- 添加底层节点 -->
              <el-button
                type="text"
                size="mini"
                style="margin-left: 20px"
                @click="addGroup">添加</el-button>
              <el-option
                v-for="item in groupNameList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
                <el-row
                  type="flex"
                  justify="space-between"
                  align="middle">
                  <el-col :span="21">
                    <span>{{ item.name }}</span>
                  </el-col>
                  <el-col :span="3">
                    <idss-icon-svg
                      name="delete"
                      @click.native.stop="deleteGroup(item.id)"></idss-icon-svg>
                  </el-col>
                </el-row>
              </el-option>
              <!-- 新增 -->
              <el-form
                class="manage-datasource-add-field_insert"
                v-show="isAddGroup">
                <el-input
                  size="mini"
                  v-model.trim="groupName"
                  placeholder="请输入名称"></el-input>
                <el-button
                  size="mini"
                  @click="saveGroup">保存</el-button>
              </el-form>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item
            label="字段类型"
            prop="type"
            :error="fieldRulesErrors.type">
            <el-select
              v-model="fieldData.type"
              clearable
              placeholder="请选择"
              popper-class="test-roleId"
              style="width: 100%">
              <el-option
                v-for="item in typeList"
                :key="item.key"
                :label="item.value"
                :value="item.key"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="对应的字典"
            prop="dictionary"
            :error="fieldRulesErrors.dictionary">
            <el-select
              v-model="fieldData.dictionary"
              v-loading="loading['manage-dic-list']"
              clearable
              placeholder="请选择"
              popper-class="test-roleId"
              style="width: 100%">
              <el-option
                v-for="item in dictionaryList"
                :key="item.key"
                :label="item.value"
                :value="item.key"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item
            label="统计的运算方法"
            prop="computeTypes"
            :error="fieldRulesErrors.computeTypes">
            <el-select
              v-model="fieldData.computeTypes"
              clearable
              multiple
              collapse-tags
              placeholder="请选择"
              popper-class="test-roleId"
              style="width: 100%">
              <el-option
                v-for="item in computeTypesList"
                :key="item.key"
                :label="item.value"
                :value="item.key"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="是否可以用于分组"
            prop="canGroup"
            :error="fieldRulesErrors.canGroup">
            <el-radio-group v-model="fieldData.canGroup">
              <el-radio label="1">是</el-radio>
              <el-radio label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item
            label="表示形式"
            prop="formatStyle"
            :error="fieldRulesErrors.formatStyle">
            <el-input
              v-model.trim="fieldData.formatStyle"
              placeholder="请输入表示形式"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item
            label="表示单位"
            prop="formatUnit"
            :error="fieldRulesErrors.formatUnit">
            <el-input
              v-model.trim="fieldData.formatUnit"
              placeholder="请输入表示单位"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item
            label="过滤方式"
            prop="operatorsRefer"
            :error="fieldRulesErrors.operatorsRefer">
            <el-select
              v-model="fieldData.operatorsRefer"
              v-loading="loading['manage-dic-list']"
              placeholder="请选择"
              popper-class="test-roleId"
              style="width: 100%">
              <el-option
                v-for="item in operatorsRefersList"
                :key="item.key"
                :label="item.value"
                :value="item.key"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="顺序"
            prop="dspOrder"
            :error="fieldRulesErrors.dspOrder">
            <el-input
              v-model.number="fieldData.dspOrder"
              placeholder="请输入顺序"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="el-dialog-footer idss-txt--center">
      <el-button
        type="primary"
        size="medium"
        @click="saveField">保存</el-button>
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
import service from '../datasource-field-service.js'
import globalMixins from '@/mixins/globalMixins.js'
import { debounce } from 'fusion-utils'

// fieldData 初始值
const fieldData = {
  id: '',             // 主键
  field: '',          // 英文名
  name: '',           // 中文名
  individualDatasourceId: '',   // 数据源id
  individualValue: '', // 个别字段值
  groupId: [],         // 共通组id
  type: '',           // 字段类型
  dictionary: '',     // 对应字典
  computeTypes: [],   // 计算符
  formatStyle: '',    // 表示形式
  formatUnit: '',     // 表示单位
  operatorsRefer: '', // 过滤条件用
  dspOrder: 999,      // 顺序
  isCommon: '1',      // 默认为共通字段
  canGroup: '0'       // 是否可以分组
}
/**
 *  设置校验规则 公共
 */
const fieldRulesCommon = {
  // 字段名(英文)
  field: [
    { required: true, message: '请输入字段名称(英文)', trigger: 'blur' },
    { max: 30, message: '长度30以内', trigger: 'blur' }
  ],
  // 字段名(中文)
  name: [
    { required: true, message: '请输入字段名称(中文)', trigger: 'blur' },
    { max: 30, message: '长度30以内', trigger: 'blur' }
  ],
  // 共同组名称
  groupId: [
    { type: 'array', trigger: 'change' }
  ],
  // 数据源名称
  individualDatasourceId: [
    { trigger: 'change' }
  ],
  // 字段类型
  type: [
    { required: true, message: '请选择字段类型', trigger: 'change' }
  ],
  // 统计的运算方法
  computeTypes: [
    { required: true, message: '请选择统计的运算方法', trigger: 'change' }
  ],
  // 过滤方式
  operatorsRefer: [
    { required: true, message: '请选择过滤方式', trigger: 'change' }
  ],
  // 顺序
  dspOrder: [
    { required: true, message: '请输入顺序', trigger: 'blur' },
    { type: 'number', message: '顺序必须为数字', trigger: 'blur' }
  ]
}

export default {
  name: 'manage-datasource-field-add',
  props: {
    id: {
      type: String,
      default: ''
    }
  },
  mixins: [globalMixins, service],

  data () {
    return {
      fieldData: JSON.parse(JSON.stringify(fieldData)),
      datasourceNameList: [],  // 数据源下拉框
      individualValueList: [],  // 个别字段值下拉框
      typeList: [], // 类型下拉框
      dictionaryList: [], // 字典下拉框
      computeTypesList: [], // 运算方法下拉框
      operatorsRefersList: [], // 过滤条件用下拉框
      groupNameList: [],   // 共通分组名称list
      isAddGroup: false,   // 共通分组添加
      groupName: '',       // 共通分组添加名称
      fieldRules: {},       // 判断字段区分
      // 接口校验错误信息
      fieldRulesErrors: {
      },
      /**
       *  设置校验规则 共通字段
       */
      fieldRulesApplicable: Object.assign(JSON.parse(JSON.stringify(fieldRulesCommon)), {
        // 共同组名称
        groupId: [
          { required: true, type: 'array', message: '请选择共通组名称', trigger: 'change' }
        ]
      }),
      /**
       *  设置校验规则 个别字段
       */
      fieldRulesIndividual: Object.assign(JSON.parse(JSON.stringify(fieldRulesCommon)), {
        // 数据源名称
        individualDatasourceId: [
          { required: true, message: '请选择数据源名称', trigger: 'change' }
        ]
      })
    }
  },
  methods: {
    getIndividualValueListByDatasourceId (datasourceId) {
      console.log(datasourceId)
      this.getIndividualValueList(datasourceId)
      // 清空原始值
      this.fieldData.individualValue = ''
    },
    // 初始化函数
    async init () {
      try {
        // 编辑状态获取字段信息
        if (this.id) {
          await this.getFieldInfo(this.id, 'isEdit')
          this.getIndividualValueList(this.fieldData.individualDatasourceId)
        }

        this.$refs['fieldForm'] && this.$refs['fieldForm'].clearValidate()
        // 获取数据源列表
        this.getDatasourceNameList()
        // 获取字段类型列表
        this.getTypeList()
        // 获取字典列表
        this.getDictionaryList()
        // 获取字段运算符列表
        this.getComputeTypesList()
        // 获取过滤条件列表
        this.getOperatorsRefersList()
        // 获取共同分组名称列表
        this.getGroupNameList()

        // 判断字段区分
        if (this.fieldData.isCommon === '1') {
          this.fieldRules = this.fieldRulesApplicable
        } else {
          this.fieldRules = this.fieldRulesIndividual
        }
      } catch (err) {
        this.showMessage(err.message, 'error')
      }
    },

    /**
     * 共通/个别字段选择后，有些项目需要初始化和检查
     */
    changedIsCommon () {
      // 共通字段的场合
      if (this.fieldData.isCommon === '1') {
        // this.$refs['fieldForm'].clearValidate()
        this.fieldRules = this.fieldRulesApplicable
        this.fieldData.individualDatasourceId = ''
        this.fieldData.individualValue = ''
      } else {
        // this.$refs['fieldForm'].clearValidate()
        this.fieldRules = this.fieldRulesIndividual
        this.fieldData.groupId = []
      }
      this.$set(this, 'fieldRulesErrors', {})
    },

    /**
       * 重置表单
       */
    resetForm () {
      // 编辑状态
      if (this.id) {
        this.getFieldInfo(this.id)
      } else {
        // 添加状态
        this.$set(this, 'fieldData', JSON.parse(JSON.stringify(fieldData)))
      }
      this.$refs['fieldForm'].clearValidate()
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
     *  删除共通组
     */
    deleteGroup (item) {
      this.getDeleteGroup(item)
    },

    /**
     *  添加共通组
     */
    addGroup () {
      if (this.isAddGroup) {
        this.showMessage('你有未添加的共通组名称', 'warning')
      } else {
        this.isAddGroup = true
      }
    },
    /**
     *  保存共通组
     */
    saveGroup () {
      if (this.groupName) {
        this.getAddGroup(this.groupName)
      } else {
        this.showMessage('名称不能为空', 'warning')
      }
    },

    /**
     * 保存数据源信息
     */
    saveField: debounce(function () {
      this.$set(this, 'fieldRulesErrors', {})
      this.$refs['fieldForm'].validate(async (valid) => {
        if (valid) {
          try {
            await this.saveOrEditField(this.fieldData, this.id)
            // 成功提示
            this.showMessage(this.id ? '编辑字段成功' : '新增字段成功')
            // 触发父组件，父组件监听保存成功
            this.$emit('save')
          } catch (err) {
            // 判断编辑用户接口返回校验错误
            this.$set(this, 'fieldRulesErrors', getErrorMsgByEnd(err))
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
