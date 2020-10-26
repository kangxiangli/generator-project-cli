<template>
  <div class="add-backup-container">
    <idss-widget shadow="never" :global-style="{padding: '0 10px 10px 10px', margin: 0}">
      <template slot="title-left">
        {{backupTitle}}
      </template>
      <el-form
        plain
        :model="addBackupForm"
        :rules="rules"
        label-width="110px"
        ref="addBackupForm"
        class="backup-form"
        @submit.native.prevent>
        <el-row>
          <el-col :span="12">
            <el-form-item
              :error="addBackupFormError.fileName"
              prop="fileName"
              label="备份文件名">
              <el-input
                :disabled="addBackupForm.autoGenerateName"
                size="small"
                v-model.trim="addBackupForm.fileName"
                @focus="addBackupFormError.fileName=''">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              prop="autoGenerateName"
              label="是否自动生成">
              <el-switch
                v-model="addBackupForm.autoGenerateName"
                active-text="是"
                inactive-text="否">
              </el-switch>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="备份内容"
              prop="indexTemplate">
              <el-select
                v-model="addBackupForm.indexTemplate"
                filterable
                @change="getBackupData"
                stretch
                size="small"
                placeholder="请选择备份内容">
                <el-option
                  v-for="item in templateList"
                  :key="item"
                  :label="item"
                  :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="时间">
              <idss-time-select
                @change="getBackupData"
                :time.sync="globalTime"
                style="width: 100%;"
                is-show-tooltip>
              </idss-time-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item>
              <span>预计备份数据量：{{backupDataNum}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="9">
            <el-form-item label="" prop="bakWay">
              <el-radio-group v-model="addBackupForm.bakWay">
                <el-radio label="local">本地备份</el-radio>
                <el-radio label="remote">远程备份</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label-width="180px" label="备份后是否删除相关数据" prop="bakFinishDel">
              <el-switch
                v-model="addBackupForm.bakFinishDel"
                active-text="是"
                inactive-text="否">
              </el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="是否自动备份" prop="bakAuto">
              <el-switch
                v-model="addBackupForm.bakAuto"
                active-text="是"
                inactive-text="否">
              </el-switch>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item v-if="addBackupForm.bakWay==='remote'" label="备份方式" prop="protocolType">
          <el-select
            v-model="addBackupForm.protocolType"
            size="small"
            placeholder="请选择备份方式">
            <el-option
              v-for="item in backupWayList"
              :key="item"
              :label="item"
              :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="addBackupForm.bakWay==='remote'"
          label="账号"
          prop="account">
          <el-input size="small" v-model.trim="addBackupForm.account"></el-input>
        </el-form-item>
        <el-form-item
          v-if="addBackupForm.bakWay==='remote'"
          label="密码"
          prop="passwd">
          <el-input size="small" v-model.trim="addBackupForm.passwd"></el-input>
        </el-form-item>
        <el-form-item
          v-if="addBackupForm.bakWay==='remote'"
          :error="addBackupFormError.bakPath"
          label="备份路径"
          prop="bakPath">
          <el-input
            size="small"
            v-model.trim="addBackupForm.bakPath"
            @focus="addBackupFormError.bakPath=''"></el-input>
          <p class="example">示例：192.168.0.238:21/home/test</p>
        </el-form-item>
        <el-form-item v-if="addBackupForm.bakWay==='remote'">
          <el-button
            type="primary"
            size="medium"
            custom
            @click="testConnect">测试连接</el-button>
        </el-form-item>
        <el-row type="flex" :gutter="10">
          <el-col>
            <el-form-item label="自动备份周期" prop="executeCycle">
              <el-select
                v-model="addBackupForm.executeCycle"
                stretch
                @change="cycleChange"
                size="small">
                <el-option label="每天" value="day"></el-option>
                <el-option label="每周" value="week"></el-option>
                <el-option label="每月" value="month"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col v-show="addBackupForm.executeCycle === 'week'">
            <el-form-item
              prop="executeDate"
              label-width="0">
              <el-select
                stretch
                v-model="addBackupForm.executeDate"
                size="small">
                <el-option
                  v-for="(value, key) in weekDayConfig"
                  :key="key"
                  :value="key"
                  :label="value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col v-show="addBackupForm.executeCycle === 'month'">
            <el-form-item prop="executeDate" label-width="0">
              <el-select
                stretch
                v-model="addBackupForm.executeDate"
                size="small">
                <el-option
                  v-for="val in 31"
                  :key="val"
                  :value="`${val}`"
                  :label="val + '日'">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item prop="executeTime" label-width="0">
              <el-time-picker
                stretch
                v-model.lazy="addBackupForm.executeTime"
                :clearable="false"
                :editable="false"
                size="small"
                format="HH:mm"
                value-format="HH:mm"
                placeholder="任意时间点">
              </el-time-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <el-button type="primary" size="medium" custom @click="saveBackup">确定</el-button>
          <el-button size="medium" custom @click="reset">重置</el-button>
          <el-button size="medium" custom @click="cancel">取消</el-button>
        </el-form-item>
      </el-form>
    </idss-widget>
  </div>
</template>
<script>
import globalMixins from '@/mixins/globalMixins.js'
import AddBackupService from '@/views/manage/backup/components/add-backup-service.js'
import { BACKUP_TITLE, WEEKDAY, FORMINIT, CURRENT_DAY_OR_DATE } from '@/views/manage/backup/dictionary.js'
export default {
  name: 'add-backup',
  mixins: [globalMixins, AddBackupService],
  props: {
    id: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: '新建备份'
    }
  },
  computed: {
    backupTitle: function () {
      return BACKUP_TITLE[this.title]
    }
  },
  data () {
    const checkFileName = (rule, value, cb) => {
      if (!value && !this.addBackupForm.autoGenerateName) {
        return cb(new Error('请输入文件名'))
      }
      cb()
    }
    return {
      addBackupForm: {
        fileName: '',
        bakFinishDel: false,
        autoGenerateName: false,
        bakAuto: false,  // 是否自动备份
        bakWay: 'remote',  // 备份方式
        executeCycle: 'day',  // 时间周期
        executeDate: '',
        executeTime: `${new Date().getHours()}:${new Date().getMinutes()}`,
        indexTemplate: '',  // 备份内容
        protocolType: '',   // 备份方式
        account: '',        // 账号
        passwd: '',         // 密码
        bakPath: ''         // 备份路径
      },
      rules: {
        fileName: [
          { required: true, validator: checkFileName }
        ],
        indexTemplate: [
          { required: true, message: '请选择备份模板', trigger: 'change' }
        ],
        bakPath: [
          { required: true, message: '请输入备份路径', trigger: 'blur' }
        ]
      },
      weekDayConfig: WEEKDAY,
      templateList: [],  // 备份模板
      backupWayList: ['ftp', 'sftp'],  // 备份方式下拉框
      backupDataNum: 0,  // 预计备份数据量条数
      addBackupFormError: {}  // 后台返回的表单错误
    }
  },
  methods: {
    /**
     * 初始化数据
     */
    async init () {
      await this.$nextTick()
      this.searchBackup()           // 备份查询
      this.getBackupTemplateList()  // 获取备份内容下拉框数据
    },
    /**
     * 周期改变 主要处理当周期是周或者是月的话需要默认当天时周几或者是几号
     */
    cycleChange () {
      this.addBackupForm.executeDate = CURRENT_DAY_OR_DATE[this.addBackupForm.executeCycle]
    },
    /**
     * 新增备份
     */
    saveBackup () {
      this.$refs['addBackupForm'].validate((valid) => {
        if (valid) {
          this.backupAdd()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    /**
     * 重置
     */
    reset () {
      let form = this.title === 'add' ? JSON.parse(JSON.stringify(FORMINIT)) : this.originForm
      this.addBackupForm = Object.assign({}, this.addBackupForm, form)
    },
    /**
     * 取消
     */
    cancel () {
      this.$refs['addBackupForm'].resetFields()
      this.addBackupForm.indexTemplate = this.templateList[0]
    }
  }
}
</script>
<style scoped lang="postcss">
.add-backup-container {
  & .marginLeft10 {
    margin-left: 10px;
  }
  & .example {
    font-size: 1.2rem;
    color: #aaa;
  }
}
</style>
