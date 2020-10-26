<template>
  <div class="tags-view-container">
    <idss-context-menu ref="context-menu">
      <scroll-pane class="tags-view-wrapper" ref="scrollPane">
        <router-link
          ref="tag"
          class="tags-view-item"
          :class="isActive(tag)?'active':''"
          v-clip-board="duplicateText"
          v-for="tag in Array.from(visitedViews)"
          :to="{path: tag.path, query: tag.query, params: tag.params}"
          :key="JSON.stringify(tag)"
          @click.alt.prevent.native="copy(tag.title)"
          @contextmenu.prevent.native="openMenu(tag,$event)">
          {{tag.title}}
          <span class="el-icon-close" @click.prevent.stop="closeSelectedTag(tag)"></span>
        </router-link>
      </scroll-pane>
      <ul slot="context-menu">
        <li class="close" @click="closeSelectedTag(selectedTag)">
          <idss-icon-svg name="circle-close-outline"></idss-icon-svg>关闭
        </li>
        <li class="close" @click="closeOthersTags(selectedTag)">
          <idss-icon-svg name="circle-close-outline"></idss-icon-svg>关闭其他
        </li>
        <li class="close" @click="closeAllTags">
          <idss-icon-svg name="circle-close-outline"></idss-icon-svg>关闭所有
        </li>
        <li
          class="refresh"
          v-show="isActive(selectedTag) && !this.$route.meta.noRefresh"
          @click="refreshTag">
          <idss-icon-svg name="circle-refresh-outline"></idss-icon-svg>刷新
        </li>
      </ul>
    </idss-context-menu>
  </div>
</template>

<script>
import BusFactory, { EventName } from '@bus'
export default {
  name: 'app-tags-view',
  data () {
    return {
      bus: null,
      selectedTag: {},
      duplicateText: '' // 复制的文本
    }
  },
  computed: {
    visitedViews () {
      return this.$store.state.tagsView.visitedViews
    },
    isCover () {
      return this.$store.getters['base/globalConfig$$']('TAGS_VIEW')['isCover']
    }
  },
  watch: {
    $route (newVal, old) {
      // 判断当前路由是否相同，相同不处理
      if (newVal.query._r === old.query._r && newVal.name === old.name) {
        if (!this.compareObject(newVal.params, old.params)) {
          // 更新 visitedViews
          this.$store.commit('UPDATE_VISITED_VIEWS', newVal)
        }
        return
      }
      if (this.isCover) {
        let flag = this.visitedViews.some(item => item.name === newVal.name)
        !flag && this.addViewTags()
        this.moveToCurrentTag()
        return
      }
      // 路由发生变化，增加新的tags，同时移到当前tag
      this.addViewTags()
      this.moveToCurrentTag()
    }
  },
  methods: {
    // 复制
    copy (param) {
      this.duplicateText = param
    },
    // 对比两个对象内容是否一致。 @FIXME
    compareObject (obj1, obj2) {
      return JSON.stringify(obj1) === JSON.stringify(obj2)
    },
    isActive (route) {
      return (this.isCover || route._r === this.$route.query._r) && route.name === this.$route.name
    },
    /**
       * 增加新的tags
       */
    addViewTags () {
      let route
      if (this.$route.name) {
        route = this.$route
      }
      if (!route) {
        return false
      }
      this.$store.dispatch('addVisitedViews', route)
    },
    moveToCurrentTag () {
      if (!this.$refs.tag) return
      const tags = this.$refs.tag
      this.$nextTick(() => {
        for (const tag of tags) {
          if (tag.to.path === this.$route.path && tag.to.query._r === this.$route.query._r) {
            this.$refs.scrollPane.moveToTarget(tag.$el)
            break
          }
        }
      })
    },
    closeSelectedTag (view) {
      this.$store.dispatch('clearUUid', { type: 'closeSelectTag', data: view })      // 调用清空uuid的方法（后台需要）
      this.$store.commit('DEL_SELECTED_UUID', view)  // 关闭之后需要清空当前uuid
      this.$store.dispatch('delVisitedViews', view).then((views) => {
        if (this.isActive(view)) {
          const latestView = views.slice(-1)[0]
          if (latestView) {
            this.$router.push({ name: latestView.name, query: latestView.query, params: latestView.params })
          } else {
            this.$router.push({ name: 'index' })
          }
        }
        this.moveToCurrentTag()
      })
    },
    closeOthersTags (view) {
      this.$store.dispatch('clearUUid', { type: 'closeTags', data: view })
      this.$store.commit('DEL_OTHER_UUIDS', view)
      this.$store.dispatch('delOthersViews', view).then((views) => {
        const selectView = views[0]
        this.$router.push({ name: selectView.name, query: selectView.query })
        this.moveToCurrentTag()
      })
    },
    closeAllTags () {
      this.$store.dispatch('clearUUid', { type: 'closeTags', data: undefined })  // 调用清除uuid的方法
      this.$store.commit('DEL_ALL_UUIDS')
      this.$store.dispatch('delAllViews')
      this.$router.push({ name: 'index' })
    },
    refreshTag () {
      if (this.$route.meta.noRefresh) return
      // 如果路由元信息对象中 noRefresh 为 空 或者 false，且当前激活页有init方法，则会刷新当前页
      // 数值中最后一个为当前激活页面
      let initFn = this.getComponents().init
      initFn && (typeof initFn) === 'function' && initFn()
    },
    // 获取当前active的组件实例
    getComponents () {
      let matchedArray = this.$route.matched
      /** 整个组件树由于添加了一层，所以继续向上一层获取 */
      /** 原有方式： matchedArray[matchedArray.length - 1].instances.default.$parent.$refs['router-view'] */
      return matchedArray[matchedArray.length - 1].instances.default.$parent.$parent.$refs['router-view']
    },
    openMenu (tag, e) {
      this.selectedTag = tag
      this.$refs['context-menu'].openMenu(e)
    }
  },
  mounted () {
    this.addViewTags()
    this.bus = BusFactory(this)
    // 监听全局关闭时间
    this.bus.$on(EventName.TAGS_VIEW_CLOSE, view => {
      this.$store.dispatch('delVisitedViews', view)
    })
  }
}
</script>

<style scoped lang="postcss">
.tags-view-container {
  --app-tag-bg: var(--light-gray-3-a50);
  --app-tag-color: var(--color-font-3);
  --app-tag-border: var(--color-line-default) solid var(--line-size-default);
  --app-tag-corner: var(--corner-default);
  --app-tag-font-size: var(--font-size-4);
  --app-tag-bg-actived: var(--guan-highlight-5);
  --app-tag-color-actived: var(--color-font-5);
  --app-tag-border-actived: var(--guan-highlight-6-a40) solid
    var(--line-size-default);
  --app-tag-icon-color-actived: var(--light-gray-1);
  --app-tag-icon-bg-actived: var(--guan-highlight-5);

  & .tags-view-wrapper {
    height: 45px;
    .tags-view-item {
      color: var(--app-tag-color);
      height: 32px;
      border: var(--app-tag-border);
      margin: 7px 0 7px 5px;
      padding: 0 8px 0 8px;
      display: inline-block;
      position: relative;
      font-size: var(--app-tag-font-size);
      background: var(--app-tag-bg);
      line-height: 30px;
      font-weight: 400;
      user-select: none;
      border-radius: var(--app-tag-corner);
      &:first-of-type {
        margin-left: 10px;
      }
      &:hover,
      &.active {
        color: var(--app-tag-color-actived);
        border: var(--app-tag-border-actived);
        background: var(--app-tag-bg-actived);
        font-weight: 500;
        border-radius: var(--app-tag-corner);
        /* .el-icon-close:hover {
          color: var(--app-tag-icon-color-actived);
          background-color: var(--app-tag-icon-bg-actived);
        } */
        .el-icon-close {
          color: var(--app-tag-bg-actived);
          background-color: var(--light-gray-1-a80);
        }
      }
      .el-icon-close {
        width: 16px;
        height: 16px;
        text-align: center;
        line-height: 16px;
        border-radius: 50%;
        transform-origin: 100% 50%;
        color: var(--app-tag-bg);
        background-color: var(--app-tag-color);
      }
    }
  }
}
</style>
