<template>
  <div id="idssAgent">
    <el-form label-width="100px" size="small" :model="hbaseData" :rules="rules" ref="hbaseData">
      <el-form-item label="标题名称" prop="title">
        <el-input v-model="hbaseData.title" placeholder="请输入标题名称"></el-input>
      </el-form-item>

      <el-form-item label="zk主机地址" prop="zkAddr">
        <!-- <el-select
          v-model="hbaseData.zkAddr"
          placeholder="请输入zookeeper主机地址"
          style="width:100%"
          size="small"
          filterable
          allow-create
          default-first-option>
          <el-option v-for="item in nodeList" :key="item.clusterName" :value="item.clusterUrl">
            <span style="float: left">{{ item.clusterName }}/{{ item.clusterUrl }}</span>
          </el-option>
        </el-select>-->
        <el-autocomplete
          style="width:100%"
          v-model="hbaseData.zkAddr"
          :fetch-suggestions="querySearch"
          value-key="clusterUrl"
          placeholder="请输入zookeeper主机地址"></el-autocomplete>
      </el-form-item>

      <el-form-item label="表名" prop="tableName">
        <el-input v-model="hbaseData.tableName" placeholder="请输入Hbase表名"></el-input>
      </el-form-item>

      <el-form-item label="salting" style="margin-bottom:15px" prop="keySalting">
        <el-input v-model="hbaseData.keySalting" size="small" placeholder="请输入范围，如1-3，最大范围为0-9"></el-input>
      </el-form-item>
    </el-form>

    <el-row v-if="!saveData" style="text-align:center;">
      <el-button size="small" custom @click="save('hbaseData')" type="primary">确定</el-button>
      <el-button size="small" custom @click="closeDialog('hbaseData', 'add')">取消</el-button>
    </el-row>
    <el-row v-if="saveData" style="text-align:center;">
      <el-button size="small" custom @click="saveOutput('hbaseData')" type="primary">保存</el-button>
      <el-button size="small" custom @click="closeDialog('hbaseData', 'edit')">取消</el-button>
    </el-row>
  </div>
</template>

<script>
import globalMixins from '@/mixins/globalMixins.js'
import service from './out-common-service.js'
export default {
  name: 'idss-output-hbase',
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
        this.hbaseData = Object.assign(this.hbaseData, val['data'])
        this.saveRequestQuery.jobSerialNumber = val['num']
      },
      deep: true,
      immediate: true
    }
  },
  data () {
    return {
      nodeList: [],
      hbaseData: {
        title: '',
        zkAddr: '',
        tableName: '',
        keySalting: '',
        clusterName: ''
      },
      rules: {
        title: [
          { required: true, message: '请输入标题名称', trigger: 'blur' }
        ],
        zkAddr: [
          { required: true, message: '请输入zookeeper主机地址', trigger: 'change' }
        ],
        tableName: [
          { required: true, message: '请输入Hbase表名', trigger: 'change' }
        ],
        keySalting: [
          { required: true, message: '请输入范围', trigger: 'blur' },
          { pattern: /^\b[0-9]\b-\b[0-9]\b$/, message: '格式不对或范围不对,请重新输入' }
        ]
      },
      // 保存请求参数 saveRequestQuery
      saveRequestQuery: {
        jobSerialNumber: '',
        output: {
          outputSrcType: 'hbase',
          hbase: {}
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
          for (let i = 0; i < this.nodeList.length; i++) {
            if (this.hbaseData.zkAddr === this.nodeList[i].clusterUrl) {
              this.hbaseData.clusterName = this.nodeList[i].clusterName
            }
          }
          this.$emit('close', 1)
          this.$emit('change-data', this.hbaseData)
        } else {
          return false
        }
      })
    },

    saveOutput (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // clusterName 查找
          let cluster = this.nodeList.find(item => item.clusterUrl === this.hbaseData.zkAddr)
          cluster && (this.hbaseData.clusterName = cluster['clusterName'])
          this.saveRequestQuery.output.hbase = this.hbaseData
          // 发送请求
          this.saveOutputDataRequest(this.saveRequestQuery)
        } else {
          return false
        }
      })
    }
  },
  mounted () {
    this.getCluster('zookeeper')
  }
}
</script>
