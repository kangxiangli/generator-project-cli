<template>
  <idss-widget style="padding: 15px;" class="extractor">
    <el-form
      :model="pickerData"
      ref="pickerData"
      size="small"
      label-width="100px"
      v-loading="loading['extactor']"
      @submit.native.prevent
      :disabled="isDisabled">
      <el-row>
        <el-col :span="13">
          <el-form-item label="任务ID">
            <el-input v-model="jobSerialNumber" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 提取器配置表单，可多个 -->
      <el-row v-for="(picker, index) in pickerData.data" :key="index">
        <el-col :span="13">
          <el-form-item
            label="提取器名称"
            :prop="'data.' + index + '.extractName'"
            :rules="[
              {required: true, message: ' 提取器名称不能为空', trigger: 'blur'},
              {min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur'}
            ]">
            <el-input v-model.trim="picker.extractName" placeholder="请输入提取器名称"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="13">
          <el-form-item
            label="日志分类"
            :prop="'data.' + index + '.extractDataCatalog'"
            :rules="{required: true, message: '请选择日志分类', trigger: 'change'}">
            <el-select v-model="picker.extractDataCatalog" filterable placeholder="请选择数据类型" stretch>
              <el-option
                v-for="item in deviceTypes"
                :key="item.value"
                :label="item.label"
                :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label-width="20px">
            <el-checkbox v-model="picker.hasUuid">从规则库选择</el-checkbox>
          </el-form-item>
        </el-col>
        <el-row v-if="picker.hasUuid" style="display: inline-block;">
          <el-col :span="6">
            <el-form-item label="厂商" prop="factoryUuid">
              <el-select
                v-model="picker.factoryUuid"
                placeholder="请选择厂商"
                @change="getTypeId('factoryId', $event)">
                <el-option
                  v-for="item in factoryoptions"
                  :key="item.uuid"
                  :label="item.chName"
                  :value="item.uuid"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="资产类型" prop="deviceTypeUuid">
              <idss-select-tree-filter
                :data="deviceoptions"
                size="small"
                :selected.sync="picker.deviceTypeUuid"
                width="100%"
                :defaultProps="{
                  children: 'children',
                  label: 'label',
                  id: 'id'
                }"></idss-select-tree-filter>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="规则名称" prop="ruleLibraryUuid">
              <el-select
                v-model="picker.ruleLibraryUuid"
                placeholder="请输入/选择规则"
                style="width:100%"
                @change="getLibraryInfo($event)"
                remote
                :remote-method="remoteMethod"
                filterable>
                <el-option
                  v-for="item in tableData.data"
                  :key="item.uuid"
                  :label="item.rule_name"
                  :value="item.uuid"></el-option>
                <idss-pagination
                  :tableData="tableData"
                  layout="total, prev, pager, next"
                  @size-change="dictionaryTableChange"
                  @page-change="dictionaryTableChange"></idss-pagination>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="2" style="text-align:right">
            <el-button @click="reSelect(index)" size="small">重置</el-button>
          </el-col>
        </el-row>
        <el-col :span="24">
          <el-form-item
            label="原始数据"
            :prop="'data.' + index + '.oldContent'"
            :rules="{required: true, message: '原始数据不能为空', trigger: 'change'}">
            <el-input
              type="textarea"
              :rows="3"
              v-model="picker.oldContent"
              :id="'txt' + index"
              placeholder="请选择原始数据"
              :disabled="extractStatus === 'edit' && picker.extractType === 'jsonRegex'"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="提取方式">
            <el-radio-group v-model="picker.extractType">
              <el-radio
                label="regex"
                border
                :disabled="!picker.editableExtractorType.includes('regex')">正则表达式</el-radio>
              <el-radio
                label="cef"
                border
                :disabled="!picker.editableExtractorType.includes('cef')">CEF</el-radio>
              <el-radio
                label="grok"
                border
                :disabled="!picker.editableExtractorType.includes('grok')">GROK</el-radio>
              <el-radio
                label="kv"
                border
                :disabled="!picker.editableExtractorType.includes('kv')">键值对</el-radio>
              <el-radio
                :disabled="!picker.editableExtractorType.includes('splitChar')"
                label="splitChar"
                border>分隔符</el-radio>
              <el-radio
                :disabled="!picker.editableExtractorType.includes('json')"
                label="json"
                border>JSON</el-radio>
              <el-radio
                :disabled="!picker.editableExtractorType.includes('jsonRegex')"
                label="jsonRegex"
                border>JSON + 正则表达式</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>

        <!-- 正则表达式 -->
        <el-col v-if="picker.extractType === 'regex'">
          <!-- <el-form-item label="正则表达式:" class="flex-wrapper">
            <el-input
              type="textarea"
              :id="'foo' + index"
              v-model="picker.tempExtractData['regex']['extractData']"
              @change="handleRuleChange(picker.tempExtractData['regex'].matcherList)"
              placeholder="请输入正则表达式"
              :rows="3"
            ></el-input>
          </el-form-item>-->
          <el-form-item
            label="正则表达式"
            :prop="picker.tempExtractData['regex'].extractData"
            :rules="{required: true, message: '请输入正则表达式', trigger: 'blur'}">
            <!-- <el-input type="textarea" v-model="pickerData.extractData" placeholder="请输入正则表达式"></el-input> -->
            <div class="el-textarea" style="display:flex">
              <div id="leftBox" v-if="!isDisabled">
                <textarea wrap="off" cols="3" id="leftNum" disabled></textarea>
              </div>
              <textarea
                id="codeTextarea"
                class="el-textarea__inner"
                v-bind:class="{'isDisabledEdit':isDisabled}"
                v-model="picker.tempExtractData['regex']['extractData']"
                @change="handleRuleChange(picker.tempExtractData['regex'].matcherList)"
                placeholder="请输入正则表达式"
                @keydown="keyUpEvent()"
                :disabled="isDisabled"
                :rows="3"
                onscroll="document.getElementById('leftNum').scrollTop = this.scrollTop;"></textarea>
            </div>
          </el-form-item>
        </el-col>

        <!-- 分隔符 -->
        <el-col v-if="picker.extractType === 'splitChar'">
          <el-row>
            <el-col :span="12">
              <el-form-item label="分隔符">
                <el-input
                  v-model="picker.tempExtractData['splitChar']['extractData']"
                  @change="handleRuleChange(picker.tempExtractData['splitChar'].matcherList)"
                  placeholder="分隔符(转义字符加 '\')"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="分隔字段">
            <el-input
              v-model="picker.tempExtractData['splitChar']['fieldName']"
              @change="handleRuleChange(picker.tempExtractData['splitChar'].matcherList)"
              placeholder="字段用逗号隔开"
              :rows="3"
              type="textarea"></el-input>
          </el-form-item>
        </el-col>

        <!-- kv -->
        <el-col v-if="picker.extractType === 'kv'">
          <el-col :span="6">
            <el-form-item label="字段分隔符" prop="firstField">
              <el-input
                v-model="picker.tempExtractData['kv']['firstField']"
                placeholder="分隔符(转义字符加'\')"
                @change="handleRuleChange(picker.tempExtractData['kv'].matcherList)"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="键值分隔符" prop="secondField">
              <el-input
                v-model="picker.tempExtractData['kv']['secondField']"
                @change="handleRuleChange(picker.tempExtractData['kv'].matcherList)"
                placeholder="分隔符(转义字符加'\')"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="映射字段" prop="fieldName">
              <el-input
                v-model="picker.tempExtractData['kv']['fieldName']"
                @change="handleRuleChange(picker.tempExtractData['kv'].matcherList)"
                placeholder="请输入映射字段"></el-input>
            </el-form-item>
          </el-col>
        </el-col>

        <!-- GROK -->
        <el-col v-if="picker.extractType === 'grok'">
          <el-form-item label="GROK" prop="fieldName">
            <el-input
              type="textarea"
              v-model="picker.tempExtractData['grok']['fieldName']"
              @change="handleRuleChange(picker.tempExtractData['grok'].matcherList)"
              placeholder="请输入GROK"></el-input>
          </el-form-item>
        </el-col>
        <!-- CEF -->
        <el-col v-if="picker.extractType === 'cef'">
          <el-form-item label="映射关系" prop="fieldName">
            <el-input
              type="textarea"
              v-model="picker.tempExtractData['cef']['fieldName']"
              @change="handleRuleChange(picker.tempExtractData['cef'].matcherList)"
              placeholder="请输入CEF"></el-input>
          </el-form-item>
        </el-col>
        <!-- json -->
        <el-col v-if="picker.extractType === 'json'">
          <el-form-item label="映射判断">
            <el-input
              v-model="picker.tempExtractData['json']['fieldName']"
              @change="handleRuleChange(picker.tempExtractData['json'].matcherList)"
              placeholder="请输入json字段"
              :rows="3"
              type="textarea"
              key="json"></el-input>
            <p style="color:#95979a">格式:原始字段->自定义字段,多个字段用逗号隔开。如:ip->dist_ip,name->src_name</p>
          </el-form-item>
        </el-col>

        <!-- jsonRegex -->
        <el-col v-if="picker.extractType === 'jsonRegex'">
          <el-form-item label="映射判断">
            <el-input
              v-model="picker.tempExtractData['jsonRegex']['fieldName']"
              @change="handleRuleChange(picker.tempExtractData['jsonRegex'].matcherList)"
              placeholder="请输入json字段"
              :rows="3"
              type="textarea"
              key="json"
              :disabled="extractStatus === 'edit'"></el-input>
            <p style="color:#95979a">格式:原始字段->自定义字段,多个字段用逗号隔开。如:ip->dist_ip,name->src_name</p>
            <p style="color:#95979a">注意：保存成功之后，原始数据和映射判断将不可修改。</p>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item>
            <el-button
              v-if="['regex', 'splitChar', 'json', 'kv', 'grok', 'cef'].includes(picker.extractType)"
              @click="checkData(picker, picker.extractType)"
              size="small">验证原始数据</el-button>
            <el-button
              v-if="picker.extractType==='jsonRegex'"
              @click="checkData(picker, 'jsonRegex')"
              size="small">验证原始数据</el-button>
            <el-button
              size="small"
              @click="getField(picker)"
              v-if="['json', 'splitChar', 'kv', 'cef'].includes(picker.extractType)">映射识别</el-button>
            <!-- <el-button size="medium" @click="checkRegex(picker)">验证原始数据</el-button> -->
          </el-form-item>
        </el-col>
        <!-- 验证结果表格 -->
        <el-col v-for="(value, key) in picker.tempExtractData" :key="key">
          <el-form-item
            v-if="key === picker.extractType && value.matcherList && value.matcherList.length"
            label="验证结果">
            <el-table
              ref="matcherTable"
              :data="value.matcherList"
              :row-key="value.name"
              style="width: 100%"
              border>
              <el-table-column prop="name" label="字段" width="200"></el-table-column>
              <el-table-column prop="value" label="值">
                <template slot-scope="scope">
                  <span class="highlight-txt">{{scope.row.value}}</span>
                </template>
              </el-table-column>
              <!-- jsonRegex 模式下使用 -->
              <template v-if="picker.extractType === 'jsonRegex'">
                <el-table-column label="操作" align="center" width="120px">
                  <template slot-scope="scope">
                    <el-button @click="addRegex(scope.row)">正则表达式</el-button>
                  </template>
                </el-table-column>
                <el-table-column type="expand" width="40px">
                  <template v-if="picker.extractType === 'jsonRegex'" slot-scope="props">
                    <div class="flex-wrapper">
                      <el-form-item label="正则表达式">
                        <el-input
                          v-model="props.row.extractData"
                          @change="handleRuleChange(props.row.matcherList)"
                          placeholder="请输入正则表达式"
                          type="textarea"
                          :rows="3"></el-input>
                        <div class="button-wrapper">
                          <el-button
                            size="small"
                            v-clip-board="{text: props.row.extractData, success: clipCb('success'), error: clipCb('error')}">复制</el-button>
                          <el-button
                            @click="checkData(props.row, 'regex')"
                            size="small"
                            type="primary"
                            style="margin-left: 0;">验证</el-button>
                        </div>
                      </el-form-item>
                    </div>

                    <!-- 二级验证表格 -->
                    <el-row v-if="props.row.matcherList && props.row.matcherList.length">
                      <el-form-item label="验证结果：">
                        <el-table :data="props.row.matcherList" border>
                          <el-table-column prop="name" label="字段" width="200"></el-table-column>
                          <el-table-column prop="value" label="值">
                            <template slot-scope="scope">
                              <span class="highlight-txt">{{scope.row.value}}</span>
                            </template>
                          </el-table-column>
                        </el-table>
                      </el-form-item>
                    </el-row>
                  </template>
                </el-table-column>
              </template>
            </el-table>
          </el-form-item>
        </el-col>

        <el-col class="idss-txt--center">
          <el-button @click="saveExtractor" size="medium" type="primary">保存</el-button>
        </el-col>
      </el-row>
    </el-form>

    <!-- 原始数据列表 -->
    <idss-widget shadow="never" style="margin: 0;" :header-style="{'padding': '14px 0'}">
      <template slot="title-left">原始数据</template>
      <template slot="title-right">
        <el-button @click="reGetOriginData" size="small">重新获取原始数据</el-button>
      </template>
      <el-table
        empty-text="暂无数据，请重新获取"
        border
        v-loading="loading['nomal-data-list']"
        :data="businessData.data"
        @row-click="handleRowClick($event)">
        <el-table-column type="index" label="编号" width="100"></el-table-column>
        <el-table-column prop="message" label="原始数据">
          <template slot-scope="scope">
            <p style="white-space:pre-wrap; text-align: justify;">{{scope.row.message}}</p>
          </template>
        </el-table-column>
      </el-table>
      <!-- FIXME: 前端分页 -->
      <idss-pagination
        style="padding: 10px;"
        :table-data="businessData"
        @size-change="businessTableChange"
        @page-change="businessTableChange"></idss-pagination>
    </idss-widget>
  </idss-widget>
</template>

<script>
import globalMixins from '@/mixins/globalMixins.js'
import service from './extractor-setting-service.js'
import commonService from './components/common-service.js'
import Clipboard from 'clipboard'

const BASE_URL = '/api/setting'
const API = {
  // 原始数据
  TASK_LIST () {
    return {
      url: BASE_URL + '/etl/kafka/topic/input-preview',
      method: 'post',
      tag: 'nomal-data-list'
    }
  },
  // 提取器内容
  EXTRACTOR_DETAIL (id) {
    return {
      method: 'get',
      url: BASE_URL + '/etl/job/ui/get-extractId?jobSerialNumber=' + id,
      tag: 'extactor'
    }
  },
  // 获取任务详情
  GET_JOB (id) {
    return {
      method: 'get',
      url: BASE_URL + '/etl/job/ui/get-job?jobSerialNumber=' + id,
      tag: 'extactor'
    }
  },
  // 保存提取器
  SAVE_EXTRACTOR: {
    method: 'post',
    url: BASE_URL + '/etl/job/ui/extract-save',
    tag: 'extactor'
  },
  // 正则校验
  VERIFY_REGEX: {
    method: 'post',
    url: BASE_URL + '/regex/verifyRegex/query'
  },
  // 日志分类
  DEVICE_TYPE: {
    url: '/api/pipeline/dict/select/get-device-type',
    method: 'get'
  }
}

const EXTRACT_RULE = {
  regex: {
    editable: ['regex'],
    valueField: ['extractData']
  },
  splitChar: {
    editable: ['splitChar'],
    valueField: ['extractData', 'fieldName']
  },
  json: {
    editable: ['json'],
    valueField: ['fieldName']
  },
  jsonRegex: {
    editable: ['jsonRegex'],
    valueField: ['fieldName']
  },
  cef: {
    editable: ['cef'],
    valueField: ['fieldName']
  },
  kv: {
    editable: ['kv'],
    valueField: ['extractData', 'fieldName']
  },
  grok: {
    editable: ['grok'],
    valueField: ['fieldName']
  }
}

export default {
  name: 'manage-data-allpicker',
  mixins: [globalMixins, service, commonService],
  // mixins: [globalMixins, extractor-setting, service],
  data () {
    return {
      isDisabled: false, // 是否不可编辑
      extractStatus: 'add',
      extractRule: EXTRACT_RULE,
      businessData: {
        data: [],
        total: 0
      },
      tableData: {},
      // 任务id
      jobSerialNumber: '',
      pickerData: {
        data: [{
          extractName: '', // 提取器名称
          extractDataCatalog: '', // 日志分类
          oldContent: '', // 原始数据
          extractType: 'regex', // 提取方式
          extractData: '', // 提取数据
          fieldName: '', // 字段名称，分隔符类型中使用
          hasUuid: false,
          logCategoryUuid: '',
          factoryUuid: '',
          deviceTypeUuid: '',
          // 规则值，控制是否可编辑
          tempExtractData: {
            regex: {},
            splitChar: {},
            json: {},
            jsonRegex: {},
            kv: {},
            grok: {},
            cef: {}
          },
          // radio是否可编辑
          editableExtractorType: ['regex', 'splitChar', 'json', 'jsonRegex', 'kv', 'grok', 'cef']
        }]
      },
      searchData: {},
      // 日志分类
      deviceTypes: [],
      factoryoptions: [],
      deviceoptions: [],
      logoptions: []
    }
  },
  methods: {
    dictionaryTableChange (params) {
      this.tableChange(params, this.tableData, this.getTableData)
    },
    // 复制内容回调函数
    clipCb (type = 'success') {
      let message = type === 'success' ? '复制成功' : '复制失败'
      return () => {
        this.showMessage(message, type)
      }
    },
    reSelect (index) {
      let newStr = {
        logCategoryUuid: '',
        factoryUuid: '',
        deviceTypeUuid: '',
        extractDataCatalog: '',
        ruleLibraryUuid: ''
      }
      this.pickerData.data[index] = Object.assign({}, this.pickerData.data[index], newStr)
      this.$set(this.pickerData.data, index, this.pickerData.data[index])
    },
    addRegex (row) {
      this.$refs['matcherTable'] && this.$refs['matcherTable'][0].toggleRowExpansion(row, true)
    },
    /**
     * 点击原始数据中的一行， 将数据赋值给 编辑中的 原始数据一栏
     */
    handleRowClick (param) {
      this.$set(this.pickerData.data[0], 'oldContent', param.message)
    },

    /**
     * 重新请求原始数据
     */
    reGetOriginData () {
      this.tableChange({ type: 'init' }, this.businessData, this.getNomalData)
    },

    /**
     * 复制 正则表达式的验证内容
     */
    copy (idx, type) {
      var mclass = '.copy' + idx
      const clipboard = new Clipboard(mclass)
      clipboard.on('success', e => {
        this.$message({
          type: 'success',
          message: '正则表达式已复制到粘贴板'
        })
      })
    },
    // 查询规则
    remoteMethod (query) {
      this.getLibraryData({ ruleName: query })
    },
    // 表达式改变时触发
    handleRuleChange (matcherList) {
      if (matcherList && matcherList.length) {
        matcherList.splice(0, matcherList.length)
        this.showMessage('数据已更改，建议重新校验', 'warning', { duration: 3000 })
      }
    },

    /**
     * 验证
     * @data {Object} data 当前提取器的数据 或者 表格当前行数据
     * @type {String} type 要验证的提取器类型
     */
    checkData (data, type) {
      // jsonRegex模式下，子表格正则校验
      let isSpecialRegex = !data.tempExtractData
      let requestData = {
        extractType: type,
        oldContent: '' // 原始数据
      }

      if (!isSpecialRegex) { // 非特殊模式
        requestData.oldContent = data.oldContent // 原始数据
        this.extractRule[type]['valueField'].forEach(item => {
          if (item === 'extractData') {
            requestData['pattern'] = data.tempExtractData[type][item]
          } else {
            requestData[item] = data.tempExtractData[type][item]
          }
        })
      } else { // jsonRegex模式下，子表格正则校验
        requestData.oldContent = data.value
        requestData.pattern = data['extractData']
      }
      if (!requestData['oldContent']) {
        return this.showMessage('原始数据不能为空', 'warning')
      }
      if (type === 'kv') {
        requestData['pattern'] = JSON.stringify([data.tempExtractData['kv'].firstField, data.tempExtractData['kv'].secondField])
      }
      if (type === 'grok') {
        requestData['pattern'] = data.tempExtractData['grok'].fieldName
      }

      // 正则校验请求
      this.verifyRegexRequest(requestData, data)
    },

    /**
     * 正则校验
     * @param {*} param
     * @param {*} idx
     */
    async verifyRegexRequest (param, currentData) {
      try {
        let content = await this.$request({
          ...API.VERIFY_REGEX,
          data: param
        })
        if (content && content.matcherExample) {
          this.showMessage('验证成功')

          // 目标数据转为数组
          let type = currentData.extractType
          let handleData = []
          for (let key in content.matcherExample) {
            let tempObject = {
              'name': key,
              'value': content.matcherExample[key]
            }
            if (type === 'jsonRegex') { // 额外的数据扩充
              tempObject.extractData = ''
              tempObject.matcherList = []
            }
            handleData.push(tempObject)
          }

          // 数据扩充
          if (type) { // 一级校验结果添加
            this.$set(currentData.tempExtractData[type], 'matcherList', handleData)
          } else { // jsonRegex模式下，二级正则校验
            this.$set(currentData, 'matcherList', handleData)
          }
        }
      } catch {
        // 数据清空
        if (currentData.extractType) {
          this.$set(currentData.tempExtractData[currentData.extractType], 'matcherList', [])
        } else { // jsonRegex模式下，验证后数据再添加正则表达式
          this.$set(currentData, 'matcherList', [])
        }
      }
    },

    /**
     * 判断提取器是否可编辑
     */
    saveExtractor () {
      this.$refs['pickerData'].validate((valid) => {
        if (valid) {
          // 1：检查数据是否验证通过，或者压根就没有校验
          let verified = false
          this.pickerData.data.forEach(item => {
            let type = item.extractType
            // 提取提类型有验证结果
            if (item.tempExtractData[type].matcherList && item.tempExtractData[type].matcherList.length) {
              if (type === 'jsonRegex') {
                // 至少有一个有验证结果
                let result = item.tempExtractData[type].matcherList.find(subItem => {
                  return subItem.matcherList && subItem.matcherList.length
                })
                verified = !!result
              } else {
                verified = true
              }
            }
          })

          if (!verified) {
            this.showMessage('还没有验证提取器或提取器验证失败', 'warning')
            return false
          }

          // 2：数据处理
          let requestParam = { data: [] }
          let tempRequestArray = JSON.parse(JSON.stringify(this.pickerData.data))
          tempRequestArray.forEach(item => {
            // 正常情况
            let tempItem = {}
            let type = item.extractType
            this.extractRule[type]['valueField'].forEach(subItem => {
              tempItem[subItem] = item.tempExtractData[type][subItem]
            })
            tempItem['jobSerialNumber'] = this.jobSerialNumber

            // jsonRegex 特殊处理
            if (type === 'jsonRegex') {
              tempItem['regexData'] = []
              item.tempExtractData[type].matcherList.forEach(subItem => {
                if (subItem.matcherList && subItem.matcherList.length) {
                  let tempObject = {
                    parentField: subItem.name,
                    extractData: subItem.extractData,
                    oldContent: subItem.value
                  }
                  delete subItem.name
                  delete subItem.value
                  delete subItem.matcherList
                  subItem.id && (tempObject = Object.assign(subItem, tempObject))
                  tempItem['regexData'].push(tempObject)
                }
              })
            }
            type === 'kv' && (tempItem['extractData'] = JSON.stringify([item['tempExtractData'][type].firstField, item['tempExtractData'][type].secondField]))
            type === 'grok' && (tempItem['extractData'] = item['tempExtractData'][type].fieldName)
            delete item.tempExtractData
            delete item.editableExtractorType
            requestParam.data.push(Object.assign(item, tempItem))
          })

          // 3：保存请求
          this.saveExtractorRequest(requestParam)
        } else {
          return false
        }
      })
    },

    /**
     * 提取器保存
     * @param {*} param
     */
    async saveExtractorRequest (param) {
      // 判断任务是否存在
      let content = await this.$request({
        ...API.GET_JOB(this.jobSerialNumber)
      })
      if (content && content.jobStatus === -1) {
        this.showMessage('任务不存在,无法保存!', 'error')
      } else {
        // 任务保存
        const data = await this.$request({
          ...API.SAVE_EXTRACTOR,
          data: param
        })
        // 跳转并关闭当前 tags
        this.$router.replaceTagPush({
          name: 'manage-data-extractor-setting',
          query: {
            id: this.jobSerialNumber,
            type: 'single',
            curId: data.id
          }
        }, this.$route)
      }
    },

    /**
     * 设置提取器数据模板
     * @params {Object} currentExtractor 当前提取器
     */
    setTempExtractData (currentExtractor) {
      let type = currentExtractor.extractType
      currentExtractor.ruleLibraryUuid = ''
      for (let key in this.extractRule) {
        let tempObject = {}
        if (key === type) {
          this.extractRule[key].valueField.map(item => {
            tempObject[item] = currentExtractor[item] || ''
          })
        } else {
          this.extractRule[key].valueField.map(item => {
            tempObject[item] = ''
          })
        }
        currentExtractor.tempExtractData[key] = tempObject
      }

      if (type === 'jsonRegex') {
        let parseData = JSON.parse(currentExtractor.extractDataSample)
        if (!parseData || !Object.keys(parseData).length) return false
        let matcherList = []

        for (let key in parseData) {
          let haveRegexItem = currentExtractor.jsonRegexExtractList.find(item => item.parentField === key)
          matcherList.push(
            Object.assign(
              haveRegexItem || {},
              {
                name: key,
                value: parseData[key],
                extractData: haveRegexItem ? haveRegexItem.extractData : '',
                matcherList: haveRegexItem ? this.objectToArray(JSON.parse(haveRegexItem.extractDataSample)) : []
              }
            )
          )
        }
        currentExtractor.tempExtractData['jsonRegex'].matcherList = matcherList
      }
      if (type === 'kv') {
        let parseDataKv = JSON.parse(currentExtractor.extractData)
        currentExtractor.tempExtractData['kv'].firstField = parseDataKv[0]
        currentExtractor.tempExtractData['kv'].secondField = parseDataKv[1]
      }
    },

    objectToArray (object) {
      let result = []
      for (let key in object) {
        result.push({
          name: key,
          value: object[key]
        })
      }
      return result
    },

    /**
     * 设置提取器编辑类型
     * @params {Object} currentExtractor 当前提取器
     */
    setEditableExtractType (currentExtractor, type) {
      let realType = type || currentExtractor.extractType
      let editableExtractorType = this.extractRule[realType].editable
      this.$set(currentExtractor, 'editableExtractorType', editableExtractorType)
    },

    /**
     * 获取提取器详细内容
     */
    async getExtractorDetail () {
      let content = await this.$request({
        ...API.EXTRACTOR_DETAIL(this.jobSerialNumber)
      })
      if (content && Array.isArray(content) && content.length) {
        let pickernum = this.$route.query.pickernum
        let targetExtractor = content.find(item => (item.id + '') === (pickernum + ''))
        if (!targetExtractor) return false

        // if (targetExtractor.extractType === 'jsonRegex') {

        // }
        this.$set(this.pickerData.data, 0, Object.assign(this.pickerData.data[0], targetExtractor))

        let currentExtractor = this.pickerData.data[0]
        this.setTempExtractData(currentExtractor)
        this.setEditableExtractType(currentExtractor)
      }
    },
    /**
     * 获取原始数据分页/排序
     */
    businessTableChange (params) {
      this.tableChange(params, this.businessData, this.getNomalData)
    },
    /**
     * 获取原始数据
     */
    async getNomalData () {
      let params = { 'jobSerialNumber': this.jobSerialNumber }
      this.businessData = await this.requestTable({
        ...API.TASK_LIST(),
        currentObj: this.businessData,
        params
      })
    },
    // async getNomalData () {
    //   let content = await this.$request({
    //     ...API.TASK_LIST(this.jobSerialNumber)
    //   })
    //   if (content && Array.isArray(content) && content.length) {
    //     this.businessData.data = content
    //     this.businessData.total = content.length
    //   }
    // },

    // 获取日志分类列表
    async getDeviceTypes () {
      this.deviceTypes = await this.$request({
        ...API.DEVICE_TYPE
      })
    },
    keyUpEvent () {
      let str = document.getElementById('codeTextarea').value
      str = str.replace(/\r/gi, '')
      str = str.split('\n')
      let n = str.length
      this.line(n)
    },
    line (n) {
      var lineobj = document.getElementById('leftNum')
      for (var i = 1; i <= n; i++) {
        if (document.all) {
          this.num += i + '\r\n'// 判断浏览器是否是IE
        } else {
          this.num += i + '\n'
        }
      }
      lineobj.value = this.num
      this.num = ''
    }
  },
  mounted () {
    // 有的地方跳过来是 id， 有的是 taksid。。。
    this.jobSerialNumber = this.$route.query.id || this.$route.query.taskid
    this.isDisabled = !!this.$route.query.isDisabled
    if (this.jobSerialNumber) {
      // 获取日志分类列表
      this.getDeviceTypes()
      // 获取原始数据
      this.getNomalData(this.jobSerialNumber)
      this.getLibraryData()
      // 提取器编辑编辑
      if (this.$route.query.pickernum) { // 编辑
        this.extractStatus = 'edit'
        this.getExtractorDetail()
      } else { // 新增
        this.setTempExtractData(this.pickerData.data[0])
        // 根据 this.$route.query.type 限定提取方式的type类型
        this.$route.query.type && this.setEditableExtractType(this.pickerData.data[0], this.$route.query.type)
      }
    }
  }
}
</script>

<style scoped lang="postcss">
.el-radio--small.is-bordered {
  margin-right: 16px;
}
.button-wrapper {
  display: inline-flex;
  flex-direction: column;
  justify-content: space-around;
  height: 70px;
  margin: 0 10px;
}
.extractor >>> .flex-wrapper .el-form-item__content,
.flex-wrapper.content,
.flex-wrapper >>> .el-form-item__content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.highlight-txt {
  display: inline-block;
  background: rgb(64, 158, 255);
  color: white;
}
#leftBox {
  /* background: #ecf0f5; */
  width: 35px;
  height: 100%;
  text-align: left;
  float: left;
}
#codeTextarea {
  border: 1px solid #eaeaea;
  outline: none;
  height: 120px;
  resize: none;
  line-height: 24px;
  font-size: 14px;
  float: left;
  padding: 10px 8px;
  color: black;
  font-family: inherit;
  box-sizing: border-box;
}
#leftNum {
  height: 120px;
  width: 100%;
  resize: none;
  outline: none;
  overflow-y: hidden;
  overflow-x: hidden;
  border: 0;
  background: rgb(247, 247, 247);
  color: #999;
  line-height: 24px;
  font-size: 14px;
  padding: 10px 4px;
  text-align: right;
  font-weight: bold;
  box-sizing: border-box;
}
.isDisabledEdit {
  background-color: #f5f7fa;
  border-color: #e4e7ed !important;
  color: #c0c4cc !important;
  cursor: not-allowed;
}
</style>
