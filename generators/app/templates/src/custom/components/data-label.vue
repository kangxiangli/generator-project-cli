<template>
  <div class="idss-data-label" :class="{'is-stretch': stretch, active}">
    <!-- lable -->
    <div v-if="label" class="label-wrapper" :style="{'width': labelWidth}">
      <label>{{label}}</label>
    </div>
    <!-- item -->
    <div v-for="(item, index) in coreData" :key="item.name"
      class="content-wrapper"
      :class="{'is-white': backgroundColor}"
      :style="{'width': itemWidth, 'background-color': backgroundColor}">
      <!-- title 兼容 -->
      <slot name="title" v-if="$scopedSlots.title" :index="index" :item="item"></slot>
      <span class="title">{{item.name}}</span>
      <!-- value 兼容 -->
      <slot name="value" v-if="$scopedSlots.value" :index="index" :item="item"></slot>
      <span class="value"
        v-else
        :style="{'color': valueColor || item.color}">
        {{item.value}}
      </span>
    </div>

    <div v-show="active" class="arrow"></div>
  </div>
</template>
<script>
/**
   * Created by Yangxuejing on 2018/10/23.
   * 数据标签
   */

export default {
  name: 'idss-data-label',
  props: {
    // 表示该label为active状态
    active: Boolean,
    hover: Boolean,
    data: {
      type: [Object, Array],
      default () { return {} }
    },
    label: {
      type: String,
      default: ''
    },
    stretch: {
      type: Boolean,
      default: false
    },
    labelWidth: {
      type: String,
      default: ''
    },
    itemWidth: {
      type: String,
      default: ''
    },
    valueColor: {
      type: String,
      default: ''
    },
    backgroundColor: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      coreData: Array.isArray(this.data) ? this.data : [this.data]
    }
  },
  created () {
    console.log(this)
  }
}
</script>

<style scoped lang="postcss">
  .idss-data-label {
    position: relative;
    display: inline-flex;
    justify-content: center;
    background-color: var(--dataLabel-bg-color);
    border: var(--dataLabel-border);

    /* active 与 hover 状态 */
    &.active,&:hover {
      background-color: var(--color-info-extra);
      color: #fff;
    }

    &.is-stretch {
      width: 100%;
    }

    .label-wrapper {
      display: inline-flex;
      align-items: center;
      justify-content: flex-end;
      position: relative;
      padding: 0 20px;
      font-size: 1.4rem;
      font-weight: bold;
      background-color: var(--dataLabel-label-bg-color);
      border-right: var(--dataLabel-border);

      &:before {
        content: "";
        position: absolute;
        top: 50%;
        right: -5px;
        width: 8px;
        height: 8px;
        background-color: inherit;
        transform-origin: 50%;
        transform: translateY(-50%) rotate(45deg);
        border-top: var(--dataLabel-border);
        border-right: var(--dataLabel-border);
      }
    }

    .content-wrapper {
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      flex: auto;
      padding: 15px 20px;

      &.is-white {
        color: #fff;
      }

      .title {
        font-size: 1.4rem;
        padding-bottom: 10px;
      }

      .value {
        font-size: 2.4rem;
        font-weight: bold;
      }
    }

    /* active 下的箭头，当前只在正下方显示，后期可以扩展为4个方向都可以显示 */
    & .arrow {
      position: absolute;
      bottom: -16px;
      border: 8px solid transparent;
      border-top-color: var(--color-info-extra);
    }
  }
</style>
