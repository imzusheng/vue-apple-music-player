<!--
Author: zusheng
Date: 2022-04-11 18:23:23
LastEditTime: 2022-04-12 12:11:05
Description: 主页
FilePath: \vite-music-player\src\views\PageHome.vue
-->
<script setup lang="ts">
import SectionListGrid from '@/components/SectionListGrid.vue'
import { reactive } from 'vue'
import { mapActionsHelpers } from '@/common/util'

const { getcommunitys, getrecommends, getmvs } = mapActionsHelpers(null, [
  'getcommunitys',
  'getrecommends',
  'getmvs'
])

Promise.allSettled([getcommunitys(), getrecommends(), getmvs()]).then(
  (resArr: any) => {
    resArr.forEach(({ status, value }) => {
      if (status === 'fulfilled') {
        data[value.type] = value.data
      }
    })
  }
)

const data = reactive({
  // 社区精选
  communitys: [],
  // 推荐歌单
  recommends: [],
  // 推荐MV
  mvs: []
})
</script>

<template>
  <div id="page-home" class="spacing">
    <section-list-grid
      :listData="data.recommends"
      sectionTitle="为你推荐"
      more="recommends"
    />
    <section-list-grid
      :listData="data.communitys"
      sectionTitle="社区精选"
      more="communitys"
    />
    <section-list-grid
      :listData="data.mvs"
      sectionTitle="推荐的MV"
      more="mvs"
    />
  </div>
</template>

<style lang="less">
</style>
