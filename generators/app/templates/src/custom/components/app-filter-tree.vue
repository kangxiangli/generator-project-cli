<template>
  <div class="idss-insight-config__filter">
    <div class="idss-insight-config__filter__tree">
      <div style="height: 300px;" v-iscroll>
        <div class="idss-insight-config__filter__tree__container">
          <filter-tree :filter-data.sync="filterData" :rules-kv="rulesKv" :filter-rules="filterRules"></filter-tree>
        </div>
      </div>
    </div>
    <div class="idss-insight-config__filter__footer">
      <el-button custom size="medium" type="primary" @click="confrimHandle">确认</el-button>
      <el-button custom size="medium" @click="cancelHandle">取消</el-button>
    </div>
  </div>
</template>
<script>
import FilterTree from './app-filter-config-tree-line.vue'
import formatSQL from '../utils/generate-sql.js'

export default {
  name: 'idss-filter-tree',
  components: { FilterTree },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    // sql 语句
    expression: String,
    // 配置的 json
    expressionJson: {
      type: String,
      default: '{"ruleType":"AND","children":[]}'
    },
    filterRules: {
      type: Array,
      default () { return [] }
    }
  },
  watch: {
    filterRules: {
      deep: true,
      handler (newVal) {
        this.rulesKv = {}
        newVal.forEach(val => {
          this.rulesKv[val.field] = val
        })
      }
    }
  },
  data () {
    const rulesKv = {}
    // 格式化过滤器的字段规则, key value 格式
    this.filterRules.forEach(val => {
      rulesKv[val.field] = val
    })
    return {
      rulesKv,
      // 用户选择的过滤器配置
      filterData: JSON.parse(this.expressionJson)
    }
  },
  methods: {
    cancelHandle () {
      this.hiddenDialog()
      this.filterData = JSON.parse(this.expressionJson)
    },
    confrimHandle () {
      const configJSON = JSON.stringify(this.filterData)
      this.$emit('update:expressionJson', configJSON)
      this.$emit('update:expression', formatSQL(this.filterData))
      this.hiddenDialog()
    },
    hiddenDialog () {
      this.$emit('update:visible', false)
    }
  }
}
</script>
<style lang="postcss">
.idss-insight-config__filter__tree {
  height: 300px;

  & .idss-insight-config__filter__tree__container{
    padding-right: 10px;
    padding-bottom: 10px;
  }
}
.idss-insight-config__filter__row {
  min-width: 700px;
  display: flex;
  align-items: center;

  & > .el-select:nth-child(1) {
    width: 25%;
    flex-shrink: 0;
    flex-grow: 0;
  }

  & > .el-select:nth-child(2) {
    width: 15%;
    flex-shrink: 0;
    flex-grow: 0;
  }

  & > * {
    margin-right: 10px;
  }
}
.idss-insight-config__filter__footer {
  margin-top: 12px;
  text-align: center;
}
</style>
