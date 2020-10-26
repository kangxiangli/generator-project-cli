<template>
  <div id="jdbc">
    <el-form label-width="120px" :model="jdbcData" :rules="rules" ref="jdbcData" size="small">
      <el-form-item label="标题名称" prop="title">
        <el-input v-model="jdbcData.title" placeholder="请输入标题名称"></el-input>
      </el-form-item>
      <el-form-item label="采集节点IP" prop="collectNodeIps">
        <el-select v-model="jdbcData.collectNodeIps" placeholder="请选择" style="width: 100%">
          <el-option
            v-for="item in options"
            :key="item.workerIp"
            :label="item.workerIp"
            :value="item.workerIp"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="数据库类型" prop="dbType">
        <el-select v-model="jdbcData.dbType" placeholder="请选择数据库类型">
          <el-option
            v-for="item in dbTypedata"
            :key="item.value"
            :label="item.label"
            :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <div class="grid-content bg-purple">
            <el-form-item label="用户名" prop="dbUser">
              <el-input v-model="jdbcData.dbUser" placeholder="请输入用户名"></el-input>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content bg-purple-light">
            <el-form-item label="密码" prop="dbPassword">
              <el-input v-model="jdbcData.dbPassword" type="password" placeholder="请输入密码"></el-input>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-form-item label="数据库链接" prop="dbUrl">
        <el-input v-model="jdbcData.dbUrl" placeholder="请输入数据库链接地址" style="width:85%"></el-input>
        <el-button style="float: right;" @click="gettableName">验证</el-button>
      </el-form-item>
      <el-form-item>
        <p class="demoFont">示例：</p>
        <p class="demoFont">jdbc:db2://10.10.100.104:50000/db2</p>
        <p class="demoFont">jdbc:mysql://192.168.1.100:3306/mysql</p>
        <p class="demoFont">jdbc:oracle:thin:@192.168.1.100:1521:oracle</p>
        <p class="demoFont">jdbc:sqlserver://10.10.100.103:1433;databaseName=sqlserver</p>
        <p class="demoFont">jdbc:postgresql://10.10.10.239:5432/postgresql</p>
      </el-form-item>
      <el-form-item>
        <el-radio v-model="jdbcData.tableType" label="static">静态表</el-radio>
        <el-radio v-model="jdbcData.tableType" label="dynamic">动态表</el-radio>
      </el-form-item>
      <el-form-item
        label="查询SQL"
        v-if="jdbcData.tableType=='dynamic'"
        prop="dbQuerySql"
        key="dbQuerySql">
        <el-input v-model="jdbcData.dbQuerySql" placeholder="请输入查询的sql"></el-input>
      </el-form-item>
      <p v-if="jdbcData.tableType=='dynamic'" style="margin:10px 0;margin-left:120px;">
        <el-popover placement="right" width="400" trigger="click">
          <div class="demoData">
            <h2 class="tipTitle">为了不采集重复数据,sql语句中禁止使用'='符号</h2>
            <h1 class="tipTitle" style="margin: 5px 0;">oracle示例：</h1>
            <p style="margin-left:10px; margin-bottom:5px;">
              <span style="margin-left:-10px;">1.</span>SELECT TABLE.*,TABLE.ROWNUM AS INCREMENTAL FROM TABLE > $@$
            </p>
            <p style="margin-left:10px; margin-bottom:5px;">
              <span style="margin-left:-10px;">2.</span>SELECT TO_CHAR(CREATETIME, 'YYYY-MM-DDHH24:MI:SS') AS INCREMENTAL,ID,MSG FROM FLUME_NG_SQL_SOURCE WHERE TO_CHAR(CREATETIME,'YYYY-MM-DDHH24:MI:SS') > $@$
            </p>
            <h1 class="tipTitle" style="margin: 5px 0;">mysql示例：</h1>
            <p style="margin-left:10px; margin-bottom:5px;">
              <span style="margin-left:-10px;">3.</span>SELECT @rowno:=@rowno+1 as INCREMENTAL, TABLE .* FROM TABLE
            </p>
            <p style="margin-left:10px;">
              <span style="margin-left:-10px;">4.</span>SELECT FLUME_NG_SQL_SOURCE.*,date_format(createTime,'%Y-%m-%d %H:%i:%s') as INCREMENTAL FROM FLUME_NG_SQL_SOURCE WHERE date_format(createTime,'%Y-%m-%d %H:%i:%s') > $@$
            </p>
          </div>
          <el-button slot="reference" size="small">查看动态SQL示例</el-button>
        </el-popover>
        <el-popover placement="right" width="400" trigger="click">
          <div class="demoData">
            <h2 class="tipTitle">为了不采集重复数据,sql语句中禁止使用'='符号</h2>
            <h1 class="tipTitle" style="margin: 5px 0;">oracle示例:</h1>
            <p>SELECT rownum as INCREMENTAL, $TABLE$.* FROM $TABLE$ WHERE rownum > $@$</p>
            <h1 class="tipTitle" style="margin: 5px 0;">mysql示例:</h1>
            <p>SELECT @rowno:=@rowno+1 as INCREMENTAL, $TABLE$.* FROM $TABLE$</p>
          </div>
          <el-button slot="reference" size="small" style="margin-left: 8px;">查看动态表示例</el-button>
        </el-popover>
      </p>
      <el-form-item
        v-if="jdbcData.tableType=='static'"
        label="table表"
        prop="dbTable"
        key="dbTable">
        <el-select
          v-model="jdbcData.dbTable"
          placeholder="请选择table表"
          style="display:flex"
          filterable
          allow-create>
          <el-option v-for="(item,index) in tableList" :key="index" :label="item" :value="item"></el-option>
        </el-select>
      </el-form-item>
      <el-row
        v-if="jdbcData.tableType=='dynamic'"
        style="border: 1px dashed #e1e1e1; padding: 15px 15px 0px 0;margin-bottom: 10px">
        <el-form-item v-if="jdbcData.tableType=='dynamic'" label="表名前缀">
          <el-input v-model="jdbcData.dbTable" placeholder="如果采集的table名每天动态变化,请输入表名前缀"></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="13">
            <el-form-item v-if="jdbcData.tableType == 'dynamic'" label="表名后缀">
              <el-input v-model="jdbcData.datetimeFormat" placeholder="请输入表名后缀时间格式"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item v-if="jdbcData.tableType == 'dynamic'" label="开始日期">
              <el-input v-model="jdbcData.startDate" placeholder="请输入开始日期"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="13">
            <el-form-item v-if="jdbcData.tableType == 'dynamic'" label="表属性">
              <el-select v-model="jdbcData.dateUnit" placeholder="请选择">
                <el-option
                  v-for="item in unitList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item v-if="jdbcData.tableType == 'dynamic'" label="表间隔">
              <el-input v-model="jdbcData.dateGap" placeholder="请输入表间隔"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-row>
      <el-form-item label="指定采集位置" v-if="jdbcData.tableType=='dynamic'">
        <el-row>
          <el-col :span="5" style="float: left">
            <el-select v-model="jdbcData.startFromType" placeholder="请选择类型">
              <el-option value="int" label="int"></el-option>
              <el-option value="string" label="string"></el-option>
            </el-select>
          </el-col>
          <el-col :span="18" style="float: right;">
            <el-input
              v-model="jdbcData.startFrom"
              placeholder="指定起始日期:2017-08-02 07:06:20; 指定起始行号:10"></el-input>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="字符编码" prop="sourceCharset">
        <el-select
          v-model="jdbcData.sourceCharset"
          clearable
          filterable
          allow-create
          placeholder="请选择"
          style="width: 100%">
          <el-option
            v-for="item in charsets"
            :key="item.value"
            :label="item.label"
            :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="查询间隔" prop="timeInterval">
        <el-input v-model.number="jdbcData.timeInterval" placeholder="请输入间隔时间(单位为ms)"></el-input>
      </el-form-item>
      <el-form-item class="extendBtn">
        <p style="text-align: center;" @click="extendBtn()">
          <i class="el-icon-caret-bottom" v-if="!down_top">展开</i>
          <i class="el-icon-caret-top" v-if="down_top">收起</i>
        </p>
      </el-form-item>
      <el-form-item label="日志源IP" v-if="down_top">
        <el-input v-model="jdbcData.clientIp" placeholder="请输入日志源IP" @blur="checkIP($event)"></el-input>
      </el-form-item>
      <el-form-item label="日志源设备类型" v-if="down_top">
        <el-select v-model="jdbcData.logType" placeholder="请选择" class="select" style="width: 100%">
          <el-option
            v-for="item in deviceTypes"
            :key="item.value"
            :label="item.label"
            :value="item.value"></el-option>
        </el-select>
      </el-form-item>
    </el-form>

    <el-row v-if="message===undefined" style="text-align:center;">
      <el-button size="small" custom type="primary" @click="save('jdbcData')">确定</el-button>
      <el-button size="small" custom @click="closeDialog('jdbcData', 'add')">取消</el-button>
    </el-row>
    <el-row v-if="message!==undefined" style="text-align:center;">
      <el-button size="small" custom type="primary" @click="edit_save('jdbcData')">保存</el-button>
      <el-button size="small" custom @click="closeDialog('jdbcData', 'edit')">取消</el-button>
    </el-row>
  </div>
</template>
<script>
import globalMixins from '@/mixins/globalMixins.js'
import dictionary from '@/views/manage/data/file-save/dictionary.js'
import service from './input-common-service.js'
export default {
  mixins: [globalMixins, service],
  props: {
    message: Object,
    sendMsg: Object
  },
  watch: {
    message: {
      handler (val, oldVal) {
        if (val !== undefined) {
          this.getcollectNode(val.uid)
          this.deptUid = val.uid
          for (var obj in val['data']) {
            if (obj === '3') {
              this.jdbcData = Object.assign(this.jdbcData, val['data'][obj])
            }
          }
        }
      },
      deep: true,
      immediate: true
    },
    sendMsg: {
      handler (val, oldVal) {
        if (val) {
          this.deptUid = val.uid
          if (val.data && val.type === 'jdbc') {
            this.jdbcData = Object.assign(this.jdbcData, val.data)
          }
        }
      },
      deep: true,
      immediate: true
    }
  },
  data () {
    var checkTime = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('间隔时间不能为空!'))
      }
      if (!Number.isInteger(value)) {
        callback(new Error('请输入数字值'))
      } else {
        if (value % 1000 !== 0) {
          callback(new Error('必须是1000的整数倍'))
        } else {
          callback()
        }
      }
    }
    var checkSql = function (rule, value, callback) {
      let idx = value.indexOf('WHERE') || value.indexOf('where')
      if (!value) {
        return callback(new Error('请输入查询的sql语句!'))
      } else if (idx > -1 && value.substr(idx + 5).includes('>=') | value.substr(idx + 5).includes('<=')) {
        callback(new Error('为了不采集重复数据，请只用“>”或者是“<”'))
      } else {
        callback()
      }
    }
    return {
      deptUid: '',
      down_top: false,
      deviceTypes: dictionary.deviceTypes,
      options: [],
      charsets: dictionary.charsets,
      jdbcData: {
        title: '',
        collectNodeIps: '',
        dbType: '',
        dbUrl: '',
        dbUser: '',
        dbPassword: '',
        dbQuerySql: '',
        dbTable: '',
        tableType: 'static',
        timeInterval: '',
        datetimeFormat: '',
        startDate: '',
        logType: '',
        sourceCharset: 'UTF-8',
        clientIp: '',
        startFrom: '',
        startFromType: 'int',
        dateGap: 1,
        dateUnit: 'day'
      },
      editfileData: {},
      rules: {
        title: [
          { required: true, message: '请输入标题名称', trigger: 'blur' }
        ],
        collectNodeIps: [
          { required: true, message: '请选择采集节点IP', trigger: 'change' }
        ],
        dbType: [
          { required: true, message: '请选择数据库类型', trigger: 'change' }
        ],
        dbUrl: [
          { required: true, message: '请输入数据库链接地址', trigger: 'blur' }
        ],
        dbUser: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        dbPassword: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        dbQuerySql: [
          { required: true, validator: checkSql, trigger: 'change' }
        ],
        dbTable: [
          { required: true, message: '请输入table表', trigger: 'change' }
        ],
        timeInterval: [
          { required: true, validator: checkTime, trigger: 'blur' }
        ],
        datetimeFormat: [
          { required: true, message: '请选择时间格式', trigger: 'change' }
        ],
        startDate: [
          { required: true, message: '请输入开始日期', trigger: 'blur' }
        ]
      },
      unitList: [{
        label: '年表',
        value: 'year'
      }, {
        label: '月表',
        value: 'month'
      }, {
        label: '日表',
        value: 'day'
      }],
      dbTypedata: [{
        value: 'db2',
        label: 'db2'
      }, {
        value: 'mysql',
        label: 'mysql'
      }, {
        value: 'oracle',
        label: 'oracle'
      }, {
        value: 'sqlserver',
        label: 'sqlserver'
      }, {
        value: 'postgresql',
        label: 'postgresql'
      }],
      tableList: [],
      fromDateFormats: [],
      isTest: false
    }
  },
  methods: {
    change (item) {
      if (item === 1) {
        this.sqlParam = false
        this.tableParam = true
      } else if (item === 2) {
        this.sqlParam = true
        this.tableParam = false
      }
    },
    save (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.isTest) {
            this.$emit('close', 1)
            this.$emit('change-data', [this.jdbcData, 'jdbc'])
          } else {
            this.showMessage('请验证链接是否可用!', 'warning')
          }
        } else {
          return false
        }
      })
    },
    edit_save (formName) {
      this.$refs[formName].validate((valid) => {
        var this_ = this
        if (valid) {
          if (this_.isTest) {
            this_.editfileData = {
              jobSerialNumber: this_.message['num'],
              collect: {
                collect_src_type: 3,
                jdbc: this_.jdbcData
              }
            }
            this_.$request({
              method: 'post',
              url: '/api/setting/etl/job/ui/collect-edit',
              data: this_.editfileData
            }).then((content) => {
              this_.$message({
                type: 'success',
                message: '修改成功'
              })
              this_.$emit('close', 1)
              this.$emit('change-data', [this.jdbcData, 'jdbc'])
            }, (error) => {
              console.log(error)
            })
          } else {
            this_.showMessage('请验证链接是否可用!')
          }
        } else {
          return false
        }
      })
    },
    gettableName () {
      var errorList = []
      this.$refs.jdbcData.validateField('dbType', function (e) {
        errorList.push(e)
      })
      this.$refs.jdbcData.validateField('dbUser', function (e) {
        errorList.push(e)
      })
      this.$refs.jdbcData.validateField('dbPassword', function (e) {
        errorList.push(e)
      })
      this.$refs.jdbcData.validateField('dbUrl', function (e) {
        errorList.push(e)
      })
      if (errorList[0] === '' && errorList[1] === '' && errorList[2] === '' && errorList[3] === '') {
        var param = {
          dbType: this.jdbcData.dbType,
          pwd: this.jdbcData.dbPassword,
          url: this.jdbcData.dbUrl,
          user: this.jdbcData.dbUser
        }
        this.getTable(param)
      }
    }
  },
  mounted () {
    if (this.message !== undefined) {
      this.getcollectNode(this.message.uid)
      for (var obj in this.message['data'][2]) {
        if (obj === '3') {
          this.jdbcData = this.message['data'][2][obj]
        }
      }
    }
  }
}
</script>

<style scoped lang="postcss">
#jdbc .el-form-item .el-input--small .el-input__inner {
  height: 40px;
  line-height: 40px;
}
.tipTitle {
  font-weight: bold !important;
}
.demoFont {
  font-size: 12px;
  color: #aaa;
  line-height: 20px;
}
.extendBtn >>> .el-form-item__content {
  margin-left: 0 !important;
}
</style>
