<template>
  <div class="datadic">
    <!-- 条件查询 -->
    <idss-widget style="display: flex;" :main-style="{'padding': '16px 0 8px 16px'}">
      <template slot="title-left">筛选条件</template>
      <el-form :inline="true" @submit.native.prevent plain>
        <el-form-item label="表单名称">
          <el-input
            size="small"
            type="input"
            v-model="dictionaryName"
            placeholder="请输入关键字"
            @keyup.enter.native="searchName"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="medium" type="primary" custom @click="searchName">查询</el-button>
        </el-form-item>
      </el-form>
    </idss-widget>

    <!-- 字典列表 -->
    <idss-widget v-loading="loading['dict-list']">
      <template slot="title-left">
        <span>字典列表</span>
        <el-button @click="delDic" :disabled="!checkSelection.length"
          style="margin-left: 16px;"
          type="danger" plain size="mini">
          <idss-icon-svg name="delete-hover"></idss-icon-svg>
          删除
        </el-button>
      </template>
      <template slot="title-right">
        <el-button @click="addDictionary" size="mini">
          <idss-icon-svg name="add"></idss-icon-svg>
          新建字典
        </el-button>
      </template>
      <el-table
        :data="tableData"
        ref="multipleTable"
        style="width: 100%;"
        border stripe
        @selection-change="handleSelectionChange">
        <template slot="empty">
          <idss-no-data></idss-no-data>
        </template>
        <el-table-column :selectable="isDisable" type="selection" align="center" width="40px"></el-table-column>
        <el-table-column type="index" label="序号" width="45px" align="center"></el-table-column>
        <el-table-column prop="dictName" label="表单名称" align="center"></el-table-column>
        <el-table-column prop="dictChName" label="表单别名" align="center"></el-table-column>
        <el-table-column label="操作" align="center" width="72px">
          <template slot-scope="scope">
            <el-button @click="businessDetail(scope.row)" type="primary" plain size="mini" micro>详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </idss-widget>

    <!-- 新增我的表单 -->
    <el-dialog :close-on-click-modal="false" :visible.sync="addDialogVisible" custom>
      <template v-slot:title>
        <div>
          <span>新增我的表单</span>
          <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
          <!-- 文件没有style标签，为了减少打包体积，该处内联啦！！！-->
          <span class="idss-font--sub" style="color: var(--red)">数据导入将在完成表单创建后进行</span>
        </div>
      </template>
      <add-dictionary-dialog
        ref="addDictionaryRef"
        :visible.sync="addDialogVisible"
        @addSuccess="addDictionarySuccess"></add-dictionary-dialog>
    </el-dialog>

    <!-- 业务字典详情 -->
    <el-dialog title="业务字典详情" :visible.sync="dialogTableVisible" custom>
      <business-detail-dialog
        ref="businessDetailRef"
        :visible.sync="dialogTableVisible"
        :data="currentRowData"></business-detail-dialog>
    </el-dialog>
  </div>
</template>

<script>
/**
 * 动态字典入口
 */
import globalMixins from '@/mixins/globalMixins.js'
import service from './form-service.js'
import AddDictionaryDialog from './components/add-dictionary-dialog'
import BusinessDetailDialog from './components/business-detail-dialog'

export default {
  mixins: [globalMixins, service],
  name: 'businessDic',
  data () {
    return {
      tableData: [], // 字典列表数据
      dialogTableVisible: false, // 字典详情页弹框
      addDialogVisible: false, // 新增字典弹框
      dictionaryName: 'etl_', // 模糊查询字段 表单名称，以etl_开头
      checkSelection: [],
      currentRowData: {}
    }
  },
  methods: {
    // 初始化表格数据
    init () {
      this.getTableData()
    },
    /**
     * 详情
     * @param {Object} param 表格当前行数据
     */
    async businessDetail (param) {
      this.currentRowData = param
      this.dialogTableVisible = true
      await this.$nextTick()
      this.$refs['businessDetailRef'].init()
    },
    /**
     * 表格每行是否可以选择
     * @param {Object} row 表格当前行数据
     */
    isDisable (row) {
      let { dictEditable } = row // 根据后台传过来的这个字段进行判断
      if (dictEditable) {
        return true
      } else {
        return false
      }
    },
    /**
     * 表格选择改变
     * @param {Array} val 选择的表格行的集合
     */
    handleSelectionChange (val) {
      this.checkSelection = val
    },
    // 删除
    delDic () {
      if (!this.checkSelection.length) {
        this.showMessage('没有选择删除数据', 'warning', { showClose: true })
      } else {
        this.deleteConfirm(this.checkSelection)
      }
    },
    /**
     * 删除确定
     * @param {Object} row 当前行数据
     */
    async deleteConfirm (row) {
      this.checkSelection = []
      row.map(obj => {
        this.checkSelection.push(obj.id)
      })
      await this.$confirm('此操作将永久删除已选项, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      this.deleteDictionary(this.checkSelection)
    },
    /**
     * 新增字典
     */
    async addDictionary () {
      this.addDialogVisible = true
      await this.$nextTick()
      this.$refs['addDictionaryRef'].init()
    },
    /**
     * 新增字典成功 需要重新拉取表格数据
     */
    addDictionarySuccess (param) {
      param && this.getTableData()
    }
  },
  mounted () {
    this.init()
  },
  components: {
    AddDictionaryDialog, // 新增
    BusinessDetailDialog
  }
}
</script>
