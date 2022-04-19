<!--
Author: zusheng
Date: 2022-04-12 16:04:42
LastEditTime: 2022-04-19 21:53:02
Description: 专辑详情
FilePath: \vite-music-player\src\views\DetailAlbum.vue
-->
<script lang="ts" setup>
import { mapActionsHelpers, durationConvert, pickUpName } from '@/common/util'
import { reactive } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from '@/store'
import TheDetailFrame from '@/components/TheDetailFrame.vue'
import TableListSongs from '@/components/TableListSongs.vue'
import { SongTableRow } from '@/common/types'

const route = useRoute()
const store = useStore()
const { getAlbumAll, getAlbumThroughSongs } = mapActionsHelpers(null, [
  'getAlbumAll',
  'getAlbumThroughSongs'
])
const albumInfo = reactive<any>({
  // 专辑信息
  data: {
    name: '',
    description: '',
    picUrl: '',
    size: ''
  },
  // 专辑内歌曲
  songs: []
})
let id = route.query.payload

getData()

async function getData() {
  if (route.name === 'song') {
    const albumId = await getAlbumThroughSongs(id).then((albumId: any) => {
      id = albumId
    })
  }

  getAlbumAll(id)
    .then((res: any) => {
      albumInfo.data = res.album
      albumInfo.songs = res.songs.map((v: any): SongTableRow => {
        return {
          payload: v.id,
          artist: pickUpName(v.ar),
          title: v.name,
          album: v.al.name,
          picUrl: v.al.picUrl + '?param=50y50',
          duration: durationConvert(v.dt / 1000),
          fee: v.fee.toString()
        }
      })
    })
    .catch((err: any) => {
      store.commit('setError', {
        status: true,
        info: err.stack
      })
    })
}
</script>


<template>
  <div id="detail-album">
    <the-detail-frame
      :title="albumInfo.data.name"
      :desc="albumInfo.data.description"
      :picUrl="albumInfo.data.picUrl"
      :sub="`共${albumInfo.data.size}首音乐`"
    >
      <template #list>
        <table-list-songs
          :virtualScroll="true"
          :songs="albumInfo.songs"
          size="L"
          :title="true"
        />
      </template>
    </the-detail-frame>
  </div>
</template>

<style lang="less">
#detail-album {
  width: 100%;
  height: 100%;
}
</style>