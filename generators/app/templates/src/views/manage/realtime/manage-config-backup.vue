<template>
  <div
    class="manage-realtime-manage-config"
    v-loading="viewLoading || loading['realtime-save']">
    <widget-group footerPadding="20px">
      <el-form
        :disabled="$route.name === 'manage-realtime-manage-config-look'"
        ref="realtimeForm"
        :model="realtimeForm"
        label-width="110px"
        size="small"
        :rules="realtimeRules">
        <widget-group title="基础属性" hideShadow padding="20px 0 0">
          <el-form-item label="策略名称" prop="name">
            <el-input
              v-model.trim="realtimeForm.name"
              placeholder="请输入策略名称"
              maxlength="100"></el-input>
          </el-form-item>
          <el-form-item label="策略描述" prop="desc">
            <el-input
              type="textarea"
              v-model.trim="realtimeForm.desc"
              placeholder="请输入策略描述"></el-input>
          </el-form-item>
          <el-form-item label="是否启用" prop="status">
            <el-radio-group v-model="realtimeForm.status">
              <el-radio :label="true">是</el-radio>
              <el-radio :label="false">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="策略分类" prop="ruleType">
            <idss-select-tree-filter
              :disabled="$route.name === 'manage-realtime-manage-config-look'"
              placeholder="请选择策略分类"
              size="small"
              :data="riskTypeTree"
              :selected.sync="realtimeForm.ruleType"
              :defaultProps="{
                children: 'children',
                label: 'name',
                id: 'id'
              }">
            </idss-select-tree-filter>
          </el-form-item>
          <el-form-item label="策略模板" prop="ruleTemplate">
            <el-select
              @change="templateChange"
              stretch
              v-model="realtimeForm.ruleTemplate"
              placeholder="请选择策略模板">
              <template v-for="item in policyList">
                <el-option
                  :key="item.id"
                  :value="item.id"
                  :label="item.name"></el-option>
              </template>
            </el-select>
            <p
              v-if="JSON.stringify(templateObj) !== '{}'"
              style="background:#EAEAEA;padding-left: 14px;">
              <strong>规则模板描述: </strong>{{ templateObj.desc }}
            </p>
          </el-form-item>
        </widget-group>
        <template v-if="JSON.stringify(templateObj) !== '{}'">
          <widget-group title="数据源" hideShadow padding="20px 0 0">
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
                      :disabled="
                        $route.name === 'manage-realtime-manage-config-look'
                      "
                      @change="eventChange(index)"
                      placeholder="请选择数据名称"
                      style="width: 100%;padding-right: 20px;"
                      :data="eventListObj.eventList"
                      :selected.sync="event.temEventId"></assemble-select>
                    <!-- <el-select style="width: 100%;padding-right: 20px;" placeholder="请选择数据名称"
                      @change="eventChange(index)"
                      :popper-append-to-body="false"
                      stretch
                      :multiple="event.radioType === 'single'"
                      v-model="event.temEventId">
                      <el-radio-group @change="eventTypeChange(index)" style="min-width: 350px;text-align: center;" v-model="event.radioType" class="idss-margin--b-m idss-search__select--btn">
                        <el-radio label="global">全局事件</el-radio>
                        <el-radio label="inner">内部事件</el-radio>
                        <el-radio label="single">分类事件</el-radio>
                      </el-radio-group>
                      <template v-if="JSON.stringify(eventListObj) !== '{}'">
                        <template v-for="item in eventListObj.eventList">
                          <el-option v-if="item.type === event.radioType"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                          </el-option>
                        </template>
                      </template>
                    </el-select> -->
                    <span class="codeindex">{{ fromCharCode(index) }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="18" class="event-row__right">
                  <template v-if="templateObj.type === 'pattern'">
                    <div
                      class="event-row__left"
                      :class="
                        event.quantifier.type === 'between' ? 'min' : 'max'
                      ">
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
                            @change="val => operaChange(val, event)"
                            v-model="event.quantifier.type"
                            placeholder="请选择">
                            <template v-for="op in eventOpera">
                              <el-option
                                :label="op.name"
                                :value="op.value"
                                :key="op.name"></el-option>
                            </template>
                          </el-select>
                        </el-form-item>
                      </div>
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
                        <div
                          class="left-value"
                          v-if="event.quantifier.type === 'between'">
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
                      <el-tooltip
                        v-if="event.str"
                        :content="event.str"
                        placement="top-start">
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
            <el-form-item
              label="分组条件"
              v-if="templateObj.type === 'pattern'"
              prop="correlation">
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
              <el-button
                @click="editEventFilter('realtime-relation')"
                type="text">编辑</el-button>
            </el-form-item>
          </widget-group>
          <widget-group
            v-if="templateObj.hasWindow"
            title="时间窗口"
            hideShadow
            padding="20px 0 0">
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
            <div
              style="display: inline-block;width: 80px;"
              class="number-width">
              <el-form-item
                label-width="0"
                prop="window.unit"
                :rules="{
                  required: true,
                  message: '请选择时间单位',
                  trigger: 'change'
                }">
                <el-select
                  :disabled="true"
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
            <template v-if="templateObj.hasHaving">
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
                <div
                  style="display: inline-block;width: 80px;"
                  class="number-width">
                  <el-form-item
                    label-width="0"
                    prop="window.unit"
                    :rules="{
                      required: true,
                      message: '请选择时间单位',
                      trigger: 'change'
                    }">
                    <el-select
                      :disabled="true"
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
          </widget-group>
          <!-- 触发条件 -->
          <widget-group
            v-if="templateObj.hasHaving"
            title="触发条件"
            hideShadow
            padding="20px 0 0">
            <!-- <el-form-item label="分组条件" prop="groupBy" :rules="{required: true, message: '请选择分组条件', trigger: 'change'}"> -->
            <el-form-item label="分组条件" prop="groupBy">
              <idss-select-tree-filter
                placeholder="请选择分组条件"
                :disabled="$route.name === 'manage-realtime-manage-config-look'"
                :multiple="true"
                size="small"
                :data="buildFiled(realtimeForm.events[0].radioType)"
                :selected.sync="realtimeForm.groupBy"
                :defaultProps="{
                  children: 'children',
                  label: 'attrName',
                  id: 'attrField'
                }">
              </idss-select-tree-filter>
            </el-form-item>
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
                      :disabled="
                        $route.name === 'manage-realtime-manage-config-look'
                      "
                      placeholder="请选择DISTINCT字段"
                      size="small"
                      :data="buildFiled(realtimeForm.events[0].radioType)"
                      :selected.sync="realtimeForm.having.attrField"
                      :defaultProps="{
                        children: 'children',
                        label: 'attrName',
                        id: 'attrField'
                      }">
                    </idss-select-tree-filter>
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
                        <el-option
                          :key="logic.name"
                          :label="logic.name"
                          :value="logic.value"></el-option>
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
                        <el-option
                          :key="logic.name"
                          :label="logic.name"
                          :value="logic.value"></el-option>
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
                      :disabled="
                        $route.name === 'manage-realtime-manage-config-look'
                      "
                      placeholder="请选择计算字段"
                      size="small"
                      :data="buildFiled(realtimeForm.events[0].radioType, false, true)"
                      :selected.sync="realtimeForm.having.attrField"
                      :defaultProps="{
                        children: 'children',
                        label: 'attrName',
                        id: 'attrField'
                      }">
                    </idss-select-tree-filter>
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
                        <el-option
                          :key="logic.name"
                          :label="logic.name"
                          :value="logic.value"></el-option>
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
                      :disabled="$route.name === 'manage-realtime-manage-config-look'"
                      placeholder="请选择计算字段"
                      size="small"
                      :data="buildFiled(realtimeForm.events[0].radioType, false, true)"
                      :selected.sync="realtimeForm.having.attrField"
                      :defaultProps="{
                        children: 'children',
                        label: 'attrName',
                        id: 'attrField'
                      }">
                    </idss-select-tree-filter>
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
                        <el-option
                          :key="logic.name"
                          :label="logic.name"
                          :value="logic.value"></el-option>
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
          </widget-group>
          <widget-group title="输出结果" hideShadow padding="20px 0 0">
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
                  <el-input
                    v-model.trim="realtimeForm.output.eventName"
                    placeholder="请输入事件名称"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item
                  label-width="70px"
                  label="内部事件"
                  prop="output.innerEvent">
                  <el-checkbox
                    v-model="realtimeForm.output.innerEvent"></el-checkbox>
                </el-form-item>
              </el-col>
            </el-row>
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
                    <el-select
                      :disabled="index > 1 ? false : true"
                      style="width: 100%;"
                      v-model="property.eventField"
                      placeholder="请选择输出属性">
                      <el-option
                        v-for="item in eventFieldList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.name">
                      </el-option>
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
                    <el-select
                      @change="o => outputABChange(o, property)"
                      :disabled="index > 1 ? false : true"
                      style="width: 100%;"
                      v-model.trim="property.as"
                      placeholder="请选择数据源">
                      <el-option
                        v-for="(item, inx) in abList"
                        :key="inx"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
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
                    <template v-if="index > 1">
                      <idss-select-tree-filter
                        :disabled="$route.name === 'manage-realtime-manage-config-look'"
                        size="small"
                        :data="buildFiled(property.as, true)"
                        @nodeClick="(data, node, tree) => outNodeClick(data, node, tree, property)"
                        :selected.sync="property.attrField"
                        relatedFields="attrName"
                        :defaultProps="{
                          children: 'children',
                          label: 'attrField',
                          id: 'attrField'
                        }">
                      </idss-select-tree-filter>
                    </template>
                    <template v-else>
                      <idss-select-tree-filter
                        :disabled="
                          $route.name === 'manage-realtime-manage-config-look'
                        "
                        size="small"
                        :data="buildFiledDefault(property.as)"
                        @nodeClick="
                          (data, node, tree) =>
                            outNodeClick(data, node, tree, property)
                        "
                        :selected.sync="property.attrField"
                        relatedFields="attrName"
                        :defaultProps="{
                          children: 'children',
                          label: 'attrField',
                          id: 'attrField'
                        }">
                      </idss-select-tree-filter>
                    </template>
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
                    <template v-if="index > 1">
                      <el-select
                        size="small"
                        v-model.trim="property.fn"
                        placeholder="请选择">
                        <template
                          v-if="
                            property.attrType === 'ip' ||
                              property.attrType === 'string'
                          ">
                          <el-option
                            v-for="(val, key) in outFunUnit['string']"
                            :key="key"
                            :label="val"
                            :value="key"></el-option>
                        </template>
                        <template v-else-if="property.attrType === 'date'">
                          <el-option
                            v-for="(val, key) in outFunUnit['date']"
                            :key="key"
                            :label="val"
                            :value="key"></el-option>
                        </template>
                        <template v-else>
                          <el-option
                            v-for="(val, key) in outFunUnit['default']"
                            :key="key"
                            :label="val"
                            :value="key"></el-option>
                        </template>
                      </el-select>
                    </template>
                    <template v-else>
                      <el-select
                        :disabled="index > 1 ? false : true"
                        size="small"
                        v-model.trim="property.fn"
                        placeholder="请选择">
                        <el-option
                          v-for="(val, key) in outFunUnit['default']"
                          :key="key"
                          :label="val"
                          :value="key"></el-option>
                      </el-select>
                    </template>
                  </el-form-item>
                </el-col>
                <!-- 第五列 加入黑名单操作相关 -->
                <el-col :span="6" style="position: relative;">
                  <div class="outcomediv">
                    <el-form-item
                      label-width="0"
                      :prop="'output.selects.' + index + '.addList'">
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
                          :value="item.id">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </template>
                  <template
                    v-if="$route.name !== 'manage-realtime-manage-config-look'">
                    <button
                      v-if="index > 1"
                      @click.prevent="removeOutcome(property)"
                      style="position: absolute;top: -2px;right: 10px;"
                      :style="
                        property.addList ? {right: '10px'} : {left: '100px'}
                      "
                      class="idss-button-icon idss-svg_delete-hover">
                      <idss-icon-svg name="delete-hover"></idss-icon-svg>
                    </button>
                  </template>
                </el-col>
              </el-row>
            </template>
            <div>
              <el-button
                @click="addOutcome()"
                style="margin-left: 110px;"
                size="small"
                plain>添加输出属性</el-button>
            </div>
          </widget-group>
          <widget-group title="告警配置" hideShadow padding="20px 0 0">
            <el-form-item label="是否启用" prop="alert.enabled">
              <el-radio-group
                v-model="realtimeForm.alert.enabled"
                @change="enabledChange()">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <template v-if="realtimeForm.alert.enabled">
              <!-- <el-form-item label="重点关注" prop="alert.focusOn">
                <el-radio-group v-model="realtimeForm.alert.focusOn">
                  <el-radio :label="true">是</el-radio>
                  <el-radio :label="false">否</el-radio>
                </el-radio-group>
              </el-form-item> -->
              <!-- <el-form-item label="风险类型" prop="alert.riskType" :rules="{required: true, message: '请选择风险类型', trigger: 'change'}"> -->
              <el-form-item label="风险类型" prop="alert.riskType">
                <!-- <el-select stretch v-model="realtimeForm.alert.riskType" placeholder="请选择风险类型">
                  <el-option
                    v-for="item in sceneRiskList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select> -->
                <idss-select-tree-filter
                  :disabled="
                    $route.name === 'manage-realtime-manage-config-look'
                  "
                  placeholder="请选择风险类型"
                  size="small"
                  :data="sceneRiskList"
                  :selected.sync="realtimeForm.alert.riskType"
                  :defaultProps="{
                    children: 'children',
                    label: 'name',
                    id: 'id'
                  }">
                </idss-select-tree-filter>
              </el-form-item>
              <!-- <el-form-item label="风险级别" prop="alert.severity" :rules="{required: true, message: '请选择风险级别', trigger: 'change'}"> -->
              <el-form-item label="风险级别" prop="alert.severity">
                <el-select
                  stretch
                  v-model="realtimeForm.alert.severity"
                  placeholder="请选择风险级别">
                  <el-option
                    v-for="item in riskLevelList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <!-- <el-form-item label="杀伤链阶段" prop="alert.eventTechniqueType" :rules="{required: true, message: '请选择杀伤链阶段', trigger: 'change'}">
                <idss-select-tree-filter
                  placeholder="请选择杀伤链阶段"
                  :disabled="$route.name === 'manage-realtime-manage-config-look'"
                  width="100%"
                  size="small"
                  :data="darmStageList"
                  :selected.sync="realtimeForm.alert.eventTechniqueType"
                  :defaultProps="{
                    children: 'children',
                    label: 'name',
                    id: 'id'
                  }">
                </idss-select-tree-filter>
              </el-form-item> -->
              <!-- <el-form-item label="事件设备分类" prop="alert.eventDeviceType" :rules="{required: true, message: '请选择事件设备分类', trigger: 'change'}"> -->
              <el-form-item label="事件设备分类" prop="alert.eventDeviceType">
                <el-select
                  stretch
                  v-model="realtimeForm.alert.eventDeviceType"
                  placeholder="请选择事件设备分类">
                  <el-option
                    v-for="item in eventDeviceList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <!-- <el-form-item label="告警处置" prop="alert.alarm_disposal">
                <el-select stretch v-model="realtimeForm.alert.alarm_disposal" placeholder="请选择告警处置">
                </el-select>
              </el-form-item>
              <el-form-item label="邮件通知" prop="alert.mailAddress" :rules="{required: realtimeForm.alert.mailNotice, trigger: 'blur', validator: validaEmail}">
                <div class="item-checkbox">
                  <el-checkbox @change="alertCheckChange('mail')" size="small" v-model="realtimeForm.alert.mailNotice"></el-checkbox>
                </div>
                <template v-if="realtimeForm.alert.mailNotice">
                  <el-input style="padding-left: 30px;" size="small" v-model="realtimeForm.alert.mailAddress" placeholder="请输入邮箱,用逗号分开"></el-input>
                </template>
              </el-form-item> -->
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
                    :disabled="
                      $route.name === 'manage-realtime-manage-config-look'
                    "
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
              <!-- <el-form-item label="短信通知" prop="alert.shortMessageUsers" :rules="{required: realtimeForm.alert.shortMessageNotice, message: '不能为空', trigger: 'change'}">
                <div class="item-checkbox">
                  <el-checkbox @change="alertCheckChange('short')" size="small" v-model="realtimeForm.alert.shortMessageNotice"></el-checkbox>
                </div>
                <template v-if="realtimeForm.alert.shortMessageNotice">
                  <idss-select-tree-filter  style="padding-left: 30px;"
                  size="small"
                  :disabled="$route.name === 'manage-realtime-manage-config-look'"
                  :data='noticeUsersList'
                  multiple
                  :selected.sync="realtimeForm.alert.shortMessageUsers"
                  :defaultProps="{
                    children: 'children',
                    label: 'name',
                    id: 'id'
                  }"></idss-select-tree-filter>
            </template>
              </el-form-item> -->
            </template>
          </widget-group>
          <!-- 资源配置 -->
          <idss-collapse
            class="title"
            title="资源配置"
            :collapse.sync="collapse.resource"
            :is-button-show="false"
            is-arrow-show>
            <template>
              <el-row :gutter="20">
                <template
                  v-for="(configK, index) in realtimeForm.resourceConfig">
                  <el-col :span="6" :key="index" class="number-col">
                    <el-tag type="info" effect="plain" style="width: 100%;">
                      <template
                        v-if="
                          $route.name !== 'manage-realtime-manage-config-look'
                        ">
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
                          <el-input
                            style="width: 100%;"
                            v-model.trim="configK.value"></el-input>
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
          v-if="$route.name !== 'manage-realtime-manage-config-look'"
          v-loading="loading['save-policy']"
          size="small"
          type="primary"
          @click="onSubmit">保存</el-button>
      </div>
    </widget-group>
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
            <widget-group
              title="常用模板"
              hideShadow
              padding="20px 0 0"
              style="padding: 0;">
              <conditional-statement-group
                @addMould="addMould"></conditional-statement-group>
            </widget-group>
          </el-col>
          <el-col :span="12">
            <widget-group
              title="常用筛选器"
              hideShadow
              padding="20px 0 0"
              style="padding: 0;">
              <realtime-common-filter
                ref="realComRef"
                :filterObj.sync="filterDlg.filterData"
                :eventId="filterDlg.currentObj.temEventId"
                @addMouldFilter="addMouldFilter"></realtime-common-filter>
            </widget-group>
          </el-col>
        </el-row>
        <template v-else>
          <conditional-statement-group
            @addMould="addMould"></conditional-statement-group>
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
          <el-button
            size="small"
            type="primary"
            @click="submitEventCorrelation()">确 定</el-button>
        </div>
      </div>
    </el-dialog>
    <!-- 分组条件 弹框 -->
    <el-dialog
      custom
      :visible.sync="relevanceDlg.visible"
      width="60%"
      @close="relDlgClose()">
      <div slot="title" class="dialog-title clearfix">
        <span>分组条件</span>
        <button
          style="position: absolute;top: 5px;left: 91px;"
          class="idss-button-text"
          @click="addCorrelation">
          <i
            style="font-weight: bold;font-size: 20px;"
            class="el-icon-plus"></i>
        </button>
      </div>
      <template v-if="relevanceDlg.form.correlation.length">
        <el-form
          class="form-dlg"
          ref="relevanceRef"
          :model="relevanceDlg.form"
          size="small">
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
                    }">
                  </idss-select-tree-filter>
                </el-form-item>
              </el-col>
              <el-col :span="13" style="position: relative;">
                <el-tag
                  size="small"
                  style="position: absolute;top: 5px;left: -20px;"
                  type="info">等于</el-tag>
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
                    }">
                  </idss-select-tree-filter>
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
          <idss-icon-svg name="tianjia_huaban"></idss-icon-svg>
          暂无分组条件，点击新增
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
      <el-form
        ref="resConfigForm"
        :model="resConfigDlg.form"
        size="small"
        label-width="80px">
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
          <p style="background:#EAEAEA;padding-left: 14px;">
            {{ resConfigDlg.form.comment }}
          </p>
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
export default {
  name: 'manage-realtime-manage-config',
  components: { widgetGroup, conditionalStatementTree, conditionalStatementGroup, realtimeCommonFilter, assembleSelect },
  mixins: [globalMixins, service],
  data () {
    return {
      collapse: { // 收起控制
        resource: false
      },
      viewLoading: true,
      fourLableWidth: '90px',
      isShowBtn: true,
      relevanceDlg: {                  // 数据源分组条件
        visible: false,
        aFiledList: [],
        bFiledList: [],
        form: {
          correlation: []
        }
      },
      filterDlg: {                     // 数据源筛选条件
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
      resConfigDlg: {                     // 数据源筛选条件
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
      abList: [],                      // 输出结果A和B的下拉框
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
    fromCharCode () {
      return function (num) {
        return String.fromCharCode(65 + num)
      }
    },
    // 输出条件默认的处理过滤 abList中过滤
    buildFiledDefault () {
      return function (id) {
        if (!id) {
          return []
        }
        let tem = this.abList.filter(item => item.value === id)[0]
        let temEvent = this.getAttributesByType(tem.type)
        let treeData = []
        temEvent.map(item => {
          if (item.children) {
            if (item.attrType === undefined || item.attrType === 'date') {
              let children
              if (item.children) {
                children = item.children.filter(c => c.attrType === 'date')
              }
              if (children && children.length) {
                let json = JSON.parse(JSON.stringify(item))
                delete json.children
                treeData.push({ ...json, children: children })
              }
            }
          } else {
            item.attrType === 'date' && treeData.push(item)
          }
        })
        return treeData
      }
    },
    // 输出条不是件默认或者其他的处理过滤
    buildFiled () {
      return function (id, isAB, isFilter) {
        if (!id) {
          return []
        }
        let temEvent
        if (isAB) {
          let tem = this.abList.filter(item => item.value === id)[0]
          temEvent = this.getAttributesByType(tem.type)
        } else {
          temEvent = this.getAttributesByType(id)
        }
        if (isFilter) {
          let treeData = []
          temEvent.map(item => {
            if (item.children) {
              if (item.attrType === undefined || item.attrType === 'number') {
                let children
                if (item.children) {
                  children = item.children.filter(c => c.attrType === 'number')
                }
                if (children && children.length) {
                  let json = JSON.parse(JSON.stringify(item))
                  delete json.children
                  treeData.push({ ...json, children: children })
                }
              }
            } else {
              item.attrType === 'number' && treeData.push(item)
            }
          })
          return treeData
        } else {
          return temEvent || []
        }
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
    /**
     * 邮箱验证
     */
    validaEmail (rule, value, callback) {
      if (this.realtimeForm.alert.mailNotice) {
        if (value === '') {
          callback(new Error('邮箱不能为空'))
        } else {
          let ary = value.split(',')
          let isVali = true
          let reg = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/
          for (let index = 0; index < ary.length; index++) {
            const element = ary[index]
            if (!reg.test(element)) {
              isVali = false
              break
            }
          }
          if (!isVali) {
            callback(new Error('邮箱不合法'))
          } else {
            callback()
          }
        }
      } else {
        callback()
      }
    },
    // 模板选中事件
    templateChange (obj) {
      let tem = this.policyList.filter(item => item.id === obj)[0]
      // 补全数据源字段
      this.supplyEvents(tem)
      this.supplyWindow(tem)
      this.supplyGroupBy(tem)
      this.templateObj = tem
    },
    // 数据源选中事件
    eventChange (inx) {
      if (this.realtimeForm.events[inx].temEventId === '') return
      let obj = this.eventListObj.eventList.filter(item => item.id === parseInt(this.realtimeForm.events[inx].temEventId.split(',')[0]))[0]
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
    // 补全数据源字段
    supplyEvents (tem) {
      if (tem.type === 'pattern') {
        this.realtimeForm.events = [{
          as: 'A',
          radioType: 'global',
          temEventId: `${this.eventListObj.default}`,
          quantifier: {
            type: '>=',
            valueOne: '1'
          },
          str: '',
          conditions: ''
        }, {
          as: 'B',
          radioType: 'global',
          temEventId: `${this.eventListObj.default}`,
          quantifier: {
            type: '>=',
            valueOne: '1'
          },
          str: '',
          conditions: ''
        }]
        this.$set(this.realtimeForm, 'correlation', [])
        this.$set(this.realtimeForm, 'relationCondition', { condition: '', str: '' })
      } else {
        delete this.realtimeForm.correlation
        delete this.realtimeForm.relationCondition
        this.realtimeForm.events = [{
          as: 'A',
          radioType: 'global',
          temEventId: `${this.eventListObj.default}`,
          str: '',
          conditions: ''
        }]
      }
      this.supplyOutput()
    },
    // 补全时间窗口字段
    supplyWindow (tem) {
      if (tem.hasWindow) {
        this.realtimeForm.window = {
          attrField: this.windowTimeFieldsList[0].alias || '',
          unit: 's',
          value: 1
        }
        if (tem.hasHaving) {
          this.$set(this.realtimeForm.window, 'slide', 1)
          this.$set(this.realtimeForm.window, 'tumblingWindow', false)
        } else {
          delete this.realtimeForm.window.slide
          delete this.realtimeForm.window.tumblingWindow
        }
      } else {
        delete this.realtimeForm.window.attrField
        delete this.realtimeForm.window.unit
        delete this.realtimeForm.window.value
      }
    },
    // 补全触发器字段
    supplyGroupBy (tem) {
      this.realtimeForm.groupBy = ''
      if (tem.hasHaving) {
        this.$set(this.realtimeForm.having, 'fn', tem.having)
        this.$set(this.realtimeForm.having, 'attrField', '')
        this.$set(this.realtimeForm.having, 'compareType', '')
        this.$set(this.realtimeForm.having, 'value', 1)
        if (tem.having === 'count(*)') {
          delete this.realtimeForm.having.attrField
        } else {
          this.$set(this.realtimeForm.having, 'attrField', '')
        }
      } else {
        delete this.realtimeForm.having.fn
        delete this.realtimeForm.having.compareType
        delete this.realtimeForm.having.value
      }
    },
    // 设置output-selects和A和B的下拉框
    async supplyOutput () {
      // 设置AB
      this.abList = []
      // 设置select
      this.realtimeForm.output.selects = []
      if (this.realtimeForm.events.length === 2) {
        let tem
        let tId = this.realtimeForm.events[0].temEventId.split(',')[0]
        if (this.realtimeForm.events[0].radioType === 'single') {
          tem = { name: '分类日志', type: 'single' }
        } else if (this.realtimeForm.events[0].radioType === 'inner') {
          tem = { name: '内部事件', type: 'inner' }
        } else {
          tem = this.eventListObj.eventList.filter(item => item.id === parseInt(tId))[0]
        }
        this.abList.push({
          value: this.realtimeForm.events[0].as,
          label: `${this.realtimeForm.events[0].as}.${tem.name}`,
          type: `${tem.type}`
        })
        this.realtimeForm.output.selects.push({
          eventField: 'alarm_first_time',
          as: 'A',
          attrField: 'create_time',
          attrName: '发生时间',
          attrType: 'date',
          fn: 'min',
          addList: false,
          listIds: ''
        })
        tId = this.realtimeForm.events[1].temEventId.split(',')[0]
        if (this.realtimeForm.events[1].radioType === 'single') {
          tem = { name: '分类日志', type: 'single' }
        } else if (this.realtimeForm.events[1].radioType === 'inner') {
          tem = { name: '内部事件', type: 'inner' }
        } else {
          tem = this.eventListObj.eventList.filter(item => item.id === parseInt(tId))[0]
        }
        this.abList.push({
          value: this.realtimeForm.events[1].as,
          label: `${this.realtimeForm.events[1].as}.${tem.name}`,
          type: `${tem.type}`
        })
        this.realtimeForm.output.selects.push({
          eventField: 'alarm_last_time',
          as: 'B',
          attrField: 'create_time',
          attrName: '发生时间',
          attrType: 'date',
          fn: 'max',
          addList: false,
          listIds: ''
        })
      } else {
        let tId = this.realtimeForm.events[0].temEventId.split(',')[0]
        if (this.realtimeForm.events[0].radioType === 'single') {
          this.abList.push({
            value: this.realtimeForm.events[0].as,
            label: `${this.realtimeForm.events[0].as}.分类日志`,
            type: 'single'
          })
        } else if (this.realtimeForm.events[0].radioType === 'inner') {
          this.abList.push({
            value: this.realtimeForm.events[0].as,
            label: `${this.realtimeForm.events[0].as}.内部事件`,
            type: 'inner'
          })
        } else {
          let tem = this.eventListObj.eventList.filter(item => item.id === parseInt(tId))[0]
          this.abList.push({
            value: this.realtimeForm.events[0].as,
            label: `${this.realtimeForm.events[0].as}.${tem.name}`,
            type: `${tem.type}`
          })
        }
        this.realtimeForm.output.selects.push({
          eventField: 'alarm_first_time',
          as: 'A',
          attrField: 'create_time',
          attrName: '发生时间',
          attrType: 'date',
          fn: 'min',
          addList: false,
          listIds: ''
        })
        this.realtimeForm.output.selects.push({
          eventField: 'alarm_last_time',
          as: 'A',
          attrField: 'create_time',
          attrName: '发生时间',
          attrType: 'date',
          fn: 'max',
          addList: false,
          listIds: ''
        })
      }
      await this.$nextTick()
      this.$refs['realtimeForm'].clearValidate()
    },
    // 转化数据类型tree的形式渲z染{id-label-children}
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
    // 数据源加过滤条件
    editEventFilter (type, obj, inx) {
      if (this.filterDlg.visible) {
        return
      }
      this.filterDlg.visible = true
      this.filterDlg.type = type
      this.$store.commit('realtime/moulds', this.mouldDictionary[type])
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
    addCommonFilter () {
      let self = this
      if (self.filterDlg.filterData.terms.length || self.filterDlg.filterData.children.length) {
        this.$refs['realComRef'].saveConfrim()
      }
    },
    // 过滤条件弹出框保存
    submitEventCorrelation () {
      let self = this
      if (self.filterDlg.filterData.terms.length || self.filterDlg.filterData.children.length) {
        let param = {
          conditions: JSON.stringify(self.filterDlg.filterData)
        }
        if (self.filterDlg.type === 'realtime-filter') {
          param.type = self.realtimeForm.events[self.filterDlg.inx].radioType
        } else {
          param.type = self.realtimeForm.events.map(item => { return item.radioType }).join(',')
        }
        self.buildFilterExpression(param).then((res) => {
          if (self.filterDlg.type === 'realtime-filter') {
            self.realtimeForm.events[self.filterDlg.inx].str = res.expression
            self.realtimeForm.events[self.filterDlg.inx].conditions = JSON.stringify(self.filterDlg.filterData)
          } else {
            self.realtimeForm.relationCondition.str = res.expression
            self.realtimeForm.relationCondition.condition = JSON.stringify(self.filterDlg.filterData)
          }
          self.filterDlg.visible = false
          self.$refs['realtimeForm'].validateField(`events.${self.filterDlg.inx}.str`)
        }, (err) => {
          this.showMessage(Array.isArray(err.message) && err.message.length ? err.message[0].message : err.message, 'error')
        })
      } else {
        if (self.filterDlg.type === 'realtime-filter') {
          self.realtimeForm.events[self.filterDlg.inx].str = ''
          self.realtimeForm.events[self.filterDlg.inx].conditions = ''
        } else {
          self.realtimeForm.relationCondition.str = ''
          self.realtimeForm.relationCondition.condition = ''
        }
        self.filterDlg.visible = false
        self.$refs['realtimeForm'].validateField(`events.${self.filterDlg.inx}.str`)
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
    // 发生次数选择事件
    operaChange (val, item) {
      var inx = this.realtimeForm.events.indexOf(item)
      if (inx !== -1) {
        this.$set(this.realtimeForm.events[inx].quantifier, 'valueOne', 1)
        if (val === 'between') {
          this.$set(this.realtimeForm.events[inx].quantifier, 'valueTwo', 1)
        } else {
          delete this.realtimeForm.events[inx].quantifier.valueTwo
        }
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
    removeOutcome (item) {
      var index = this.realtimeForm.output.selects.indexOf(item)
      if (index !== -1) {
        this.realtimeForm.output.selects.splice(index, 1)
      }
    },
    // 输出属性的ab 发生改变清空字段
    outputABChange (current, item) {
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
      Promise.all(api).then(data => {
        if (id) {
          // 移除本身的数据源
          let tem = data[0].eventList.filter(item => item.strategyId !== parseInt(id))
          this.eventListObj = {
            default: data[0].default,
            eventList: tem,
            logAttributes: data[0].logAttributes,
            eventAttributes: data[0].eventAttributes
          }

          this.isShowBtn = true
          let jsonData = JSON.parse(JSON.stringify(data[1]))
          delete jsonData.resourceConfig
          this.realtimeForm = Object.assign({}, this.realtimeForm, data[1])
          this.supplyResourceConfig(data[1].resourceConfig)
          this.editBuildData()
          this.viewLoading = false
        } else {
          this.viewLoading = false
          this.eventListObj = data[0]
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
    .collapse-title {
      font-size: 16px !important;
      font-weight: inherit !important;
      color: #353940 !important;
      padding-left: 12px !important;
      border-left: 5px solid #22a5f7 !important;
    }
  }
}
.filter-dlg[custom] >>> .el-dialog {
  min-width: 760px;
}
</style>
