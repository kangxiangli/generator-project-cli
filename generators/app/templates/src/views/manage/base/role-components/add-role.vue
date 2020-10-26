<template>
  <div class="add-role">
    <!-- 部门新增/编辑 start -->
    <idss-widget :main-style="{padding: '10px', height: '765px'}" :global-style="{border: 'none', margin: '0'}">
      <template slot="title-left">{{detailTitle}}</template>
      <!-- 新增、编辑状态 -->
      <template v-if="editType === 'add' || editType === 'edit'">
        <el-form
          :model="roleInfo"
          :rules="rules"
          label-width="100px"
          ref="roleForm"
          @submit.native.prevent
          v-loading="loading['manage-base-role-detail']">
          <el-row>
            <el-col :span="12">
              <el-form-item label="角色名称" prop="roleName" :error="errors.roleName">
                <el-input v-model.trim="roleInfo.roleName"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="角色描述" prop="roleDesc" :error="errors.roleDesc">
                <el-input
                  v-model="roleInfo.roleDesc"
                  type="textarea"
                  resize="none"
                  :rows="2"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="角色权限">
            <idss-widget>
              <div
                class="idss-txt-link"
                @click="toggleCollapse('funTree')">
                {{isCollapse ? '收起全部' : '展开全部'}}
                <idss-icon-svg :name="isCollapse ? 'arrow-top' : 'arrow-botton1'"></idss-icon-svg>
              </div>
              <el-form-item prop="moduleIds" :error="errors.moduleIds">
                <div style="height: 500px" v-iscroll>
                  <el-tree
                    ref="funTree"
                    class="left-tree"
                    empty-text="暂无数据"
                    node-key="sysModulesId"
                    :data="operationList"
                    :props="{
                      children: 'children',
                      label: (data) => {
                        return data.meta.title
                      },
                      disabled: isDisabled
                    }"
                    :expand-on-click-node="false"
                    :default-checked-keys="roleInfo.moduleIds"
                    default-expand-all
                    @check-change="permissionCheckChange()"
                    highlight-current
                    show-checkbox
                    v-loading="loading['manage-base-user-role-function-permission']"></el-tree>
                </div>
              </el-form-item>
            </idss-widget>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="medium" custom @click="saveDetail">保存</el-button>
            <el-button size="medium" custom @click="resetDetail">重置</el-button>
          </el-form-item>
        </el-form>
      </template>
      <!-- 详情展示 -->
      <template v-else>
        <el-form
          label-width="100px"
          @submit.native.prevent
          type="text">
          <el-form-item label="角色名称">{{roleInfo.roleName}}</el-form-item>
          <el-form-item label="角色描述">{{roleInfo.roleDesc}}</el-form-item>
          <el-form-item label="角色权限">
            <el-row>
              <el-col :span="24">
                <idss-widget>
                  <button
                    @click="toggleCollapse('funTree')"
                    class="idss-button-text mybtn">
                    <span v-text="isCollapse ? '收起全部' : '展开全部'"></span>
                    <idss-icon-svg :name="isCollapse ? 'arrow-top' : 'arrow-botton1'"></idss-icon-svg>
                  </button>
                  <el-form-item>
                    <div style="height: 500px" v-iscroll>
                      <el-tree
                        ref="funTree"
                        empty-text="暂无数据"
                        node-key="sysModulesId"
                        :data="operationList"
                        class="left-tree"
                        :props="{
                          children: 'children',
                          label: (data) => {
                            return data.meta.title
                          },
                          disabled: isDisabled
                        }"
                        default-expand-all
                        :expand-on-click-node="false"
                        :default-checked-keys="roleInfo.moduleIds"
                        highlight-current
                        show-checkbox
                        disabled-checkbox
                        v-loading="loading['manage-base-user-role-function-permission']"></el-tree>
                    </div>
                  </el-form-item>
                </idss-widget>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item>
            <el-button type="medium" custom v-if="roleInfo.editDele !== 2" @click="editRole">编辑</el-button>
          </el-form-item>
        </el-form>
      </template>
    </idss-widget>
  </div>
</template>
<script>
import globalMixins from '@/mixins/globalMixins.js'
import service from '../role-service.js'
import { getErrorMsgByEnd } from '@/custom/utils/base.js'
import { debounce } from 'fusion-utils'
export default {
  name: 'idss-add-role',
  mixins: [globalMixins, service],
  props: {
    sysRolesId: {
      type: [String, Number]
    }
  },
  computed: {
    detailTitle () {
      const typeList = {
        'add': '角色新增',
        'edit': '角色编辑',
        'info': '角色详情'
      }
      return typeList[this.editType]
    }
  },
  watch: {
    sysRolesId: {
      immediate: true,
      handler () {
        this.init()
      }
    },
    editType (newValue) {
      // 详情状态 checkbox 可操作
      if (newValue === 'info') {
        this.switchFuncDisable('operationList', true)
      } else {
        // 新增编辑状态 checkbox 可操作
        this.switchFuncDisable('operationList', false)
      }
    }
  },
  data () {
    return {
      isCollapse: true,
      roleInfo: {},
      moduleIdsTemp: [],  // 缓存编辑显示的角色权限
      // 设置编辑状态
      editType: 'add', // 'info','add', 'edit'
      errors: {},
      operationList: [] // 操作权限列表
    }
  },
  methods: {
    isDisabled () {
      return this.editType === 'info'
    },
    init () {
      this.$set(this, 'errors', {})
      // 判断编辑状态获取数据
      if (this.sysRolesId) {
        this.getRoleInfo(this.sysRolesId)
        this.editType = 'info'
      } else {
        // 新增状态
        this.editType = 'add'
      }
      this.$refs['roleForm'] && this.$refs['roleForm'].clearValidate()
    },

    // 重置提交表单
    async resetDetail () {
      this.$set(this, 'errors', {})
      // 编辑状态
      if (this.sysRolesId) {
        await this.getRoleInfo(this.sysRolesId, () => {
          this.$refs['funTree'].setCheckedKeys([])
          this.roleInfo.moduleIds = this.moduleIdsTemp
        })
      } else {
        await this.addRole()
      }
    },

    /**
       * 保存角色
       */
    saveDetail: debounce(async function () {
      this.$refs['roleForm'].validate(async (valid) => {
        if (valid) {
          try {
            this.$set(this.roleInfo, 'moduleIds', this.$refs['funTree'].getCheckedKeys().concat(this.$refs['funTree'].getHalfCheckedKeys()))
            const data = await this.addOrEditRole(this.roleInfo, this.roleInfo.sysRolesId)
            this.showMessage(`${this.detailTitle}成功`)
            // 新增、编辑成功后显示详情页面
            this.editType = 'info'
            this.$set(this, 'roleInfo', data)
            this.$emit('saveRole', data)

            if (this.sysRolesId === data.sysRolesId) {
              this.init()
            } else {
              // 更新sysRolesId
              this.$emit('update:sysRolesId', data.sysRolesId)
            }

            // 手动设置被选择的节点，否则在新增与编辑之间切换时 el-tree ui 无法更新
            this.$refs.funTree.setCheckedKeys(this.roleInfo.moduleIds || [])
          } catch (err) {
            this.$set(this, 'errors', getErrorMsgByEnd(err))
          }
        }
      })
    }, 300),

    /**
       * 添加角色
       */
    async addRole () {
      this.editType = 'add'
      this.$set(this, 'errors', {})
      this.$set(this, 'roleInfo', JSON.parse(JSON.stringify(this.defaultRoleDetail)))
      this.$refs.funTree.setCheckedKeys([])
      this.$refs['roleForm'] && this.$refs['roleForm'].clearValidate()
    },

    /**
       * 获取角色详情
       * @param {string} sysRolesId
       */
    async getRoleInfo (sysRolesId, ck) {
      try {
        await this.getRoleDetail(sysRolesId)
        // 手动设置被选择的节点，否则在新增与编辑之间切换时 el-tree ui 无法更新
        this.$refs.funTree.setCheckedKeys(this.roleInfo.moduleIds || [])
        this.$refs['roleForm'] && this.$refs['roleForm'].clearValidate()
        ck && ck()
      } catch (err) {
        this.showMessage(err.message, 'error')
      }
    },

    /**
      * 操作权限 复选框点选触发
      */
    permissionCheckChange () {
      this.$set(this.roleInfo, 'moduleIds', this.$refs['funTree'].getCheckedKeys())
    },

    /**
       * 权限树折叠操作
       * @param {string} refName
       */
    toggleCollapse (refName) {
      // 非常规解决方案
      Object.keys(this.$refs[refName].store.nodesMap).map((key, index) => {
        // 控制展开收起
        this.$refs[refName].store.nodesMap[key].expanded = !this.isCollapse
      })
      // 控制展开收起的title以及图标改变
      this.isCollapse = !this.isCollapse
    },

    /**
       * 编辑角色跳转
       */
    editRole () {
      this.editType = 'edit'
      this.handleEdit()
    },
    /** 特殊处理
     *    处理: 后端传来半选父节点id,导致子节点默认全选
     **/
    handleEdit () {
      let halfCheckedKeys = this.$refs['funTree'].getHalfCheckedKeys()  // 获取半选父节点id集合
      let moduleIdsTemp = this.roleInfo.moduleIds

      // 去除含有半选父节点的id
      for (let i = 0; i < halfCheckedKeys.length; i++) {
        for (let j = 0; j < moduleIdsTemp.length; j++) {
          if (halfCheckedKeys[i] === moduleIdsTemp[j]) {
            moduleIdsTemp.splice(j, 1)
            j--
          }
        }
      }
      this.roleInfo.moduleIds = moduleIdsTemp
      this.moduleIdsTemp = moduleIdsTemp // 缓存数据 方便重置使用
    }
  },
  async created () {
    // 校验规则
    this.rules = {
      roleName: [
        { required: true, message: '请输入角色名称', trigger: 'blur' },
        { max: 32, message: '长度32以内', trigger: 'blur' }
      ],
      roleDesc: [
        { max: 255, message: '长度255以内', trigger: 'blur' }
      ],
      moduleIds: [
        { type: 'array', required: true, message: '请选择操作权限' }
      ]
    }
    // 设置默认deptDetail数据
    this.defaultRoleDetail = {
      sysRolesId: '', // 角色id
      roleName: '',   // 角色名称
      roleDesc: '',   // 角色描述
      parentId: '',   // id
      enable: true,   // 数据权限
      moduleIds: [],
      editDele: 2
    }
    // 设置data属性
    this.$set(this, 'roleInfo', JSON.parse(JSON.stringify(this.defaultRoleDetail)))
    // 获取操作权限
    await this.getOperationList()
  }
}
</script>
