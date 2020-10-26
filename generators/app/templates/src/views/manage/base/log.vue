<template>
  <div class="manage-base-logger">
    <!-- search start -->
    <idss-widget style="padding: 15px 15px 2px 15px">
      <idss-collapse
        title="筛选条件"
        :collapse="false"
        :is-button-show="false"
        is-arrow-show>
        <!-- 折叠按钮处理 end -->
        <el-form class="manage-base-logger__search idss-margin--b-m idss-margin--r-l" label-width="80px" ref="searchForm" plain>
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label="用户账号">
                <el-input v-model="searchData.userAccountNumber" placeholder="请输入用户账号" maxlength="100"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="操作结果">
                <el-select
                  v-model="searchData.status"
                  collapse-tags
                  placeholder="请选择操作结果"
                  popper-class="test-roleId"
                  style="width: 100%">
                  <el-option
                    v-for="item in statusList"
                    :key="item.code"
                    :label="item.name"
                    :value="item.code">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="操作时间">
                <el-date-picker
                  custom
                  stretch
                  v-model="time"
                  type="datetimerange"
                  format="yyyy-MM-dd HH:mm:ss"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  range-separator="至"
                  @change="timeChange"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期">
                </el-date-picker>
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
    <idss-widget :footer-style="{padding: '6px 0'}">
      <template slot="title-left">
        日志列表
      </template>
      <el-table
        :height="TABLE_HEIGHT.HIGH"
        :max-height="TABLE_HEIGHT.HIGH"
        stripe
        border
        style="width: 100%"
        :data="searchData.data"
        v-loading="loading['manage-base-logger-list']"
        @selection-change="handleSelectionChange">
        <template slot="empty">
          <idss-no-data></idss-no-data>
        </template>
        <el-table-column
          type="index"
          label="序号"
          align="center"
          width="50">
        </el-table-column>
        <el-table-column
          prop="userAccountNumber"
          label="用户账号"
          align="center">
        </el-table-column>
        <el-table-column
          prop="ip"
          label="操作IP"
          align="center">
        </el-table-column>
        <el-table-column
          prop="businessName"
          label="功能名称"
          align="center">
        </el-table-column>
        <el-table-column
          prop="inParam"
          label="入参"
          align="center">
          <template slot-scope="scope">
            <div v-idss-tooltip class="idss-text-overflow">
              {{scope.row.inParam}}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="outParam"
          label="出参"
          align="center">
          <template slot-scope="scope">
            <div v-idss-tooltip class="idss-text-overflow">
              {{scope.row.outParam}}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="timeConsuming"
          label="耗时（ms）"
          align="center">
        </el-table-column>
        <el-table-column
          prop="targetType"
          label="业务对象类型"
          align="center">
        </el-table-column>
        <el-table-column
          prop="targetCode"
          label="业务对象标识"
          align="center">
        </el-table-column>
        <el-table-column
          prop="status"
          label="操作结果"
          align="center">
          <template slot-scope="scope">
            {{scope.row.status ? '成功' : '失败'}}
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="操作时间"
          align="center">
        </el-table-column>
      </el-table>
      <template slot="footer">
        <idss-pagination :tableData="searchData" @page-change="userTableChange" @size-change="userTableChange"></idss-pagination>
      </template>
    </idss-widget>
  </div>
</template>

<script>
import { formatDate, debounce } from 'fusion-utils'
import globalMixins from '@/mixins/globalMixins.js'
import service from './log-service.js'

export default {
  name: 'manage-base-log',
  mixins: [globalMixins, service],
  data () {
    return {
      searchData: {},
      collapse: false,
      multiSelect: [],
      time: [],
      statusList: [{ 'code': 0, 'name': '失败' }, { 'code': 1, 'name': '成功' }] // 操作类型列表枚举值
    }
  },
  methods: {
    async init () {
      this.defaultSearch = {
        userAccountNumber: '', // 用户账号
        logLevel: [], // 日志级别
        optType: [], // 操作类型
        startDate: '', // 操作时间起始
        endDate: '', // 操作时间止
        status: ''// 操作结果
      }
      // 数据重置
      this.searchData = Object.assign(this.searchData, this.defaultSearch)
      // dateformat函数
      this.formatDate = formatDate
      this.tableChange({ type: 'init', defaultSort: false }, this.searchData, this.getLogList)
    },

    /**
       * 表单提交
       */
    searchSubmit: debounce(function () {
      this.tableChange({ type: 'submit' }, this.searchData, this.getLogList)
    }, 300),

    /**
       * 表单重置
       */
    formReset () {
      // 数据重置
      this.time = []
      this.searchData = Object.assign(this.searchData, this.defaultSearch)
    },

    // 表头监听
    userTableChange (params) {
      this.tableChange(params, this.searchData, this.getLogList)
    },
    /**
       * 批量chechbox处理
       * @param {array} list
       */
    handleSelectionChange (list) {
      this.multiSelect = []
      if (list && list.length) {
        list.map(row => {
          this.multiSelect.push(row.logId)
        })
      }
    },

    /**
       * 日志备份
       */
    logBackup: debounce(async function () {
      try {
        await this.backupLog(this.searchData)
        this.showMessage('备份成功！')
      } catch (err) {
        this.showMessage(err.message, 'error')
      }
    }, 300),

    /**
       * 批量删除
       */
    batchDel: debounce(async function () {
      // if (!this.multiSelect.length) {
      //   return this.showMessage('请选择操作数据项', 'error')
      // }
      // 确认提示
      await this.confirmBox({
        message: `您确定要清空全部内容吗?`,
        title: '提示',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      try {
        await this.batchDelete()
        // 删除成功
        this.showMessage('删除成功!')
        // 获取角色列表
        await this.getLogList()
      } catch (err) {
        this.showMessage(err.message, 'error')
      }
    }, 300),

    /**
       * 搜索查询操作日期change事件
       */
    timeChange (time) {
      if (time && time.length) {
        this.searchData.startDate = time[0]
        this.searchData.endDate = time[1]
      } else {
        this.searchData.startDate = ''
        this.searchData.endDate = ''
      }
    }
  },

  created () {
    this.init()
  }
}
</script>

<style scoped lang="postcss">
  .manage-base-logger {
    >>> .idss-widget .title .idss-button-icon {
      padding: 0;
    }
  }
</style>
