<!--
Author: zusheng
Date: 2022-04-12 20:51:30
LastEditTime: 2022-04-21 10:00:11
Description: 专辑详情
FilePath: \vite-music-player\src\views\DetailPlaylist.vue
-->

<script lang="ts" setup>
import { mapActionsHelpers } from '@/common/util'
import { reactive } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from '@/store'
import TheFramePlaylist from '@/components/TheFramePlaylist.vue'

const route = useRoute()
const store = useStore()
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
    sub: '',
    artist: '',
    createTime: ''
  },
  // 专辑内歌曲
  songs: []
})
const id = route.query.payload

getPlaylistDetail(id)
  .then((res: any) => {
    playlistInfo.data = res
    return res.trackIds
  })
  .then((ids: Array<any>) => {
    getSongsDetail(ids).then((res: any) => {
      playlistInfo.songs = res.map((v: any, k: any) => {
        v.idx = k + 1
        return v
      })
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
  <div id="detail-playlist">
    <the-frame-playlist
      :title="playlistInfo.data.title"
      :desc="playlistInfo.data.desc"
      :artist="playlistInfo.data.artist"
      :picUrl="playlistInfo.data.picUrl"
      :sub="playlistInfo.data.sub"
      :createTime="playlistInfo.data.createTime"
      :songs="playlistInfo.songs"
    />
  </div>
</template>

<style lang="less">
#detail-playlist {
  width: 100%;
  height: 100%;
}
</style>
