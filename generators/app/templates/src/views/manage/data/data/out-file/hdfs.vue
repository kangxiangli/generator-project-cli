<template>
  <div id="idssAgent">
    <el-form label-width="100px" size="small" :model="hdfsData" :rules="rules" ref="hdfsData">
      <el-form-item label="标题名称" prop="title">
        <el-input v-model="hdfsData.title" size="small" placeholder="请输入标题名称"></el-input>
      </el-form-item>

      <el-form-item label="连接地址" prop="server">
        <!-- <el-select
          v-model="hdfsData.server"
          placeholder="请输入连接地址"
          style="width:100%"
          size="small"
          filterable
          allow-create
          default-first-option>
          <el-option
            v-for="item in nodeList"
            :key="item.clusterName"
            :value="item.clusterUrl">
            <span style="float: left">{{ item.clusterName }}/{{ item.clusterUrl }}</span>
          </el-option>
        </el-select>-->
        <el-autocomplete
          style="width:100%"
          size="small"
          v-model="hdfsData.server"
          :fetch-suggestions="querySearch"
          value-key="clusterUrl"
          placeholder="请输入连接地址"></el-autocomplete>
      </el-form-item>

      <el-form-item label="保存目录" prop="saveDir">
        <el-input v-model="hdfsData.saveDir" size="small" placeholder="请输入保存地址"></el-input>
      </el-form-item>
    </el-form>

    <el-row v-if="!saveData" style="text-align:center;">
      <el-button size="small" custom @click="save('hdfsData')" type="primary">确定</el-button>
      <el-button size="small" custom @click="closeDialog('hdfsData', 'add')">取消</el-button>
    </el-row>
    <el-row v-if="saveData" style="text-align:center;">
      <el-button size="small" custom @click="saveOutput('hdfsData')" type="primary">保存</el-button>
      <el-button size="small" custom @click="closeDialog('hdfsData', 'edit')">取消</el-button>
    </el-row>
  </div>
</template>

<script>
import globalMixins from '@/mixins/globalMixins.js'
import service from './out-common-service.js'

export default {
  name: 'idss-output-hdfs',
  mixins: [globalMixins, service],
  props: {
    saveData: {
      type: Boolean,
      default: true
    },
    message: {
      type: Object,
      default () {
        return {
          type: 'edit',
          num: '',
          data: {}
        }
      }
    }
  },
  watch: {
    message: {
      handler (val, oldval) {
        this.componentStatus = val['type']
        // 避免切断引用类型，响应式
        this.hdfsData = Object.assign(this.hdfsData, val['data'])
        this.saveRequestQuery.jobSerialNumber = val['num']
      },
      deep: true,
      immediate: true
    }
  },
  data () {
    return {
      nodeList: [],
      hdfsData: {
        title: '',
        server: '',
        saveDir: '',
        clusterName: '',
        fileNameTemplate: '',
        splitFileType: 'time',
        splitFileVal: '1',
        splitTimeType: 'day'
      },
      rules: {
        title: [
          { required: true, message: '请输入标题名称', trigger: 'blur' }
        ],
        server: [
          { required: true, message: '请输入连接地址', trigger: 'change' }
        ],
        saveDir: [
          { required: true, message: '请输入保存地址', trigger: 'blur' }
        ],
        indexName: [
          { required: true, message: '请输入索引名', trigger: 'blur' }
        ],
        indextype: [
          { required: true, message: '请输入索引类型', trigger: 'blur' }
        ],
        splitFileVal: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        splitTimeType: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        fileNameTemplate: [
          { required: true, message: '请输入文件名生成模版', trigger: 'blur' }
        ]
      },
      options: [{
        value: 'day',
        label: '天'
      }, {
        value: 'hour',
        label: '时'
      }, {
        value: 'minute',
        label: '分钟'
      }],
      // 保存请求参数 saveRequestQuery
      saveRequestQuery: {
        jobSerialNumber: '',
        output: {
          outputSrcType: 'hdfs',
          hdfs: {}
        }
      },
      // 类型： 编辑（'edit'） 或 新增 ('add')
      componentStatus: 'add'
    }
  },
  methods: {
    save (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.hdfsData.splitFileType === 'count') {
            delete this.hdfsData['splitTimeType']
          }
          for (let i = 0; i < this.nodeList.length; i++) {
            if (this.hdfsData.server === this.nodeList[i].clusterUrl) {
              this.hdfsData.clusterName = this.nodeList[i].clusterName
            }
          }
          this.$emit('close', 1)
          this.$emit('change-data', this.hdfsData)
        } else {
          return false
        }
      })
    },

    saveOutput (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.hdfsData.splitFileType === 'count') {
            delete this.hdfsData['splitTimeType']
          }
          // clusterName 查找
          let cluster = this.nodeList.find(item => item.clusterUrl === this.hdfsData.server)
          cluster && (this.hdfsData.clusterName = cluster['clusterName'])
          this.saveRequestQuery.output.hdfs = this.hdfsData
          // 发送请求
          this.saveOutputDataRequest(this.saveRequestQuery)
        } else {
          return false
        }
      })
    }
  },
  mounted () {
    this.getCluster('hadoop')
  }
}
</script>
