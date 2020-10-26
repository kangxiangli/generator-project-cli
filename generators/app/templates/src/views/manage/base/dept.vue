<template>
  <div class="manage-base-dept">
    <el-row>
      <el-col :span="7">
        <idss-widget :main-style="{padding: '0px 15px', height: '765px'}" :global-style="{border: 'none'}">
          <template slot="title-left">部门管理</template>
          <!-- 操作按钮组 start-->
          <el-select
            v-model="searchRole.roleId"
            @change="getDeptList"
            collapse-tags
            clearable
            placeholder="请选择角色"
            popper-class="test-roleId"
            style="width: 100%"
            class="idss-margin--b-m">
            <el-option
              v-for="item in sysRolesList"
              :key="item.sysRolesId"
              :label="item.roleName"
              :value="item.sysRolesId"></el-option>
          </el-select>
          <!-- 操作按钮组 start-->
          <el-row style="margin-bottom: 10px">
            <el-col :span="6">
              <button @click="foldedDept" class="idss-button-text mybtn">
                <span v-text="isCollapse ? '收起全部' : '展开全部'"></span>
                <idss-icon-svg :name="isCollapse ? 'arrow-top' : 'arrow-botton1'"></idss-icon-svg>
              </button>
            </el-col>
            <el-col :span="18" class="idss-txt--right" style="margin-top: 10px">
              <el-button size="small" type="primary" plain @click="addDept">
                <idss-icon-svg name="add"></idss-icon-svg>
                <span>新建</span>
              </el-button>
              <el-button size="small" type="danger" :disabled="!selectedList.length" plain @click="deleteDept">
                <idss-icon-svg name="delete-hover"></idss-icon-svg>
                <span>删除</span>
              </el-button>
              <el-button size="small" plain @click="refreshDept">
                <idss-icon-svg name="circle-refresh-outline"></idss-icon-svg>
                <span>刷新</span>
              </el-button>
            </el-col>
          </el-row>
          <!-- 操作按钮组 end-->
          <!-- 部门树 start -->
          <div style="height: 600px;" v-iscroll class="manage-base-dept__tree">
            <el-tree
              ref="deptTree"
              class="left-tree"
              empty-text="暂无数据"
              node-key="sysDepartId"
              @node-click="getDeptDetail"
              @check="nodeCheck"
              :data="deptList"
              :props="{
                children: 'children',
                label: 'departName',
                disabled: checkDisabled
              }"
              :expand-on-click-node="false"
              highlight-current
              default-expand-all
              show-checkbox
              v-loading="loading['manage-base-user-dept-list']">
              <div class="custom-tree" slot-scope="{ node }">
                <idss-tooltip placement="top" :content="node.label">
                  <div class="custom-tree-node">{{ node.label }}</div>
                </idss-tooltip>
              </div>
            </el-tree>
          </div>
          <!-- 部门树 end -->
        </idss-widget>
      </el-col>
      <el-col :span="17">
        <div v-iscroll class="iScrollHorizontalScrollbar">
          <idss-widget>
            <!-- 新增编辑用户 -->
            <add-dept
              ref="add-dept"
              :sysDepartId.sync="sysDepartId"
              @saveDept="init"
              :key="`${timestamp}_${sysDepartId}`"></add-dept>
          </idss-widget>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import globalMixins from '@/mixins/globalMixins.js'
import service from './dept-service.js'
import addDept from './dept-components/add-dept.vue'
import { debounce } from 'fusion-utils'
export default {
  name: 'manage-base-dept',
  data () {
    return {
      deptList: [],
      isCollapse: true,
      sysDepartId: '',
      selectedList: [],
      searchRole: {
        roleId: ''
      },
      sysRolesList: [],
      timestamp: Date.now() // 用于存储点击事件的时间戳
    }
  },
  components: {
    addDept
  },
  mixins: [globalMixins, service],
  methods: {
    // default 部门不能选择
    checkDisabled (data, node) {
      // 1: 不能删除可编辑； 2: 不能删除不能编辑
      return data.editDele === 2
    },
    // 组件初始化
    init () {
      this.getDeptList()
      this.getSysRoleList()
    },
    /**
       * 收起部门
       */
    foldedDept () {
      // 非常规解决方案
      Object.keys(this.$refs.deptTree.store.nodesMap).map((key, index) => {
        // 控制展开收起
        this.$refs.deptTree.store.nodesMap[key].expanded = !this.isCollapse
      })
      // 控制展开收起的title以及图标改变
      this.isCollapse = !this.isCollapse
    },

    /**
       * 批量删除部门
       */
    deleteDept: debounce(async function () {
      const deptNodes = this.$refs.deptTree.getCheckedNodes()
      if (!deptNodes.length) {
        return this.showMessage('请选择数据操作项', 'warning')
      }
      const isContainUser = deptNodes.some(item => parseInt(item.userCount) > 0)
      if (isContainUser) { // 判断存在用户时不允许删除
        this.showMessage('当前选中部门或者子级部门存在人员，请删除人员之后，再继续当前操作！', 'warning')
      } else {
        // 确认提示
        await this.confirmBox({
          message: `确定要删除该部门吗?`,
          title: '提示',
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        await this.batchDeleteDept({ idList: this.selectedList })
        // 判断右侧展示是否包含在当前ids里
        if (this.selectedList.indexOf(this.sysDepartId) !== -1) {
          // 包含在删除里面，重新新增部门
          this.addDept()
        }
        // 删除成功
        this.showMessage('删除成功!')
        // 获取部门列表
        this.getDeptList()
      }
    }, 300),

    /**
       * 添加部门
       */
    addDept () {
      this.sysDepartId = ''
      // 新增状态
      this.timestamp = Date.now()
      this.$refs['add-dept'].addDept()
    },

    /**
       * 刷新部门列表
       */
    refreshDept: debounce(function () {
      // 获取部门列表
      this.getDeptList()
    }, 300),

    /**
       * 展示用户详情
       * @param {object} data
       */
    getDeptDetail (data) {
      this.sysDepartId = data.sysDepartId
      this.timestamp = Date.now()
      // this.getDeptInfo(this.sysDepartId)
    },

    /**
       * 复选框点击触发
       */
    nodeCheck (curentNode) {
      // 复选框被选中
      let node = this.$refs['deptTree'].getCheckedKeys()
      this.selectedList = node
      // 处理父级,当前node为选中状态时,如果被点击复选框父级存在则让父级不被选中
      let checkNode = this.$refs['deptTree'].getNode(curentNode)
      this.$nextTick(() => {
        if (checkNode.parent && checkNode.checked) {
          // 判断父级被选中，逐级替换为未选中状态
          while (checkNode.parent && checkNode.parent.checked && !checkNode.parent.indeterminate) {
            this.$refs['deptTree'].setChecked(checkNode.parent.data, false)
            checkNode = checkNode.parent
          }
        }
      })
    }
  },
  created () {
    // 获取部门列表
    this.init()
  }
}
</script>

<style scoped lang="postcss">
.manage-base-dept {
  /* 新增样式 */
  & .mybtn > .idss-svg-icon {
    width: 12px;
    height: 12px;
    margin-left: 4px;
  }
  & .mybtn > span {
    font-size: var(--font-size-default);
  }
  >>> .left-tree
    .el-tree-node__children
    .el-tree-node__content
    .el-tree-node__label {
    font-size: var(--font-size-default);
  }
}
</style>
