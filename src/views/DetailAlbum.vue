<!--
Author: zusheng
Date: 2022-04-12 16:04:42
LastEditTime: 2022-04-12 20:50:49
Description: 专辑详情
FilePath: \vite-music-player\src\views\DetailAlbum.vue
-->
<script lang="ts" setup>
import { mapActionsHelpers, durationConvert, pickUpName } from '@/common/util'
import { reactive, toRaw } from 'vue'
import { useRoute } from 'vue-router'
import TheDetailFrame from '@/components/TheDetailFrame.vue'
import TableListSongs from '@/components/TableListSongs.vue'
import { TableListSongsTypes } from '@/common/types'

const route = useRoute()
const { getAlbumAll } = mapActionsHelpers(null, ['getAlbumAll'])
const albumInfo = reactive<any>({
  // 专辑信息
  data: {},
  // 专辑内歌曲
  songs: []
})
const id = route.query.payload

getAlbumAll(id).then((res: any) => {
  albumInfo.data = res.album
  albumInfo.songs = res.songs.map((v: any): TableListSongsTypes => {
    return {
      artist: pickUpName(v.ar),
      title: v.name,
      album: v.al.name,
      picUrl: v.al.picUrl + '?param=50y50',
      duration: durationConvert(v.dt / 1000),
      fee: v.fee.toString()
    }
  })
})
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
        <table-list-songs :songs="albumInfo.songs" size="L" :title="true" />
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