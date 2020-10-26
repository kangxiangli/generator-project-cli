<template>
  <div class="backup-record-detail-container">
    <idss-widget
      :global-style="{margin: 0}"
      shadow="never">
      <template slot="title-left">
        备份记录
      </template>
      <el-form
        plain
        :model="backupRecordForm"
        label-width="100px">
        <el-form-item label="备份文件名" prop="bakFileName">
          <span>{{backupRecordForm.bakFileName}}</span>
          <button v-if="backupRecordForm.bakStatus === 'bak_success'" class="idss-button-icon backup-success-btn marginLeft10">
            <idss-icon-svg name="ok"></idss-icon-svg>成功
          </button>
          <button v-if="backupRecordForm.bakStatus === 'bak_failure'" class="idss-button-icon backup-failure-btn marginLeft10">
            <idss-icon-svg name="close"></idss-icon-svg>失败
          </button>
          <button v-if="backupRecordForm.bakStatus === 'bak_underway'" class="idss-button-icon backup-underway-btn marginLeft10">
            <idss-icon-svg name="huanchong"></idss-icon-svg>备份中
          </button>
        </el-form-item>
        <el-form-item label="所属备份" prop="fileName">
          <span>{{backupRecordForm.fileName}}</span>
        </el-form-item>
        <el-form-item>
          <el-row v-if="backupRecordForm.bakStatus === 'bak_success'">
            <label>备份时间：</label><span>{{backupRecordForm.bakTime}}</span>
          </el-row>
          <el-row v-if="backupRecordForm.bakStatus === 'bak_failure'">
            <label>失败原因：</label><span>{{backupRecordForm.bakFailCause}}</span>
          </el-row>
        </el-form-item>
        <el-form-item label="备份内容">
          <label>事件数据：</label><span>{{backupRecordForm.bakContent}}</span>
        </el-form-item>
        <el-form-item>
          <label>备份数据量：</label><span>{{backupRecordForm.bakCount}}</span>
        </el-form-item>
        <el-form-item label="备份路径">
          <span>{{backupRecordForm.bakPath}}</span>
          <el-button class="marginLeft10" v-if="backupRecordForm.bakStatus === 'bak_failure'" type="primary" size="small" custom @click="backupAgian">重新备份</el-button>
        </el-form-item>
      </el-form>
    </idss-widget>
  </div>
</template>
<script>
import globalMixins from '@/mixins/globalMixins.js'
import BackupRecordDetailService from '@/views/manage/backup/components/backup-record-detail-service.js'
export default {
  name: 'backup-record-detail',
  mixins: [globalMixins, BackupRecordDetailService],
  props: {
    id: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      backupRecordForm: {
        fileName: '',
        recordId: '',
        bakTime: '',
        bakPath: '',  // 备份路径
        bakFileName: '',  // 备份文件名
        bakFailCause: '', // 备份失败原因
        bakStatus: '', // 备份状态
        bakCount: 0,   //
        bakSize: 0,
        bakManageId: '',
        bakContent: ''  // 事件数据
      }
    }
  },
  methods: {
    /**
     * 初始化数据
     */
    async init () {
      await this.$nextTick()
      this.searchBackupRecord()
    },
    /**
     * 重新备份
     */
    backupAgian () {
      this.$emit('agian-backup', { id: this.backupRecordForm.bakManageId, componentType: 'AddBackup' })
    }
  }
}
</script>
<style scoped lang="postcss">
.backup-record-detail-container {
  .marginLeft10 {
    margin-left: 10px;
  }
  .backup-failure-btn {
    color: rgb(245, 135, 25);
    & .idss-svg-icon {
      fill: rgb(245, 135, 25);
    }
  }
  .backup-success-btn {
    color: #66ccff;
    & .idss-svg-icon {
      fill: #66ccff;
    }
  }
  .backup-underway-btn {
    color: #34adba;
    & .idss-svg-icon {
      animation: rotating 2s linear infinite;
      fill: #34adba;
    }
  }
}
</style>
