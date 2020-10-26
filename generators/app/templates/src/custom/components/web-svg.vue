<template>
  <div class="web-svg">
    <svg
      id="图层_2"
      width="100%"
      height="100%"
      data-name="图层 2"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 580 260">
      <!-- 去掉是因为 鼠标hover的时候显示这个值 -->
      <path
        class="cls-1"
        d="M510.73,216.78H385.9c-33.6,0-61.08-36.07-61.08-80.15h0c0-44.08,27.48-80.15,61.08-80.15H510.73"
        transform="translate(0.5)"/>
      <path
        class="cls-1"
        d="M79,216.78H205.24c34,0,61.76-36.07,61.76-80.15h0c0-44.08-27.79-80.15-61.76-80.15H79"
        transform="translate(0.5)"/>

      <!-- 模型异常告警 -->
      <g name="scan_ip_num">
        <rect class="cls-2" x="463" y="38" width="98" height="37.44" rx="18.72" ry="18.72" />
        <text
          class="cls-3"
          x="512"
          y="59.72"
          text-anchor="middle"
          dominant-baseline="middle">{{data['modelExcWarnCnt']}}</text>
        <text class="cls-4" x="465" y="30">模型异常告警</text>
      </g>

      <!-- C段模型异常告警 -->
      <g name="scan_ipc_num">
        <rect class="cls-2" x="463" y="115" width="98" height="37.44" rx="18.72" ry="18.72" />
        <text
          class="cls-3"
          x="512"
          y="137.72"
          text-anchor="middle"
          dominant-baseline="middle">{{data['cSegmodelExcWarnCnt']}}</text>
        <text class="cls-4" x="453" y="107">C段模型异常告警</text>
      </g>

      <!-- 爬虫IP C段数量 -->
      <!-- <g name="spider_ipc_num">
    <rect class="cls-2" x="463" y="198" width="98" height="37.44" rx="18.72" ry="18.72"/>
    <text class="cls-3" x="512" y="220.72" text-anchor="middle" dominant-baseline="middle">{{data['spider_ipc_num']}}</text>
    <text class="cls-4" x="463" y="192">爬虫IP c段数量</text>
      </g>-->

      <!-- 展示IP C段数量 -->
      <g name="ipc_num">
        <rect class="cls-2" x="18.72" y="37.18" width="98" height="37.44" rx="18.72" ry="18.72" />
        <text class="cls-3" x="67.72" y="64" text-anchor="middle">{{data['ruleExcWarnCnt']}}</text>
        <text class="cls-4" x="22.72" y="30">规则异常告警</text>
      </g>

      <!-- C段模型标签数量 -->
      <g name="ip_num">
        <rect class="cls-2" x="463" y="198" width="98" height="37.44" rx="18.72" ry="18.72" />
        <text
          class="cls-3"
          x="512"
          y="219.78"
          text-anchor="middle"
          dominant-baseline="middle">{{data['cSegmodelLabelCnt']}}</text>
        <text class="cls-4" x="453" y="191">C段模型标签数量</text>
        <rect class="cls-2" x="18.72" y="115.28" width="98" height="37.44" rx="18.72" ry="18.72" />
        <text class="cls-3" x="67.72" y="144" text-anchor="middle">{{data['cSegRuleExcWarnCnt']}}</text>
        <text class="cls-4" x="16.72" y="107">C段规则异常告警</text>
      </g>

      <!-- C段情报匹配数量 -->
      <g name="spider_num">
        <rect
          class="cls-2"
          x="18.72"
          y="198.06"
          width="98.97"
          height="37.44"
          rx="18.72"
          ry="18.72"/>
        <text
          class="cls-3"
          x="67.72"
          y="219.78"
          text-anchor="middle"
          dominant-baseline="middle">{{data['cSegIntellMatchCnt']}}</text>
        <text class="cls-4" x="69.01" y="191" text-anchor="middle">C段情报匹配数量</text>
      </g>

      <g style="cursor:pointer" name="domain" @click="domianSearch(data['ip'])">
        <title>{{data['ip']}}</title>
        <line class="cls-1" x1="128" y1="134" x2="463.6" y2="135" />
        <rect
          :class="fillClass[data.genre]"
          x="140"
          y="95.68"
          width="300.53"
          height="79.56"
          rx="39.78"
          ry="39.78"/>
        <text
          class="cls-6"
          x="290.76"
          y="135.46"
          text-anchor="middle"
          dominant-baseline="middle">{{data['ip'].length > 17 ? data['ip'].substr(0,17)+'...' : data['ip']}}</text>
      </g>

      <rect class="cls-5" width="580" height="260" />
    </svg>
  </div>
</template>
<script>
export default {
  name: 'idss-web-svg',
  props: ['data'],
  data () {
    return {
      fillClass: {
        0: 'low-fill',
        1: 'medium-fill',
        2: 'high-fill',
        3: 'emergency-fill'
      }
    }
  },
  methods: {
    domianSearch (param) {
      this.$emit('search', param)
    }
  }
}
</script>

<style scoped lang="postcss">
.web-svg {
  height: 180px;
  background: rgba(246, 249, 255, 1);
  border: 1px solid rgba(227, 230, 240, 1);
}
.emergency-fill {
  fill: var(--color-emergency);
}
.high-fill {
  fill: var(--color-high);
}
.medium-fill {
  fill: var(--color-medium);
}
.low-fill {
  fill: #2cc5ff;
}
.cls-1,
.cls-5 {
  fill: none;
}

.cls-1,
.cls-2 {
  stroke: #ccc;
  stroke-miterlimit: 10;
  stroke-width: 0.5px;
}

.cls-2 {
  fill: #fff;
}

.cls-3 {
  font-size: 19.4px;
  fill: #333;
  font-family: STHeitiSC-Light, Heiti SC;
}

.cls-4 {
  font-size: 15.21px;
  fill: #666;
}

.cls-4,
.cls-6 {
  font-family: STHeitiSC-Medium, Heiti SC;
}

.cls-6 {
  font-size: 23.06px;
  fill: #fff;
  font-weight: 600;
}
</style>
