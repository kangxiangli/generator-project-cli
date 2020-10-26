/**
 * 提取器设置页面
 * 菜单选择直接进入此页面
 */
<template>
  <div>
    <idss-widget style="padding: 15px 15px 0 15px;">
      <el-form label-width="60px" :inline="true" size="small">
        <el-form-item label="部门">
          <el-select v-model="deptUid" filterable placeholder="请选择部门" @change="getJobList()">
            <el-option
              v-for="item in deptList"
              :key="item.uid"
              :label="item.deptName"
              :value="item.uid"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="任务ID">
          <!-- 如果有传递id 则禁用下拉框 -->
          <el-select
            v-model="taskids"
            filterable
            placeholder="选择任务ID查看对应的提取设置"
            @change="getextractId()">
            <el-option
              v-for="item in jobList"
              :key="item.jobSerialNumber"
              :label="item.jobDescription"
              :value="item.jobSerialNumber">
              <span style="float: left; color: #8492a6; font-size: 13px">{{ item.jobSerialNumber }}</span>
              <span style="float: right; margin-left: 10px;">{{ item.jobDescription }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" @click="getextractId()">查询</el-button>
        </el-form-item>
      </el-form>
    </idss-widget>

    <idss-widget style="padding: 15px">
      <el-row :gutter="15">
        <!-- 提取器 -->
        <el-col :span="4">
          <div>
            <el-menu default-active="0" class="el-menu-vertical-demo pickerList">
              <el-submenu index="1">
                <template slot="title">
                  <span>提取器</span>
                </template>
                <el-menu-item-group>
                  <el-menu-item
                    v-for="(item,index) in scheme"
                    :key="index"
                    :index="index.toString()"
                    @click="rowClick(item)">{{item.extractName}}</el-menu-item>
                  <el-menu-item v-if="scheme.length === 0" index="0">
                    <div class="el-table__empty-block">
                      <span
                        class="el-table__empty-text"
                        style="position:inherit; left:inherit; top:inherit">暂无数据</span>
                    </div>
                  </el-menu-item>
                </el-menu-item-group>
              </el-submenu>
            </el-menu>
          </div>
        </el-col>
        <el-col :span="20">
          <div class="grid-content bg-purple-light">
            <el-table
              :data="tableData.fieldRulesList"
              border
              stripe
              :row-class-name="tableRowClassName">
              <el-table-column type="index" label="编号" align="center" width="60"></el-table-column>
              <el-table-column
                prop="fieldName"
                label="字段名称"
                align="center"
                width="150"
                show-overflow-tooltip></el-table-column>
              <el-table-column prop="fieldSource" label="字段来源" width="80" align="center">
                <template slot-scope="scope">
                  <span v-if="scope.row.fieldSource == '1'">静态</span>
                  <span v-if="scope.row.fieldSource == '2'">原始</span>
                  <span v-if="scope.row.fieldSource == '3'">动态</span>
                  <span v-if="scope.row.fieldSource == '4'">合并</span>
                </template>
              </el-table-column>
              <el-table-column label="类型/值" align="center" width="150">
                <template slot-scope="scope">
                  <div class="cell">
                    <span v-if="scope.row.fieldSource !== '1'">{{scope.row.fieldType}}</span>
                    <span v-if="scope.row.fieldSource === '1'">{{scope.row.fieldStaticValue}}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="忽略规则" align="center" width="100">
                <template slot-scope="scope">
                  <el-button
                    class="dataType"
                    @click="handleData('filter',scope)"
                    type="text"
                    size="mini">
                    <svg
                      v-if="scope.row.ruleEntity && scope.row.ruleEntity['filterConditionList']!== undefined"
                      class="icon svgChange"
                      aria-hidden="true">
                      <use xlink:href="#icon-outline-filter" />
                    </svg>
                    <svg v-else class="icon" aria-hidden="true">
                      <use xlink:href="#icon-outline-filter" />
                    </svg>
                  </el-button>
                </template>
              </el-table-column>
              <el-table-column label="替换规则" align="center" width="100">
                <template slot-scope="scope">
                  <el-button
                    class="dataType"
                    @click="handleData('replace',scope)"
                    type="text"
                    size="mini">
                    <svg
                      v-if="scope.row.ruleEntity && scope.row.ruleEntity['replaceConditionList']!== undefined"
                      class="icon svgChange"
                      aria-hidden="true">
                      <use xlink:href="#icon-replace" />
                    </svg>
                    <svg v-else class="icon" aria-hidden="true">
                      <use xlink:href="#icon-replace" />
                    </svg>
                  </el-button>
                </template>
              </el-table-column>
              <el-table-column label="动态补全" align="center" width="100">
                <template slot-scope="scope">
                  <el-button
                    class="dataType"
                    @click="handleData('change',scope)"
                    type="text"
                    size="mini">
                    <svg
                      v-if="scope.row.ruleEntity && scope.row.ruleEntity['fillUpConditionList']!== undefined && scope.row.ruleEntity['fillUpConditionList'][0].dictName!== ''"
                      class="icon svgChange"
                      aria-hidden="true">
                      <use xlink:href="#icon-busao" />
                    </svg>
                    <svg v-else class="icon" aria-hidden="true">
                      <use xlink:href="#icon-busao" />
                    </svg>
                  </el-button>
                </template>
              </el-table-column>
              <el-table-column label="时间转换" align="center" width="100">
                <template slot-scope="scope">
                  <el-button
                    class="dataType"
                    @click="handleData('time',scope)"
                    type="text"
                    size="mini">
                    <svg
                      v-if="scope.row.ruleEntity && scope.row.ruleEntity['timeConvertCondition']!== undefined"
                      class="icon svgChange"
                      aria-hidden="true">
                      <use xlink:href="#icon-clocks" />
                    </svg>
                    <svg v-else class="icon" aria-hidden="true">
                      <use xlink:href="#icon-clocks" />
                    </svg>
                  </el-button>
                </template>
              </el-table-column>
              <el-table-column label="字段截取" align="center" width="90">
                <template slot-scope="scope">
                  <el-button
                    class="dataType"
                    @click="handleData('cut',scope)"
                    type="text"
                    size="small">
                    <svg
                      class="icon svgChange"
                      aria-hidden="true"
                      v-if="scope.row.ruleEntity!== undefined && scope.row.ruleEntity['subConditionList']!== undefined">
                      <use xlink:href="#icon-cut" />
                    </svg>
                    <svg class="icon" aria-hidden="true" v-else>
                      <use xlink:href="#icon-cut" />
                    </svg>
                  </el-button>
                </template>
              </el-table-column>
              <el-table-column label="字段模糊" align="center" width="90">
                <template slot-scope="scope">
                  <el-button
                    class="dataType"
                    @click="handleData('dim',scope)"
                    type="text"
                    size="small">
                    <svg
                      class="icon svgChange"
                      aria-hidden="true"
                      v-if="scope.row.ruleEntity!== undefined && scope.row.ruleEntity['desensitizationCondition']!== undefined">
                      <use xlink:href="#icon-dim" />
                    </svg>
                    <svg class="icon" aria-hidden="true" v-else>
                      <use xlink:href="#icon-dim" />
                    </svg>
                  </el-button>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center" fixed="right" width="120">
                <template slot-scope="scope">
                  <el-button
                    @click="updateStaticField(scope.row, 'edit')"
                    :disabled="scope.row.fieldSource==='2' || scope.row.fieldSource==='3'"
                    type="text">编辑</el-button>
                  <el-button
                    @click="deleteStaticField(scope.row)"
                    :disabled="scope.row.fieldSource==='2'"
                    type="text">删除</el-button>
                </template>
              </el-table-column>
            </el-table>

            <el-row style="margin: 10px 0">
              <el-button size="small" icon="el-icon-circle-plus" @click="mergeField()">字段合并</el-button>
            </el-row>
            <el-form :model="mergeForm" ref="mergeForm" :inline="true">
              <el-row
                v-for="(item, index) in mergeForm.mergeFields"
                :key="index"
                :gutter="21"
                style="margin-bottom:18px;display: flex;flex-wrap: nowrap;align-items: center;min-width: max-content;">
                <el-col :span="1">
                  <i class="el-icon-close" @click="delmergeField(index)"></i>
                </el-col>
                <el-col :span="6" style="display:flex;align-items:center">
                  <el-form-item
                    class="mergeForm"
                    :prop="'mergeFields.' + index + '.orgFields'"
                    :rules="{
                      required: true, message: '字段不能为空', trigger: 'change'
                    }">
                    <el-select
                      size="small"
                      v-model="item.orgFields"
                      multiple
                      collapse-tags
                      style="width:100%">
                      <el-option
                        v-for="(t, m) in tableData.fieldRulesList"
                        :key="m"
                        :label="t.fieldName"
                        :value="t.fieldName"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item class="mergeForm">
                    <el-input size="small" v-model="item.interval[0]" placeholder="请输入字段连接符"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item
                    class="mergeForm"
                    :prop="'mergeFields.' + index + '.fieldName'"
                    :rules="[{
                      required: true, message: '合并字段不能为空', trigger: 'blur'
                    },{validator:fieldNameReg , message: '提取器中已存在该字段,请重新命名', trigger: 'change' }]">
                    <el-input size="small" v-model="item.fieldName" placeholder="请输入合并字段名称"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
            <!-- 新增静态字段 -->
            <el-row style="margin: 10px 0">
              <el-button
                size="small"
                icon="el-icon-circle-plus"
                @click="updateStaticField({fieldSource: '1'}, 'add')">新增静态字段</el-button>
            </el-row>
            <!-- 静态字段列表 -->
            <el-table
              :data="tableData.staticFieldEntityList"
              v-if="tableData.staticFieldEntityList"
              border
              style="width: 100%"
              :row-class-name="tableRowClassName">
              <el-table-column type="index" label="编号" align="center" width="120"></el-table-column>
              <el-table-column prop="fieldName" label="字段名称" align="center"></el-table-column>
              <el-table-column prop="fieldValue" label="字段值" align="center"></el-table-column>
              <el-table-column prop="fieldType" label="类型" align="center"></el-table-column>
            </el-table>
          </div>
          <el-row style="margin-top:15px; text-align: center;" v-if="scheme.length !== 0">
            <el-button size="medium" @click="save()" type="primary">保存</el-button>
          </el-row>
        </el-col>
      </el-row>
    </idss-widget>

    <!-- 操作类型的弹框 -->
    <el-dialog
      :title="typeTitleMap[dataType]"
      :visible.sync="idssFormvisiable"
      width="60%"
      align="left"
      :before-close="handleClose">
      <!-- 根据 type 类型 切换4个组件 -->
      <component :is="typeComponentsMap[dataType]" @close="closeDialogForm" :message="sendMessage"></component>
    </el-dialog>

    <!-- 新增静态字段的弹框 -->
    <el-dialog :title="staticTitle" :visible.sync="dialogFormVisible" width="380px" custom>
      <el-form :model="form" ref="form" :rules="rules" size="small" label-width="90px">
        <el-form-item label="字段名称:" prop="name">
          <el-select
            v-model="form.name"
            clearable
            placeholder="请选择字段"
            filterable
            style="width: 100%"
            :disabled="staticTitle === '编辑字段'">
            <el-option-group v-for="group in systemFields" :key="group.name" :label="group.name">
              <el-option
                v-for="item in group.children.filter(val => val.name!='eqpt_device_type')"
                :key="item.id"
                :label="item.field +'/'+item.name"
                :value="item.field">
                <span style="float: left;">{{ item.field }}</span>
                <span
                  style="float: right; color: #8492a6; font-size: 13px; margin-left: 10px;">{{ item.name }}</span>
              </el-option>
            </el-option-group>
          </el-select>
        </el-form-item>
        <el-form-item label="字段类型:" prop="type">
          <el-select v-model="form.type" disabled placeholder="请选择字段类型" style="width: 100%">
            <el-option label="string" value="string"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="字段值:" prop="value">
          <el-input v-model="form.value" auto-complete="off" placeholder="请输入字段值"></el-input>
        </el-form-item>
      </el-form>
      <div class="idss-txt--center">
        <el-button custom size="small" type="primary" @click="add_filepicker('form')">确 定</el-button>
        <el-button custom size="small" @click="dialogFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import dataFilter from './components/data-filter.vue'
import dataReplace from './components/data-replace.vue'
import dataChange from './components/data-change.vue'
import dataTime from './components/data-time.vue'
import dataDim from './components/data-dim.vue'
import dataCut from './components/data-cut.vue'
import globalMixins from '@/mixins/globalMixins.js'
import service from './extractor-setting-service.js'

const API = {
  TASK_SEARCH: {
    url: '/api/setting/etl/job/ui/task-search/list/query',
    method: 'post'
  },
  GET_EXTRACT_LIST (jobSerialNumber) {
    return {
      method: 'get',
      url: '/api/setting/etl/job/ui/get-extractId?jobSerialNumber=' + jobSerialNumber
    }
  },
  GET_EXTRACT_RULES_LIST (id) {
    return {
      method: 'get',
      url: '/api/setting/etl/job/ui/get-rules?extractId=' + id
    }
  }
}

export default {
  mixins: [globalMixins, service],
  components: {
    dataFilter,
    dataReplace,
    dataChange,
    dataTime,
    dataDim,
    dataCut
  },
  data () {
    return {
      deptUid: '',
      deptList: [],
      // 弹窗中的title名称
      typeTitleMap: {
        'filter': '忽略规则',
        'replace': '替换规则',
        'change': '动态补全',
        'time': '时间转换',
        'cut': '字段截取',
        'dim': '字段模糊'
      },
      typeComponentsMap: {
        'filter': 'dataFilter',
        'replace': 'dataReplace',
        'change': 'dataChange',
        'time': 'dataTime',
        'cut': 'dataCut',
        'dim': 'dataDim'
      },
      // 弹框的操作类型 忽略规则、动态补全、替换规则、时间转换 四种
      dataType: '',
      // 操作类型弹框
      idssFormvisiable: false,
      // 新增静态字段的弹框
      dialogFormVisible: false,
      // 提取器列表
      scheme: [],
      tableData: [],
      staticFieldEntityList: [],
      taskId: '',
      taskIntro: '',
      sendMessage: {
        fieldRulesList: '',
        oldData: '',
        demoData: ''
      },
      form: {
        name: '',
        type: '',
        value: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入字段名称', trigger: 'change' }
        ],
        value: [
          { required: true, message: '请输入字段值', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择字段类型', trigger: 'change' }
        ]
      },
      taskids: '',
      jobList: [],
      systemFields: [],
      currentIndex: '',
      matchExample: '',
      jsonRegexMatchExample: '',
      mergeForm: { mergeFields: [] },
      staticTitle: '新增字段',
      staticType: 'add',
      currentStatic: {},
      fieldNameReg: (rule, value, callback) => {
        if (value === '') {
          callback(new Error('合并字段不能为空'))
        } else {
          let isField = false
          this.tableData['fieldRulesList'].map(val => {
            if (val.fieldName === value) {
              isField = true
            }
          })
          if (isField) {
            callback(new Error('提取器中已存在字段名称，请重新选择!'))
          } else {
            callback()
          }
        }
      }
    }
  },
  methods: {
    mergeField () {
      this.mergeForm.mergeFields.push({ orgFields: [], fieldSource: 4, interval: [] })
    },
    delmergeField (idx) {
      this.mergeForm.mergeFields.splice(idx, 1)
    },
    tableRowClassName (row) {
      // row.row.index = row.rowIndex
    },

    // 操作类型弹框的 before close 回调函数
    handleClose (done) {
      done()
      this.dataType = ''
    },

    // 4个操作类型的点击事件
    handleData (type, scope) {
      this.dataType = type
      this.currentIndex = scope.$index
      this.sendMessage.oldData = scope.row
      if (this.matchExample !== null) {
        this.sendMessage.demoData = this.matchExample[scope.row.fieldName]
        if (!this.sendMessage.demoData && this.jsonRegexMatchExample) {
          this.sendMessage.demoData = this.jsonRegexMatchExample[scope.row.fieldName]
        }
      }
      this.idssFormvisiable = true
    },

    // 提取器点击函数
    rowClick (param) {
      if (param.extractDataSample !== undefined) {
        this.matchExample = JSON.parse(param.extractDataSample)
        if (param.jsonRegexExtractList && param.jsonRegexExtractList.length) {
          this.jsonRegexMatchExample = JSON.parse(param.jsonRegexExtractList[0].extractDataSample)
        }
      }
      this.getrules(param.id)
    },

    // 初始化 任务列表、提取器列表、提取器内容列表
    getJobList () {
      // 通过url传递的ID说明是从作业管理跳过来的
      this.taskids = ''
      this.$request({
        ...API.TASK_SEARCH,
        data: { 'pageNum': '1', 'pageSize': '100000', deptUId: this.deptUid }
      }).then((content) => {
        if (content.data.length > 0) {
          this.jobList = content.data
          this.taskids = content.data[0].jobSerialNumber

          // 获取提取器列表
          this.$request({
            ...API.GET_EXTRACT_LIST(this.taskids)
          }).then((content) => {
            if (content.length > 0 && content[0].extractDataSample !== undefined) {
              let currentData = content[0]
              this.matchExample = JSON.parse(currentData.extractDataSample)
              if (currentData.jsonRegexExtractList && currentData.jsonRegexExtractList.length) {
                this.jsonRegexMatchExample = JSON.parse(currentData.jsonRegexExtractList[0].extractDataSample)
              }
              this.scheme = content.reverse()
              var firstId = this.scheme[0].id
              // 获取提取器规则列表
              this.$request({
                ...API.GET_EXTRACT_RULES_LIST(firstId)
              }).then((content) => {
                this.tableData = content

                this.tableData.fieldRulesList.forEach(item => {
                  if (!item.ruleEntity) {
                    this.$set(item, 'ruleEntity', {})
                  }
                })
                this.sendMessage.fieldRulesList = content.fieldRulesList
              }, (error) => {
                console.log(error)
              })
            } else {
              this.scheme = []
              this.tableData = []
            }
          }, (error) => {
            console.log(error)
          })
        }
      }, (error) => {
        console.log(error)
      })
    },

    // @FIXME 关闭弹框，里面涉及到了保存的业务逻辑
    /**
     * @params {Array} [标识（0/1）, type (操作类型), data]
     */
    closeDialogForm (param) {
      if (param[0] === 1) {
        this.idssFormvisiable = false
      }

      this.dataType = ''
      let type = param[1]
      let data = param[2]
      if (type === undefined) {
        return
      }
      // 时间转换特殊处理
      if (type === 'timeConvertCondition' && data.originalFormat === '' && data.changeFormat === '') {
        delete this.tableData.fieldRulesList[this.currentIndex].ruleEntity
      } else {
        // let ruleEntity = this.tableData.fieldRulesList[this.currentIndex].ruleEntity
        // this.tableData.fieldRulesList[this.currentIndex].ruleEntity = ruleEntity === undefined ? {} : ruleEntity
        this.tableData.fieldRulesList[this.currentIndex].ruleEntity[type] = data
      }
    },

    save () {
      // 保存前格式化处理
      this.tableData['fieldRulesList'].forEach(item => {
        let timeConvertCondition = item.ruleEntity && item.ruleEntity['timeConvertCondition']
        if (timeConvertCondition) {
          if (!timeConvertCondition['changeFormat'] || !timeConvertCondition['originalFormat']) {
            delete item.ruleEntity['timeConvertCondition']
          }
        }
      })
      // 保存提取器的设置
      this.tableData['megreFieldEntityList'] = this.mergeForm.mergeFields
      this.rulesave(this.tableData, 'list')
    },

    // 添加静态字段
    add_filepicker (formName) {
      if (this.staticType === 'add') {
        this.tableData.staticFieldEntityList = this.tableData.staticFieldEntityList === undefined ? [] : this.tableData.staticFieldEntityList
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let isField = false
            this.tableData['fieldRulesList'].map(val => {
              if (val.fieldName === this.form.name) {
                isField = true
              }
            })
            if (isField) {
              this.showMessage('提取器中已存在字段名称，请重新选择!', 'warning')
            } else {
              this.tableData.staticFieldEntityList.push({ 'fieldName': this.form.name, 'fieldType': this.form.type, 'fieldValue': this.form.value })
              this.form.name = ''
              this.form.value = ''
              this.dialogFormVisible = false
            }
          } else {
            return false
          }
        })
      } else {
        this.$request({
          method: 'post',
          url: '/api/setting/etl/job/ui/update-rule-static-field',
          data: {
            fieldName: this.form.value,
            id: this.currentStatic.fieldRuleSetId
          }
        }).then((content) => {
          this.$message({
            type: 'success',
            message: '编辑成功'
          })
          this.getextractId()
          this.getLogDict()
          this.dialogFormVisible = false
        }, (error) => {
          console.log(error)
        })
      }
    },

    // 新增静态字段按钮点击事件
    updateStaticField (param, type) {
      this.currentStatic = param
      this.staticType = type
      if (param['fieldSource'] === '1') {
        if (type === 'add') {
          this.staticTitle = '新增字段'
          this.tableData.staticFieldEntityList = this.tableData.staticFieldEntityList === undefined ? [] : this.tableData.staticFieldEntityList
          for (var m = 0; m < this.tableData.staticFieldEntityList.length; m++) {
            for (var t = 0; t < this.systemFields.length; t++) {
              if (this.systemFields[t].value === this.tableData.staticFieldEntityList[m].fieldName) {
                this.systemFields[t]['disabled'] = true
              }
            }
          }
          this.form.type = 'string'
        } else {
          this.staticTitle = '编辑字段'
          this.form.name = param.fieldName
          this.form.type = param.fieldType
          this.form.value = param.fieldStaticValue
        }
        this.dialogFormVisible = true
      } else if (param['fieldSource'] === '4') {
        this.$set(this.mergeForm.mergeFields, 0, param['ruleEntity']['megreFieldEntity'])
        this.mergeForm.mergeFields[0]['fieldRuleSetId'] = param['fieldRuleSetId']
      }
    },

    init () {
      this.getJobList()
      this.getLogDict()
      this.getDeptList()
    }
  },
  mounted () {
    this.init()
  }
}
</script>

<style scoped lang="postcss">
button svg {
  width: 24px;
  height: 24px;
}

svg.svgChange {
  fill: var(--color-primary);
}

.pickerList {
  border: 1px solid #ebeef5;

  >>> .el-submenu .el-menu-item {
    margin: 0 !important;
    padding: 0 !important;
    text-align: center;
    height: 43px !important;
    line-height: 43px !important;
    min-width: 0 !important;
  }

  >>> .el-menu-item-group__title {
    display: none;
  }

  >>> .el-submenu__title {
    height: 30px;
    line-height: 30px;
    text-align: center;
    background-color: #f3f7f9;
  }

  >>> .el-submenu__title i {
    display: none;
  }

  >>> .el-submenu__title span {
    font-weight: bold;
  }

  >>> .el-menu-item {
    border-bottom: var(--border);
  }

  >>> .el-menu-item:last-child {
    border-bottom: none;
  }

  >>> .el-menu-item:first-child {
    /* border-bottom: 1px solid #ebeef5; */
  }
}
</style>
