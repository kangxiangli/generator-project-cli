<template>
  <div class="conditional-statement-template">
    <div class="item-div">
      <template v-for="(item, index) in handleTemplate(sentence.template)">
        <span :key="index">
          {{item}}
          <template v-if="sentence.params[index]">
            <template v-if="sentence.params[index].type === 'tree'">
              <!-- 如果是数组说明是过滤条件模式，否则是关联关系模式【双字段处理】 -->
              <template v-if="Array.isArray(filedDicts)">
                <idss-select-tree-filter
                  class='transparent'
                  :data='fileDataByType(sentence.params[index].dataType)'
                  :selected.sync="data[sentence.params[index].value]"
                  size="small"
                  :defaultProps="{
                    children: 'children',
                    label: 'name',
                    id: 'id'
                  }"
                  relatedFields="attrField"
                  :placeholder="sentence.params[index].name">
                </idss-select-tree-filter>
              </template>
              <template v-else>
                <!-- 关联关系模式【双字段处理】，根据模板规则，第一个是永远是字段取第一个，其他的取第二个 -->
                <idss-select-tree-filter
                  class='transparent'
                  :data='fileDataByType(sentence.params[index].dataType, index)'
                  :selected.sync="data[sentence.params[index].value]"
                  size="small"
                  :defaultProps="{
                    children: 'children',
                    label: 'name',
                    id: 'id'
                  }"
                  relatedFields="attrField"
                  :placeholder="sentence.params[index].name">
                </idss-select-tree-filter>
              </template>
            </template>
            <template v-else-if="sentence.params[index].type === 'timerange'">
              <time-range-custom
                class='transparent'
                :selected.sync="data[sentence.params[index].value]"
                size="small"
                :placeholder="sentence.params[index].name"></time-range-custom>
            </template>
            <template v-else-if="sentence.params[index].type === 'multi'">
              <input-multiple style="width: initial;"
                class='transparent'
                :selected.sync="data[sentence.params[index].value]"
                size="small"
                :placeholder="sentence.params[index].name"></input-multiple>
            </template>
            <template v-else>
              <filter-input class='transparent'
                v-model="data[sentence.params[index].value]"
                :type="sentence.params[index].type"
                :data-type="sentence.params[index].dataType"
                :placeholder="sentence.params[index].name"></filter-input>
            </template>
          </template>
        </span>
      </template>
      <slot></slot>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import inputMultiple from '@/views/manage/commons/input-multiple.vue'
import timeRangeCustom from '@/views/manage/commons/time-range-custom.vue'
// 表单生成
const FilterInput = {
  props: {
    type: String,
    dataType: String,
    placeholder: String,
    value: [Object, Array, String, Number]
  },
  computed: {
    ...mapState('realtime', ['realDictionary']),
    // 获取对应的类型下的数据
    getList () {
      if (!this.realDictionary[this.dataType]) {
        console.error(`字典中没有：没有 “${this.dataType}” 字典列表信息！`)
        return []
      } else {
        return this.realDictionary[this.dataType]
      }
    }
  },
  render () {
    switch (this.type) {
      case 'string':
        return <el-input size='mini' value={this.value} onInput={val => this.$emit('input', val)} placeholder={this.placeholder} />
      case 'number':
        return <el-input-number size='mini' value={this.value} onInput={val => this.$emit('input', val)} placeholder={this.placeholder} />
      case 'select':
        return <el-select ref='filterEle' disabled={this.disabled} size='mini' style='width:90px' value={this.value} onInput={val => this.$emit('input', val)} placeholder={this.placeholder}>
          {
            this.getList.map(val => {
              return <el-option key={val.id} value={val.id} label={val.name}></el-option>
            })
          }
        </el-select>
      case 'time':
        return <el-time-picker
          size='mini'
          class='time'
          editable={false}
          clearable={false}
          value={this.value}
          onInput={val => this.$emit('input', val)}
          value-format='HH:mm:ss'
          placeholder={this.placeholder} />
      // case 'timerange':
        // return <el-time-picker
        //   is-range
        //   size='mini'
        //   class='time-range'
        //   editable={false}
        //   clearable={false}
        //   value={this.value}
        //   onInput={val => this.$emit('input', val)}
        //   value-format='HH:mm:ss'
        //   range-separator='—'
        //   start-placeholder='开始时间'
        //   end-placeholder='结束时间'/>
      case 'date':
        return <el-date-picker
          type='date'
          size='mini'
          class='time'
          editable={false}
          clearable={false}
          value={this.value}
          onInput={val => this.$emit('input', val)}
          format='yyyyMMdd'
          value-format='timestamp'
          placeholder={this.placeholder} />
      case 'daterange':
        return <el-date-picker
          type='daterange'
          size='mini'
          class='time-range'
          editable={false}
          clearable={false}
          value={this.value}
          onInput={val => this.$emit('input', val)}
          format='yyyyMMdd'
          value-format='timestamp'
          range-separator='—'
          start-placeholder='开始日期'
          end-placeholder='结束日期'
          placeholder={this.placeholder} />
      case 'datetime':
        return <el-date-picker
          type='datetime'
          size='mini'
          class='time'
          editable={false}
          clearable={false}
          value={this.value}
          onInput={val => this.$emit('input', val)}
          value-format='timestamp'
          placeholder={this.placeholder} />
      case 'datetimerange':
        return <el-date-picker
          type='datetimerange'
          size='mini'
          class='time-range'
          style="width:"
          editable={false}
          clearable={false}
          value={this.value}
          onInput={val => this.$emit('input', val)}
          value-format='timestamp'
          range-separator='—'
          start-placeholder='开始日期'
          end-placeholder='结束日期'
          placeholder={this.placeholder} />
      default:
        return <el-input size='mini' value={this.value} onInput={val => this.$emit('input', val)} placeholder={this.placeholder} />
    }
  }
}

export default {
  name: 'conditional-statement-template',
  components: { FilterInput, inputMultiple, timeRangeCustom },
  props: {
    data: Object,
    value: [Object, Array, String, Number]
  },
  computed: {
    ...mapState('realtime', ['moulds', 'filedDicts']),
    fileDataByType () {
      return function (type, inx) {
        if (Array.isArray(this.filedDicts)) {
          return this.dealFilterFileds(this.filedDicts, type)
        } else {
          let data = []
          inx === 0 && (data = this.dealFilterFileds(this.filedDicts['A'], type))
          inx !== 0 && (data = this.dealFilterFileds(this.filedDicts['B'], type))
          return data
        }
      }
    }
  },
  data () {
    return {
      sentence: {}
    }
  },
  methods: {
    // 过滤条件和关联关系处理字段信息
    dealFilterFileds (filterData, type) {
      let treeData = []
      if (!type) {
        treeData = filterData
        return treeData
      }
      let temp = type.split(',')
      filterData.map(item => {
        if (item.children) {
          if (item.attrType === undefined || temp.includes(item.attrType)) {
            let children
            if (item.children) {
              children = item.children.filter(c => temp.includes(c.attrType))
            }
            if (children && children.length) {
              let json = JSON.parse(JSON.stringify(item))
              delete json.children
              treeData.push({ ...json, children: children })
            }
          }
        } else {
          temp.includes(item.attrType) && treeData.push(item)
        }
      })
      return treeData
    },
    handleTemplate (str) {
      if (!str) return
      return str.split('？')
    }
  },
  created () {
    let mould = this.moulds.filter(item => item.id === this.data.id)
    this.sentence = mould[0]
  }
}
</script>
<style scoped lang="postcss">
%normal-input{
  text-align: center;
  font-size: 1.4rem;
  border: 0;
  background: transparent;
  border-bottom: 1px solid #22A5F7;
  padding: 0;
  height: 20px;
  line-height: 20px;
  color: #22A5F7;
}
%normal-range{
  background: transparent;
  font-size: 1.4rem;
  color: #22A5F7;
}
%normal-separator{
  padding: 0;
  width: 15px;
}
.conditional-statement-template{
  position: relative;
  .item-div{
    position: relative;
    display: inline-flex;
    white-space: nowrap;
    padding: 5px 30px 5px 5px;
  }
  .transparent{
    width: 120px;
    display: inline-block;
    &.idss-select-tree-filter{
      width: auto;
      max-width: 160px;
      min-width: 120px;
    }
    >>> input{
      &::-moz-placeholder{
        color: #f56c6c !important;
      }
      &::-webkit-input-placeholder{
        color: #f56c6c !important;
      }
      &:-moz-input-placeholder{
        color: #f56c6c !important;
      }
      &::-ms-input-placeholder{
        color: #f56c6c !important;
      }
    }
    >>> .el-input__inner{
      @extend %normal-input;
    }
    &.el-input-number >>> .el-input-number__decrease{
      display: none
    }
    &.el-input-number >>> .el-input-number__increase{
      display: none
    }
    &.el-select >>> .el-input__suffix{
      display: none;
    }
    &.idss-select-tree-filter >>> .el-input__suffix{
      display: none;
    }
    &.time-range{
      @extend %normal-input;
      width: 180px;
      >>> .el-input__icon{
        display: none;
      }
      >>> .el-range-separator{
        @extend %normal-range;
        @extend %normal-separator;
      }
      >>> .el-range-input{
        @extend %normal-range;
        width: 80px;
      }
      >>> .el-input.el-input--mini{
        height: 20px;
        line-height: 20px;
      }
      &.el-date-editor--datetimerange{
        width: 300px;
        >>> .el-range-input{
          width: 140px;
        }
      }
    }
    &.time{
      >>> .el-input__icon{
        display: none;
      }
    }
    &.el-date-editor--datetime{
      width: 140px;
    }
    &.time-range-custom {
      width: 190px;
      >>> .el-date-editor.el-input{
        width: 90px;
      }
      >>> .el-input__prefix{
        display: none
      }
    }
    >>> .el-input.el-input--mini{
      height: 20px;
      line-height: 20px;
    }
  }
}
</style>
