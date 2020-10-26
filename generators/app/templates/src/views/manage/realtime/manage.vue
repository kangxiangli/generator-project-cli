<template>
  <div class="manage-realtime-manage">
    <el-row type="flex">
      <el-col :span="4">
        <idss-widget v-loading="loading['query-scene-tree']">
          <template slot="title-left">分类</template>
          <div style="height:763px" v-iscroll>
            <el-tree
              v-if="sceneTree && sceneTree.length"
              empty-text
              class="custom-tree"
              ref="searchTree"
              check-on-click-node
              show-checkbox
              :default-expanded-keys="[0]"
              accordion
              :data="sceneTree"
              :props="sceneTreeProps"
              node-key="id"
              :default-checked-keys="sceneTreeIds"
              @check="handleNodeClick"></el-tree>
            <idss-no-data v-else></idss-no-data>
          </div>
        </idss-widget>
      </el-col>
      <el-col :span="20">
        <idss-widget
          :main-style="{padding: '5px 15px 10px'}"
          :global-style="{'margin-bottom': '0'}"
          @keyup.enter.native="search">
          <template slot="title-left">筛选条件</template>
          <!-- 搜索 -->
          <el-form size="small" plain @submit.native.prevent>
            <el-row :gutter="10">
              <el-col :span="20">
                <el-form-item>
                  <el-input
                    @keyup.enter.native="searchTable"
                    v-model="serachParm.nameLike"
                    placeholder="搜索条件&搜索内容...">
                    <i slot="prefix" class="el-input__icon el-icon-search"></i>
                    <el-button
                      slot="append"
                      type="primary"
                      size="medium"
                      custom
                      @click="searchTable">搜索</el-button>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </idss-widget>
        <idss-widget :header-style="{padding: '10px'}" :footer-style="{padding: '6px 0'}">
          <template slot="title-left">
            <!-- 删除 -->
            <span>实时策略列表</span>
            <el-button
              style="marginLeft:10px"
              :disabled="!multipleSelection.length"
              type="danger"
              size="mini"
              plain
              @click="delDlgConfirm">
              <idss-icon-svg name="delete"></idss-icon-svg>
              <span class="marginLeft5">删除</span>
            </el-button>
          </template>
          <template slot="title-right">
            <!-- 新建 -->
            <el-button size="mini" @click="addPage">
              <idss-icon-svg name="add"></idss-icon-svg>
              <span>新建</span>
            </el-button>
            <!-- 导入配置策略 -->
            <el-upload
              :show-file-list="false"
              class="idss-import-div"
              accept="text/plain"
              ref="formUpload"
              :headers="uploadHeaders"
              action="/api/ueba/system/policy/realtime/import"
              name="fileName"
              :auto-upload="false"
              :on-success="cangoIsRight"
              :on-progress="uploadpro"
              :on-change="importStrategy"
              :before-upload="beforeImport">
              <el-button size="mini" slot="trigger" @click="importStrategy">
                <idss-icon-svg name="import"></idss-icon-svg>
                <span>导入策略配置</span>
              </el-button>
            </el-upload>
            <!-- 导出配置策略 -->
            <el-button size="mini" @click="exportStrategy">
              <idss-icon-svg name="export"></idss-icon-svg>
              <span>导出策略配置</span>
            </el-button>
          </template>
          <el-table
            stripe
            border
            :data="dictTable.data"
            v-loading="loading['query-page'] || loading['query-scene-tree']"
            @selection-change="handleSelectionChange"
            height="605"
            max-height="605"
            style="width: 100%;">
            <template slot="empty">
              <idss-no-data></idss-no-data>‌
            </template>‌
            <el-table-column type="selection" width="50" align="center"></el-table-column>
            <el-table-column
              align="center"
              show-overflow-tooltip
              min-width="105"
              prop="name"
              label="规则名称"></el-table-column>
            <el-table-column
              align="center"
              width="150"
              show-overflow-tooltip
              prop="riskTypeName"
              label="所属分类"></el-table-column>
            <el-table-column show-overflow-tooltip prop="eventName" label="事件名称"></el-table-column>
            <el-table-column show-overflow-tooltip prop="window" label="时间窗口"></el-table-column>
            <el-table-column align="center" show-overflow-tooltip prop="relatedEvents" label="相关数据"></el-table-column>
            <el-table-column show-overflow-tooltip prop="innerEvent" label="内部事件"></el-table-column>
            <el-table-column align="center" width="110" prop="status" label="告警">
              <template slot-scope="scope">
                <template v-if="scope.row.alarm">
                  <span>告警配置</span>
                  <el-popover
                    stretch
                    popper-class="popper-box-card-panel"
                    placement="right"
                    trigger="hover">
                    <el-card class="box-card" shadow="hover">
                      <div slot="header" class="clearfix">
                        <span>告警配置</span>
                      </div>
                      <div class="item">
                        <label>风险类型</label>
                        <span>{{scope.row.alarmInfo.riskType}}</span>
                      </div>
                      <div class="item">
                        <label>风险级别</label>
                        <span>{{scope.row.alarmInfo.severity}}</span>
                      </div>
                      <div class="item">
                        <label>事件设备分类</label>
                        <span>{{scope.row.alarmInfo.eventDeviceType}}</span>
                      </div>
                    </el-card>
                    <idss-icon-svg slot="reference" class="icon-help" name="help"></idss-icon-svg>
                  </el-popover>
                </template>
                <span v-else>-</span>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="updateTime" label="更新时间" width="160">
              <template slot-scope="scope">{{scope.row.updateTime | formatDate}}</template>
            </el-table-column>
            <el-table-column width="100" align="center" prop="statusComment" label="状态">
              <template slot-scope="scope">
                <span
                  class="s-status"
                  :class="scope.row.statusComment === '开启'? 's-start':''"
                  v-if="scope.row.statusComment === '开启'">
                  <i></i>开启
                </span>
                <span
                  class="s-status"
                  :class="scope.row.statusComment === '开启中'? 's-starting':''"
                  v-if="scope.row.statusComment === '开启中'">
                  <idss-icon-svg name="circle-refresh-outline"></idss-icon-svg>开启中...
                </span>
                <span
                  class="s-status"
                  :class="scope.row.statusComment === '开启失败'? 's-fail':''"
                  v-if="scope.row.statusComment === '开启失败'">开启失败</span>
                <span
                  class="s-status"
                  :class="scope.row.statusComment === '停用'? 's-top':''"
                  v-if="scope.row.statusComment === '停用'">
                  <i></i>停用
                </span>
                <span
                  class="s-status"
                  :class="scope.row.statusComment === '停用中'? 's-toping':''"
                  v-if="scope.row.statusComment === '停用中'">
                  <idss-icon-svg name="circle-refresh-outline"></idss-icon-svg>停用中...
                </span>
                <span
                  class="s-status"
                  :class="scope.row.statusComment === '停用失败'? 's-fail':''"
                  v-if="scope.row.statusComment === '停用失败'">停用失败</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="200">
              <template slot-scope="scope">
                <span
                  class="idss-button-text"
                  :disabled="scope.row.enableStatus === '2' || scope.row.enableStatus === '3'"
                  @click="statusClick(scope.row)"
                  v-idss-tooltip="{
                    placement: 'top',
                    content: scope.row.status ? '关闭' : '启用'
                  }">
                  <idss-icon-svg :name="scope.row.status?'stop':'start'"></idss-icon-svg>
                </span>
                <span
                  class="idss-button-text"
                  @click="lookPage(scope.row)"
                  v-idss-tooltip="{
                    placement: 'top',
                    content: '查看'
                  }">
                  <idss-icon-svg name="detail"></idss-icon-svg>
                </span>
                <span
                  class="idss-button-text"
                  :disabled="scope.row.enableStatus === '2' || scope.row.enableStatus === '3'"
                  @click="editPage(scope.row)"
                  v-idss-tooltip="{
                    placement: 'top',
                    content: '编辑'
                  }">
                  <idss-icon-svg name="edit"></idss-icon-svg>
                </span>
                <span
                  class="idss-button-text"
                  @click="copyConfirm(scope.row)"
                  v-idss-tooltip="{
                    placement: 'top',
                    content: '复制'
                  }">
                  <idss-icon-svg name="batch-file"></idss-icon-svg>
                </span>
              </template>
            </el-table-column>
          </el-table>
          <template slot="footer">
            <idss-pagination
              :style="{padding: '10px'}"
              :tableData="dictTable"
              @size-change="dictTableChange"
              @page-change="dictTableChange"></idss-pagination>
          </template>
        </idss-widget>
      </el-col>
    </el-row>

    <!-- 批量删除 dialog -->
    <el-dialog
      v-loading="loading['delete']"
      custom
      class="del-batch-dialog"
      append-to-body
      title="提示"
      :visible.sync="delDlgVisible"
      width="40%">
      <span
        v-if="multipleSelection.length > 1"
        style="display: -webkit-box;-webkit-box-orient: vertical;-webkit-line-clamp: 4;overflow: hidden;">确认批量删除 {{ delTableNames }} 吗？</span>
      <span v-else>确认删除 {{ delTableNames }} 吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" custom @click="delDlgVisible = false">取消</el-button>
        <el-button size="small" custom type="primary" @click="delTableIds">确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import service from './manage-service'
import globalMixins from '@/mixins/globalMixins.js'
import { formatDate } from 'fusion-utils'
import { download } from '@/custom/utils/upload-download.js'
export default {
  name: 'manage-realtime-manage',
  mixins: [globalMixins, service],
  data () {
    return {
      sceneTreeArry: [],
      data: [],
      serachParm: {
        nameLike: '',
        riskType: ''
      },
      sceneTreeProps: {
        children: 'children',
        label: 'label'
      },
      sceneTreeIds: [0],
      sceneTree: [],
      upLoading: false,               // 上传的loading标记
      uploadHeaders: {                // 上传的header 参数
        authToken: window.localStorage.getItem(`base/token$$`)
      },
      delDlgVisible: false,           // 批量删除弹出框显示状态
      multipleSelection: [],          // 选中的table
      dictTable: {
        data: []
      }
    }
  },
  methods: {
    // 时间格式化
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
      this.serachParm.riskType = check.filter(item => item).join(',')
      this.list('submit')
    },
    // 新增
    addPage () {
      this.$router.replaceTagPush({
        name: 'manage-realtime-manage-config-add'
      }, this.$route)
    },
    // 查看
    lookPage (row) {
      this.$router.replaceTagPush({
        name: 'manage-realtime-manage-config-look',
        params: { id: row.id }
      }, this.$route)
    },
    // 编辑
    editPage (row) {
      this.$router.replaceTagPush({
        name: 'manage-realtime-manage-config-edit',
        params: { id: row.id }
      }, this.$route)
    },
    // 外部文件导入
    cangoIsRight (response, file, fileList) {
      if (file.status === 'success') {
        if (file.response.status === 'error') {
          this.showMessage(file.response.message, 'error')
        } else if (file.response.status === 'success') {
          this.showMessage(file.response.message, 'success')
        }
      }
      this.upLoading = false
      this.list('submit')
    },
    // 在上传中的验证
    uploadpro (event, file, fileList) {
      if (this.upLoading) {
        this.showMessage('数据导入中', 'warn')
      }
      this.upLoading = true
    },
    // 上传按钮触发事件
    importStrategy () {
      this.$refs.formUpload.submit()
    },
    // 上传前的格式验证
    beforeImport (file) {
      if (file.name.endsWith('.txt')) {
        return true
      }
      this.showMessage('导入文件格式错误，只支持txt格式', 'error')
      return false
    },
    // 导出按钮事件
    exportStrategy () {
      this.open().then((data) => {
        this.upLoading = false
        let { fileName } = data
        fileName && download(fileName)
      })
    },
    // 批量删除确认框
    delDlgConfirm (opt) {
      if (!this.multipleSelection.length) {
        return this.showMessage('请选择数据操作项', 'warning')
      }
      this.delDlgVisible = true
    },
    // 查询
    searchTable () {
      this.list('submit')
    },
    // table 分页事件
    dictTableChange (params) {
      this.tableChange(params, this.dictTable, this.getDictTable)
    },
    // 勾选选中项, 并批量删除按钮状态
    handleSelectionChange (arr) {
      this.multipleSelection = arr
    },
    // 启用状态修改
    statusClick (row) {
      this.setEnable(row)
    },
    // 复制策略
    copyConfirm (row) {
      this.$prompt('复制关联策略', '提示', {
        customClass: 'bl-copy-prompt',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue: row.name + '(副本)'
      }).then(({ value }) => {
        this.copyDict(row, value)
      }).catch(() => {
      })
    },
    // table 事件
    list (type = 'init') {
      this.tableChange({ type: type }, this.dictTable, this.getDictTable)
    },
    init () {
      this.querySceneTree()
    }
  },
  computed: {
    // 批量删除的连续名字
    delTableNames () {
      return this.multipleSelection.map(v => v.name).join(',')
    }
  },
  created () {
    this.r = this.$route.query._r
    let { name } = this.$route.query
    this.serachParm.nameLike = name || ''
    this.init()
  }
}
</script>
<style scoped lang="postcss">
.manage-realtime-manage {
  .idss-import-div {
    margin: 0 14px;
    display: inline-block;
  }
  .custom-tree {
    width: max-content;
  }
  .s-status {
    & > i {
      width: 6px;
      height: 6px;
      border-radius: 2px;
      display: inline-block;
      vertical-align: 2px;
      margin-right: 5px;
    }
    & > .idss-svg-icon {
      margin-right: 5px;
      width: 1.4rem;
      height: 1.4rem;
      animation: gyrate 1s linear infinite;
      fill: var(--color-primary);
    }
    &.s-start {
      color: var(--table-header-font-color);
      & > i {
        background: var(--color-low);
      }
    }
    &.s-fail {
      color: var(--color-high);
    }
    &.s-top {
      color: #7b8ca1;
      & > i {
        background: #7b8ca1;
      }
    }
  }
}
@keyframes gyrate {
  50% {
    transform: rotate(180deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
<style lang="postcss">
.popper-box-card-panel {
  padding: 0;
  border: 0;
  .el-card__header {
    padding: 10px 15px;
    background: #ebeef5;
  }
  .el-card__body {
    padding: 10px 15px;
    .item > label {
      font-weight: bold;
      width: 90px;
      display: inline-block;
      text-align: right;
      margin-right: 10px;
    }
  }
}
</style>
