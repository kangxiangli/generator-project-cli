<!--
 * @Author: guozp
 * @Date: 2020-04-16 11:32:43
 * @LastEditTime: 2020-09-16 16:26:12
 * @LastEditors: guozp
 * @Description: Do not edit
 * @FilePath: /argus-fe-template/src/views/manage/base/common/organization-dialog.vue
-->
<template>
  <el-dialog
    custom
    :visible="isShow"
    title="批量授权"
    :before-close="closeDialog"
    @open="dialogOpen">
    <el-tree
      empty-text="暂无数据"
      :data="list"
      :props="treeProps"
      :expand-on-click-node="false"
      v-loading="loading['organiztion-dialog']"
      ref="organizationTree"
      :highlight-current="true"
      show-checkbox>
    </el-tree>
    <div class="el-dialog-footer idss-txt--center">
      <el-button type="primary" size="small" @click="confirmOperation" custom>确认</el-button>
      <el-button size="small" @click="closeDialog" custom>取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import globalMixins from '@/mixins/globalMixins.js'
import service from '../role-service.js'
export default {
  name: 'organization-dialog',
  mixins: [globalMixins, service],
  props: {
    isShow: {
      type: Boolean
    }
  },
  data () {
    return {
      list: [],
      treeProps: {
        children: 'children',
        label: (data, node) => {
          // 部门判断
          if (data.type === '0' && data.deptName) {
            return data.deptName
          } else if (data.type === '1' && data.userName) {
            // 判断用户
            return data.userName
          }
        }
      }
    }
  },
  methods: {
    /**
       * 弹框展开事件
       */
    async dialogOpen () {
      try {
        await this.getDeptsUsers()
      } catch (err) {
        this.showMessage(err.message, 'error')
      }
    },

    /**
       * 确认 - 按钮操作
       */
    confirmOperation () {
      const list = this.$refs.organizationTree.getCheckedNodes()
      // 过滤用户并添加用户
      const res = []
      list.map(item => {
        if (item.type === '1') {
          res.push(item.userId)
        }
      })
      if (!res || !res.length) {
        this.showMessage('未选中任何人员', 'warning')
      } else {
        this.$emit('closeDialog', false, res)
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
