<template>
  <div
    class="manage-datasource-add-datasource"
    v-loading="loading['manage-datasource-datasource-info']">
    <el-form
      label-width="120px"
      ref="datasourceForm"
      size="medium"
      :model="datasourceData"
      :rules="datasourceRules">
      <el-row>
        <el-col :span="12">
          <el-form-item
            v-if="!id"
            label="数据源名称"
            prop="datasourceName"
            :error="datasourceRulesErrors.datasourceName">
            <el-input
              style="width: 100%"
              v-model.trim="datasourceData.datasourceName"
              placeholder="请输入数据源名称"></el-input>
          </el-form-item>
          <el-form-item
            v-if="id"
            style="width: 100%"
            label="数据源名称">{{datasourceData.datasourceName}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="数据库类型"
            prop="dbType"
            :error="datasourceRulesErrors.dbType">
            <el-select
              v-model="datasourceData.dbType"
              placeholder="请选择"
              popper-class="test-roleId"
              style="width: 100%">
              <el-option
                v-for="item in dbTypeList"
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
            label="数据库版本"
            prop="dbVersion"
            :error="datasourceRulesErrors.dbVersion">
            <el-input
              v-model.trim="datasourceData.dbVersion"
              placeholder="请输入数据库版本"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="索引/schema名"
            prop="dbName"
            :error="datasourceRulesErrors.dbName">
            <el-input
              v-model.trim="datasourceData.dbName"
              placeholder="请输入数据库索引/schema名"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item
            label="是否分片"
            prop="isShard"
            :error="datasourceRulesErrors.isShard">
            <el-radio-group v-model="datasourceData.isShard" size="medium">
              <el-radio label="1">是</el-radio>
              <el-radio label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="分片格式"
            prop="shardFormat"
            :error="datasourceRulesErrors.shardFormat">
            <el-input
              v-model.trim="datasourceData.shardFormat"
              placeholder="请输入分片格式"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item
            label="type/表名"
            prop="tableName"
            :error="datasourceRulesErrors.tableName">
            <el-input
              v-model.trim="datasourceData.tableName"
              placeholder="请输入type/表名"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="时间范围字段"
            prop="timeField"
            :error="datasourceRulesErrors.timeField">
            <el-input
              v-model.trim="datasourceData.timeField"
              placeholder="请输入时间范围字段"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item
            label="共通字段组名称"
            prop="commonGroupId"
            :error="datasourceRulesErrors.commonGroupId">
            <el-select
              v-model="datasourceData.commonGroupId"
              clearable
              placeholder="请选择"
              v-loading="loading['manage-datasource-group-list']"
              popper-class="test-roleId"
              @change="getCommonFieldList"
              style="width: 100%">
              <el-option
                v-for="item in commonGroupIdList"
                :key="item.id"
                :label="item.name"
                :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="区分字段名称"
            prop="commonFieldId"
            :error="datasourceRulesErrors.commonFieldId">
            <el-select
              v-model="datasourceData.commonFieldId"
              clearable
              v-loading="loading['manage-datasource-field-list']"
              placeholder="请选择"
              popper-class="test-roleId"
              style="width: 100%">
              <el-option
                v-for="item in commonFieldIdList"
                :key="item.id"
                :label="item.name"
                :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item
            label="数据下钻链接"
            prop="urlKey"
            :error="datasourceRulesErrors.urlKey">
            <el-select
              v-model="datasourceData.urlKey"
              clearable
              placeholder="请选择"
              popper-class="test-roleId"
              style="width: 100%">
              <el-option
                v-for="item in urlKeyList"
                :key="item.key"
                :label="item.value"
                :value="item.key"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="可展示的图样"
            prop="canUseGraph"
            :error="datasourceRulesErrors.canUseGraph">
            <el-select
              v-model="datasourceData.canUseGraph"
              multiple
              collapse-tags
              placeholder="请选择"
              popper-class="test-roleId"
              style="width: 100%">
              <el-option
                v-for="item in canUseGraphList"
                :key="item.key"
                :label="item.value"
                :value="item.key"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="el-dialog-footer idss-txt--center">
      <el-button
        type="primary"
        size="medium"
        @click="saveDatasource"
        custom>保存</el-button>
      <el-button
        size="medium"
        @click="resetForm"
        custom>重置</el-button>
      <el-button
        size="medium"
        @click="$emit('back')"
        custom>取消</el-button>
    </div>
  </div>
</template>
<script>

import { getErrorMsgByEnd } from '@/custom/utils/base.js'
import service from '../datasource-service.js'
import globalMixins from '@/mixins/globalMixins.js'
import { debounce } from 'fusion-utils'

// datasourceData 初始值
const datasourceData = {
  id: '',             // 主键
  datasourceName: '', // 数据源名称
  dbType: '',         // 数据库类型
  dbVersion: '',      // 数据库版本
  dbName: '',         // 数据库索引/schema名
  isShard: '1',       // 是否分片
  shardFormat: '',    // 分片格式
  tableName: '',      // type/表名
  timeField: '',      // 时间范围字段
  commonGroupId: '',  // 是否使用共通字段表
  commonFieldId: '',  // 区分字段
  canUseGraph: [],    // 可以用于展示的图样
  urlKey: ''          // 是否下钻到全文检索

}
export default {
  name: 'manage-datasource-add',
  props: {
    id: {
      type: String,
      default: ''
    }
  },
  mixins: [globalMixins, service],
  // components: {
  //   deptTreeDialog,
  //   resetPwd
  // },
  data () {
    return {
      datasourceData: JSON.parse(JSON.stringify(datasourceData)),
      canUseGraphList: [], // 图样下拉框
      dbTypeList: [], // 数据库下拉框
      urlKeyList: [], // 下钻下拉框
      commonGroupIdList: [], // 共通组下拉框
      commonFieldIdList: [], // 字段下拉框
      // 接口校验错误信息
      datasourceRulesErrors: {
      },
      // 设置校验规则
      datasourceRules: {
        datasourceName: [
          { required: true, message: '请输入数据源名称', trigger: 'blur' },
          { max: 20, message: '长度20以内', trigger: 'blur' }
        ],
        dbName: [
          { required: true, message: '请输入数据库索引/schema名', trigger: 'blur' },
          { max: 20, message: '长度20以内', trigger: 'blur' }
        ],
        dbVersion: { max: 10, message: '长度10以内', trigger: 'blur' },
        dbType: [
          { required: true, message: '请输入数据库类型', trigger: 'blur' }
        ],
        shardFormat: { max: 20, message: '长度20以内', trigger: 'blur' },
        tableName: [
          { required: true, message: '请输入type/表名', trigger: 'blur' },
          { max: 50, message: '长度50以内', trigger: 'blur' }
        ],
        canUseGraph: [
          { required: true, message: '请选择可展示的图样', trigger: 'blur' }
        ],
        timeField: [
          { required: true, message: '请输入时间范围字段', trigger: 'blur' },
          { max: 20, message: '长度20以内', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 初始化函数
    async init () {
      try {
        this.$refs['datasourceForm'] && this.$refs['datasourceForm'].clearValidate()
        // 获取图样列表
        this.getCanUseGraphList()
        // 获取数据库列表
        this.getDbTypeList()
        // 获取下钻列表
        this.getUrlKeyList()
        // 共通组下拉框
        this.getCommonGroupIdList()
        // 编辑状态获取用户信息
        if (this.id) {
          await this.getDatasourceInfo(this.id, 'isEdit')
          this.getCommonFieldList(this.datasourceData.commonGroupId)
        }
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
        this.getDatasourceInfo(this.id)
      } else {
        // 添加状态
        this.$set(this, 'datasourceData', JSON.parse(JSON.stringify(datasourceData)))
      }
      this.$refs['datasourceForm'].clearValidate()
    },

    /**
     * 保存数据源信息
    */
    saveDatasource: debounce(function () {
      this.$set(this, 'datasourceRulesErrors', {})
      this.$refs['datasourceForm'].validate(async (valid) => {
        if (valid) {
          try {
            await this.saveOrEditDatasource(this.datasourceData, this.id)
            // 成功提示
            this.showMessage(this.id ? '编辑数据源成功' : '新增数据源成功')
            // 触发父组件，父组件监听保存成功
            this.$emit('save')
          } catch (err) {
            // 判断编辑用户接口返回校验错误
            this.$set(this, 'datasourceRulesErrors', getErrorMsgByEnd(err))
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
