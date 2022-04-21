<!--
Author: zusheng
Date: 2022-04-11 18:15:50
LastEditTime: 2022-04-21 11:41:21
Description: 歌单详情页
FilePath: \vite-music-player\src\views\DetailArtist.vue
-->

<script lang="ts" setup>
import { useStore } from '@/store'
import { useRoute } from 'vue-router'
import { reactive, toRaw } from 'vue'
import { mapActionsHelpers } from '@/common/util'
import TheFrameArtist from '@/components/TheFrameArtist.vue'
import SectionListGrid from '@/components/SectionListGrid.vue'
import TableListSongs from '@/components/TableListSongs.vue'
import SectionTitle from '@/components/SectionTitle.vue'

////////////////////////////////////////////////////////////////////////////////////////////////
// 以下获取数据
////////////////////////////////////////////////////////////////
const store = useStore()
const route = useRoute()
const id = route.query.payload
// 歌手信息
const data = reactive<any>({
  ArtistDetail: {
    title: '',
    desc: '',
    picUrl: '',
    sub: ''
  },
  ArtistFans: {},
  ArtistSong: []
})
// 取出action函数
const { getArtistDetail, getArtistFans, getArtistSong } = mapActionsHelpers(
  null,
  ['getArtistDetail', 'getArtistFans', 'getArtistSong']
)
// 批量请求详情和粉丝数据
Promise.allSettled([getArtistDetail(id), getArtistFans(id), getArtistSong(id)])
  .then((resArr) => {
    resArr.forEach((res: any) => {
      if (res.status === 'fulfilled') {
        data[res.value.type] = res.value.data
      }
    })
  })
  .catch((err: any) => {
    store.commit('setError', {
      status: true,
      info: err.stack
    })
  })
</script>

<template>
  <div id="detail-artist">
    <the-frame-artist
      :title="data.ArtistDetail.title"
      :desc="data.ArtistDetail.desc"
      :picUrl="data.ArtistDetail.picUrl"
    >
      <template #list>
        <div class="artist-song">
          <section-title sectionTitle="歌曲排行" actionName="查看全部" />

          <table-list-songs
            :songs="data.ArtistSong"
            :virtualScroll="false"
            :index="false"
            :title="false"
            size="m"
          />
        </div>

        <section-list-grid
          action="ArtistAlbum"
          :actionParams="{ id }"
          sectionTitle="专辑"
        />
        <section-list-grid
          action="ArtistMv"
          :actionParams="{ id }"
          sectionTitle="MV"
        />
        <section-list-grid
          action="ArtistVideo"
          :actionParams="{
            id,
            order: 1,
            size: 7
          }"
          sectionTitle="视频"
        />
        <section-list-grid
          action="ArtistSimi"
          :actionParams="{ id }"
          sectionTitle="粉丝也喜欢"
          :round="true"
        />
      </template>
    </the-frame-artist>
  </div>
</template>

<style lang="less">
#detail-artist {
  width: 100%;
  height: 100%;

  .artist-song {
    margin-bottom: 36px;
  }
}
</style>

