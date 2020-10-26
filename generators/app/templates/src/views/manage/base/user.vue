<template>
  <div class="manage-base-user">
    <!-- search start -->
    <idss-widget style="padding: 15px;">
      <idss-collapse
        title="筛选条件"
        :is-button-show="false"
        :collapse="false"
        is-arrow-show
        style="position: relative;">
        <el-form
          class="manage-base-user__search"
          label-width="80px"
          ref="searchForm"
          plain
          style="margin-right: 20px">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="用户账号">
                <el-input
                  v-model="searchData.saltKey"
                  placeholder="请输入用户账号"
                  maxlength="100"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="用户姓名">
                <el-input
                  v-model="searchData.name"
                  placeholder="请输入用户姓名"
                  maxlength="32"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="用户工号">
                <el-input
                  v-model="searchData.userNumber"
                  placeholder="请输入用户工号"
                  maxlength="100"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="用户状态">
                <el-radio-group v-model="searchData.isLocked">
                  <el-radio :label="false" name="type">正常</el-radio>
                  <el-radio :label="true" name="type">锁定</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="部门">
                <el-input
                  v-model="searchData.sysDepart"
                  placeholder="请输入部门"
                  maxlength="32"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="角色">
                <el-input
                  v-model="searchData.sysRole"
                  placeholder="请输入角色"
                  maxlength="32"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" justify="center">
            <el-col :span="8" :offset="8">
              <el-button type="primary" @click="searchSubmit">查询</el-button>
              <el-button @click="formReset">重置</el-button>
            </el-col>
          </el-row>
        </el-form>
      </idss-collapse>
    </idss-widget>

    <!-- search end -->
    <!-- list start -->
    <idss-widget :footer-style="{padding: '10px'}">
      <template slot="title-left">用户列表</template>
      <!-- list header start -->
      <template slot="title-left">
        <el-button size="small" style="margin-left: 10px" :disabled="!multiSelect.length" type="danger" plain @click="deleteUser(multiSelect)">
          <idss-icon-svg name="delete-hover"></idss-icon-svg>删除
        </el-button>
      </template>
      <template slot="title-right">
        <el-button @click="addUser" size="small">
          <idss-icon-svg name="add" style="margin-right: 4px"></idss-icon-svg>新建
        </el-button>
      </template>
      <el-table
        border
        stripe
        :height="TABLE_HEIGHT.HIGH"
        :max-height="TABLE_HEIGHT.HIGH"
        style="width: 100%"
        class="table"
        :data="searchData.data"
        v-loading="loading['manage-base-user-list']"
        :default-sort="{prop: 'saltKey', order: 'descending'}"
        @sort-change="userTableChange"
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="40" align="center" :selectable="checkSelectable"></el-table-column>
        <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
        <el-table-column prop="saltKey" label="用户账号" sortable="custom" align="center">
          <template slot-scope="scope">
            <div
              class="idss-txt-link"
              @click="getUser(scope.row.sysUsersId)">{{scope.row.saltKey}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="用户姓名" sortable="custom" align="center"></el-table-column>
        <el-table-column prop="userNumber" label="用户工号" sortable="custom" align="center"></el-table-column>
        <el-table-column prop="sysRole" label="角色" sortable="custom" align="center"></el-table-column>
        <el-table-column prop="sysDepart" label="部门" sortable="custom" align="center"></el-table-column>
        <el-table-column prop="isLocked" label="状态" sortable="custom" width="100" align="center">
          <template slot-scope="scope">{{scope.row.isLocked ? '锁定' : '正常'}}</template>
        </el-table-column>
        <el-table-column label="操作" width="130" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              plain
              @click="editUser(scope.row.sysUsersId)">编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              v-if="scope.row.editDele !== 1"
              plain
              @click="deleteUser([scope.row.sysUsersId])">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <template slot="footer">
        <idss-pagination
          :tableData="searchData"
          @page-change="userTableChange"
          @size-change="userTableChange"></idss-pagination>
      </template>
    </idss-widget>
    <!-- list end -->
    <!-- add/edit 组件 start -->
    <el-dialog
      custom
      :close-on-click-modal="false"
      :visible.sync="isShowAdd"
      :title="!this.userId ? '用户新增' : '用户编辑'"
      width="780px"
      class="manage-base-user__dialog">
      <add-user :user-id="userId" v-if="isShowAdd" @back="isShowAdd = false" @save="handleSave"></add-user>
    </el-dialog>
    <!-- add/edit 组件 end -->
    <!-- userinfo 组件 start -->
    <el-dialog custom :visible.sync="isShowInfo" title="用户详情" class="manage-base-user__dialog">
      <user-info :user-id="userId" v-if="isShowInfo"></user-info>
      <div slot="footer" class="dialog-footer idss-txt--center">
        <el-button size="medium" type="primary" @click="userInfoEdit">编辑</el-button>
        <el-button size="medium" @click="isShowInfo = false" >取消</el-button>
      </div>
    </el-dialog>
    <!-- userinfo 组件 end -->
  </div>
</template>
<script>
import globalMixins from '@/mixins/globalMixins.js'
import service from './user-service.js'
import addUser from './user-components/add-user'
import userInfo from './user-components/user-info'
import { debounce } from 'fusion-utils'
const defaultSearch = {
  saltKey: '',    // 用户账号
  name: '',       // 用户姓名
  userNumber: '', // 用户工号
  isLocked: '',   // 用户状态
  sysRole: '',    // 角色名称
  sysDepart: ''   // 部门名称
}
export default {
  name: 'manage-base-user',
  mixins: [globalMixins, service],
  components: {
    addUser,
    userInfo
  },
  data () {
    return {
      collapse: false,
      searchData: {
        data: [],
        ...defaultSearch
      },
      isShowAdd: false,
      isShowInfo: false,
      userId: '',
      multiSelect: []
    }
  },
  methods: {
    // 组件初始化
    async init () {
      this.tableChange({ type: 'init', defaultSort: true }, this.searchData, this.getUserList)
    },

    /**
       * 表单重置
       */
    formReset () {
      this.searchData = Object.assign(this.searchData, defaultSearch)
    },

    /**
       * 表单提交
       */
    searchSubmit: debounce(function () {
      this.tableChange({ type: 'submit' }, this.searchData, this.getUserList)
    }, 300),

    /**
       * 添加用户
       */
    addUser () {
      this.isShowAdd = true
      this.userId = ''
    },

    /**
       * 编辑用户
       * @param {string} userId
       */
    editUser (userId) {
      this.userId = userId
      this.isShowAdd = true
    },

    /**
       * 展示用户详情
       * @param {string} userId
       */
    getUser (userId) {
      this.userId = userId
      this.isShowInfo = true
    },
    /**
       * 用户展示页面直接编辑
       */
    userInfoEdit () {
      this.isShowInfo = false
      this.isShowAdd = true
    },

    /**
       * add/edit 保存用户后出发
       */
    handleSave () {
      this.isShowAdd = false
      // 重新获取用户列表
      this.getUserList()
    },
    /**
       * 批量chechbox处理
       * @param {array} list
       */
    handleSelectionChange (list) {
      this.multiSelect = []
      if (list && list.length) {
        list.map(row => {
          this.multiSelect.push(row.sysUsersId)
        })
      }
    },
    /**
       * 删除用户
       * @param {array} userIdList
       */
    deleteUser: debounce(async function (userIdList) {
      if (!userIdList.length) {
        this.showMessage('请选择数据操作项', 'warning')
      } else {
        // 确认提示
        await this.confirmBox({
          message: `是否要删除数据吗?`,
          title: '提示',
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        try {
          await this.batchDeleteUser({ ids: userIdList })
          // 删除成功
          this.showMessage('删除成功!')
          // 重新获取列表
          await this.tableChange({ type: 'pageChange' }, this.searchData, this.getUserList)
        } catch (err) {
          // 删除成功
          this.showMessage(err.message, 'error')
        }
      }
    }, 300),
    // 表头监听
    userTableChange (params) {
      this.tableChange(params, this.searchData, this.getUserList)
    },
    /**
       * 列表checkbox是否可以勾选处理
       */
    checkSelectable ($row) {
      // 1: 不能删除可编辑； 2: 不能删除不能编辑
      return $row.editDele !== 1
    }
  },
  mounted () {
    this.init()
  }
}
</script>
