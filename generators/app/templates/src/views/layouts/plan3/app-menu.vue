
<template>
  <div class="app-menu-container" v-iscroll>
    <el-menu
      unique-opened>
      <template v-for="menu in menus">
        <el-submenu
          v-if="!menu.meta.hidden && menu.children && menu.children.length"
          :key="menu.name"
          :index="menu.name"
          @click.native="titleClick(menu)">
          <template slot="title">
            <idss-icon-svg v-if="menu.icon" :name="menu.icon"></idss-icon-svg>
            <span >{{menu.meta.title}}</span>
          </template>
          <el-menu-item
            v-for="submenu in menu.children"
            :key="submenu.name"
            :index="submenu.name"
            @click.native="subTitleClick(submenu.name)">
            <p class="menu-item-level2">
              <span>·</span>
              {{submenu.meta.title}}
            </p>
          </el-menu-item>
        </el-submenu>
        <el-menu-item
          v-else-if="!menu.meta.hidden"
          :key="menu.name"
          :index="menu.name">
          <idss-icon-svg v-if="menu.icon" :name="menu.icon"></idss-icon-svg>
          <span slot="title">{{menu.meta.title}}</span>
        </el-menu-item>
        <!-- menu.children && menu.children.length -->
      </template>
    </el-menu>
  </div>
</template>

<script>

export default {
  name: 'app-menu',
  data () {
    return {
    }
  },
  methods: {
    /**
     * 点击一级菜单
     */
    titleClick (menu) {

    },
    /**
     * 点击子菜单
     */
    subTitleClick (menu) {
      this.$router.push({ name: menu.name })
    }
  },
  computed: {
    menus () {
      return this.$store.state.permission.level2Menus
    }
  },
  mounted () {
    this.$store.commit('permission/SET_LEVEL2_MENUS', this.$store.state.permission.menuList.find(menu => menu.children).children || [])
  }
}
</script>

<style lang="postcss">
.app-menu-container {
  --menu-level1-hover-bg: linear-gradient(135deg, var(--guan-8), var(--guan-highlight-8));
  /* 菜单顶部border */
  --menu-border-gradient: linear-gradient(var(--guan-highlight-6),var(--guan-6)) 1;
  /* 一级菜单border和二级hover背景色 */
  --menu-level2-hover-bg: linear-gradient(135deg, var(--guan-6), var(--guan-highlight-6));
  --menu-level2-opened-bg: linear-gradient(var(--guan-8-a40), var(--guan-highlight-8-a10));
  --border-gradient: linear-gradient(135deg, var(--guan-6), var(--guan-highlight-6)) 1;

  --border-gradient-without-top: linear-gradient(135deg, var(--guan-6), var(--guan-highlight-6)) 0 1 1 1;

  --hover-element-font-color: var(--color-font-5);
  --unhover-element-font-color: var(--light-gray-1-a90);

  background-color: var(--guan-10);
  width: inherit;
  height: 100vh;

  /* 取消背景色，防止出现白色闪现 */
  .el-menu {
    border-right: none;
    background-color: unset;
  }
  .el-menu-item:focus {
    background-color: unset;
  }
  .el-submenu__title:focus{
    background-color: unset;
  }
    /* 覆盖宽度 */
  .el-menu-item {
    min-width: auto;
  }

  > ul {
    > .el-submenu {
      /* 有子菜单的一级菜单 */
      &.is-active {
        .el-submenu__title {
          /* 重置 is-active 状态的border-bottom */
          border-bottom-color: none !important;
        }
      }
      > .el-submenu__title {
        border-top: 1px solid transparent;
        border-bottom: 1px dashed #0C305A;
        color: var(--unhover-element-font-color);
        .el-submenu__icon-arrow {
          color: var(--unhover-element-font-color);
        }
        &:hover {
          .idss-svg-icon {
            fill: var(--hover-element-font-color);
          }
          .el-submenu__icon-arrow {
            color: var(--hover-element-font-color);
          }
          color: var(--hover-element-font-color);
          font-weight: bold;
          background: var(--menu-level1-hover-bg);
          border-image: var(--border-gradient);
        }
      }
    }
    > .el-menu-item {
      /* 无子菜单的一级菜单 */
      border-top: 1px solid transparent;
      border-bottom: 1px dashed #0C305A;
      color: var(--unhover-element-font-color);
      &:hover {
        background: var(--menu-level1-hover-bg);
        border-image: var(--border-gradient);
      }
    }
    > li {
      /* svg */
      .idss-svg-icon {
        /* fill: var(--unhover-element-font-color); */
        width: 18px;
        height: 18px;
        margin-right: 8px;
        vertical-align: middle;
      }
      &.is-opened {
        .idss-svg-icon {
          fill: var(--hover-element-font-color);
        }
        background: var(--menu-level2-opened-bg);
        .el-submenu__title {
          .el-submenu__icon-arrow {
            color: var(--hover-element-font-color);
          }
          border-image: var(--border-gradient);
          background: var(--menu-level1-hover-bg);
          color: var(--hover-element-font-color);
          font-weight: bold;
        }
      }
      &:hover + .is-opened .el-submenu__title{
        border-image: var(--border-gradient-without-top);
      }
      > ul {
        > .el-menu-item {
          /* 二级菜单 */
          padding-right: 0px;
          padding-left: 24px !important;
          padding-top: 9px;
          padding-bottom: 9px;
          color: var(--unhover-element-font-color);
          &.is-active {
            .menu-item-level2 {
              /* 二级菜单 active */
              background: var(--menu-level2-hover-bg);
              border-top-left-radius: 16px;
              border-bottom-left-radius: 16px;
              color: var(--hover-element-font-color);
              font-weight: bold;
            }
          },
          .menu-item-level2 {
            height: 32px;
            line-height: 32px;
            padding-left: 16px;
          }
          &:hover {
            background-color: unset;
            .menu-item-level2 {
              /* 二级菜单 hover */
              color: var(--hover-element-font-color);
              font-weight: bold;
              background: var(--menu-level2-hover-bg);
              border-top-left-radius: 16px;
              border-bottom-left-radius: 16px;
            }
          }
        }
      }
    }
  }
}
</style>
