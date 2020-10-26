<template>
  <div>
    <el-transfer
      v-loading="loading.initUser"
      class="idss-margin--b-m"
      filterable
      :filter-method="filterMethod"
      filter-placeholder="请输入角色或者用户名"
      :titles="['待选择', '已选择']"
      :render-content="renderFunc"
      :format="{
        noChecked: '${total}',
        hasChecked: '${checked}/${total}'
      }"
      v-model="selected"
      :data="allUser">
    </el-transfer>
    <div class="idss-txt--center">
      <el-button custom type="primary" size="small" @click="confirm">确定</el-button>
      <el-button custom @click="$emit('update:visible', false)" size="small">取消</el-button>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    selectUserList: Array
  },
  data () {
    return {
      loading: {},
      selected: this.selectUserList.map(val => val.userId),
      allUser: [],
      filterMethod (query, item) {
        return item.label.indexOf(query) > -1 || (item.roleName && item.roleName.indexOf(query) > -1)
      },
      renderFunc (h, option) {
        return <span>{option.label} <span style="font-size: 12px;">({option.roleName})</span></span>
      }
    }
  },
  watch: {
    selectUserList: {
      deep: true,
      handler () {
        this.selected = this.selectUserList.map(val => val.userId)
      }
    }
  },
  methods: {
    confirm () {
      // 返回一个 user list，而不单单只有userID
      this.$emit('update:selectUserList', this.allUser.filter(val => this.selected.includes(val.userId)))
      this.$emit('update:visible', false)
    }
  },
  created () {
    this.$request({
      method: 'post',
      url: '/api/sys/user/query',
      tag: 'initUser',
      data: {
        pageSize: 10000,
        pageNum: 1
      }
    }, {
      isPromptError: true
    }).then(content => {
      this.allUser = content.data.map(val => {
        return {
          key: val.userId,
          label: val.realName || val.userName,
          ...val
        }
      })
    })
  }
}
</script>
