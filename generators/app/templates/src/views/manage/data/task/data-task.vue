<template>
  <div class="dataTask">
    <!-- 采集列表 -->
    <idss-widget :main-style="{'padding': '16px 16px 8px'}"
      style="margin-bottom: 0; display: flex;">
      <template slot="title-left">
        <span>筛选条件</span>
      </template>
      <el-form :model="nodeForm" :inline="true" plain>
        <el-form-item label="IP输入">
          <el-input
            v-model="nodeForm.ip"
            @keyup.enter.native="searchNode"
            placeholder="请输入IP"
            size="small"></el-input>
        </el-form-item>
        <el-form-item label="采集器名称" label-width="80px">
          <el-input
            v-model="nodeForm.name"
            @keyup.enter.native="searchNode"
            placeholder="请输入采集器名称"
            size="small"></el-input>
        </el-form-item>
        <el-form-item style="margin-left: 4px;">
          <el-button @click="searchNode" size="small" type="primary">查询</el-button>
        </el-form-item>
      </el-form>
    </idss-widget>
    <idss-widget>
      <template slot="title-left">采集列表</template>
      <el-table
        border
        stripe
        v-loading="loading['node-search-list']"
        :data="nodeData.data">
        <template slot="empty">
          <idss-no-data></idss-no-data>
        </template>
        <el-table-column
          prop="workerIp"
          label="IP地址"
          align="center">
        </el-table-column>
        <el-table-column
          prop="nodeTagName"
          label="采集器名称"
          align="center">
        </el-table-column>
        <el-table-column
          prop="nodePhysicalAddr"
          label="采集器物理地址"
          align="center">
        </el-table-column>
        <el-table-column
          prop="nodeLogicAddr"
          label="采集器逻辑地址"
          align="center">
        </el-table-column>
        <el-table-column
          prop="taskNum"
          label="任务数量"
          align="center">
        </el-table-column>
        <el-table-column width="72px" label="操作" align="center">
          <template slot-scope="scope">
            <el-button @click="manualEditNode(scope)"
              size="mini" micro
              type="primary" plain>编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </idss-widget>

    <!-- 采集器编辑 - 弹窗 -->
    <el-dialog title="采集器编辑" :visible.sync="nodeEditDialogVisible" width="480px" custom>
      <el-form ref="nodeEditForm" :model="nodeEditForm" label-width="140px" size="small">
        <el-form-item label="采集器名称:">
          <el-input v-model="nodeEditForm.nodeTagName" placeholder="请输入采集名称"></el-input>
        </el-form-item>
        <el-form-item label="采集器物理地址:">
          <el-input v-model="nodeEditForm.nodePhysicalAddr" placeholder="请输入采集器物理地址"></el-input>
        </el-form-item>
        <el-form-item label="采集器逻辑地址:">
          <el-input v-model="nodeEditForm.nodeLogicAddr" placeholder="请输入采集器逻辑地址"></el-input>
        </el-form-item>
        <div style="text-align: center">
          <el-button @click="manualEditNodeSave" type="primary" size="small">确定</el-button>
          <el-button @click="nodeEditDialogVisible = false" size="small">取消</el-button>
        </div>
      </el-form>
    </el-dialog>

    <!-- 任务列表 -->
    <idss-widget style="margin-bottom: 0;  display: flex;"
      :main-style="{'padding': '16px 16px 8px'}">
      <template slot="title-left">筛选条件</template>
      <!-- 任务搜索条件 -->
      <el-form :model="searchForm" :inline="true" plain>
        <el-form-item label="任务ID">
          <el-input
            v-model="searchForm.jobSerialNumber"
            @keyup.enter.native="searchName"
            size="small"
            placeholder="请输入任务ID"></el-input>
        </el-form-item>
        <el-form-item label="任务描述" label-width="70px">
          <el-input
            v-model="searchForm.jobDescription"
            @keyup.enter.native="searchName"
            size="small"
            placeholder="请输入任务描述"></el-input>
        </el-form-item>
        <el-form-item label="采集IP" label-width="60px">
          <el-input
            v-model="searchForm.collectIp"
            @keyup.enter.native="searchName"
            size="small"
            placeholder="请输入采集IP"></el-input>
        </el-form-item>
        <el-form-item style="margin-left: 4px;">
          <el-button @click="searchTask" size="small" type="primary">查询</el-button>
        </el-form-item>
      </el-form>
    </idss-widget>
    <idss-widget>
      <!-- 部门分类列表 -->
      <el-tabs custom v-model="activeDeptId" @tab-click="manualTabChange">
        <el-tab-pane
          v-for="item in deptList"
          :label="item.deptName"
          :name="item.uid"
          :key="item.uid">
          <!-- 主部门加星标识 -->
          <span v-if="item.level==='master'" slot="label">
            <i class="el-icon-star-on" style="margin-right: 5px"></i>
            {{item.deptName}}
          </span>
          <!-- 列表内容 -->
          <dataTaskTemplate
            :ref="item.uid"
            v-if="activeDeptId === item.uid"
            :request-params="searchForm"
            :dept-info="item"></dataTaskTemplate>
        </el-tab-pane>
      </el-tabs>
      <div v-for="item in 3" :key="item">
        <span :ref="item"></span>
      </div>
    </idss-widget>
  </div>
</template>
<script>
/**
 * 作业管理入口
 */
import globalMixins from '@/mixins/globalMixins.js'
import { debounce } from 'fusion-utils'
import dataTaskService from './data-task-service.js'
import nodeService from './collect-service.js'
import dataTaskTemplate from '@/views/manage/data/task/data-task-template.vue'

export default {
  name: 'manage-data-job',
  mixins: [globalMixins, dataTaskService, nodeService],
  components: {
    dataTaskTemplate
  },
  data () {
    return {
      // 采集列表
      nodeForm: {
        ip: '',
        name: ''
      },
      nodeData: {},
      nodeEditDialogVisible: false,
      // 当前编辑节点 index
      $currentEditNodeIndex: 0,
      nodeEditForm: {
        id: '',
        nodeTagName: '',
        nodePhysicalAddr: '',
        nodeLogicAddr: ''
      },

      // 任务列表
      searchForm: {
        jobDescription: '',
        jobSerialNumber: '',
        collectIp: ''
      },
      deptList: [],
      activeDeptId: ''
    }
  },
  methods: {
    /**
     * 采集列表查询
     */
    searchNode: debounce(function () {
      this.getNodeData()
    }, 300, true),

    /**
     * 采集列表编辑操作
     * @params {Object} scope {row, column, $index}
     */
    manualEditNode (scope) {
      let { row, $index } = scope
      for (let item in this.nodeEditForm) {
        this.nodeEditForm[item] = row[item]
      }
      this.$currentEditNodeIndex = $index
      this.nodeEditDialogVisible = true
    },

    /**
     * 编辑面板保存
     */
    manualEditNodeSave () {
      // 判断是否有值发生变化
      let isChange = false
      for (let item in this.nodeEditForm) {
        if (this.nodeEditForm[item] !== this.nodeData.data[this.$currentEditNodeIndex][item]) {
          isChange = true
          break
        }
      }
      !isChange && this.showMessage('当前没有任何的更改。', 'warning')
      isChange && this.editNodeRequest()
    },

    /**
     * 任务列表查询
     */
    searchTask: debounce(function () {
      // 注意：与 v-for 一起使用，此时的 ref 为一个数据
      let currentDeptComponent = this.$refs[this.activeDeptId]
      let fn = currentDeptComponent && Array.isArray(currentDeptComponent) && currentDeptComponent[0].getTableData
      fn && fn()
    }, 300, true),

    /**
     * 部门任务列表切换
     * @params tab {VueComponent} tab 实例
     */
    manualTabChange (tab) {
      // console.log('manualTabChange', tab)
      // if (this.masteruId === this.editableTabsValue) {
      //   this.tabSendData = {
      //     uid: this.editableTabsValue,
      //     level: 'master'
      //   }
      // } else {
      //   this.tabSendData = {
      //     uid: this.editableTabsValue
      //   }
      // }
    },

    /**
     * 初始化
     */
    init () {
      this.getDeptList()
      this.getNodeData()
    }
  },
  mounted () {
    this.init()
  }
}
</script>
<style scoped lang="postcss">
</style>
