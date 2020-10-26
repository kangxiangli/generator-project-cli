<template>
  <div>
    <!-- 筛选条件 -->
    <el-row>
      <idss-widget title="告警查询" padding="0 15px 15px">
        <el-row>
          <el-col :span="6">
            <el-input v-model="condition" placeholder="请输入检索条件" stretch size="small"></el-input>
          </el-col>
          <el-button type="primary" size="medium" custom @click="submit">查询</el-button>
        </el-row>
      </idss-widget>
    </el-row>

    <!-- 内容区域 -->
    <el-row>
      <idss-widget  v-loading="loading['message-list']" padding="0 0 10px" footer-padding="10px">
        <idss-widget-tool title slot="tool" border-bottom right>
          <span class="title">告警列表</span>
          <template slot="right">
            <button class="idss-button-text" @click="add">
              <idss-icon-svg name="add"></idss-icon-svg>
              新建
            </button>
            <button type="text" class="idss-button-icon idss-svg_delete-hover" @click="deleteAll">
              <idss-icon-svg name="delete-hover"></idss-icon-svg>
              删除
            </button>
          </template>
        </idss-widget-tool>
        <el-table
          border
          :data="messageTableData.data"
          @selection-change="handleSelectionChange"
          style="width: 100%">
          <el-table-column type="selection" width="55" align="center"></el-table-column>
          <el-table-column type="index" label="序号" width="70" align="center"></el-table-column>
          <el-table-column prop="name" label="配置名称" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-button type="text" size="small" custom @click="showDetail(scope.row)">{{scope.row.name}}</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="type" label="告警类型" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="title" label="消息标题" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column label="操作" align="center" min-width="120">
            <template slot-scope="scope">
              <el-button custom size="small" @click="edit(scope.row)">编辑</el-button>
              <el-button custom size="small" @click="deleteSingle(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!--分页-->
        <template slot="footer">
          <idss-pagination :tableData="messageTableData" @size-change="messageTableChange" @page-change="messageTableChange"></idss-pagination>
        </template>
      </idss-widget>
    </el-row>

    <!-- 查看详情 -->
    <el-dialog title="查看详情" :visible.sync="detailDialogVisible" :close-on-click-modal="false" custom>
      <message-detail
        :visible.sync="detailDialogVisible"
        :id="id">
      </message-detail>
    </el-dialog>

    <!-- 新增/编辑 -->
    <el-dialog :title="type === 'add' ? '新增告警' : '编辑告警'" :visible.sync="editDialogVisible" :close-on-click-modal="false" custom>
      <message-edit
        :visible.sync="editDialogVisible"
        :user-visible.sync="userDialogVisible"
        :select-user-list.sync="selectUserList"
        :type="type"
        :id="id"
        @updated="init">
      </message-edit>
    </el-dialog>
    <!-- 选择收件人 -->
    <el-dialog title="选择收件人" :visible.sync="userDialogVisible" :close-on-click-modal="false" custom>
      <select-user
        :visible.sync="userDialogVisible"
        :select-user-list.sync="selectUserList"
        :id="id">
      </select-user>
    </el-dialog>
  </div>
</template>

<script>
import globalMixins from '@/mixins/globalMixins.js'
import service from './message-service.js'
import messageDetail from './components/message-detail.vue'
import messageEdit from './components/message-edit.vue'
import selectUser from './components/message-user.vue'

export default {
  name: 'manage-message',
  mixins: [globalMixins, service],
  components: {
    messageDetail,
    messageEdit,
    selectUser
  },
  data () {
    return {
      // 检索条件
      condition: '',
      checkSelection: [],
      messageTableData: {},

      detailDialogVisible: false,
      type: 'add',    // add or edit
      editDialogVisible: false,
      userDialogVisible: false,
      selectUserList: [],
      id: ''    // 告警ID，详情、新增、编辑 使用
    }
  },
  methods: {
    submit () {
      this.init({ type: 'submit' })
    },
    // 表格复选框
    handleSelectionChange (selection) {
      this.checkSelection = selection
    },
    // 表格（分页、排序、改变页码）
    messageTableChange (params) {
      this.init(params)
    },
    init (params = { type: 'init' }) {
      this.tableChange(params, this.messageTableData, this.getTableData)
    },
    showDetail ({ id }) {
      this.id = id
      this.detailDialogVisible = true
    },
    add () {
      this.id = ''
      this.type = 'add'
      this.editDialogVisible = true
    },
    edit ({ id }) {
      this.id = id
      this.type = 'edit'
      this.editDialogVisible = true
    },
    deleteSingle ({ id }) {
      this.deleteMessage([id])
    },
    deleteAll () {
      if (!this.checkSelection.length) {
        return this.showMessage('请选择要删除项', 'info')
      }
      let ids = []
      for (let { id } of this.checkSelection) {
        ids.push(id)
      }
      this.deleteMessage(ids)
    }
  },
  created () {
    this.init()
  }
}
</script>
