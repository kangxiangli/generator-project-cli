<template>
  <!-- 剖面图 -->
  <div class="bar-profile">
    <!-- 按钮 -->
    <el-row>
      <el-button size="small" custom
        @click="profileDay"
        :class="{active: unit === 'd'}">天</el-button>
      <el-button size="small" custom
        @click="profileWeek"
        :class="{active: unit === 'w'}">周</el-button>
      <el-button size="small" custom
        @click="profileMonth"
        :class="{active: unit === 'M'}">月</el-button>
    </el-row>
    <!-- 每个色块 -->
    <a href="javascript:void(0)"
      class="bar-profile__item"
      v-for="(item,index) in timeLine"
      :key="index"
      @click="profileClick(item, index)"
      :class="gradeColor[item.value]">
      <!-- tip -->
      <div class="bar-profile__tip" v-if="item.value">
        <div class="bar-profile__tip-innder">
          <div>{{item.name}}</div>
        </div>
      </div>
    </a>
  </div>
</template>
<script>
export default {
  name: 'idss-bar-profile',
  props: [
    'timeUnit',
    'timeLine'
  ],
  watch: {
    'timeUnit': function (val, oldVal) {
      this.unit = val
    }
  },
  data () {
    return {
      unit: 'M',
      // 等级颜色
      gradeColor: [
        'normal',       // 正常
        'low',          // 低
        'medium',       // 中
        'high',         // 高
        'emergency'     // 危急
      ]
    }
  },
  methods: {
    // 扑面图
    profileClick (item, index) {
      this.$emit('profileClick', item, index)
    },
    // 天
    profileDay () {
      this.unit = 'd'
      this.$emit('profileDayClick')
    },
    // 周
    profileWeek () {
      this.unit = 'w'
      this.$emit('profileWeekClick')
    },
    // 月
    profileMonth () {
      this.unit = 'M'
      this.$emit('profileMonthClick')
    }
  },
  mounted () {
    this.unit = this.timeUnit
  }
}
</script>
<style scoped lang="postcss">
  .bar-profile {
    display: flex;
    width: 100%;
    height: 18px;

    /* 等级 */
    & .normal {
      background: var(--insight-component-box-icon-color);
    }

    & .emergency {
      background: var(--color-emergency);
    }

    & .high {
      background: var(--color-high);
    }

    & .medium {
      background: var(--color-medium);
    }

    & .low {
      background: var(--color-low);
    }

    & .el-row {
      font-size: 0;
      margin-right: 15px;
      margin-top: -4px;
    }

    /* 按钮选中 */
    & .active {
      color: #409eff;
      border: 1px solid #409eff57;
      background: linear-gradient(#eeeeee63,#f6f6f6);
    }
  }

  .bar-profile__item {
    position: relative;
    flex: 1;

    &:hover .bar-profile__tip{
      bottom: 100%;
      visibility: visible;
      opacity: 1;
      z-index: 999;
     }
  }

  /* tip */
  .bar-profile__tip {
    position: absolute;
    right: 0;
    bottom: calc(100% - 10px);
    width: 254px;
    transition: all .2s ease;
    visibility: hidden;
    opacity: 0;

    & .bar-profile__tip-innder {
      padding: 5px 10px;
      margin-bottom: 10px;
      border-radius: 2px;
      background: rgba(0, 0, 0, .8);
      color: #fff;
    }
  }
</style>
