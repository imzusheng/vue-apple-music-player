<!--
Author: zusheng
Date: 2022-04-10 21:10:50
LastEditTime: 2022-04-12 15:29:44
Description: 默认布局
FilePath: \vite-music-player\src\views\LayoutDefault.vue
-->
<script lang="ts" setup>
import TheNavigationLeft from '@/components/TheNavigationLeft.vue'
import TheHeader from '@/components/TheHeader.vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const viewKey = computed(() => {
  const payload = route.query.payload ?? ''
  return Date.now().toString() + payload
})
</script>


<template>
  <div id="default-layout">
    <!-- 左侧导航栏 -->
    <the-navigation-left />

    <main id="main">
      <!-- 头部 -->
      <the-header />

      <router-view v-slot="{ Component }" :key="viewKey">
        <component :is="Component" />
      </router-view>

      <!-- 播放器 -->
      <div id="player"></div>
    </main>
  </div>
</template>

<style lang="less">
#default-layout {
  width: 100%;
  min-height: 100vh;
  display: flex;

  #main {
    width: 100%;
    padding-left: 240px;
    position: relative;

    #player {
      width: 100%;
      height: 72px;
      position: fixed;
      bottom: 0;
      right: 0;
      border-top: 1px solid rgba(0, 0, 0, 0.1);
    }
  }
}
</style>
