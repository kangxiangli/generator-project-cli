<template>
  <el-form
    class="idss-login-form"
    ref="forgotPwdForm"
    :model="forgotPwdForm"
    @submit.native.prevent>
    <!-- 用户名或密码 错误提示 -->
    <transition name="el-zoom-in-top">
      <p class="idss-login--error">
        <span v-show='forgotPwdFormError.userName'>
          {{forgotPwdFormError.userName}}
        </span>
      </p>
    </transition>
    <el-form-item
      prop="userName"
      :rules="{required: true, message: '用户名不能为空'}"
      :error="forgotPwdFormError.userName">
      <el-input
        v-model="forgotPwdForm.userName"
        @blur="HandleBlurForgotPwd"
        placeholder="请输入用户名">
        <template slot="prefix">
          <idss-icon-svg name="user"></idss-icon-svg>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item
      prop="email"
      :rules="[
        {required: true, message: '邮箱不能为空'},
        {type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur'}
      ]"
      :error="forgotPwdFormError.email">

      <el-input
        v-model="forgotPwdForm.email"
        @blur="HandleBlurForgotPwd"
        placeholder="请输入邮箱地址">
        <template slot="prefix">
          <idss-icon-svg name="email"></idss-icon-svg>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item class="login-button-container">
      <el-row :gutter="24">
        <el-col :span="12">
          <button class="login-button" @click.enter="findPassword">找回密码</button>
        </el-col>
        <el-col :span="12">
          <button class="login-button" @click="changeMode('login')">返回登录</button>
        </el-col>
      </el-row>
    </el-form-item>
  </el-form>
</template>

<script>
import { getErrorMsgByEnd } from '@/custom/utils/base.js'
const API = {
  FORGOT_PWD: {
    url: '/api/password-find',
    method: 'post',
    tag: 'login'
  }
}
export default {
  data () {
    return {
      loading: {},
      forgotPwdForm: {
        userName: '',
        email: ''
      },
      forgotPwdFormError: {}  // 错误提示
    }
  },
  methods: {
    changeMode (mode) {
      this.$refs['forgotPwdForm'].clearValidate()
      this.$emit('changeMode', mode)
    },
    /**
       * 忘记密码 - 用户名和email时区焦点事件
       */
    HandleBlurForgotPwd () {
      this.forgotPwdFormError = {}
    },
    /**
       * 找回密码
       */
    findPassword () {
      this.$refs['forgotPwdForm'].validate(async (valid) => {
        if (valid) {
          let resetPwdHref = this.$router.resolve({ name: 'password-reset' }).href
          this.forgotPwdFormError = {}
          try {
            await this.$request({
              ...API.FORGOT_PWD,
              data: {
                ...this.forgotPwdForm,
                locationHref: `${location.origin}${resetPwdHref}`
              }
            })
            // 找回密码成功
            this.$message({
              type: 'success',
              message: '验证成功，请前往邮箱继续找回密码操作',
              duration: 6000
            })
            this.$refs['forgotPwdForm'].resetFields()
          } catch (error) {
            // 错误提示
            this.forgotPwdFormError = getErrorMsgByEnd(error)
          }
        }
      })
    }
  }
}
</script>
