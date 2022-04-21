<!--
Author: zusheng
Date: 2022-04-12 16:04:42
LastEditTime: 2022-04-21 09:58:58
Description: 专辑详情
FilePath: \vite-music-player\src\views\DetailAlbum.vue
-->
<script lang="ts" setup>
import { mapActionsHelpers, durationConvert, pickUpName } from '@/common/util'
import { reactive, toRaw } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from '@/store'
import TheFramePlaylist from '@/components/TheFramePlaylist.vue'
import { SongTableRow } from '@/common/types'
import moment from 'moment'

const route = useRoute()
const store = useStore()
const { getAlbumAll, getAlbumThroughSongs } = mapActionsHelpers(null, [
  'getAlbumAll',
  'getAlbumThroughSongs'
])
const albumInfo = reactive<any>({
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

let id = route.query.payload

getData()

async function getData() {
  if (route.name === 'song') {
    const albumId = await getAlbumThroughSongs(id)
    id = albumId
  }

  getAlbumAll(id)
    .then((res: any) => {
      albumInfo.data = {
        title: res.album.name,
        desc: res.album.description,
        picUrl: res.album.picUrl + '?param=400y400',
        sub: '',
        artist: res.album.artist.name,
        createTime: moment(res.album.publishTime).format('YYYY年M月D日')
      }
      albumInfo.songs = res.songs.map((v: any): SongTableRow => {
        return {
          payload: v.id,
          artist: pickUpName(v.ar),
          title: v.name,
          album: v.al.name,
          picUrl: v.al.picUrl,
          duration: v.dt,
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
    <the-frame-playlist
      :title="albumInfo.data.title"
      :desc="albumInfo.data.desc"
      :picUrl="albumInfo.data.picUrl"
      :sub="albumInfo.data.sub"
      :artist="albumInfo.data.artist"
      :createTime="albumInfo.data.createTime"
      :songs="albumInfo.songs"
    >
    </the-frame-playlist>
  </div>
</template>

<style lang="less">
#detail-album {
  width: 100%;
  height: 100%;
}
</style>
