<template>
  <div class="manage-base-role">
    <el-row>
      <el-col :span="7">
        <idss-widget :main-style="{padding: '0px 15px'}" :footer-style="{ padding: '10px 0px' }" :global-style="{border: 'none'}">
          <template slot="title-left">角色管理</template>
          <!-- 操作按钮组 start-->
          <el-input
            v-model="roleSearch.roleName"
            placeholder="请输入"
            @keyup.enter.native="searchSubmit"
            suffix-icon="el-icon-search">
          </el-input>
          <el-row>
            <el-col :span="24" class="idss-txt--right" style="margin-top: 10px">
              <el-button size="small" type="primary" plain @click="addRole">
                <idss-icon-svg name="add" style="margin-right: 4px"></idss-icon-svg>新建
              </el-button>
              <el-button size="small" type="danger" :disabled="!multiSelect.length" plain @click="batchDel">
                <idss-icon-svg name="delete-hover"></idss-icon-svg>删除
              </el-button>
            </el-col>
          </el-row>
          <!-- 操作按钮组 end-->
          <!-- 角色列表 start -->
          <el-table
            :height="TABLE_HEIGHT.HIGH"
            :max-height="TABLE_HEIGHT.HIGH"
            style="width: 100%"
            :data="roleSearch.data"
            v-loading="loading['manage-base-user-role-list']"
            @selection-change="handleSelectionChange"
            fit
            class="role-table">
            <el-table-column
              type="selection"
              width="40"
              :selectable="checkboxSelectable"
              align="center"></el-table-column>
            <el-table-column label="全选">
              <template slot-scope="scope">
                <span @click="getDeptDetail(scope.row)" class="item-role">
                  <idss-tooltip :content="scope.row.roleName" placement="top">
                    <div class="title">{{scope.row.roleName}}</div>
                  </idss-tooltip>
                </span>
              </template>
            </el-table-column>
          </el-table>
          <template slot="footer">
            <idss-pagination
              :tableData="roleSearch"
              @page-change="roleTableChange"
              @size-change="roleTableChange"
              layout="prev, pager, next"
              :pagerCount="5"></idss-pagination>
          </template>
          <!-- 角色列表 end -->
        </idss-widget>
      </el-col>
      <el-col :span="17">
        <div v-iscroll class="iScrollHorizontalScrollbar">
          <idss-widget>
            <!-- 新增编辑角色 -->
            <add-role
              ref="add-role"
              :sysRolesId.sync="sysRolesId"
              @saveRole="getRoleist"
              :key="`${timestamp}_${sysRolesId}`"></add-role>
          </idss-widget>
        </div>
      </el-col>
    </el-row>
    <organization-dialog :isShow="isAuthShow" @closeDialog="closeDialog"></organization-dialog>
  </div>
</template>
<script>
import globalMixins from '@/mixins/globalMixins.js'
import service from './role-service.js'
import organizationDialog from './common/organization-dialog.vue'
import addRole from './role-components/add-role.vue'
import { debounce } from 'fusion-utils'
export default {
  name: 'manage-base-role',
  mixins: [globalMixins, service],
  components: {
    addRole,
    organizationDialog
  },
  watch: {
    'roleSearch.roleName': debounce(function () {
      this.tableChange({ type: 'submit' }, this.roleSearch, this.getRoleist)
    }, 300)
  },
  data () {
    return {
      sysRolesId: '',
      roleSearch: {
        roleName: ''
      },
      multiSelect: [], // 已选角色
      isAuthShow: false,
      timestamp: Date.now() // 用于存储点击事件的时间戳
    }
  },
  methods: {
    // 页面初始化
    init () {
      // 获取角色列表
      this.getRoleist()
      this.addRole()
    },

    /**
     * 添加部门
     */
    addRole () {
      this.sysRolesId = ''
      this.timestamp = Date.now()
      this.$refs['add-role'] && this.$refs['add-role'].addRole()
    },

    /**
     * 获取角色详情
     * @param {object} roleInfo
     */
    getDeptDetail: function (roleInfo) {
      this.sysRolesId = roleInfo.sysRolesId
      this.timestamp = Date.now()
    },

    /**
     * 表单提交
     */
    searchSubmit: debounce(function () {
      this.tableChange({ type: 'submit' }, this.roleSearch, this.getRoleist)
    }, 300),

    // 表头监听
    roleTableChange (params) {
      this.tableChange(params, this.roleSearch, this.getRoleist)
    },

    /**
     * 批量chechbox处理
     * @param {array} list
     */
    handleSelectionChange (list) {
      this.multiSelect = []
      if (list && list.length) {
        list.map(row => {
          this.multiSelect.push(row.sysRolesId)
        })
      }
    },

    /**
     * 批量删除
     */
    batchDel: debounce(async function () {
      if (!this.multiSelect.length) {
        return this.showMessage('请选择数据操作项', 'warning')
      }
      // 确认提示
      await this.confirmBox({
        message: `此操作将会影响用户权限, 是否继续?`,
        title: '提示',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      try {
        await this.batchDeleteRole({ ids: this.multiSelect })
        // 判断右侧展示是否包含在当前ids里
        if (this.multiSelect.indexOf(this.sysRolesId) !== -1) {
          // 包含在删除里面，重新新增角色
          this.addRole()

          this.$nextTick(_ => {
            this.$refs['add-role'].resetDetail()
          })
        }
        // 删除成功
        this.showMessage('删除成功!')
        // 获取角色列表
        await this.getRoleist()
      } catch (err) {
      }
    }, 300),

    /**
     * 批量授权
     */
    batchAuth () {
      if (!this.multiSelect.length) {
        return this.showMessage('请选择数据操作项', 'warning')
      } else if (this.multiSelect.length > 1) {
        return this.showMessage('最多选择一项操作项', 'warning')
      }
      this.isAuthShow = true
    },

    /**
     * 关闭授权按钮
     * @param {boolean} isShow
     * @param {array} userList
     */
    closeDialog: debounce(async function (isShow, userList) {
      this.isAuthShow = isShow
      // 确认授权
      if (userList && userList.length) {
        try {
          // 批量授权
          await this.batchAuthUsers({ userId: userList }, this.multiSelect)
          // 删除成功
          this.showMessage('授权成功!')
        } catch (err) {
          this.showMessage(err.message, 'error')
        }
      }
    }, 300),

    /**
     * 列表checkbox是否可以勾选处理
     */
    checkboxSelectable ($row) {
      // 1: 不能删除可编辑； 2: 不能删除不能编辑
      return $row.editDele !== 2
    }
  },
  created () {
    // 获取数据
    this.init()
  }
}
</script>
<style scoped lang="postcss">
.manage-base-role {
  >>> .role-table td,
  >>> .role-table th.is-leaf {
    border-bottom: none;
    cursor: pointer;
  }
  >>> .role-table .cell {
    padding-left: 0px;
    padding-right: 0px;
  }
}
</style>
