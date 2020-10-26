<template>
  <idss-widget :footer-style="{padding: '6px 0'}">
    <template slot="title-left">DNS设置</template>
    <el-table
      v-drag-table="{data: tableData}"
      v-loading="loading['table-list']"
      border
      stripe
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%">
      <el-table-column align="center" type="index" label="序号" width="50"></el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="DNS服务器" prop="nameServer">
        <template v-slot="{row}">
          <el-input v-if="row.flag" size="small" placeholder="请输入" v-model.trim="row.nameServer"></el-input>
          <div v-else>{{row.nameServer}}</div>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="添加时间" prop="createTime"></el-table-column>
      <el-table-column min-width="80px" align="center" label="操作">
        <template v-slot="{row}">
          <el-button
            v-if="row.flag"
            size="mini"
            type="primary"
            plain
            custom
            @click="operate({data: row, type: 'save'})">保存</el-button>
          <el-button
            v-if="!row.flag"
            size="mini"
            type="primary"
            plain
            custom
            @click="row.flag = !row.flag">编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            plain
            custom
            @click="operate({data: row, type: 'delete'})">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <template slot="footer">
      <el-button type="primary" size="medium" icon="el-icon-plus" custom @click="add">新增</el-button>
    </template>
  </idss-widget>
</template>
<script>
import globalMixins from '@/mixins/globalMixins.js'
import service from './dns-set-service.js'
import validator from 'validator'
const empty = {
  nameServer: '',
  flag: true
}
export default {
  name: 'dns-set',
  mixins: [globalMixins, service],
  data () {
    return {
      empty,
      tableData: []
    }
  },
  methods: {
    init () {
      this.getDnsListData()
    },
    // 操作
    async operate ({ data, type }) {
      switch (type) {
        case 'save':
          // 验证方法
          if (!this.validateField(data.nameServer)) return
          if (data.id) {
            // 更新
            await this.reqDnsUpdate({ id: data.id, nameServer: data.nameServer })
          } else {
            // 新增
            await this.reqDnsAdd({ nameServer: data.nameServer })
          }
          break
        case 'delete':
          await this.reqDnsDelete(data)
          break
      }
      this.getDnsListData()
    },
    // 新增
    add () {
      this.tableData.push({ ...this.empty })
    },
    // 验证
    validateField (param) {
      if (!param) {
        this.showMessage('请输入DNS服务器名称！', 'error')
        return false
      } else if (!validator.isIP(param)) {
        this.showMessage('请输入正确的DNS服务器名称！', 'error')
        return false
      } else {
        return true
      }
    }
  },
  created () {
    this.init()
  }
}
</script>
