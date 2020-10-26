<template>
  <div class="dataOutputConfig">
    <!-- 按钮组 -->
    <el-row style="text-align:left;margin-bottom: 20px">
      <el-button @click="addOutput" size="mini" icon="el-icon-plus" >新增</el-button>
      <el-button @click="editOutput" size="mini" icon="el-icon-edit">编辑</el-button>
      <el-button @click="deleteOutput" size="mini" icon="el-icon-delete">删除</el-button>
    </el-row>

    <!-- tabs -->
    <el-row>
      <el-tabs v-model="activeTabName" type="card">
        <el-tab-pane v-for="(value, key) in matchStrategy"
          :key="key"
          :name="key"
          :label="matchStrategy[key] && matchStrategy[key].label">
          <el-row v-if="outputData[key] && Object.keys(outputData[key]).length">
            <template v-for="(subValue, subKey) in outputData[key]">
              <p v-if="subValue && !matchStrategy[key]['blackList'].includes(subKey)" :key="subKey" style="text-align:left">
                <strong style="font-weight:bolder">{{ subKey }}：</strong>
                <b>{{ subValue }}</b>
              </p>
            </template>
          </el-row>
          <div v-else>暂无数据</div>
        </el-tab-pane>
      </el-tabs>
    </el-row>

    <!-- 编辑弹窗 -->
    <el-dialog :title="matchStrategy[activeTabName] && matchStrategy[activeTabName].label"
      :visible.sync="idssFormvisiable"
      width="500px" align="left" custom>
      <component
        :is="matchStrategy[activeTabName] && matchStrategy[activeTabName].component"
        :message="editOutputData"
        @close="handleCloseDialog"
        @change-data="handleChangeData">
      </component>
    </el-dialog>
  </div>
</template>
<script>
import idssOutputKafka from '@/views/manage/data/data/out-file/kafka'
import idssOutputHbase from '@/views/manage/data/data/out-file/hbase'
import idssOutputHdfs from '@/views/manage/data/data/out-file/hdfs'
import idssOutputEs from '@/views/manage/data/data/out-file/es'
import globalMixins from '@/mixins/globalMixins.js'
import { isObject } from 'fusion-utils'

const BASE_URL = '/api/setting/etl/job/ui'
const API = {
  // 获取输出配置
  TASK_OUTPUT (jobSerialNumber) {
    return {
      url: BASE_URL + '/get-output-tasks?jobSerialNumber=' + jobSerialNumber,
      tag: '',
      method: 'get'
    }
  },

  // kafka输出删除
  KAFKA: BASE_URL + '/kafka-output-delete',
  // hdfs输出删除
  HDFS: BASE_URL + '/hdfs-output-delete',
  // hbase输出删除
  HBASE: BASE_URL + '/hbase-output-delete',
  // es输出删除
  ES: BASE_URL + '/es-output-delete'
}

export default {
  name: 'dataOutputConfig',
  mixins: [globalMixins],
  components: {
    idssOutputHbase,
    idssOutputKafka,
    idssOutputEs,
    idssOutputHdfs
  },
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
      outputData: {},
      activeTabName: '',
      matchStrategy: {
        'kafka': {
          label: 'Kafka',
          blackList: ['id'],
          component: idssOutputKafka
        },
        'hbase': {
          label: 'Hbase',
          blackList: ['id'],
          component: idssOutputHbase
        },
        'hdfs': {
          label: 'Hdfs',
          blackList: ['id', 'fileNameTemplate', 'splitFileType', 'splitFileVal', 'splitTimeType'],
          component: idssOutputHdfs
        },
        'es': {
          label: 'ElasticSearch',
          blackList: ['id', 'splitFileType', 'splitFileVal', 'splitTimeType', 'clusterName'],
          component: idssOutputEs
        }
      },
      editOutputData: {
        type: 'output',
        num: this.data.taskInfo['jobSerialNumber'],
        data: {}
      },
      // ['output', this.data.taskInfo['jobSerialNumber']],

      arrayData: [],
      tasktitle: '',
      tasktype: '',
      idssFormvisiable: false,
      currentOut_type: '',
      currentOut: '',
      currentData_out: '',
      sendData: []  // [pathType: 'output', jobSerialNumber, requestResult]
    }
  },
  methods: {
    /**
     * 输出数据
     */
    async getOutputData () {
      let { taskInfo } = this.data
      let requestResult = await this.$request(API.TASK_OUTPUT(taskInfo.jobSerialNumber))
      if (!requestResult || !isObject(requestResult)) return
      // key 小写处理，避免对应不上
      for (let key in requestResult) {
        this.outputData[key.toLocaleLowerCase()] = requestResult[key]
      }
      // 默认为第一个
      this.activeTabName = Object.keys(this.outputData)[0]
    },

    /**
     * 新增输出设置, 已有数据不能新增
     */
    addOutput () {
      let currentTabData = this.outputData[this.activeTabName]
      if (!currentTabData || !Object.keys(currentTabData).length) {
        this.editOutputData.type = 'normal'
        this.editOutputData.data = {}
        this.idssFormvisiable = true
      } else {
        this.$message({
          type: 'warning',
          message: '已有数据，不支持新增。'
        })
      }
    },

    /**
     * 编辑输出配置
     */
    editOutput () {
      let currentTabData = this.outputData[this.activeTabName]
      if (currentTabData && Object.keys(currentTabData).length) {
        this.editOutputData.data = JSON.parse(JSON.stringify(currentTabData))
        this.idssFormvisiable = true
      } else {
        this.$message({
          type: 'warning',
          message: '数据为空，无法编辑'
        })
      }
    },

    /**
     * 删除输出配置
     */
    deleteOutput () {
      let currentTabData = this.outputData[this.activeTabName]

      if (!this.activeTabName) {
        this.$message({
          type: 'warning',
          message: '没有选择要删除的输出对象!'
        })
      } else {
        if (!currentTabData || !Object.keys(currentTabData).length) {
          this.$message({
            type: 'warning',
            message: '目前没有数据可删除!'
          })
        } else {
          this.$confirm('删除后数据无法恢复，确认删除?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.deleteOutputRequest()
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
        }
      }
    },

    /**
     * 删除输出配置请求
     * FIXME: id ??
     */
    async deleteOutputRequest () {
      let baseUrl = API[this.activeTabName.toLocaleUpperCase()]
      let jobSerialNumber = this.data.taskInfo['jobSerialNumber']
      await this.$request({
        method: 'delete',
        url: baseUrl + '?jobSerialNumber=' + jobSerialNumber + '&id=' + ''
      })
      this.$message({
        message: '删除成功',
        type: 'success'
      })
      // 数据清空
      this.outputData[this.activeTabName] = {}
    },

    /**
     * 数据编辑成功回调
     */
    handleChangeData (data) {
      let { output } = data
      let { outputSrcType } = output
      this.outputData[outputSrcType] = output[outputSrcType]
    },

    /**
     * 弹窗关闭回调
     */
    handleCloseDialog () {
      this.idssFormvisiable = false
    }
  },
  created () {
    this.getOutputData()
  }
}
</script>

<style scoped lang="postcss"></style>
