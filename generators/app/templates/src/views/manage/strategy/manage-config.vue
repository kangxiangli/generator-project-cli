<template>
  <div class="manage-strategy-manage-add" v-loading="loading['load-page']">
    <idss-widget :main-style="{ padding: '15px 0' }" :footer-style="{ padding: '10px' }">
      <set-policy-type
        ref="policyTypeFrom"
        :showBtn="componentMode !== 3"
        :groupId="groupId"
        :data.sync="strategy"
        class="policy-manage_block"></set-policy-type>
      <set-time-config
        ref="timeConfigFrom"
        :showBtn="componentMode !== 3"
        :groupId="groupId"
        :data.sync="timeWindow"
        class="policy-manage_block"></set-time-config>
      <set-dataset-config
        ref="datasetConfigFrom"
        :showBtn="componentMode !== 3"
        :groupId="groupId"
        :data.sync="dataset"
        class="policy-manage_block"></set-dataset-config>
      <set-policy-config
        ref="policyConfigFrom"
        :showBtn="componentMode !== 3"
        :groupId="groupId"
        :data.sync="filterConfig"
        class="policy-manage_block"></set-policy-config>
      <set-action-config
        ref="actionConfigFrom"
        v-if="groupId === '2'"
        :showBtn="componentMode !== 3"
        :groupId="groupId"
        :data.sync="actionConfig"
        :outData.sync="outConfig"
        class="policy-manage_block"></set-action-config>
      <set-baseline-config
        ref="baselineConfigFrom"
        v-else
        :showBtn="componentMode !== 3"
        :groupId="groupId"
        :data.sync="baselineStrategy"
        class="policy-manage_block"></set-baseline-config>
      <set-condition
        ref="conditionFrom"
        :showBtn="componentMode !== 3"
        :groupId="groupId"
        :data.sync="actionCondition"
        class="policy-manage_block"></set-condition>
      <div slot="footer">
        <!-- <el-button size="small" @click="restForm">重置</el-button> -->
        <el-button
          v-if="componentMode !== 3"
          v-loading="loading['save-policy']"
          size="small"
          type="primary"
          @click="onSubmit()">保存</el-button>
        <el-button size="small" @click="revert()">取消</el-button>
      </div>
    </idss-widget>
  </div>
</template>

<script>
import service from './manage-config-service'
import setPolicyType from '@/views/commons/set-policy-type.vue'
import setTimeConfig from '@/views/commons/set-time-config.vue'
import setDatasetConfig from '@/views/commons/set-dataset-config.vue'
import setPolicyConfig from '@/views/commons/set-policy-config.vue'
import setActionConfig from '@/views/commons/set-action-config.vue'
import setCondition from '@/views/commons/set-condition.vue'
import setBaselineConfig from '@/views/commons/set-baseline-config.vue'
import globalMixins from '@/mixins/globalMixins.js'
export default {
  components: { setPolicyType, setTimeConfig, setDatasetConfig, setPolicyConfig, setActionConfig, setCondition, setBaselineConfig },
  mixins: [globalMixins, service]
}
</script>
<style scoped lang="postcss">
.policy-manage_block {
  border-bottom: 1px dashed #ebeef5;
  & >>> .idss-widget {
    .title-left {
      padding-left: 8px;
      border-left: 2px solid var(--color-primary);
    }
  }
}
</style>
