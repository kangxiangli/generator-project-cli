<template>
  <div>
    <!-- 解析部分 start -->
    <idss-widget
      :global-style="{'padding-bottom': '10px'}"
      :main-style="{padding: '10px 0 0'}"
      shadow="never">
      <el-form ref="form" :model="formData" label-width="160px" size="medium" plain>
        <el-form-item label="选择模板类型:">
          <el-row :gutter="10">
            <el-col :span="4">
              <el-select v-model="formData.fileType" placeholder="请选择">
                <el-option
                  :label="item.label"
                  :key="item.value"
                  :value="item.value"
                  v-for="item in fileTypeListData"></el-option>
              </el-select>
            </el-col>
            <el-col :span="5">
              <el-button type="primary" plain @click="downloadTmpl">模板下载</el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="文件上传:">
          <el-row>
            <el-col :span="7">
              <el-upload
                ref="upload"
                action="/api/monitor/configuration-client/import/analysis"
                :headers="{
                  authToken: $store.getters['base/token$$']
                }"
                :data="formData"
                :limit="1"
                :multiple="false"
                :auto-upload="false"
                :show-file-list="true"
                :on-change="uploadChange"
                :on-success="uploadSuccess"
                :on-error="uploadError"
                :on-exceed="uploadExceed"
                :on-remove="removeUploadFile">
                <el-button size="mini" type="primary" plain custom>上传</el-button>
              </el-upload>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="遇到重复解决方案:">
          <el-radio-group :disabled="isCover" v-model="formData.repeatType">
            <el-radio label="1">覆盖</el-radio>
            <el-radio label="0">跳过</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template slot="footer">
        <el-button @click="parseUploadFile" v-if="parsingCompleteFlag">解析</el-button>
        <el-tag type="success" v-else>已解析 {{parsedData.total}}</el-tag>
      </template>
    </idss-widget>
    <!-- 解析部分 end -->
    <!-- 数据展示部分 start -->
    <idss-widget shadow="never" class="custom-widget">
      <template slot="title-left">
        <el-row class="custom-sub-title">
          <el-col :span="8">
            <label>总体数据数量：</label>
            <span>{{ parsedData.total }}</span>
          </el-col>
          <el-col :span="8">
            <label>解析成功：</label>
            <span>{{ parsedData.successCnt }}</span>
          </el-col>
          <el-col :span="8">
            <span>解析失败数据数量：</span>
            <span>{{ parsedData.failCnt }}</span>
          </el-col>
        </el-row>
      </template>
      <el-table :data="parsedData.errorRowNo" border stripe>
        <el-table-column type="index" width="45" label="序号" align="center"></el-table-column>
        <el-table-column prop="n2" label="数据行" align="center">
          <template slot-scope="scope">{{scope.row}}</template>
        </el-table-column>
      </el-table>
    </idss-widget>
    <!-- 数据展示部分 end -->
    <!-- 按钮组 start -->
    <div class="idss-txt--center">
      <el-button
        type="primary"
        size="medium"
        :disabled="isConfirmedDisabled"
        @click="confirm">确定</el-button>
      <el-button size="medium" @click="cancel">取消</el-button>
    </div>
    <!-- 按钮组 end -->
  </div>
</template>
<script>
import globalMixins from '@/mixins/globalMixins.js'
import { download } from '@/custom/utils/upload-download.js'
import { debounce, formatByte } from 'fusion-utils'

const BASE_URL = '/api/monitor/configuration-client'
const API = {
  // 批量导入：模版下载
  ASSET_DOWNLOAD_TEMPLATE: {
    url: BASE_URL + '/import/download',
    method: 'post'
  },
  // 批量导入：确定
  ASSET_CONFIRM_IMPORT: {
    url: BASE_URL + '/import',
    method: 'post'
  }
}
const LIMIT_SIZE = 1024 * 1024 * 2
export default {
  name: 'client-monitor-import-dialog',
  mixins: [globalMixins],
  data () {
    return {
      // 文件类型
      fileTypeListData: [
        { value: 'txt', label: 'TXT' },
        { value: 'csv', label: 'CSV' },
        { value: 'excel', label: 'EXCEL' }
      ],
      // 解析完成标识
      parsingCompleteFlag: true,
      // 文件上传附件参数
      formData: {
        fileName: '',             // 解析后生成的后台生成的临时文件名
        fileType: 'excel',        // 文件类型
        repeatType: '1'           // string 覆盖方式 1 覆盖 2 跳过
      },
      // 解析后的数据
      parsedData: {
        total: 0,
        successCnt: 0,
        failCnt: 0,
        errorRowNo: [],
        status: 0
      },
      // 遇到重复解决方案：点击解析后不可选，失败后或者删除已删除的文件才可选
      isCover: false,
      // 第二步按钮默认禁用
      isConfirmedDisabled: true
    }
  },
  methods: {
    // 模板下载
    downloadTmpl () {
      this.getDownloadTmplData()
    },
    // 下载模版
    async getDownloadTmplData () {
      let { fileName = '' } = await this.$request({
        ...API.ASSET_DOWNLOAD_TEMPLATE,
        data: {
          fileType: this.formData.fileType
        }
      })
      download(fileName)
    },
    // 解析
    parseUploadFile: debounce(function () {
      if (!this.formData.fileName) {
        return this.showMessage('请先上传文件，再解析！', 'warning')
      }
      this.isCover = true
      this.$refs.upload.submit() // 上传文件
    }, 300),
    // 文件超出个数限制时的钩子
    uploadExceed () {
      this.showMessage('已达到文件上传限制，请删除后再试！', 'info')
    },
    // 文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
    uploadChange (file = {}) {
      if (this.validateFile(file)) {
        this.formData.fileName = file.name
      }
    },
    // 删除上传的文件
    removeUploadFile () {
      this.parsingCompleteFlag = true
      this.isCover = false
    },
    // 解析：成功
    uploadSuccess (response = {}, file, fileList) {
      if (response.status === 'success') {
        let { fileName = '' } = response.content
        this.formData.fileName = fileName
        this.parsedData = response.content
        // 解析文件成功
        this.parsingCompleteFlag = false  // 解析中
        this.isConfirmedDisabled = false
      }
    },
    // 解析：失败
    uploadError (err, file, fileList) {
      this.isConfirmedDisabled = true // 解析失败，确定按钮变灰
      this.isCover = false
      this.showMessage((err && err.message) || '上传文件解析失败', 'error')
    },
    // 确定按钮
    async confirm () {
      await this.confirmImport()
      this.$emit('update:visible', false)
    },
    // 导入的确定按钮
    async confirmImport () {
      try {
        await this.$request({
          ...API.ASSET_CONFIRM_IMPORT,
          data: this.formData
        })
      } catch (err) {
        this.showMessage((err && err.message) || '导入失败', 'error')
      }
    },
    // 取消按钮
    cancel () {
      // 1. 关闭弹框
      this.$emit('update:visible', false)
      // 2. 重置数据
      this.parsedData = {
        total: 0,
        successCnt: 0,
        failCnt: 0,
        errorRowNo: []
      }
    },
    // 导入 上传前的验证
    validateFile (file) {
      let fileTypes = {
        txt: /\.txt$/,
        xml: /\.xml$/,
        csv: /\.csv$/,
        excel: /\.xls$|\.xlsx$/,
        sql: /\.sql$/,
        json: /\.json$/
      }
      if (!fileTypes[this.formData.fileType].test(file.name)) { // 文件类型限制
        this.showMessage('文件格式不正确请重新上传', 'error')
        this.$refs.upload.clearFiles()
        return false
      } else if (file.size > LIMIT_SIZE) {  // 文件大小限制
        this.showMessage(`上传的文件大小不能超过 ${formatByte(LIMIT_SIZE)}!`, 'error')
        this.$refs.upload.clearFiles()
        return false
      } else {
        return true
      }
    }
  }
}
</script>

<style lang="postcss" scoped>
.custom-widget {
  --panel-bg-color-base: #f2f2f2;
  border: 1px solid var(--panel-bg-color-base);
  & .custom-sub-title {
    font-size: var(--font-size-4);
  }
}
</style>
