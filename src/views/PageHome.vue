<!--
Author: zusheng
Date: 2022-04-11 18:23:23
LastEditTime: 2022-04-12 13:19:53
Description: 主页
FilePath: \vite-music-player\src\views\PageHome.vue
-->
<script setup lang="ts">
import SectionListGrid from '@/components/SectionListGrid.vue'

// TODO 加载完成后回调，后期做全局加载进度条时用
const sectionOnload = (payload: any) => {}
</script>

<template>
  <div id="page-home" class="spacing">
    <section-list-grid
      @onload="sectionOnload"
      sectionTitle="为你推荐"
      :playBtn="true"
      action="recommends"
    />
    <section-list-grid
      @onload="sectionOnload"
      sectionTitle="社区精选"
      :playBtn="true"
      action="communitys"
    />
    <section-list-grid
      @onload="sectionOnload"
      sectionTitle="推荐的MV"
      :playBtn="true"
      action="mvs"
    />
    <section-list-grid
      @onload="sectionOnload"
      sectionTitle="热门歌手"
      :playBtn="false"
      :round="true"
      action="HotArtists"
    />
  </div>
</template>

<style lang="less">
</style>
