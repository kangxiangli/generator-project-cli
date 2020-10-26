/**
 * 此文件存放mutations的类型常量
 * 约定types以"$$"结尾的，需要持久化到localStorage
 * Created by ligang on 2018/6/1.
 */

// 业务系统字典表
export const BASE = {
  IS_RE_LOGIN: 'isReLogin',
  TOKEN: 'token$$',
  USER_INFO: 'userInfo$$',
  GLOBAL_CONFIG: 'globalConfig$$',
  THEME: 'theme$$'
}

// 新大盘
export const DASHBOARD = {
  COLUMNS_RULE: 'columns-rule',
  DICTIONARY: 'dictionary',
  IS_PROXY: 'isProxy',
  CHECK_GRAPH: 'check-graph',
  DATA_SOURCE: 'data-source',
  // 组件组列表
  GROUP_LIST: 'group-list',
  // 大盘列表
  DASHBOARD_LIST: 'dashboard-list'
}

// 事件
export const EVENT = {
  SEVERITY: 'severity',
  WARN_STATUS_LIST: 'warnStatusList'
}

// 日志
export const LOG = {
  SOURCE_LIST: 'sourceList'
}

// 策略
export const POLICY = {
  LOG_DICT: 'log-dict',
  LOG_DICT_ONE: 'log-dict-one',
  FILTER_FUN: 'filter-Fun',
  STRATEGY_FUN: 'strategy-fun',
  OPERATION: 'operation',
  BASE_LINE: 'base-line',
  BASE_LINE_TOP: 'base-line-top',
  LIST_TAGS: 'list-tags',
  LIST_OPERATION: 'list-operation',
  LIST_DATASET: 'list-dataset'
}

// 事实策略
export const REALTIME = {
  FILED_DICTS: 'filed-dicts',      // 字典列表
  MOULDS: 'moulds',                // 模板语法
  MOULD_DICTIONARY: 'mould-dictionary',                // 全部模板语法
  OPERATIONS: 'operations',        // 运算
  OPERATION_ONE: 'operation-one',  // 运算
  BASELINE: 'baseline',            // 基线
  BASELINE_TOP: 'baseline-top',    // 基线top
  TAGS: 'tags',                    // 名单
  DATASETS: 'datasets',            // 数据集
  REAL_DICTIONARY: 'real-dictionary'            // 字典合并
}

// 消息中心
export const MESSAGE = {
  STATUS: 'statusList',
  SOURCE: 'messageSourceList',
  TYPE: 'messageTypeList'
}
