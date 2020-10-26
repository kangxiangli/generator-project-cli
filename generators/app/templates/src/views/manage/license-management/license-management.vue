<template>
  <div class="license-management">
    <el-row>
      <el-col :span="24">
        <idss-widget style="padding: 10px">
          <template slot="title-left">
            授权注册
          </template>
          <template>
            <idss-widget
              class="regist-instruction"
              shadow="never"
              style="padding: 10px 0px 10px 30px">
              <span style="line-height: 30px;">注册说明</span>
              <p>1、正式license，需向商务联系人申请。申请时请提交页面上的SN号、版本号</p>
              <p>2、临时license，可向项目经理、商务联系人、产品线负责人申请</p>
              <p>3、申请获得license后，将license文件在本页面上传即可完成注册。</p>
              <el-form
                style="margin-top: 30px"
                :model="form"
                label-width="100px">
                <el-form-item label="SN号">
                  <span>{{form.snNumber}}</span>
                </el-form-item>
                <el-form-item label="版本号">
                  <span>{{form.version}}</span>
                </el-form-item>
                <el-form-item label="license文件">
                  <el-upload
                    ref="upload"
                    action="string"
                    :limit="1"
                    :multiple="false"
                    :auto-upload="false"
                    :headers="{
                      authToken: $store.getters['base/token$$']
                    }"
                    :on-exceed="() => showMessage('已达到文件上传限制，请删除后再试！', 'info')"
                    :on-change="importChange"
                    :on-remove="fileRemove"
                    :file-list="importFileList">
                    <el-button
                      type="primary"
                      plain
                      slot="trigger">浏览</el-button>
                  </el-upload>
                </el-form-item>
                <el-form-item style="margin-top: 20px;">
                  <el-button
                    type="primary"
                    @click="confirmRegister">确认注册</el-button>
                </el-form-item>
                <span style="display: inline-block;margin-top: 27px">注册信息</span>
                <el-form-item label="有效期限">
                  <span :style="nowDate > form.expired ? {color: 'red'} : {}">
                    {{showPeriodInfo(form.expired)}}
                  </span>
                </el-form-item>
              </el-form>
            </idss-widget>
          </template>
        </idss-widget>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { formatDate } from 'fusion-utils'
import globalMixins from '@/mixins/globalMixins.js'
import Service from '@/views/manage/license-management/license-management-service.js'

export default {
  name: 'manage-license-management',
  mixins: [globalMixins, Service],
  data () {
    return {
      form: {
        snNumber: '',
        version: '',
        expired: ''
      },
      nowDate: new Date().getTime(),
      importFileList: []
    }
  },
  methods: {
    init () {
      this.getRegisterInfo()
    },
    // 有效期限类型
    showPeriodInfo (val) {
      if (!val) return '未激活'
      return this.nowDate > val ? '已过期' : formatDate.call(new Date(val), 'yyyy-MM-dd')
    },
    // 文件改变
    importChange (file, fileList) {
      this.importFileList = fileList
    },
    // 确认注册
    confirmRegister () {
      if (!this.importFileList.length) return this.showMessage('请选择文件后再注册！', 'info')
      return this.getConfirmRegister()
    },
    // 移除文件
    fileRemove (file, fileList) {
      this.importFileList = fileList.slice(0)
    }
  },
  created () {
    this.init()
  }
}
</script>
<style lang="postcss" scoped>
.license-management {
  & .regist-instruction {
    & p {
      color: #929fb4;
    }
  }
}
</style>
