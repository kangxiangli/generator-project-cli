<template>
  <el-form
    ref="modifyPwdForm"
    :model="modifyPwdForm"
    size="small"
    class="idss-login-form"
    :rules="formRules"
    @submit.native.prevent>
    <el-form-item
      prop="password"
      :error="modifyFormError.password">
      <el-input
        type="password"
        v-model.trim="modifyPwdForm.password"
        @blur="HandleBlurForgotPwd"
        placeholder="请输入新密码"
        size="small">
        <template slot="prefix">
          <idss-icon-svg name="clock"></idss-icon-svg>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item
      prop="passwordConfirm"
      :error="modifyFormError.passwordConfirm">
      <el-input
        type="password"
        v-model.trim="modifyPwdForm.passwordConfirm"
        @blur="HandleBlurForgotPwd"
        placeholder="请输入确认密码"
        size="small">
        <template slot="prefix">
          <idss-icon-svg name="clock"></idss-icon-svg>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item class="login-button-container">
      <el-row :gutter="24">
        <el-col :span="12">
          <button
            class="login-button"
            @click.enter="modifyPassword">修改密码</button>
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
import { rsaCrypt } from '@/custom/utils/password.js'
import { validatePwd } from 'fusion-utils'
const API = {
  MODIFY_PWD: {
    url: '/api/sys/user/pwd-expire-time/update',
    method: 'post',
    tag: 'login'
  }
}

export default {
  props: {
    userId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      // 修改密码 - 表单
      modifyPwdForm: {
        password: '',
        passwordConfirm: ''
      },
      modifyFormError: {}, // 修改密码的错误提示信息
      forgotPwdFormError: {},  // 错误提示
      formRules: {
        password: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { validator: validatePwd, trigger: 'blur' }
        ],
        passwordConfirm: [
          { required: true, message: '请输入确认密码', trigger: 'blur' },
          { validator: validatePwd, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    /**
       * 改变当前视图模式
       * @params type: 要更改的模式类型
       */
    changeMode (mode) {
      this.$refs['modifyPwdForm'].clearValidate()
      this.$emit('changeMode', mode)
    },

    /**
       * 忘记密码 - 用户名和email时区焦点事件
       */
    HandleBlurForgotPwd () {
      this.forgotPwdFormError = {}
    },

    /**
       *
       * 修改密码
      */
    async modifyPassword () {
      try {
        await this.$refs['modifyPwdForm'].validate()
      } catch (err) {
        return
      }
      this.modifyFormError = {}
      let modifyRequestData = Object.assign(
        {},
        this.modifyPwdForm,
        {
          password: rsaCrypt(this.modifyPwdForm.password),
          passwordConfirm: rsaCrypt(this.modifyPwdForm.passwordConfirm)
        }
      )
      try {
        await this.$request({
          ...API.MODIFY_PWD,
          data: {
            ...modifyRequestData,
            userId: this.userId
          }
        })
        this.$message.success('修改成功!')
        this.changeMode('login')
      } catch (error) {
        // 错误提示
        this.modifyFormError = getErrorMsgByEnd(error)
      }
    }
  }
}
</script>
