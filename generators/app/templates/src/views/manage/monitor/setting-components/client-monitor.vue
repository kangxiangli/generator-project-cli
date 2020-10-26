<template>
  <div class="client-monitor-container">
    <idss-widget shadow="never" :global-style="{margin: '0'}" :main-style="{padding: '0 16px'}">
      <el-form :model="formData" inline plain size="medium" label-width="70px">
        <el-form-item size="medium">
          <span class="idss-title-filtrate">筛选条件</span>
        </el-form-item>
        <el-form-item label="IP地址">
          <el-input v-model="formData.ip"></el-input>
        </el-form-item>
        <el-form-item label="主机名">
          <el-input v-model="formData.hostName"></el-input>
        </el-form-item>
        <el-form-item label="负责人">
          <el-input v-model="formData.ownerName"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submit">查询</el-button>
        </el-form-item>
      </el-form>
    </idss-widget>

    <idss-widget
      :global-style="{margin: '2px 0 0'}"
      :header-style="{padding: '10px 15px 10px'}"
      :footer-style="{padding: '10px'}">
      <template slot="title-left">
        <el-button
          size="small"
          type="danger"
          :disabled="!checkSelection.length"
          @click="deleteData"
          plain>
          <idss-icon-svg name="delete"></idss-icon-svg>删除
        </el-button>
        <el-button
          size="small"
          :disabled="!checkSelection.length"
          @click="modifyMonitorStatus({type: 'batch', monitorFlg: 1})">
          <idss-icon-svg name="monitor"></idss-icon-svg>&nbsp;开启监控
        </el-button>
        <el-button
          size="small"
          :disabled="!checkSelection.length"
          @click="modifyMonitorStatus({type: 'batch', monitorFlg: 0})">
          <idss-icon-svg name="cancel-monitor"></idss-icon-svg>&nbsp;取消监控
        </el-button>
      </template>
      <template slot="title-right">
        <el-button size="small" @click="addData">
          <idss-icon-svg name="add"></idss-icon-svg>&nbsp;新建
        </el-button>
      </template>
      <el-table
        stripe
        border
        :data="tableData.data"
        :max-height="TABLE_HEIGHT.HIGH"
        @sort-change="tableDataChange"
        @selection-change="handleSelectionChange"
        v-loading="loading['table-data']"
        style="width: 100%;">
        <template slot="empty">
          <idss-no-data></idss-no-data>
        </template>
        <el-table-column type="selection" width="40"></el-table-column>
        <el-table-column label="ID" prop="id" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="IP地址" prop="ip" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="日志类型" prop="logType" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="设备类型" prop="deviceType" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="设备物理地址" prop="macAddr" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="设备逻辑地址" prop="logicAddr" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="主机名" prop="hostName" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="负责人" prop="ownerName" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="对应采集器IP" prop="collectorIp" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="是否采集" prop="collectFlg" align="center" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.collectFlg === 1 ? '采集中' : '未采集'}}</template>
        </el-table-column>
        <el-table-column width="150" label="操作" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button size="mini" type="primary" plain @click="editData(scope.row)">编辑</el-button>
            <el-button
              size="mini"
              type="primary"
              plain
              @click="modifyMonitorStatus({type: 'single', curClient: scope.row})">{{scope.row.monitorFlg === 1 ? '取消监控' : '开启监控'}}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <template slot="footer">
        <idss-pagination
          :tableData="tableData"
          @size-change="tableDataChange"
          @page-change="tableDataChange"></idss-pagination>
      </template>
    </idss-widget>

    <!-- 弹窗 -->
    <el-dialog
      :title="dialogType === 'add' ? '新增' : '编辑'"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="720px">
      <client-monitor-dialog
        :key="dialogKey"
        :visible.sync="dialogVisible"
        :type="dialogType"
        :data="dialogData"
        @updated="init"></client-monitor-dialog>
    </el-dialog>
  </div>
</template>
<script>
import { debounce } from 'fusion-utils'
import globalMixins from '@/mixins/globalMixins.js'
import service from '@/views/manage/monitor/setting-components/client-monitor-service.js'
import clientMonitorDialog from '@/views/manage/monitor/setting-components/client-monitor-dialog.vue'
export default {
  name: 'client-monitor',
  mixins: [globalMixins, service],
  components: {
    clientMonitorDialog
  },
  data () {
    return {
      collapse: false,
      checkSelection: [],
      formData: {
        ip: '',
        hostName: '',
        ownerName: ''
      },
      tableData: {},

      dialogVisible: false,
      dialogKey: '',
      dialogType: 'add',
      dialogData: {}
    }
  },
  methods: {
    handleSelectionChange (selection) {
      this.checkSelection = selection
    },
    submit: debounce(function () {
      this.init({ type: 'submit' })
    }, 300),
    tableDataChange (params) {
      this.init(params)
    },
    addData () {
      this.dialogData = undefined
      this.dialogKey = +new Date()
      this.dialogType = 'add'
      this.dialogVisible = true
    },
    async editData (row) {
      this.dialogData = row
      this.dialogKey = +new Date()
      this.dialogType = 'edit'
      this.dialogVisible = true
    },
    deleteData () {
      if (!this.checkSelection.length) {
        return this.showMessage('请选择要删除项', 'warning')
      }
      let ids = []
      for (let { id } of this.checkSelection) {
        ids.push(id)
      }
      this.deleteClientConfigData(ids)
    },
    /**
       * 修改监控状态
       * @param params monitorFlg 1：监控|0：取消监控
       * @param params type       batch：批量| single：单独
       * @return {*}
       */
    modifyMonitorStatus (params) {
      // 单个时拥有curClient
      let { type, monitorFlg, curClient = {} } = params
      // 提交数据 [{id, monitorFlg}]
      let dataAry = []
      switch (type) {
        case 'batch':
          if (!this.checkSelection.length) {
            return this.showMessage('请选择要修改项', 'warning')
          }
          for (let { id } of this.checkSelection) {
            dataAry.push({
              id,
              monitorFlg
            })
          }
          break
        case 'single':
          dataAry.push({
            id: curClient.id,
            monitorFlg: curClient.monitorFlg === 1 ? 0 : 1
          })
          break
      }
      this.modifyClientMonitorStatus(dataAry)
    },
    init (params = { type: 'init' }) {
      this.tableChange(params, this.tableData, this.getTableData)
    }
  }
}
</script>
