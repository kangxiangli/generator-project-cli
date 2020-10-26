<template>
  <div class="manage-base-organization">
    <idss-widget
      :main-style="{padding: '15px'}"
      v-loading="loading['manage-base-organization']">
      <template slot="title-left">
        组织架构
      </template>
      <div class="manage-base-organization__container">
        <div
          v-iscroll
          style="height: 420px"
          v-for="(list, index) in reStructData"
          :key="index"
          class="manage-base-organization__list">
          <ul>
            <li class="manage-base-organization__item"
              v-for="item in list.data"
              :key="item.type === '0' ? item.deptId : item.userId"
              :class="{'manage-base-organization__item--active': item.type === '0' ? item.deptId === list.activeId : item.userId === list.activeId}"
              @click="clickItemHandle(item, index)">
              <!-- 类型图标 -->
              <idss-icon-svg :name="iconType[item.type]"></idss-icon-svg>
              <!-- 部门/用户名称 -->
              <span>{{item.type === '0' ? item.deptName : item.userName}}</span>
              <!-- 部门人员数量 -->
              <span class="manage-base-organization__count" v-if="item.type === '0'">{{item.userCount}}人 </span>
            </li>
          </ul>
        </div>
      </div>
    </idss-widget>
  </div>
</template>

<script>
import globalMixins from '@/mixins/globalMixins.js'
import service from './org-service.js'
export default {
  name: 'manage-base-org',
  mixins: [globalMixins, service],
  data () {
    return {
      list: [],
      activeId: '',
      reStructData: []
    }
  },
  methods: {
    async init () {
      this.iconType = {
        '0': 'department',
        '1': 'user'
      }
      // 获取组织结构列表
      await this.getOrgist()
      // 重新结构化数据
      this.reStructList(this.list, 0)
    },

    /**
       * 节点点击事件
       * @param {array} list 当前列表数据
       * @paranm {number} index 当前操作数据索引值
       */
    clickItemHandle (list, index) {
      // 判断是部门的处理
      if (list.type === '0') {
        this.reStructData[index].activeId = list.deptId
      } else if (list.type === '1') {
        // 判断是人员的处理
        this.reStructData[index].activeId = list.userId
      }
      // 清空数据后续数据
      this.delStructData(index + 1)
      // 处理下一层数据
      if (list.children && list.children.length) {
        this.reStructList(list.children, index + 1)
      }
    },
    /**
       * 重新结构化数据
       * @param {array} list 要处理的数据
       * @param {number} index reStructData索引值
       */
    reStructList (list, index) {
      // 清空数据
      this.$set(this.reStructData, index, { activeId: '', data: list })
    },

    /**
       * 清空重新构建的结构数据
       */
    delStructData (index) {
      this.reStructData.splice(index)
    }
  },
  created () {
    this.init()
  }
}
</script>

<style scoped lang="postcss">
  .manage-base-organization{
    &__container {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      flex-wrap: wrap;
    }

    &__list {
      width: 200px;
      height: 420px;
      position: relative;
      margin-left: 20px;
      border-radius: 4px;
      border: var(--border-default);
      background-color: var(--color-bg-5);

      &:first-child {
        margin-left: 0;
      }
    }

    &__item {
      font-size: 14px;
      padding: 15px 30px;
      cursor: pointer;

      &:hover {
        background-color: var(--color-bg-1);
      }

      &--active {
        background-color: var(--color-bg-2)!important;
      }
    }

    &__count {
      display: block;
      font-size: 12px;
      text-align: left;
      margin-top: 5px;
    }
  }
</style>
