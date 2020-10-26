<template>
  <div v-loading="loading['manage-base-user-info']">
    <el-form label-width="140px" size="medium" detailed>
      <el-row>
        <el-col :span="12">
          <el-form-item label="用户账号">
            {{userData.saltKey}}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="用户姓名">
            {{userData.name}}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="用户工号">
            {{userData.userNumber}}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="用户性别">
            {{dict.sex[userData.sex]}}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="联系电话">
            {{userData.telephone}}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="电子邮箱">
            {{userData.email}}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="部门">
            {{userData.sysDepart}}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="直属领导">
            {{userData.leader}}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="角色">
            {{userData.sysRole}}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="账号使用结束日">
            {{userData.expiredTime|formatDate}} <!-- todos 接口没有-->
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="登陆策略">
            {{userData.onLineStrategyName}} <!-- todos 接口没有-->
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!-- 修改密码start -->
    <resetPwd ref="resetPwd" :isShow="isPwdShow" @changeShow="changePwdShow" :errors="pwdErrors">
      <template slot="button">
        <el-button size="medium" @click="savePwd" type="primary">保存</el-button>
      </template>
    </resetPwd>
    <!-- 修改密码end -->
  </div>
</template>
<script>
import service from '../user-service.js'
import { getErrorMsgByEnd } from '@/custom/utils/base.js'
import globalMixins from '@/mixins/globalMixins.js'
import resetPwd from './reset-pwd.vue'
export default {
  name: 'manage-base-user-info',
  props: {
    userId: {
      type: String,
      default: ''
    }
  },
  mixins: [globalMixins, service],
  components: {
    resetPwd
  },
  data () {
    return {
      // 字典
      dict: {
        // 性别
        sex: {
          'true': '女',
          'false': '男'
        },
        // 用户是否锁定
        isLocked: {
          'true': '锁定',
          'false': '正常'
        }
      },
      userData: {
        saltKey: '',      // 用户账号
        name: '',         // 用户姓名
        userNumber: '',   // 用户工号
        sex: '',          // 用户性别
        telephone: '',    // 联系电话
        email: '',        // 电子邮箱
        sysDepart: '',    // 部门
        leader: '',       // 直属领导
        sysRole: '',      // 角色
        createTime: '',   // 账号使用开始日
        expiredTime: '',  // 账号使用结束日
        isLocked: '',     // 状态
        updateTime: ''   // 最后登录时间
      },
      // 编辑密码窗口是否展示
      isPwdShow: false,
      pwdErrors: {}
    }
  },
  methods: {
    /**
       * 修改密码保存
       */
    async savePwd () {
      this.$set(this, 'pwdErrors', {})
      const pwdData = await this.$refs['resetPwd'].getPwd()
      if (this.isPwdShow && pwdData) {
        try {
          await this.editPwd(pwdData, this.userId)
          // 成功提示
          this.showMessage('修改密码成功！')
          this.isPwdShow = false
        } catch (err) {
          // 判断修改密码接口返回校验错误
          this.$set(this, 'pwdErrors', getErrorMsgByEnd(err))
        }
      }
    },
    /**
       * 修改密码弹框是否展示监听
       */
    changePwdShow (isShow) {
      this.isPwdShow = isShow
    }
  },
  created () {
    this.getUserInfo(this.userId)
  }
}
</script>
