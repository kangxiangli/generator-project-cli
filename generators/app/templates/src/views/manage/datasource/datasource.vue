<template>
  <div class="manage-datasource-datasource">
    <!-- search start -->
    <idss-widget style="padding: 15px;">
      <el-form
        :inline="true"
        plain
        ref="searchForm">
        <el-form-item>
          <span class="idss-title-filtrate">筛选条件</span>
        </el-form-item>
        <el-form-item label="数据源名称">
          <el-input
            style="width: 350px;"
            v-model="searchData.condition"
            placeholder="请输入数据源名称"
            maxlength="20"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="searchSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </idss-widget>
    <!-- search end -->
    <!-- list start -->
    <idss-widget :footer-style="{padding: '6px 0'}">
      <template slot="title-left">
        <span>数据源列表</span>
        <el-button
          class="idss-margin--l-s"
          type="danger"
          size="small"
          plain
          :disabled="!multiSelect.length"
          @click="deleteDatasource(multiSelect)">
          <idss-icon-svg name="delete"></idss-icon-svg>
          <span>&nbsp;删除</span>
        </el-button>
      </template>
      <!-- list header start -->
      <template slot="title-right">
        <el-button
          size="small"
          plain
          @click="addDatasource">
          <idss-icon-svg name="add"></idss-icon-svg>
          <span>新建数据源</span>
        </el-button>
      </template>
      <el-table
        border
        stripe
        :height="TABLE_HEIGHT.HIGH"
        :max-height="TABLE_HEIGHT.HIGH"
        style="width: 100%"
        :data="searchData.data"
        v-loading="loading['manage-datasource-datasource-list']"
        :default-sort="{prop: 'datasourceName', order: 'descending'}"
        @sort-change="datasourceTableChange"
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
          prop="datasourceName"
          label="数据源名称"
          sortable="custom"
          align="center">
          <template v-slot="{ row }">
            <el-button
              type="text"
              size="small"
              @click="getDatasource(row.id)">{{row.datasourceName}}</el-button>
          </template>
        </el-table-column>

        <el-table-column
          prop="dbType"
          label="数据库类型"
          sortable="custom"
          align="center"></el-table-column>

        <el-table-column
          prop="dbName"
          label="索引/schema名"
          sortable="custom"
          align="center"></el-table-column>

        <el-table-column
          prop="tableName"
          label="type/表名"
          sortable="custom"
          align="center"></el-table-column>

        <!-- 后台要求， 展示使用 commonGroupText 字段， 排序使用 name 字段 -->
        <el-table-column
          prop="name"
          label="共通字段组名称"
          sortable="custom"
          align="center">
          <template v-slot="{ row }">
            <span>{{row.commonGroupText}}</span>
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
              @click="editDatasource(row.id)">编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              plain
              micro
              @click="deleteDatasource([row.id])">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <template slot="footer">
        <idss-pagination
          :tableData="searchData"
          @page-change="datasourceTableChange"
          @size-change="datasourceTableChange"></idss-pagination>
      </template>
    </idss-widget>
    <!-- list end -->

    <!-- add/edit 组件 start -->
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="isShowAdd"
      :title="!this.id ? '数据源新增' : '数据源编辑'"
      width="780px">
      <add-datasource
        :id="id"
        v-if="isShowAdd"
        @back="isShowAdd = false"
        @save="handleSave"></add-datasource>
    </el-dialog>
    <!-- add/edit 组件 end -->

    <!-- datasource info 组件 start -->
    <el-dialog
      custom
      :visible.sync="isShowInfo"
      title="数据源详情">
      <datasource-info
        :id="id"
        v-if="isShowInfo"></datasource-info>
      <div
        slot="footer"
        class="dialog-footer idss-txt--center">
        <el-button
          size="medium"
          @click="datasourceInfoEdit"
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
import service from './datasource-service.js'
import addDatasource from './datasource-components/add-datasource'
import datasourceInfo from './datasource-components/datasource-info'
import { debounce } from 'fusion-utils'
export default {
  name: 'manage-datasource-datasource',
  mixins: [globalMixins, service],
  components: {
    addDatasource,
    datasourceInfo
  },
  data () {
    return {
      collapse: false,
      searchData: {
        data: []
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
      this.tableChange({ type: 'init', defaultSort: true }, this.searchData, this.getDatasourceList)
    },
    /**
       * 表单提交
       */
    searchSubmit: debounce(function () {
      this.tableChange({ type: 'submit' }, this.searchData, this.getDatasourceList)
    }, 300),

    /**
       * 添加数据源
       */
    addDatasource () {
      this.isShowAdd = true
      this.id = ''
    },

    /**
       * 编辑数据源
       * @param {string} id
       */
    editDatasource (id) {
      this.id = id
      this.isShowAdd = true
    },

    /**
       * 展示数据源详情
       * @param {string} id
       */
    getDatasource (id) {
      this.id = id
      this.isShowInfo = true
    },
    /**
       * 数据源展示页面直接编辑
       */
    datasourceInfoEdit () {
      this.isShowInfo = false
      this.isShowAdd = true
    },

    /**
       * add/edit 保存数据源后出发
       */
    handleSave () {
      this.isShowAdd = false
      // 重新获取数据源列表
      this.tableChange({ type: 'submit' }, this.searchData, this.getDatasourceList)
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
       * 删除数据源
       * @param {array} datasourceIdList
       */
    deleteDatasource: debounce(async function (datasourceIdList) {
      if (!datasourceIdList.length) {
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
          await this.batchDeleteDatasource({ idList: datasourceIdList })
          // 删除成功
          this.showMessage('删除成功!')
          // 重新获取列表
          this.tableChange({ type: 'submit' }, this.searchData, this.getDatasourceList)
        } catch (err) {
          // 删除成功
          this.showMessage(err.message, 'error')
        }
      }
    }, 300),
    // 表头监听
    datasourceTableChange (params) {
      this.tableChange(params, this.searchData, this.getDatasourceList)
    }
  },
  mounted () {
    this.init()
  }
}
</script>
