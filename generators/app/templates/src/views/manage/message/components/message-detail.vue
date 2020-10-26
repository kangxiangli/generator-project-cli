<template>
  <div class="message-detail-container" v-loading="loading['message-detail']">
    <el-form label-width="140px" plain>
      <el-col :span="12">
        <el-form-item label="告警类型：">
          <span>{{message.type}}</span>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="配置名称：">
          <span>{{message.name}}</span>
        </el-form-item>
      </el-col>
      <el-form-item label="消息标题：">
        <span>{{message.title}}</span>
      </el-form-item>
      <el-form-item label="收件人：">
        <span>{{userNameList}}</span>
      </el-form-item>
      <el-form-item label="备注：">
        <span>{{message.remark}}</span>
      </el-form-item>
      <el-form-item label="内容示例：">
        <div v-html="message.mailContent" class="mail-content"></div>
      </el-form-item>
      <div class="dialog-footer idss-txt--center">
        <el-button @click="close" size="small" type="primary" custom>关 闭</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import globalMixins from '@/mixins/globalMixins.js'

export default {
  name: 'message-detail',
  props: ['id'],
  mixins: [globalMixins],
  data () {
    return {
      message: {}
    }
  },
  computed: {
    userNameList () {
      let userList = this.message.userList
      let nameList = []
      if (Array.isArray(userList)) {
        for (let { userName } of userList) {
          nameList.push(userName)
        }
      }
      return nameList.join('，')
    }
  },
  watch: {
    id: {
      handler (val, oldVal) {
        this.getDetailData(val)
      },
      immediate: true
    }
  },
  methods: {
    async getDetailData (id) {
      this.message = await this.$request({
        url: `/api/mail-configuration/detail/${id}`,
        tag: 'message-detail'
      })
    },
    close () {
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style scoped lang="postcss">
.message-detail-container {
  .mail-content {
    border: 1px solid none;
    padding: 5px 10px;
    line-height: 25px;
  }
}
</style>
