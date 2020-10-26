<template>
  <div class="systemset-container">
    <!--kafka节点管理-->
    <el-row >
      <!--列表-->
      <el-row>
        <idss-widget>
          <template slot="title-left">
            kafka节点管理
          </template>
          <template slot="title-right">
            <el-button size="mini" plain @click="add('kafka')">
              <i class="el-icon-plus"></i>
              <span>新建</span>
            </el-button>
          </template>
          <template>
            <el-table
              border
              stripe
              style="width:100%;"
              :data="kafka.data">
              <el-table-column prop="clusterName" label="集群名" align="center"></el-table-column>
              <el-table-column prop="hostname" label="主机名" align="center"></el-table-column>
              <el-table-column prop="hostIp" label="主机IP" align="center"></el-table-column>
              <el-table-column prop="port" label="端口" align="center"></el-table-column>
              <el-table-column prop="componentType" label="类型" align="center"></el-table-column>
              <el-table-column label="操作" width="126" align="center">
                <template v-slot="{row}">
                  <el-button
                    type="primary"
                    plain
                    size="mini"
                    micro
                    @click="editorConfigData(row, 'kafka')">编辑</el-button>
                  <el-button
                    type="danger"
                    size="mini"
                    micro
                    plain
                    @click="deleteConfigData(row,'kafka')">删除</el-button>
                </template>
              </el-table-column>
              <template slot="empty">
                <idss-no-data></idss-no-data>
                ‌</template>‌
            </el-table>
          </template>
        </idss-widget>
      </el-row>
    </el-row>

    <!--zookeeper节点管理-->
    <el-row>
      <!--列表-->
      <el-row>
        <idss-widget>
          <template slot="title-left">
            zookeeper节点管理
          </template>
          <template slot="title-right">
            <el-button size="mini" plain @click="add('zookeeper')">
              <i class="el-icon-plus"></i>
              <span>新建</span>
            </el-button>
          </template>
          <template>
            <el-table
              border
              stripe
              style="width:100%;"
              :data="zookeeper.data">
              <el-table-column prop="clusterName" label="集群名" align="center"></el-table-column>
              <el-table-column prop="hostname" label="主机名" align="center"></el-table-column>
              <el-table-column prop="hostIp" label="主机IP" align="center"></el-table-column>
              <el-table-column prop="port" label="端口" align="center"></el-table-column>
              <el-table-column prop="componentType" label="类型" align="center"></el-table-column>
              <el-table-column label="操作" width="126" align="center">
                <template v-slot="{row}">
                  <el-button
                    type="primary"
                    micro
                    size="mini"
                    plain
                    @click="editorConfigData(row, 'zookeeper')">编辑</el-button>
                  <el-button
                    type="danger"
                    size="mini"
                    plain
                    micro
                    @click="deleteConfigData(row,'zookeeper')">删除</el-button>
                </template>
              </el-table-column>
              <template slot="empty">
                <idss-no-data></idss-no-data>
                ‌</template>‌
            </el-table>
          </template>
        </idss-widget>
      </el-row>
    </el-row>

    <!--ES集群配置管理-->
    <el-row>
      <!--列表-->
      <el-row>
        <idss-widget>
          <template slot="title-left">
            elasticsearch节点管理
          </template>
          <template slot="title-right">
            <el-button size="mini" plain @click="add('elasticsearch')">
              <i class="el-icon-plus"></i>
              <span>新建</span>
            </el-button>
          </template>
          <template>
            <el-table
              border
              stripe
              style="width:100%;"
              :data="elasticsearch.data">
              <el-table-column prop="clusterName" label="集群名" align="center"></el-table-column>
              <el-table-column prop="hostname" label="主机名" align="center"></el-table-column>
              <el-table-column prop="hostIp" label="主机IP" align="center"></el-table-column>
              <el-table-column prop="port" label="端口" align="center"></el-table-column>
              <el-table-column prop="componentType" label="类型" align="center"></el-table-column>
              <el-table-column label="操作" width="126" align="center">
                <template v-slot="{row}">
                  <el-button
                    type="primary"
                    size="mini"
                    micro
                    plain
                    @click="editorConfigData(row, 'elasticsearch')">编辑</el-button>
                  <el-button
                    type="danger"
                    size="mini"
                    plain
                    micro
                    @click="deleteConfigData(row, 'elasticsearch')">删除</el-button>
                </template>
              </el-table-column>
              <template slot="empty">
                <idss-no-data></idss-no-data>
                ‌</template>‌
            </el-table>
          </template>
        </idss-widget>
      </el-row>
    </el-row>

    <!--hadoop集群配置管理-->
    <el-row>
      <!--列表-->
      <el-row>
        <idss-widget>
          <template slot="title-left">
            hadoop节点管理
          </template>
          <template slot="title-right">
            <el-button size="mini" plain @click="add('hadoop')">
              <i class="el-icon-plus"></i>
              <span>新建</span>
            </el-button>
          </template>
          <template>
            <el-table
              border
              stripe
              style="width:100%;"
              :data="hadoop.data">
              <el-table-column prop="clusterName" label="集群名" align="center"></el-table-column>
              <el-table-column prop="hostname" label="主机名" align="center"></el-table-column>
              <el-table-column prop="hostIp" label="主机IP" align="center"></el-table-column>
              <el-table-column prop="port" label="端口" align="center"></el-table-column>
              <el-table-column prop="componentType" label="类型" align="center"></el-table-column>
              <el-table-column label="操作" width="126" align="center">
                <template v-slot="{row}">
                  <el-button
                    type="primary"
                    size="mini"
                    micro
                    plain
                    @click="editorConfigData(row, 'hadoop')">编辑</el-button>
                  <el-button
                    type="danger"
                    size="mini"
                    micro
                    plain
                    @click="deleteConfigData(row, 'hadoop')">删除</el-button>
                </template>
              </el-table-column>
              <template slot="empty">
                <idss-no-data></idss-no-data>
                ‌</template>‌
            </el-table>
          </template>
        </idss-widget>
      </el-row>
    </el-row>

    <!--添加|编辑dialog-->
    <el-dialog
      custom
      width="30%"
      :title="configDialogTitle"
      :visible.sync="configDialogVisible"
      @close="configDialogClose">
      <!-- 节点服务器管理 -->
      <el-form
        :model="kafkaForm"
        :rules="kafkaFormRules"
        ref="kafkaForm"
        label-width="100px">
        <el-form-item label="集群名称" prop="clusterName">
          <el-input size="mini" v-model="kafkaForm.clusterName"></el-input>
        </el-form-item>
        <el-form-item label="主机名" prop="hostname">
          <el-input size="mini" v-model="kafkaForm.hostname"></el-input>
        </el-form-item>
        <el-form-item label="主机IP" prop="hostIp">
          <el-input size="mini" v-model="kafkaForm.hostIp"></el-input>
        </el-form-item>
        <el-form-item label="端口号" prop="port">
          <el-input size="mini" type="number" v-model.number="kafkaForm.port"></el-input>
        </el-form-item>
      </el-form>
      <template slot="footer">
        <el-row type="flex" justify="center" align="middle">
          <el-button custom type="primary" @click="confirmUpdateConfig()" size="small">保存</el-button>
          <el-button custom @click="cancelConfig()" size="small">取消</el-button>
        </el-row>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import globalMixins from '@/mixins/globalMixins.js'
import service from './sys-service.js'

export default {
  mixins: [globalMixins, service],
  data () {
    return {
      kafka: {
        data: []
      },
      zookeeper: {
        data: []
      },
      elasticsearch: {
        data: []
      },
      hadoop: {
        data: []
      },
      configDialogStatus: '', // 弹窗状态，添加|编辑
      configDialogVisible: false,
      configDialogTitle: '',
      currentConfigType: '',  // 弹窗弹窗显示内容控制
      // kafkaForm节点服务器管理（表单）
      kafkaForm: {
        clusterName: '',
        componentType: '',
        hostIp: '',
        hostname: '',
        port: ''
      },
      // 节点服务器管理 验证规则
      kafkaFormRules: {
        clusterName: [{
          required: true,
          message: '集群名称不能为空',
          trigger: 'blur'
        }],
        hostname: [{
          required: true,
          message: '主机名',
          trigger: 'blur'
        }],
        hostIp: [{
          required: true,
          message: '主机IP不能为空',
          trigger: 'blur'
        }],
        port: [{
          required: true,
          message: '端口号不能为空'
        }, {
          type: 'number',
          message: '端口号必须为数字值'

        }]
      }
    }
  },
  methods: {
    // 添加处理
    add (type) {
      // 当前标识为添加
      this.configDialogStatus = 'add'
      this.currentConfigType = type
      this.configDialogTitle = '新建' + type + '节点'
      this.kafkaForm = {
        clusterName: '',
        componentType: '',
        hostIp: '',
        hostname: '',
        port: ''
      }
      // 显示弹窗
      this.configDialogVisible = true
    },
    cancelConfig () {
      this.initData()
      this.configDialogVisible = false
    },
    // 节点服务器管理-表格（分页、排序、改变页码）
    // kafkaTableChange (params) {
    //   this.currentConfigType = 'kafka'
    //   this.tableChange(params, this.kafka, this.getDataList)
    // },

    // // Kafka Broker List配置管理-表格（分页、排序、改变页码）
    // zookeeperTableChange (params) {
    //   this.currentConfigType = 'zookeeper'
    //   this.tableChange(params, this.zookeeper, this.getDataList)
    // },
    // hadoopTableChange (params) {
    //   this.currentConfigType = 'hadoop'
    //   this.tableChange(params, this.hadoop, this.getDataList)
    // },
    // // ES集群配置管理-表格（分页、排序、改变页码）
    // elasticsearchTableChange (params) {
    //   this.currentConfigType = 'elasticsearch'
    //   this.tableChange(params, this.elasticsearch, this.getDataList)
    // },

    // 获取数据
    getDataList (type = this.currentConfigType) {
      this.getListDataByType(type)
    },

    // 获取全部的列表数据
    initData () {
      this.getDataList('kafka')
      this.getDataList('zookeeper')
      this.getDataList('elasticsearch')
      this.getDataList('hadoop')
    },

    // 编辑节点服务管理
    editorConfigData (row, type) {
      this.kafkaForm = row
      this.currentConfigType = row.componentType
      this.configDialogTitle = '编辑' + type + '节点'
      this.configDialogStatus = 'edit'
      this.configDialogVisible = true
    },

    // 确认保存|编辑
    confirmUpdateConfig () {
      this.$refs['kafkaForm'].validate((valid) => {
        if (valid) {
          this.save(this.kafkaForm, this.currentConfigType, this.configDialogStatus)
        }
      })
    },

    // 删除节点服务管理
    deleteConfigData (row, type) {
      this.$confirm('您确定删除此条数据吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteConfig(row.id)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },

    // 关闭弹窗
    configDialogClose () {
      this.$refs['kafkaForm'].resetFields()
    }
  },
  mounted: function () {
    // 初始化数据查询
    this.initData()
  }
}
</script>
