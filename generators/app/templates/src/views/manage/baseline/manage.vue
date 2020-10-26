<template>
  <div class="manage-baseline-manage">
    <!-- 搜索 -->
    <idss-widget :style="{padding: '15px'}">
      <div class="search">
        <span class="search-condition_title">筛选条件</span>
        <span class="search-condition_label">基线名称</span>
        <el-input
          @keyup.enter.native="searchTable"
          v-model="serachDataParm.name"
          placeholder="请输入基线名称,回车查询"></el-input>
        <el-button type="primary" size="medium" custom @click="searchTable">查询</el-button>
      </div>
    </idss-widget>
    <el-row>
      <el-col :span="24">
        <idss-widget
          v-loading.body="loading['event-type-tree']"
          :footer-style="{padding: '10px'}"
          :header-style="{padding: '10px 15px'}">
          <template slot="title-left" padding="0 10px">
            <span class="is-title">基线管理</span>
            <el-button
              type="danger"
              plain
              size="mini"
              class="idss-margin--l-m"
              @click="delBatchConfirm"
              :disabled="!this.multipleSelection.length">
              <idss-icon-svg name="delete"></idss-icon-svg>
              <span>删除</span>
            </el-button>
          </template>
          <template slot="title-right">
            <el-button size="mini" @click="addBaseLine">
              <idss-icon-svg name="add"></idss-icon-svg>
              <span>新建</span>
            </el-button>
          </template>
          <el-table
            border
            stripe
            :data="baseLineDataTable.data"
            v-loading="loading['query']"
            @selection-change="handleSelectionChange"
            @cell-click="blDataClick"
            style="width: 100%">
            <template slot="empty">
              <idss-no-data></idss-no-data>
            </template>
            <el-table-column type="selection" width="40" align="center"></el-table-column>
            <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
            <el-table-column
              show-overflow-tooltip
              class-name="is-cursor"
              align="center"
              prop="name"
              label="基线名称">
              <template slot-scope="scope">
                <el-button type="text" size="small" custom>{{scope.row.name}}</el-button>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip align="center" prop="description" label="基线说明"></el-table-column>
            <el-table-column show-overflow-tooltip align="center" prop="primaryKey" label="基线主键"></el-table-column>
            <el-table-column show-overflow-tooltip align="center" label="生成时间">
              <template slot-scope="scope">{{formatDate(scope.row.generatedDate)}}</template>
            </el-table-column>
            <el-table-column show-overflow-tooltip align="center" label="创建时间">
              <template slot-scope="scope">{{formatDate(scope.row.createTime)}}</template>
            </el-table-column>
            <el-table-column align="center" prop="frequency" label="生成频率"></el-table-column>
            <el-table-column min-width="110" align="center" label="开关">
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.status"
                  active-text="开"
                  inactive-text="关"
                  @change="swichChange(scope.row)"></el-switch>
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="174">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="mini"
                  micro
                  custom
                  plain
                  @click="blLook(scope.row)">查看</el-button>
                <el-button
                  type="primary"
                  size="mini"
                  micro
                  custom
                  plain
                  @click="blCopy(scope.row)">复制</el-button>
                <el-button
                  type="primary"
                  size="mini"
                  micro
                  custom
                  plain
                  @click="blEdit(scope.row)">编辑</el-button>
              </template>
            </el-table-column>
          </el-table>
          <template slot="footer">
            <idss-pagination
              :tableData="baseLineDataTable"
              @size-change="baseLineDataTableChange"
              @page-change="baseLineDataTableChange"></idss-pagination>
          </template>
        </idss-widget>
      </el-col>
    </el-row>
    <!-- 批量删除 dialog -->
    <el-dialog
      custom
      class="del-batch-dialog"
      append-to-body
      title="提示"
      :visible.sync="delBatchDialogVisible"
      width="40%">
      <span
        v-if="multipleSelection.length > 1"
        style="display: -webkit-box;-webkit-box-orient: vertical;-webkit-line-clamp: 4;overflow: hidden;">确认批量删除 {{ delBatchNameList }} 吗？</span>
      <span v-else>确认删除 {{ delBatchNameList }} 吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="delBatchDialogVisible = false">取消</el-button>
        <el-button size="small" type="primary" @click="delBatch" :loading="delBatchBtnLoading">确认</el-button>
      </span>
    </el-dialog>
    <el-dialog
      min-width
      custom
      :title="dgValList.title"
      :visible.sync="dgValList.visible"
      width="50%"
      :lock-scroll="true"
      @close="clearDgValList">
      <el-row>
        <el-col :span="24">
          <div class="idss-margin--b-m">
            <el-input
              size="mini"
              @change="searchDGValList"
              v-model="dgValList.search"
              type="input"
              placeholder="请输入搜索内容,回车查询"
              suffix-icon="el-icon-search"></el-input>
          </div>
        </el-col>
      </el-row>
      <idss-widget
        class="dg-risk-user"
        v-loading="loading['values-list']"
        shadow="never"
        :footer-style="{padding: '15px 0 0'}">
        <idss-widget-tool title slot="tool" border-bottom padding="10px">字段列表</idss-widget-tool>
        <el-table :data="vListTable.data" border stripe style="width: 100%">
          <template slot="empty">
            <idss-no-data></idss-no-data>
          </template>
          <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
          <template v-for="item in vListTable.column">
            <el-table-column
              show-overflow-tooltip
              :key="item.key"
              align="center"
              :prop="item.key"
              :label="item.name"></el-table-column>
          </template>
          <el-table-column show-overflow-tooltip align="center" prop="value" label="值"></el-table-column>
        </el-table>
        <template slot="footer">
          <idss-pagination
            :tableData="vListTable"
            @size-change="vListTableChange"
            @page-change="vListTableChange"></idss-pagination>
        </template>
      </idss-widget>
    </el-dialog>
  </div>
</template>

<script>
import { formatDate } from 'fusion-utils'
import globalMixins from '@/mixins/globalMixins.js'
import service from './manage-service.js'
export default {
  name: 'manage-baseline-manage',
  mixins: [globalMixins, service],
  data () {
    return {
      serachDataParm: {
        name: ''
      },
      dgValList: {
        visible: false,
        title: '',
        baselineId: '',
        search: ''
      },
      baseLineDataTable: {
        data: []
      },
      vListTable: {
        column: [],
        data: []
      },
      delDialogVisible: false,          // 删除弹出框弹出框显示状态
      delBatchBtnLoading: false,        // 批量删除弹出框确定按钮的loding
      delBatchDialogVisible: false,     // 批量删除弹出框显示状态
      multipleSelection: []
    }
  },
  methods: {
    searchTable () {
      this.list('submit')
    },
    searchEnterFun (e) {
      let keyCode = window.event ? e.keyCode : e.which
      if (keyCode === 13) {
        this.list('submit')
      }
    },
    formatDate (timestamp) {
      if (timestamp === null || timestamp === undefined || timestamp === '') {
        return ''
      } else {
        return formatDate.call(new Date(+timestamp), 'yyyy-MM-dd hh:mm:ss')
      }
    },
    addBaseLine () {
      this.$router.replaceTagPush({
        name: 'manage-baseline-manage-config-add',
        params: { groupId: '3' }
      }, this.$route)
    },
    blLook (row) {
      this.$router.replaceTagPush({
        name: 'manage-baseline-manage-config-look',
        params: { groupId: '3', id: row.strategyId }
      }, this.$route)
    },
    blEdit (row) {
      this.$router.replaceTagPush({
        name: 'manage-baseline-manage-config-edit',
        params: { groupId: '3', id: row.strategyId }
      }, this.$route)
    },
    baseLineDataTableChange (params) {
      this.tableChange(params, this.baseLineDataTable, this.getBaseLineDataTable)
    },
    list (type = 'init') {
      this.tableChange({ type: type }, this.baseLineDataTable, this.getBaseLineDataTable)
    },
    // 批量删除框
    delBatchConfirm () {
      if (!this.multipleSelection.length) {
        return this.showMessage('请选择数据操作项', 'warning')
      }
      this.delBatchDialogVisible = true
    },
    // 批量删除
    delBatch () {
      this.delBatchBtnLoading = true
      this.delBaseLine()
    },
    // 勾选选中项, 并批量删除按钮状态
    handleSelectionChange (arr) {
      // 全部选择 this.$refs.multipleTable.data.length === val.length
      // 部分选择
      // if (arr.length >= 1) {
      //   this.delBatchBtnDisabled = false
      // } else {
      //   this.delBatchBtnDisabled = true
      // }
      this.multipleSelection = arr
    },
    swichChange (row) {
      this.setEnable(row)
      // this.tableChange({type: 'refresh'}, this.baseLineDataTable, this.getBaseLineDataTable)
    },
    blCopy (row) {
      this.$prompt('复制关联策略', '提示', {
        customClass: 'bl-copy-prompt',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue: row.name + '(副本)'
      }).then(({ value }) => {
        this.copyBaseLine(row, value)
      }).catch(() => {
        // this.showMessage('已取消', 'info')
      })
    },
    blDataClick (row, column, cell, event) {
      if (column.label === '基线名称') {
        this.dgValList.visible = true
        this.dgValList.title = row.name
        this.dgValList.baselineId = row.id
        this.tableChange({ type: 'init' }, this.vListTable, this.getVListDataTable)
      }
    },
    clearDgValList () {
      this.dgValList.visible = false
      this.dgValList.search = ''
      this.dgValList.baselineId = ''
    },
    searchDGValList (e) {
      // let keyCode = window.event ? e.keyCode : e.which
      // if (keyCode === 13) {
      //   this.tableChange({type: 'init'}, this.vListTable, this.getVListDataTable)
      // }
      this.tableChange({ type: 'init' }, this.vListTable, this.getVListDataTable)
    },
    vListTableChange (params) {
      this.tableChange(params, this.vListTable, this.getVListDataTable)
    },
    init () {
      this.list('refresh')
    }
  },
  computed: {
    // 批量删除的连续名字
    delBatchNameList () {
      return this.multipleSelection.map(v => v.name).join(',')
    }
  },
  mounted () {
    this.list()
  },
  created () {
    this.r = this.$route.query._r
  }
}
</script>
<style lang="postcss">
.el-message-box.bl-copy-prompt {
  & .el-input__inner {
    height: 32px;
    line-height: 32px;
  }
}
</style>

<style scoped lang="postcss">
.manage-baseline-manage {
  /* 搜索框 & 搜索按钮 */
  & .search {
    display: flex;
    white-space: nowrap;
    width: 60%;
    & > * {
      margin-right: 10px;
    }
    & .search-condition_title {
      display: flex;
      align-items: center;
      font-size: var(--font-size-4);
      font-weight: bold;
    }
    & .search-condition_label {
      display: flex;
      align-items: center;
      font-size: var(--font-size-default);
      font-weight: bold;
    }
  }

  /* 搜索框 */
  & .search {
    & >>> .el-input__inner {
      height: 32px;
      line-height: 32px;
      font-size: var(--font-size-default);
    }
  }
  & .dg-risk-user {
    margin: 0;
  }
}
.el-table >>> td.is-cursor {
  cursor: pointer;
}
.el-dialog__wrapper[min-width] >>> .el-dialog {
  min-width: 760px;
}
</style>
