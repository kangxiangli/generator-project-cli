<template>
  <div class="app-header-container">
    <aside class="left-content">
      <span class="logo-container">
        <img class="logo" :src="logo" alt="logo" />
      </span>
      <span class="title">{{title || '项目系统平台'}}</span>
    </aside>
    <el-row
      type="flex"
      justify='end'
      class="app-header-level1-nav">
      <template v-for="menu in menus">
        <div
          v-if="!menu.meta.hidden"
          :key="menu.name"
          @click="openLevel2Menus(menu)">{{menu.meta.title}}</div>
        <p v-if="!menu.meta.hidden" :key="menu.name"></p>
      </template>
    </el-row>
    <aside>
      <!-- 用户 -->
      <ul class="info">
        <!-- 换肤 start -->
        <li>
          <el-dropdown>
            <span class="el-dropdown-link">
              <idss-icon-svg name="skins"></idss-icon-svg>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="({label, value}, index) in themeListData" :key="index" :divided="index > 0" @click.native="changeTheme(value)">
                {{label}}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </li>
        <!-- 换肤 end -->
        <!-- 消息通知 start -->
        <li>
          <el-dropdown>
            <span class="el-dropdown-link">
              <el-badge v-if="unreadMsgCount > 0" is-dot>&nbsp;</el-badge>
              <idss-icon-svg name="user"></idss-icon-svg>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <router-link :to="{name: 'user-msg'}" tag="li">消息中心 {{unreadMsgCount == 0 ? '' : unreadMsgCount}}</router-link>
              </el-dropdown-item>
              <el-dropdown-item divided>
                <router-link :to="{name: 'user-download-center'}" tag="li">下载中心</router-link>
              </el-dropdown-item>
              <el-dropdown-item @click.native="infoDialogVisible = true" divided>用户信息</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </li>
        <!-- 消息通知 end -->
        <!-- 退出系统 start -->
        <li @click="handleLogout" v-if="!$store.getters['base/globalConfig$$']('IS_HIDDEN_LOGOUT_BTN')">
          <idss-icon-svg name="off"></idss-icon-svg>
        </li>
        <!-- 退出系统 end -->
      </ul>
    </aside>

    <!-- 消息提示弹窗 start -->
    <msg-notify @unreadMsgCount="(count) => unreadMsgCount = count"></msg-notify>
    <!-- 消息提示弹窗 end -->
    <!-- 用户信息 start -->
    <idss-user-info :visible.sync="infoDialogVisible"></idss-user-info>
    <!-- 用户信息 end -->
  </div>
</template>

<script>
import logo from '@/assets/images/logo-idss.png'
import msgNotify from '@/views/user/msg-components/msg-notify'
import idssUserInfo from '@/views/user/user-info.vue'
import userMixins from '@/mixins/userMixins.js'
import themeService from '@components/theme/switch-theme.service'
import { $setTheme } from 'fusion-charts/lib/install'
export default {
  name: 'app-header',
  mixins: [userMixins, themeService],
  components: {
    msgNotify,
    idssUserInfo
  },
  data () {
    return {
      logo,
      themeListData: [
        {
          value: 'default',
          label: '默认'
        },
        {
          value: 'blue',
          label: '蓝色'
        },
        {
          value: 'dark',
          label: '灰色'
        },
        {
          value: 'guan-blue1',
          label: '观安蓝1'
        },
        {
          value: 'guan-blue2',
          label: '观安蓝2'
        },
        {
          value: 'guan-blue-green',
          label: '观安蓝绿'
        }
      ],
      unreadMsgCount: 0,
      infoDialogVisible: false,
      passwordCollapse: false,
      title: this.$store.getters['base/globalConfig$$']('GLOBAL_TITLE')
    }
  },
  computed: {
    menus () {
      return this.$store.state.permission.menuList
    }
  },
  methods: {
    // 打开二级菜单或跳转到点击的链接
    openLevel2Menus (menu) {
      console.log('openLevel2Menus', menu.children || [])
      this.$store.commit('permission/SET_LEVEL2_MENUS', menu.children || [])
    },
    // 退出系统
    handleLogout () {
      this.$confirm('确认要退出系统吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 退出系统请求
        this.logout()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    changeTheme (theme = 'default') {
      this.themeChange(theme) // 组件库换肤
      $setTheme(theme)  // 图表库换肤
    }
  }
}
</script>
<style scoped lang="postcss">
.app-header-container {
  --header-title-font-size: var(--font-size-1);
  --header-bg: linear-gradient(135deg, var(--guan-7), var(--guan-highlight-7));
  --header-title-color: var(--light-gray-1-a90);
  --header-nav-hover-bg: linear-gradient(90deg, var(--guan-highlight-6-a10), var(--guan-highlight-6-a60), var(--guan-highlight-6-a10));
  --header-nav-hover-border: linear-gradient(90deg, var(--guan-highlight-6-a10), var(--guan-highlight-6), var(--guan-highlight-6-a10)) 15;

  --header-border: solid var(--line-size-default);
  --header-border-image: linear-gradient(135deg, var(--guan-highlight-6), var(--guan-6)) 1;
  --header-z-index: var(--zindex-header);
  --header-title-shadow: 0px 1px 2px var(--guan-highlight-8);
  --header-icon-color: var(--light-gray-1-a60);
  --header-icon-color-hover: var(--light-gray-1);
  --header-icon-bg: var(--guan-highlight-6);
  --header-icon-item-border: var(--guan-8) solid var(--line-size-default);
  --header-icon-item-shadow: inset 1px 0 0 var(--guan-6);
  --hover-element-font-color: var(--color-font-5);
  --unhover-element-font-color: var(--light-gray-1-a90);

  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: var(--header-z-index);
  height: 52px;
  width: 100%;
  background: var(--header-bg);
  border-bottom: var(--header-border);
  border-image: var(--header-border-image);
  .left-content {
    display: table;
    .logo-container {
      display: table-cell;
      vertical-align: middle;
      .logo {
        height: 32px;
        margin: 0 16px;
        vertical-align: inherit;
      }
    }

    .title {
      position: relative;
      display: inline-block;
      height: 52px;
      line-height: 52px;
      vertical-align: text-bottom;
      box-sizing: border-box;
      font-size: var(--header-title-font-size);
      font-weight: bolder;
      color: var(--header-title-color);
      -webkit-background-clip: text;
      text-shadow: var(--header-title-shadow);
    }
  }

  .app-header-level1-nav{
    color: #fff;
    flex: 1;
    height: 52px;
    line-height: 48px;
    div {
      box-sizing: border-box;
      padding: 0px 16px;
      color: var(--light-gray-1-a80);
      border-top: 4px solid transparent;
      &:hover {
        color: var(--light-gray-1);
        background: var(--header-nav-hover-bg);
        font-weight: bold;
        border-image: var(--header-nav-hover-border);
        background-repeat:no-repeat;
      }
    }
    p {
      margin-top: 20px;
      height: 16px;
      width: 1px;
      border-right: 1px solid var(--light-gray-1-a40);
      &:last-child {
        border-right: none;
        margin-right: 16px;
      }
    }
  }

  .info {
    height: 52px;
    &:after {
      clear: both;
    }
    li {
      &:hover {
        .idss-svg-icon {
          fill: var(--header-icon-color-hover);
        }
      }
      width: 40px;
      height: inherit;
      float: left;
      border: 0;
      box-sizing: border-box;
      cursor: pointer;
      .el-dropdown {
        width: 100%;
        height: 100%;
      }
      .el-dropdown-link {
        width: 100%;
        height: 100%;
        position: relative;
        display: block;
      }
      .el-badge {
        position: absolute;
        top: 30%;
        right: 30%;
      }
      .idss-svg-icon {
        width: 25px;
        height: 25px;
        border-radius: 50%;
        fill: var(--header-icon-color);
        background-color:var(--header-icon-bg);
        margin-top: 15px;
        padding: 5px;
      }
    }
  }

}
</style>
