<template>
  <el-dialog
    custom
    title="部门"
    :visible="isShow"
    :before-close="closeDialog"
    :append-to-body="true"
    @open="dialogOpen"
    class="manage-base-deppartment"
    width="600px">
    <el-input
      placeholder="输入关键字进行过滤"
      v-model="filterText">
    </el-input>
    <el-tree
      empty-text="暂无数据"
      node-key="sysDepartId"
      :data="deptList"
      :props="{
        children: 'children',
        label: 'departName'
      }"
      :filter-node-method="filterNode"
      :default-expanded-keys="[currentKey]"
      :expand-on-click-node="false"
      :current-node-key="currentKey"
      v-loading="loading['manage-base-user-dept-list']"
      ref="deptTreeDialog"
      :highlight-current="true"
      :show-checkbox="false"
      class="manage-base-deppartment__tree">
    </el-tree>
    <div class="el-dialog-footer idss-txt--center">
      <el-button type="primary" size="small" @click="confirmOperation" custom>确认</el-button>
      <el-button size="small" @click="closeDialog" custom>取消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import deptTreeService from './deptTreeService.js'
import globalMixins from '@/mixins/globalMixins.js'
export default {
  name: 'dept-tree-dialog',
  mixins: [globalMixins, deptTreeService],
  props: {
    // 要隐藏显示的部门名称
    hideName: {
      type: [Number, String]
    },
    currentKey: {
      type: [Number, String]
    },
    isShow: {
      type: Boolean
    },
    hideId: {
      type: [Number, String]
    }
  },
  data () {
    return {
      deptList: [],
      deptListTemp: [],
      filterText: ''
    }
  },
  watch: {
    filterText (val) {
      // 过滤树节点
      this.$refs['deptTreeDialog'].filter(val)
    }
  },
  methods: {
    /**
       * 过滤树节点 - 搜索
       * @param {string} value
       * @param {object} data 当前层级数据
       */
    filterNode (value, data) {
      if (!value) {
        return this.hideId ? data.sysDepartId.indexOf(this.hideId) === -1 : true
      }
      return data.departName.indexOf(value) !== -1 &&
          (this.hideId ? data.sysDepartId.indexOf(this.hideId) === -1 : true)
    },
    /**
     *  获取部门列表 回调中执行 不可选择部门下的自己及自己的子部门
     */
    getDeptListData (arr) {
      if (Array.isArray(arr) && arr.length > 0) {
        arr.forEach((v, idx) => {
          if (v.sysDepartId === this.hideId) {
            arr.splice(idx, 1)
            return
          }
          // 递归
          this.getDeptListData(v['children'])
        })
      }
    },
    /**
       * 弹框初始化打开事件
       */
    async dialogOpen () {
      await this.getDeptList((data) => {
        let arr = data['departments']
        this.getDeptListData(arr)
        this.deptList = arr
      })
      await this.$nextTick()
      // 默认筛选过滤
      this.$refs['deptTreeDialog'].filter()
      // 选择高亮
      this.currentKey && this.$refs['deptTreeDialog'].setCurrentKey(this.currentKey)
    },
    /**
       * 确认 - 按钮操作
       */
    confirmOperation () {
      const currentNode = this.$refs.deptTreeDialog.getCurrentNode()
      if (!currentNode) {
        this.showMessage('未选中任何部门', 'warning')
      } else {
        this.$emit('closeDialog', false, currentNode)
      }
    },

    /**
       * 关闭按钮回调
       */
    closeDialog () {
      this.$emit('closeDialog', false)
    }
  }
}
</script>

<style lang="postcss">
  .manage-base-deppartment {
    &__tree {
      margin: 20px 0
    }
  }
</style>
