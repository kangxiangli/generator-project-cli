<template>
  <div
    class="manage-field-info"
    v-loading="loading['manage-datasource-field-info']">
    <el-form
      plain
      size="medium"
      label-width="130px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="是否是共通">{{fieldData.isCommonText}}</el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="字段名(英文)">{{fieldData.field}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="字段名(中文)">{{fieldData.name}}</el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="数据源名称">
            {{fieldData.datasourceText == null || fieldData.datasourceText == '' ? '-' : fieldData.datasourceText}}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="TODO可变">
            {{fieldData.individualValue == null || fieldData.individualValue == '' ? '-' : fieldData.individualValue}}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="共通组名称">
            {{fieldData.commonGroupText == null ||fieldData.commonGroupText == '' ? '-' : fieldData.commonGroupText}}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="区分字段名称">
            {{fieldData.commonFieldText == null || fieldData.commonFieldText == '' ? '-' : fieldData.commonFieldText}}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="字段类型">
            {{fieldData.typeText == null || fieldData.typeText == '' ? '-' : fieldData.typeText}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="对应的字典">
            {{fieldData.dictionary == null || fieldData.dictionary == '' ? '-' : fieldData.dictionary}}</el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="统计的运算方法">{{fieldData.computeTypesText}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否可以用于分组">{{fieldData.canGroupText}}</el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="表示形式">
            {{fieldData.formatStyle == null || fieldData.formatStyle == '' ? '-' : fieldData.formatStyle}}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="表示单位">
            {{fieldData.formatUnit == null || fieldData.formatUnit == '' ? '-' : fieldData.formatUnit}}</el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="过滤方式">{{fieldData.operatorsReferText}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="顺序">{{fieldData.dspOrder}}</el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import service from '../datasource-field-service.js'
import globalMixins from '@/mixins/globalMixins.js'
export default {
  name: 'manage-field-info',
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
      fieldData: {
        id: '',             // 主键
        field: '',          // 英文名
        name: '',           // 中文名
        datasourceId: '',   // 数据源id
        type: '',           // 字段类型
        dictionary: '',     // 对应字典
        computeTypes: '',   // 计算符
        canGroup: '',       // 是否可以分组
        formatStyle: '',    // 表示形式
        formatUnit: '',     // 表示单位
        operatorsRefer: '', // 过滤条件用
        dspOrder: ''        // 顺序
      },
      // 编辑密码窗口是否展示
      isPwdShow: false
    }
  },
  methods: {

  },
  created () {
    this.getFieldInfo(this.id)
  }
}
</script>

<style scoped lang="postcss">
.manage-field-info {
  & > .el-form {
    padding: 20px 40px 10px;
  }
  & .el-form-item {
    margin-bottom: 15px;
  }
}
</style>
