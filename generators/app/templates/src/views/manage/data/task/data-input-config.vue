<template>
  <div class="dataInputConfig">
    <el-row style="text-align:left">
      <el-button icon="el-icon-edit" size="mini" @click="editInputvisiable = true">编辑</el-button>
    </el-row>
    <el-row class="list-wrapper">
      <span>
        <strong style="font-weight:bold">collectType：</strong>
        <b>{{ collectType }}</b>
      </span>
      <template v-for="(value, key) in inputObjForView">
        <span v-if="value && key!=='id' && key!=='dbPassword' && key!=='password'" :key="key">
          <strong style="font-weight:bold">{{ key }}：</strong>
          <b>{{ value }}</b>
        </span>
      </template>
    </el-row>

    <!-- 编辑弹窗 -->
    <el-dialog title="数据输入编辑" :visible.sync="editInputvisiable" widht="45%" custom>
      <editInput
        :editMsg="editData"
        @change-data="handleChangeData"
        @close="editInputvisiable = false"></editInput>
    </el-dialog>
  </div>
</template>
<script>
import globalMixins from '@/mixins/globalMixins.js'
import editInput from '@/views/manage/data/data/input-file/edit.vue'
import { isObject } from 'fusion-utils'

const CollectTypes = {
  '1': {
    type: 'file',
    title: '文件目录'
  },
  '2': {
    type: 'syslog',
    title: 'SYSLOG'
  },
  '3': {
    type: 'jdbc',
    title: '数据库'
  },
  '4': {
    type: 'spool',
    title: '文件目录'
  },
  '5': {
    type: 'ftp',
    title: 'FTP/SFTP'
  },
  '6': {
    type: 'netcat',
    title: 'NETCAT'
  },
  '7': {
    type: 'kafka',
    title: 'KAFKA'
  },
  '8': {
    type: 'snmp_trap',
    title: 'SNMP/TRAP'
  },
  '9': {
    type: 'netflow',
    title: 'NetFLow'
  }
}

const BASE_URL = '/api/setting/etl/job'
const API = {
  // 获取数据
  TASK_INPUT_DATA (jobSerialNumber) {
    return {
      url: BASE_URL + '/ui/get-input-task?jobSerialNumber=' + jobSerialNumber,
      method: 'get',
      tag: 'input-task'
    }
  }
}

export default {
  name: 'data-input-config',
  mixins: [globalMixins],
  components: {
    editInput
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
      collectType: '',
      inputObjForView: {},
      editInputvisiable: false,
      // 弹窗数据
      editData: {
        num: '',   // 任务 num
        data: '',  // 原始数据
        uid: ''    // 部门id
      }
    }
  },
  methods: {
    // 获取输入任务
    async getTaskInputData (event) {
      let { taskInfo } = this.data
      let requestResult = await this.$request(API.TASK_INPUT_DATA(taskInfo.jobSerialNumber))

      if (!requestResult || !isObject(requestResult)) return

      for (let item in requestResult) {
        this.collectType = CollectTypes[item]['title']
        this.inputObjForView = requestResult[item]
      }
      this.editData.data = JSON.parse(JSON.stringify(requestResult))
    },

    /**
     * 展示数据变更
     * @params {Array} params
     */
    handleChangeData (params) {
      let [inputObjForView, collectType] = params
      this.inputObjForView = inputObjForView
      for (let key in CollectTypes) {
        if (CollectTypes[key]['type'] === collectType) {
          this.collectType = CollectTypes[key]['title']
        }
      }
    }
  },
  created () {
    let { taskInfo, deptInfo } = this.data
    this.editData['num'] = taskInfo.jobSerialNumber
    this.editData['uid'] = deptInfo.uid

    this.getTaskInputData()
  }
}
</script>
<style scoped lang="postcss">
.list-wrapper {
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  margin-top: 15px;

  & > span {
    /* height: 24px; */
    line-height: 24px;
  }

  & > span + span {
    /* margin-left: 15px; */
  }
}
</style>
