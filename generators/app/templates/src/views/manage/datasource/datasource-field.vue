<template>
  <div class="manage-datasource-field">
    <!-- search start -->
    <idss-widget :global-style="{padding: '10px 15px'}">
      <idss-collapse
        title="筛选条件"
        :is-button-show="false"
        :collapse="false"
        is-arrow-show
        style="position: relative;">
        <el-form
          class="manage-datasource-field__search"
          label-width="120px"
          ref="searchForm"
          plain
          style="margin-right: 20px">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="数据源名称">
                <el-input
                  v-model="searchData.datasourceName"
                  placeholder="请输入数据源名称"
                  maxlength="20"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="字段名称">
                <el-input
                  v-model="searchData.field"
                  placeholder="请输入中文/英文字段名称"
                  maxlength="20"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="共通/个别区分">
                <el-checkbox-group v-model="searchData.isCommonOrIsIndividual">
                  <el-checkbox label="1">共通字段</el-checkbox>
                  <el-checkbox label="0">个别字段</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row
            type="flex"
            justify="center">
            <el-col
              :span="8"
              :offset="8">
              <el-button
                type="primary"
                @click="searchSubmit">查询</el-button>
              <el-button
                @click="formReset">重置</el-button>
            </el-col>
          </el-row>
        </el-form>
      </idss-collapse>
    </idss-widget>
    <!-- search end -->

    <!-- list start -->
    <idss-widget :footer-style="{padding: '6px 0'}">
      <template slot="title-left">
        <span>字段列表</span>
        <el-button
          class="idss-margin--l-s"
          type="danger"
          size="small"
          plain
          :disabled="!multiSelect.length"
          @click="deleteField(multiSelect)">
          <idss-icon-svg name="delete"></idss-icon-svg>
          <span>&nbsp;删除</span>
        </el-button>
      </template>
      <!-- list header start -->
      <template slot="title-right">
        <el-button
          size="small"
          plain
          @click="addField">
          <idss-icon-svg name="add"></idss-icon-svg>
          <span>&nbsp;新建字段</span>
        </el-button>
      </template>
      <el-table
        border
        stripe
        :height="TABLE_HEIGHT.HIGH"
        :max-height="TABLE_HEIGHT.HIGH"
        style="width: 100%"
        :data="searchData.data"
        v-loading="loading['manage-datasource-field-list']"
        :default-sort="{prop: 'name', order: 'descending'}"
        @sort-change="fieldFieldTableChange"
        @selection-change="handleSelectionChange">
        <template slot="empty">
          <idss-no-data></idss-no-data>
        </template>
        <el-table-column
          type="selection"
          width="40"
          align="center"></el-table-column>

        <el-table-column
          type="index"
          label="序号"
          width="45"
          align="center"></el-table-column>

        <el-table-column
          prop="name"
          label="字段名称(中文)"
          sortable="custom"
          align="center">
          <template v-slot="{ row }">
            <el-button
              type="text"
              size="small"
              @click="getField(row.id)">{{row.name}}</el-button>
          </template>
        </el-table-column>

        <el-table-column
          prop="field"
          label="字段名称(英文)"
          sortable="custom"
          align="center"></el-table-column>

        <el-table-column
          prop="type"
          label="字段类型"
          sortable="custom"
          align="center">
          <template v-slot="{ row }">
            <span>{{row.typeText}}</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="isCommon"
          label="是否共通"
          sortable="custom"
          align="center">
          <template v-slot="{ row }">
            <span>{{row.isCommonText}}</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="dictionary"
          label="字典名"
          sortable="custom"
          align="center"></el-table-column>

        <el-table-column
          prop="canGroup"
          label="可否用于分组"
          sortable="custom"
          align="center">
          <template v-slot="{ row }">
            <span>{{row.canGroupText}}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="操作"
          width="126"
          align="center">
          <template v-slot="{ row }">
            <el-button
              size="mini"
              type="primary"
              plain
              micro
              @click="editField(row.id)">编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              plain
              micro
              @click="deleteField([row.id])">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <template slot="footer">
        <idss-pagination
          :tableData="searchData"
          @page-change="fieldFieldTableChange"
          @size-change="fieldFieldTableChange"></idss-pagination>
      </template>
    </idss-widget>
    <!-- list end -->

    <!-- add/edit 组件 start -->
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="isShowAdd"
      :title="!this.id ? '字段新增' : '字段编辑'"
      width="880px">
      <add-field
        :id="id"
        v-if="isShowAdd"
        @back="isShowAdd = false"
        @save="handleSave"></add-field>
    </el-dialog>
    <!-- add/edit 组件 end -->

    <!-- datasource info 组件 start -->
    <el-dialog
      :visible.sync="isShowInfo"
      title="字段详情">
      <field-info
        :id="id"
        v-if="isShowInfo"></field-info>
      <div
        slot="footer"
        class="dialog-footer idss-txt--center">
        <el-button
          size="medium"
          @click="fieldInfoEdit"
          custom>编辑</el-button>
        <el-button
          size="medium"
          @click="isShowInfo = false"
          custom>取消</el-button>
      </div>
    </el-dialog>
    <!-- datasourceinfo 组件 end -->
  </div>
</template>
<script>
import globalMixins from '@/mixins/globalMixins.js'
import service from './datasource-field-service.js'
import addField from './datasource-components/add-field'
import fieldInfo from './datasource-components/field-info'
import { debounce } from 'fusion-utils'
const defaultSearch = {
  field: '',           // 字段名称
  datasourceName: '',   // 数据源名称
  isCommonOrIsIndividual: []
}
export default {
  name: 'manage-datasource-field',
  mixins: [globalMixins, service],
  components: {
    addField,
    fieldInfo
  },
  data () {
    return {
      collapse: false,
      searchData: {
        data: [],
        ...defaultSearch
      },
      isShowAdd: false,
      isShowInfo: false,
      id: '',
      multiSelect: []

    }
  },
  methods: {
    // 组件初始化
    async init () {
      this.tableChange({ type: 'init', defaultSort: true }, this.searchData, this.getFieldList)
    },

    /**
       * 表单重置
       */
    formReset () {
      this.searchData = Object.assign(this.searchData, defaultSearch)
    },

    /**
       * 表单提交
       */
    searchSubmit: debounce(function () {
      this.tableChange({ type: 'submit' }, this.searchData, this.getFieldList)
    }, 300),

    /**
       * 添加字段
       */
    addField () {
      this.isShowAdd = true
      this.id = ''
    },

    /**
       * 编辑字段
       * @param {string} id
       */
    editField (id) {
      this.id = id
      this.isShowAdd = true
    },

    /**
       * 展示字段详情
       * @param {string} id
       */
    getField (id) {
      this.id = id
      this.isShowInfo = true
    },
    /**
       * 字段展示页面直接编辑
       */
    fieldInfoEdit () {
      this.isShowInfo = false
      this.isShowAdd = true
    },

    /**
       * add/edit 保存数据源后出发
       */
    handleSave () {
      this.isShowAdd = false
      // 重新获取数据源列表
      this.tableChange({ type: 'submit' }, this.searchData, this.getFieldList)
    },
    /**
       * 批量chechbox处理
       * @param {array} list
       */
    handleSelectionChange (list) {
      this.multiSelect = []
      if (list && list.length) {
        list.map(row => {
          this.multiSelect.push(row.id)
        })
      }
    },
    /**
       * 删除字段
       * @param {array} idList
       */
    deleteField: debounce(async function (idList) {
      if (!idList.length) {
        this.showMessage('请选择数据操作项', 'warning')
      } else {
        // 确认提示
        await this.confirmBox({
          message: `是否要删除数据吗?`,
          title: '提示',
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        try {
          await this.batchDeleteField({ idList: idList })
          // 删除成功
          this.showMessage('删除成功!')
          // 重新获取列表
          this.tableChange({ type: 'submit' }, this.searchData, this.getFieldList)
        } catch (err) {
          // 删除成功
          this.showMessage(err.message, 'error')
        }
      }
    }, 300),
    // 表头监听
    fieldFieldTableChange (params) {
      this.tableChange(params, this.searchData, this.getFieldList)
    }
  },
  mounted () {
    this.init()
  }
}
</script>
