<template>
  <div class="idss-manage-report">
    <el-row>
      <!-- 报表类型 -->
      <el-col :span="5">
        <idss-widget v-loading="loading['reportlist']" padding="10px">
          <idss-widget-tool slot="tool" padding="10px" type="plain" right>
            <template slot="right">
              <button @click="dialogAddReport = true" class="idss-button-text">
                <idss-icon-svg name="circle-add-outline"></idss-icon-svg>
                <span>新增任务组</span>
              </button>
            </template>
          </idss-widget-tool>
          <div class="idss-report--tree">
            <el-tree
              class="idss-txt--left"
              ref="reportTree"
              node-key="key"
              accordion
              :data="reportList"
              :props="defaultProps"
              :expand-on-click-node="false">
              <!-- 自定义树节点 -->
              <span
                slot-scope="{ node, data }"
                :class="[node.level === 1 ? 'parent': 'children']"
                class="idss-report--treeList">
                <span class="txt-wrap" @click="() => getCurrentReport(data, node)">{{ data.name }}</span>
                <!-- 父节点按钮组 -->
                <span v-if="node.level === 1" class="button-wrap">
                  <button class="idss-button-icon" title="新增任务" @click="() => addReportTask(data)">
                    <idss-icon-svg name="plus"></idss-icon-svg>
                  </button>
                  <button class="idss-button-icon" title="删除任务组" @click="() => deleteReport(data)">
                    <idss-icon-svg name="delete"></idss-icon-svg>
                  </button>
                </span>
                <!-- 子节点按钮组 -->
                <span v-else class="button-wrap">
                  <button
                    class="idss-button-icon"
                    title="编辑任务"
                    @click="() => editReportTask(node, data)">
                    <idss-icon-svg name="edit-outline"></idss-icon-svg>
                  </button>
                  <button
                    class="idss-button-icon"
                    title="删除任务"
                    @click="() => removeReportTask(data)">
                    <idss-icon-svg name="delete"></idss-icon-svg>
                  </button>
                </span>
              </span>
            </el-tree>
          </div>
        </idss-widget>
      </el-col>
      <!-- 表格 -->
      <el-col :span="19">
        <idss-widget>
          <!-- 过滤条件 start -->
          <el-row type="flex" class="idss-margin--t-m">
            <el-col :span="12" align="left">
              <el-form :inline="true" size="small" plain @submit.native.prevent>
                <el-form-item label="文件名称：" label-width="100px">
                  <el-input v-model="fileName" placeholder="请输入内容" size="small"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button size="medium" @click="submit" type="primary">提交</el-button>
                </el-form-item>
              </el-form>
            </el-col>
            <el-col :span="12" align="right" style="margin-right: 20px;">
              <button @click="tableTaskDelete" class="idss-button-text">
                <idss-icon-svg name="delete"></idss-icon-svg>
                <span>批量删除</span>
              </button>
              <button @click="fileDownload" class="idss-button-text">
                <idss-icon-svg name="download"></idss-icon-svg>
                <span>下载</span>
              </button>
            </el-col>
          </el-row>
          <!-- 过滤条件 end -->
          <!-- 列表 table start -->
          <div v-loading="loading['table']">
            <el-table
              border
              :data="tableData.data"
              empty-text="暂无数据"
              @selection-change="handleSelectionChange"
              :max-height="TABLE_HEIGHT.HIGH"
              stripe>
              <el-table-column type="selection" width="50" align="center"></el-table-column>
              <el-table-column width="60" type="index" align="center" label="序号"></el-table-column>
              <el-table-column prop="fileName" label="文件名" align="center">
                <template slot-scope="scope">
                  <el-button
                    @click="fileDownload({id:scope.row.id})"
                    title="文件下载"
                    type="text"
                    size="small"
                    custom>{{scope.row.fileName}}</el-button>
                </template>
              </el-table-column>
              <el-table-column prop="type" label="所属任务组" align="center"></el-table-column>
              <el-table-column prop="time" label="执行时间" align="center"></el-table-column>
              <el-table-column prop="frequency" label="执行频率" align="center"></el-table-column>
              <el-table-column label="操作" width="70" align="center">
                <template slot-scope="scope">
                  <idss-icon-svg name="delete" @click="tableTaskDelete(scope.row.id)"></idss-icon-svg>
                </template>
              </el-table-column>
            </el-table>
            <idss-pagination
              :tableData="tableData"
              @size-change="tableDataChange"
              @page-change="tableDataChange"
              :style="{padding: '10px'}"></idss-pagination>
          </div>
          <!-- 列表 table end -->
        </idss-widget>
      </el-col>
    </el-row>

    <!-- 新增任务组 dialog start -->
    <add-report :visible.sync="dialogAddReport" @addSuccess="addReportSuccess"></add-report>
    <!-- 新增任务组 dialog end-->
  </div>
</template>

<script>
import globalMixins from '@/mixins/globalMixins'
import service from '@/views/manage/report/template-service.js'
import AddReport from './components/add-report'
import { download } from '@/custom/utils/upload-download.js'

export default {
  name: 'manage-report-template',
  mixins: [globalMixins, service],
  components: { AddReport },
  data () {
    return {
      reportList: [],  // 任务组列表 - tree
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      currentReport: {},  // 当前选择报表
      fileName: '',      // 文件名称
      tableData: {       // 任务表格
        data: []
      },
      checkSelection: [],     // 表格选中项
      dialogAddReport: false  // 是否显示添加报表弹窗
    }
  },
  methods: {
    /* ====================== 报表分类 - 相关 ====================== */
    /**
       *【新增任务组】新增成功
       */
    addReportSuccess () {
      this.showMessage('添加成功')
      // 重新获取任务树
      this.getReportList()
    },

    /**
       *【表格联动】点击当前节点名称时触发
       * data: 当前节点数据
       * node：当前节点 node 对象
       */
    getCurrentReport (data, node) {
      this.currentReport = data
      this.currentReport.level = node.level
      this.$refs['reportTree'].setCurrentKey(data.key)

      if (node.level === 2) {
        // 子节点
        this.currentReport.reportId = node.parent.data.key
        this.currentReport.taskId = data.key
      } else {
        // 父节点
        this.currentReport.reportId = data.key
        this.currentReport.taskId = ''
      }

      this.getTableData()   // 获取表格数据
    },

    /**
       *【父节点】 新增报表任务
       * data: 当前节点数据
       */
    addReportTask (data) {
      this.$router.push({
        name: 'manage-report-task',
        query: {
          reportType: data.name
        }
      })
    },

    /**
       *【父节点】删除某一个报表类别，如果此报表下有报表任务，则不允许删除
       * data: 当前节点数据
       * store: 任务树
       */
    deleteReport (data, store) {
      // 是否存在报表任务
      if (data.children && data.children.length) {
        this.showMessage('此报表下有报表任务在执行，不能删除', 'warning')
      } else {
        this.confirmBox({
          message: '此操作将永久删除该报表, 是否继续?'
        }).then(() => {
          // 发送删除请求
          let params = { type: 'report', reportId: data.key }
          this.deleteTaskRequest(params)
        })
      }
    },

    /**
       *【子节点】报表任务 - 编辑
       */
    editReportTask (node, data) {
      let parent
      let { key } = data
      if (node.level !== 1) { // 将其父节点的 key 传过去
        parent = node.parent.data.name
      }
      this.$router.push({
        name: 'manage-report-task',
        query: {
          taskId: key,
          reportType: parent
        }
      })
    },

    /**
       *【子节点】删除报表任务
       */
    removeReportTask (data, store) {
      this.confirmBox({
        message: '此操作将永久删除该报表任务, 是否继续?'
      }).then(() => {
        // 发送删除请求
        let params = { type: 'task', taskId: data.key }
        this.deleteTaskRequest(params)
      })
    },

    /* ====================== table 相关 ======================  */
    /**
       * 表格分页
       */
    tableDataChange (params) {
      this.tableChange(params, this.tableData, this.getTableData)
    },

    /**
       * 表格复选框
       */
    handleSelectionChange (selection) {
      this.checkSelection = selection
    },

    /**
       * 删除 - 批量、单个删除
       * id: 任务列表id，在单个删除时使用
       */
    tableTaskDelete (id) {
      let params = []
      if (id && typeof (id) !== 'object') { // 单个删除
        params.push({ id: id })
        this.deleteConfirm(params)
      } else {
        // 未选中任何一条记录
        if (this.checkSelection.length === 0) {
          this.showMessage('没有选择删除数据', 'warning')
        } else {
          this.checkSelection.map(obj => {
            params.push({
              id: obj.id
            })
          })
          this.deleteConfirm(params)
        }
      }
    },

    /**
       * 确认删除
       */
    deleteConfirm (params) {
      this.confirmBox({
        message: '此操作将永久删除已选项, 是否继续?'
      }).then(() => {
        this.deleteRequest(params)
      })
    },

    /**
       * 文件下载操作
       * data: 删除文件数据，点击任务名称下载时使用
       */
    fileDownload (data) {
      let params = []
      if (data.id) {
        params.push({ id: data.id })
      } else {
        if (this.checkSelection.length === 0) {
          this.showMessage('请选择一条或多条数据', 'warning')
          return
        } else {
          this.checkSelection.map(obj => {
            params.push({
              id: obj.id
            })
          })
        }
      }
      // 下载请求
      this.downloadRequest(params).then((data) => {
        let { fileName } = data
        fileName && download(fileName)
      })
    },

    /* ====================== 其他操作 ======================  */
    /**
       * 提交
       */
    submit () {
      this.getTableData()
    },

    /**
       * 初始化数据
       */
    init () {
      this.currentReport = {
        reportId: undefined,
        taskId: undefined
      }
      this.getReportList()
      this.getTableData()
    }
  },
  created () {
    this.init()
  }
}
</script>

<style scoped lang="postcss">
.idss-manage-report >>> .idss-report--treeList {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 4px 0;
  padding: 0 10px 0 28px;
  width: 100%;

  &.parent {
    background-color: #f3f7f9;
    .idss-svg-icon {
      width: 1.2em;
      height: 1.2em;
    }
  }

  &.children {
    position: relative;
    margin: 0;
    padding: 1px 10px 0 22px;
    font-size: 1.2rem;
    &:before {
      content: "";
      position: absolute;
      top: 18px;
      left: 10px;
      width: 10px;
      height: 1px;
      background-color: #444;
    }
    &:after {
      content: "";
      position: absolute;
      top: 6px;
      left: 10px;
      width: 1px;
      height: 12px;
      background-color: #444;
    }
  }
  /* 按钮组 */
  .button-wrap {
    visibility: hidden;
    opacity: 0;
  }
  /* 文本 */
  & .txt-wrap {
    flex-grow: 1;
    padding: 6px 0;
    max-width: 80%;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    cursor: pointer;
  }
  /* hover 状态 */
  &:hover {
    &.children {
      &:after {
        background-color: var(--color-font-default);
      }
      &:before {
        background-color: var(--color-font-default);
      }
    }
    & .button-wrap {
      visibility: visible;
      opacity: 1;
    }
  }
}
/* 展开的小三角 */
.idss-manage-report >>> .el-tree-node__expand-icon {
  position: absolute;
  left: 0;
  font-size: 16px;
}
.idss-manage-report >>> .el-tree-node:focus > .el-tree-node__content {
  background-color: transparent;
}
/*  */
.idss-manage-report >>> .el-tree-node__content {
  position: relative;
  height: auto;
  cursor: default;
}
.idss-manage-report >>> .el-tree-node__content:hover {
  background: transparent;
  color: var(--color-font-default);
}
.idss-manage-report
  >>> .el-tree-node.is-current
  > .el-tree-node__content
  .parent,
.idss-manage-report
  >>> .el-tree-node.is-current
  > .el-tree-node__content
  .children {
  color: var(--color-font-default);
}
.idss-manage-report
  >>> .el-tree-node.is-current
  > .el-tree-node__content
  .children:before,
.idss-manage-report
  >>> .el-tree-node.is-current
  > .el-tree-node__content
  .children:after {
  background-color: var(--color-font-default);
}
</style>
