<template>
  <div class="manage-strategy-manage">
    <!-- 搜索 -->
    <idss-widget :style="{padding: '16px 0 0 16px'}">
      <el-form label-width="70px">
        <el-row>
          <el-col style="width: 80px;line-height: 32px;">
            <span class="idss-title-filtrate">筛选条件</span>
          </el-col>
          <el-col :span="8">
            <el-form-item label="规则名称">
              <el-input
                size="small"
                @keyup.enter.native="searchTable"
                v-model.trim="serachDataParm.name"
                placeholder="请输入规则名称,回车查询"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-button type="primary" size="medium" custom @click="searchTable" style="margin-left: 8px;">查询</el-button>
          </el-col>
        </el-row>
      </el-form>
    </idss-widget>
    <el-row type="flex">
      <el-col :span="4">
        <idss-widget :global-style="{padding: '16px'}" :header-style="{padding: 0}" v-loading="loading['query-scene-tree']">
          <template slot="title-left">分类</template>
          <div style="height:685px" v-iscroll>
            <el-tree
              @check="handleNodeClick"
              ref="searchTree"
              check-on-click-node
              class="filter-tree"
              :data="sceneTree"
              :props="defaultProps"
              show-checkbox
              node-key="id"
              :default-expand-all="true"
              :default-checked-keys="checkIds"
              accordion></el-tree>
          </div>
        </idss-widget>
      </el-col>
      <el-col :span="20">
        <idss-widget :footer-style="{padding: '10px'}">
          <template slot="title-left">
            <span>策略配置管理</span>
            <el-button
              type="danger"
              plain
              class="idss-margin--l-m"
              size="mini"
              :disabled="multipleSelection.length <= 0"
              @click="delBatchConfirm">
              <idss-icon-svg name="delete"></idss-icon-svg>
              <span>删除</span>
            </el-button>
          </template>
          <template slot="title-right">
            <el-button size="mini" @click="addDict">
              <idss-icon-svg name="add"></idss-icon-svg>
              <span>新建</span>
            </el-button>
          </template>
          <el-table
            :data="dictTable.data"
            v-loading="loading['query-page']"
            empty-text="暂无数据"
            stripe
            border
            @selection-change="handleSelectionChange"
            @cell-click="dictDataClick"
            style="width: 100%">
            <template slot="empty">
              <idss-no-data></idss-no-data>
            </template>
            <el-table-column type="selection" width="40" align="center"></el-table-column>
            <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
            <el-table-column
              show-overflow-tooltip
              min-width="105"
              align="center"
              prop="name"
              label="规则名称"></el-table-column>
            <el-table-column align="center" show-overflow-tooltip prop="riskType" label="所属分类"></el-table-column>
            <el-table-column show-overflow-tooltip align="center" label="创建时间">
              <template slot-scope="scope">{{formatDate(scope.row.createTime)}}</template>
            </el-table-column>
            <el-table-column align="center" prop="type" label="规则类型">
              <template slot-scope="scope">
                <span>{{scope.row.type === '1' ? '实时策略' : '离线策略'}}</span>
              </template>
            </el-table-column>
            <el-table-column min-width="110" prop="status" align="center" label="开关">
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.status"
                  active-text="开"
                  inactive-text="关"
                  @change="swichChange(scope.row)"></el-switch>
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="180">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" plain micro @click="dictLook(scope.row)">查看</el-button>
                <el-button size="mini" type="primary" plain micro @click="dictCopy(scope.row)">复制</el-button>
                <el-button size="mini" type="primary" plain micro @click="dictEdit(scope.row)">编辑</el-button>
              </template>
            </el-table-column>
          </el-table>
          <template slot="footer">
            <idss-pagination
              :tableData="dictTable"
              @size-change="dictTableChange"
              @page-change="dictTableChange"></idss-pagination>
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
      <span>确认批量删除 {{ delBatchNameList }} 吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="delBatch" :loading="delBatchBtnLoading">确认</el-button>
        <el-button size="small" @click="delBatchDialogVisible = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { formatDate } from 'fusion-utils'
import globalMixins from '@/mixins/globalMixins.js'
import service from './manage-service.js'
export default {
  name: 'manage-strategy-manage',
  mixins: [globalMixins, service],
  data () {
    return {
      serachDataParm: {
        name: '',
        riskType: ''
      },
      checkIds: [0],
      dictTable: {
        total: 0,
        pageNum: 1,
        pageSize: 20,
        data: []
      },
      delDialogVisible: false,          // 删除弹出框弹出框显示状态
      delBatchBtnLoading: false,        // 批量删除弹出框确定按钮的loding
      delBatchDialogVisible: false,     // 批量删除弹出框显示状态
      multipleSelection: [],
      sceneTree: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  methods: {
    formatDate (timestamp) {
      if (timestamp === null || timestamp === undefined || timestamp === '') {
        return ''
      } else {
        return formatDate.call(new Date(+timestamp), 'yyyy-MM-dd hh:mm:ss')
      }
    },
    // 按分类查询
    handleNodeClick (data, a, v) {
      let check = this.$refs.searchTree.getCheckedKeys()
      this.serachDataParm.riskType = check.filter(item => item).join(',')
      this.list('submit')
    },
    searchTable () {
      this.serachDataParm.riskType = ''
      this.checkIds = [0]
      this.list('submit')
      this.querySceneTree()
    },
    dictTableChange (params) {
      this.tableChange(params, this.dictTable, this.getDictTable)
    },
    list (type = 'init') {
      this.tableChange({ type: type }, this.dictTable, this.getDictTable)
    },
    addDict () {
      this.$router.replaceTagPush({
        name: 'manage-strategy-manage-config-add',
        params: { groupId: '2' }
      }, this.$route)
    },
    dictEdit (row) {
      this.$router.replaceTagPush({
        name: 'manage-strategy-manage-config-edit',
        params: { groupId: '2', id: row.id }
      }, this.$route)
    },
    dictLook (row) {
      this.$router.replaceTagPush({
        name: 'manage-strategy-manage-config-look',
        params: { groupId: '2', id: row.id }
      }, this.$route)
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
      this.delDict()
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
    },
    dictCopy (row) {
      this.$prompt('复制关联策略', '提示', {
        customClass: 'bl-copy-prompt',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue: row.name + '(副本)'
      }).then(({ value }) => {
        this.copyDict(row, value)
      }).catch(() => {
        // this.showMessage('已取消', 'info')
      })
    },
    dictDataClick (row, column, cell, event) {
      if (column.label === '基线名称') {
        console.log(row)
      }
    },
    init () {
      this.querySceneTree()
      this.list('refresh')
    }
  },
  computed: {
    // 批量删除的连续名字
    delBatchNameList () {
      return this.multipleSelection.map(v => v.name).join(',')
    }
  },
  created () {
    this.r = this.$route.query._r
    let { name, eventIds } = this.$route.query
    this.serachDataParm.name = name || ''
    if (eventIds) {
      this.checkIds = JSON.parse(eventIds)
      this.serachDataParm.riskType = JSON.parse(eventIds).join(',')
    }
    this.querySceneTree()
    this.list('init')
  }
}
</script>

<style scoped lang="postcss">
.manage-strategy-manage {
  /* 搜索框 & 搜索按钮 */
  & .filter-title{
    width:80px;
    margin:6px 0 0 16px;
    text-align:center;
    font-weight: 650;
  }
}
</style>
