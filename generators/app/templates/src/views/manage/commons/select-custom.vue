<template>
  <el-select ref="reference" :popper-append-to-body="false" :size="size" class="select-custom" popper-class="select-custom-popper" v-model="value" clearable placeholder="请选择">
    <el-option label="且" value="&&"></el-option>
    <el-option label="或" value="||"></el-option>
  </el-select>
</template>

<script>
export default {
  name: 'select-custom',
  data () {
    return {
      value: this.selected
    }
  },
  watch: {
    selected (newVal) {
      this.value = newVal
    },
    value (newVal) {
      this.$emit('update:selected', newVal)
    }
  },
  props: {
    selected: String,
    size: {
      type: String,
      default: 'mini'
    }
  }
}
</script>

<style scoped lang="postcss">
%normal-select{
  border: 0;
  color: #22A5F7;
  background: transparent;
  padding: 0;
  text-align: center;
  width: 30px;
  border-bottom: 1px solid #22A5F7;
  font-size: 1.4rem;
}
.select-custom{
  position: relative;
  >>> .el-input__inner{
    @extend %normal-select;
  }
  >>> .el-input__suffix{
    display: none;
  }
  >>> .select-custom-popper{
    margin: 0;
    left: 0 !important;
    top: 30px !important;
    .el-select-dropdown__list{
      padding: 0;
    }
    .el-select-dropdown__item{
      font-size: 1.2rem;
      line-height: 20px;
      height: 20px;
      padding: 0 0;
      text-align: center;
    }
  }
}
</style>
