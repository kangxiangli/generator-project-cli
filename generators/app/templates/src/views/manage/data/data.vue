<template>
  <div class="hello">
    <idss-widget style="padding: 16px;" header-type="header-float-right">
      <template slot="title-right">
        <el-button size="mini" icon="el-icon-plus"
          style="margin: 8px;"
          @click="handleTabsEdit">添加部门</el-button>
      </template>
      <el-tabs
        v-model="editableTabsValue"
        @tab-click="changeTab($event)"
        class="tabEdit">
        <el-tab-pane
          v-for="(item, index) in editableTabs"
          :key="item.uid"
          :label="item.deptName"
          :name="item.uid">
          <span v-if="item.level==='master'" slot="label">
            <i class="el-icon-star-on" style="margin-right: 5px"></i>
            {{item.deptName}}
          </span>
          <dataConfig
            v-if="isshow[index]"
            :tabData="tabSendData">
          </dataConfig>
        </el-tab-pane>
      </el-tabs>
    </idss-widget>
  </div>
</template>

<script>
import globalMixins from '@/mixins/globalMixins.js'
import service from './data-service.js'
import dataConfig from '@/views/manage/data/data-config.vue'

export default {
  name: 'manage-data-server',
  mixins: [globalMixins, service],
  components: {
    dataConfig
  },
  data () {
    return {
      editableTabsValue: '',
      editableTabs: [],
      tabSendData: [],
      masteruId: '',
      isshow: []
    }
  },
  methods: {
    /**
     * tab 编辑
     */
    handleTabsEdit () {
      this.$router.push({ name: 'manage-data-deptEtl' })
    },

    changeTab (param) {
      for (let obj in this.isshow) {
        if (param.index === obj) {
          this.isshow[param.index] = true
        } else {
          this.isshow[obj] = false
        }
      }
      if (this.masteruId === this.editableTabsValue) {
        this.tabSendData = {
          uid: this.editableTabsValue,
          level: 'master'
        }
      } else {
        this.tabSendData = {
          uid: this.editableTabsValue
        }
      }
    },
    checkparam () {
      var equalIndex = ''
      if (this.$route.query.uid) {
        this.editableTabsValue = this.$route.query.uid
        for (let obj in this.editableTabs) {
          if (this.$route.query.uid === this.editableTabs[obj].uid) {
            equalIndex = obj
            this.isshow[obj] = true
          } else {
            this.isshow[obj] = false
          }
        }
        this.tabSendData = {
          uid: this.$route.query.uid,
          level: this.editableTabs[equalIndex].level
        }
      }
    }
  },
  mounted () {
    this.getDeptList()
  }
}
</script>

<style scoped lang="postcss">
</style>
