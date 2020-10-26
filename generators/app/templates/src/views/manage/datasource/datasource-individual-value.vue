<template>
  <div class="manage-datasource-individual-value">
    <!-- search start -->
    <idss-widget :main-style="{'padding': '0 15px 15px 15px'}">
      <template slot="title-left">
        <span>筛选条件</span>
      </template>
      <el-form
        label-width="120px"
        plain
        ref="searchForm">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item
              label="数据源名称"
              prop="datasourceId">
              <el-select
                v-model="searchData.datasourceId"
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

          <el-col :span="8">
            <el-form-item label="字段值">
              <el-input
                v-model="searchData.individualValue"
                placeholder="请输入数字段值"
                maxlength="20"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="字段值名称">
              <el-input
                v-model="searchData.individualValueLogName"
                placeholder="请输入数字段值名称"
                maxlength="20"></el-input>
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
    </idss-widget>

    <!-- search end -->

    <!-- list start -->
    <idss-widget :footer-style="{padding: '6px 0'}">
      <template slot="title-left">
        <span>字段值列表</span>
        <el-button
          class="idss-margin--l-s"
          type="danger"
          size="small"
          plain
          :disabled="!multiSelect.length"
          @click="deleteIndividualValue(multiSelect)">
          <idss-icon-svg name="delete"></idss-icon-svg>
          <span>&nbsp;删除</span>
        </el-button>
      </template>
      <!-- list header start -->
      <template slot="title-right">
        <el-button
          size="small"
          plain
          @click="addIndividualValue">
          <idss-icon-svg name="add"></idss-icon-svg>
          <span>&nbsp;新建字段值</span>
        </el-button>
      </template>
      <el-table
        border
        stripe
        :height="TABLE_HEIGHT.HIGH"
        :max-height="TABLE_HEIGHT.HIGH"
        style="width: 100%"
        :data="searchData.data"
        v-loading="loading['manage-datasource-individual-value-list']"
        :default-sort="{prop: 'individualValue', order: 'descending'}"
        @sort-change="individualValueTableChange"
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
          prop="individualValue"
          label="字段值"
          sortable="custom"
          align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click="getIndividualValueInfo(scope.row.id)">{{scope.row.individualValue}}</el-button>
          </template>
        </el-table-column>

        <el-table-column
          prop="datasourceName"
          label="数据源名称"
          align="center"></el-table-column>

        <el-table-column
          prop="individualLogName"
          label="字段值名称"
          align="center"></el-table-column>

        <el-table-column
          prop="individualEqptName"
          label="设备类型"
          align="center"></el-table-column>

        <el-table-column
          prop="individualDescName"
          label="描述"
          align="center"></el-table-column>

        <el-table-column
          label="操作"
          width="126"
          align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              plain
              micro
              @click="editIndividualValue(scope.row.id)">编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              plain
              micro
              @click="deleteIndividualValue([scope.row.id])">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <template slot="footer">
        <idss-pagination
          :tableData="searchData"
          @page-change="individualValueTableChange"
          @size-change="individualValueTableChange"></idss-pagination>
      </template>
    </idss-widget>
    <!-- list end -->

    <!-- add/edit 组件 start -->
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="isShowAdd"
      :title="!this.id ? '字段值新增' : '字段值编辑'"
      width="780px">
      <add-individual-value
        :id="id"
        v-if="isShowAdd"
        @back="isShowAdd = false"
        @save="handleSave"></add-individual-value>
    </el-dialog>
    <!-- add/edit 组件 end -->

    <!-- datasource info 组件 start -->
    <el-dialog
      :visible.sync="isShowInfo"
      title="字段值详情">
      <individual-value-info
        :id="id"
        v-if="isShowInfo"></individual-value-info>
      <div
        slot="footer"
        class="dialog-footer idss-txt--center">
        <el-button
          size="medium"
          @click="individualValueEdit"
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
import service from './datasource-individual-value-service.js'
import addIndividualValue from './datasource-components/add-individual-value'
import individualValueInfo from './datasource-components/individual-value-info'
import { debounce } from 'fusion-utils'
const defaultSearch = {
  datasourceId: '',           // 数据源id
  individualValue: '',        // 字段值
  individualValueLogName: ''  // 字段值名称
}
export default {
  name: 'manage-datasource-individual-value',
  mixins: [globalMixins, service],
  components: {
    addIndividualValue,
    individualValueInfo
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
      datasourceNameList: [],  // 数据源下拉框
      multiSelect: []

    }
  },
  methods: {
    // 组件初始化
    async init () {
      this.tableChange({ type: 'init', defaultSort: true }, this.searchData, this.getIndividualValueList)
      // 获取数据源列表
      this.getDatasourceNameList()
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
      this.tableChange({ type: 'submit' }, this.searchData, this.getIndividualValueList)
    }, 300),

    /**
       * 添加字段
       */
    addIndividualValue () {
      this.isShowAdd = true
      this.id = ''
    },

    /**
       * 编辑字段
       * @param {string} id
       */
    editIndividualValue (id) {
      this.id = id
      this.isShowAdd = true
    },

    /**
       * 展示字段详情
       * @param {string} id
       */
    getIndividualValueInfo (id) {
      this.id = id
      this.isShowInfo = true
    },
    /**
       * 字段展示页面直接编辑
       */
    individualValueEdit () {
      this.isShowInfo = false
      this.isShowAdd = true
    },

    /**
       * add/edit 保存数据源后出发
       */
    handleSave () {
      this.isShowAdd = false
      // 重新获取数据源列表
      this.tableChange({ type: 'submit' }, this.searchData, this.getIndividualValueList)
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
    deleteIndividualValue: debounce(async function (idList) {
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
          await this.batchDeleteIndividualValue({ idList: idList })
          // 删除成功
          this.showMessage('删除成功!')
          // 重新获取列表
          this.tableChange({ type: 'submit' }, this.searchData, this.getIndividualValueList)
        } catch (err) {
          // 删除成功
          this.showMessage(err.message, 'error')
        }
      }
    }, 300),
    // 表头监听
    individualValueTableChange (params) {
      this.tableChange(params, this.searchData, this.getIndividualValueList)
    }
  },
  mounted () {
    this.init()
  }
}
</script>
