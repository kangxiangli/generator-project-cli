<template>
  <div class="idss-webshell">
    <svg
      id="图层_1"
      width="100%"
      height="100%"
      data-name="图层 1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 580 260">
      <defs></defs>
      <!-- <title>webshell</title> -->
      <rect class="cls-3" />
      <path
        class="cls-2"
        d="M450.83,216.78h-166c-44.66,0-81.21-36.07-81.21-80.15h0c0-44.08,36.55-80.15,81.21-80.15h166"
        transform="translate(0.5)"/>
      <line
        class="cls-2"
        x1="366"
        y1="135"
        x2="388"
        y2="135"/>
      <!-- 域名 -->
      <g
        style="cursor:pointer"
        name="domain"
        @click="domainSearch(data['domain'])">
        <title>{{data['domain']}}</title>
        <rect
          :class="fillClass[data.genre]"
          x="43.5"
          y="95.68"
          width="322.47"
          height="79.56"
          rx="39.78"
          ry="39.78"/>
        <text
          class="cls-6"
          x="204.735"
          y="145.46"
          text-anchor="middle">{{data['domain'].length > 19 ? data['domain'].substr(0,19)+'...' : data['domain']}}</text>
      </g>
      <!-- 总url数量 -->
      <g name="url">
        <text
          class="cls-5"
          x="452.63"
          y="29.58"
          text-anchor="middle">总URL数量</text>
        <rect
          class="cls-3 cls-url"
          x="386.83"
          y="37.18"
          width="131.6"
          height="37.44"
          rx="18.72"
          ry="18.72"/>
        <text
          class="cls-4"
          x="452.63"
          y="65.9"
          text-anchor="middle">{{data['totalUrl']}}</text>
      </g>
      <!-- 新页面数 -->
      <g name="page">
        <text
          class="cls-5"
          x="453.7"
          y="106.63"
          text-anchor="middle">疑似webshell页面</text>
        <rect
          class="cls-3"
          x="387.9"
          y="115.28"
          width="131.6"
          height="37.44"
          rx="18.72"
          ry="18.72"/>
        <text
          class="cls-4"
          x="453.7"
          y="144"
          text-anchor="middle">{{data['susWebPageCnt']}}</text>
      </g>
      <!-- 疑似webshell数量 -->
      <g name="number">
        <text
          class="cls-5"
          x="453.7"
          y="190.71"
          text-anchor="middle">疑似异常参数页面</text>
        <rect
          class="cls-3"
          x="387.9"
          y="198.06"
          width="131.6"
          height="37.44"
          rx="18.72"
          ry="18.72"/>
        <text
          class="cls-4"
          x="453.7"
          y="226.78"
          text-anchor="middle">{{data['susExcParamPageCnt']}}</text>
      </g>
    </svg>
  </div>
</template>
<script>
export default {
  name: 'idss-webshell-svg',
  props: ['data'],
  data () {
    return {}
  },
  methods: {
    domainSearch (type) {
      this.$emit('search', type)
    }
  },
  created () {
    this.fillClass = {
      0: 'low-fill',
      1: 'medium-fill',
      2: 'high-fill',
      3: 'emergency-fill'
    }
  }
}
</script>

<style scoped lang="postcss">
.idss-webshell {
  height: 180px;
  background: rgba(246, 249, 255, 1);
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
.cls-2 {
  fill: none;
}

.cls-2,
.cls-3 {
  stroke: #ccc;
  stroke-miterlimit: 10;
  stroke-width: 0.5px;
}

.cls-3 {
  fill: #dfe2ee;
}

.cls-4 {
  font-size: 23.4px;
  fill: #333;
  font-family: STHeitiSC-Light, Heiti SC;
}

.cls-5 {
  font-size: 15.21px;
  fill: #666;
}

.cls-5,
.cls-6 {
  font-family: STHeitiSC-Medium, Heiti SC;
}

.cls-6 {
  font-size: 21.06px;
  fill: #fff;
  font-weight: 600;
}
.cls-url {
  fill: #fff !important;
}
</style>
