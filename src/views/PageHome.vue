<!--
Author: zusheng
Date: 2022-04-11 18:23:23
LastEditTime: 2022-04-12 00:00:27
Description: 主页
FilePath: \vite-music-player\src\views\PageHome.vue
-->
<script setup lang="ts">
import SectionListGrid from '@/components/SectionListGrid.vue'
import { reactive } from 'vue'
import { mapActionsHelpers } from '@/common/util'

const { getCommunity, getRecommend, getMv } = mapActionsHelpers(null, [
  'getCommunity',
  'getRecommend',
  'getMv'
])

Promise.allSettled([getCommunity(), getRecommend(), getMv()]).then(
  (resArr: any) => {
    resArr.forEach(({ status, value }) => {
      if (status === 'fulfilled') {
        data[value.type] = value.data
      }
    })
  }
)

const data = reactive({
  community: [],
  recommends: [],
  recommendMv: []
})
</script>

<template>
  <div id="page-home" class="spacing">
    <section-list-grid
      :listData="data.recommends"
      sectionTitle="为你推荐"
      more="''"
    />
    <section-list-grid
      :listData="data.community"
      sectionTitle="社区精选"
      more="''"
    />
    <section-list-grid
      :listData="data.recommendMv"
      sectionTitle="推荐的MV"
      more="''"
    />
  </div>
</template>

<style lang="less">
</style>
