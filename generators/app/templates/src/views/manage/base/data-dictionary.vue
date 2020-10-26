<template>
  <div class="idss-data-dictioary">
    <!-- 筛选条件 -->
    <idss-widget :main-style="{padding: '16px 0 0 10px'}">
      <el-form :inline="true">
        <el-form-item label="自定义选项别名">
          <el-input v-model="name" placeholder="自定义选项别名" size="small" @keyup.enter.native="search"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="search">查询</el-button>
        </el-form-item>
      </el-form>
    </idss-widget>

    <!--列表-->
    <idss-widget v-loading="loading['dictionary-list']" :header-style="{padding: '10px 15px'}" :footer-style="{padding: '10px'}">
      <template slot="title-left">
        <span>字典列表</span>
        <el-button
          :disabled="!checkSelection.length"
          style="marginLeft: 10px"
          type="danger"
          size="mini"
          plain
          @click="deleteAll">
          <idss-icon-svg name="delete"></idss-icon-svg>
          <span>删除</span>
        </el-button>
      </template>
      <template slot="title-right">
        <el-button size="mini" plain @click="addDict">
          <idss-icon-svg name="add"></idss-icon-svg>
          <span>新建自定义选项</span>
        </el-button>
      </template>
      <el-table
        border
        stripe
        :data="dictionaryTableData.data"
        @selection-change="handleSelectionChange"
        style="width: 100%">
        <el-table-column type="selection" width="40" align="center"></el-table-column>
        <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
        <el-table-column prop="code" label="自定义选项值" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="name" label="自定义选项别名" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="parentName" label="父类节点名称" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="isFixed" label="允许编辑/删除" align="center">
          <template slot-scope="scope">{{scope.row.isFixed ? '是' : '否'}}</template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="126">
          <template slot-scope="scope">
            <el-button type="primary" micro plain size="mini" @click="editDict(scope.row)">编辑</el-button>
            <el-button type="danger" micro plain size="mini" class="delete" @click="deleteSingle(scope.row)">删除</el-button>
          </template>
        </el-table-column>
        <template slot="empty">
          <idss-no-data></idss-no-data>
          ‌</template>‌
      </el-table>
      <!--分页-->
      <template slot="footer">
        <idss-pagination
          :tableData="dictionaryTableData"
          @size-change="dictionaryTableChange"
          @page-change="dictionaryTableChange">
        </idss-pagination>
      </template>
    </idss-widget>

    <!--添加/编辑字典弹出-->
    <el-dialog
      custom
      width="30%"
      :title="dialogTitle"
      :visible.sync="dialogAddDictVisible"
      @close="closeDialog('addOrEditDictDialog')">
      <el-form
        :model="dict"
        :rules="dictRules"
        ref="addOrEditDictDialog"
        label-width="130px"
        size="small">
        <el-form-item label="自定义选项值" prop="code" :error="dictError.code">
          <el-input
            size="mini"
            v-model.trim="dict.code"
            v-bind:disabled="dialogAddDictType === 'edit'"
            @focus="dictError.code=''">
          </el-input>
        </el-form-item>
        <el-form-item
          label="自定义选项别名"
          prop="name"
          :error="dictError.name">
          <el-input size="mini" v-model.trim="dict.name" @focus="dictError.name=''"></el-input>
        </el-form-item>
        <el-form-item label="选项所属功能" prop="parentId" :error="dictError.parentId">
          <el-input
            size="mini"
            v-model.trim="dict.parentName"
            readonly
            @click.native="dictTree"
            placeholder="请选择节点">
          </el-input>
        </el-form-item>
        <el-form-item label="允许编辑/删除" prop="isFixed">
          <el-radio-group v-model="dict.isFixed">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button custom type="primary" size="small" @click="saveAddDict">保 存</el-button>
        <el-button custom size="small" @click="dialogAddDictVisible = false">取 消</el-button>
      </div>
    </el-dialog>
    <!--字典分类弹出-->
    <node-tree-dialog
      :currentKey="dict.parentId"
      :hide-id="dict.dictionaryDataId"
      :isShow="dialogAddDictTypeVisible"
      @closeDialog="closeTreeDialog">
    </node-tree-dialog>
  </div>
</template>

<script>
import globalMixins from '@/mixins/globalMixins.js'
import Service from './data-dictionary-service.js'
import nodeTreeDialog from './data-dict-components/node-tree-dialog'

export default {
  mixins: [globalMixins, Service],
  data () {
    return {
      collapse: false,
      name: null,    // 自定义选项别名输入值(查询条件)
      dictionaryList: [],   // 字典分类下拉列表

      dictionaryTableData: {       // 字典列表
        pageNum: 1,                // 当前页码
        pageSize: 20               // 每页条数
      },

      checkSelection: [],             // 系统字典列表勾选的信息
      checkCurrent: [],

      dialogAddDictTypeVisible: false,
      dialogAddDictVisible: false,    // 添加|编辑系统字典dialog设置
      dialogAddDictType: 'edit',      // 添加|编辑系统字典 edit-编辑；add-添加
      dialogTitle: '',                // 添加|编辑系统字典 标题

      dict: {                         // 添加|编辑字典信息
        dictionaryDataId: '',   // 自定义选项值
        parentId: '', // 字典父节点
        name: '', // 自定义选项别名
        code: '',   // 自定义选项值
        isFixed: false,   // 字典值允许编辑/删除
        parentName: ''
      },

      // 字典录入信息规则验证
      dictRules: {
        code: [
          { required: true, message: '自定义选项值不能为空', trigger: 'blur' },
          { required: true, max: 50, message: '自定义选项值最大50字符', trigger: 'change, blur' }
        ],
        name: [
          { required: true, message: '自定义选项别名不能为空', trigger: 'blur' },
          { required: true, max: 50, message: '自定义选项别名最大50字符', trigger: 'change, blur' }
        ]
      },
      // 字典提交后 后台返回的错误校验信息
      dictError: {},
      // 字典分类信息规则验证
      dictTypeRules: {
        code: [
          { required: true, message: '字典分类编码不能为空', trigger: 'blur' },
          { min: 1, max: 128, message: '字典分类编码最大128字符', trigger: 'change, blur' }
        ],
        name: [
          { required: true, message: '字典分类名称不能为空', trigger: 'blur' },
          { min: 1, max: 128, message: '字典分类名称最大128字符', trigger: 'change, blur' }
        ]
      },
      // 字典分类提交后 后台返回的错误校验信息
      dictTypeError: {}
    }
  },
  methods: {
    // 初始化数据及刷新使用
    initData (params = { type: 'refresh' }) {
      this.tableChange(params, this.dictionaryTableData, this.getTableData)
    },

    // 提交请求
    search () {
      this.tableChange({ type: 'submit' }, this.dictionaryTableData, this.getTableData)
    },

    // 表格（分页、排序、改变页码）
    dictionaryTableChange (params) {
      this.tableChange(params, this.dictionaryTableData, this.getTableData)
    },

    // 表格复选框
    handleSelectionChange (selection) {
      this.checkSelection = selection
    },

    // 批量删除按钮点击处理
    deleteAll () {
      // 未选中任何一条记录
      this.deleteConfirm(this.checkSelection)
    },

    // 删除按钮点击处理
    deleteSingle (item) {
      this.deleteConfirm([item])
    },

    // 关闭节点树弹窗
    closeTreeDialog (isShow, currentNode) {
      this.dialogAddDictTypeVisible = isShow
      // 设置当前获取的数据节点
      if (currentNode) {
        this.$set(this.dict, 'parentId', currentNode.dictionaryDataId)
        this.$set(this.dict, 'parentName', currentNode.name)
      }
    },

    // Dialo关闭处理
    closeDialog (type) {
      // 清除错误信息样式
      this.$refs[type].resetFields()
    },

    // 添加字典按钮点击处理
    addDict () {
      // 标识为添加
      this.dialogAddDictType = 'add'
      // 设置标题
      this.dialogTitle = '添加自定义选项'
      // 清除输入数据
      this.dict = {
        dictionaryDataId: '',   // 自定义选项值
        parentId: '', // 字典父节点
        name: '', // 自定义选项别名
        code: '',   // 自定义选项值
        isFixed: false,   // 字典值允许编辑/删除
        parentName: ''
      }

      this.dialogAddDictVisible = true
    },
    // 编辑字典页面
    editDict (info) {
      if (!info.isFixed) {
        this.showMessage('该节点是固定，不可编辑', 'warning')
        return
      }
      // 标识为编辑
      this.dialogAddDictType = 'edit'
      // 设置标题
      this.dialogTitle = '编辑系统字典信息'
      this.dialogAddDictVisible = true
      this.dict.dictionaryDataId = info.dictionaryDataId
      this.getDictionaryInfo(info.dictionaryDataId)
    },

    // 添加字典分类按钮点击处理
    dictTree () {
      this.dialogAddDictTypeVisible = true
    },

    // 字典页面保存按钮点击处理
    saveAddDict () {
      this.$refs['addOrEditDictDialog'].validate((valid) => {
        if (valid) {
          // 验证通过，发送请求
          this.addOrEditDictionary({
            method: (this.dialogAddDictType === 'edit') ? 'put' : 'post',
            data: this.dict
          }, 'dialogAddDictVisible', true).then(() => {}, errMsg => {
            this.dictError = errMsg
          })
        }
      })
      this.getTableData()
    },

    // 确认删除
    deleteConfirm (selection) {
      let nameTips = [] // 自定义选项别名数组，提示使用
      let params = []   // 删除字典条件
      selection.map(obj => {
        nameTips.push(obj.name)
        params.push(obj.dictionaryDataId)
      })
      const isFixed = selection.some(item => !item.isFixed)
      if (isFixed) {
        this.showMessage('选中的节点包含固定，不能删除', 'warning')
        return
      }

      this.$confirm(`此操作将永久删除 ${nameTips.join(',')} 字典, 以及子节点,是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteDictionary(params).then(() => {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    init () {
      // 初始化数据
      this.initData()
      this.initDictionaryTree()
    }
  },
  components: {
    nodeTreeDialog
  },
  mounted: function () {
    this.init()
  }
}
</script>
<style scoped lang="postcss">
/*字典分类设置*/
.data-dictionary-sort {
  display: flex;
  flex-wrap: nowrap;

  & .el-select {
    flex: 1;
  }

  & .el-button {
    margin-left: 5px;
  }
}
.idss-data-dictioary {
  >>> .idss-widget .title .idss-button-icon {
    padding: 0;
  }
}
</style>
