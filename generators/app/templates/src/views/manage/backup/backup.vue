<template>
  <div class="backup-container">
    <idss-drag-container width="25%" :min-left-width="350" :min-right-width="550" class="backup">
      <template slot="dragTarget">
        <idss-widget
          shadow="never"
          :main-style="{padding: '10px'}"
          :global-style="{border: 'none'}">
          <template slot="title-left">
            备份
          </template>
          <!-- 操作按钮组 start-->
          <el-row>
            <el-col>
              <el-input
                v-model="backupForm.search"
                size="small"
                placeholder="请输入">
                <template slot="suffix">
                  <button class="idss-button-icon" @click="getTreeList">
                    <idss-icon-svg name="search" class="search_icon"></idss-icon-svg>
                  </button>
                </template>
              </el-input>
            </el-col>
          </el-row>
          <el-row class="tree-operate-btns">
            <el-col :span="6">
              <button class="idss-button-icon" @click="foldChange('backupTree')">
                折叠
                <span class="icon-content">
                  <i class="el-icon-arrow-down" v-show="!isFold"></i>
                  <i class="el-icon-arrow-up" v-show="isFold"></i>
                </span>
              </button>
            </el-col>
            <el-col :span="18" style="textAlign: right">
              <button class="idss-button-icon" @click="addBackup">
                <idss-icon-svg name="add"></idss-icon-svg>
                新建
              </button>
              <button class="idss-button-icon idss-svg_delete-hover" @click="delBackup">
                <idss-icon-svg name="delete-hover"></idss-icon-svg>
                删除
              </button>
            </el-col>
          </el-row>
          <!-- 操作按钮组 end-->
          <!-- 备份列表 start -->
          <idss-widget
            shadow="never"
            :main-style="{padding: '15px'}"
            :global-style="{border: 'none', marginRight: 0}"
            :footerStyle="{padding: '20px'}">
            <el-row class="tree-row">
              <el-tree
                v-loading="loading['backup-tree']"
                ref="backupTree"
                @node-click="backupDetail"
                highlight-current
                :expand-on-click-node="false"
                :data="backupTree"
                node-key="bakId"
                :props="defaultBackupProps">
                <span style="display:inline-block;width: 100%" slot-scope="{node}">
                  <span v-if="node.label === '备份' || node.label === '备份记录'">{{node.label}}</span>
                  <el-tooltip
                    v-else
                    :content="node.label"
                    placement="top-start"
                    effect="dark">
                    <span class="tree-content">{{node.label}}</span>
                  </el-tooltip>
                </span>
              </el-tree>
            </el-row>
          </idss-widget>
          <!-- 备份列表 end -->
        </idss-widget>
      </template>

      <!-- 新增备份 -->
      <component
        @agian-backup="backupAgian"
        @add-success="addBackupSuccess"
        ref="treeComponent"
        :is="backupComponent"
        :id='backupId'
        :title="backupTitle">
      </component>
    </idss-drag-container>
  </div>
</template>
<script>
import globalMixins from '@/mixins/globalMixins.js'
import BackupService from '@/views/manage/backup/backup-service.js'
import AddBackup from '@/views/manage/backup/components/add-backup.vue'
import BackupRecordDetail from '@/views/manage/backup/components/backup-record-detail.vue'
export default {
  name: 'manage-backup',
  mixins: [globalMixins, BackupService],
  components: {
    AddBackup,
    BackupRecordDetail
  },
  data () {
    return {
      backupComponent: 'AddBackup',
      backupTitle: 'add',
      isFold: false, // 折叠箭头
      addBackupVisible: true,
      backupForm: {
        search: ''
      },
      backupTree: [],  // 备份树
      backupRecordTree: [], // 备份记录树
      defaultBackupProps: {
        children: 'children',
        label: 'fileName'
      },
      treeParentNodeIds: ['root', 'recordRoot'],
      backupId: '',
      parentId: '',  // 用于区分是备份还是备份记录
      currentKey: null
    }
  },
  methods: {
    async init () {
      this.getTreeList()  // 获取备份树
      await this.$nextTick()
      this.$refs['treeComponent'].getBackupTemplateList()  // 调用子组件获取备份内容的接口
    },
    /**
     * 折叠切换
     */
    foldChange (refName) {
      // this.isFold = !this.isFold
      Object.keys(this.$refs[refName].store.nodesMap).map((key, index) => {
        this.$refs[refName].store.nodesMap[key].expanded = false
      })
    },
    /**
     * 备份详情
     */
    async backupDetail (data, node, tree) {
      if (!data || this.treeParentNodeIds.includes(data.bakId)) return false
      this.backupId = data.bakId
      this.parentId = node.parent.data.bakId
      switch (this.parentId) {
        case 'root':
          this.backupTitle = 'edit'
          this.backupComponent = 'AddBackup'
          break
        case 'recordRoot':
          this.backupComponent = 'BackupRecordDetail'
          break
        default:
          return false
      }
      await this.$nextTick()
      this.$refs['treeComponent'].init()
    },
    /**
     * 新增备份
     */
    async addBackup () {
      this.resetComponent()
    },
    /**
     * 删除备份
     */
    delBackup () {
      this.currentKey = this.$refs['backupTree'].getCurrentKey()
      if (!this.currentKey) {
        return this.showMessage('请选择要删除的备份或者备份记录', 'warning')
      }
      if (!this.currentKey || this.treeParentNodeIds.includes(this.currentKey)) return false
      this.confirmBox({
        message: `是否要删除当前选中的记录或记录备份?`,
        title: '提示',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(_ => {
        let urlObj = {
          'root': '/api/sys/bak-manage',
          'recordRoot': '/api/sys/bak-record'
        }
        this.deleteBackup(this.currentKey, urlObj[this.parentId])
      })
    },
    /**
     * 重新备份
     */
    async backupAgian (param) {
      let { id, componentType } = param
      this.backupTitle = 'edit'
      this.backupId = id
      this.backupComponent = componentType
      await this.$nextTick()
      this.$refs['treeComponent'].init()
    },
    /**
     * 新增备份成功
     */
    addBackupSuccess (param) {
      if (param) {
        this.getTreeList()
        this.resetComponent()
      }
    },
    /**
     * 组件重置针对新增成功或者删除成功
     */
    async resetComponent () {
      this.backupComponent = 'AddBackup'
      this.backupTitle = 'add'
      await this.$nextTick()
      this.$refs['treeComponent'].cancel()
      this.$refs['treeComponent'].getBackupTemplateList()  // 调用子组件获取备份内容的接口
    }
  },
  created () {
    this.init()
  }
}
</script>
<style scoped lang="postcss">
.backup-container {
  margin-right: 10px;
  .tree-row {
    max-height: 380px;
    overflow-y: auto;
  }
  >>> .idss-drag__target {
    background: rgba(249, 249, 249, 1);
    & .idss-widget {
      background: rgba(249, 249, 249, 1);
      .el-tree {
        background: rgba(249, 249, 249, 1);
      }
      .tree-operate-btns {
        margin-top: 10px;
      }
      .idss-button-icon {
        padding: 0;
        .search_icon {
          margin-top: 5px;
          cursor: pointer;
          width: 1.5em;
          height: 1.5em;
        }
      }
    }
  }
  >>> .idss-drag__aside {
    background: #fff;
  }
  .tree-content {
    display: inline-block;
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
</style>
