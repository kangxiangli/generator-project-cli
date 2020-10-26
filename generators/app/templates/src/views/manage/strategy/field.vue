<template>
  <div class="manage-strateg-field">
    <!-- 搜索 -->
    <div>
      <idss-widget style="padding: 16px 0 0 15px">
        <el-form :inline="true" class="serach-form" style="margin-right: 20px">
          <el-form-item label="类别" style="margin-right:20px;">
            <div style="display: inline-block; width:200px;">
              <idss-select-tree-filter
                width="200px"
                size="small"
                multiple
                :data="logDictData"
                :selected.sync="serachDataParm.categoryId"
                :defaultProps="{
                  children: 'children',
                  label: 'label',
                  id: 'id'
                }"></idss-select-tree-filter>
            </div>
          </el-form-item>
          <el-form-item label="名称" style="margin-right:10px;">
            <el-input size="small" type="input" v-model="serachDataParm.name" placeholder="请输入名称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="medium" custom @click="searchTable">查询</el-button>
          </el-form-item>
        </el-form>
      </idss-widget>
    </div>
    <!-- 数据字典列表 -->
    <el-row>
      <el-col :span="24">
        <idss-widget
          :table="true"
          v-loading.body="loading['event-type-tree']"
          border
          :footer-style="{padding: '6px 0'}">
          <template slot="title-left">
            <span class="is-title">规则引擎字段列表</span>
          </template>
          <template slot="title-right">
            <el-button type="mini" @click="openDictDialog()">
              <idss-icon-svg name="add"></idss-icon-svg>
              <span>新建</span>
            </el-button>
            <el-upload
              :show-file-list="false"
              class="idss-import-div"
              ref="upload"
              :headers="uploadHeaders"
              action="/api/ueba/dict/manage/data/uploadDict"
              name="fileName"
              :on-remove="handleRemove"
              :auto-upload="false"
              :on-success="cangoIsRight"
              :on-progress="uploadpro"
              :on-change="importFileds">
              <el-button slot="trigger" type="mini" @click="importFileds">
                <idss-icon-svg name="import"></idss-icon-svg>
                <span>数据导入</span>
              </el-button>
            </el-upload>
            <el-button type="mini" @click="downFileds">
              <idss-icon-svg name="download"></idss-icon-svg>
              <span>下载模版</span>
            </el-button>
          </template>
          <el-table
            :data="dictDataTable.data"
            v-loading="loading['list-page']"
            stripe
            style="width: 100%">
            <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
            <el-table-column align="center" prop="categoryId" label="类别"></el-table-column>
            <el-table-column show-overflow-tooltip align="center" prop="name" label="名称"></el-table-column>
            <el-table-column show-overflow-tooltip align="center" prop="alias" label="别名"></el-table-column>
            <el-table-column align="center" prop="dataType" label="类型"></el-table-column>
            <el-table-column label="参数个数" align="center" show-overflow-tooltip>
              <template v-slot="{row}">
                <el-tooltip content="查看参数" placement="top" effect="dark">
                  <el-button
                    size="mini"
                    custom
                    type="text"
                    micro
                    @click="openParamDialog(row.id)">{{row.argument}}</el-button>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column
              min-width="80"
              show-overflow-tooltip
              prop="comment"
              label="描述"
              align="center">
              <template slot-scope="scope">{{ scope.row.comment }}</template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="150">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  micro
                  plain
                  @click="openDictDialog(scope.row)"
                  :loading="expends['updatedictinfo' + scope.row.id]">编辑</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  micro
                  plain
                  @click="delDictClick(scope.row)"
                  :loading="expends['deldictinfo' + scope.row.id]">删除</el-button>
              </template>
            </el-table-column>
            <template slot="empty">
              <idss-no-data></idss-no-data>‌
            </template>‌
          </el-table>
          <template slot="footer">
            <idss-pagination
              :tableData="dictDataTable"
              @size-change="dictDataTableChange"
              @page-change="dictDataTableChange"></idss-pagination>
          </template>
        </idss-widget>
      </el-col>
    </el-row>
    <el-dialog
      min-width
      custom
      :title="paramDialog.title"
      :visible.sync="paramDialog.visible"
      width="50%"
      :lock-scroll="true"
      @close="closeParamDialog">
      <!-- <el-form
        v-loading="loading['dict-data-info']"
        :model="dictInfo"
        label-width="100px"
        size="small">
        <el-row v-show="dictInfo.seg1 !== null" :gutter="10">
          <el-form-item label="备用字段1" prop="seg1">
          <span>{{dictInfo.seg1}}</span>
          </el-form-item>
          <el-form-item label="备用描述1" prop="seg1Desc">
            <span>{{dictInfo.seg1Desc}}</span>
          </el-form-item>
        </el-row>
      </el-form>-->

      <div v-loading="loading['dict-data-info']">
        <el-row v-show="dictInfo.seg1 !== null" :gutter="10">
          <el-col :span="8">备用字段1：{{dictInfo.seg1}}</el-col>
          <el-col :span="16">备用描述1：{{ dictInfo.seg1Desc }}</el-col>
        </el-row>
        <el-row v-show="dictInfo.seg2 !== null" :gutter="10">
          <el-col :span="8">备用字段2：{{ dictInfo.seg2 }}</el-col>
          <el-col :span="16">备用描述2：{{ dictInfo.seg2Desc }}</el-col>
        </el-row>
        <el-row v-show="dictInfo.seg3 !== null" :gutter="10">
          <el-col :span="8">备用字段3：{{ dictInfo.seg3 }}</el-col>
          <el-col :span="16">备用描述3：{{ dictInfo.seg3Desc }}</el-col>
        </el-row>
        <div
          v-show="(dictInfo.seg1 === null && dictInfo.seg2 === null && dictInfo.seg3 === null)"
          :style="{lineHeight:'110px',textAlign:'center',color:'#5e7382'}">暂无参数</div>
      </div>
    </el-dialog>
    <el-dialog
      min-width
      :close-on-click-modal="false"
      custom
      custom-class="s-dictDialog"
      :title="dictDialog.title"
      :visible.sync="dictDialog.visible"
      width="50%"
      :lock-scroll="true"
      @close="closeDictDialog">
      <el-dialog
        min-width
        :close-on-click-modal="false"
        width="40%"
        title="增加类型"
        :lock-scroll="true"
        custom
        :visible.sync="dictDialog.innerVisible"
        append-to-body>
        <el-dialog
          min-width
          :close-on-click-modal="false"
          custom
          custom-class="s-nodeDialog"
          width="40%"
          title="增加节点"
          :lock-scroll="true"
          :visible.sync="dictDialog.treeVisible"
          append-to-body
          @close="closeInnerDialog('nodeInfoFrom')">
          <el-form
            :model="nodeInfoFrom"
            :rules="dictDialog.rules"
            ref="nodeInfoFrom"
            label-width="100px"
            size="small">
            <el-form-item label="类型id" prop="id" :error="niFromError.id">
              <el-input size="mini" v-model="nodeInfoFrom.id"></el-input>
            </el-form-item>
            <el-form-item label="类型名字" prop="name" :error="niFromError.name">
              <el-input size="mini" v-model="nodeInfoFrom.name"></el-input>
            </el-form-item>
            <el-form-item label="类型描述" prop="comment" :error="niFromError.comment">
              <el-input size="mini" type="textarea" v-model="nodeInfoFrom.comment"></el-input>
            </el-form-item>
            <el-form-item class="bottom" style="text-align: center;">
              <el-button
                size="small"
                type="primary"
                @click="nodeSubmitForm('nodeInfoFrom')"
                :loading="expends['adddictnode']">保存</el-button>
              <el-button size="small" @click="nodeResetForm('nodeInfoFrom')">取消</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
        <div style="height: 300px;overflow: auto;">
          <div class="idss-margin--b-m">
            <el-button type="text" size="mini" icon="el-icon-plus" @click="() => append()">增加节点</el-button>
          </div>
          <el-tree
            :data="opeLogDictData"
            node-key="id"
            :default-expand-all="false"
            :default-expanded-keys="expandedIds"
            :expand-on-click-node="false">
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <span>{{ node.label }}</span>
              <span>
                <el-button type="text" size="mini" icon="el-icon-plus" @click="() => append(data)"></el-button>
                <el-button type="text" size="mini" @click="() => remove(node, data)">
                  <idss-icon-svg name="delete"></idss-icon-svg>
                </el-button>
              </span>
            </span>
          </el-tree>
        </div>
      </el-dialog>
      <div v-loading="loading['dict-data-info']">
        <div class="content">
          <el-form
            :model="dictInfoFrom"
            ref="dictInfoValidateForm"
            class="dictInfo-form"
            label-width="80px">
            <el-row>
              <el-col :span="12">
                <el-row :gutter="10" type="flex" justify="center" align="middle">
                  <el-col :span="20">
                    <el-form-item
                      label="类别"
                      prop="categoryId"
                      :rules="{required: true, message: '类别不能为空', trigger: 'change'}"
                      :error="diFromError.categoryId">
                      <idss-select-tree-filter
                        :selected.sync="dictInfoFrom.categoryId"
                        :data="logDictData"
                        size="mini"
                        :defaultProps="{
                          children: 'children',
                          label: 'label',
                          id: 'id'
                        }"></idss-select-tree-filter>
                    </el-form-item>
                  </el-col>
                  <el-col :span="4">
                    <el-button
                      style="marginBottom: 22px;padding:7px 8px"
                      @click="openTypeDialog()"
                      title="增加类型"
                      size="mini"
                      icon="el-icon-edit"></el-button>
                  </el-col>
                </el-row>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label="名称"
                  prop="name"
                  :rules="{required: true, message: '名称不能为空', trigger: 'blur'}"
                  :error="diFromError.name">
                  <el-input size="mini" v-model="dictInfoFrom.name" placeholder="名称"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label="别名"
                  prop="alias"
                  :rules="{required: true, message: '别名不能为空', trigger: 'blur'}"
                  :error="diFromError.alias">
                  <el-input size="mini" v-model="dictInfoFrom.alias" placeholder="别名"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label="类型"
                  prop="dataType"
                  :rules="{required: true, message: '类型不能为空', trigger: 'blur'}"
                  :error="diFromError.dataType">
                  <el-input size="mini" v-model="dictInfoFrom.dataType" placeholder="类型"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="描述" :error="diFromError.comment">
                  <el-input
                    size="small"
                    type="textarea"
                    v-model="dictInfoFrom.comment"
                    placeholder="描述"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <div style="border: .5px solid #c0c4cc;"></div>
              </el-col>
              <el-col :span="24">
                <el-form-item label="参数" style="margin: 0;">
                  <el-button
                    v-show="!(dictInfoFrom.params.length === 3)"
                    size="mini"
                    @click="addseg()">
                    <i class="el-icon-plus"></i>
                  </el-button>
                </el-form-item>
                <div
                  v-for="(domain, index) in dictInfoFrom.params "
                  :key="domain + index"
                  class="s-removeCls">
                  <el-col :span="12">
                    <el-form-item label="参数">
                      <el-input size="mini" v-model="domain.seg" placeholder="参数"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="描述">
                      <el-input size="small" type="textarea" v-model="domain.desc" placeholder="描述"></el-input>
                    </el-form-item>
                  </el-col>
                  <div class="s-icon-close" @click="removeSeg(index)">
                    <i class="el-icon-delete"></i>
                  </div>
                </div>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button
          custom
          size="small"
          type="primary"
          @click="submitForm('dictInfoValidateForm')"
          :loading="expends['operadictinfo']">保存</el-button>
        <el-button custom size="small" @click="resetForm('dictInfoValidateForm')">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import globalMixins from '@/mixins/globalMixins.js'
import { download } from '@/custom/utils/upload-download.js'
import service from './field-service.js'
export default {
  name: 'manage-strategy-field',
  mixins: [globalMixins, service],
  data () {
    let validateId = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('类型id不能为空'))
      }
      if (/^[0-9a-zA-Z]*$/g.test(value)) {
        callback()
      } else {
        callback(new Error('不合法'))
      }
    }
    return {
      upLoading: false,
      expends: [false],
      expandedIds: [],
      props: {
        children: 'children',
        label: 'label',
        value: 'id' // 选中之后的id名称
      },
      paramDialog: {
        visible: false,
        title: '参数列表'
      },
      uploadHeaders: {
        authToken: window.localStorage.getItem(`base/token$$`)
      },
      dictDataTable: {
        total: 0,
        pageNum: 1,
        pageSize: 20,
        data: []
      },
      niFromError: {},
      nodeInfoFrom: {
        label: '',
        id: '',
        parentCategoryId: '',
        comment: '',
        children: []
      },
      dictDialog: {
        visible: false,
        innerVisible: false,
        treeVisible: false,
        title: '新增',
        rules: {
          id: [{ required: true, message: '类型id不能为空', trigger: 'blur' }, { validator: validateId, trigger: 'blur' }],
          name: [{ required: true, message: '类型名字不能为空', trigger: 'blur' }]
        }
      },
      dictInfo: {},
      diFromError: {},
      dictInfoFrom: {
        params: [],
        categoryId: '',
        name: '',
        alias: '',
        comment: '',
        dataType: '',
        argument: 0
      },
      logDictData: [],
      serachDataParm: {
        name: '',
        categoryId: ''
      },
      opeLogDictData: []
    }
  },
  methods: {
    searchTable () {
      this.list('submit')
    },
    // 外部文件导入
    cangoIsRight (response, file, fileList) {
      if (file.status === 'success') {
        if (file.response.status === 'error') {
          this.showMessage(file.response.message, 'error')
        } else if (file.response.status === 'success') {
          this.showMessage(file.response.message, 'success')
        }
      }
      this.upLoading = false
      this.list('submit')
    },
    uploadpro (event, file, fileList) {
      if (this.upLoading) {
        this.showMessage('数据导入中', 'warn')
      }
      this.upLoading = true
    },
    handleRemove (file, fileList) {
    },
    importFileds () {
      this.$refs.upload.submit()
    },
    downFileds () {
      this.open().then((data) => {
        let { fileName } = data
        fileName && download(fileName, true)
      })
    },
    openTypeDialog () {
      this.dictDialog.innerVisible = true
    },
    dictDataTableChange (params) {
      this.tableChange(params, this.dictDataTable, this.getDictDataTable)
    },
    list (type = 'init') {
      this.tableChange({ type: type }, this.dictDataTable, this.getDictDataTable)
    },
    openParamDialog (id) {
      this.dictInfo = {}
      this.getDictInfo(id)
      this.paramDialog.visible = true
    },
    closeParamDialog () {
      this.dictInfo = {}
      this.paramDialog.visible = false
    },
    openDictDialog (obj) {
      this.dictInfoFrom = {
        params: [],
        categoryId: '',
        name: '',
        alias: '',
        comment: '',
        dataType: '',
        argument: 0
      }
      if (obj === undefined) {
        this.dictDialog.title = '新增'
      } else {
        this.dictDialog.title = '编辑'
        this.dealDictInfo(obj.id)
      }
      this.dictDialog.visible = true
    },
    closeInnerDialog (formName) {
      this.$refs[formName].resetFields()
      this.dictDialog.treeVisible = false
    },
    addseg () {
      this.dictInfoFrom.params.push({
        seg: '',
        desc: ''
      })
    },
    removeSeg (index) {
      this.dictInfoFrom.params.splice(index, 1)
    },
    submitForm (formName) {
      this.dictInfoFrom.argument = 0
      delete this.dictInfoFrom.seg1
      delete this.dictInfoFrom.seg2
      delete this.dictInfoFrom.seg3
      delete this.dictInfoFrom.seg1Desc
      delete this.dictInfoFrom.seg2Desc
      delete this.dictInfoFrom.seg3Desc
      this.dictInfoFrom.params.forEach((item, index) => {
        if (item.seg !== '') {
          this.dictInfoFrom.argument += 1
        }
        if (index === 0) {
          this.dictInfoFrom.seg1 = (item.seg === '' ? null : item.seg)
          this.dictInfoFrom.seg1Desc = (item.desc === '' ? null : item.desc)
        } else if (index === 1) {
          this.dictInfoFrom.seg2 = (item.seg === '' ? null : item.seg)
          this.dictInfoFrom.seg2Desc = (item.desc === '' ? null : item.desc)
        } else if (index === 2) {
          this.dictInfoFrom.seg3 = (item.seg === '' ? null : item.seg)
          this.dictInfoFrom.seg3Desc = (item.desc === '' ? null : item.desc)
        }
      })
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$set(this.expends, 'operadictinfo', true)
          this.opearDictInfo()
        } else {
          return false
        }
      })
    },
    closeDictDialog () {
      this.$refs['dictInfoValidateForm'].resetFields()
      this.dictDialog.visible = false
      setTimeout(() => {
        this.dictInfoFrom = {
          params: [],
          categoryId: '',
          name: '',
          alias: '',
          comment: '',
          dataType: '',
          argument: 0
        }
      }, 500)
    },
    delDictClick (obj) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$set(this.expends, 'deldictinfo' + obj.id, true)
        this.delDictInfo(obj.id)
      }).catch(() => {
        // this.showMessage('已取消删除', 'info')
      })
    },
    append (data) {
      this.nodeInfoFrom = {
        label: '',
        id: '',
        parentCategoryId: '',
        comment: '',
        children: []
      }
      this.dictDialog.treeVisible = true
      this.currendNode = data
    },
    remove (node, data) {
      this.$confirm('此操作将永久删除该节点以及下面的子节点, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.delDictNode(data.id)
      }).catch(() => {
        this.showMessage('已取消删除', 'info')
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
      this.closeDictDialog()
    },
    nodeResetForm (formName) {
      this.dictDialog.treeVisible = false
      this.nodeInfoFrom = {
        name: '',
        id: '',
        parentCategoryId: '',
        comment: '',
        children: []
      }
    },
    nodeSubmitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.currendNode !== undefined) {
            this.nodeInfoFrom.parentCategoryId = this.currendNode.id
          } else {
            this.nodeInfoFrom.parentCategoryId = '0'
          }
          this.$set(this.expends, 'adddictnode', true)
          this.addDictNode()
        } else {
          return false
        }
      })
    },
    init () {
      this.getDictCatTree()
      this.list('refresh')
    }
  },
  created () {
    this.getDictCatTree()
    this.list()
  }
}
</script>
<style scoped lang="postcss">
/* 查询条件 */
.s-removeCls {
  position: relative;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding-top: 20px;
  padding-right: 20px;
  margin-bottom: 20px;
  & .s-icon-close {
    position: absolute;
    top: -9px;
    right: -6px;
    color: #409eff;
    font-weight: bold;
    border: 1px solid var(--color-primary);
    border-radius: 50%;
    height: 20px;
    width: 20px;
    line-height: 18px;
    text-align: center;
    background: var(--color-font-5);
    cursor: pointer;
  }
}
.idss-import-div {
  margin: 0 14px;
  display: inline-block;
}
.s-removeCls::after {
  content: "";
  clear: both;
  display: table;
}
.el-dialog__wrapper {
  & >>> .s-dictDialog {
    min-width: 600px;
    & >>> .el-dialog__body {
      padding: 0;
      padding-bottom: 30px;
      & >>> .content {
        padding: 30px 20px 0;
        box-sizing: content-box;
      }
      & >>> .el-form-item__content {
        margin-left: 0 !important;
      }
    }
  }
}
.el-dialog__wrapper[min-width] >>> .el-dialog {
  min-width: 600px;
}
</style>
