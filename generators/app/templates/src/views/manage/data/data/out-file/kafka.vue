<template>
  <div id="outkafka">
    <el-form label-width="100px" size="small" :model="kafkaData" :rules="rules" ref="kafkaData">
      <el-form-item label="标题名称" prop="title">
        <el-input v-model="kafkaData.title" placeholder="请输入标题名称"></el-input>
      </el-form-item>
      <el-form-item label="连接地址" prop="server">
        <el-autocomplete
          style="width:100%"
          v-model="kafkaData.server"
          :fetch-suggestions="querySearch"
          value-key="clusterUrl"
          placeholder="请输入主机地址">
        </el-autocomplete>
      </el-form-item>
      <el-form-item label="topic" prop="topic">
        <el-input v-model="kafkaData.topic" placeholder="请输入topic"></el-input>
      </el-form-item>
    </el-form>

    <el-row v-if="!saveData" style="text-align:center;">
      <el-button size="small" custom @click="save('kafkaData')" type="primary">确定</el-button>
      <el-button size="small" custom @click="closeDialog('kafkaData', 'add')">取消</el-button>
    </el-row>
    <el-row v-if="saveData" style="text-align:center;">
      <el-button size="small" custom @click="saveOutput('kafkaData')" type="primary">保存</el-button>
      <el-button size="small" custom @click="closeDialog('kafkaData', 'edit')">取消</el-button>
    </el-row>

  </div>
</template>

<script>
import globalMixins from '@/mixins/globalMixins.js'
import service from './out-common-service.js'

export default {
  name: 'idss-output-kafka',
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
          type: 'add',
          num: '',
          data: {}
        }
      }
    }
  },
  data () {
    return {
      nodeList: [],
      kafkaData: {
        title: '',
        server: '',
        topic: '',
        clusterName: ''
      },
      rules: {
        title: [
          { required: true, message: '请输入标题名称', trigger: 'blur' }
        ],
        server: [
          { required: true, message: '请输入连接地址', trigger: 'change' }
        ],
        topic: [
          { required: true, message: '请输入topic', trigger: 'blur' }
        ]
      },
      // 保存请求参数 saveRequestQuery
      saveRequestQuery: {
        jobSerialNumber: '',
        output: {
          outputSrcType: 'kafka',
          kafka: {}
        }
      },
      // 类型： 编辑（'edit'） 或 新增 ('add')
      componentStatus: 'add'
    }
  },
  watch: {
    message: {
      handler (val, oldval) {
        this.componentStatus = val['type']
        this.kafkaData = Object.assign(this.kafkaData, val['data'])
        this.saveRequestQuery.jobSerialNumber = val['num']
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    // 输入建议
    querySearch (queryString, cb) {
      var nodeList = this.nodeList
      var results = queryString ? nodeList.filter(this.createFilter(queryString)) : nodeList
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter (queryString) {
      return (nodeList) => {
        return (nodeList.clusterUrl.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },

    /**
     * 保存但是不发送请求
     * @param {String} formName
     */
    save (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          for (let i = 0; i < this.nodeList.length; i++) {
            if (this.kafkaData.server === this.nodeList[i].clusterUrl) {
              this.kafkaData.clusterName = this.nodeList[i].clusterName
            }
          }
          this.$emit('close', 1)
          this.$emit('change-data', this.kafkaData)
        } else {
          return false
        }
      })
    },

    /**
     * 保存请求
     * @param {String} formName
     */
    saveOutput (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // clusterName 查找
          let cluster = this.nodeList.find(item => item.clusterUrl === this.kafkaData.server)
          cluster && (this.kafkaData.clusterName = cluster['clusterName'])
          this.saveRequestQuery.output.kafka = this.kafkaData
          // 发送请求
          this.saveOutputDataRequest(this.saveRequestQuery)
        } else {
          return false
        }
      })
    }
  },
  mounted () {
    this.getCluster('kafka')
  }
}
</script>
