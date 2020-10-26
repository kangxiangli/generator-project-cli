<template>
  <div class="manage-software">
    <idss-drag-container width="25%" :min-left-width="350" :min-right-width="550">
      <template slot="dragTarget">
        <idss-widget
          :main-style="{padding: '10px'}"
          :global-style="{border: 'none', backgroundColor: 'transparent'}"
          shadow='nerver'>
          <template slot="title-left">
            软件管理
          </template>
          <!-- 搜索 -->
          <el-row class="search">
            <el-col>
              <el-input
                v-model="filterText"
                size="small"
                placeholder="请输入搜索条件&&搜索内容展示"
                disabled>
                <template slot="suffix">
                  <button class="idss-button-icon">
                    <idss-icon-svg name="search" class="search_icon"></idss-icon-svg>
                  </button>
                </template>
              </el-input>
            </el-col>
          </el-row>
          <!-- 操作按钮 -->
          <el-row style="display: none">
            <el-col :span="5">
              <el-button size="medium" custom>折叠</el-button>
            </el-col>
          </el-row>
          <!-- 树结构 -->
          <el-row>
            <el-col>
              <!-- 临时图标 -->
              <idss-icon-svg name="circle-manage-outline" class="tempIcon"></idss-icon-svg>
              <el-tree
                :data="treeData"
                :props="{
                  children: 'children',
                  label: 'label'
                }"
                default-expand-all
                ref="tree">
              </el-tree>
            </el-col>
          </el-row>
        </idss-widget>
      </template>
      <!-- 右侧 -->
      <idss-widget
        v-loading="loading['manage-license-query']"
        :main-style="{padding: '10px 0 10px 20px'}"
        :global-style="{border: 'none', boxShadow: 'none'}">
        <template slot="title-left">
          授权注册
        </template>
        <!-- 每个条目 -->
        <el-row>
          <el-col class="explain">
            <h6>注册说明：</h6>
            <ul>
              <li>1、根据页面上的机器ID、产品代号以及版本号填写申请单</li>
              <li>2、提交lincense申请流程，选择产品负责人，由产品负责人联系研发人员</li>
              <li>3、将lincense文件上传至堡垒机构，进行注册。</li>
            </ul>
          </el-col>
        </el-row>
        <!-- 每个条目 -->
        <el-row>
          <el-col>
            <el-form
              label-width="80px"
              ref="authForm"
              class="manage-auth__form">
              <el-form-item label="机器ID" prop="machineID">
                <el-input size="small" v-model="licenseInfo.machineId" disabled></el-input>
              </el-form-item>
              <el-form-item label="产品代号" prop="productCode">
                <el-input size="small" v-model="licenseInfo.prodName" disabled></el-input>
              </el-form-item>
              <el-form-item label="版本号" prop="versions">
                <el-input size="small" v-model="licenseInfo.version" disabled></el-input>
              </el-form-item>
              <el-form-item label="授权注册" prop="authRegister">
                <el-input size="small" v-model="authForm.authRegister" disabled class="authRegisterInput"></el-input>
                <el-upload
                  ref="licenseRegister"
                  action="/api/license"
                  :headers="{
                    authtoken: $store.getters['base/token$$']
                  }"
                  :multiple="false"
                  :show-file-list="false"
                  :file-list="uploadLicense"
                  :on-change="uploadChangeLicense"
                  :before-upload="uploadBeforeLicense"
                  :on-success="uploadSuccessLicense"
                  :on-error="uploadErrorLicense"
                  :auto-upload="false">
                  <el-button slot="trigger" type="primary" size="small" plain>上传</el-button>
                  <el-button plain size="small" :disabled="!authForm.authRegister" @click="submitUpload">注册</el-button>
                </el-upload>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
        <!-- 每个条目 -->
        <el-row>
          <el-col class="register">
            <h6>注册信息</h6>
            <ul>
              <li>是否注册<em>{{licenseInfo.registed}}</em></li>
              <li>版本型号<em>{{licenseInfo.versionType}}</em></li>
              <li>有效期限<em>{{licenseInfo.limitPeriod}}</em></li>
            </ul>
          </el-col>
        </el-row>
      </idss-widget>
    </idss-drag-container>
  </div>
</template>

<script>
import globalMixins from '@/mixins/globalMixins.js'
import deptService from './software-service.js'

export default {
  name: 'manage-software',
  mixins: [globalMixins, deptService],
  data () {
    return {
      filterText: '',
      treeData: [
        {
          id: 1,
          label: 'license管理'
        }
      ],
      // 授权注册
      authForm: {},
      // license信息
      licenseInfo: {},
      // license注册接口
      uploadLicense: [],
      uploadRules: {} // 校验规则
    }
  },
  methods: {
    // 上传
    submitUpload () {
      this.$refs.licenseRegister.submit()
    },
    // 文件状态改变时的钩子
    uploadChangeLicense (file, fileList) {
      this.uploadBeforeLicense(file)
    },
    // 上传前的验证
    uploadBeforeLicense (file, ck) {
      this.$set(this.authForm, 'authRegister', file.name)
      // this.uploadRules.rule_excel = /\.xls$|\.xlsx$/

      // if (!this.uploadRules.rule_excel.test(file.name)) { // 文件类型限制
      //   this.showMessage('文件类型错误！', 'error')
      //   ck && ck()
      //   return false
      // } else if (file.size > this.globalFileSizeLimit) {  // 文件大小限制
      //   this.showMessage(`上传的文件大小不能超过 ${formatByte(this.globalFileSizeLimit, 0)}!`, 'error')
      //   ck && ck()
      //   return false
      // } else {
      //   return true
      // }
    },
    // 上传文件  成功
    uploadSuccessLicense (response, file, fileList) {
      if (response.status === 'success') {
        this.showMessage((response && response.message) || '上传成功', 'success')
      } else {
        // 上传文件失败 staus === 'error'
        this.showMessage((response && response.message) || '上传失败', 'error')
      }
    },
    // 上传文件  失败
    uploadErrorLicense (err, file, fileList) {
      this.showMessage((err && err.message) || '上传失败', 'error')
    }
  },
  created () {
    this.getLicenseQuery()  // license信息查询接口
  }
}
</script>

<style lang="postcss" scoped>
.manage-software {
  /* 外层 */
  & >>> .idss-drag {
    & .idss-drag__target {
      background: rgba(249, 249, 249, 1);
    }
  }

  /* 搜索 */
  & .search {
    margin-bottom:  10px;

    /* icon @特殊处理 */
    .idss-svg-icon {
      fill: #999;
    }
  }

  /* 左侧树结构 */
  & >>> .el-tree {
    position: relative;
    color: #606d7c;
    font-weight: bold;
    background: transparent;
  }

  /* 右侧 */
  & >>> .idss-drag__aside {
    background: #fff;
  }

  /* license管理 */
  & .explain {
    h6 {
      margin-bottom: 10px;
    }
    ul > li {
      color: #94a2b4;
      line-height: 28px;
    }
  }

  & .register {
    h6 {
      margin-bottom: 10px;
    }
    ul > li {
      line-height: 28px;

      em {
        display: inline-block;
        color: #94a2b4;
        padding-left: 10px;
      }
    }
  }

  & .manage-auth__form {
    margin-top: 10px;
    & .authRegisterInput {
      display: inline-block;
      width: calc(100% - 148px);

      &+ div {
        display: inline-block;

        & button {
          margin-left: 10px;
        }
      }
    }
  }

  /* 临时图标 */
  & .tempIcon {
    position: relative;
    fill: #606d7c;
    transform: translate(3px, 23px);
    z-index: 1;
  }
}
</style>