<template>
  <el-form
    class="idss-login-form"
    ref="loginForm"
    :model="loginForm"
    @submit.native.prevent>
    <!-- 用户名或密码 错误提示 -->
    <transition name="el-zoom-in-top">
      <p class="idss-login--error">
        <span v-show='loginFormError.userName'>{{loginFormError.userName}}</span>
      </p>
    </transition>
    <el-form-item prop="userName"
      :rules="{required: true, message: '用户名不能为空'}"
      :error="loginFormError.userName">
      <el-input
        v-model.trim="loginForm.userName"
        @blur="handleBlur"
        placeholder="请输入用户名">
        <template slot="prefix">
          <idss-icon-svg name="user"></idss-icon-svg>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item
      class="idss-login-code"
      prop="password"
      :rules="{required: true, message: '用户密码不能为空'}"
      :error="loginFormError.password">
      <el-input
        v-model.trim="loginForm.password"
        @blur="handleBlur"
        type="password"
        placeholder="请输入密码"
        maxlength=32>
        <template slot="prefix">
          <idss-icon-svg name="clock"></idss-icon-svg>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item
      class="idss-login-code"
      prop="authCode"
      :rules="{required: true, message: '验证码不能为空'}"
      :error="loginFormError.authCode">
      <el-input
        v-model="loginForm.authCode"
        prop="code"
        @keyup.enter="login"
        placeholder="请输入验证码"
        maxlength=4>
        <template slot="prefix">
          <idss-icon-svg name="fengxian"></idss-icon-svg>
        </template>
        <template slot="append">
          <span v-loading="loading['auth-code']" v-if="authCodeSrc" @click="getAuthCode">
            <img :src="authCodeSrc" alt="验证码" />
          </span>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item class="login-button-container">
      <button class="login-button" @click.enter="login">登 录</button>
    </el-form-item>
    <el-form-item class="idss-login-link idss-txt--center" size="small">
      <a @click="changeMode('forgotPwd')">忘记密码？</a>
    </el-form-item>
  </el-form>
</template>

<script>
import { getErrorMsgByEnd } from '@/custom/utils/base.js'
import { rsaCrypt } from '@/custom/utils/password.js'

const API = {
  LOGIN: {
    url: '/api/login',
    method: 'post',
    tag: 'login'
  }
}

export default {
  props: {
    authToken: {
      type: String,
      default: ''
    },
    authCodeSrc: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      loading: {},
      loginForm: {
        userName: '',
        password: '',
        authCode: ''
      },
      loginFormError: {}   // 错误提示
    }
  },
  methods: {
    changeMode (mode) {
      this.$refs['loginForm'].clearValidate()
      this.$emit('changeMode', mode)
    },
    /**
       * 登录 - 用户名和密码失去焦点事件
       */
    handleBlur () {
      this.loginFormError = {}
    },
    getAuthCode () {
      this.$emit('getAuthCode')
    },
    /**
       * 用户登录
       */
    login () {
      this.$refs['loginForm'].validate(async (valid) => {
        if (valid) {
          this.loginFormError = {}
          let requestData = Object.assign({}, this.loginForm, {
            password: rsaCrypt(this.loginForm.password)
          })
          try {
            let { token, isExpire, userId } = await this.$request({
              ...API.LOGIN,
              data: {
                ...requestData,
                authToken: this.authToken
              }
            })

            if (isExpire === 1 || isExpire === '1') {
              // 密码已超过更换周期，强制显示修改密码
              this.changeMode('modifyPwd')
              this.$emit('setUserId', userId)
            } else {
              // 存储 token
              this.$store.commit('base/token$$', token)
              // 路由跳转
              let { redirect } = this.$route.query
              if (redirect) {
                delete this.$route.query.redirect
                this.$router.push({
                  path: redirect
                })
              } else {
                this.$router.push({ name: 'index' })
              }
            }
          } catch (error) {
            console.log('error', error)
            // 错误提示
            this.getAuthCode()
            this.loginFormError = getErrorMsgByEnd(error)
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>
