<template>
  <div
    class="manage-datasource-info"
    v-loading="loading['manage-datasource-datasource-info']">
    <el-form
      plain
      label-width="120px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="数据源名称">{{datasourceData.datasourceName}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="数据库类型">{{datasourceData.dbType}}</el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="数据库版本">
            {{datasourceData.dbVersion == null || datasourceData.dbVersion == '' ? '-' : datasourceData.dbVersion}}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="索引/schema名">{{datasourceData.dbName}}</el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="是否分片">{{datasourceData.isShardText}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="分片格式">
            {{datasourceData.shardFormat == null || datasourceData.shardFormat =='' ? '-' : datasourceData.shardFormat}}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="type/表名">{{datasourceData.tableName}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="时间范围字段">{{datasourceData.timeField}}</el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item
            label="共通字段组名称"
            v-if="datasourceData.commonGroupText != null ">{{datasourceData.commonGroupText == null || datasourceData.commonGroupText == '' ? '-' : datasourceData.commonGroupText}}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="区分字段名称">
            {{datasourceData.commonFieldText == null || datasourceData.commonFieldText =='' ? '-' : datasourceData.commonFieldText}}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="数据下钻链接">
            {{datasourceData.urlKeyText == null || datasourceData.urlKeyText == '' ? '-' : datasourceData.urlKeyText}}
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="可展示的图样">{{datasourceData.canUseGraphText}}</el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import service from '../datasource-service.js'
import globalMixins from '@/mixins/globalMixins.js'
export default {
  name: 'manage-datasource-info',
  props: {
    id: {
      type: String,
      default: ''
    }
  },
  mixins: [globalMixins, service],

  data () {
    return {
      // 字典
      dict: {
      },
      datasourceData: {
        datasourceName: '', // 数据源名称
        dbType: '',         // 数据库类型
        dbVersion: '',      // 数据库版本
        dbName: '',         // 数据库/schema名
        isShard: '',        // 是否分片
        shardFormat: '',    // 分片格式
        tableName: '',      // type/表名
        timeField: '',      // 时间范围字段
        commonGroupId: '',  // 共通组id
        commonFieldId: '',  // 区分字段id
        canUseGraph: '',    // 可以用于展示的图样
        urlKey: ''          // 是否下钻到全文检索
      }
    }
  },
  methods: {

  },
  created () {
    this.getDatasourceInfo(this.id)
  }
}
</script>
f
