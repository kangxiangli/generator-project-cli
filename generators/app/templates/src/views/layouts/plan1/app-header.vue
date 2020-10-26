<template>
  <div class="app-header-container">
    <aside class="left-content">
      <span class="logo-container">
        <img class="logo" :src="logo" alt="logo" />
      </span>
      <span class="title">{{title}}</span>
    </aside>
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
import logo from '@/assets/images/logo.png'
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
      logo: logo,
      unreadMsgCount: 0,
      infoDialogVisible: false,
      passwordCollapse: false,
      title: this.$store.getters['base/globalConfig$$']('GLOBAL_TITLE')
    }
  },
  methods: {
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
  --header-bg: linear-gradient(135deg, var(--guan-8), var(--guan-7));
  --header-border: solid var(--line-size-default);
  --header-border-image: linear-gradient(var(--guan-8), var(--guan-7)) 30;
  --header-z-index: var(--zindex-header);
  --header-title-font-size: var(--font-size-1);
  --header-title-color: var(--light-gray-1);
  --header-title-shadow: 0px 1px 2px var(--guan-highlight-8);
  --header-icon-color: var(--light-gray-1-a60);
  --header-icon-color-hover: var(--light-gray-1);
  --header-icon-item-border: var(--guan-8) solid var(--line-size-default);
  --header-icon-item-shadow: inset 1px 0 0 var(--guan-6);

  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: var(--header-z-index);
  height: inherit;
  width: 100%;
  background: var(--header-bg);
  border: var(--header-border);
  border-image: var(--header-border-image);
  .left-content {
    display: table;
    .logo-container {
      display: table-cell;
      vertical-align: middle;
      .logo {
        height: 36px;
        margin: 0 16px;
        vertical-align: inherit;
      }
    }

    .title {
      position: relative;
      display: inline-block;
      height: 50px;
      line-height: 50px;
      vertical-align: text-bottom;
      box-sizing: border-box;
      font-size: var(--header-title-font-size);
      font-weight: bolder;
      color: var(--header-title-color);
      -webkit-background-clip: text;
      text-shadow: var(--header-title-shadow);
    }
  }

  .info {
    height: 50px;
    &:after {
      clear: both;
    }
    li {
      &:hover {
        .idss-svg-icon {
          fill: var(--header-icon-color-hover);
        }
      }
      width: 50px;
      height: inherit;
      float: left;
      border: 0;
      border-left: var(--header-icon-item-border);
      box-shadow: var(--header-icon-item-shadow);
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
        width: 100%;
        height: 100%;
        padding: 32%;
        fill: var(--header-icon-color);
      }
    }
  }
}
</style>
