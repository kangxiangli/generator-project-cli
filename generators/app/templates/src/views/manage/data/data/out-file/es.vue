<template>
  <div id="outES">
    <el-form label-width="120px" size="small" :model="storageEs" :rules="rules" ref="storageEs">
      <el-form-item label="标题名称" prop="title">
        <el-input v-model="storageEs.title" placeholder="请输入标题名称"></el-input>
      </el-form-item>

      <el-form-item label="连接地址" prop="server">
        <!-- <el-select
          v-model="storageEs.server"
          placeholder="请选择服务器连接地址"
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
          v-model="storageEs.server"
          :fetch-suggestions="querySearch"
          value-key="clusterUrl"
          placeholder="请输入服务器连接地址"></el-autocomplete>
      </el-form-item>

      <el-form-item label="索引名">
        <el-input v-model="storageEs.indexName" placeholder="请输入索引名"></el-input>
      </el-form-item>

      <el-form-item label="索引类型" prop="indexType">
        <el-input v-model="storageEs.indexType" placeholder="请输入索引类型"></el-input>
      </el-form-item>
    </el-form>

    <el-row v-if="!saveData" style="text-align:center;">
      <el-button size="small" custom @click="save('storageEs')" type="primary">确定</el-button>
      <el-button size="small" custom @click="closeDialog('storageEs', 'add')">取消</el-button>
    </el-row>
    <el-row v-if="saveData" style="text-align:center;">
      <el-button size="small" custom @click="saveOutput('storageEs')" type="primary">保存</el-button>
      <el-button size="small" custom @click="closeDialog('storageEs', 'edit')">取消</el-button>
    </el-row>
  </div>
</template>

<script>
import globalMixins from '@/mixins/globalMixins.js'
import service from './out-common-service.js'
export default {
  name: 'idss-output-es',
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
        this.storageEs = Object.assign(this.storageEs, val['data'])
        this.saveRequestQuery.jobSerialNumber = val['num']
      },
      deep: true,
      immediate: true
    }
  },
  data () {
    return {
      nodeList: [],
      storageEs: {
        title: '',
        server: '',
        indexName: 'security_log_',
        clusterName: '',
        indexType: 'log',
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
        indexType: [
          { required: true, message: '请输入索引类型', trigger: 'blur' }
        ],
        splitFileVal: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        splitTimeType: [
          { required: true, message: '请选择', trigger: 'change' }
        ]
      },
      options: [{
        value: 'day',
        label: '天'
      }],
      // 保存请求参数 saveRequestQuery
      saveRequestQuery: {
        jobSerialNumber: '',
        output: {
          outputSrcType: 'es',
          es: {}
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
          if (this.storageEs.splitFileType === 'count') {
            delete this.storageEs['splitTimeType']
          }
          for (let i = 0; i < this.nodeList.length; i++) {
            if (this.storageEs.server === this.nodeList[i].clusterUrl) {
              this.storageEs.clusterName = this.nodeList[i].clusterName
            }
          }
          this.$emit('close', 1)
          this.$emit('change-data', this.storageEs)
        } else {
          return false
        }
      })
    },

    saveOutput (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.storageEs.splitFileType === 'count') {
            delete this.storageEs['splitTimeType']
          }
          // clusterName 查找
          let cluster = this.nodeList.find(item => item.clusterUrl === this.storageEs.server)
          cluster && (this.storageEs.clusterName = cluster['clusterName'])
          this.saveRequestQuery.output.es = this.storageEs
          // 发送请求
          this.saveOutputDataRequest(this.saveRequestQuery)
        } else {
          return false
        }
      })
    }
  },
  mounted () {
    this.getCluster('elasticsearch')
  }
}
</script>

<style scope>
.specialStyle {
  margin-left: 0;
}
.specialStyle .el-form-item__content {
  margin-left: 10px !important;
}
</style>
