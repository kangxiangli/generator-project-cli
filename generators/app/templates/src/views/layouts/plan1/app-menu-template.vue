<template>
  <div>
    <template v-for="menu in menuList">
      <!-- 有子菜单情况 -->
      <el-submenu
        v-if="!menu.meta.hidden && menu.children && menu.children.length"
        :show-timeout="200"
        :hide-timeout="200"
        :key="menu.name"
        :index="menu.name"
        @click.native="subTitleClick(menu)"
        :popper-append-to-body="false"
        :is-root="!isRoot">
        <template slot="title">
          <idss-icon-svg v-if="menu.icon" :name="menu.icon"></idss-icon-svg>
          <span>{{menu.meta.title}}</span>
        </template>
        <el-menu-item :disabled="true" :index="menu.name">
          <span slot="title">{{menu.meta.title}}</span>
        </el-menu-item>
        <app-menu-template :menus="menu.children" :isRoot="false"></app-menu-template>
      </el-submenu>
      <!-- 无子菜单情况 -->
      <el-menu-item
        v-else-if="!menu.meta.hidden"
        :key="menu.name"
        :index="menu.name"
        :is-root="!isRoot">
        <idss-icon-svg v-if="menu.icon" :name="menu.icon"></idss-icon-svg>
        <span slot="title">{{menu.meta.title}}</span>
      </el-menu-item>
    </template>
  </div>
</template>
<script>
import appMenuTemplate from './app-menu-template.vue'
export default {
  name: 'app-menu-template',
  components: {
    appMenuTemplate
  },
  props: {
    menus: Array,
    isRoot: Boolean,
    default: []
  },
  computed: {
    menuList () {
      let menus = JSON.parse(JSON.stringify(this.menus)) // @FIXME：避免影响vuex
      return this.hideParentMenu(menus)
    }
  },
  methods: {
    // 处理子路由如果全部隐藏时，需要将其父路由隐藏
    hideParentMenu (data) {
      data.forEach(item => {
        if ('children' in item) {
          let isHidden = item['children'].every(subItem => subItem.meta.hidden)
          if (isHidden) {
            this.$set(item.meta, 'hidden', true)
          } else {
            this.hideParentMenu(item.children)
          }
        }
      })
      return data
    },
    /**
     * 点击菜单
     */
    subTitleClick (param) {
      let name = this.selectFirstMenu(param)
      this.$router.push({ name: name })
    },
    /**
     * 找到目标菜单
     */
    selectFirstMenu (data) {
      if ('children' in data) {
        let currentSel = data.children.find(item => !item.meta.hidden)
        return this.selectFirstMenu(currentSel)
      }
      return data.name
    }
  }
}
</script>

<style lang="postcss">
.app-menu-container {
  .el-menu {
    background-color: unset;
  }
}
/* 第一层菜单
  ============================= */
%normal {
  color: var(--app-menu-color);
  height: var(--app-menu-item-height);
  position: relative;
  font-size: var(--app-menu-font-size);
  font-weight: 500;
  line-height: var(--app-menu-item-height);
  background-color: var(--app-menu-item-bg);
}
%normal-svg {
  fill: var(--app-menu-color);
  width: 18px;
  height: 18px;
  margin-right: 8px;
  vertical-align: middle;
}
%normal__active {
  box-shadow: none;
  color: var(--app-menu-color-hover);
  background: var(--app-menu-item-bg-hover);
  border-bottom: var(--app-menu-item-border) !important;
  text-shadow: var(--app-menu-text-hover-shadow);
}
%normal-svg__active {
  fill: var(--app-menu-color-hover);
}

%normal__hover {
  color: var(--app-menu-color-hover);
  background: var(--app-menu-item-bg-hover);
}
%normal-svg__hover {
  fill: var(--app-menu-color-hover);
}

/* 无子菜单 */
.app-menu-container .el-menu-item:not([is-root]) {
  @extend %normal;
  & svg {
    @extend %normal-svg;
  }
  /* &:hover {
    @extend %normal__hover;
    & svg {
      @extend %normal-svg__hover;
    }
  } */
  /* 激活 */
  &.is-opened,
  &.is-active {
    @extend %normal__active;
    & svg {
      @extend %normal-svg__active;
    }
  }
}
/* 有子菜单 */
.app-menu-container .el-submenu:not([is-root]) {
  & > .el-submenu__title {
    @extend %normal;
    & svg {
      @extend %normal-svg;
    }
    & > i {
      display: block;
      transform: rotateZ(-90deg);
      width: 8px;
      height: 8px;
      margin-top: -1px;
      color: var(--app-menu-color);
      right: 12px;
    }
  }
  /* &:hover {
    & > .el-submenu__title {
      @extend %normal__hover;
      & svg {
        @extend %normal-svg__hover;
      }
    }
  } */
  &.is-opened,
  &.is-active {
    & > .el-submenu__title {
      @extend %normal__active;
      & svg {
        @extend %normal-svg__active;
      }
    }
  }
}

/* 非根节点
  =============================== */
%child {
  position: relative;
  font-size: var(--app-menu-font-size);
  color: var(--app-menu-color) !important;
  height: var(--app-menu-item-sub-height);
  line-height: var(--app-menu-item-sub-height);
  padding-left: 20px;
}
%child-after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: inherit;
}
%child__active {
  margin: 1px 0;
  color: var(--app-menu-color-hover) !important;
  background-color: var(--app-menu-item-sub-bg-hover) !important;
}
%child-after__active {
  background-color: var(--app-menu-item-sub-bg-hover);
}
%child__hover {
  color: var(--app-menu-color-hover) !important;
  background-color: var(--app-menu-item-sub-bg-hover) !important;
}
%child-after__hover {
  background: none;
}

/* 无子菜单情况 */
.app-menu-container [is-root].el-menu-item {
  @extend %child;
  &:hover {
    @extend %child__hover;
    &:after {
      @extend %child-after__hover;
    }
  }
  &.is-opened,
  &.is-active {
    @extend %child__active;
    &:after {
      @extend %child-after__active;
    }
  }
}
/* 有子菜单 */
.app-menu-container [is-root].el-submenu {
  height: var(--app-menu-item-sub-height);
  line-height: var(--app-menu-item-sub-height);
  margin: 1px 0;
  & > .el-submenu__title {
    @extend %child;
  }
  &:hover {
    & > .el-submenu__title {
      @extend %child__hover;
      &:after {
        @extend %child-after__hover;
      }
    }
  }
  &.is-active {
    & > .el-submenu__title {
      @extend %child__active;
      &:after {
        @extend %child-after__active;
      }
    }
  }
}

/* menu
  ===========================*/
.app-menu-container .el-submenu:not(is-root).is-opened,
.app-menu-container .el-submenu:not(is-root).is-active {
  .el-submenu__title {
    i {
      color: var(--app-menu-color-hover);
      font-weight: bold;
    }
  }
}
.app-menu-container .el-menu-item {
  text-align: left;
  transition: none;
}
.app-menu-container .el-submenu[is-root] {
  .el-submenu__title {
    border-bottom: none !important;
  }
}
.app-menu-container .el-submenu__title {
  text-align: left;
  transition: none;
  border-bottom: var(--app-menu-item-border) !important;
}
.app-menu-container .el-menu .el-menu--popup .el-menu--popup-bottom-start {
  background-color: var(--app-menu-item-sub-bg);
}
/* 收起菜单之后，隐藏文本 */
.app-menu-container .el-menu--collapse .el-menu-item:not([is-root]) span,
.app-menu-container
  .el-menu--collapse
  .el-submenu:not([is-root])
  > .el-submenu__title
  span {
  height: 0;
  width: 0;
  overflow: hidden;
  visibility: hidden;
  display: inline-block;
  vertical-align: inherit;
}
/* 收起菜单后，主标题相关控制 */
.app-menu-container
  .el-menu--collapse
  .el-menu--popup
  .el-menu-item:not([is-root]) {
  position: relative;
  border-bottom: none;
  color: var(--app-menu-color);
  padding-left: 30px;
  background-color: var(--app-menu-item-sub-bg);
  span {
    visibility: visible;
    height: inherit;
    width: inherit;
  }
  i {
    visibility: hidden;
    height: inherit;
    width: inherit;
  }
  &:before {
    position: absolute;
    top: 12px;
    left: 10px;
    width: 8px;
    height: 8px;
    border-radius: 6px;
    content: "";
    background: var(--app-menu-item-tooltip-color);
  }
  &:hover,
  &.is-active {
    background-color: var(--app-menu-item-sub-bg);
  }
  &.is-disabled {
    opacity: 1 !important;
    height: var(--app-menu-item-sub-height);
    line-height: var(--app-menu-item-sub-height);
  }
}
.app-menu-container
  .el-menu--collapse
  .el-submenu.is-opened
  > .el-submenu__title
  .el-submenu__icon-arrow {
  transform: rotateZ(-90deg);
}

.app-menu-container .el-menu--collapse .el-menu--popup-bottom-start {
  .el-submenu.is-opened > .el-submenu__title .el-submenu__icon-arrow {
    transform: rotateZ(-90deg);
  }
  .el-submenu__title .el-submenu__icon-arrow {
    transform: rotateZ(0deg);
  }
  .el-submenu.is-opened .el-submenu__title .el-submenu__icon-arrow {
    transform: rotateZ(180deg);
  }
}

.app-menu-container .el-menu--popup > li {
  display: none;
}
.app-menu-container .el-menu--collapse .el-menu--popup > li {
  display: block;
}
/* 弹出菜单位置矫正 */
.app-menu-container .el-submenu {
  position: relative;
  height: var(--app-menu-item-height);
  line-height: var(--app-menu-item-height);
}
/* 控制菜单的分割线 */
.app-menu-container .el-submenu:first-child > .el-submenu__title {
  box-shadow: none;
}

.app-menu-container .el-submenu:last-child:after {
  content: "";
  display: block;
  width: 100%;
  height: 1px;
}
.app-menu-container .el-submenu .el-menu--horizontal {
  position: absolute !important;
  left: 100% !important;
  top: 0 !important;
  border-bottom: none;
  background-color: var(--app-menu-item-sub-bg);
  padding: 8px 0;
}
.app-menu-container .el-menu--popup-right-start {
  margin-left: 0;
  margin-right: 0;
}
.app-menu-container .el-menu--popup {
  padding: 0;
  margin-top: 0;
}
.app-menu-container .el-menu--collapse .el-submenu .el-menu {
  margin-left: 0;
  border: none;
  border-left: var(--app-menu-item-sub-border);
  border-right: var(--app-menu-item-sub-border);
  background-color: var(--app-menu-item-sub-bg);
  padding: 8px 0;
  .el-menu-item.is-disabled {
    color: var(--app-menu-item-tooltip-color);
    display: block;
    font-weight: bold;
  }
  &.el-menu--popup.el-menu--popup-right-start {
    .el-menu-item.is-disabled {
      display: none;
    }
  }
}

.app-menu-container {
  .el-submenu.is-opened,
  .el-submenu.is-active {
    .el-menu--popup .el-submenu__title .el-submenu__icon-arrow {
      margin-top: -5px;
      color: var(--app-menu-color);
      right: 12px;
    }
  }
}

.app-menu-container .el-menu--horizontal .el-menu .el-menu-item,
.app-menu-container .el-menu--horizontal .el-menu .el-submenu__title {
  background-color: unset;
}
</style>
