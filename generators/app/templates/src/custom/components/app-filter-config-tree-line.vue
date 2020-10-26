<template>
  <div>
    <!-- 如果是数组，说明不是根节点 -->
    <template v-if="Array.isArray(configList)">
      <template v-for="filter in configList">
        <!-- group rule -->
        <div v-if="Array.isArray(filter.children)"
          :key="filter.id">
          <div class="idss-insight-config__filter__row">
            <el-select size='medium' v-model="filter.ruleType">
              <el-option value='AND' label='AND Rule' />
              <el-option value='OR' label='OR Rule' />
            </el-select>
            <!-- 插入过滤器规则 -->
            <insert-rule @command="type => insertRule(type, filter, configList)"></insert-rule>
          </div>
          <div class='idss-insight-config__filter__row__box'>
            <!-- 递归调用 -->
            <app-filter-config-tree-line
              :filter-data.sync="filter.children"
              :rules-kv="rulesKv"
              :filter-rules="filterRules" />
          </div>
        </div>
        <!-- 单个 rule -->
        <div v-else
          class="idss-insight-config__filter__row"
          :key="filter.id">
          <!-- 选择字段 -->
          <el-select placeholder='请选择字段'
            filterable
            v-model="filter.field"
            @change="fieldCHangeHandle(filter)"
            :filter-method="elSelectFilterHandle"
            size='medium'>
            <el-option v-for="item in filterRulesOption" :key="item.field + item.name + item.individualValueText" :label="item.name" :value="item.field">
              <el-tooltip
                :content="item.name"
                placement="top-start"
                effect="dark">
                <span>{{item.field}}</span>
              </el-tooltip>
            </el-option>
          </el-select>
          <!-- 选择运算符 -->
          <el-select v-if="filter.field"
            v-model="filter.operator"
            @change="operatorChangeHandle(filter)"
            size="medium">
            <el-option v-for="(value, operator) in rulesKv[filter.field]['operators']"
              :key="operator" :value="operator" />
          </el-select>
          <!-- 输入值 -->
          <filter-input
            v-if="!['isNull', 'isNotNull'].includes(filter.operator)"
            v-model="filter.value"
            :type="filter.elementType"
            :dictionary-key="rulesKv[filter.field] && rulesKv[filter.field]['dictionary']" />
          <!-- 插入过滤器规则 -->
          <insert-rule rule @command="type => insertRule(type, filter, configList)"></insert-rule>
        </div>
      </template>
    </template>
    <!-- 当 configList 为对象时，表示为跟节点 -->
    <template v-else>
      <div class="idss-insight-config__filter__row">
        <el-select v-model="configList.ruleType" size="medium">
          <el-option value='AND' label='AND Rule'></el-option>
          <el-option value='OR' label='OR Rule'></el-option>
        </el-select>
        <!-- 插入过滤器规则 -->
        <el-dropdown trigger='click' @command="type => insertRule(type, configList)">
          <el-button type='text' class='el-dropdown-link'>
            插入过滤器<i class='el-icon-arrow-down el-icon--right' />
          </el-button>
          <el-dropdown-menu slot='dropdown'>
            <el-dropdown-item disabled>Rule</el-dropdown-item>
            <el-dropdown-item divided command="insert-inside-rule">insert inside</el-dropdown-item>
            <el-dropdown-item disabled>Group Rule</el-dropdown-item>
            <el-dropdown-item divided command="insert-inside-group">insert inside</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div class='idss-insight-config__filter__row__box'>
        <!-- 递归调用 -->
        <app-filter-config-tree-line
          :filter-data.sync="configList.children"
          :rules-kv="rulesKv"
          :filter-rules="filterRules" />
      </div>
    </template>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import { DASHBOARD } from '@/store/type'
// 输入表单
const FilterInput = {
  props: {
    type: String,
    dictionaryKey: String,
    value: [Object, Array, String, Number]
  },
  computed: {
    ...mapState('dashboard', ['dictionary']),
    // 获取对应的类型下的数据
    getList () {
      if (!this.dictionary[this.type]) {
        return []
      }
      return this.dictionary[this.type][this.dictionaryKey] || []
    }
  },
  data () {
    return {
      treeVisible: false,
      selectedName: []
    }
  },
  methods: {
    confrim () {
      // 筛选出不是父节点的
      const selected = this.$refs.tree.getCheckedNodes().filter(val => val.type !== 'group')
      // name 用于界面展示
      this.selectedName = selected.map(val => val.name)
      // keys 用于存储后台
      const Keys = this.$refs.tree.getCheckedNodes().filter(val => val.type !== 'group').map(val => val.key)
      this.$emit('input', Keys)
      this.treeVisible = false
    }
  },
  render () {
    switch (this.type) {
      case 'input':
      case 'input-str':
        return <el-input size='medium' value={this.value} onInput={val => this.$emit('input', val)} />
      case 'input-int':
      case 'input-long':
      case 'input-number':
        return <el-input-number size='medium' value={this.value} onInput={val => this.$emit('input', val)} />
      case 'radio':
      case 'checkbox':
        return <el-select size='medium'
          // filterable={this.getList.length > 0}
          multiple={this.type === 'checkbox'}
          value={this.value}
          onInput={val => this.$emit('input', val)}>
          {
            this.getList.map(val => {
              return <el-option key={val.key} value={val.key} label={val.name} />
            })
          }
        </el-select>
      case 'tree':
        return <div>
          <el-dialog
            csutom
            close-on-press-escape={false}
            close-on-click-modal={false}
            show-close={false}
            visible={this.treeVisible}
            {...{ on: { 'update:visible': val => { this.treeVisible = val } } }}
            append-to-body>
            <span slot="title">请选择值</span>
            <div style='height: 300px;' v-iscroll>
              <el-tree
                data={this.getList}
                default-checked-keys={this.value}
                default-expanded-keys={this.value}
                show-checkbox
                node-key='key'
                ref='tree'
                highlight-current
                props={{
                  children: 'children',
                  label: 'name'
                }} />
            </div>
            <div class='idss-insightConfig__filter__footer'>
              <el-button custom size="medium" onClick={this.confrim}>确认</el-button>
            </div>
          </el-dialog>
          <el-button type='text' onClick={() => { this.treeVisible = true }}>
            {this.selectedName.length > 0 ? this.selectedName.join(',') : '点击选择数据'}
          </el-button>
        </div>
      case 'datetime':
        return <el-date-picker
          size='medium'
          value={this.value}
          onInput={val => this.$emit('input', val)}
          type='datetime'
          value-format='timestamp'
          placeholder='选择日期时间' />
    }
  }
}
// 插入添加选项
const InsertRule = {
  props: {
    rule: Boolean
  },
  methods: {
    command (type) {
      this.$emit('command', type)
    }
  },
  render () {
    return <el-dropdown trigger='click' onCommand={this.command}>
      <el-button type='text' class='el-dropdown-link'>
        插入过滤器<i class='el-icon-arrow-down el-icon--right' />
      </el-button>
      <el-dropdown-menu slot='dropdown'>
        <el-dropdown-item disabled>Rule</el-dropdown-item>
        <el-dropdown-item command='insert-before-rule' divided>insert before</el-dropdown-item>
        <el-dropdown-item command='insert-after-rule'>insert after</el-dropdown-item>
        {!this.rule && <el-dropdown-item command='insert-inside-rule'>insert inside</el-dropdown-item>}
        <el-dropdown-item disabled>Group Rule</el-dropdown-item>
        <el-dropdown-item command='insert-before-group' divided>insert before</el-dropdown-item>
        <el-dropdown-item command='insert-after-group'>insert after</el-dropdown-item>
        {!this.rule && <el-dropdown-item command='insert-inside-group'>insert inside</el-dropdown-item> }
        <el-dropdown-item command='delete' divided>delete</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  }
}

export default {
  name: 'app-filter-config-tree-line',
  components: { FilterInput, InsertRule },
  props: {
    filterRules: Array,
    filterData: [Array, Object],
    rulesKv: Object
  },
  computed: mapState('dashboard', ['dictionary']),
  data () {
    return {
      configList: this.filterData,
      filterRulesOption: this.filterRules
    }
  },
  watch: {
    filterData: {
      deep: true,
      handler (newVal) {
        this.configList = newVal
      }
    }
  },
  methods: {
    // element 的 select 组件 自定义搜索方法
    elSelectFilterHandle (keyword) {
      this.filterRulesOption = this.filterRules.filter(val => {
        // 搜索 field 字段与 name 字段
        return val.field.indexOf(keyword) > -1 || val.name.indexOf(keyword) > -1
      })
    },
    // 字段 changge 方法
    fieldCHangeHandle (filter) {
      const rule = this.rulesKv[filter.field]
      const fristKey = Object.keys(rule['operators'])[0]
      filter.dataType = rule.type
      // 设置第一个为 运算符为默认值
      filter.operator = fristKey
      // 设置数据类型
      filter.elementType = rule['operators'][fristKey]
      // 清空已选的值
      if (['tree', 'checkbox'].includes(filter.elementType)) {
        filter.value = []
      } else {
        filter.value = ''
      }
      this.getDictionary(filter.elementType, rule.dictionary)
    },
    // 运算符 change 方法
    operatorChangeHandle (filter) {
      const rule = this.rulesKv[filter.field]
      // 设置数据类型
      filter.elementType = rule.operators[filter.operator]
      // 清空已选的值
      if (['tree', 'checkbox'].includes(filter.elementType)) {
        filter.value = []
      } else {
        filter.value = ''
      }
      this.getDictionary(filter.elementType, rule.dictionary)
    },
    // 获取对应的字典，并缓存到 vuex 中
    async getDictionary (type, dictionaryKey) {
      if (!(type && dictionaryKey && ['tree', 'radio', 'checkbox'].includes(type))) {
        return
      }
      // 如果没有值，通过 action 请求
      if (!(this.dictionary[type] && this.dictionary[type][dictionaryKey])) {
        await this.pushDictionary({
          key: dictionaryKey,
          type
        })
      }
    },
    // 插入规则
    insertRule (type, data, parent) {
      const index = parent ? parent.indexOf(data) : undefined
      const groupRule = {
        key: Date.now(),
        ruleType: 'AND',
        children: []
      }
      const rule = {
        key: Date.now(),
        elementType: '',
        field: '',
        operator: '',
        value: ''
      }
      switch (type) {
        case 'insert-before-rule':
          parent.splice(index, 0, rule)
          break
        case 'insert-after-rule':
          parent.splice(index + 1, 0, rule)
          break
        case 'insert-inside-rule':
          data.children.push(rule)
          break
        case 'insert-before-group':
          parent.splice(index, 0, groupRule)
          break
        case 'insert-after-group':
          parent.splice(index + 1, 0, groupRule)
          break
        case 'insert-inside-group':
          data.children.push(groupRule)
          break
        case 'delete':
          parent.splice(index, 1)
          break
      }
    },
    ...mapActions('dashboard', {
      pushDictionary: DASHBOARD.DICTIONARY
    })
  },
  created () {
    // 检验依赖的数据是否已缓存
    this.configList.forEach && this.configList.forEach(val => {
      if (!Array.isArray(val.children) && val.field) {
        const rule = this.rulesKv[val.field]
        this.getDictionary(val.elementType, rule.dictionary)
      }
    })
  }
}
</script>
<style>
.idss-insight-config__filter__row__box {
  margin-left: 20px;
}
</style>
