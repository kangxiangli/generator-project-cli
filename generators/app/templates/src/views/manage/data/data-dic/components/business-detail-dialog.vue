<template>
  <div>
    <el-row class="idss-margin--b-m" style="text-align: right;">
      <el-button size="small" type="primary" @click="fileDownLoad" :disabled="!isEnable" custom>下载模版</el-button>
    </el-row>

    <el-table v-loading="loading['dictionary-detail-table']" :data="tableDataDetail.data"
      border stripe>
      <el-table-column label="序号" width="45px" type="index" align="center"></el-table-column>
      <el-table-column
        show-overflow-tooltip
        align="center"
        v-for="(item,index) in tableHeaderData"
        :key="index"
        :label="item.fieldName"
        :prop="item.fieldName"></el-table-column>
    </el-table>
    <el-row class="idss-txt--center">
      <idss-pagination
        style="padding: 10px;"
        :tableData="tableDataDetail"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @page-change="handleSizeChange"></idss-pagination>
    </el-row>

    <el-row class="idss-txt--right" style="margin-top: 15px;">
      <el-upload
        :disabled="!isEnable"
        class="upload-demo"
        :limit="1"
        ref="upload"
        :action="'/api/setting/etl/dict/upload?dictName=' + this.downloadname + '&process=' + this.uploadType"
        :headers="{
          authToken: $store.getters['base/token$$']
        }"
        :on-exceed="() => showMessage('已达到文件上传限制，请删除后再试！', 'info')"
        :file-list="fileList"
        :on-success="uploadSuccess"
        :on-error="uploadError">
        <el-button
          :disabled="!isEnable"
          slot="trigger"
          size="small"
          type="primary"
          @click="submitUpload"
          custom>数据上传</el-button>
        <el-checkbox :disabled="!isEnable" style="margin-right:10px" v-model="isCover">是否覆盖</el-checkbox>
      </el-upload>
    </el-row>
  </div>
</template>
<script>
import { request } from '@/custom/plugins/request.js'
import globalMixins from '@/mixins/globalMixins.js'
import Service from './business-detail-service.js'
export default {
  name: 'business-detail-dialog',
  mixins: [ globalMixins, Service ],
  props: {
    data: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  computed: {
    isEnable: function () {
      return this.data.dictEditable
    }
  },
  data () {
    return {
      tableDataDetail: {
        pageNum: 1,
        pageSize: 20
      },  // 表格内容
      tableHeaderData: [],  // 表格头部（动态）
      downloadname: '',     // 下载模板是的文件名字
      uploadType: '',
      fileList: [],        // 上传文件的列表
      isCover: false      // 是否覆盖 （多选按钮）
    }
  },
  methods: {
    // 初始化
    init () {
      let { dictFields, dictName } = JSON.parse(this.data.dictSchema)
      this.isCover = false   // 重置是否覆盖按钮
      this.$refs['upload'].clearFiles()  // 清空上传列表
      this.tableHeaderData = dictFields
      this.downloadname = dictName
      this.getDicDetail()  // 获取表格数据
    },
    /**
     * 下载模板 @FIXME:有统一的方法（downlod）但是接口不规范
     */
    fileDownLoad () {
      let href = `/api/setting/etl/dict/download?dictName=` + this.downloadname
      request({
        url: href
      }, {
        responseType: 'blob'
      }).then(blob => {
        // 将二进制流转换，放入 a 标签中下载
        const url = window.URL.createObjectURL(blob.data)
        const suffix = blob.headers['content-disposition'] ? blob.headers['content-disposition'].split('.')[1] : ''
        let tagA = document.createElement('a')
        tagA.setAttribute('download', this.downloadname + '.' + suffix)
        tagA.setAttribute('href', url)
        tagA.click()
        // 释放
        tagA = null
        window.URL.revokeObjectURL(url)
      })
    },
    /**
     * 分页 / 排序
     */
    handleSizeChange (param) {
      this.tableChange(param, this.tableDataDetail, this.getDicDetail)
    },
    /**
     * 上传成功时的钩子 @FIXME:上传时携带的参数不符合规范
     */
    uploadSuccess (response, file, fileList) {
      if (response.status === 'success') {
        this.getDicDetail(this.currentData)
      } else {
        this.$message({
          type: 'error',
          message: response.message
        })
      }
      this.$refs['upload'].clearFiles()
    },
    /**
     * 上传失败时的钩子
     */
    uploadError (err) {
      this.$message.error(err || '上传失败！')
    },
    // 字典上传
    submitUpload () {
      !this.isCover ? this.uploadType = 'append' : this.uploadType = 'truncate' // 是否覆盖
    }
  }
}
</script>
<style scope>
.upload-demo {
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
}
.upload-demo ul {
  display: none;
}
</style>
