<template>
  <div>
    <!-- 页面主体内容 -->
    <el-row>
      <!-- 数据源 -->
      <el-col style="margin-bottom: 16px;">
        <el-row style="padding-bottom: 8px;">选择一个数据源</el-row>
        <el-row>
          <el-radio-group
            v-model="dataSourceType"
            @click.native="selectInputType"
            @change="selectInputType"
            class="radio-wrapper">
            <!-- 这里不适用v-for，是因为文件目录存在两种类型 -->
            <el-radio v-if="dataSourceType !== 'spool'" label="file" size="small" border>文件目录</el-radio>
            <el-radio v-if="dataSourceType === 'spool'" label="spool" size="small" border>文件目录</el-radio>
            <el-radio label="jdbc" size="small" border>数据库</el-radio>
            <el-radio label="syslog" size="small" border>SYSLOG</el-radio>
            <el-radio label="netcat" size="small" border>NETCAT</el-radio>
            <el-radio label="ftp" size="small" border>FTP/SFTP</el-radio>
            <el-radio label="kafka" size="small" border>KAFKA</el-radio>
            <el-radio label="snmp_trap" size="small" border>SNMP/TRAP</el-radio>
            <el-radio label="netflow" size="small" border>NETFLOW</el-radio>
          </el-radio-group>
        </el-row>
      </el-col>
      <!-- 输出目的地 -->
      <el-col v-if="outEnabled" style="padding-bottom: 16px">
        <el-row style="padding-bottom: 8px;">选择数据输出目的地</el-row>
        <el-row>
          <el-checkbox-group v-model="outputType">
            <el-checkbox
              v-for="(output, type) in outputStrategy"
              :key="type"
              :label="type"
              size="small"
              @change="changeCheckbox(type, $event)"
              border>
              <label @click.stop="selectOutputType(type)">{{output.title}}</label>
            </el-checkbox>
          </el-checkbox-group>
        </el-row>
      </el-col>
      <!-- 保存 -->
      <el-col>
        <el-button @click="save" size="small" custom type="primary">保存</el-button>
      </el-col>
    </el-row>

    <!-- 数据源弹窗 -->
    <el-dialog
      :title="dataSourceType && dataSourceStrategy[dataSourceType].title"
      :visible.sync="dataSourceDialogVisiable"
      width="680px"
      align="left"
      custom>
      <component
        ref="dataSourceRef"
        :is="dataSourceType && dataSourceStrategy[dataSourceType].component"
        :sendMsg="sendMsg"
        @change-data="dataSourceDataChange"
        @close="() => dataSourceDialogVisiable = false"></component>
    </el-dialog>

    <!-- 输出目的弹窗 -->
    <el-dialog
      :title="curOutputType && outputStrategy[curOutputType].title"
      :visible.sync="outputDialogVisiable"
      width="600px"
      align="left"
      custom>
      <component
        v-if="outputDialogVisiable"
        :is="curOutputType && outputStrategy[curOutputType].component"
        :save-data="false"
        :message="curOutputData"
        @change-data="outputDataChange"
        @close="() => outputDialogVisiable = false"></component>
    </el-dialog>

    <!-- 设置任务 -->
    <el-dialog title="设置任务" :visible.sync="taskDialogVisiable" width="480px" custom>
      <el-form :model="taskForm" label-width="90px" ref="taskForm" :rules="taskFormRules">
        <el-form-item label="任务ID:" prop="id">
          <el-input v-model="taskForm.id" size="small" disabled></el-input>
        </el-form-item>
        <el-form-item label="任务描述:" prop="desc">
          <el-input v-model="taskForm.desc" placeholder="请输入任务描述" type="textarea" :rows="3"></el-input>
        </el-form-item>
        <el-form-item label="解析:">
          <el-radio :disabled="!outEnabled" v-model="taskForm.isExtractRule" label="0">否</el-radio>
          <el-radio :disabled="!outEnabled" v-model="taskForm.isExtractRule" label="1">是</el-radio>
        </el-form-item>
        <el-form-item style="text-align: center;" label-width="0">
          <el-button size="small" custom @click="makeTask('taskForm')" type="primary">保存</el-button>
          <el-button size="small" @click="taskDialogVisiable = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
/**
 * 菜单 - 数据输入入口
 */
import idssInputFile from '@/views/manage/data/data/input-file/file'
import idssInputSyslog from '@/views/manage/data/data/input-file/syslog'
import idssInputKafka from '@/views/manage/data/data/input-file/kafka'
import idssInputJdbc from '@/views/manage/data/data/input-file/jdbc'
import idssInputNetcat from '@/views/manage/data/data/input-file/netcat'
import idssInputFtp from '@/views/manage/data/data/input-file/ftp'
import idssInputSnmp from '@/views/manage/data/data/input-file/snmp'
import idssInputNetflow from '@/views/manage/data/data/input-file/netflow'
// 数据输出
import idssOutputKafka from '@/views/manage/data/data/out-file/kafka'
import idssOutputHbase from '@/views/manage/data/data/out-file/hbase'
import idssOutputHdfs from '@/views/manage/data/data/out-file/hdfs'
import idssOutputEs from '@/views/manage/data/data/out-file/es'

export default {
  name: 'manage-data-server',
  props: {
    tabData: Object
  },
  watch: {
    tabData: {
      handler (val, oldVal) {
        if (val !== undefined) {
          if (val && val.level === 'master') {
            this.outEnabled = true
          } else {
            this.outEnabled = false
            this.taskForm.isExtractRule = '1'
          }
        }
      },
      deep: true
    }
  },
  data () {
    return {
      // 输入源策略类
      dataSourceStrategy: {
        file: { // 文件目录-文件
          type: 1,
          isConfirm: false,
          title: '文件目录',
          component: idssInputFile
        },
        syslog: {
          type: 2,
          isConfirm: false,
          title: 'SYSLOG',
          component: idssInputSyslog
        },
        jdbc: {
          type: 3,
          isConfirm: false,
          title: '数据库',
          component: idssInputJdbc
        },
        spool: { // 文件目录-目录
          type: 4,
          isConfirm: false,
          title: '文件目录',
          component: idssInputFile
        },
        ftp: {
          type: 5,
          isConfirm: false,
          title: 'FTP/SFTP',
          component: idssInputFtp

        },
        netcat: {
          type: 6,
          isConfirm: false,
          title: 'NETCAT',
          component: idssInputNetcat
        },
        kafka: {
          type: 7,
          isConfirm: false,
          title: 'KAFKA',
          component: idssInputKafka
        },
        snmp_trap: {
          type: 8,
          isConfirm: false,
          title: 'SNMP/TRAP',
          component: idssInputSnmp
        },
        netflow: {
          type: 9,
          isConfirm: false,
          title: 'NetFlow',
          component: idssInputNetflow
        }
      },
      dataSourceType: '', // 数据源类别
      dataSourceDialogVisiable: false,
      // 输出策略类
      outputStrategy: {
        kafka: {
          title: 'Kafka',
          isConfirm: false,
          component: idssOutputKafka
        },
        hbase: {
          title: 'HBase',
          isConfirm: false,
          component: idssOutputHbase
        },
        hdfs: {
          title: 'HDFS',
          isConfirm: false,
          component: idssOutputHdfs
        },
        es: {
          title: 'ElasticSearch',
          isConfirm: false,
          component: idssOutputEs
        }
      },
      outputType: [],
      curOutputType: '',
      curOutputData: {},
      outputDialogVisiable: false,

      // 任务弹窗
      taskDialogVisiable: false,
      taskForm: {
        id: '',
        desc: '',
        isExtractRule: '1'
      },
      taskFormRules: {
        id: [
          { required: true, message: 'id不能为空', trigger: 'blur' }
        ],
        desc: [
          { required: true, message: '请输入任务描述', trigger: 'blur' },
          { min: 1, max: 256, message: '长度在 1 到 256 个字符', trigger: 'blur' }
        ]
      },

      // 请求配置数据
      configdata: {
        jobSerialNumber: '',    // jobID
        jobDescription: '',     // job描述
        collect: {              // 数据源
          collect_src_type: ''  // 数据源只能1个
        },
        output: {             // 输出目的
          outputSrcType: '',  // 输出类别（使用,间隔）
          kafka: {},
          hbase: {},
          hdfs: {},
          es: {}
        }
      },
      sendMsg: {},
      outEnabled: false
    }
  },
  methods: {
    // 选择输入源
    selectInputType () {
      this.$nextTick(() => {
        let data = this.configdata.collect[this.dataSourceType] || {}
        this.sendMsg = {
          uid: this.tabData.uid,
          type: this.dataSourceType,
          data: JSON.parse(JSON.stringify(data))
        }
      })
      this.dataSourceDialogVisiable = true
    },

    /**
     * 数据源数据发生变更
     */
    dataSourceDataChange (params) {
      let [data, type] = params
      this.dataSourceType = type
      this.dataSourceStrategy[this.dataSourceType].isConfirm = true
      this.configdata.collect[type] = JSON.parse(JSON.stringify(data))
    },

    changeCheckbox (type, checked) {
    },

    /**
     * 选择输出目的
     */
    selectOutputType (type) {
      this.curOutputType = type // 设置当前type
      if (!this.outputType.includes(type)) { // 选中当前type
        this.outputType.push(type)
      }
      this.curOutputData.data = this.configdata.output[this.curOutputType] ? this.configdata.output[this.curOutputType] : {}
      this.outputDialogVisiable = true // 显示弹窗
    },

    /**
     * 输出数据发生变更
     */
    outputDataChange (data) {
      this.outputStrategy[this.curOutputType].isConfirm = true
      this.configdata.output[this.curOutputType] = JSON.parse(JSON.stringify(data))

      // if (!this.outputType.includes(this.curOutputType)) { // 选中当前type
      //   this.outputType.push(this.curOutputType)
      // }
    },

    /**
     * 保存
     */
    async save () {
      if (!this.dataSourceType || (this.outEnabled && !this.outputType.length)) {
        this.$message({
          type: 'warning',
          message: '设置一个数据源和至少一个输出目的地'
        })
      } else {
        if (!this.dataSourceStrategy[this.dataSourceType].isConfirm) {
          this.$message({
            type: 'warning',
            message: '请完善数据源信息'
          })
        } else {
          if (this.outputType.some(type => !this.outputStrategy[type].isConfirm)) {
            this.$message({
              type: 'warning',
              message: '请完善输出设置信息'
            })
          } else {
            this.configdata.collect.collect_src_type = this.dataSourceStrategy[this.dataSourceType].type
            this.configdata.output.outputSrcType = this.outputType.join(',')
            // 获取任务ID
            await this.getJobSerialNum()
            // 显示任务弹窗
            this.taskDialogVisiable = true
          }
        }
      }
    },

    /**
     * 获取任务ID
     */
    async getJobSerialNum () {
      this.taskForm.id = await this.$request({
        method: 'get',
        url: '/api/setting/etl/job/generator'
      })
    },

    // 保存
    async makeTask (formName) {
      if (this.taskForm.desc.indexOf(' ') > -1) {
        this.$message({
          type: 'warning',
          message: '任务描述不能有空格'
        })
      } else {
        this.configdata.jobSerialNumber = this.taskForm.id
        this.configdata.jobDescription = this.taskForm.desc
        this.configdata.deptUId = this.tabData.uid
        this.configdata.isExtractRule = this.taskForm.isExtractRule

        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            try {
              await this.$request({
                method: 'post',
                url: '/api/setting/etl/job/ui/conf-save',
                data: this.configdata
              })
              this.$message({
                type: 'success',
                message: '新增成功!'
              })
              this.taskDialogVisiable = false
              // 路由跳转
              if (this.configdata.isExtractRule === '1') {
                this.$router.replaceTagPush({ name: 'manage-data-allpicker', query: { id: this.taskForm.id } }, this.$route)
              } else {
                this.$router.replaceTagPush({ name: 'manage-data-job', query: { uid: this.tabData.uid } }, this.$route)
              }
            } catch (error) {
              this.$message({
                type: 'error',
                message: error.message
              })
            }
          }
        })
      }
    }
  },
  mounted () {
    if (this.tabData && this.tabData.level === 'master') {
      this.outEnabled = true
    } else {
      this.outEnabled = false
      this.taskForm.isExtractRule = '1'
    }
  },
  components: {
    idssInputFile,
    idssInputSyslog,
    idssInputKafka,
    idssInputJdbc,
    idssInputNetcat,
    idssInputFtp,
    idssInputNetflow,
    idssInputSnmp,
    idssOutputHbase,
    idssOutputKafka,
    idssOutputEs,
    idssOutputHdfs
  }
}
</script>

<style scoped lang="postcss">
.radio-wrapper {
  diaplay: flex;
  flex-wrap: wrap;

  .el-radio--small.is-bordered {
    margin-bottom: 8px;
  }
  .el-radio.is-bordered + .el-radio.is-bordered {
    margin-left: 0;
  }
}
</style>
