<template>
  <li class="idss-analytic-logic-line" :class="{lastChild: isLastChild}">
    <div class="idss-analytic-logic-line__item">
      <!-- 事件名称 -->
      <el-button
        class="idss-analytic-logic-line__item_button"
        :type="data.error ? 'danger' : 'primary'"
        size="small"
        :plain="activeKey !== data.key"
        round
        @click="clickItem(data)"
        @mouseover.native="isHover = true"
        @mouseout.native="isHover = false"
        :class="data.class">
        <template v-if="!$scopedSlots['line-text']">
          <!--@FIXME data数据传输对'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'解析不能解析成空 -->
          {{data.text || placehoder || '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'}}
        </template>
        <slot name="line-text" :data="data" v-else></slot>
      </el-button>
      <!-- data.addDisable控制添加按钮是否显示 -->
      <template v-if="isShowBtn">
        <idss-icon-svg name="plus" v-if="!isEmptyObject && !data.addDisable" :class="{active: isHover}" @click="addItem(data)"></idss-icon-svg>
        <idss-icon-svg name="close" class="delete" :class="{active: isHover}" @click="deleteItem(data)"></idss-icon-svg>
      </template>
    </div>
    <!-- 处理子数据 -->
    <ul v-if="data.children && data.children.length" class="idss-analytic-logic-line__list">
      <!-- @FIXME 传递scopedSlots, 不能动态判断处理，暂时该种方式处理，待好的方案 -->
      <template v-if="$scopedSlots['line-text']">
        <idss-analytic-logic-line
          v-for="item in data.children"
          :key="item.key" :data="item"
          :parentData="data"
          :rootData="rootData"
          :isAddItemImmediate="isAddItemImmediate"
          :placehoder="placehoder"
          :activeKey="activeKey"
          :isShowBtn="isShowBtn"
          v-on="$listeners">
          <template v-if="$scopedSlots['line-text']" slot="line-text" slot-scope="{data}">
            <slot name="line-text" :data="data"></slot>
          </template>
        </idss-analytic-logic-line>
      </template>
      <template v-else>
        <idss-analytic-logic-line
          v-for="item in data.children"
          :key="item.key" :data="item"
          :parentData="data"
          :rootData="rootData"
          :isAddItemImmediate="isAddItemImmediate"
          :placehoder="placehoder"
          :activeKey="activeKey"
          :isShowBtn="isShowBtn"
          v-on="$listeners">
        </idss-analytic-logic-line>
      </template>
    </ul>
  </li>
</template>

<script>
export default {
  name: 'idss-analytic-logic-line',
  props: {
    // 传输数据
    data: {
      type: Object,
      default: () => ({})
    },
    // 父级数据
    parentData: {
      type: Object,
      default: () => ({})
    },
    // 根部节点数据
    rootData: {
      type: Array,
      default: () => ([])
    },
    // 当前激活的item的key值
    activeKey: String,
    // 文本为空时 占位符
    placehoder: {
      type: String
    },
    // 是否立即添加item（针对addItem事件）
    isAddItemImmediate: {
      type: Boolean,
      default: true
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
    isLastChild () {
      const index = this.parentData.children.findIndex(item => item.key === this.data.key)
      if (index === this.parentData.children.length - 1) {
        return true
      }
      return false
    },
    isEmptyObject () {
      // 判断当前数据是否没有其他数据（text为空，只有key和pid的情况）
      const mainKeys = Object.keys(this.data).filter(item => item !== 'key' && item !== 'text' && item !== 'pId')
      if (this.data.text || mainKeys.length) {
        return false
      }
      return true
    }
  },
  methods: {
    /**
     * 点击item事件
     * @param {object} 被删除的数据
     */
    clickItem (data) {
      const index = this.parentData.children.findIndex(item => item.key === data.key)
      this.$emit('clickItem', {
        data,
        parentData: this.parentData,
        index,
        rootData: this.rootData
      })
    },
    /**
     * 为当前data数据添加子集
     * @param {object} parentData 添加子集数据的父级数据
     */
    addItem (parentData) {
      const pId = parentData.key
      const children = parentData.children
      let key = `${pId}_1`
      // 判断当前父级数据下面子集的key值
      if (children && children.length) {
        // 获取前一个节点key
        const prevIdList = children[children.length - 1].key.split('_')
        // 获取前缀
        const prevPreFix = prevIdList.slice(0, -1).join('_')
        // 得到当前添加key
        key = `${prevPreFix}_${Number(prevIdList[prevIdList.length - 1]) + 1}`
      } else {
        this.$set(parentData, 'children', [])
      }
      const newData = {
        key,
        pId
      }
      if (this.isAddItemImmediate) {
        parentData.children.push(newData)
        // 更新顶级数据
        this.$emit('update:data', this.rootData)
      }

      // 触发父级组件的addItem事件
      this.$emit('addItem', {
        data: newData,
        parentData: parentData,
        index: parentData.children.length,
        rootData: this.rootData
      })
    },
    /**
     * 删除某条数据
     * @param {object} 被删除的数据
     */
    deleteItem (data) {
      const index = this.parentData.children.findIndex(item => item.key === data.key)
      this.parentData.children.splice(index, 1)
      // 更新顶级数据
      this.$emit('update:data', this.rootData)
      // 传回父级数据、当前操作数据、当前操作数据的索引值
      this.$emit('deleteItem', {
        data,
        parentData: this.parentData,
        index,
        rootData: this.rootData
      })
    }
  }
}
</script>

<style scoped lang="postcss">
  .idss-analytic-logic-line {
  --idss-analytic-logic-color: #64aadd;
  --idss-analytic-logic-svg-color: #e6f5ff;
  --idss-analytic-logic-svg-hover-color: #009cfb;
  --idss-analytic-logic-svg-hover-fill-color: #fff;
  --idss-analytic-logic-svg-delete-hover-fill-color: #ff6c6c;

  --idss-analytic-logic-btn-analyze-border-color: #80e0ee;
  --idss-analytic-logic-btn-analyze-border-color-hover: transparent;
  --idss-analytic-logic-btn-analyze-background: #e6f9fc;
  --idss-analytic-logic-btn-analyze-background-hover: #1a9efd;
  --idss-analytic-logic-btn-analyze-text-color: #12ccd7;
  --idss-analytic-logic-btn-analyze-text-color-hover: #fff;

    border-left: 1px solid var(--idss-analytic-logic-color);
    margin-left: 20px;
    padding-top: 20px;
    position: relative;

    &.lastChild {
      border-left: none;

      &::before {
        content: '';
        display: block;
        width: 1px;
        height: 37px;
        position: absolute;
        top: 0;
        left: 0;
        border-left: 1px solid var(--idss-analytic-logic-color);
      }
    }

    &__list {
      margin-left: 20px;
      position: relative;
    }

    &__item {
      display: block;
      margin-left: 20px;
      position: relative;
      min-width: 450px;

      &:before {
        content: '';
        display: block;
        height: 10px;
        width: 20px;
        border-top: 1px solid var(--idss-analytic-logic-color);
        position: absolute;
        left: -20px;
        top: 50%;
      }

      >>> &_button {
        &.analyze.is-plain {
          border-color: var(--idss-analytic-logic-btn-analyze-border-color);
          color: var(--idss-analytic-logic-btn-analyze-text-color);
          background: var(--idss-analytic-logic-btn-analyze-background);

          &:hover {
            border-color: var(--idss-analytic-logic-btn-analyze-border-color-hover);
            color: var(--idss-analytic-logic-btn-analyze-text-color-hover);
            background: var(--idss-analytic-logic-btn-analyze-background-hover);
          }
        }
      }
    }
  }
</style>
