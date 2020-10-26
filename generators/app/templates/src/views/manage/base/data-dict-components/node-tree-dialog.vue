<template>
  <el-dialog
    custom
    title="节点选择"
    :visible="isShow"
    :before-close="closeDialog"
    :append-to-body="true"
    @open="dialogOpen"
    class="node-tree"
    width="600px">
    <div style="height: 300px;" v-iscroll>
      <el-tree
        empty-text="暂无数据"
        node-key="dictionaryDataId"
        :data="nodeList"
        :props="{
          children: 'children',
          label: 'name'
        }"
        :default-expanded-keys="[currentKey]"
        :expand-on-click-node="false"
        :current-node-key="currentKey"
        v-loading="loading['manage-base-data-dict-list']"
        ref="nodeTreeDialog"
        :highlight-current="true"
        :show-checkbox="false"
        class="node-tree__tree">
      </el-tree>
    </div>
    <div class="el-dialog-footer idss-txt--center">
      <el-button type="primary" size="small" @click="confirmOperation" custom>确认</el-button>
      <el-button size="small" @click="closeDialog" custom>取消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import nodeTreeService from '../data-dictionary-service.js'
import globalMixins from '@/mixins/globalMixins.js'
export default {
  name: 'dept-tree-dialog',
  mixins: [globalMixins, nodeTreeService],
  props: {
    currentKey: {
      type: [Number, String]
    },
    isShow: {
      type: Boolean
    },
    // 要隐藏显示的节点
    hideId: {
      type: [Number, String]
    }
  },
  data () {
    return {
      nodeList: []
    }
  },
  methods: {
    /**
       *  获取节点列表 回调中执行 不可选择节点下的自己及自己的子节点
       */
    getNodeListData (arr) {
      if (Array.isArray(arr) && arr.length > 0) {
        arr.forEach((v, idx) => {
          if (v.dictionaryDataId === this.hideId) {
            arr.splice(idx, 1)
            return
          }
          // 递归
          this.getNodeListData(v['children'])
        })
      }
    },
    /**
       * 弹框初始化打开事件
       */
    async dialogOpen () {
      await this.initDictionaryTree((data) => {
        let arr = data
        this.getNodeListData(arr)
        this.nodeList = arr
      })
      await this.$nextTick()
      // 选择高亮
      this.currentKey && this.$refs['nodeTreeDialog'].setCurrentKey(this.currentKey)
    },
    /**
       * 确认 - 按钮操作
       */
    confirmOperation () {
      const currentNode = this.$refs.nodeTreeDialog.getCurrentNode()
      if (!currentNode) {
        this.showMessage('未选中任何节点', 'warning')
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

<style scoped lang="postcss">
  .node-tree {
  &__tree {
     margin: 20px 0
   }
  }
</style>
