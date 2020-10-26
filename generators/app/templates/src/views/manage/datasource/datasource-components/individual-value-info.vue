<!--
 * @Author: guozp
 * @Date: 2020-04-16 11:32:43
 * @LastEditTime: 2020-09-16 17:15:53
 * @LastEditors: guozp
 * @Description: Do not edit
 * @FilePath: /argus-fe-template/src/views/manage/datasource/datasource-components/individual-value-info.vue
-->
<template>
  <div
    class="manage-individual-value-info"
    v-loading="loading['manage-datasource-individual-value-info']">
    <el-form
      label-width="100px"
      plain
      size="medium">
      <el-row>
        <el-col :span="12">
          <el-form-item label="数据源">{{individualValueData.datasourceName}}</el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="字段值">
            {{individualValueData.individualValue == null || individualValueData.individualValue == '' ? '-' : individualValueData.individualValue}}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="字段值名称">
            {{individualValueData.individualLogName == null ||individualValueData.individualLogName == '' ? '-' : individualValueData.individualLogName}}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="设备类型">
            {{individualValueData.individualEqptName == null || individualValueData.individualEqptName == '' ? '-' : individualValueData.individualEqptName}}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="描述">
            {{individualValueData.individualDescName == null || individualValueData.individualDescName == '' ? '-' : individualValueData.individualDescName}}
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import service from '../datasource-individual-value-service.js'
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
      individualValueData: {
        id: '',                  // 主键
        datasourceId: '',        // 数据源id
        datasourceName: '',      // 数据源名称
        individualValue: '',     // 字段值
        individualLogName: '',   // 字段值名称
        individualEqptName: '',  // 设备类型
        individualDescName: ''   // 描述
      },
      // 编辑密码窗口是否展示
      isPwdShow: false
    }
  },
  methods: {

  },
  created () {
    this.getIndividualValueInfo(this.id)
  }
}
</script>

<style scoped lang="postcss">
.manage-individual-value-info {
  & > .el-form {
    padding: 20px 40px 10px;
  }
  & .el-form-item {
    margin-bottom: 15px;
  }
}
</style>
