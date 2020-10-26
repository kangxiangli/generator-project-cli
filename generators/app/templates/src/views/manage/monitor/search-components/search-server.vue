<template>
  <!-- 手工搜索 -->
  <el-form :inline="true" ref="form" class="search-server">
    <el-form-item label="IP:" class="select-template" label-width="20px" size="small">
      <el-select
        v-model="selectCurrent"
        multiple
        placeholder="请选择">
        <el-option
          v-for="item in selectList"
          :key="item.ip"
          :label="item.ip"
          :value="item.ip">
          <el-tooltip
            :content="`${item.ip}(${item.hostName})`"
            placement="top-start"
            effect="dark">
            <span class="ip-content">{{ item.ip }}({{ item.hostName }})</span>
          </el-tooltip>
        </el-option>
      </el-select>
      <el-button size="medium" custom @click="search" type="primary">查询</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
export default {
  name: 'search-server',
  watch: {
  },
  data () {
    return {
      // 下拉列表
      selectList: [],
      selectCurrent: []
    }
  },
  methods: {
    search () {
      this.selectList.forEach(v => {
        v.checked = this.selectCurrent.includes(v.ip) ? 1 : 0
      })
      this.$emit('search', this.selectList, this.selectCurrent)
    }
  }
}
</script>
<style scoped lang="postcss">
  .search-server {
    & .select-template {
      >>> .el-select {
        display: inline-block;
        width: 400px;
      }
    }
  }
  .ip-content {
    display: inline-block;
    width: 95%;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
</style>
