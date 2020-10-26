<template>
  <div class="input-multiple">
    <template v-for="(item, inx) in value">
      <span :key="inx" >
        <span style="vertical-align: bottom;" v-if="inx !== 0">,</span>
        <el-input :placeholder="placeholder" :size="size" v-model="value[inx]"></el-input>
        <idss-icon-svg @click="removeParam()" class="svg-icon" v-if="(value.length-1) === inx" name="subtract"></idss-icon-svg>
      </span>
    </template>
    <idss-icon-svg class="svg-icon" name="plus" @click="addParam()"></idss-icon-svg>
  </div>
</template>

<script>
export default {
  name: 'input-multiple',
  data () {
    return {
      value: this.selected.split(',')
    }
  },
  watch: {
    value () {
      this.$emit('update:selected', this.value.join(','))
    }
  },
  props: {
    selected: {
      type: undefined,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    size: {
      type: String
    }
  },
  methods: {
    addParam () {
      if (this.value.length > 9) {
        this.$message({
          message: '最多配置 10 个参数, 不能再增加',
          type: 'warning'
        })
        return
      }
      this.$set(this.value, this.value.length, '')
    },
    removeParam () {
      if (this.value.length === 1) {
        this.$message({
          message: '至少需要一个参数, 不能再减少',
          type: 'warning'
        })
        return
      }
      this.value.splice(this.value.length - 1, 1)
    },
    load () {
      this.value = this.selected.split(',')
      if (!this.selected) {
        this.addParam()
        this.addParam()
      }
    }
  },
  mounted () {
    this.load()
  }
}
</script>

<style scoped lang="postcss">
%normal-input{
  border: 0;
  color: #22A5F7;
  background: transparent;
  padding: 0;
  text-align: center;
  border-bottom: 1px solid #22A5F7;
  font-size: 1.4rem;
  display: inline-block;
}
.input-multiple{
  position: relative;
  >>> .el-input{
    max-width: 60px;
  }
  >>> .el-input__inner{
    @extend %normal-input;
  }
  .svg-icon{
    border-radius: 50%;
    border: 1px solid #333;
    padding: 2px;
    cursor: pointer;
  }
  .svg-icon:hover{
    border-color:#22A5F7;
    fill:#22A5F7;
  }
}
</style>
