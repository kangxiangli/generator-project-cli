<template>
  <div id="dataTask">
    <idss-widget style="display: flex;" :main-style="{'padding': '16px 0 8px 0'}">
      <template slot="title-left"><span>筛选条件</span></template>
      <el-form :inline="true" size="small" plain :model="SearchForm" ref="SearchForm">
        <el-form-item label="提取类型" prop="extractType" label-width="70px">
          <el-select v-model="SearchForm.extractType" placeholder="请选择提取类型">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="规则名称/描述" prop="ruleName" label-width="110px">
          <el-input
            v-model="SearchForm.ruleName"
            placeholder="请输入规则名称/描述"></el-input>
        </el-form-item>
        <el-form-item style="margin-left: 8px;">
          <el-button @click="search" size="small" type="primary">查询</el-button>
          <el-button @click="resetSearchForm('SearchForm')" size="small">重置</el-button>
        </el-form-item>
      </el-form>
    </idss-widget>
    <idss-slide-aside
      left
      :handle="false"
      stretch
      width="260px"
      v-model="sideBarVisible"
      class="fields-container"
      style="height: 727px;"
      :mainStyle="{'padding-left': 0}">
      <template slot="aside">
        <div>
          <p style="padding: 16px 16px 0 16px;" class="idss-font--title">规则菜单</p>
          <div style="padding: 8px 16px 16px;">
            <el-input placeholder="输入关键字进行过滤" size="small" v-model="filterText" class="filterText"></el-input>
            <div style="max-height: 640px" v-iscroll>
              <div>
                <el-tree ref="libraryTree"
                  v-loading="loading['tree-list']"
                  :data="treeData"
                  node-key="id"
                  props="{
                    children: 'children',
                    label: 'label'
                  }"
                  :expand-on-click-node="false"
                  :filter-node-method="filterNode"
                  :default-expanded-keys="['root']"
                  @node-click="handleNodeClick">
                </el-tree>
              </div>
            </div>
          </div>
        </div>
      </template>
      <idss-widget :header-style="{'padding-left': '0'}">
        <template slot="title-left">
          <button
            style="margin: 0 8px 0 16px; padding: 0"
            @click="sideBarVisible = !sideBarVisible"
            :class="{ 'is-active' : sideBarVisible }"
            class="idss-button-icon">
            <idss-icon-svg :name="sideBarVisible ? 'spread' : 'pack-up'"></idss-icon-svg>
          </button>
          <span>规则列表</span>
          <el-button @click="delLibrary(checkSelection)"
            :disabled="!checkSelection.length"
            size="mini" type="danger" plain
            style="margin-left: 16px;">
            <idss-icon-svg name="delete-hover"></idss-icon-svg>
            批量删除
          </el-button>
        </template>
        <template slot="title-right">
          <el-upload
            ref="upload"
            action="/api/setting/etl/rule-manage/library-import-md5-file"
            :headers="{
              authToken: $store.getters['base/token$$']
            }"
            :auto-upload="true"
            :on-success="cangoIsRight"
            style="margin-right: 10px; display: inline-block;"
            name="fileUpload"
            class="uploadFile">
            <el-button slot="trigger" size="mini">
              <idss-icon-svg name="import"></idss-icon-svg>
              导入
            </el-button>
          </el-upload>
          <el-button @click="exportLibrary" size="mini">
            <idss-icon-svg name="export"></idss-icon-svg>
            导出
          </el-button>
          <el-button @click="ruleConfig('Add', '')" size="mini">
            <idss-icon-svg name="add"></idss-icon-svg>
            新建规则
          </el-button>
        </template>
        <el-table
          :data="tableData.data"
          border
          stripe
          :max-height="632"
          @selection-change="handleSelectionChange"
          v-loading="loading['library-list']">
          <template slot="empty">
            <idss-no-data></idss-no-data>
          </template>
          <el-table-column
            width="40px"
            type="selection"
            align="center">
          </el-table-column>
          <el-table-column
            width="45px"
            label="序号"
            type="index"
            align="center">
          </el-table-column>
          <el-table-column
            label="解析规则名称"
            prop="rule_name"
            align="center"
            width="130"
            show-overflow-tooltip></el-table-column>
          <el-table-column
            label="日志类型"
            prop="category_ch_name"
            show-overflow-tooltip
            align="center" width="90">
          </el-table-column>
          <el-table-column
            label="资产类型"
            prop="device_type_ch_name"
            align="center"
            width="90"
            show-overflow-tooltip></el-table-column>
          <el-table-column
            label="厂商"
            prop="factory_ch_name"
            show-overflow-tooltip
            align="center" width="90">
          </el-table-column>
          <el-table-column
            label="提取类型"
            prop="extract_type"
            show-overflow-tooltip
            align="center" width="100">
          </el-table-column>
          <el-table-column
            label="修改时间"
            prop="update_time" align="center" show-overflow-tooltip>
            <template slot-scope="scope">{{ scope.row.update_time | formatDate}}</template>
          </el-table-column>
          <el-table-column
            label="描述"
            prop="description"
            align="center"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column label="操作" align="center" width="234" fixed="right">
            <template slot-scope="scope">
              <el-button @click="ruleConfig('Look', scope.row)" type="primary" plain size="mini" micro>查看</el-button>
              <el-button @click="ruleConfig('Edit', scope.row)" type="primary" plain size="mini" micro>编辑</el-button>
              <el-button @click="ruleCopy(scope.row)" type="primary" plain size="mini" micro>复制</el-button>
              <el-button @click="delLibrary({uuid: scope.row.uuid})" type="danger" plain size="mini" micro>删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <idss-pagination
          style="padding: 8px;"
          :tableData="tableData"
          @size-change="dictionaryTableChange"
          @page-change="dictionaryTableChange"></idss-pagination>
      </idss-widget>
    </idss-slide-aside>

    <el-dialog title="规则复制"
      :visible.sync="dialogVisible"
      width="400px"
      custom>
      <el-form :model="copyForm" size="small" ref="copyForm" label-width="80px" class="demo-ruleForm">
        <el-form-item
          label="规则名称"
          prop="name"
          :rules="[{ required: true, message: '规则名称不能为空', trigger:'blur'}]"
          style="margin-bottom:0">
          <el-input v-model="copyForm.name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-row style="text-align:center">
          <el-button size="small" custom type="primary" @click="saveCopy('copyForm')">确 定</el-button>
          <el-button size="small" custom @click="cancelCopy('copyForm')">取 消</el-button>
        </el-row>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import globalMixins from '@/mixins/globalMixins.js'
import service from './analyze-manage-service.js'
import { debounce } from 'fusion-utils'
export default {
  mixins: [globalMixins, service],
  data () {
    return {
      filterText: '',
      SearchForm: {},
      checkSelection: [],
      options: [{
        label: 'JSON',
        value: 'json'
      }, {
        label: 'GROK',
        value: 'grok'
      }, {
        label: 'CEF',
        value: 'cef'
      }, {
        label: '键值对',
        value: 'kv'
      }, {
        label: '分隔符',
        value: 'splitChar'
      }, {
        label: '正则表达式',
        value: 'regex'
      }],
      tableData: {
        data: []
      },
      dialogVisible: false,
      copyForm: {
        name: '',
        uuid: ''
      },
      sideBarVisible: true,
      treeData: []
    }
  },
  watch: {
    filterText (val) {
      this.$refs.libraryTree.filter(val)
    }
  },
  methods: {
    // 查询
    search: debounce(function () {
      this.tableChange({ type: 'submit' }, this.tableData, this.getTableData)
    }, 300, true),

    dictionaryTableChange (params) {
      this.tableChange(params, this.tableData, this.getTableData)
    },
    handleSelectionChange (val) {
      this.checkSelection = val
    },
    resetSearchForm (formName) {
      this.SearchForm = {
        deviceTypeId: '',
        factoryId: '',
        logCategoryId: ''
      }
      this.$refs[formName].resetFields()
    },
    /**
     * 新增规则
     */
    ruleConfig (type, param) {
      this.$router.pushWithFromPath({
        name: 'manage-data-analyze' + type,
        query: { type: type, id: param.uuid }
      }, this.$route)
    },
    /**
     * 复制规则
     */
    ruleCopy (params) {
      this.copyForm.name = params['rule_name'] + '副本'
      this.copyForm.uuid = params['uuid']
      this.dialogVisible = true
    },
    cancelCopy (formName) {
      this.$refs[formName].resetFields()
      this.dialogVisible = false
    },
    saveCopy (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.copyLibrary({
            ruleName: this.copyForm.name,
            uuid: this.copyForm.uuid
          })
        } else {
          return false
        }
      })
    },
    cangoIsRight (response, file, fileList) {
      if (file.status === 'success') {
        if (file.response.status === 'error') {
          this.$message({
            type: 'error',
            message: file.response.message
          })
        }
      }
      this.getTableData(this.currentData)
    },
    submitUpload () {
      this.$refs.upload.submit()
    },
    handleNodeClick (data) {
      this.SearchForm = {}
      data['type'].includes('device') && (this.SearchForm['deviceTypeId'] = data['id'])
      data['type'].includes('factory') && (this.SearchForm['factoryId'] = data['id'])
      data['type'].includes('log') && (this.SearchForm['logCategoryId'] = data['id'])
      data['level'] && (this.SearchForm['level'] = data['level'])
      this.search()
    },
    filterNode (value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    init () {
      this.getLibraryTree()
      this.getTableData()
    }
  },
  mounted () {
    this.init()
  }
}
</script>
<style>
.uploadFile .el-upload-list {
  display: none;
}
.filterText input {
  border: 1px solid #fff;
  border-bottom: 1px solid #dcdfe6;
}
</style>
