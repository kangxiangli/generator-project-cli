<template>
  <div class="manage-realtime-manage-config" v-loading="viewLoading || loading['realtime-save']">
    <idss-widget :main-style="{ paddingRight: '20px' }" :footer-style="{ paddingBottom: '15px' }">
      <el-form
        :disabled="isViewMode"
        ref="realtimeForm"
        :model="realtimeForm"
        label-width="110px"
        size="small"
        :rules="realtimeRules">
        <!-- 基础属性 -->
        <idss-widget v-bind="widgetProps">
          <template slot="title-left">
            <span>基础属性</span>
          </template>
          <el-form-item label="策略名称" prop="name">
            <el-input v-model.trim="realtimeForm.name" placeholder="请输入策略名称" maxlength="100" show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="策略描述" prop="desc">
            <el-input type="textarea" v-model.trim="realtimeForm.desc" placeholder="请输入策略描述"></el-input>
          </el-form-item>
          <el-form-item label="是否启用" prop="status">
            <el-radio-group v-model="realtimeForm.status">
              <el-radio :label="true">是</el-radio>
              <el-radio :label="false">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="策略分类" prop="ruleType">
            <idss-select-tree-filter
              :disabled="isViewMode"
              placeholder="请选择策略分类"
              size="small"
              :data="riskTypeTree"
              :selected.sync="realtimeForm.ruleType"
              :defaultProps="{
                children: 'children',
                label: 'name',
                id: 'id'
              }"></idss-select-tree-filter>
          </el-form-item>
          <el-form-item label="策略模板" prop="ruleTemplate">
            <el-select
              @change="templateChange"
              stretch
              v-model="realtimeForm.ruleTemplate"
              placeholder="请选择策略模板">
              <template v-for="item in policyList">
                <el-option :key="item.id" :value="item.id" :label="item.name"></el-option>
              </template>
            </el-select>
            <p v-if="templateObj.desc" style="background:#EAEAEA;padding-left: 14px;">
              <strong>规则模板描述:</strong>
              {{ templateObj.desc }}
            </p>
          </el-form-item>
        </idss-widget>
        <!-- @FIXME 为什么要判断 templateObj ??? -->
        <template v-if="Object.keys(templateObj).length > 0">
          <!-- 数据源 -->
          <idss-widget v-bind="widgetProps">
            <template slot="title-left">
              <span>数据源</span>
            </template>
            <!-- 当模板为关联模板类型时，需要选择两个数据源, 目前 realtimeForm.events 最长是2 -->
            <template v-for="(event, index) in realtimeForm.events">
              <el-row :gutter="20" :key="event.key" class="event-row">
                <el-col :span="6">
                  <el-form-item
                    label="数据名称"
                    :prop="'events.' + index + '.temEventId'"
                    :rules="{
                      required: true,
                      message: '请选择数据名称',
                      trigger: 'blur'
                    }">
                    <assemble-select
                      style="width: 100%;padding-right: 20px;"
                      :eventList="eventListObj.eventList"
                      :selected.sync="event.temEventId"
                      @change="eventChange(index)"/>
                    <!-- 在Unicode中65是A， 66是B 依次类推 这里是要标出当前的数据源是A还是B -->
                    <span class="codeindex">{{ String.fromCharCode(65 + index) }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="18" class="event-row__right">
                  <!-- type === 'pattern' 表示关联类型的模板 -->
                  <template v-if="templateObj.type === 'pattern'">
                    <div
                      class="event-row__left"
                      :class="event.quantifier.type === 'between' ? 'min' : 'max'">
                      <!-- 操作符 等于、大于等于、两者之间 -->
                      <div class="left-opera">
                        <el-form-item
                          label="发生次数"
                          :label-width="fourLableWidth"
                          :prop="'events.' + index + '.quantifier.type'"
                          :rules="{
                            required: true,
                            message: '发生次数不能为空',
                            trigger: 'blur'
                          }">
                          <el-select
                            @change="val => operaChange(val, event, index)"
                            v-model="event.quantifier.type"
                            placeholder="请选择">
                            <template v-for="op in eventOpera">
                              <el-option :label="op.name" :value="op.value" :key="op.name"></el-option>
                            </template>
                          </el-select>
                        </el-form-item>
                      </div>
                      <!-- 两个input-number -->
                      <template v-if="event.quantifier.type">
                        <div class="left-value">
                          <el-form-item
                            label-width="10px"
                            :prop="'events.' + index + '.quantifier.valueOne'"
                            :rules="{
                              required: true,
                              message: '不能为空',
                              trigger: 'blur'
                            }">
                            <el-input-number
                              style="width: 100%;"
                              v-model="event.quantifier.valueOne"
                              controls-position="right"
                              :min="1"
                              :max="2147483647"></el-input-number>
                          </el-form-item>
                        </div>
                        <div class="left-value" v-if="event.quantifier.type === 'between'">
                          <el-form-item
                            label-width="10px"
                            :prop="'events.' + index + '.quantifier.valueTwo'"
                            :rules="{
                              required: true,
                              message: '不能为空',
                              trigger: 'blur'
                            }">
                            <el-input-number
                              style="width: 100%;"
                              v-model="event.quantifier.valueTwo"
                              controls-position="right"
                              :min="1"
                              :max="2147483647"></el-input-number>
                          </el-form-item>
                        </div>
                      </template>
                    </div>
                  </template>
                  <el-form-item
                    class="right-item"
                    label="过滤条件"
                    :label-width="fourLableWidth"
                    :prop="'events.' + index + '.str'"
                    :rules="{
                      required: event.radioType === 'global',
                      message: '过滤条件不能为空',
                      trigger: 'change'
                    }">
                    <el-tag size="small" class="tag-overflow">
                      <el-tooltip v-if="event.str" :content="event.str" placement="top-start">
                        <span>{{ event.str }}</span>
                      </el-tooltip>
                      <span v-else>无</span>
                    </el-tag>
                    <el-button
                      class="tag-btn"
                      @click="editEventFilter('realtime-filter', event, index)"
                      type="text">编辑</el-button>
                  </el-form-item>
                </el-col>
              </el-row>
            </template>
            <el-form-item label="分组条件" v-if="templateObj.type === 'pattern'" prop="correlation">
              <el-tag size="small" class="tag-overflow">
                <el-tooltip
                  v-if="buildRelExpression"
                  :content="buildRelExpression"
                  placement="top-start">
                  <span>{{ buildRelExpression }}</span>
                </el-tooltip>
                <span v-else>无</span>
              </el-tag>
              <el-button @click="editEventRelevance()" type="text">编辑</el-button>
            </el-form-item>
            <el-form-item
              label="关联关系"
              v-if="templateObj.type === 'pattern'"
              prop="relationCondition.str">
              <el-tag size="small" class="tag-overflow">
                <el-tooltip
                  v-if="realtimeForm.relationCondition.str"
                  :content="realtimeForm.relationCondition.str"
                  placement="top-start">
                  <span>{{ realtimeForm.relationCondition.str }}</span>
                </el-tooltip>
                <span v-else>无</span>
              </el-tag>
              <el-button @click="editEventFilter('realtime-relation')" type="text">编辑</el-button>
            </el-form-item>
          </idss-widget>
          <!-- 时间窗口 -->
          <idss-widget v-if="templateObj.hasWindow" v-bind="widgetProps">
            <template slot="title-left">
              <span>时间窗口</span>
            </template>
            <div style="display: inline-block;width: 400px;">
              <el-form-item
                label="时间属性"
                prop="window.attrField"
                :rules="{
                  required: true,
                  message: '请选择时间属性',
                  trigger: ['change', 'blur']
                }">
                <el-select
                  stretch
                  v-model.trim="realtimeForm.window.attrField"
                  placeholder="请选择时间属性">
                  <el-option
                    v-for="item in windowTimeFieldsList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.alias"></el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="item-value-unit">
              <el-form-item
                label-width="80px"
                label="窗口大小"
                prop="window.value"
                :rules="{
                  required: true,
                  message: '请输入窗口大小',
                  trigger: 'blur'
                }">
                <el-input-number
                  style="width: 100%;"
                  v-model="realtimeForm.window.value"
                  controls-position="right"
                  :min="1"
                  :max="3600"></el-input-number>
              </el-form-item>
            </div>
            <div style="display: inline-block;width: 80px;" class="number-width">
              <el-form-item
                label-width="0"
                prop="window.unit"
                :rules="{
                  required: true,
                  message: '请选择时间单位',
                  trigger: 'change'
                }">
                <el-select
                  disabled
                  stretch
                  v-model="realtimeForm.window.unit"
                  placeholder="请选择时间单位">
                  <el-option v-for="(val, key) in timeUnit" :key="key" :label="val" :value="key"></el-option>
                </el-select>
              </el-form-item>
            </div>
            <!-- 普通模板 Having 才会显示滑动步长与滚动窗口 -->
            <template v-if="templateObj.hasHaving">
              <!-- 如果选择了 滚动窗口 则不显示滑动步长 -->
              <template v-if="!realtimeForm.window.tumblingWindow">
                <div class="item-value-unit">
                  <el-form-item
                    label-width="80px"
                    label="滑动步长"
                    prop="window.slide"
                    :rules="{
                      required: true,
                      message: '请输入滑动步长',
                      trigger: 'blur'
                    }">
                    <el-input-number
                      style="width: 100%;"
                      v-model="realtimeForm.window.slide"
                      controls-position="right"
                      :min="1"
                      :max="realtimeForm.window.value"></el-input-number>
                  </el-form-item>
                </div>
                <div style="display: inline-block;width: 80px;" class="number-width">
                  <el-form-item
                    label-width="0"
                    prop="window.unit"
                    :rules="{
                      required: true,
                      message: '请选择时间单位',
                      trigger: 'change'
                    }">
                    <el-select
                      disabled
                      stretch
                      v-model="realtimeForm.window.unit"
                      placeholder="请选择时间单位">
                      <el-option
                        v-for="(val, key) in timeUnit"
                        :key="key"
                        :label="val"
                        :value="key"></el-option>
                    </el-select>
                  </el-form-item>
                </div>
              </template>
              <div style="display: inline-block;margin-left: 20px;">
                <el-form-item label-width="0" prop="window.tumblingWindow">
                  <el-checkbox v-model="realtimeForm.window.tumblingWindow">滚动窗口</el-checkbox>
                </el-form-item>
              </div>
            </template>
          </idss-widget>
          <!-- 触发条件  普通模板 Having 才会显示 -->
          <idss-widget v-if="templateObj.hasHaving" v-bind="widgetProps">
            <template slot="title-left">
              <span>触发条件</span>
            </template>
            <el-form-item label="分组条件" prop="groupBy">
              <idss-select-tree-filter
                placeholder="请选择分组条件"
                :disabled="isViewMode"
                multiple
                size="small"
                :data="buildFiled(realtimeForm.events[0].radioType)"
                :selected.sync="realtimeForm.groupBy"
                :defaultProps="{
                  children: 'children',
                  label: 'attrName',
                  id: 'attrField'
                }"></idss-select-tree-filter>
            </el-form-item>
            <!-- Having模板 计数、去重、求和、平均的4个模板处理的字段逻辑不一样，这里分4个if写的 -->
            <!-- Having模板 计数去重 -->
            <template v-if="templateObj.having === 'count(DISTINCT)'">
              <el-row :gutter="20">
                <el-col :span="10">
                  <el-form-item
                    label-width="115px"
                    style="margin-left: 110px;"
                    label="DISTINCT字段"
                    prop="having.attrField"
                    :rules="{
                      required: true,
                      message: '请选择DISTINCT字段',
                      trigger: 'change'
                    }">
                    <idss-select-tree-filter
                      :disabled="isViewMode"
                      placeholder="请选择DISTINCT字段"
                      size="small"
                      :data="buildFiled(realtimeForm.events[0].radioType)"
                      :selected.sync="realtimeForm.having.attrField"
                      :defaultProps="{
                        children: 'children',
                        label: 'attrName',
                        id: 'attrField'
                      }"></idss-select-tree-filter>
                  </el-form-item>
                </el-col>
                <el-col :span="6" style="position: relative;">
                  <span class="triggerspan">的个数</span>
                  <el-form-item
                    style="padding-left: 60px;"
                    label-width="0"
                    prop="having.compareType"
                    :rules="{
                      required: true,
                      message: '请选择运算',
                      trigger: 'change'
                    }">
                    <el-select
                      stretch
                      v-model="realtimeForm.having.compareType"
                      placeholder="请选择运算">
                      <template v-for="logic in logicData">
                        <el-option :key="logic.name" :label="logic.name" :value="logic.value"></el-option>
                      </template>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item
                    label-width="0"
                    prop="having.value"
                    :rules="{
                      required: true,
                      message: '请输入',
                      trigger: 'blur'
                    }">
                    <el-input-number
                      style="width: 100%;"
                      v-model.trim="realtimeForm.having.value"
                      controls-position="right"
                      :min="1"
                      :max="2147483647"></el-input-number>
                  </el-form-item>
                </el-col>
              </el-row>
            </template>
            <!-- 普通模板 Having count 计数类型 -->
            <template v-else-if="templateObj.having === 'count(*)'">
              <el-row :gutter="20">
                <el-col :span="10">
                  <el-form-item
                    label-width="60px"
                    style="margin-left: 100px;"
                    label="个数"
                    prop="having.compareType"
                    :rules="{
                      required: true,
                      message: '请选择运算',
                      trigger: 'change'
                    }">
                    <el-select
                      stretch
                      v-model="realtimeForm.having.compareType"
                      placeholder="请选择运算">
                      <template v-for="logic in logicData">
                        <el-option :key="logic.name" :label="logic.name" :value="logic.value"></el-option>
                      </template>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item
                    label-width="0"
                    prop="having.value"
                    :rules="{
                      required: true,
                      message: '请输入',
                      trigger: 'blur'
                    }">
                    <el-input-number
                      style="width: 100%;"
                      v-model.trim="realtimeForm.having.value"
                      controls-position="right"
                      :min="1"
                      :max="2147483647"></el-input-number>
                  </el-form-item>
                </el-col>
              </el-row>
            </template>
            <!-- 普通模板 Having 求和类型 -->
            <template v-else-if="templateObj.having === 'sum'">
              <el-row :gutter="20">
                <el-col :span="10">
                  <el-form-item
                    label-width="90px"
                    style="margin-left: 100px;"
                    label="计算字段"
                    prop="having.attrField"
                    :rules="{
                      required: true,
                      message: '请选择',
                      trigger: 'change'
                    }">
                    <idss-select-tree-filter
                      :disabled="isViewMode"
                      placeholder="请选择计算字段"
                      size="small"
                      :data="buildFiled(realtimeForm.events[0].radioType, false, true)"
                      :selected.sync="realtimeForm.having.attrField"
                      :defaultProps="{
                        children: 'children',
                        label: 'attrName',
                        id: 'attrField'
                      }"></idss-select-tree-filter>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item
                    label-width="60px"
                    label="求和"
                    prop="having.compareType"
                    :rules="{
                      required: true,
                      message: '请选择运算',
                      trigger: 'change'
                    }">
                    <el-select
                      stretch
                      v-model="realtimeForm.having.compareType"
                      placeholder="请选择运算">
                      <template v-for="logic in logicData">
                        <el-option :key="logic.name" :label="logic.name" :value="logic.value"></el-option>
                      </template>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item
                    label-width="0"
                    prop="having.value"
                    :rules="{
                      required: true,
                      message: '请输入',
                      trigger: 'blur'
                    }">
                    <el-input-number
                      style="width: 100%;"
                      v-model.trim="realtimeForm.having.value"
                      controls-position="right"
                      :min="1"></el-input-number>
                  </el-form-item>
                </el-col>
              </el-row>
            </template>
            <!-- 普通模板 Having 平均值类型 -->
            <template v-else-if="templateObj.having === 'avg'">
              <el-row :gutter="20">
                <el-col :span="10">
                  <el-form-item
                    label-width="90px"
                    style="margin-left: 110px;"
                    label="计算字段"
                    prop="having.attrField"
                    :rules="{
                      required: true,
                      message: '请选择',
                      trigger: 'change'
                    }">
                    <idss-select-tree-filter
                      :disabled="isViewMode"
                      placeholder="请选择计算字段"
                      size="small"
                      :data="buildFiled(realtimeForm.events[0].radioType, false, true)"
                      :selected.sync="realtimeForm.having.attrField"
                      :defaultProps="{
                        children: 'children',
                        label: 'attrName',
                        id: 'attrField'
                      }"></idss-select-tree-filter>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item
                    label-width="60px"
                    label="平均"
                    prop="having.compareType"
                    :rules="{
                      required: true,
                      message: '请选择运算',
                      trigger: 'change'
                    }">
                    <el-select
                      stretch
                      v-model="realtimeForm.having.compareType"
                      placeholder="请选择运算">
                      <template v-for="logic in logicData">
                        <el-option :key="logic.name" :label="logic.name" :value="logic.value"></el-option>
                      </template>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item
                    label-width="0"
                    prop="having.value"
                    :rules="{
                      required: true,
                      message: '请输入',
                      trigger: 'blur'
                    }">
                    <el-input-number
                      style="width: 100%;"
                      v-model.trim="realtimeForm.having.value"
                      controls-position="right"
                      :min="1"
                      :max="2147483647"></el-input-number>
                  </el-form-item>
                </el-col>
              </el-row>
            </template>
          </idss-widget>
          <!-- 输出结果 -->
          <idss-widget v-bind="widgetProps">
            <template slot="title-left">
              <span>输出结果</span>
            </template>
            <el-row :gutter="20">
              <el-col :span="6">
                <el-form-item
                  label="事件名称"
                  prop="output.eventName"
                  :rules="{
                    required: true,
                    message: '不能为空',
                    trigger: 'blur'
                  }">
                  <el-input v-model.trim="realtimeForm.output.eventName" placeholder="请输入事件名称" maxlength="255"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label-width="70px" label="内部事件" prop="output.innerEvent">
                  <el-checkbox v-model="realtimeForm.output.innerEvent"></el-checkbox>
                </el-form-item>
              </el-col>
            </el-row>
            <!-- 因为输出属性可以有N个，所以这里是个循环 -->
            <template v-for="(property, index) in realtimeForm.output.selects">
              <el-row :gutter="20" :key="property.key">
                <!-- 第一列 -->
                <el-col :span="6">
                  <el-form-item
                    label="输出属性"
                    :prop="'output.selects.' + index + '.eventField'"
                    :rules="{
                      required: true,
                      message: '请选择输出属性',
                      trigger: 'change'
                    }">
                    <!-- 前两行禁用，设置的默认值 -->
                    <el-select
                      :disabled="index <= 1"
                      filterable
                      style="width: 100%;"
                      v-model="property.eventField"
                      placeholder="请选择输出属性">
                      <el-option
                        v-for="item in eventFieldList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.name"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <!-- 第二列 内部事件相关选项 -->
                <el-col :span="6">
                  <el-form-item
                    label-width="0"
                    :prop="'output.selects.' + index + '.as'"
                    :rules="{
                      required: true,
                      message: '不能为空',
                      trigger: 'change'
                    }">
                    <!--
                      @FIXME 为什么下标大于1的才可以编辑??? - 产品设计这一的，前两个默认的禁用
                      outputABChange => 当数据源发生变化后 会清空第三列的已选字段
                    -->
                    <el-select
                      @change="outputABChange(property, index)"
                      style="width: 100%;"
                      v-model.trim="property.as"
                      placeholder="请选择数据源">
                      <el-option
                        v-for="(item, inx) in abList"
                        :key="inx"
                        :label="item.label"
                        :value="item.value"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <!-- 第三列 -->
                <el-col :span="4">
                  <el-form-item
                    label-width="0"
                    :prop="'output.selects.' + index + '.attrField'"
                    :rules="{
                      required: true,
                      message: '不能为空',
                      trigger: 'change'
                    }">
                    <el-select
                      :disabled="index <= 1"
                      filterable
                      style="width: 100%;"
                      v-model="property.attrField"
                      placeholder="请选择">
                      <template v-if="index >= 1">
                        <el-option
                          v-for="item in buildFiled(property.as, true)"
                          :key="item.attrField"
                          :label="item.attrField"
                          :value="item.attrField"></el-option>
                      </template>
                    </el-select>
                  </el-form-item>
                </el-col>
                <!-- 第四列 范围选择相关 -->
                <el-col :span="2">
                  <el-form-item
                    label-width="0"
                    :prop="'output.selects.' + index + '.fn'"
                    :rules="{
                      required: true,
                      message: '不能为空',
                      trigger: 'change'
                    }">
                    <!-- 2019.11.29 唐笑于 要求 去除 first_time last_time 的禁用效果。因为后台版本问题导致字段类型出错(string与int 老版本含有string)。 -->
                    <el-select
                      size="small"
                      v-model.trim="property.fn"
                      placeholder="请选择">
                      <el-option
                        v-for="(val, key) in outFunUnit[property.attrType] || outFunUnit['default']"
                        :key="key"
                        :label="val"
                        :value="key"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <!-- 第五列 加入黑名单操作相关 -->
                <el-col :span="6" style="position: relative;">
                  <div class="outcomediv">
                    <el-form-item label-width="0" :prop="'output.selects.' + index + '.addList'">
                      <el-checkbox v-model.trim="property.addList">加入名单</el-checkbox>
                    </el-form-item>
                  </div>
                  <template v-if="property.addList">
                    <el-form-item
                      label-width="0"
                      style="padding-left: 105px;padding-right: 35px;"
                      :prop="'output.selects.' + index + '.listIds'">
                      <el-select
                        style="width:100%;"
                        v-model.trim="property.listIds"
                        placeholder="请选择">
                        <el-option
                          v-for="item in realDictionary['list']"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id"></el-option>
                      </el-select>
                    </el-form-item>
                  </template>
                  <!-- 输出属性最后面的删除按钮 -->
                  <template v-if="!isViewMode">
                    <button
                      v-if="index > 1"
                      @click.prevent="removeOutcome(index)"
                      style="position: absolute;top: -2px;right: 10px;"
                      :style="property.addList ? {right: '10px'} : {left: '100px'}"
                      class="idss-button-icon idss-svg_delete-hover">
                      <idss-icon-svg name="delete-hover"></idss-icon-svg>
                    </button>
                  </template>
                </el-col>
              </el-row>
            </template>
            <div>
              <el-button @click="addOutcome()" style="margin-left: 110px;" size="small" plain>添加输出属性</el-button>
            </div>
          </idss-widget>
          <!-- 告警配置 -->
          <idss-widget v-bind="widgetProps">
            <template slot="title-left">
              <span>告警配置</span>
            </template>
            <el-form-item label="是否启用" prop="alert.enabled">
              <el-radio-group v-model="realtimeForm.alert.enabled" @change="enabledChange()">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <template v-if="realtimeForm.alert.enabled">
              <el-form-item label="风险类型" prop="alert.riskType">
                <idss-select-tree-filter
                  :disabled="isViewMode"
                  placeholder="请选择风险类型"
                  size="small"
                  :data="sceneRiskList"
                  :selected.sync="realtimeForm.alert.riskType"
                  :defaultProps="{
                    children: 'children',
                    label: 'name',
                    id: 'id'
                  }"></idss-select-tree-filter>
              </el-form-item>
              <!-- <el-form-item label="风险级别" prop="alert.severity" :rules="{required: true, message: '请选择风险级别', trigger: 'change'}"> -->
              <el-form-item label="风险级别" prop="alert.severity">
                <el-select stretch v-model="realtimeForm.alert.severity" placeholder="请选择风险级别">
                  <el-option
                    v-for="item in riskLevelList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="事件设备分类" prop="alert.eventDeviceType">
                <el-select
                  stretch
                  v-model="realtimeForm.alert.eventDeviceType"
                  placeholder="请选择事件设备分类">
                  <el-option
                    v-for="item in eventDeviceList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                label="站内通知"
                prop="alert.noticeUsers"
                :rules="{
                  required: realtimeForm.alert.noticeStation,
                  message: '不能为空',
                  trigger: 'change'
                }">
                <div class="item-checkbox">
                  <el-checkbox
                    @change="alertCheckChange('notice')"
                    size="small"
                    v-model="realtimeForm.alert.noticeStation"></el-checkbox>
                </div>
                <template v-if="realtimeForm.alert.noticeStation">
                  <idss-select-tree-filter
                    style="padding-left: 30px;"
                    size="small"
                    :disabled="isViewMode"
                    :data="noticeUsersList"
                    multiple
                    :selected.sync="realtimeForm.alert.noticeUsers"
                    :defaultProps="{
                      children: 'children',
                      label: 'name',
                      id: 'id'
                    }"></idss-select-tree-filter>
                </template>
              </el-form-item>
            </template>
          </idss-widget>
          <!-- 资源配置 -->
          <idss-collapse
            class="title"
            title="资源配置"
            :collapse.sync="collapse.resource"
            :is-button-show="false"
            is-arrow-show>
            <template>
              <el-row :gutter="20">
                <template v-for="(configK, index) in realtimeForm.resourceConfig">
                  <el-col :span="6" :key="index" class="number-col">
                    <el-tag type="info" effect="plain" style="width: 100%;">
                      <template v-if="!isViewMode">
                        <i
                          v-if="configK.dataType !== 'default'"
                          class="el-icon-circle-close"
                          @click="removeResConfig(configK.id)"></i>
                      </template>
                      <template v-if="typeof configK.value === 'number'">
                        <el-form-item
                          :label="configK.name"
                          :prop="'resourceConfig.' + index + '.value'"
                          :rules="{
                            required: true,
                            message: '不能为空',
                            trigger: 'blur'
                          }">
                          <el-input-number
                            style="width: 100%;"
                            v-model.trim="configK.value"
                            controls-position="right"
                            :min="configK.min"
                            :max="configK.max"></el-input-number>
                          <span class="number-unit">{{ configK.unit }}</span>
                          <idss-icon-svg
                            class="icon-help"
                            name="help"
                            v-idss-tooltip="{
                              placement: 'top-start',
                              content: configK.comment
                            }"></idss-icon-svg>
                        </el-form-item>
                      </template>
                      <template v-else>
                        <el-form-item
                          class="string-input"
                          :label="configK.name"
                          :prop="'resourceConfig.' + index + '.value'"
                          :rules="{
                            required: true,
                            message: '不能为空',
                            trigger: 'blur'
                          }">
                          <el-input style="width: 100%;" v-model.trim="configK.value"></el-input>
                          <span class="number-unit">{{ configK.unit }}</span>
                          <idss-icon-svg
                            class="icon-help"
                            name="help"
                            v-idss-tooltip="{
                              placement: 'top-start',
                              content: configK.comment
                            }"></idss-icon-svg>
                        </el-form-item>
                      </template>
                    </el-tag>
                  </el-col>
                </template>
              </el-row>
            </template>
            <el-button size="small" @click="addResConfig">新增资源配置项</el-button>
          </idss-collapse>
        </template>
      </el-form>
      <div v-if="isShowBtn" slot="footer" style="text-align: center;">
        <el-button size="small" @click="canel">取消</el-button>
        <el-button
          v-if="!isViewMode"
          v-loading="loading['save-policy']"
          size="small"
          type="primary"
          @click="onSubmit">保存</el-button>
      </div>
    </idss-widget>

    <!-- 关联关系和过滤器 弹框 -->
    <el-dialog
      class="filter-dlg"
      custom
      :title="filterDlg.title"
      :visible.sync="filterDlg.visible"
      width="60%"
      @close="filterDlgClose()">
      <div v-loading="loading['filter-expression']">
        <el-row v-if="filterDlg.type === 'realtime-filter'" :gutter="20">
          <el-col :span="12">
            <widget-group title="常用模板" hideShadow padding="20px 0 0" style="padding: 0;">
              <conditional-statement-group @addMould="addMould"></conditional-statement-group>
            </widget-group>
          </el-col>
          <el-col :span="12">
            <widget-group title="常用筛选器" hideShadow padding="20px 0 0" style="padding: 0;">
              <realtime-common-filter
                ref="realComRef"
                :filterObj.sync="filterDlg.filterData"
                :eventId="filterDlg.currentObj.temEventId"
                @addMouldFilter="addMouldFilter"></realtime-common-filter>
            </widget-group>
          </el-col>
        </el-row>
        <template v-else>
          <conditional-statement-group @addMould="addMould"></conditional-statement-group>
        </template>
        <div class="rel-filter-div">
          <template v-if="filterDlg.type === 'realtime-filter'">
            <span class="span-btn" @click="addCommonFilter()">添加到常用筛选器</span>
          </template>
          <el-scrollbar class="no-scrollbar-x" ref="scrollbarRef">
            <conditional-statement-tree
              style="display: inline-flex;background: #f9f9f9;min-width: 100%;padding: 20px 0;"
              :filterData="filterDlg.filterData"></conditional-statement-tree>
          </el-scrollbar>
        </div>
        <div style="text-align: center;">
          <el-button size="small" @click="filterDlg.visible = false">取 消</el-button>
          <el-button size="small" type="primary" @click="submitEventCorrelation">确 定</el-button>
        </div>
      </div>
    </el-dialog>
    <!-- 分组条件 弹框 -->
    <el-dialog custom :visible.sync="relevanceDlg.visible" width="60%" @close="relDlgClose()">
      <div slot="title" class="dialog-title clearfix">
        <span>分组条件</span>
        <button
          style="position: absolute;top: 5px;left: 91px;"
          class="idss-button-text"
          @click="addCorrelation">
          <i style="font-weight: bold;font-size: 20px;" class="el-icon-plus"></i>
        </button>
      </div>
      <template v-if="relevanceDlg.form.correlation.length">
        <el-form class="form-dlg" ref="relevanceRef" :model="relevanceDlg.form" size="small">
          <template v-for="(domain, index) in relevanceDlg.form.correlation">
            <el-row :gutter="20" :key="index">
              <el-col :span="11" style="position: relative;">
                <el-tag
                  size="small"
                  class="tag-overflow"
                  style="position: absolute;top: 5px;left: 16px;max-width: 90px;">
                  <el-tooltip :content="abList[0].label" placement="top-start">
                    <span>{{ abList[0].label }}</span>
                  </el-tooltip>
                </el-tag>
                <el-form-item
                  label-width="0"
                  style="padding: 0px 20px 0 100px;"
                  :prop="'correlation.' + index + '.attrField_a'"
                  :rules="{
                    required: true,
                    message: '不能为空',
                    trigger: 'change'
                  }">
                  <idss-select-tree-filter
                    placeholder="请选择字段"
                    @nodeClick="
                      (data, node, tree) =>
                        relNodeClick(data, node, tree, domain, 'a')
                    "
                    width="100%"
                    size="small"
                    :data="relevanceDlg.aFiledList"
                    :selected.sync="domain.attrField_a"
                    relatedFields="attrName"
                    :defaultProps="{
                      children: 'children',
                      label: 'attrField',
                      id: 'attrField'
                    }"></idss-select-tree-filter>
                </el-form-item>
              </el-col>
              <el-col :span="13" style="position: relative;">
                <el-tag size="small" style="position: absolute;top: 5px;left: -20px;" type="info">等于</el-tag>
                <el-tag
                  size="small"
                  class="tag-overflow"
                  style="position: absolute;top: 5px;left: 40px;max-width: 90px;">
                  <el-tooltip :content="abList[1].label" placement="top-start">
                    <span>{{ abList[1].label }}</span>
                  </el-tooltip>
                </el-tag>
                <el-form-item
                  label-width="0"
                  style="padding: 0px 40px 0 140px;"
                  :prop="'correlation.' + index + '.attrField_b'"
                  :rules="{
                    required: true,
                    message: '不能为空',
                    trigger: 'change'
                  }">
                  <idss-select-tree-filter
                    @nodeClick="
                      (data, node, tree) =>
                        relNodeClick(data, node, tree, domain, 'b')
                    "
                    width="100%"
                    placeholder="请选择字段"
                    size="small"
                    :data="relevanceDlg.bFiledList"
                    :selected.sync="domain.attrField_b"
                    relatedFields="attrName"
                    :defaultProps="{
                      children: 'children',
                      label: 'attrField',
                      id: 'attrField'
                    }"></idss-select-tree-filter>
                </el-form-item>
                <button
                  @click.prevent="removeCorrelation(domain)"
                  style="position: absolute;top: 0;right: 20px;"
                  class="idss-button-icon idss-svg_delete-hover">
                  <idss-icon-svg name="delete-hover"></idss-icon-svg>
                </button>
              </el-col>
            </el-row>
          </template>
        </el-form>
      </template>
      <template v-else>
        <div class="empty-div" @click="addCorrelation">
          <idss-icon-svg name="tianjia_huaban"></idss-icon-svg>暂无分组条件，点击新增
        </div>
      </template>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="relevanceDlg.visible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="submitFormRel()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 新增资源配置项 弹框 -->
    <el-dialog
      custom
      title="增加资源配置"
      :visible.sync="resConfigDlg.visible"
      width="400"
      @close="resDlgClose">
      <el-form ref="resConfigForm" :model="resConfigDlg.form" size="small" label-width="80px">
        <el-form-item
          label="名称"
          prop="id"
          :rules="{required: true, message: '不能为空', trigger: 'change'}">
          <el-select
            stretch
            v-model="resConfigDlg.form.id"
            placeholder="请选择要配置的名称"
            @change="handleResKey">
            <el-option
              v-for="(item, index) in resConfigDlg.list"
              :key="index"
              :label="item.name"
              :value="item.id"></el-option>
          </el-select>
          <p style="background:#EAEAEA;padding-left: 14px;">{{ resConfigDlg.form.comment }}</p>
        </el-form-item>
        <template v-if="resConfigDlg.form.value">
          <el-form-item
            label="值"
            prop="value"
            :rules="{required: true, message: '不能为空', trigger: 'blur'}">
            <el-input-number
              style="width: 95%;"
              v-model.trim="resConfigDlg.form.value"
              controls-position="right"
              :min="resConfigDlg.form.min"
              :max="resConfigDlg.form.max"></el-input-number>
            <span>{{ resConfigDlg.form.unit }}</span>
          </el-form-item>
        </template>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="resConfigDlg.visible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="submitFormRes()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { merge } from 'fusion-utils'
import widgetGroup from '@/views/manage/realtime/commons/widget-group.vue'
import realtimeCommonFilter from '@/views/manage/realtime/commons/realtime-common-filter.vue'
import conditionalStatementTree from '@/views/manage/commons/conditional-statement-tree.vue'
import conditionalStatementGroup from '@/views/manage/commons/conditional-statement-group.vue'
import assembleSelect from '@/views/manage/realtime/commons/assemble-select.vue'
import service from './manage-config-service'
import globalMixins from '@/mixins/globalMixins.js'
const TIME_UNIT = { // 时间单位
  s: '秒',
  m: '分钟',
  h: '小时',
  d: '天',
  w: '周'
}
const OUT_FUN_UNIT = { // 输出结果选择函数的类型
  date: {
    head: '第一个',
    last: '最后一个',
    max: '最大值',
    min: '最小值'
  },
  string: {
    head: '第一个',
    last: '最后一个'
  },
  default: {
    head: '第一个',
    last: '最后一个',
    max: '最大值',
    min: '最小值',
    avg: '平均值',
    sum: '总和'
  }
}
OUT_FUN_UNIT.ip = OUT_FUN_UNIT.data
export default {
  name: 'manage-realtime-manage-config',
  components: { widgetGroup, conditionalStatementTree, conditionalStatementGroup, realtimeCommonFilter, assembleSelect },
  mixins: [globalMixins, service],
  data () {
    return {
      // 标记是否是展示页面
      isViewMode: false,
      // idss-widget 组件的属性配置
      widgetProps: {
        shadow: 'nerver',
        globalStyle: {
          margin: 0
        }
      },
      // 资源配置的收缩框
      collapse: { // 收起控制
        resource: false
      },
      viewLoading: true,
      fourLableWidth: '90px',
      // @FIXME 这里是是否显示取消保存
      isShowBtn: true,
      // 分组条件弹框选项
      relevanceDlg: {
        visible: false,
        aFiledList: [],
        bFiledList: [],
        form: {
          correlation: []
        }
      },
      // 关联关系弹框设置
      filterDlg: {
        visible: false,
        currentObj: {},
        inx: 0,
        type: '',
        filterData: {
          logical: '&&',
          terms: [],
          children: []
        }
      },
      // 新增资源配置弹框
      resConfigDlg: {
        visible: false,
        list: [],
        form: {
          id: '',
          value: '',
          comment: '',
          min: 1,
          max: 100,
          unit: ''
        }
      },
      eventOpera: [{                   // 发生次数data
        name: '等于',
        value: '='
      }, {
        name: '大于等于',
        value: '>='
      }, {
        name: '两者之间',
        value: 'between'
      }],
      logicData: [{                   // l逻辑运算符
        name: '>',
        value: '>'
      }, {
        name: '<',
        value: '<'
      }, {
        name: '>=',
        value: '>='
      }, {
        name: '<=',
        value: '<='
      }, {
        name: '==',
        value: '=='
      }, {
        name: '!=',
        value: '!='
      }],
      timeUnit: TIME_UNIT,             // 时间单位
      outFunUnit: OUT_FUN_UNIT,        // 输出结果选择函数的类型
      // 输出结果A和B的下拉框
      abList: [],
      sceneRiskList: [],               // 风险类型
      eventListObj: {},                // 数据源对象
      eventFieldList: [],              // 事件字段字典
      noticeUsersList: [],             // 用户列表字典
      riskLevelList: [],               // 风险级别
      darmStageList: [],               // 杀伤链阶段
      windowTimeFieldsList: [],        // 时间属性
      eventDeviceList: [],             // 事件设备分类
      riskTypeTree: [],                // 策略分类tree
      resourceConfigList: [],          // 资源配置字段
      policyList: [],                  // 策略模板
      // eventsFieldObj: {},              // 数据源选中事件
      resourceConfigKV: [],            // 动态生成资源配置的k-v
      templateObj: {},                 // 选中的策略模板对象
      realtimeForm: {                  // Form属性
        name: '',
        desc: '',
        status: true,
        ruleType: '',
        ruleTemplate: '',
        events: [],
        window: {},
        groupBy: '',
        having: {},
        output: {
          innerEvent: false,
          eventName: '',
          selects: []
        },
        alert: {
          enabled: false,
          focusOn: false,
          riskType: '',
          severity: '',
          eventTechniqueType: '',
          eventDeviceType: '',
          alarm_disposal: '',
          mailNotice: false,
          mailAddress: '',
          shortMessageNotice: false,
          shortMessageUsers: '',
          noticeStation: false,
          noticeUsers: ''
        },
        resourceConfig: []
      },
      realtimeRules: {                  // Form Rules
        name: [
          { required: true, message: '请输入策略名称', trigger: 'blur' }
        ],
        ruleType: [
          { required: true, message: '请输入策略分类', trigger: 'change' }
        ],
        ruleTemplate: [
          { required: true, message: '请选择策略模板', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    ...mapState('realtime', ['filedDicts', 'realDictionary', 'mouldDictionary']),
    // 输出条件默认的处理过滤 abList中过滤
    // @FIXME 当前版本的逻辑 只有在输出属性前2个(数组中 index <= 1) 的第三列列表调用这里
    buildFiledDefault () {
      return function (id) {
        if (!id) {
          return []
        }
        let tem = this.abList.find(item => item.value === id) || {}
        let temEvent = this.getAttributesByType(tem.type)
        return temEvent.filter(item => item.attrType === 'date')
      }
    },
    // 输出条不是件默认或者其他的处理过滤
    // 有3处地方调用这个函数。
    // 1. 所有的having模板 触发条件中的分组条件下拉框 传递的参数 (id)
    // 2. having模板中 去重、求和、平均值 在触发条件中的计算字段或者去重字段下拉列表也会调用 传递的参数 (id, false, true)
    // 3. 在输出结果中的第三列下拉列表中调用 传递的参数 (id, true)
    buildFiled () {
      return function (id, isAB, isFilter) {
        if (!id) {
          return []
        }
        let temEvent
        if (isAB) {
          // 获得被选择数据源的对象属性
          let tem = this.abList.find(item => item.value === id) || {}
          // 会判断 temEvnet 使用 logAttributes 还是 eventAttributes
          temEvent = this.getAttributesByType(tem.type)
        } else {
          // having 模板 在 触发条件 中的 分组条件调用会走到这里, 这里的id 其实是type
          // (UI在分组条件下面) 去重、求和、平均值 也会走到这里，但求和与平均值 会过滤 number 类型的字段
          temEvent = this.getAttributesByType(id)
        }

        // 当前版本的数据没有 children 这一层了，直接过滤 item.attrType === 'number'
        // 在 having 模板 求和与平均值里面 会 过滤 attrType === 'number'
        // 输出结果中的第三列 直接返回整个list
        return isFilter ? temEvent.filter(item => item.attrType === 'number') : temEvent
      }
    },
    // 生成分组条件表达式
    buildRelExpression () {
      if (this.realtimeForm.correlation.length === 0) {
        return ''
      } else {
        return this.realtimeForm.correlation.map(item => {
          return `(${item.as_a}.${item.attrName_a}  等于  ${item.as_b}.${item.attrName_b})`
        }).join('且')
      }
    }
  },
  methods: {
    /**
     * 根据类型加载字段
     */
    getAttributesByType (type) {
      if (type === 'inner') {
        return (this.eventListObj.eventAttributes || [])
      } else {
        return (this.eventListObj.logAttributes || [])
      }
    },
    // 模板选中事件
    templateChange (obj) {
      let tem = this.policyList.find(item => item.id === obj)
      // 因为不同模板的配置流程是不一样的，所以这里需要每次切换的时候去初始化
      // 补全数据源字段(确定一个数据源还是两个)
      this.supplyEvents(tem)
      this.supplyWindow(tem)
      this.supplyGroupBy(tem)
      this.templateObj = tem
    },
    // 数据源选中事件
    eventChange (inx) {
      const temEventId = this.realtimeForm.events[inx].temEventId
      if (temEventId === '') return
      let obj = this.eventListObj.eventList.find(item => {
        // temEventId 的值大概是这样的 '22,33,44' 所以这里取22转成数字
        return item.id === parseInt(temEventId.split(',')[0])
      })
      this.$set(this.realtimeForm.events[inx], 'radioType', obj.type)
      this.$set(this.realtimeForm.events[inx], 'str', '')
      this.$set(this.realtimeForm.events[inx], 'conditions', '')
      // 清空分组条件
      this.realtimeForm.relationCondition && this.$set(this.realtimeForm, 'correlation', [])
      // 清空关联关系
      this.realtimeForm.relationCondition && this.$set(this.realtimeForm.relationCondition, 'condition', '')
      this.realtimeForm.relationCondition && this.$set(this.realtimeForm.relationCondition, 'str', '')
      this.supplyGroupBy(this.templateObj)
      this.supplyOutput()
    },
    // 数据源列表字段处理 只有模板发生变化的时候 才去初始化
    supplyEvents (tem) {
      // 这里的 A 表示第一个数据源类型，有第二个的话是 B
      const eventList = ['A']
      const eventTemplate = {
        radioType: 'single',
        str: '',
        conditions: ''
      }

      // type === 'pattern' 是关联类型的模板(会有两个数据源进行关联) 普通模板都是一个数据源
      if (tem.type === 'pattern') {
        // 关联模板的第二个数据源
        eventList.push('B')
        // 如果是关联模板 是在数据源里面配置 分组条件 与 关联关系
        this.$set(this.realtimeForm, 'correlation', [])
        this.$set(this.realtimeForm, 'relationCondition', { condition: '', str: '' })
        // 关联模板的运算符(关联模板的时候 数据源后面可以选择操作符) 默认 >= 1
        eventTemplate.quantifier = {
          type: '>=',
          valueOne: '1'
        }
      } else {
        // 非关联模板不在数据源那个位置配置 分组条件 与 关联关系
        this.$delete(this.realtimeForm, 'correlation')
        this.$delete(this.realtimeForm, 'relationCondition')
      }

      // 数据源列表
      this.realtimeForm.events = eventList.map(item => {
        // 合成数据源字段属性
        return merge({}, eventTemplate, {
          as: item,
          temEventId: `${this.eventListObj.default}`
        })
      })

      this.supplyOutput()
    },
    // 初始化时间窗口的配置
    supplyWindow (tem) {
      // 普通模板没有 时间窗口。只有having 和关联类型的模板
      if (tem.hasWindow) {
        // 设置默认值
        this.realtimeForm.window = {
          attrField: this.windowTimeFieldsList[0].alias || '',
          unit: 's',
          value: 1
        }
        if (tem.hasHaving) {
          // having 模板可以选择滑动步长与滚动窗口
          this.$set(this.realtimeForm.window, 'slide', 1)
          this.$set(this.realtimeForm.window, 'tumblingWindow', false)
        } else {
          // 因为只有 having 与 关联模板的 tem.hasWindow 才是true
          // 所以这里else是指关联模板
          // 滚动窗口
          this.$delete(this.realtimeForm.window, 'slide')
          // 滑动步长
          this.$delete(this.realtimeForm.window, 'tumblingWindow')
        }
      } else {
        // 普通模板
        this.realtimeForm.window = {}
      }
    },
    // 初始化 触发条件
    supplyGroupBy (tem) {
      this.realtimeForm.groupBy = ''
      // 只有having类型模板才能单独设置触发器
      if (tem.hasHaving) {
        this.$set(this.realtimeForm.having, 'fn', tem.having)
        this.$set(this.realtimeForm.having, 'compareType', '')
        this.$set(this.realtimeForm.having, 'value', 1)
        if (tem.having === 'count(*)') {
          delete this.realtimeForm.having.attrField
        } else {
          this.$set(this.realtimeForm.having, 'attrField', '')
        }
      } else {
        // 普通模板和关联类型模板
        this.realtimeForm.having = {}
      }
    },
    // 设置输出结果中的 输出属性(默认几个输出属性、每一个输出属性对应的默认值)
    async supplyOutput () {
      // 输出结果中 第二列的数据源会用到这个属性
      // 当选择关联模板后 可以选择两个数据源
      // 这个abList 就是数据源选择的值，所以当非关联模板时他的 length = 1，关联模板时 length = 2
      this.abList = []

      const ABItem = {
        single: '分类日志',
        inner: '内部事件',
        global: '全局日志'
      }

      this.realtimeForm.events.forEach(source => {
        // 因为数据源里面 只能选同一类型的字段，所以找到一个就能确定是什么类型了
        // const tId = source.temEventId.split(',')[0]
        const radioType = source.radioType

        this.abList.push({
          value: source.as,
          label: `${source.as}.${ABItem[radioType]}`,
          type: radioType
        })
      })
      // 默认是的输出属性(13个) 前两个是我们写死的属性(前两个输出属性有些下拉框是禁用的))
      const defaultOutputSelectFields = [{
        eventField: 'alarm_first_time',
        // as: 'A'
        attrField: 'create_time',
        attrType: 'date',
        fn: 'min'
      }, {
        eventField: 'alarm_last_time',
        // as: this.realtimeForm.events.length > 1 ? 'B' : 'A',
        attrField: 'create_time',
        attrType: 'date',
        fn: 'max'
      }, {
        eventField: 'src_ip',
        attrField: 'src_ip'
      }, {
        eventField: 'src_country',
        attrField: 'src_country'
      }, {
        eventField: 'src_province',
        attrField: 'src_province'
      }, {
        eventField: 'src_city',
        attrField: 'src_city'
      }, {
        eventField: 'dst_ip',
        attrField: 'dst_ip'
      }, {
        eventField: 'dst_country',
        attrField: 'dst_country'
      }, {
        eventField: 'dst_province',
        attrField: 'dst_province'
      }, {
        eventField: 'dst_city',
        attrField: 'dst_city'
      }, {
        eventField: 'protocol',
        attrField: 'protocol'
      }, {
        eventField: 'url',
        attrField: 'url'
      }, {
        eventField: 'domain',
        attrField: 'domain'
      }]
      // realtimeForm.output.selects 是输出结果里面的 输出属性的个数
      // eventField 第一列里面的字段
      // as 第二列里面的字段值，也就是上面 abList 的 value
      // attrField 第三列字段值
      // fn 第四列字段的值
      this.realtimeForm.output.selects = defaultOutputSelectFields.map(item => {
        return {
          as: 'A',  // 默认都是第一个数据源， B 是第二个数据源
          attrType: 'string',
          fn: 'head', // 第四列的 默认为 第一个
          addList: false,
          listIds: '',
          ...item
        }
      })

      await this.$nextTick()
      this.$refs['realtimeForm'].clearValidate()
    },
    // @FIXME 转换的是啥样的数据？ 转化数据类型tree的形式渲z染{id-label-children}
    transformData (data) {
      if (!data.length) {
        return []
      }
      data.map(item => {
        item.name = item.attrField
        if (item.attrField) {
          item.id = item.attrField
        }
        if (item.attrType) {
          item.dataType = item.attrType
        }
        if (item.children) {
          this.transformData(item.children)
        }
        return item
      })
      return data
    },
    // 数据源的过滤条件与关联关系都走这里面的逻辑
    // @FIXME 这里业务逻辑比较深，需要好好看
    editEventFilter (type, obj, inx) {
      if (this.filterDlg.visible) {
        return
      }
      this.filterDlg.visible = true
      this.filterDlg.type = type
      // @FIXME 放到 vuex 里面的意义是什么?
      this.$store.commit('realtime/moulds', this.mouldDictionary[type])
      // 下面这两个函数 大概是处理过滤弹窗里面的数据的。
      if (type === 'realtime-filter') {
        this.dealFilterDefault(obj, inx)
      } else {
        this.dealNexusDefault()
      }
    },
    // 处理过滤条件的业务
    dealFilterDefault (obj, inx) {
      this.filterDlg.title = '过滤条件'
      let temEvent = this.getAttributesByType(obj.radioType)
      let data = this.transformData(JSON.parse(JSON.stringify(temEvent)))
      this.$store.commit('realtime/filed-dicts', data)
      this.filterDlg.inx = inx
      this.filterDlg.currentObj = obj
      if (this.realtimeForm.events[this.filterDlg.inx].conditions !== '') {
        this.filterDlg.filterData = JSON.parse(this.realtimeForm.events[this.filterDlg.inx].conditions)
      }
    },
    // 处理关联关系的业务
    dealNexusDefault () {
      this.filterDlg.title = '关联关系'
      let data = {}
      let temEvent = this.getAttributesByType(this.realtimeForm.events[0].radioType)
      let tem = this.transformData(JSON.parse(JSON.stringify(temEvent)))
      data['A'] = tem
      temEvent = this.getAttributesByType(this.realtimeForm.events[1].radioType)
      tem = this.transformData(JSON.parse(JSON.stringify(temEvent)))
      data['B'] = tem
      this.$store.commit('realtime/filed-dicts', data)
      if (this.realtimeForm.relationCondition.condition !== '') {
        this.filterDlg.filterData = JSON.parse(this.realtimeForm.relationCondition.condition)
      }
    },
    // 过滤条件弹出框关闭
    filterDlgClose () {
      this.filterDlg.filterData = {
        logical: '&&',
        terms: [],
        children: []
      }
      this.filterDlg.inx = 0
      this.filterDlg.type = ''
      this.filterDlg.title = ''
      this.filterDlg.currentObj = {}
    },
    // 过滤条件弹框中 添加 常用筛选器 点击事件
    addCommonFilter () {
      if (this.filterDlg.filterData.terms.length || this.filterDlg.filterData.children.length) {
        this.$refs['realComRef'].saveConfrim()
      }
    },
    // 过滤条件弹出框保存
    submitEventCorrelation () {
      if (this.filterDlg.filterData.terms.length || this.filterDlg.filterData.children.length) {
        let param = {
          conditions: JSON.stringify(this.filterDlg.filterData)
        }
        if (this.filterDlg.type === 'realtime-filter') {
          param.type = this.realtimeForm.events[this.filterDlg.inx].radioType
        } else {
          param.type = this.realtimeForm.events.map(item => { return item.radioType }).join(',')
        }
        this.buildFilterExpression(param).then((res) => {
          if (this.filterDlg.type === 'realtime-filter') {
            this.realtimeForm.events[this.filterDlg.inx].str = res.expression
            this.realtimeForm.events[this.filterDlg.inx].conditions = JSON.stringify(this.filterDlg.filterData)
          } else {
            this.realtimeForm.relationCondition.str = res.expression
            this.realtimeForm.relationCondition.condition = JSON.stringify(this.filterDlg.filterData)
          }
          this.filterDlg.visible = false
          this.$refs['realtimeForm'].validateField(`events.${this.filterDlg.inx}.str`)
        }, (err) => {
          this.showMessage(Array.isArray(err.message) && err.message.length ? err.message[0].message : err.message, 'error')
        })
      } else {
        if (this.filterDlg.type === 'realtime-filter') {
          this.realtimeForm.events[this.filterDlg.inx].str = ''
          this.realtimeForm.events[this.filterDlg.inx].conditions = ''
        } else {
          this.realtimeForm.relationCondition.str = ''
          this.realtimeForm.relationCondition.condition = ''
        }
        this.filterDlg.visible = false
        this.$refs['realtimeForm'].validateField(`events.${this.filterDlg.inx}.str`)
      }
    },
    // 数据源加分组条件
    async editEventRelevance () {
      this.relevanceDlg.aFiledList = this.getAttributesByType(this.realtimeForm.events[0].radioType)
      this.relevanceDlg.bFiledList = this.getAttributesByType(this.realtimeForm.events[1].radioType)
      this.relevanceDlg.form.correlation = JSON.parse(JSON.stringify(this.realtimeForm.correlation))
      await this.$nextTick()
      this.relevanceDlg.visible = true
    },
    // 数据源加分组条件--条件--add
    addCorrelation () {
      this.relevanceDlg.form.correlation.push({
        as_a: 'A',
        attrField_a: '',
        attrName_a: '',
        attrType_a: '',
        as_b: 'B',
        attrField_b: '',
        attrName_b: '',
        attrType_b: ''
      })
    },
    // 数据源加分组条件--条件--删除
    removeCorrelation (item) {
      var index = this.relevanceDlg.form.correlation.indexOf(item)
      if (index !== -1) {
        this.relevanceDlg.form.correlation.splice(index, 1)
      }
    },
    // 数据源加分组条件--补全字段
    relNodeClick (data, node, tree, item, type) {
      if (type === 'a') {
        this.$set(item, 'attrName_a', data.attrName)
        this.$set(item, 'attrType_a', data.attrType)
      } else {
        this.$set(item, 'attrName_b', data.attrName)
        this.$set(item, 'attrType_b', data.attrType)
      }
    },
    // 保存数据源分组条件
    submitFormRel () {
      if (!this.relevanceDlg.form.correlation.length) {
        this.relevanceDlg.visible = false
        this.realtimeForm.correlation = []
        return
      }
      this.$refs['relevanceRef'].validate((valid) => {
        if (valid) {
          this.relevanceDlg.visible = false
          this.realtimeForm.correlation = JSON.parse(JSON.stringify(this.relevanceDlg.form.correlation))
        } else {
          return false
        }
      })
    },
    // 关闭和取消数据源分组条件
    relDlgClose () {
      this.relevanceDlg.aFiledList = []
      this.relevanceDlg.bFiledList = []
      this.relevanceDlg.form = {
        correlation: []
      }
    },
    /**
     * 增加资源配置弹出框关闭
     */
    resDlgClose () {
      this.resConfigDlg.list = []
      this.resConfigDlg.form = {
        id: '',
        comment: '',
        value: '',
        min: 1,
        max: 100,
        unit: ''
      }
      this.$nextTick(() => {
        this.$refs['resConfigForm'].clearValidate()
      })
    },
    /**
     * 增加资源配置
     */
    addResConfig () {
      this.resConfigDlg.list = []
      this.resourceConfigList.map(item => {
        let inx = this.realtimeForm.resourceConfig.findIndex(o => o.id === item.id)
        if (inx === -1) {
          this.resConfigDlg.list.push(item)
        }
      })
      if (this.resConfigDlg.list.length === 0) {
        this.showMessage('没有可配置的资源', 'warning')
        return
      }
      this.resConfigDlg.visible = true
    },
    /**
     * 移除资源配置
     */
    removeResConfig (id) {
      var index = this.realtimeForm.resourceConfig.findIndex(o => o.id === id)
      if (index !== -1) {
        this.realtimeForm.resourceConfig.splice(index, 1)
      }
    },
    /**
     * 设置资源配置值
     */
    handleResKey (o) {
      let tem = this.resConfigDlg.list.filter(item => o === item.id)[0]
      this.$set(this.resConfigDlg.form, 'value', tem.value)
      this.$set(this.resConfigDlg.form, 'max', tem.max)
      this.$set(this.resConfigDlg.form, 'min', tem.min)
      this.$set(this.resConfigDlg.form, 'unit', tem.unit)
      this.$set(this.resConfigDlg.form, 'comment', tem.comment)
    },
    /**
     * 添加到资源配置的对象
     */
    submitFormRes () {
      this.$refs['resConfigForm'].validate((valid) => {
        if (valid) {
          let tem = this.resourceConfigList.filter(item => item.id === this.resConfigDlg.form.id)[0]
          this.realtimeForm.resourceConfig.push(tem)
          this.resConfigDlg.visible = false
        } else {
          return false
        }
      })
    },
    // 数据源 中发生次数选择事件(关联模板类型才会有)
    operaChange (val, item, inx) {
      this.$set(this.realtimeForm.events[inx].quantifier, 'valueOne', 1)
      if (val === 'between') {
        this.$set(this.realtimeForm.events[inx].quantifier, 'valueTwo', 1)
      } else {
        delete this.realtimeForm.events[inx].quantifier.valueTwo
      }
    },
    // 数据源增加过滤条件
    addFilter () {
      this.event.filters.push({
        name: '',
        term: '',
        key: Date.now()
      })
    },
    // 数据源删除过滤条件
    removeFilter (item) {
      var index = this.event.filters.indexOf(item)
      if (index !== -1) {
        this.event.filters.splice(index, 1)
      }
    },
    // output-的字段发生改变，后面的函数重置为第一个
    outNodeClick (data, node, tree, item) {
      this.$set(item, 'fn', 'head')
      this.$set(item, 'attrName', data.attrName)
      this.$set(item, 'attrType', data.attrType)
    },
    // 添加输出属性
    addOutcome () {
      this.realtimeForm.output.selects.push({
        eventField: '',
        as: this.abList.length ? this.abList[0].value : '',
        attrField: '',
        attrName: '',
        attrType: '',
        fn: 'head',
        addList: false,
        listIds: '',
        key: Date.now()
      })
    },
    // 删除输出属性
    removeOutcome (index) {
      this.realtimeForm.output.selects.splice(index, 1)
    },
    // 输出属性 数据源的ab 发生改变清空字段(输出属性 第三列的字段)
    // 前两个变化时不清除
    outputABChange (item, index) {
      // 前两个是我们写死的属性，所以不能清除
      if (index <= 1) {
        return
      }
      this.$set(item, 'attrField', '')
    },
    // 取消
    canel () {
      this.$router.replaceTagPush({
        name: 'manage-realtime-manage'
      }, this.$route)
    },
    // 保存
    onSubmit () {
      if (!this.realtimeForm.output.innerEvent && !this.realtimeForm.alert.enabled) {
        this.showMessage('请启用告警或者内部事件', 'warning')
        return false
      }
      this.$refs['realtimeForm'].validate((valid) => {
        if (valid) {
          this.realtimeSave()
        } else {
          return false
        }
      })
    },
    // 获取加入的位置
    getMouldLoca (data) {
      if (data.children.length) {
        return this.getMouldLoca(data.children[data.children.length - 1])
      } else {
        return data
      }
    },
    // 手动增加过滤条件到规则中
    addMould (obj) {
      let tem = this.getMouldLoca(this.filterDlg.filterData)
      tem.terms.push(obj)
      this.$nextTick(_ => {
        this.$refs['scrollbarRef'].update()
      })
    },
    // 手动增加常用筛选器到规则中
    addMouldFilter (obj) {
      let opt = JSON.parse(obj)
      let tem = this.getMouldLoca(this.filterDlg.filterData)
      tem.children.push(opt)
    },
    // 告警配置--邮件通知--站内通知 改变事件
    async alertCheckChange (type) {
      type === 'mail' && (this.$set(this.realtimeForm.alert, 'mailAddress', ''))
      type === 'notice' && (this.$set(this.realtimeForm.alert, 'noticeUsers', ''))
      type === 'short' && (this.$set(this.realtimeForm.alert, 'shortMessageUsers', ''))
      await this.$nextTick()
      this.$refs['realtimeForm'].clearValidate()
    },
    // 补全告警配置字段
    async enabledChange () {
      if (this.realtimeForm.alert.enabled) {
        this.$set(this.realtimeForm.alert, 'focusOn', false)
        this.$set(this.realtimeForm.alert, 'riskType', '')
        this.$set(this.realtimeForm.alert, 'severity', '')
        this.$set(this.realtimeForm.alert, 'eventTechniqueType', '')
        this.$set(this.realtimeForm.alert, 'eventDeviceType', '')
        this.$set(this.realtimeForm.alert, 'alarm_disposal', '')
        this.$set(this.realtimeForm.alert, 'mailNotice', false)
        this.$set(this.realtimeForm.alert, 'mailAddress', '')
        this.$set(this.realtimeForm.alert, 'noticeStation', false)
        this.$set(this.realtimeForm.alert, 'noticeUsers', '')
        this.$set(this.realtimeForm.alert, 'shortMessageNotice', false)
        this.$set(this.realtimeForm.alert, 'shortMessageUsers', '')
        await this.$nextTick()
        this.$refs['realtimeForm'].clearValidate()
      }
    },
    // 加载默认资源
    supplyResourceConfig (res = []) {
      // 第一种新增的方式，加载默认是资源
      let defaultRes = this.resourceConfigList.filter(item => item.dataType === 'default')
      // 第二种非新增的方式，加载默认是资源，并把数据值更新到默认资源中，如何是非默认资源则追加进去
      res.map(item => {
        let inx = defaultRes.findIndex(o => o.id === item.id)
        if (inx !== -1) {
          defaultRes[inx].value = item.value
        } else {
          let newRes = this.resourceConfigList.filter(o => o.id === item.id)
          if (newRes.length !== 0) {
            newRes[0].value = item.value
            defaultRes.push(newRes[0])
          }
        }
      })
      this.realtimeForm.resourceConfig = defaultRes
    }
  },
  async created () {
    const id = this.$route.params.id
    // 加载字典
    await this.initRealTimeDict()
    // 加载策略模板
    await this.getPolicys()
    let api = [
      this.getEvents()
    ]
    if (id) {
      api.push(this.realtimeQuery(id))
    }
    // 加载数据源
    try {
      // datastream 请求回来的数据源，realtime 在非新增模式下的实时策略数据
      Promise.all(api).then(([datastream, realtime]) => {
        if (id) {
          // 移除本身的数据源
          let tem = datastream.eventList.filter(item => item.strategyId !== parseInt(id))
          this.eventListObj = {
            default: datastream.default,
            // 数据源(在基础属性下面的那个数据源) 这里面包括 全局日志、内部事件、分类日志
            // 他们的数据格式在 datastream.eventList 中是平级的，根据 type 来区分这三个类别
            eventList: tem,
            // 下面这两个字段 应该是输出结果中的 第三列的字段列表
            // 根据eventList[{type}]来区分使用哪个 inner的话使用 eventAttributes
            logAttributes: datastream.logAttributes,
            eventAttributes: datastream.eventAttributes
          }

          // 编辑查看 显示 取消按钮 @FIXME
          this.isShowBtn = true
          let jsonData = JSON.parse(JSON.stringify(realtime))
          delete jsonData.resourceConfig
          this.realtimeForm = Object.assign({}, this.realtimeForm, realtime)
          this.supplyResourceConfig(realtime.resourceConfig)
          this.editBuildData()
          this.viewLoading = false
        } else {
          this.viewLoading = false
          this.eventListObj = datastream
          this.supplyResourceConfig()
        }
      })
    } catch (error) {
      if (id) {
        this.showMessage(error.message, 'error')
        this.isShowBtn = false
      }
    }
    // 加载名单
    // this.$store.dispatch('realtime/tags')
    this.$store.dispatch('realtime/mould-dictionary')
    this.$store.dispatch('realtime/real-dictionary')
    await this.$nextTick()
  }
}
</script>

<style scoped lang="postcss">
%normal-width {
  width: 150px;
  display: inline-block;
}
.manage-realtime-manage-config {
  .event-row {
    .codeindex {
      position: absolute;
      right: 0;
      top: 0;
    }
    &__right {
      position: relative;
      .right-item {
        padding-right: 425px;
        .tag-btn {
          padding: 5px;
        }
      }
    }
    &__left {
      display: inline-block;
      position: absolute;
      top: 0;
      &.min {
        right: 26px;
      }
      &.max {
        right: 130px;
      }
      .left-opera {
        width: 210px;
        display: inline-block;
      }
      .left-value {
        width: 100px;
        display: inline-block;
      }
    }
  }
  .number-width {
    @extend %normal-width;
  }
  .item-value-unit {
    display: inline-block;
    width: 200px;
    margin-left: 20px;
  }
  .tag-overflow {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    display: inline-block;
    vertical-align: middle;
    font-weight: bold;
    max-width: 85%;
  }
  .triggerspan {
    position: absolute;
    top: 5px;
    left: 10px;
  }
  .outcomediv {
    position: absolute;
    top: 0;
    left: 10px;
  }
  >>> .el-input-number .el-input__inner {
    text-align: left;
  }
  .item-checkbox {
    position: absolute;
    top: 0;
    left: 0;
  }

  >>> .form-dlg {
    max-height: 300px;
    overflow-y: auto;
    overflow-x: hidden;
  }
  >>> .empty-div {
    text-align: center;
    cursor: pointer;
    .idss-svg-icon {
      margin-right: 6px;
    }
    &:hover {
      color: #22a5f7;
      .idss-svg-icon {
        fill: #22a5f7;
      }
    }
  }
  .rel-filter-div {
    position: relative;
    margin: 20px 0;
    .span-btn {
      position: absolute;
      right: 64px;
      top: 24px;
      color: #22a5f7;
      cursor: pointer;
      z-index: 1;
    }
  }
  .number-col {
    position: relative;
    margin: 10px 0;
    >>> .el-form-item__label {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    >>> .el-form-item__content {
      margin-right: 20px;
      margin-left: 120px !important;
    }
    >>> .string-input .el-form-item__content {
      margin-right: 0;
    }
    .number-unit {
      position: absolute;
      right: -17px;
      top: 0;
    }
    .icon-help {
      position: absolute;
      left: -20px;
      top: 8px;
      width: 16px;
      height: 16px;
      fill: #909399;
    }
    .el-tag--info {
      height: auto;
      .el-form-item {
        margin: 18px 0;
      }
      &:hover {
        border-color: #5cb6ff;
        .el-icon-circle-close {
          color: #5cb6ff;
        }
      }
    }
    .el-icon-circle-close {
      position: absolute;
      top: -8px;
      right: 6px;
      font-size: 18px;
      color: #606266;
      cursor: pointer;
      background-color: #ffffff;
      border-radius: 50%;
    }
  }
  /* 覆盖默认idss-collapse样式*/
  & >>> .idss-collapse.title {
    padding: 20px !important;
    header {
      line-height: 1.1;
      border-bottom: 1px solid #e3e7ec;
      padding: 15px 0;
    }
    /* .collapse-title {
      font-size: 16px !important;
      font-weight: inherit !important;
      color: #353940 !important;
      padding-left: 12px !important;
      border-left: 5px solid #22a5f7 !important;
    } */
  }
}
.filter-dlg[custom] >>> .el-dialog {
  min-width: 760px;
}
</style>
