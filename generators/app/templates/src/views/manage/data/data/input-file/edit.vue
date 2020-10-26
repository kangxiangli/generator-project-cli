+
<template>
  <div>
    <el-row>
      <el-form ref="etlform" size="small" label-width="120px">
        <el-form-item label="选择一个数据源">
          <el-select v-model="dataSourceIndex" size="small" placeholder="请选择数据源">
            <!-- 文件和目录公用一个 -->
            <el-option
              v-for="(input, id) in dataSourceStrategy"
              v-show="id !== '4'"
              :key="id"
              :label="input.title"
              :value="id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row>
      <component
        :is="dataSourceIndex && dataSourceStrategy[dataSourceIndex].component"
        :message="nomalData"
        @close="$emit('close', $event)"
        @change-data="$emit('change-data', $event)"></component>
    </el-row>
  </div>
</template>

<script>
import idssInputFile from './file.vue'
import idssInputSyslog from './syslog.vue'
import idssInputKafka from './kafka.vue'
import idssInputJdbc from './jdbc.vue'
import idssInputNetcat from './netcat.vue'
import idssInputFtp from './ftp.vue'
import idssInputSnmp from './snmp.vue'
import idssInputNetflow from './netflow.vue'
export default {
  props: {
    editMsg: Object   // {num: '', data: ''}
  },
  data () {
    return {
      nomalData: {
        data: '',
        num: ''
      },
      dataSourceIndex: '',
      // 输入源策略类
      dataSourceStrategy: {
        1: { // 文件目录-文件
          type: 'file',
          title: '文件目录',
          component: idssInputFile
        },
        2: {
          type: 'syslog',
          title: 'SYSLOG',
          component: idssInputSyslog
        },
        3: {
          type: 'jdbc',
          title: '数据库',
          component: idssInputJdbc
        },
        4: {
          type: 'file', // 注意这里1，4同时对应文件目录
          title: '文件目录',
          component: idssInputFile
        },
        5: {
          type: 'ftp',
          title: 'FTP/SFTP',
          component: idssInputFtp

        },
        6: {
          type: 'netcat',
          title: 'NETCAT',
          component: idssInputNetcat
        },
        7: {
          type: 'kafka',
          title: 'KAFKA',
          component: idssInputKafka
        },
        8: {
          type: 'snmp_trap',
          title: 'SNMP/TRAP',
          component: idssInputSnmp
        },
        9: {
          type: 'netflow',
          title: 'NetFlow',
          component: idssInputNetflow
        }
      }
    }
  },
  watch: {
    editMsg: {
      handler (val, oldVal) {
        this.handleData()
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    handleData () {
      let dataSourceCollectionObj = this.editMsg['data']
      // 输入源只有一个，这里循环无意义
      for (let dataSourceIndex in dataSourceCollectionObj) {
        this.dataSourceIndex = dataSourceIndex
      }
      this.nomalData['data'] = this.editMsg['data']
      this.nomalData['num'] = this.editMsg['num']
      this.nomalData['uid'] = this.editMsg['uid']
    }
  },
  components: {
    idssInputFile,
    idssInputSyslog,
    idssInputKafka,
    idssInputJdbc,
    idssInputNetcat,
    idssInputFtp,
    idssInputSnmp,
    idssInputNetflow
  }
}
</script>
