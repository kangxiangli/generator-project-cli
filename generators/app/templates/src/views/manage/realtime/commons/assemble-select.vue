<template>
  <el-select v-model="currentSelect" multiple collapse-tags style="width: 100%;" popper-class="realtime-source-select" @visible-change="selectVisibleChange">
    <el-tabs v-model="eventType" type="border-card" stretch>
      <el-tab-pane label="分类日志" name="single"></el-tab-pane>
      <el-tab-pane label="内部事件" name="inner"></el-tab-pane>
    </el-tabs>
    <div class="realtime-source-select-list">
      <template>
        <el-option
          @click.native="optionClick(item)"
          v-show="eventType === 'single'"
          v-for="item in singleList"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </template>
      <template>
        <el-option
          @click.native="optionClick(item)"
          v-show="eventType === 'inner'"
          v-for="item in innserList"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </template>
    </div>
  </el-select>
</template>
<script>
// 先看这里。所有的数据在一个eventList里面返回的(后台接口都放一起了)，以 type 字段区分为 inner(内部事件)、single(分类日志)
// 所以这个组件实现的思路是 以两个类别的 el-option 来实现的。
// 比如选择了 inner 一类的，再次选 single 会把 inner 选择的清空掉，反之亦然。
export default {
  name: 'source-select',
  props: {
    eventList: {
      type: Array,
      default () {
        return []
      }
    },
    selected: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      currentSelect: [],
      // 记录当前以选择的类别(inner 或者 single)
      currentSelectType: '',
      // 当前的事件类别
      eventType: 'single'
    }
  },
  watch: {
    selected: {
      immediate: true,
      handler (val) {
        if (!val) {
          // 如果为空了 只清空选中的事件列表。eventType还保持上次操作的或者默认的
          this.currentSelect = []
          return
        }
        if (this.currentSelect.join(',') === val) {
          // 由组件本身触发的更新，不操作
          return
        }
        const selectedList = val === '' ? [] : val.split(',')
        // 将所有的id都转换为数字再给 currentSelect (因为eventList中的id都是数字)
        this.currentSelect = selectedList.map(val => +val)
        // 获取第一个事件id
        const firstId = +this.currentSelect[0]
        this.currentSelectType = this.eventType = (this.eventList.find(item => item.id === firstId) || {})['type'] || 'single'
      }
    },
    currentSelectType (val) {
      setTimeout(() => {
        // 事件类别发生变化后 先更新一下选中的数据，否则 change 事件中用到的数据还是老数据
        this.$emit('update:selected', this.currentSelect.join(','))
        this.$emit('change', val)
      }, 0)
    }
  },
  computed: {
    innserList () {
      return this.eventList.filter(val => val.type === 'inner')
    },
    singleList () {
      return this.eventList.filter(val => val.type === 'single')
    }
  },
  methods: {
    // 下拉框显示隐藏事件，当visible = false 时说明已选择完毕，通知父组件更新（因为是多选 所以如果watch currentSelect的话太频繁）
    selectVisibleChange (visible) {
      this.$emit('update:selected', this.currentSelect.join(','))
    },
    optionClick (item) {
      if (this.currentSelect.length <= 0) {
        return
      }

      if (this.currentSelectType === '') {
        this.currentSelectType = item.type
      } else {
        // 如果当前选择的事件类型与已选择的类型不一致，说明tab类型切换了，清空 只放入当前点击的
        if (item.type !== this.currentSelectType) {
          this.currentSelect = [item.id]
          this.currentSelectType = item.type
        }
      }
    }
  }
}
</script>
<style lang="postcss">
.realtime-source-select{
  & ul.el-select-dropdown__list {
    padding: 0;
  }
  & .el-tabs {

    border-top: none;
    border-bottom: none;
    box-shadow: none;

    position: absolute;
    width: 100%;
    top: 0;
    z-index: 1;

    & .el-tabs__content {
      display: none;
    }
  }

  & .realtime-source-select-list{
    margin-top: 40px;
  }
}
</style>
