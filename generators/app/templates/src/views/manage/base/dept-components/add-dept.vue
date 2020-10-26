<template>
  <!-- 部门新增/编辑 start -->
  <idss-widget :main-style="{padding: '15px',  height: '765px'}" :global-style="{border: 'none'}">
    <template slot="title-left">{{detailTitle}}</template>
    <!-- 新增、编辑 -->
    <template v-if="editType === 'edit' || editType === 'add'">
      <el-form
        :model="deptDetail"
        :rules="deptRules"
        label-width="90px"
        ref="deptForm"
        class="manage-base-dept__form"
        v-loading="loading['manage-base-dept-detail']">
        <el-row>
          <el-col :span="12">
            <el-form-item label="部门名称" prop="departName" :error="deptErrors.deptName">
              <el-input v-model.trim="deptDetail.departName"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="所在部门" prop="parentDeptName" :error="deptErrors.parent">
              <el-input
                v-model="deptDetail.parentDeptName"
                placeholder="请选择部门"
                readonly
                @click.native="showDeptDialog">
                <template slot="suffix">
                  <idss-icon-svg name="table"></idss-icon-svg>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="部门角色" prop="sysRoleId">
              <el-select
                v-model="deptDetail.sysRoleId"
                clearable
                collapse-tags
                placeholder="请选择角色"
                popper-class="test-roleId"
                style="width: 100%">
                <el-option
                  v-for="item in sysRolesData"
                  :key="item.sysRolesId"
                  :label="item.roleName"
                  :value="item.sysRolesId"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="部门描述" prop="departDesc" :error="deptErrors.deptDescribe">
              <el-input
                v-model="deptDetail.departDesc"
                type="textarea"
                resize="none"
                :rows="2"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <el-button type="primary" @click="saveDetail">保存</el-button>
          <el-button @click="resetDetail">重置</el-button>
        </el-form-item>
      </el-form>
    </template>
    <!-- 详情展示页面 -->
    <template v-else>
      <el-form
        class="manage-base-dept__form"
        label-width="90px"
        type="text"
        v-loading="loading['manage-base-dept-detail']">
        <el-form-item label="部门ID">{{deptDetail.sysDepartId}}</el-form-item>
        <el-form-item label="部门名称">{{deptDetail.departName}}</el-form-item>
        <el-form-item label="所在部门">{{deptDetail.parentDeptName}}</el-form-item>
        <el-form-item label="部门角色">{{deptDetail.sysRoleName}}</el-form-item>
        <el-form-item label="部门描述">{{deptDetail.departDesc}}</el-form-item>
        <el-form-item>
          <el-button type="medium" custom v-if="deptDetail.editDele !== 2" @click="editRole">编辑</el-button>
        </el-form-item>
      </el-form>
    </template>
    <!-- 部门弹框 -->
    <dept-tree-dialog
      :currentKey="deptDetail.parentId"
      :hide-name="deptDetail.departName"
      :hide-id="deptDetail.sysDepartId"
      :isShow="isShowDeptDialog"
      @closeDialog="closeDialog"></dept-tree-dialog>
  </idss-widget>
</template>
<script>
import deptTreeDialog from '../common/dept-tree-dialog.vue'
import globalMixins from '@/mixins/globalMixins.js'
import service from '../dept-service.js'
import { getErrorMsgByEnd } from '@/custom/utils/base.js'
import { debounce } from 'fusion-utils'
export default {
  name: 'idss-add-dept',
  props: {
    sysDepartId: {
      type: [String, Number]
    }
  },
  components: {
    deptTreeDialog
  },
  mixins: [globalMixins, service],
  computed: {
    detailTitle () {
      const typeList = {
        'add': '部门新增',
        'edit': '部门编辑',
        'info': '部门详情'
      }
      return typeList[this.editType]
    }
  },
  data () {
    return {
      deptDetail: {},
      // 设置编辑状态
      editType: 'add', // 'info','add', 'edit'
      deptErrors: {},
      isShowDeptDialog: false,
      sysRolesData: [],
      searchRoleId: {
        roleId: ''
      }
    }
  },
  watch: {
    sysDepartId: {
      immediate: true,
      handler () {
        this.init()
      }
    }
  },
  methods: {
    init () {
      this.getSysRoleList()
      this.$set(this, 'deptErrors', {})
      // 判断编辑状态获取数据
      if (this.sysDepartId) {
        this.getDeptDetail(this.sysDepartId)
        this.editType = 'info'
      } else {
        // 新增状态
        this.editType = 'add'
      }
      this.$refs['deptForm'] && this.$refs['deptForm'].clearValidate()
    },

    /**
       * 添加部门
       */
    addDept () {
      this.editType = 'add'
      this.$set(this, 'deptDetail', { ...this.defaultDeptDetail })
      this.$refs['deptForm'] && this.$refs['deptForm'].clearValidate()
    },

    /**
       * 获取部门详情
       * @param {string} sysDepartId
       */
    getDeptDetail: debounce(async function (sysDepartId) {
      try {
        await this.getDeptInfo(sysDepartId)
        this.$refs['deptForm'] && this.$refs['deptForm'].clearValidate()
      } catch (err) {
        this.showMessage(err.message, 'error')
      }
    }, 300),

    /**
       * 展示部门树弹框
       */
    showDeptDialog () {
      this.isShowDeptDialog = true
    },

    /**
       * 编辑页面展示跳转
       */
    editRole () {
      this.editType = 'edit'
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
        this.$set(this.deptDetail, 'parentId', currentNode.sysDepartId)
        this.$set(this.deptDetail, 'parentDeptName', currentNode.departName)
      }
    },

    // 重置提交表单
    async resetDetail () {
      // 编辑状态
      if (this.sysDepartId) {
        await this.getDeptDetail(this.sysDepartId)
      } else {
        this.addDept()
      }
    },

    /**
     * 保存 新增/编辑 部门信息
     */
    saveDetail: debounce(function () {
      this.$refs['deptForm'].validate(async (valid) => {
        if (valid) {
          try {
            const data = await this.addOrEditDept(this.deptDetail, this.deptDetail.sysDepartId)
            // TODOS 成功提示
            this.editType = 'info'
            this.$set(this, 'deptDetail', data)
            this.$emit('saveDept', data)

            if (this.sysDepartId === data.sysDepartId) {
              this.init()
            } else {
              // 更新sysDepartId
              this.$emit('update:sysDepartId', data.sysDepartId)
            }
          } catch (err) {
            this.$set(this, 'deptErrors', getErrorMsgByEnd(err))
          }
        }
      })
    }, 300)
  },

  created () {
    // 校验规则
    this.deptRules = {
      departName: [
        { required: true, message: '请输入部门名称', trigger: 'blur' },
        { max: 32, message: '长度32以内', trigger: 'blur' }
      ],
      parentDeptName: [
        { required: true, message: '请选择所属部门' }
      ],
      departDesc: [
        { max: 255, message: '长度255以内', trigger: 'blur' }
      ]
    }
    // 设置默认deptDetail数据
    this.defaultDeptDetail = {
      sysDepartId: '', // 部门ID
      departName: '', // 部门名称
      parentId: '', // 父部门ID
      parentDeptName: '', // 父部门名称
      departDesc: '', // 部门描述
      userCount: ''// 该部门人数
    }
    // 设置data属性
    this.$set(this, 'deptDetail', { ...this.defaultDeptDetail })
    this.init()
  }
}
</script>
<style scoped lang="postcss">
.el-form-item {
  white-space: normal;
  word-break: break-all;
}

.idss-widget {
  box-shadow: none;
}
</style>
