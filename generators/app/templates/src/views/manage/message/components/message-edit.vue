<template>
  <div>
    <el-form
      label-width="100px"
      size="small"
      :model="emailConfig"
      :rules="formRule"
      ref="form"
      v-loading="loading.init">
      <el-row>
        <el-col :span="12">
          <el-form-item label="告警类型：" prop="type">
            <el-select v-model="emailConfig.type">
              <el-option
                v-for="item in typeList"
                :key="item.id"
                :label="item.name"
                :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="配置名称：" prop="name">
            <el-select v-model="emailConfig.name">
              <el-option
                v-for="item in nameList"
                :key="item.id"
                :label="item.name"
                :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="消息标题：" prop="title">
        <el-input v-model="emailConfig.title" placeholder="请输入标题"></el-input>
      </el-form-item>
      <el-form-item label="收件人：" prop="userId">
        <div style="display: flex;">
          <el-input :value="recipient" disabled placeholder="请选择收件人"></el-input>
          <el-button custom size="medium" style="margin-left: 10px;" @click="addUser">添加收件人</el-button>
        </div>
      </el-form-item>
      <el-form-item label="备注：">
        <el-input v-model="emailConfig.remark" placeholder="请输入备注"></el-input>
      </el-form-item>
      <el-form-item label="内容示例：">
        <div v-html="mailContent[emailConfig.name]"></div>
      </el-form-item>
      <el-form-item style="text-align: center;">
        <el-button custom type="primary" @click="save">确定</el-button>
        <el-button custom @click="resetFields">重置</el-button>
        <el-button custom @click="resetFields();$emit('update:visible', false)">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
// import SelectUser from './message-user.vue'
export default {
  // components: { SelectUser },
  props: {
    type: String,
    id: String,
    selectUserList: Array
  },
  data () {
    return {
      loading: {},
      // 备份编辑详情内容，重置的时候使用，使用 resetFields 达不到预期
      emailConfigBack: {},
      userListBack: [],
      // 编辑详情内容
      emailConfig: {
        type: '',
        name: '',
        userId: '',
        remark: '',
        title: ''
      },
      // 配置名称中带的mailContent, 将其转换为 key value 形式
      mailContent: {},
      // 告警类型列表
      typeList: [],
      // 配置名称列表
      nameList: [],
      // 已选择的收件人列表
      userList: [],
      formRule: {
        type: [{ required: true, message: '请选择告警类型', trigger: 'change' }],
        name: [{ required: true, message: '请选择配置名称', trigger: 'change' }],
        title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        userId: [{ required: true, message: '请选择收件人', trigger: 'blur' }]
      }
    }
  },
  watch: {
    type: {
      immediate: true,
      handler () {
        this.init()
      }
    },
    id: {
      immediate: true,
      handler () {
        this.init()
      }
    },
    // 配置名称的 mailContetn 转换为key value 形式
    nameList: {
      deep: true,
      immediate: true,
      handler (newVal) {
        this.mailContent = {}
        newVal.forEach(val => {
          this.mailContent[val.id] = val.mailContent
        })
      }
    },
    selectUserList: {
      deep: true,
      handler () {
        this.userList = this.selectUserList
        this.emailConfig.userId = this.selectUserList.map(val => val.userId).join(',')
      }
    }
  },
  computed: {
    // 收件人
    recipient () {
      return this.userList.map(val => val.realName || val.userName).join(',')
    }
  },
  methods: {
    init () {
      this.emailConfig = {
        id: '',
        type: '',
        name: '',
        remark: '',
        title: ''
      }
      if (this.type === 'add') {
        this.initAdd()
      } else {
        this.initEdit()
      }
    },
    initAdd () {
      this.$request({
        url: '/api/mail-configuration/new',
        tag: 'init'
      }, {
        isPromptError: true
      }).then(data => {
        this.typeList = data.typeList
        this.nameList = data.nameList
        this.userList = []
        // 备份，新增的时候备份一个空的
        this.userListBack = []
        this.emailConfigBack = JSON.parse(JSON.stringify(this.emailConfig))
      })
    },
    initEdit () {
      this.$request({
        url: '/api/mail-configuration/mod/' + this.id,
        tag: 'init'
      }, {
        isPromptError: true
      }).then(data => {
        // 告警类型
        this.typeList = data.typeList
        // 配置名称
        this.nameList = data.nameList
        // 收件人列表
        this.userList = data.userList
        // 收件人列表备份
        this.userListBack = [...this.userList]
        const { id, type, name, remark, title } = data
        this.emailConfig = {
          id, type, name, remark, title
        }
        this.emailConfig.userId = this.userList.map(val => val.userId).join(',')
        // 备份
        this.emailConfigBack = JSON.parse(JSON.stringify(this.emailConfig))
      })
    },
    // 添加收件人
    addUser () {
      this.$emit('update:selectUserList', this.userList)
      this.$emit('update:userVisible', true)
    },
    // 重置表单至初始状态
    resetFields () {
      this.userList = [...this.userListBack]
      this.emailConfig = JSON.parse(JSON.stringify(this.emailConfigBack))
      this.$refs.form.clearValidate()
    },
    save () {
      const add = {
        url: '/api/mail-configuration/new',
        method: 'post'
      }
      const edit = {
        url: '/api/mail-configuration/mod',
        method: 'put'
      }
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$request({
            ...this.type === 'add' ? add : edit,
            tag: 'init',
            data: {
              ...Object.assign(this.emailConfig, { id: this.id })
            }
          }, {
            isPromptError: true
          }).then(_ => {
            this.$emit('update:visible', false)
            this.$emit('updated')
          })
        }
      })
    }
  }
}
</script>
