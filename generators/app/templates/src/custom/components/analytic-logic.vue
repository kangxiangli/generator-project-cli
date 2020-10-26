<template>
  <div
    class="idss-analytic-logic">
    <!-- @FIXME scorll 滚动条只能监听一个子节点，故添加该div -->
    <el-scrollbar :style="{width: width, height: height}">
      <div class="idss-analytic-logic_root">
        <el-button type="primary" size="small"
          round
          @mouseover.native="isHover = true"
          @mouseout.native="isHover = false">{{rootName}}</el-button>
        <!-- add button -->
        <idss-icon-svg v-if="isShowBtn" :class="{active: isHover}" name="plus" class="icon" @click="addRootItem"></idss-icon-svg>
      </div>
      <ul class="idss-analytic-logic__list">
        <!-- @FIXME 传递scopedSlots, 不能动态判断处理，暂时该种方式处理，待好的方案 -->
        <template v-if="$scopedSlots['line-text']">
          <idss-analytic-logic-line
            v-for="item in data"
            :key="item.key"
            :data="item"
            :parentData="rootData"
            :rootData="data"
            :isAddItemImmediate="isAddItemImmediate"
            :isShowBtn="isShowBtn"
            v-bind="$attrs"
            v-on="$listeners">
            <template slot="line-text" slot-scope="{data}">
              <slot name="line-text" :data="data"></slot>
            </template>
          </idss-analytic-logic-line>
        </template>
        <template v-else>
          <idss-analytic-logic-line
            v-for="item in data"
            :key="item.key"
            :data="item"
            :parentData="rootData"
            :rootData="data"
            :isAddItemImmediate="isAddItemImmediate"
            :isShowBtn="isShowBtn"
            v-bind="$attrs"
            v-on="$listeners">
          </idss-analytic-logic-line>
        </template>
      </ul>
    </el-scrollbar>
  </div>
</template>

<script>
import idssAnalyticLogicLine from './analytic-logic-line.vue'
export default {
  name: 'idss-analytic-logic',
  props: {
    // 根节点名称
    rootName: {
      type: String,
      default: '事件触发'
    },
    // 传输数据
    data: {
      type: Array,
      default: () => ([])
    },
    // 是否立即添加item（针对addItem事件）
    isAddItemImmediate: {
      type: Boolean,
      default: true
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '100%'
    },
    // 是否显示操作按钮 默认显示
    isShowBtn: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      isHover: false
    }
  },
  computed: {
    rootData () {
      return {
        key: '0',
        name: 'root',
        children: this.data
      }
    }
  },
  components: {
    idssAnalyticLogicLine
  },
  methods: {
    /**
     * 添加根节点的item
     */
    addRootItem () {
      const id = `${this.data.length + 1}`
      const newData = {
        key: id,
        pId: '0'
      }
      if (this.isAddItemImmediate) {
        this.data.push(newData)
        // 更新顶级数据
        this.$emit('update:data', this.data)
      }
      this.$nextTick(() => {
        // 触发父级组件的addItem事件
        this.$emit('addItem', {
          data: newData,
          parentData: this.rootData,
          index: this.data.length,
          rootData: this.data
        })
      })
    }
  }
}
</script>

<style scoped lang="postcss">
  .idss-analytic-logic {

    &__list {
      margin-left: 20px;
      position: relative;
    }

    & >>> .idss-svg-icon {
      box-sizing: content-box;
      width: 12px;
      height: 12px;
      padding: 3px;
      fill: var(--idss-analytic-logic-svg-color);
      border: 1px solid var(--idss-analytic-logic-svg-color);
      border-radius: 50%;
      margin-left: 10px;
      vertical-align: -0.4em;

      &:hover,&.active {
        border: 1px solid transparent;
        fill: var(--idss-analytic-logic-svg-hover-fill-color);
        background: var(--idss-analytic-logic-svg-hover-color);
      }
      &.delete:hover,&.delete.active {
        fill: var(--idss-analytic-logic-svg-hover-fill-color);
        background: var(--idss-analytic-logic-svg-delete-hover-fill-color);
      }
    }

  }
</style>
