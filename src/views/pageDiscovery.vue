<!--
Author: zusheng
Date: 2022-04-13 15:29:38
LastEditTime: 2022-04-14 16:07:41
Description: 探索页面
FilePath: \vite-music-player\src\views\pageDiscovery.vue
-->
<script setup lang="ts">
import { mapActionsHelpers, getRandomIndex, pickUpName } from '@/common/util'
import TableListSongs from '@/components/TableListSongs.vue'
import SectionTitle from '@/components/SectionTitle.vue'
import SectionListGrid from '@/components/SectionListGrid.vue'
import SectionBanner from '@/components/SectionBanner.vue'
import { reactive } from 'vue'
import { Toplist } from '@/common/types'

const { getToplistDetail, getPlaylistDetail, getSongsDetail, getBanner } =
  mapActionsHelpers(null, [
    'getToplistDetail',
    'getPlaylistDetail',
    'getSongsDetail',
    'getBanner'
  ])

const data = reactive<any>({
  list: [],
  curBannerIdx: getRandomIndex(0, 9),
  banners: []
})

// 获取banner图片
getBanner().then((res: any) => {
  data.banners = res
})

const playlistId = Toplist.飙升榜

// 获取歌单详情里的trackIds,
// 再通过ids获取所有歌曲
getPlaylistDetail(playlistId)
  .then((res: any) => {
    const trackIds = res.trackIds.slice(0, 5).toString()
    return getSongsDetail(trackIds)
  })
  .then((res: any) => {
    data.list = res
  })
</script>

<template>
  <div id="page-discovery" class="spacing">
    <div class="discovery-banner">
      <section-banner
        v-if="data.banners.length > 0"
        :payload="data.banners[data.curBannerIdx].payload"
        :title="data.banners[data.curBannerIdx].title"
        :desc="''"
        :pic-url="data.banners[data.curBannerIdx].picUrl"
        :type="data.banners[data.curBannerIdx].type"
      />
    </div>

    <section-list-grid
      sectionTitle="为你推荐"
      subTitle="精选歌单"
      :playBtn="true"
      action="recommends"
    />
    <section-list-grid
      sectionTitle="官方推荐"
      subTitle="高品质歌单"
      :playBtn="true"
      action="PlaylistHq"
    />
    <section class="discovery-toplist">
      <div class="discovery-card">
        <section-title
          class="discovery-card-title"
          :action-name="null"
          section-title="热门歌曲排行"
        />
        <table-list-songs :songs="data.list" :title="false" size="m" />
      </div>
      <div class="discovery-card"></div>
    </section>
  </div>
</template>

<style lang="less">
#page-discovery {
  .discovery-banner {
    margin-bottom: 24px;
  }

  .discovery-toplist {
    display: grid;
    gap: 24px;
    grid-template-columns: 1fr 1fr;
    margin-bottom: 24px;
    .discovery-card {
      border-radius: 6px;
      padding: 16px 16px 32px;
      background: rgba(200, 200, 200, 0.1);
      .discovery-card-title {
        padding-left: 10px;
      }
    }
  }

  .color-1 {
    --color: rgba(255, 137, 131, 1);
  }
  .color-2 {
    --color: rgba(164, 255, 164, 1);
  }
  .color-3 {
    --color: rgba(204, 0, 0, 1);
  }
  .color-4 {
    --color: rgba(51, 125, 255, 1);
  }
  .color-5 {
    --color: rgba(255, 194, 0, 1);
  }
  .color-6 {
    --color: rgba(77, 238, 255, 1);
  }
  .color-7 {
    --color: rgba(164, 197, 255, 1);
  }
  .color-8 {
    --color: rgba(0, 146, 191, 1);
  }
  .color-9 {
    --color: rgba(123, 62, 219, 1);
  }
  .color-0 {
    --color: rgba(0, 165, 19, 1);
  }
}
</style>
