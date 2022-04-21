<!--
Author: zusheng
Date: 2022-04-13 18:39:01
LastEditTime: 2022-04-21 11:53:47
Description: 标题组件，可选更多
FilePath: \vite-music-player\src\components\SectionTitle.vue
-->
<script lang="ts" setup>
defineProps<{
  sectionTitle: string
  subTitle?: string
  actionName: string | null
}>()
</script>

<template>
  <!-- 大标题 -->
  <div class="section-title">
    <div class="section-title-content">
      <p class="section-title-sub" v-if="subTitle">{{ subTitle }}</p>
      <h2 class="section-title-h2">{{ sectionTitle }}</h2>
    </div>
    <router-link
      v-if="actionName"
      class="section-title-more"
      :to="{
        name: 'more',
        query: {
          action: actionName
        }
      }"
      v-text="'查看更多'"
    />
  </div>
</template>

<style lang="less" scoped>
.section-title {
  width: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  padding: 16px 0 8px;
  .section-title-content {
    .section-title-h2 {
      font-size: 28px;
      font-weight: 700;
      line-height: calc(28px * 1.6);
    }
    .section-title-sub {
      font-size: 16px;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.45);
    }
  }
  .section-title-more {
    font-size: 16px;
    margin-left: 16px;
    font-weight: 400;
    line-height: calc((28px * 1.6) - 8px);
    color: rgba(0, 0, 0, 0.8);
    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
