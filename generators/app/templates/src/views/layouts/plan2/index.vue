<template>
  <el-container>
    <el-header>
      <app-header></app-header>
    </el-header>
    <el-container>
      <el-aside :class="{'menu--collapse': !isMenuOpen}">
        <app-menu :isMenuOpen="isMenuOpen"></app-menu>
      </el-aside>
      <el-main>
        <div class="navigator">
          <app-navigator></app-navigator>
        </div>
        <app-main></app-main>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import BusFactory, { EventName } from '@bus'
import appHeader from './app-header.vue'
import appMenu from './app-menu.vue'
import appNavigator from './app-navigator.vue'

import appMain from '../components/app-main.vue'

export default {
  name: 'layout-default',
  components: {
    appHeader,
    appMain,
    appMenu,
    appNavigator
  },
  data () {
    return {
      isMenuOpen: true
    }
  },
  created () {
    BusFactory(this).$on(EventName.MENU_TOGGLE_STATUS, (isMenuOpen) => {
      this.isMenuOpen = isMenuOpen
    })
  }
}
</script>

<style lang="postcss">
@media screen and (max-width: 1250px) {
  body {
    overflow-x: scroll;
    overflow-y: hidden;
  }
}
@media screen and (min-width: 1250px) {
  body {
    overflow: hidden;
  }
}
</style>
<style scoped lang="postcss">
.el-container {
  width: 100%;
  height: 100%;
  .el-header {
    padding: 0;
    height: 52px !important; /* 覆盖el-header动态添加的高度 */
  }
  .el-container {
    .el-aside {
      overflow: hidden;
      width: 0px !important; /* 覆盖el-aside动态添加的高度 */
      transition: width var(--transition-duration)
        var(--transition-timing-function);
      will-change: width;
    }
    .el-aside:not(.menu--collapse) {
      width: 180px !important; /* 覆盖el-aside动态添加的高度 */
    }
    .el-main {
      width: 100%;
      height: 100%;
      overflow: auto;
      padding: 45px 0px;
      display: flex;
      flex-direction: column;
      .navigator {
        height: 45px;
      }
    }
  }
}
</style>
