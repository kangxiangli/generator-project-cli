<template>
  <div class="idss-tree-select">
    <el-popover
      placement="bottom"
      popper-class="idss-tree-select-panel"
      :width="popoverWidth"
      :visible-arrow="false"
      @show="show"
      @hide="hide"
      trigger="click">
      <!--面板里面的tree -->
      <el-tree
        ref="tree"
        :data="treeData"
        :show-checkbox="true"
        :node-key="defaultProps.id"
        :props="defaultProps"
        @check="checkChange"
        :check-on-click-node="true"
        :check-strictly="true"
        :expand-on-click-node="false"
        :default-expanded-keys="defaultExpandedKeys"
        :default-checked-keys="this.pattern === 'single' ? [this.selected] : this.selected">
      </el-tree>
      <el-button
        slot="reference"
        class="idss-tree-select-btn"
        :class="{active: active}"
        :style="{width: typeof width === 'number' ? width + 'px' : width}">
        <!-- 选中标签 -->
        <div v-if="checkedNodes.length > 0" class="tag-group">
          <el-tag
            v-for="item in checkedNodes"
            :key="item[defaultProps.id]"
            size="small"
            type="info"
            closable
            :disable-transitions="true"
            @close="handleTagClose(item)">{{ item[defaultProps.label] }}</el-tag>
        </div>
        <!-- 为空的提示文字 -->
        <div v-else class="placeholder">
          {{ placeholder }}
        </div>
        <!-- 小箭头 -->
        <span class="el-input__suffix">
          <span class="el-input__suffix-inner">
            <i class="el-select__caret el-input__icon el-icon-arrow-up" :class="{'is-reverse': active}"></i>
          </span>
        </span>
      </el-button>
    </el-popover>
  </div>
</template>
<script>
export default {
  name: 'idss-tree-select',
  watch: {
    // 监听父组件 传递的data变化，更新数据
    data: {
      deep: true,
      handler: function () {
        this.load()
      }
    },
    selected: {
      handler: function (val, oldVal) {
        this.$emit('validate', val, oldVal)
        this.changeSelected(val)
      }
    }
  },
  computed: {
  },
  props: {
    width: {
      type: undefined,
      default: '100%'
    },
    data: {
      type: Array,
      default () { return [] }       // // treeData
    },
    selected: {
      type: undefined,
      default: ''       // single = 单值, selection = 数组
    },
    defaultProps: {
      type: Object,     // el-tree的字段映射
      default: () => {
        return {
          id: 'id',
          children: 'children',
          label: 'label'
        }
      }
    },
    placeholder: {
      type: String,
      default: '请输入'
    }
  },
  data () {
    return {
      // 弹框宽度
      popoverWidth: '',
      // 数据
      treeData: [],
      // 模式
      pattern: 'single',  // single = 单选, selection = 多选,
      // 按钮选中
      active: false,
      // 选中列表
      activeList: [],
      // 默认展开
      defaultExpandedKeys: [],
      // 选中节点
      checkedNodes: []
    }
  },
  methods: {
    setPopoverWidth () {
      if (!this.popoverWidth) {
        let width = this.$el.querySelector('.idss-tree-select-btn').clientWidth
        this.popoverWidth = width
      }
    },
    show () {
      // 显示动态指定高度
      this.setPopoverWidth()
      this.active = true
    },
    hide () {
      this.active = false
    },
    // 转换数据
    setAttribute (arr) {
      if (Array.isArray(arr) && arr.length > 0) {
        for (let v of arr) {
          // 如果是组类型, 则禁用
          if (Array.isArray(v[this.defaultProps.children]) && v[this.defaultProps.children].length > 0) {
            // this.$set(v, 'disabled', true)
            this.defaultExpandedKeys.push(v[this.defaultProps.id])
            // 递归
            this.setAttribute(v[this.defaultProps.children])
          }
        }
      }
    },
    // 设置模式 单选 多选
    setPattern () {
      this.pattern = Array.isArray(this.selected) ? 'selection' : 'single'
    },
    // tree 选中事件
    checkChange (node, checkedObj) {
      if (this.pattern === 'single') {
        this.$refs.tree.setCheckedKeys([node[this.defaultProps.id]])
        this.$emit('update:selected', node[this.defaultProps.id])
      } else {
        this.$refs.tree.setCheckedKeys(checkedObj.checkedKeys)
        let ids = this.$refs.tree.getCheckedKeys()
        this.$emit('update:selected', ids)
      }
      this.checkedNodes = this.$refs.tree.getCheckedNodes()
    },
    // 删除选中
    handleTagClose (tag) {
      if (this.pattern === 'single') {
        this.$refs.tree.setCheckedKeys([])
        this.$emit('update:selected', '')
        this.checkedNodes = this.$refs.tree.getCheckedNodes()
      } else {
        let ids = this.$refs.tree.getCheckedKeys()
        ids.splice(ids.indexOf(tag[this.defaultProps.id]), 1)
        this.checkChange(tag, { checkedKeys: ids })
      }
    },
    // 切换选中
    changeSelected (val) {
      let keys
      if (this.pattern === 'single') {
        keys = val ? [val] : []
      } else {
        keys = Array.isArray(val) ? val : []
      }
      this.$refs.tree.setCheckedKeys(keys)
      this.$nextTick(_ => {
        this.checkedNodes = this.$refs.tree.getCheckedNodes()
      })
    },
    load () {
      this.treeData = JSON.parse(JSON.stringify(this.data))
      this.setPattern()
      this.defaultExpandedKeys = []
      this.checkedNodes = this.$refs.tree.getCheckedNodes()
      // 设置禁用 & 展开 - 递归
      this.setAttribute(this.treeData)
      // 设置选中
      this.changeSelected(this.selected)
    }
  },
  mounted () {
    // 显示动态指定高度
    this.setPopoverWidth()
    this.load()
  }
}
</script>
<style lang="postcss" scoped>
  .idss-tree-select {
    --select-cover-color: #606266;
    --select-cover-border-color: #dcdfe6;
    --select-hover-color: #409eff;
    --select-txt-color: #c4c8cf;
    position: relative;
    & .idss-tree-select-btn {
      height: auto;
      white-space: inherit;
      text-align: left;
      padding: 0 5px 0;
      position: relative;
    }
    & .idss-tree-select-btn:focus,
    & .idss-tree-select-btn:hover {
      color: var(--select-cover-color);
      border: 1px solid var(--select-cover-border-color);
      background: #fff;
    }
    & .idss-tree-select-btn.active,
    & .idss-tree-select-btn:hover {
      border-color: var(--select-hover-color);
    }
    & .idss-tree-select-btn .tag-group {
      padding-top: 4px;
      box-sizing: border-box;
    }
    & .idss-tree-select-btn .el-tag {
      margin: 0 2px 4px;
    }
    & .idss-tree-select-btn .placeholder {
      height: 32px;
      line-height: 32px;
      padding-left: 10px;
      font-size: 13px;
      font-weight: 400;
      color: var(--select-txt-color);
    }
    & .idss-tree-select-btn .el-select__caret {
      color: #c0c4cc;
      font-size: 14px;
      transition: transform .3s;
      transform: rotate(180deg);
      line-height: 16px;
      cursor: pointer;
    }
    & .idss-tree-select-btn .el-select__caret.is-reverse {
      transform: rotate(0);
    }

    .idss-tree-select-panel {
    }

  }
</style>
