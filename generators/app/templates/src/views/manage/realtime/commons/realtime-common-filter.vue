<template>
  <div class="realtime-common-filter">
    <el-card class="box-card"  shadow="never" v-loading="loading['realtime-filter-query']">
      <div slot="header">
        <el-input size="small" placeholder="请输入名称" v-model="search">
          <i slot="prefix" class="el-input__icon">
            <idss-icon-svg name="search"></idss-icon-svg>
          </i>
        </el-input>
      </div>
      <template v-if="searchMoulds.length">
        <el-scrollbar class="no-scrollbar-x">
          <ul :style="{'height': `${height}px`}">
            <template v-for="(item, index) in searchMoulds">
              <li :key="index">
                <idss-icon-svg class="left-icon" name="circle-add-outline" @click="addMould(item)"></idss-icon-svg>
                <div class="title">{{item.name}}</div>
                <idss-icon-svg class="right-icon" name="delete" @click="delMould(item)"></idss-icon-svg>
              </li>
            </template>
          </ul>
        </el-scrollbar>
      </template>
      <template v-if="!searchMoulds.length">
        <div :style="{'color': '#cbcbcb','line-height': `${height}px`,'text-align': 'center'}">
          暂无数据
        </div>
      </template>
    </el-card>
  </div>
</template>
<script>
import globalMixins from '@/mixins/globalMixins.js'
export default {
  name: 'realtime-common-filter',
  mixins: [globalMixins],
  props: {
    height: {
      type: Number,
      default: 200
    },
    eventId: String,
    filterObj: Object
  },
  data () {
    return {
      filterList: [],
      search: ''
    }
  },
  computed: {
    searchMoulds () {
      let val = this.search.toLowerCase()
      if (val) {
        return this.filterList.filter(function (item) {
          return String(item.name).toLowerCase().indexOf(val) > -1
        })
      } else {
        return this.filterList
      }
    }
  },
  methods: {
    // 获取筛选器列表
    async getRealtimeFilters () {
      await this.$request({
        url: '/api/ueba/system/policy/datastream/filter/query',
        method: 'post',
        tag: 'realtime-filter-query',
        data: {
          eventId: this.eventId
        }
      }).then(data => {
        this.filterList = data
      })
    },
    // 删除常用的筛选器
    async delMould (item) {
      await this.$request({
        url: '/api/ueba/system/policy/datastream/filter/del',
        method: 'post',
        tag: 'realtime-filter-query',
        data: {
          id: item.id
        }
      }).then(data => {
        this.list()
        this.showMessage('删除成功')
      })
    },
    // 另存为筛选器确认框
    saveConfrim () {
      this.$prompt('将筛选器命名为', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /\S/,
        inputErrorMessage: '不能为空'
      }).then(({ value }) => {
        let param = {
          dataStreamId: this.eventId,
          filter: JSON.stringify(this.filterObj),
          name: value
        }
        this.saveMould(param)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        })
      })
    },
    // 保存筛选器到后台
    async saveMould (obj) {
      await this.$request({
        url: '/api/ueba/system/policy/datastream/filter/save',
        method: 'post',
        tag: 'realtime-filter-query',
        data: obj
      }).then(data => {
        this.list()
        this.showMessage('保存成功')
      })
    },
    // 把常用的筛选器当做条件加入的表达式中
    addMould (opt) {
      this.$emit('addMouldFilter', opt.filter)
    },
    list () {
      this.getRealtimeFilters()
    }
  },
  mounted () {
    this.list()
  },
  created () {
  }
}
</script>
<style scoped lang="postcss">
.realtime-common-filter{
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
    color: #171b1c;
    width: 100%;
    list-style-type: none;
    display: block;
    .idss-svg-icon{
      fill: #54698D;
      cursor: pointer;
      position: absolute;
      top: 1px;
    }
    &:hover{
      background: #F6F9FF;
    }
    .title{
      padding: 0 25px;
      word-wrap: break-word;
    }
    .left-icon{
      left: 0;
    }
    .right-icon{
      right: 0;
    }
    >>> span{
      text-decoration: underline;
      padding: 0px 5px;
    }
  }
}
</style>
