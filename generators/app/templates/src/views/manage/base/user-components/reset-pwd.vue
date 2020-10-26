<template>
  <div class="manage-base-reset-pwd">
    <!-- 收缩按钮 -->
    <div class="manage-base-reset-pwd__collapse">
      <el-row>
        <el-col :offset="2">
          <el-button size="medium" type="text" @click="isShowEditPwd">
            修改密码
            <idss-icon-svg :name="icon"></idss-icon-svg>
          </el-button>
        </el-col>
      </el-row>
    </div>
    <!-- 修改密码弹框 -->
    <div class="manage-base-reset-pwd__box" v-if="isShow">
      <el-row>
        <el-col :span="20" :offset="2">
          <el-form ref="manage-base-reset-pwd" label-width="120px"  size='medium' :model="setData" :rules="pwdRules">
            <el-form-item label="新密码：" prop="password" :error="errors.password">
              <el-input placeholder="请输入密码" type="password" v-model.trim="setData.password" style="width: 50%"></el-input>
            </el-form-item>
            <el-form-item label="确认新密码：" prop="passwordConfirm" :error="errors.passwordConfirm">
              <el-input placeholder="请输入密码" type="password" v-model.trim="setData.passwordConfirm" style="width: 50%"></el-input>
            </el-form-item>
            <el-form-item>
              <slot name="button"></slot>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import { validatePwd } from 'fusion-utils'
export default {
  name: 'manage-base-reset-pwd',
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    // 接口返回错误
    errors: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      setData: {
        password: '',
        passwordConfirm: ''
      }
    }
  },
  computed: {
    icon () {
      return this.isShow ? 'arrow-top' : 'arrow-botton'
    }
  },
  methods: {
    // 校验密码
    validatePwdIsSame (rule, value, callback) {
      if (this.setData.password && this.setData.passwordConfirm && this.setData.password.trim() !== this.setData.passwordConfirm.trim()) {
        callback(new Error('新密码与确认密码必须相同'))
      } else {
        callback()
      }
    },

    /**
     * 切换密码修改展示
     */
    isShowEditPwd () {
      this.$emit('changeShow', !this.isShow)
    },
    /**
     * 重置修改密码表单
     */
    resetPwd () {
      this.setData.password = ''
      this.setData.passwordConfirm = ''
      // 重置
      this.$refs['manage-base-reset-pwd'] && this.$refs['manage-base-reset-pwd'].clearValidate()
    },
    /**
     * 父级组件获取当前设置密码
     */
    async getPwd () {
      const isvalid = await this.$refs['manage-base-reset-pwd'].validate()
      if (isvalid) {
        return this.setData
      }
      return isvalid
    }
  },
  created () {
    this.pwdRules = {
      password: [
        { type: 'string', required: true, message: '请输入新密码', trigger: 'blur' },
        { min: 8, max: 32, validator: validatePwd, trigger: 'blur' },
        { validator: this.validatePwdIsSame, trigger: 'blur' }
      ],
      passwordConfirm: [
        { type: 'string', required: true, message: '请输入确认密码', trigger: 'blur' },
        { min: 8, max: 32, validator: validatePwd, trigger: 'blur' },
        { validator: this.validatePwdIsSame, trigger: 'blur' }
      ]
    }
  }
}
</script>

<style scoped lang="postcss">
  .manage-base-reset-pwd {
    &__box {
      background: rgba(246, 246, 246, 1);
      border-top: 1px solid rgba(204, 204, 204, 1);
      border-bottom: 1px solid rgba(204, 204, 204, 1);
      padding: 20px 0 0;
      margin-bottom: 15px;
    }
  }
</style>
