<template>
  <div class="time-range-custom">
    <el-time-select
      :size="size"
      :editable="false"
      :clearable="false"
      v-model="value[0]"
      placeholder='开始时间'
      :picker-options="{
        start: '00:00',
        step: '00:15',
        end: '23:45',
        maxTime: value[1]
      }"></el-time-select>
    <el-time-select
      :size="size"
      :editable="false"
      :clearable="false"
      v-model="value[1]"
      placeholder='结束时间'
      :picker-options="{
        start: '00:00',
        step: '00:15',
        end: '23:45',
        minTime: value[0]
      }"></el-time-select>
  </div>
</template>

<script>
export default {
  name: 'time-range-custom',
  data () {
    return {
      value: this.selected
    }
  },
  watch: {
    value () {
      this.$emit('update:selected', this.value)
    }
  },
  props: {
    selected: {
      type: undefined,
      default: ''
    },
    size: {
      type: String
    }
  },
  methods: {
    load () {
      if (!this.selected) {
        this.value = ['', '']
      } else {
        this.value = this.selected
      }
    }
  },
  mounted () {
    this.load()
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
      line-height: 25px;
      height: 25px;
      padding: 0 0;
      text-align: center;
    }
  }
}
</style>
