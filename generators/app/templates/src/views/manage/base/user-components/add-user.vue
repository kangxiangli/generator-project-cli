<template>
  <div class="manage-base-add-user" v-loading="loading['manage-base-user-info']">
    <el-form
      label-width="90px"
      ref="userAddForm"
      :model="userData"
      size="medium"
      :rules="userRules"
      :disabled="userData.editDele === 1">
      <el-row>
        <el-col :span="24">
          <div class="manage-base-add-user__sub-title">
            <span>用户基本信息</span>
          </div>
        </el-col>
      </el-row>
      <el-row v-if="!userId">
        <el-col :span="12">
          <el-form-item label="用户账号" prop="saltKey" :error="userRuleErrors.saltKey">
            <el-input v-model.trim="userData.saltKey" placeholder="请输入用户账号"></el-input>
          </el-form-item>
        </el-col>
        <!-- 新增状态展示初始密码 -->
        <el-col :span="12">
          <el-form-item label="密码" prop="saltValue" :error="userRuleErrors.saltValue">
            <el-col :span="11">
              <el-input
                v-model="userData.saltValue"
                auto-complete="off"
                disabled
                placeholder="密码"></el-input>
            </el-col>
            <el-col :span="4" :offset="1" style="line-height: 24px;">
              <el-button @click="setPassword">生成初始密码</el-button>
            </el-col>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="用户姓名" prop="name" :error="userRuleErrors.name">
            <el-input v-model.trim="userData.name" placeholder="请输入用户姓名"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="用户性别">
            <el-radio-group medium v-model="userData.sex">
              <el-radio :label="false">男</el-radio>
              <el-radio :label="true">女</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="用户工号" prop="userNumber" :error="userRuleErrors.userNumber">
            <el-input v-model="userData.userNumber" placeholder="请输入用户工号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="直属领导" prop="leader" :error="userRuleErrors.leader">
            <el-input v-model.trim="userData.leader" placeholder="请输入直属领导"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="联系电话" prop="telephone" :error="userRuleErrors.telephone">
            <el-input v-model.trim="userData.telephone" placeholder="请输入联系电话"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="电子邮箱" prop="email" :error="userRuleErrors.email">
            <el-input v-model.trim="userData.email" placeholder="请输入电子邮箱"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 新增状态展示部门 -->
      <el-row>
        <el-col :span="12">
          <el-form-item label="部门" prop="sysDepart" :error="userRuleErrors.sysDepartId">
            <el-input
              v-model="userData.sysDepart"
              placeholder="请选择部门"
              readonly
              @click.native="showDeptDialog">
              <template slot="suffix">
                <idss-icon-svg style="height: 28px;" name="table"></idss-icon-svg>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="登录策略" prop="onLineStrategy" :error="userRuleErrors.onLineStrategy">
            <el-select v-model="userData.onLineStrategy" placeholder="请选择">
              <el-option
                v-for="item in loginStrategy"
                :key="item.code"
                :label="item.name"
                :value="item.code"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <div class="manage-base-add-user__sub-title">
            <span>用户权限分配</span>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="角色" prop="roleId" :error="userRuleErrors.roleId">
            <el-select
              v-model="userData.sysRoleIds"
              multiple
              collapse-tags
              placeholder="请选择角色"
              popper-class="test-roleId"
              style="width: 100%">
              <el-option
                v-for="item in userRoleData"
                :key="item.sysRolesId"
                :label="item.roleName"
                :value="item.sysRolesId"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="状态" prop="isLocked">
            <el-radio-group medium v-model="userData.isLocked">
              <el-radio :label="true">锁定</el-radio>
              <el-radio :label="false">正常</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="账号有效期" prop="expiredTime" :error="userRuleErrors.expiredTime">
            <el-date-picker
              size="medium"
              v-model="userData.expiredTime"
              type="datetime"
              :clearable="false"
              value-format="timestamp"
              placeholder="选择账号有效期"></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!-- 修改密码start -->
    <reset-pwd
      v-if="userId"
      ref="resetPwd"
      :errors="pwdErrors"
      :isShow="isPwdShow"
      @changeShow="changePwdShow"></reset-pwd>
    <!-- 修改密码end -->
    <div class="el-dialog-footer idss-txt--center">
      <el-button type="primary" size="medium" @click="saveUser">保存</el-button>
      <el-button size="medium" @click="resetForm">重置</el-button>
      <el-button size="medium" @click="$emit('back')">取消</el-button>
    </div>
    <!-- 部门弹框 -->
    <dept-tree-dialog
      :currentKey="userData.deptId || ''"
      :isShow="isShowDeptDialog"
      @closeDialog="closeDialog"></dept-tree-dialog>
  </div>
</template>
<script>
import { getErrorMsgByEnd } from '@/custom/utils/base.js'
import service from '../user-service.js'
import globalMixins from '@/mixins/globalMixins.js'
import { debounce, generatePwd } from 'fusion-utils'
import resetPwd from './reset-pwd.vue'
import deptTreeDialog from '../common/dept-tree-dialog.vue'

// userdata 初始值
const userData = {
  sysUsersId: '',   // 唯一标识
  saltKey: '',      // 用户账号
  saltValue: '',    // 密码
  name: '',         // 用户姓名
  sex: true,          // 性别
  userNumber: '',   // 工号
  leader: '',       // 直属领导
  telephone: '',    // 联系电话
  email: '',        // 电子邮箱
  sysDepartId: '',  // 部门ID
  sysDepart: '',    // 部门
  sysRoleIds: [],   // 角色ID
  sysRole: [],      // 角色
  isLocked: false,     // 状态
  expiredTime: '',   // 过期时间
  onLineStrategy: ''
}
export default {
  name: 'manage-base-user-add',
  props: {
    userId: {
      type: String,
      default: ''
    }
  },
  mixins: [globalMixins, service],
  components: {
    deptTreeDialog,
    resetPwd
  },
  data () {
    return {
      userData: JSON.parse(JSON.stringify(userData)),
      userRoleData: [], // 角色列表
      // 接口校验错误信息
      userRuleErrors: {

      },
      // 编辑密码错误信息
      pwdErrors: {},
      isShowDeptDialog: false,
      // 编辑密码窗口是否展示
      isPwdShow: false,
      loginStrategy: []
    }
  },
  methods: {
    // 初始化函数
    async init () {
      try {
        this.getLoginStrategy()
        // 编辑状态获取用户信息
        if (this.userId) {
          await this.getUserInfo(this.userId, 'isEdit')
        } else {
          // 新增状态添加password校验
          this.userRules['saltValue'] = [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 8, max: 32, message: '长度8-32以内', trigger: 'blur' }
          ]
        }
        this.$refs['userAddForm'] && this.$refs['userAddForm'].clearValidate()
        // 获取角色列表
        await this.getUserRoleList()
      } catch (err) {
        this.showMessage(err.message, 'error')
      }
    },
    /**
       * 生成默认密码
       */
    setPassword () {
      this.$set(this.userData, 'saltValue', generatePwd())
      // 重新对字段进行校验
      this.$refs['userAddForm'].validateField('saltValue')
    },
    /**
       * 重置表单
       */
    resetForm () {
      // 编辑状态
      if (this.userId) {
        this.getUserInfo(this.userId)
      } else {
        // 添加状态
        this.$set(this, 'userData', JSON.parse(JSON.stringify(userData)))
        this.userData.expiredTime = ''
      }
      this.$refs['userAddForm'].clearValidate()
      // 修改密码重置
      this.$refs['resetPwd'] && this.$refs['resetPwd'].resetPwd()
    },

    /**
       * 保存用户信息
       */
    saveUser: debounce(function () {
      const apiList = []
      this.$set(this, 'userRuleErrors', {})
      this.$set(this, 'pwdErrors', {})
      this.$refs['userAddForm'].validate(async (valid) => {
        if (this.userData.sysDepartId === 'root') {
          this.showMessage('不能选择根节点部门', 'warning')
          return
        }
        if (valid) {
          // 判断编辑状态是否修改密码
          if (this.userId && this.isPwdShow) {
            const pwdData = await this.$refs['resetPwd'].getPwd()
            // 校验不通过，退出提交
            if (!pwdData) {
              return
            }
            apiList.push(this.editPwd(pwdData, this.userId))
          }
          apiList.push(this.saveOrEditUser(this.userData, this.userId))
          try {
            await Promise.all(apiList)
            // 成功提示
            this.showMessage(this.userId ? '编辑用户成功' : '新增用户成功')
            // 触发父组件，父组件监听保存成功
            this.$emit('save')
          } catch (err) {
            if (this.userId && JSON.stringify(err.message).match(/saltKey|saltValue/)) {
              // 判断修改密码接口返回校验错误
              this.$set(this, 'pwdErrors', getErrorMsgByEnd(err))
            } else {
              // 判断编辑用户接口返回校验错误
              this.$set(this, 'userRuleErrors', getErrorMsgByEnd(err))
            }
          }
        }
      })
    }, 300),
    /**
       * 展示部门树弹框
       */
    showDeptDialog () {
      this.isShowDeptDialog = true
    },

    /**
       * 关闭部门弹框
       * @param {bollean} isShow
       * @param {object} currentNode
       */
    closeDialog (isShow, currentNode) {
      this.isShowDeptDialog = isShow
      // 设置当前获取的部门信息
      if (currentNode) {
        this.$set(this.userData, 'sysDepartId', currentNode.sysDepartId)
        this.$set(this.userData, 'sysDepart', currentNode.departName)
      }
    },
    /**
       * 修改密码弹框是否展示监听
       */
    changePwdShow (isShow) {
      this.isPwdShow = isShow
    },

    /**
       * 账号有效期change事件
       */
    timeChange (time) {
      if (time && time.length) {
        this.userData.createTime = time[0]
        this.userData.expiredTime = time[1]
      } else {
        this.userData.createTime = ''
        this.userData.expiredTime = ''
      }
    }
  },
  created () {
    // 设置校验规则
    this.userRules = {
      saltKey: [
        { required: true, message: '请输入账号名称', trigger: 'blur' },
        { max: 32, message: '长度32以内', trigger: 'blur' }
      ],
      name: [
        { required: true, message: '请输入用户名称', trigger: 'blur' },
        { max: 32, message: '长度32以内', trigger: 'blur' }
      ],
      userNumber: { max: 50, message: '长度50以内', trigger: 'blur' },
      email: [
        { required: true, message: '电子邮箱不能为空', trigger: 'blur' },
        { type: 'email', message: '请输入正确电子邮箱', trigger: 'blur' },
        { max: 100, message: '长度100以内', trigger: 'blur' }
      ],
      sysDepart: [
        { required: true, message: '请选择部门' }
      ],
      telephone: [
        { max: 11, message: '长度11以内', trigger: 'blur' },
        { pattern: /^((\+|00)86)?1([358][0-9]|4[579]|6[67]|7[0135678]|9[189])[0-9]{8}$/, message: '手机号码格式不正确', trigger: 'blur' }],
      leader: { max: 32, message: '长度32以内', trigger: 'blur' },
      /* loginVoucher: { max: 100, message: '长度100以内', trigger: 'blur' }, */
      expiredTime: { required: true, message: '请选择账号有效期', trigger: 'change' },
      onLineStrategy: [
        { required: true, message: '请选择登录策略' }
      ]
    }

    this.init()
  }
}
</script>
<style scoped lang="postcss">
.manage-base-add-user {
  &__sub-title {
    margin-bottom: 10px;
    &::before {
      content: "";
      display: block;
      border-bottom: 1px solid var(--manage-add-user-border);
      position: absolute;
      top: 10px;
      width: 100%;
      z-index: 1;
      width: 87%;
      right: 0;
    }
  }
}
</style>
