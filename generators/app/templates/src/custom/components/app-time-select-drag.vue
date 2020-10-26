<template>
  <div
    class="app-time-select-drag-container"
    ref="dragContainer"
    v-isDrag="{right: 10, bottom: 10, disabled: timeSelectVisible}">
    <div class="time-handlebar" v-show="!timeSelectVisible" @click="clickHandlebar">
      <idss-icon-svg class="clock" name="clocks"></idss-icon-svg>
    </div>
    <div class="time-select-container" v-show="timeSelectVisible">
      <el-tabs v-model="currentTabs" tab-position="left">
        <el-tab-pane v-if="noTimeRange" label="无需时间间隔" name="noTimeRange">
          <div>查询条件不依赖时间范围。</div>
        </el-tab-pane>
        <el-tab-pane label="快捷时间" name="quick">
          <el-row>
            <el-col :span="10">
              <div class="idss_time_select_quick_box quick_box_left">
                <el-button
                  :class="{actived: quickTime.activeKey === time.key }"
                  v-for="time in quickTime.abs"
                  :key="time.name"
                  type="text"
                  size="small"
                  @click="quickSelect(time, 'absolute')">{{time.name}}</el-button>
              </div>
            </el-col>
            <el-col :span="14">
              <div class="idss_time_select_quick_box quick_box_right">
                <el-button
                  :class="{actived: quickTime.activeKey === time.key }"
                  v-for="time in quickTime.last"
                  :key="time.name"
                  type="text"
                  size="small"
                  @click="quickSelect(time, 'relative')">{{time.name}}</el-button>
              </div>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="相对时间间隔" name="relative">
          <span>从</span>
          <el-input-number
            v-model="oppositeTimeInterval"
            size="small"
            style="width: 120px;"
            :min="1"></el-input-number>
          <el-select v-model="oppositeTimeUnit" size="small" style="width: 100px;">
            <el-option
              v-for="(val, key) in oppositeTimeUnitArray"
              :key="key"
              :label="val"
              :value="key"></el-option>
          </el-select>
          <span>前 - 现在</span>
        </el-tab-pane>
        <el-tab-pane label="绝对时间间隔" name="absolute">
          <el-form
            label-width="80px"
            :model="absoluteForm"
            :rules="absoluteFormRule"
            ref="absolute">
            <el-form-item label="开始时间" prop="start">
              <el-date-picker
                popper-class="idss-time-date-picker-container"
                v-model="absoluteForm.start"
                :picker-options="absoluteStartOption"
                default-time="00:00:00"
                type="datetime"
                size="small"
                placeholder="选择开始日期时间"></el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间" prop="end">
              <el-date-picker
                popper-class="idss-time-date-picker-container"
                v-model="absoluteForm.end"
                :picker-options="absoluteEndOption"
                default-time="23:59:59"
                type="datetime"
                size="small"
                placeholder="选择结束日期时间"></el-date-picker>
              <el-button type="text" size="small" @click="absoluteForm.end = new Date()">此刻</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <div class="idss-time-select__btns">
          <el-button size="small" custom @click="close">取消</el-button>
          <!-- 这里的timeChanged()加上括号 是为了不接收默认的 event 参数  -->
          <el-button size="small" custom v-show="currentTabs !== 'quick'" @click="confirm">确认</el-button>
        </div>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import timeMixins from './app-time-select.js'
import { Bus, EventName } from '@bus'
export default {
  name: 'idss-time-select-drag',
  mixins: [timeMixins],
  data () {
    return {
      timeSelectVisible: false,
      lastCoords: {}
    }
  },
  methods: {
    async clickHandlebar () {
      let el = this.$refs.dragContainer
      // 拖拽过程中，不触发click事件
      if (el.getAttribute('dragging') === 'yes') return

      this.lastCoords.left = el.offsetLeft
      this.lastCoords.top = el.offsetTop

      this.timeSelectVisible = true
      await this.$nextTick()
      // 触发DRAG_RESIZE事件
      Bus.$emit(EventName.DRAG_RESIZE)
    },
    close () {
      this.timePopoverVisible = false
      this.timeSelectVisible = false
      let el = this.$refs.dragContainer
      el.style.left = `${this.lastCoords.left}px`
      el.style.top = `${this.lastCoords.top}px`
    },
    confirm () {
      this.close()
      this.timeChanged()
    }
  }
}
</script>
<style scoped lang="postcss">
.idss-time-select-display {
  --time-select-font-color: var(--color-font-2);
  --time-select-border: var(--color-line-default) solid var(--line-size-default);
  /* --time-select-disabled-color: var(--color-font-disabled);
  --time-select-disabled-border-color: var(--color-line-default); */
  --time-select-display-bg: var(--color-bg-5);
  display: inline-flex;
  align-items: center;
  height: 32px;
  line-height: 32px;
  font-size: 14px;
  background-color: var(--time-select-display-bg);
  border: var(--time-select-border);
  color: var(--time-select-font-color);
  padding: 0 10px;
  border-radius: 3px;
  cursor: pointer;
  width: inherit;

  & > span {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  & div {
    display: inline-block;
    height: 22px;
    line-height: 22px;
    margin-right: 5px;
    padding-right: 5px;
    border-right: var(--time-select-border);
  }
}

.app-time-select-drag-container {
  --time-select-popover-bg: var(--color-bg-5);
  --time-select-popover-border: var(--color-line-default) solid var(--line-size-default);
  --time-select-el-button-color: var(--color-font-2);
  --time-select-el-button-color-hover: var(--color-font-6);
  --time-select-el-tabs-item-border: var(--color-line-default) solid var(--line-size-m);
  --time-select-el-tabs-item-color-hover: var(--color-font-6);
  --time-select-el-tabs-item-color-active: var(--color-font-6);
  & .time-handlebar {
    width: 40px;
    height: 40px;
    font-size: 32px;
    text-align: center;
    border-radius: 3px;
    background: linear-gradient(
      1turn,
      rgba(40, 40, 40, 0.7),
      rgba(13, 13, 13, 0.7)
    );
    cursor: pointer;
    & .clock {
      width: 1.1em;
      height: 1.1em;
      vertical-align: -0.2em;
      fill: rgba(255, 255, 255, 0.6);
    }
  }
  & .time-handlebar:hover {
    background: linear-gradient(1turn, #937e41, #ebd394);
    & .clock {
      fill: rgba(255, 255, 255, 0.8);
    }
  }
  & .time-select-container {
    width: 454px;
    background-color: rgba(59, 59, 59, 0.8);
    color: var(--color-font-5);
    padding: 10px;
    & >>> .el-tabs__item {
      color: var(--color-font-5);
    }
    & >>> .el-tabs__item.is-active {
      color: #409eff;
    }
    & .idss-time-select__btns {
      text-align: right;
      margin-top: 20px;
    }
    & >>> .el-tab-pane[aria-labelledby="tab-absolute"] .el-form-item__label {
      color: #f6f6f6;
    }
  }
}
.time-select-container {
  & .el-tabs__item {
    color: var(--time-select-el-tabs-item-color);
  }
  & .el-tabs__item:hover {
    color: var(--time-select-el-tabs-item-hover);
  }
  & > .el-button.actived {
    color: var(--time-select-el-button-color-hover);
  }
  & .el-tabs__item.is-active {
    color: var(--time-select-el-tabs-item-active);
  }

  & .idss_time_select_quick_box {
    display: flex;
    flex-wrap: wrap;

    & > .el-button {
      text-align: left;
      margin: 0 5px;
      color: #f6f6f6;
    }

    & > .el-button:hover {
      color: var(--time-select-el-button-color-hover);
    }

    & > .el-button.actived {
      color: var(--time-select-el-button-color-hover);
    }
    &.quick_box_left > .el-button {
      width: 50px;
    }

    &.quick_box_right > .el-button {
      width: 70px;
    }
  }
  .el-date-editor--datetimerange {
    width: 100%;
  }
  .idss-time-select-popover-line {
    margin: 5px 0;
  }
}
/* .time-select-container .el-date-editor--datetimerange {
  width: 100%;
}

.idss-time-select-popover .idss-time-select-popover-line {
  margin: 5px 0;
} */

.idss-time-select__btns {
  margin-top: 10px;
  text-align: right;
}
</style>
<style lang="postcss">
.idss-time-date-picker-container {
  & .el-time-panel.el-popper {
    width: 156px;
  }
}
</style>
