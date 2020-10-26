<template>
  <div class="conditional-statement-tree">
    <template v-if="Array.isArray(filterData)">
      <template v-for="(filter) in filterData">
        <div :key="filter.key" class="tree-box">
          <div class="tree-box__left">
            <select-custom size="mini" :selected.sync="filter.logical"></select-custom>
          </div>
          <div class="tree-box__right">
            <span style="right: 62px;" class="tree-box__right__btn" @click="delChildren(filter, filterData)">删除组</span>
            <span class="tree-box__right__btn" @click="addChildren(filter)">添加组</span>
            <draggable v-model="filter.terms" group="sentence" tag="ul">
              <template v-for="(term, inx) in filter.terms">
                <li :key="term.key + inx">
                  <conditional-statement-template :data="term" class='tree-box__transparent'>
                    <idss-icon-svg @click="termDel(term, filter.terms)" class="term-btn" name="delete"></idss-icon-svg>
                  </conditional-statement-template>
                </li>
              </template>
              <span v-if="Object.keys(filter.terms).length===0 && filter.children.length===0" class="tree-box__empty"><idss-icon-svg name="circle-add-outline"></idss-icon-svg>拖动条件展示栏的语句至筛选条件进行配置</span>
            </draggable>
            <template v-if="filter.children">
              <conditional-statement-tree v-if="filter.children.length !== 0" :filter-data.sync="filter.children"></conditional-statement-tree>
            </template>
          </div>
        </div>
      </template>
    </template>
    <!-- 当 filterData 为对象时，表示为跟节点 -->
    <template v-else>
      <div class="tree-box">
        <div class="tree-box__left">
          <select-custom size="mini" :selected.sync="filterData.logical"></select-custom>
        </div>
        <div class="tree-box__right">
          <span class="tree-box__right__btn" @click="addChildren(filterData)">添加组</span>
          <draggable v-model="filterData.terms" group="sentence" tag="ul">
            <template v-for="(term, inx) in filterData.terms">
              <li :key="term.key + inx">
                <conditional-statement-template :data="term" class='tree-box__transparent'>
                  <idss-icon-svg @click="termDel(term, filterData.terms)" class="term-btn" name="delete"></idss-icon-svg>
                </conditional-statement-template>
              </li>
            </template>
            <span v-if="Object.keys(filterData.terms).length===0 && filterData.children.length===0" class="tree-box__empty"><idss-icon-svg name="circle-add-outline"></idss-icon-svg>拖动条件展示栏的语句至筛选条件进行配置</span>
          </draggable>
          <template v-if="filterData.children">
            <conditional-statement-tree v-if="filterData.children.length !== 0" :filter-data.sync="filterData.children"></conditional-statement-tree>
          </template>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import conditionalStatementTemplate from '@/views/manage/commons/conditional-statement-template.vue'
import selectCustom from '@/views/manage/commons/select-custom.vue'
export default {
  name: 'conditional-statement-tree',
  components: { draggable, conditionalStatementTemplate, selectCustom },
  props: {
    filterData: [Array, Object]
  },
  data () {
    return {
    }
  },
  methods: {
    // 增加组
    addChildren (obj) {
      obj.children.push({
        key: Date.now(),
        logical: '&&',
        terms: [],
        children: []
      })
    },
    // 删除组
    delChildren (data, parent) {
      const index = parent ? parent.indexOf(data) : undefined
      parent.splice(index, 1)
    },
    // 删除规则
    termDel (data, parent) {
      const index = parent ? parent.indexOf(data) : undefined
      parent.splice(index, 1)
    }
  }
}
</script>

<style scoped lang="postcss">
%normal-y{
  position: absolute;
  transform: translateY(-50%);
  top: 50%;
}
%normal-br{
  content: '';
  position: absolute;
  left: -1px;
  width: 10px;
  height: 20px;
  border: 1px solid #d3d3d3;
  border-radius: 0 0 0 100%/50%;
  border-right: none;
  border-top: none;
}
.tree-box{
  min-width: 100%;
  position: relative;
  padding: 20px 0;
  &__left{
    @extend %normal-y;
    left: 0;
    width: 45px;
    &:before{
      @extend %normal-y;
      content: '';
      right: 0;
      background: #d3d3d3;
      width: 10px;
      height: 1px;
    }
  }
  &__right{
    position: relative;
    margin-left: 45px;
    border-left: 1px solid #d3d3d3;
    min-height: 100px;
    padding-left: 15px;
    &:before{
      @extend %normal-br;
      transform: scaleY(-1);
      top: -10px;
    }
    &:after{
      @extend %normal-br;
      bottom: -10px;
    }
    &__btn{
      position: absolute;
      top: -16px;
      right: 0;
      color: #22a5f7;
      cursor: pointer;
      padding: 0 10px
    }
  }
  &__transparent{
    position: relative;
    display: inline-block;
    &:hover{
      background-color: #EAEDF4;
      .term-btn{
        display: inline-block;
        &:hover{
          fill: #00A1FD ;
        }
      }
    }
    .term-btn{
      position: absolute;
      right: 7px;
      top: 7px;
      display: none;
      fill: #C9C9C9;
      cursor: pointer;
      width: 16px;
      height: 16px;
      margin-left: 5px;
    }
  }
  &__empty{
    color: #CBCBCB;
    line-height: 100px;
    white-space: nowrap;
    .idss-svg-icon{
      fill: #54698D;
      margin-right: 5px;
    }
  }
}
</style>
