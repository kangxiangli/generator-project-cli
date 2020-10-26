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
import appMain from '../components/app-main.vue'
import appNavigator from './app-navigator.vue'

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

<style scoped lang="postcss">
.el-container {
  min-height: 100%;
  .el-header {
    padding: 0;
    height: 50px !important; /* 覆盖el-header动态添加的高度 */
  }
  .el-container {
    .el-aside {
      width: 62px !important; /* 覆盖el-aside动态添加的高度 */
      transition: width var(--transition-duration)
        var(--transition-timing-function);
      will-change: width;
    }
    .el-aside:not(.menu--collapse) {
      width: 180px !important; /* 覆盖el-aside动态添加的高度 */
    }
    .el-main {
      padding: 0;
      display: flex;
      flex-direction: column;
      .navigator {
        height: 45px;
      }
    }
  }
}
</style>
