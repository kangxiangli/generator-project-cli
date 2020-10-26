<template>
  <div class="app-menu-container">
    <el-menu
      :default-active="currentMenu"
      @select="select"
      :collapse="!isMenuOpen"
      mode="horizontal"
      menu-trigger="hover"
      :show-timeout="50"
      :hide-timeout="0">
      <app-menu-template :menus="menus" :isRoot="true"></app-menu-template>
    </el-menu>
  </div>
</template>

<script>
import appMenuTemplate from './app-menu-template.vue'
export default {
  name: 'app-menu',
  components: {
    appMenuTemplate
  },
  props: ['isMenuOpen'],
  data () {
    return {
      currentMenu: ''
    }
  },
  computed: {
    menus () {
      return this.$store.state.permission.menuList
    }
  },
  watch: {
    $route: {
      deep: true,
      handler: function (val) {
        this.currentMenu = val.name
      },
      immediate: true
    }
  },
  methods: {
    select (name) {
      // @FIXME 修复路由超出最大数量之后，被选中菜单仍然高亮的bug，使用特殊方式，让currentMenu触发element的watch更新activeIndex方法
      this.currentMenu = name
      // 判断当前tag数量满足最大条件
      if (this.$store.state.tagsView.visitedViews.length >= this.$store.getters['base/globalConfig$$']('TAGS_VIEW')['maxNum']) {
        this.$nextTick(() => {
          this.currentMenu = this.$route.name
        })
      }
      this.$router.push({ name: name })
    }
  }
}
</script>

<style scoped lang="postcss">
.app-menu-container {
  --app-menu-z-index: var(--zindex-menu);
  --app-menu-container-bg: linear-gradient(
    180deg,
    var(--guan-8),
    var(--guan-7)
  );
  --app-menu-container-border: var(--guan-7) solid var(--line-size-default);
  /* 菜单全局变量 */
  --app-menu-shadow: inset 0 1px 0 var(--guan-6);
  --app-menu-color: var(--light-gray-1-a70); /* 文字、图标颜色一样 */
  --app-menu-color-hover: var(--color-font-5); /* 文字、图标颜色一样 */
  --app-menu-text-hover-shadow: 0px 1px 2px var(--guan-highlight-8);
  --app-menu-font-size: var(--font-size-4);
  /* 一级菜单 */
  --app-menu-item-height: 48px;
  --app-menu-item-bg: var(--guan-6-a20);
  --app-menu-item-bg-hover: linear-gradient(
    0deg,
    var(--guan-highlight-7),
    var(--guan-highlight-6)
  );
  --app-menu-item-border: var(--guan-6-a40) solid var(--line-size-default);
  /* 子菜单 */
  --app-menu-item-sub-height: 32px;
  --app-menu-item-sub-bg: var(--guan-10-a80);
  --app-menu-item-sub-bg-hover: var(--guan-highlight-6-a40);
  --app-menu-item-sub-border: var(--guan-10-a80) solid var(--line-size-default);
  --app-menu-item-sub-border-hover: var(--guan-highlight-6-a40) solid
    var(--line-size-default);
  --app-menu-item-tooltip-color: var(--guan-highlight-3);

  top: 50px;
  width: inherit;
  height: 100%;
  z-index: var(--app-menu-z-index);
  position: fixed;
  & .el-menu {
    height: inherit;
    border-right: var(--app-menu-container-border);
    background: var(--app-menu-container-bg);
    &.el-menu--collapse {
      width: 62px; /* 收起状态 */
    }
    &:not(.el-menu--collapse) {
      width: 180px; /* 展开状态 */
    }
    div {
      outline: none;
    }
  }
}
</style>
