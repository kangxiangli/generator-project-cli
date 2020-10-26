<template>
  <div class="conditional-statement-group">
    <el-card class="box-card"  shadow="never">
      <div slot="header">
        <el-input size="small" placeholder="请输入名称" v-model="search">
          <i slot="prefix" class="el-input__icon">
            <idss-icon-svg name="search"></idss-icon-svg>
          </i>
        </el-input>
      </div>
      <template  v-if="searchMoulds.length">
        <el-scrollbar class="no-scrollbar-x">
          <div :style="{'height': `${height}px`}">
            <draggable tag="ul" :list="moulds" :group="{ name: 'sentence', pull: 'clone', put: false }" :clone="cloneDog">
              <template v-for="(item, index) in searchMoulds">
                <li :key="index" @click="handleClick(item)">
                  <idss-icon-svg name="circle-add-outline" @click="addMould(item)"></idss-icon-svg>
                  <div class="title" v-html="formatSentence(item)"></div>
                </li>
              </template>
            </draggable>
          </div>
        </el-scrollbar>
      </template>
      <template v-else>
        <div :style="{'color': '#cbcbcb','line-height': `${height}px`,'text-align': 'center'}">
          暂无数据
        </div>
      </template>
    </el-card>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import draggable from 'vuedraggable'
export default {
  name: 'conditional-statement-group',
  components: { draggable },
  data () {
    return {
      search: ''
    }
  },
  computed: {
    ...mapState('realtime', ['moulds', 'realDictionary', 'filedDicts']),
    searchMoulds () {
      let val = this.search.toLowerCase()
      if (val) {
        return this.moulds.filter(function (item) {
          return String(item.template).toLowerCase().indexOf(val) > -1
        })
      } else {
        return this.moulds
      }
    }
  },
  props: {
    height: {
      type: Number,
      default: 200
    }
  },
  methods: {
    // 获取对应的类型下的数据
    getDefaultValue (type) {
      if (!this.realDictionary[type]) {
        console.error(`字典中没有：没有 “${type}” 字典列表信息！`)
        return ''
      } else {
        let tem = this.realDictionary[type][0]
        return (tem && tem.id) || ''
      }
    },
    // 获取字段树的值
    getDefaultTree (type) {
    },
    handleClick (obj) {
      this.$emit('change', obj)
    },
    formatSentence (obj) {
      let html = obj.template
      obj.params.forEach(item => {
        html = html.replace('？', `<span>${item.name}</span>`)
      })
      return html
    },
    cloneDog (opt) {
      let obj = {
        key: Date.now(),
        id: opt.id
      }
      opt.params.map(item => {
        let tem = ''
        item.type === 'select' && (tem = this.getDefaultValue(item.dataType))
        item.type === 'date' && (tem = Date.now())
        item.type === 'daterange' && (tem = [Date.now(), Date.now()])
        item.type === 'datetime' && (tem = Date.now())
        item.type === 'datetimerange' && (tem = [Date.now(), Date.now()])
        item.type === 'timerange' && (tem = ['00:00', '00:15'])
        item.type === 'time' && (tem = '00:00:00')
        obj[item.value] = tem
      })
      return obj
    },
    addMould (opt) {
      let obj = {
        key: Date.now(),
        id: opt.id
      }
      opt.params.map(item => {
        let tem = ''
        item.type === 'select' && (tem = this.getDefaultValue(item.dataType))
        item.type === 'date' && (tem = Date.now())
        item.type === 'daterange' && (tem = [Date.now(), Date.now()])
        item.type === 'datetime' && (tem = Date.now())
        item.type === 'datetimerange' && (tem = [Date.now(), Date.now()])
        item.type === 'timerange' && (tem = ['00:00', '00:15'])
        item.type === 'time' && (tem = '00:00:00')
        obj[item.value] = tem
      })
      this.$emit('addMould', obj)
    }
  }
}
</script>

<style scoped lang="postcss">
.conditional-statement-group{
  >>> .el-card__header{
    padding: 0 20px;
    border: 0;
    margin-top: 15px;
  }
  >>> .el-card__body{
    padding: 10px 20px 15px;
  }
  .el-card__body ul{
    width: 100%;
  }
  .el-card__body ul>li{
    position: relative;
    color: #171B1C;
    width: 100%;
    list-style-type: none;
    display: block;
    .idss-svg-icon{
      position: absolute;
      top: 1px;
      left: 0;
      cursor: pointer;
      fill: #54698D;
    }
    &:hover{
      background: #F6F9FF;
    }
    .title{
      padding: 0 0 0 25px;
    }
    >>> span{
      text-decoration: underline;
      padding: 0px 5px;
    }
  }
}
</style>
