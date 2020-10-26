<template>
  <div class="idss-form-tag">
    <el-tag
      :size="size"
      v-for="item in inputTagList"
      :key="item"
      closable
      :disable-transitions="false"
      @close="handleTagClose(item)">{{item}}</el-tag>
    <el-input
      class="input-add-tag"
      v-if="inputTagVisible"
      v-model="inputTagValue"
      ref="saveTagInput"
      :size="size"
      @keyup.enter.native="handleTagInputConfirm"
      @blur="handleTagInputConfirm"></el-input>
    <el-button v-else class="button-add-tag" :size="size" @click="showTagInput">
      <idss-icon-svg name="plus"></idss-icon-svg>
      <span>{{text}}</span>
    </el-button>
  </div>
</template>
<script>
export default {
  name: 'idss-form-tag',
  watch: {
    selected: {
      handler: function (val, oldVal) {
        this.$emit('validate', val, oldVal)
        this.load()
      }
    }
  },
  props: {
    selected: {
      type: undefined,
      default: ''
    },
    mapping: {     // @特殊处理, 数据每项返回结果是object, mapping为对应的key值, 例: [{name: 'xxx'}, {name: 'yyy'}]
      type: String,
      default: ''
    },
    text: {
      type: String,
      default: '添加标签'
    },
    size: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      // 模式
      pattern: 'Array',  // Array = 数组, String = 字符串(逗号分隔),
      // 添加标签
      inputTagList: [],
      inputTagVisible: false,
      inputTagValue: ''
    }
  },
  methods: {
    clone (obj) {
      return JSON.parse(JSON.stringify(obj))
    },
    // 设置映射
    setMapping (arr) {
      if (this.mapping) {
        return arr.map(v => {
          let obj = {}
          obj[this.mapping] = v
          return obj
        })
      }
      return arr
    },
    // 拆解映射
    getMapping (arr) {
      if (this.mapping) {
        return arr.map(v => v[this.mapping])
      }
      return arr
    },
    // 设置模式
    setPattern () {
      this.pattern = Array.isArray(this.selected || []) ? 'Array' : 'String'
    },
    // 删除标签
    handleTagClose (tag) {
      this.inputTagList.splice(this.inputTagList.indexOf(tag), 1)
      // 同步修改
      this.syncData()
    },
    // 新增标签 - 切换状态
    showTagInput () {
      this.inputTagVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 新增标签 - 添加
    handleTagInputConfirm () {
      let val = this.inputTagValue
      if (val) {
        this.inputTagList.push(val)
        // 同步修改
        this.syncData()
      }
      this.inputTagVisible = false
      this.inputTagValue = ''
    },
    // 同步数据
    syncData () {
      if (this.pattern === 'Array') {
        this.$emit('update:selected', this.setMapping(this.clone(this.inputTagList)))
      } else {
        this.$emit('update:selected', this.clone(this.inputTagList.join(',')))
      }
    },
    load () {
      this.setPattern()
      if (this.pattern === 'Array') {
        this.inputTagList = this.getMapping(this.clone(this.selected || []))
      } else {
        let arr = this.selected ? this.selected.split(',') : []
        this.inputTagList = this.clone(arr)
      }
    }
  },
  mounted () {
    this.load()
  }
}
</script>
<style lang="postcss">
.idss-form-tag {
  & .el-tag {
    cursor: pointer;
  }
  & .el-tag + .el-tag {
    margin-left: 5px;
  }
  & .el-tag + .button-add-tag {
    margin-left: 5px;
    vertical-align: inherit;
  }
  & .input-add-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
}
</style>
