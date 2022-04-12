<!--
Author: zusheng
Date: 2022-04-10 21:10:50
LastEditTime: 2022-04-12 11:29:36
Description: 默认布局
FilePath: \vite-music-player\src\views\LayoutDefault.vue
-->
<script lang="ts" setup>
import TheNavigationLeft from '@/components/TheNavigationLeft.vue'
import TheHeader from '@/components/TheHeader.vue'
</script>


<template>
  <div id="default-layout">
    <!-- 左侧导航栏 -->
    <the-navigation-left />

    <main id="main">
      <!-- 头部 -->
      <the-header />

      <router-view />

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
