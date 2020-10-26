/**
 * 提取器设置页面
 * 提起器保存之后进入此页面
 * 巨坑！！！！ 和allFilePicker功能基本一致，却分出两个页面，God bless you
 * 问题无处不在，改一个便会少一个 Believe oneself
 */

<template>
  <div id="idssAgent">
    <idss-widget style="padding: 15px 0 15px 0">
      <el-form label-width="80px">
        <el-form-item label="任务ID:" style="margin-bottom:0">
          <el-input style="width: 90%" v-model="taskids" disabled></el-input>
        </el-form-item>
        <el-dialog
          :title="staticTitle"
          :visible.sync="dialogFormVisible"
          width="30%">
          <el-form :model="form" ref="form" :rules="rules">
            <el-form-item label="字段名称:" label-width="90px" prop="name">
              <!--           <el-select v-model="form.name" clearable placeholder="请选择字段" filterable style="width: 100%">
            <el-option v-for="item in systemFields" :key="item.value" :label="item.value +'/'+item.name" :value="item.value" :disabled="item.disabled">
              <span style="float: left">{{ item.value }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.name }}</span>
            </el-option>
              </el-select>-->
              <el-select
                v-model="form.name"
                clearable
                placeholder="请选择字段"
                filterable
                :disabled="staticTitle === '编辑字段'"
                style="width: 100%">
                <el-option-group
                  v-for="group in systemFields"
                  :key="group.name"
                  :label="group.name">
                  <el-option
                    v-for="item in group.children.filter(
                      val => val.name !== 'eqpt_device_type'
                    )"
                    :key="item.id"
                    :label="item.field + '/' + item.name"
                    :value="item.field">
                    <span style="float: left">{{ item.field }}</span>
                    <span
                      style="float: right; color: #8492a6; font-size: 13px">{{ item.name }}</span>
                  </el-option>
                </el-option-group>
              </el-select>
            </el-form-item>
            <el-form-item label="字段类型:" label-width="90px" prop="type">
              <el-select
                v-model="form.type"
                disabled
                placeholder="请选择字段类型">
                <el-option label="string" value="string"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="字段值:" label-width="90px" prop="value">
              <el-input
                v-model="form.value"
                auto-complete="off"
                placeholder="请输入字段值"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button size="small" @click="dialogFormVisible = false">取 消</el-button>
            <el-button
              size="small"
              type="primary"
              @click="add_filepicker('form')">确 定</el-button>
          </div>
        </el-dialog>
      </el-form>
    </idss-widget>
    <idss-widget style="padding: 10px">
      <el-row :gutter="15">
        <el-col :span="4">
          <div class="grid-content bg-purple">
            <el-menu
              :default-active="defaultActiveExtactorId.toString()"
              :default-openeds="['1']"
              class="el-menu-vertical-demo pickerList">
              <el-submenu index="1">
                <template slot="title">
                  <span>提取器</span>
                </template>
                <el-menu-item-group>
                  <el-menu-item
                    v-for="item in scheme"
                    :key="item.id"
                    :index="item.id.toString()"
                    @click="rowClick(item)">
                    <p>{{ item.extractName }}</p>
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
              style="width: 100%"
              :row-class-name="tableRowClassName">
              <el-table-column
                type="index"
                label="编号"
                align="center"></el-table-column>
              <el-table-column
                prop="fieldName"
                label="字段名称"
                align="center"
                width="150"
                show-overflow-tooltip></el-table-column>
              <el-table-column
                prop="fieldSource"
                label="字段来源"
                align="center">
                <template slot-scope="scope">
                  <span v-if="scope.row.fieldSource == '1'">静态</span>
                  <span v-if="scope.row.fieldSource == '2'">原始</span>
                  <span v-if="scope.row.fieldSource == '3'">动态</span>
                  <span v-if="scope.row.fieldSource == '4'">合并</span>
                </template>
              </el-table-column>
              <el-table-column label="类型/值" align="center">
                <template slot-scope="scope">
                  <div class="cell">
                    <span v-if="scope.row.fieldSource !== '1'">{{
                      scope.row.fieldType
                    }}</span>
                    <span v-if="scope.row.fieldSource === '1'">{{
                      scope.row.fieldStaticValue
                    }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="忽略条件" align="center" width="100">
                <template slot-scope="scope">
                  <el-button
                    class="dataType"
                    @click="handleData('filter', scope.row)"
                    type="text"
                    size="small">
                    <svg
                      class="icon"
                      :class="{ svgChange: TYPE_DICTIONARY['filter'].isExistValue(scope.row) }"
                      aria-hidden="true">
                      <use xlink:href="#icon-outline-filter" />
                    </svg>
                  </el-button>
                </template>
              </el-table-column>
              <el-table-column label="替换条件" align="center" width="100">
                <template slot-scope="scope">
                  <el-button
                    class="dataType"
                    @click="handleData('replace', scope.row)"
                    type="text"
                    size="small">
                    <svg
                      class="icon"
                      :class="{ svgChange: TYPE_DICTIONARY['replace'].isExistValue(scope.row) }"
                      aria-hidden="true">
                      <use xlink:href="#icon-replace" />
                    </svg>
                  </el-button>
                </template>
              </el-table-column>
              <el-table-column label="动态补全" align="center" width="100">
                <template slot-scope="scope">
                  <el-button
                    class="dataType"
                    @click="handleData('change', scope.row)"
                    type="text"
                    size="small">
                    <svg
                      class="icon"
                      :class="{ svgChange: TYPE_DICTIONARY['change'].isExistValue(scope.row) }"
                      aria-hidden="true">
                      <use xlink:href="#icon-busao" />
                    </svg>
                  </el-button>
                </template>
              </el-table-column>
              <el-table-column label="时间转换" align="center" width="100">
                <template slot-scope="scope">
                  <el-button
                    class="dataType"
                    @click="handleData('time', scope.row)"
                    type="text"
                    size="small">
                    <svg
                      class="icon"
                      :class="{ svgChange: TYPE_DICTIONARY['time'].isExistValue(scope.row) }"
                      aria-hidden="true">
                      <use xlink:href="#icon-clocks" />
                    </svg>
                  </el-button>
                </template>
              </el-table-column>
              <el-table-column label="字段截取" align="center" width="90">
                <template slot-scope="scope">
                  <el-button
                    class="dataType"
                    @click="handleData('cut', scope.row)"
                    type="text"
                    size="small">
                    <svg
                      class="icon"
                      :class="{ svgChange: TYPE_DICTIONARY['cut'].isExistValue(scope.row) }"
                      aria-hidden="true">
                      <use xlink:href="#icon-cut" />
                    </svg>
                  </el-button>
                </template>
              </el-table-column>
              <el-table-column label="字段模糊" align="center" width="90">
                <template slot-scope="scope">
                  <el-button
                    class="dataType"
                    @click="handleData('dim', scope.row)"
                    type="text"
                    size="small">
                    <svg
                      class="icon"
                      :class="{ svgChange: TYPE_DICTIONARY['dim'].isExistValue(scope.row) }"
                      aria-hidden="true">
                      <use xlink:href="#icon-dim" />
                    </svg>
                  </el-button>
                </template>
              </el-table-column>
              <el-table-column
                label="操作"
                align="center"
                fixed="right"
                width="120">
                <template slot-scope="scope">
                  <el-button
                    @click="updateStaticField(scope.row, 'edit')"
                    :disabled="
                      scope.row.fieldSource === '2' ||
                        scope.row.fieldSource === '3'
                    "
                    type="text">编辑</el-button>
                  <el-button
                    @click="deleteStaticField(scope.row)"
                    :disabled="scope.row.fieldSource === '2'"
                    type="text">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-row style="margin: 10px 0">
              <el-button
                size="small"
                icon="el-icon-circle-plus"
                @click="mergeField()">字段合并</el-button>
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
                      required: true,
                      message: '字段不能为空',
                      trigger: 'change'
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
                    <el-input
                      size="small"
                      v-model="item.interval[0]"
                      placeholder="请输入字段连接符"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item
                    class="mergeForm"
                    :prop="'mergeFields.' + index + '.fieldName'"
                    :rules="[
                      {
                        required: true,
                        message: '合并字段不能为空',
                        trigger: 'blur'
                      },
                      {
                        validator: fieldNameReg,
                        message: '提取器中已存在该字段,请重新命名',
                        trigger: 'change'
                      }
                    ]">
                    <el-input
                      size="small"
                      v-model="item.fieldName"
                      placeholder="请输入合并字段名称"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
            <!-- <el-row
              v-for="(item, index) in mergeFields"
              :key="index"
              :gutter="21"
              style="margin-bottom:11px;display: flex;flex-wrap: nowrap;align-items: center;min-width: max-content;"
            >
              <el-col :span="1">
                <i class="el-icon-close" @click="delmergeField(index)"></i>
              </el-col>
              <el-col :span="6" style="display:flex;align-items:center">
                <el-select size="small" v-model="item.orgFields" multiple style="width:100%">
                  <el-option
                    v-for="(t, m) in tableData.fieldRulesList"
                    :key="m"
                    :label="t.fieldName"
                    :value="t.fieldName"
                  ></el-option>
                </el-select>
              </el-col>
              <el-col :span="4">
                <el-input size="small" v-model="item.interval[0]" placeholder="请输入字段连接符"></el-input>
              </el-col>
              <el-col :span="4">
                <el-input size="small" v-model="item.fieldName" placeholder="请输入合并后字段名称"></el-input>
              </el-col>
            </el-row>-->
            <!-- 新增静态字段 -->
            <el-row style="margin: 10px 0">
              <el-button
                size="small"
                icon="el-icon-circle-plus"
                @click="updateStaticField({fieldSource: '1'}, 'add')">新增静态字段</el-button>
            </el-row>
            <el-table
              :data="tableData.staticFieldEntityList"
              v-if="tableData.staticFieldEntityList"
              border
              style="width: 100%"
              :row-class-name="tableRowClassName">
              <el-table-column
                type="index"
                label="编号"
                align="center"
                width="120"></el-table-column>
              <el-table-column
                prop="fieldName"
                label="字段名称"
                align="center"></el-table-column>
              <el-table-column
                prop="fieldValue"
                label="字段值"
                align="center"></el-table-column>
              <el-table-column
                prop="fieldType"
                label="类型"
                align="center"></el-table-column>
            </el-table>
          </div>
          <el-row style="margin-top:30px;text-align: right;">
            <el-button size="small" @click="save()" type="primary">保存</el-button>
          </el-row>
        </el-col>
      </el-row>
      <el-dialog
        :title="dataTitle"
        :visible.sync="idssFormvisiable"
        :width="dataType == 'change' ? '1000px' : '860px'"
        align="left"
        :before-close="handleClose">
        <!-- WTF，全是v-if真是偷懒 -->
        <dataFilter
          v-if="dataType == 'filter'"
          v-on:close="closeDialogForm"
          v-on:closeDialog="closeDialog"
          :message="sendMessage"></dataFilter>
        <dataReplace
          v-if="dataType == 'replace'"
          v-on:close="closeDialogForm"
          v-on:closeDialog="closeDialog"
          :message="sendMessage"></dataReplace>
        <dataChange
          v-if="dataType == 'change'"
          v-on:close="closeDialogForm"
          v-on:closeDialog="closeDialog"
          :message="sendMessage"></dataChange>
        <dataTime
          v-if="dataType == 'time'"
          v-on:close="closeDialogForm"
          v-on:closeDialog="closeDialog"
          :message="sendMessage"></dataTime>
        <dataDim
          v-if="dataType == 'dim'"
          v-on:close="closeDialogForm"
          v-on:closeDialog="closeDialog"
          :message="sendMessage"></dataDim>
        <dataCut
          v-if="dataType == 'cut'"
          v-on:close="closeDialogForm"
          v-on:closeDialog="closeDialog"
          :message="sendMessage"></dataCut>
      </el-dialog>
    </idss-widget>
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
export default {
  mixins: [globalMixins, service],
  data () {
    return {
      defaultActiveExtactorId: '',
      dataTitle: '',
      dataType: '',
      idssFormvisiable: false,
      dialogFormVisible: false,
      scheme: [],
      tableData: [],
      taskids: '',
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
      row.row.index = row.rowIndex
    },

    /**
     * 关闭弹窗 before（主要处理弹窗右上角 x ？）
    */
    handleClose (done) {
      done()
      this.dataType = ''
    },

    /**
     * 点击表格图标，弹窗处理
     * @param item 类别 filter/change/replace/time/cut/dim
     * @param param 数据
    */
    handleData (type, row) {
      this.dataType = type
      this.dataTitle = this.TYPE_DICTIONARY[type].title
      this.currentIndex = row.index
      this.sendMessage.oldData = row
      // 示例数据
      if (this.matchExample) {
        this.sendMessage.demoData = this.matchExample[row.fieldName]
        if (!this.sendMessage.demoData && this.jsonRegexMatchExample) {
          this.sendMessage.demoData = this.jsonRegexMatchExample[row.fieldName]
        }
      }
      // 显示弹窗
      this.idssFormvisiable = true
    },

    rowClick (param) {
      // 要干啥？
      if (param.extractDataSample !== undefined) {
        this.matchExample = JSON.parse(param.extractDataSample)
        if (param.jsonRegexExtractList && param.jsonRegexExtractList.length) {
          this.jsonRegexMatchExample = JSON.parse(param.jsonRegexExtractList[0].extractDataSample)
        }
      }
      this.getrules(param.id)
    },

    closeDialog () {
      this.idssFormvisiable = false
    },

    /**
     * @param param [1, 'type', [data]]
    */
    closeDialogForm (param) {
      if (param[0] === 1) {
        this.idssFormvisiable = false
      }
      this.dataType = ''
      // WTF，这里是想通过引用类型，来做到值修改吗？
      this.tableData.fieldRulesList[this.currentIndex].ruleEntity = this.tableData.fieldRulesList[this.currentIndex].ruleEntity || {}
      this.tableData.fieldRulesList[this.currentIndex].ruleEntity[param[1]] = param[2]
    },

    save () {
      // 保存前格式化处理 timeConvertCondition 有啥特殊性？
      // 字段为空时，删除该字段 --> 导致该问题，就是因为没有值时，字段格式需要删除导致！！！
      this.tableData['fieldRulesList'].forEach(item => {
        let timeConvertCondition = item.ruleEntity && item.ruleEntity['timeConvertCondition']
        if (timeConvertCondition) {
          if (!timeConvertCondition['changeFormat'] || !timeConvertCondition['originalFormat']) {
            delete item.ruleEntity['timeConvertCondition']
          }
        }
      })
      this.tableData['megreFieldEntityList'] = this.mergeForm.mergeFields
      this.rulesave(this.tableData, 'single')
    },

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
    }
  },
  components: {
    dataFilter,
    dataReplace,
    dataChange,
    dataTime,
    dataDim,
    dataCut
  },
  async mounted () {
    /**
     * 数据字典，处理各种类别
     * 标题，是否有数据（高亮）
     * @fixme isExistValue 方法极其不合理，字段判断好冗余
    */
    this.TYPE_DICTIONARY = {
      filter: {
        title: '忽略条件',
        isExistValue (row) {
          let filterConditionList = (row.ruleEntity || {}).filterConditionList
          return filterConditionList && filterConditionList.length
        }
      },
      replace: {
        title: '替换条件',
        isExistValue (row) {
          let replaceConditionList = (row.ruleEntity || {}).replaceConditionList
          return replaceConditionList && replaceConditionList.length
        }
      },
      change: {
        title: '动态补全',
        isExistValue (row) {
          let fillUpConditionList = (row.ruleEntity || {}).fillUpConditionList
          // dictName 为组件内部字段
          return fillUpConditionList && fillUpConditionList.length && fillUpConditionList[0].dictName
        }
      },
      time: {
        title: '时间转换',
        isExistValue (row) {
          let timeConvertCondition = (row.ruleEntity || {}).timeConvertCondition
          // changeFormat 为组件内部字段（注意这个是个非数组）
          return timeConvertCondition && timeConvertCondition.originalFormat && timeConvertCondition.changeFormat
        }
      },
      cut: {
        title: '字段截取',
        isExistValue (row) {
          let subConditionList = (row.ruleEntity || {}).subConditionList
          // startIndex length 为组件内部字段（数组只有一个值）
          return subConditionList && subConditionList.length && (subConditionList[0].startIndex || subConditionList[0].length)
        }
      },
      dim: {
        title: '字段模糊',
        isExistValue (row) {
          let desensitizationCondition = (row.ruleEntity || {}).desensitizationCondition
          // start end 为组件内部字段（数组只有一个值）
          return desensitizationCondition && desensitizationCondition.length && (desensitizationCondition[0].start || desensitizationCondition[0].end)
        }
      }
    }

    this.taskids = this.$route.query.id
    // WTF getextractId方法中，需要用到this.taskids，显示传递
    // 请求左侧提取器列表
    await this.getextractId()
    this.getLogDict()
    // 如果有初始指定的提取器，调用点击事件回调
    // defaultActiveExtactorId 来自于 this.getLogDict() 赋值
    if (this.defaultActiveExtactorId && this.scheme.length > 0) {
      this.rowClick(this.scheme.find(val => {
        // 因为 this.$route.query 中的数字类型参数，在直接刷新的时候会转为字符串，而页面内的跳转过来的是 int，所以这里统一为 string 去比较
        return val.jobSerialNumber === this.taskids && String(val.id) === String(this.defaultActiveExtactorId)
      }))
    }
  }
}
</script>

<style scoped lang="postcss">
button svg {
  width: 25px;
  height: 25px;
}
.dataType img {
  width: 20px;
}
.pickerList {
  border: 1px solid #ebeef5;
}
.pickerList .el-submenu .el-menu-item {
  margin: 0 !important;
  padding: 0 !important;
  text-align: center;
  height: 43px !important;
  line-height: 43px !important;
  min-width: 0 !important;
}
.pickerList .el-menu-item-group__title {
  display: none;
}
.pickerList .el-submenu__title {
  height: 30px;
  line-height: 30px;
  text-align: center;
  background-color: #f3f7f9;
}
.pickerList .el-submenu__title i {
  display: none;
}
.pickerList .el-submenu__title span {
  font-weight: bold;
}
.pickerList .el-menu-item {
  border-bottom: var(--border);
}
.pickerList .el-menu-item:last-child {
  border-bottom: none;
}
.pickerList li.el-menu-item:first-child {
  /* border-bottom: 1px solid #ebeef5; */
}
.svgChange {
  fill: var(--color-primary);
}
.mergeForm {
  margin-bottom: 0px;
  width: 100%;
}
.mergeForm .el-form-item__content {
  width: 100%;
}
.mergeForm .el-form-item__content input {
  height: 32px !important;
}
</style>
