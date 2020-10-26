<template>
  <div class="indicator-color-view__container" :style="{'min-width': `${labelWidth + 260}px`}">
    <div class="indicator-color-view__nodata" v-if="!data || (Array.isArray(data) && !data.length)">
      <span>暂无数据</span>
    </div>
    <el-form class="indicator-color-view__content" v-else :label-width="`${labelWidth}px`" plain>
      <el-form-item :class="{'is-item-color': isItemColor}" v-for="(item, index) in data" :label="`${item.name}：`"  :key="index">
        <div class="box-color">
          <span class="color first-color" :class="[{'is-highlight': item.value === 0}]"></span>
          <span class="color second-color" :class="[{'is-highlight': item.value === 1}]"></span>
          <span class="color third-color" :class="[{'is-highlight': item.value === 2}]"></span>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  name: 'indicator-color-view',
  props: {
    data: {
      type: Array,
      default: null
    },
    isItemColor: {
      type: Boolean,
      default: true
    },
    labelWidth: {
      type: Number,
      default: 200
    }
  }
}
</script>
<style scoped lang="postcss">
  .indicator-color-view {
    /* @fixme待优化 */
    --color-success: #66ccff; /* 成功状态的颜色 */
    --color-warning: #e6a23c; /* 告警状态的颜色 */
    --color-error: #f56c6c; /* 失败状态的颜色 */
    --color-info: #909399;
    &__container {
      box-sizing: border-box;
    }
    &__nodata {
      width: 100%;
      height: 100%;
      text-align: center;
      position: relative;
      padding-top: 40%;
    }
    &__content {
      >>> .el-form-item {
        margin-bottom: 10px;
      }
      .is-item-color {
        background-color: var(--color-font-5);
      }
      >>> .el-form-item__label {
        color: var(--color-font-default);
        display: inline-block;
        padding: 13px 0;
        border: var(--border-default);
      }
      .box-color{
        min-width: 260px;
        border: var(--border-default);
        text-align: center;
        padding: 0 20px;
        box-sizing: border-box;
        line-height: 4.2;
      }
      .color {
        height: 30px;
        width: 30px;
        border-radius: 50%;
        display: inline-block;
        margin: 0 20px;
        vertical-align: middle;
        opacity: 0.2;
      }
      .first-color {
        background-color: var(--color-success);
      }
      .second-color {
        background-color: var(--color-warning);
      }
      .third-color {
        background: var(--color-error);
      }
    }
  }

  @keyframes colorAnimate
  {
    0%, 100% {opacity: 1;}
    50% {opacity: 0.2;}
  }
  .is-animate {
    animation: colorAnimate 2s linear 1s infinite;
  }
  .indicator-color-view__container .box-color span.is-highlight {
    opacity: 1;
  }
</style>
