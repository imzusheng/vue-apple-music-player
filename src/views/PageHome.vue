<!--
Author: zusheng
Date: 2022-04-11 18:23:23
LastEditTime: 2022-04-21 00:12:02
Description: 主页
FilePath: \vite-music-player\src\views\PageHome.vue
-->
<script setup lang="ts">
import SectionListGrid from '@/components/SectionListGrid.vue'
import { useStore } from '@/store'

const store = useStore()
store.commit('setLoading', true)
const befDate = Date.now()

// TODO 加载完成后回调，后期做全局加载进度条时用
const onloadArr: Array<string> = []
const sectionOnload = (payload: any) => {
  if (!payload) {
    onloadArr.push('')
  } else {
    onloadArr.shift()
    if (onloadArr.length === 0) {
      if (Date.now() - befDate < 400)
        setTimeout(() => store.commit('setLoading', false), 400)
      else store.commit('setLoading', false)
    }
  }
}
</script>

<template>
  <div id="page-home" class="spacing">
    <section-list-grid
      @onload="sectionOnload"
      sectionTitle="为你推荐"
      subTitle="精选歌单"
      :playBtn="true"
      :actionParams="{ limit: 7 }"
      action="recommends"
    />
    <section-list-grid
      @onload="sectionOnload"
      sectionTitle="官方推荐"
      subTitle="高品质歌单"
      :playBtn="true"
      :actionParams="{ limit: 7 }"
      action="PlaylistHq"
    />
    <section-list-grid
      @onload="sectionOnload"
      sectionTitle="专辑和单曲"
      subTitle="新发行"
      :playBtn="true"
      :actionParams="{ limit: 7 }"
      action="NewAlbum"
    />
    <section-list-grid
      @onload="sectionOnload"
      sectionTitle="社区精选"
      subTitle="精选歌单"
      :playBtn="true"
      :actionParams="{ limit: 7 }"
      action="communitys"
    />
    <!-- <section-list-grid
      @onload="sectionOnload"
      sectionTitle="推荐的MV"
      :playBtn="true"
      action="mvs"
    /> -->
    <section-list-grid
      @onload="sectionOnload"
      sectionTitle="热门歌手"
      :playBtn="false"
      :round="true"
      :actionParams="{ limit: 7 }"
      action="HotArtists"
    />
    <section-list-grid
      @onload="sectionOnload"
      subTitle="个性推荐"
      sectionTitle="电台"
      :playBtn="true"
      :actionParams="{ limit: 7 }"
      action="RecommendsDj"
    />
    <section-list-grid
      @onload="sectionOnload"
      subTitle="个性推荐"
      sectionTitle="电台节目"
      :playBtn="true"
      :actionParams="{ limit: 7 }"
      action="HotDjp"
    />
    <section-list-grid
      @onload="sectionOnload"
      subTitle="热门"
      sectionTitle="电台节目"
      :playBtn="true"
      :actionParams="{ limit: 7 }"
      action="RecommendsDjp"
    />
  </div>
</template>

<style lang="less">
</style>
