<!--
Author: zusheng
Date: 2022-04-12 20:51:30
LastEditTime: 2022-04-13 09:44:53
Description: 专辑详情
FilePath: \vite-music-player\src\views\DetailPlaylist.vue
-->

<script lang="ts" setup>
import { mapActionsHelpers, durationConvert, pickUpName } from '@/common/util'
import { reactive } from 'vue'
import { useRoute } from 'vue-router'
import TheDetailFrame from '@/components/TheDetailFrame.vue'
import TableListSongs from '@/components/TableListSongs.vue'
import { TableListSongsTypes } from '@/common/types'
import { useStore } from '@/store'

const store = useStore()
const route = useRoute()
const { getPlaylistDetail, getSongsDetail } = mapActionsHelpers(null, [
  'getPlaylistDetail',
  'getSongsDetail'
])
const playlistInfo = reactive<any>({
  // 专辑信息
  data: {
    title: '',
    desc: '',
    picUrl: '',
    sub: ''
  },
  // 专辑内歌曲
  songs: []
})
const id = route.query.payload

getPlaylistDetail(id)
  .then((res: any) => {
    playlistInfo.data = res
    store.commit('setHeaderText', playlistInfo.data.title)
    return res.trackIds.toString()
  })
  .then((ids: string) => {
    getSongsDetail(ids).then((res: any) => {
      playlistInfo.songs = res
    })
  })
</script>


<template>
  <div id="detail-album">
    <the-detail-frame
      :title="playlistInfo.data.title"
      :desc="playlistInfo.data.desc"
      :picUrl="playlistInfo.data.picUrl"
      :sub="`${playlistInfo.data.sub}`"
    >
      <template #list>
        <table-list-songs :songs="playlistInfo.songs" size="L" :title="true" />
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