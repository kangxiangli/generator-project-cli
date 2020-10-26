<template>
  <idss-widget :footer-style="{padding: '6px 0'}">
    <template slot="title-left">网络路由设置</template>
    <el-table
      v-drag-table="{data: tableData}"
      v-loading="loading['table-list']"
      border
      stripe
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%">
      <el-table-column align="center" type="index" label="序号" width="50"></el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="目标网络" prop="desNet">
        <template v-slot="{row}">
          <el-input v-if="row.flag" size="small" placeholder="请输入" v-model.trim="row.desNet"></el-input>
          <div v-else>{{row.desNet}}</div>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        align="center"
        placeholder="请输入"
        label="路径开销"
        prop="pathCost">
        <template v-slot="{row}">
          <el-input v-if="row.flag" size="small" placeholder="请输入" v-model.trim="row.pathCost"></el-input>
          <div v-else>{{row.pathCost}}</div>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="下一跳接口" prop="nextInterface">
        <template v-slot="{row}">
          <el-select v-if="row.flag" v-model="row.nextInterface" size="small" placeholder="请选择协议">
            <el-option
              v-for="item in interfaceListData"
              :key="item.id"
              :label="item.name"
              :value="item.id"></el-option>
          </el-select>
          <div v-else>{{row.nextInterface}}</div>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="下一跳地址" prop="nextIp">
        <template v-slot="{row}">
          <el-input v-if="row.flag" size="small" placeholder="请输入" v-model.trim="row.nextIp"></el-input>
          <div v-else>{{row.nextIp}}</div>
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
            v-if="!row.orFix"
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
import service from './network-route-set-service.js'
import validator from 'validator'
const empty = {
  desNet: '',
  pathCost: '',
  nextInterface: '',
  nextIp: '',
  orFix: true,
  flag: true
}
export default {
  name: 'network-route-set',
  mixins: [globalMixins, service],
  data () {
    return {
      empty,
      interfaceListData: [],
      tableData: []
    }
  },
  methods: {
    init () {
      this.getInterfaceListData()
      this.getRouteListData()
    },
    // 操作
    async operate ({ data, type }) {
      switch (type) {
        case 'save':
          // 验证方法
          if (!this.validateField(data)) return
          if (data.id) {
            // 更新
            await this.reqRouteUpdate(data)
          } else {
            // 新增
            await this.reqRouteAdd(data)
          }
          break
        case 'delete':
          await this.reqRouteDelete(data)
          break
      }
      this.getRouteListData()
    },
    // 新增
    add () {
      this.tableData.push({ ...this.empty })
    },
    // 验证
    validateField ({ nextInterface, nextIp }) {
      if (!nextInterface && !nextIp) {
        this.showMessage('请输入下一跳接口的值或下一跳地址的值！', 'error')
        return false
      }
      if (nextIp && !validator.isIP(nextIp)) {
        this.showMessage('请输入正确的下一跳地址！', 'error')
        return false
      }
      return true
    }
  },
  created () {
    this.init()
  }
}
</script>
