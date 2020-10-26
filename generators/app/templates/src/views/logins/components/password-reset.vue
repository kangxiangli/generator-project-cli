<template>
  <el-form class="idss-login-form password-reset" ref="form" :model="form" @submit.native.prevent>
    <transition name="el-zoom-in-top">
      <p v-if="formError.password" class="idss-login--error idss-txt--center">{{formError.password}}</p>
    </transition>
    <el-form-item prop="userName">
      <el-input v-model="form.userName" disabled>
        <template slot="prefix">
          <idss-icon-svg name="user"></idss-icon-svg>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item prop="passwordNew" :rules="rules.passwordNew">
      <el-input v-model="form.passwordNew" type="password" placeholder="长度为8-32位，不能为空">
        <template slot="prefix">
          <idss-icon-svg name="clock"></idss-icon-svg>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item prop="passwordConfirm" :rules="rules.passwordConfirm">
      <el-input v-model="form.passwordConfirm" type="password" placeholder="再次输入新密码">
        <template slot="prefix">
          <idss-icon-svg name="clock"></idss-icon-svg>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item class="login-button-container">
      <button class="login-button" @click.enter="resetPwd">重置密码</button>
    </el-form-item>
    <el-form-item>
      <div class="error-msg" v-show="showError">{{errorMsg}}</div>
    </el-form-item>
  </el-form>
</template>

<script>
import { getErrorMsgByEnd } from '@/custom/utils/base.js'
import { rsaCrypt } from '@/custom/utils/password.js'
import { validatePwd } from 'fusion-utils'

const API = {
  RESET_PWD: {
    url: '/api/password-reset',
    method: 'post',
    tag: 'login'
  }
}

export default {
  data () {
    return {
      // 表单
      form: {
        userName: '',
        passwordNew: '',
        passwordConfirm: ''
      },
      // 表单错误提示
      formError: {},
      // 表单验证规则
      rules: {
        passwordNew: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { validator: validatePwd, trigger: 'blur' }
        ],
        passwordConfirm: [
          { required: true, message: '请再次输入密码', trigger: 'blur' },
          { validator: validatePwd, trigger: 'blur' },
          { validator: this.checkPasswordRepeat, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    /**
       * 密码重复性校验
       */
    checkPasswordRepeat (rule, value, callback) {
      if (value !== this.form.passwordNew) {
        callback(new Error('两次输入密码不一致'))
      } else {
        callback()
      }
    },

    /**
       * 表单提交
       */
    resetPwd () {
      this.$refs['form'].validate(async (valid) => {
        if (valid) {
          this.formError = {}
          // 密码加密
          let requestData = Object.assign({}, this.form, {
            passwordNew: rsaCrypt(this.form.passwordNew),
            passwordConfirm: rsaCrypt(this.form.passwordConfirm)
          })
          try {
            await this.$request({
              ...API.RESET_PWD,
              data: {
                ...requestData,
                securityCode: this.securityCode
              }
            })
            // 成功提示
            await this.$message({
              type: 'success',
              message: '密码重置成功'
            })
            this.$refs['form'].resetFields()
            // 路由跳转 - 跳转到登录页
            this.$router.push({ name: 'login' })
          } catch (error) {
            // 错误提示
            this.formError = getErrorMsgByEnd(error)
            // 链接错误提示
            if (this.formError.securityCode) {
              this.showError = true
              this.errorMsg = this.formError.securityCode
            }
          }
        }
      })
    }
  },
  created () {
    // 通过query获取必要参数
    let { username, id } = this.$route.query
    // 缺少参数的情况，错误提示
    if (!username || !id) {
      this.showError = true
      this.errorMsg = '链接有误！'
    }
    this.form.userName = username
    this.securityCode = id
  }
}
</script>
