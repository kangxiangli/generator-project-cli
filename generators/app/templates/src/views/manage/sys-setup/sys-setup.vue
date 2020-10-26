<template>
  <div>
    <el-row>
      <el-col :span="6">
        <idss-widget style="padding: 10px">
          <template slot="title-left">系统设置</template>
          <!-- 搜索框 start -->
          <el-input clearable v-model="keySearch" size="small" placeholder="请输入">
            <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
          </el-input>
          <!-- 搜索框 end -->

          <!-- 树形列表操作按钮 start -->
          <el-row>
            <el-col :span="6">
              <el-button size="medium" type="text" @click="fold">
                折叠
                <idss-icon-svg name="arrow-botton"></idss-icon-svg>
              </el-button>
            </el-col>
          </el-row>
          <!-- 树形列表操作按钮 end -->

          <!-- 树形列表 start -->
          <el-tree
            ref="tree"
            empty-text="暂无数据"
            node-key="id"
            :expand-on-click-node="false"
            :data="treeListData"
            :props="{
              children: 'children',
              label: 'name'
            }"
            default-expand-all
            highlight-current
            @node-click="clickNode"
            :filter-node-method="filterNode"
            v-loading="loading['tree-list']"></el-tree>
          <!-- 树形列表 end -->
        </idss-widget>
      </el-col>
      <el-col :span="18">
        <!-- 右侧内容 新增、编辑 start -->
        <component :is="viewComponent" :data="viewComponentData"></component>
        <!-- 右侧内容 详情 end -->
      </el-col>
    </el-row>
  </div>
</template>
<script>
import globalMixins from '@/mixins/globalMixins.js'
import service from './sys-setup-service.js'
import networkSet from './components/network-set.vue'
import networkRouteSet from './components/network-route-set.vue'
import ntpSet from './components/ntp-set.vue'
import dnsSet from './components/dns-set.vue'
import snmpSet from './components/snmp-set.vue'
export default {
  name: 'manage-sys-setup',
  mixins: [globalMixins, service],
  components: {
    networkSet,
    networkRouteSet,
    ntpSet,
    dnsSet,
    snmpSet
  },
  data () {
    return {
      viewComponentData: {},
      isExpand: false,
      keySearch: '',
      treeListData: [],
      viewComponent: 'networkRouteSet'
    }
  },
  methods: {
    // 折叠
    fold () {
      // 非常规解决方案
      Object.keys(this.$refs.tree.store.nodesMap).map((key, index) => {
        this.$refs.tree.store.nodesMap[key].expanded = false
      })
    },
    // 详情事件
    async clickNode ({ id, children = [] }, node, component) {
      switch (id) {
        case '1':
          this.viewComponent = 'networkRouteSet'
          !children.length && await this.getInterfaceListData().then(data => {
            children.push(...data)
          })
          break
        case '2':
          this.viewComponent = 'ntpSet'
          break
        case '3':
          this.viewComponent = 'dnsSet'
          break
        case '4':
          this.viewComponent = 'snmpSet'
          break
        default:
          this.viewComponentData = { id }
          this.viewComponent = 'networkSet'
      }
    },
    // 过滤节点
    filterNode (value, data) {
      if (!value) return true
      return data.name.includes(value)
    },
    // API接口清单 搜索
    search () {
      this.$refs['tree'].filter(this.keySearch)
    },
    init () {
      this.getTreelistData()
    }
  },
  created () {
    this.init()
  }
}
</script>
