<template>
  <div>
    <el-row v-if="isAdd" style="text-align:left">
      <el-button
        @click="addExtractor"
        icon="el-icon-plus"
        size="mini"
        style="margin-bottom: 20px;">新增</el-button>
      <el-button type="text" size="mini">长按提取器上下拖拽某一行，可以更改提取器提取数据的优先级</el-button>
    </el-row>
    <el-row>
      <el-table border stripe
        :row-key="(row) => row.id + timestamp"
        :data="tableData" :class="data.taskInfo.jobSerialNumber"
        v-loading="loading['query-extract-by-id']">
        <template slot="empty">
          <idss-no-data></idss-no-data>
        </template>
        <el-table-column label="编号" type="index" align="center" width="55"></el-table-column>
        <el-table-column label="提取器名称" prop="extractName" align="center">
          <template v-slot="{row}">
            <el-button @click="viewDetail(row)" type="text" size="mini" custom>{{row.extractName}}</el-button>
          </template>
        </el-table-column>
        <el-table-column label="提取器类型" prop="extractType" align="center"></el-table-column>
        <el-table-column
          label="提取器内容"
          prop="extractDataSample"
          :show-overflow-tooltip="true"
          align="center">
          <template
            slot-scope="scope">{{scope.row.extractType==='kv'?scope.row.oldContent:scope.row.extractDataSample}}</template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button @click="editExtractor(scope.row, true)" type="text" size="small">详情</el-button>
            <el-button @click="editExtractor(scope.row)" type="text" size="small">编辑</el-button>
            <el-button @click="deleteExtractor(scope)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
  </div>
</template>
<script>
import globalMixins from '@/mixins/globalMixins.js'
import Sortable from 'sortablejs'
const BASE_URL = '/api/setting/etl/job'
const API = {
  // 查询提取器列表
  QUERY_EXTRACTOR (jobSerialNumber) {
    return {
      url: BASE_URL + '/ui/get-extractId?jobSerialNumber=' + jobSerialNumber,
      method: 'get',
      tag: 'query-extract-by-id'
    }
  },
  // 删除提取器
  DELETE_EXTRACTOR (id) {
    return {
      url: BASE_URL + '/ui/' + id + '/delete',
      method: 'delete',
      tag: ''
    }
  },
  // 更新采集器顺序
  UPDATE_EXTRACTOR: {
    url: BASE_URL + '/ui/update-extract-order-num',
    method: 'post',
    tag: 'query-extract-by-id'
  }
}

export default {
  name: 'extractor-config',
  mixins: [globalMixins],
  props: {
    // 数据：部门信息、任务信息
    data: {
      type: Object,
      default () {
        return {
          deptInfo: {},
          taskInfo: {}
        }
      }
    }
  },
  data () {
    return {
      isAdd: false,  // FIXME: 什么状态下可以新增提取器
      tableData: [],
      // 时间戳：用于控制 table row-key 的变化
      timestamp: Date.now()
    }
  },
  methods: {
    /**
     * 获取提取器列表
     */
    async getExtractor () {
      let { taskInfo: { jobSerialNumber } } = this.data
      let result = await this.$request({
        ...API.QUERY_EXTRACTOR(jobSerialNumber)
      })
      if (Array.isArray(result) && result.length) {
        this.tableData = result.slice(0)
        this.getextractCost()
      }

      // 是否显示新增按钮
      let haveSplitChar = result.find(item => item['extractType'] === 'splitChar')
      this.isAdd = !haveSplitChar
    },
    /**
     * 拖拽改变提取器提取顺序
     */
    rowDropList () {
      const tbody = document.querySelector(`.${this.data.taskInfo.jobSerialNumber}` + ' .el-table__body-wrapper table tbody')
      Sortable.create(tbody, {
        onEnd: (event) => {
          // 此时的tableData并没有发生变化
          let idlist = this.tableData.map(item => item.id)
          let { oldIndex, newIndex } = event
          let currentId = idlist.splice(oldIndex, 1)[0]
          idlist.splice(newIndex, 0, currentId)
          this.updateExtractList(idlist)
        }
      })
    },
    // 更新采集器顺序
    updateExtractList (ids) {
      this.$request({
        ...API.UPDATE_EXTRACTOR,
        data: {
          data: ids
        }
      }).then((content) => {
        // 用于强制更新 table 的 dom
        this.timestamp = Date.now()
        this.getExtractor()
      }, (error) => {
        error.message && this.showMessage(error.message, 'error')
      })
    },
    getextractCost () {
      this.$request({
        method: 'get',
        url: '/api/setting/etl/job/ui/get-extractId/cost?jobSerialNumber=' + this.data.taskInfo.jobSerialNumber
      }).then((content) => {
        content.message && this.showMessage(content.message, 'warning')
      })
    },
    /**
     * 新增提取器
     */
    addExtractor () {
      let { taskInfo: { jobSerialNumber } } = this.data
      this.$router.push({
        name: 'manage-data-allpicker',
        query: {
          id: jobSerialNumber
          // FIXME: 提取器类型
          // type: this.currentIn_type
        }
      })
    },

    /**
     * 查看提取器详情
     */
    viewDetail (row) {
      let { taskInfo: { jobSerialNumber, jobStatus } } = this.data
      this.$router.push({
        name: 'manage-data-extractor-setting',
        query: {
          id: jobSerialNumber,
          currtJobStatus: jobStatus,
          curId: row.id
        }
      })
    },

    /**
     * 编辑提取器
     * @params {Object} row 当前行信息
     */
    editExtractor (row, isDisabled) {
      this.$router.push({
        name: 'manage-data-allpicker',
        query: {
          isDisabled,
          taskid: row.jobSerialNumber,
          pickernum: row.id
        }
      })
    },

    /**
     * 删除提取器
     * @params {Object} scope {row, $index}
     */
    deleteExtractor (scope) {
      let { row, $index } = scope
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await this.$request({
          ...API.DELETE_EXTRACTOR(row.id),
          data: {}
        })
        this.$message({
          type: 'success',
          message: '删除成功'
        })
        // 删除表格数据
        this.tableData.splice($index, 1)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  },
  mounted () {
    this.getExtractor()
    this.rowDropList()
  }
}
</script>
<style>
</style>
