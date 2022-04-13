<!--
Author: zusheng
Date: 2022-04-11 18:23:23
LastEditTime: 2022-04-13 09:36:25
Description: 主页
FilePath: \vite-music-player\src\views\PageHome.vue
-->
<script setup lang="ts">
import SectionListGrid from '@/components/SectionListGrid.vue'

// TODO 加载完成后回调，后期做全局加载进度条时用
const onloadArr: Array<string> = []
const sectionOnload = (payload: any) => {
  if (!payload) {
    onloadArr.push('')
  } else {
    onloadArr.shift()
  }
  // console.log(onloadArr.length)
}
</script>

<template>
  <div id="page-home" class="spacing">
    <section-list-grid
      @onload="sectionOnload"
      sectionTitle="为你推荐"
      subTitle="精选歌单"
      :playBtn="true"
      action="recommends"
    />
    <section-list-grid
      @onload="sectionOnload"
      sectionTitle="官方推荐"
      subTitle="高品质歌单"
      :playBtn="true"
      action="PlaylistHq"
    />
    <section-list-grid
      @onload="sectionOnload"
      sectionTitle="专辑"
      subTitle="新发行"
      :playBtn="true"
      action="NewAlbum"
    />
    <section-list-grid
      @onload="sectionOnload"
      sectionTitle="社区精选"
      subTitle="精选歌单"
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
    <section-list-grid
      @onload="sectionOnload"
      sectionTitle="播客"
      :playBtn="true"
      action="RecommendsDj"
    />
    <section-list-grid
      @onload="sectionOnload"
      sectionTitle="电台节目"
      :playBtn="true"
      action="RecommendsDjp"
    />
    <section-list-grid
      @onload="sectionOnload"
      sectionTitle="独家放送"
      subTitle="电台"
      :playBtn="true"
      :more="true"
      action="RecommendsPrivate"
      :actionParams="{ limit: 6 }"
    />
  </div>
</template>

<style lang="less">
</style>
