<template>
  <div class="bullseye-container">
    <div class="bullseye-container__title">{{data.title}}</div>
    <div class="bullseye-container__content">{{data.value || 0}}</div>
  </div>
</template>
<script>
export default {
  name: 'idss-bullseye',
  props: {
    data: {
      type: Object,
      default () {
        return {
          title: '',
          value: 0
        }
      }
    }
  }
}
</script>
<style scoped lang="postcss">
  .bullseye-container {
    /* @fixme 待优化 */
    --bullseye-title-color: var(--bullseye-content-bg-color);
    --bullseye-content-bg-color: rgba(51, 204, 204, 1);
    --bullseye-content-bg-color1: rgba(51, 204, 204, 0.4);
    --bullseye-content-bg-color2: rgba(51, 204, 204, 0.2);
    --bullseye-content-font-color: #fff;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    margin-bottom: 40px;
    padding-bottom: 40px;
    &__title {
      text-align: center;
      padding: 4px 0;
      /* 标题最小宽度为 120px */
      min-width: 120px;
      line-height: 28px;
      margin-bottom: 50px;
      font-weight: bolder;
      font-size: 3rem;
      color: var(--bullseye-title-color);
    }
    &__content {
      flex: 1 1 auto;
      border-radius: 50%;
      /* 根据标题的最小宽度设置 */
      min-width: 120px;
      background-color: var(--bullseye-title-color);
      text-align: center;
      line-height: 120px;
      vertical-align: middle;
      margin: 20px auto;
      font-size: 4rem;
      color: var(--bullseye-content-font-color);
      font-weight: bolder;
      box-shadow: 0 0 0 30px var(--bullseye-content-bg-color1),
                  0 0 0 60px var(--bullseye-content-bg-color2);
    }
  }
</style>
