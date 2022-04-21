<!--
Author: zusheng
Date: 2022-04-13 10:05:17
LastEditTime: 2022-04-21 09:59:48
Description: 电台节目详情页
FilePath: \vite-music-player\src\views\DetailDjp.vue
-->

<script lang="ts" setup>
import { useStore } from '@/store'
import { useRoute } from 'vue-router'
import { reactive } from 'vue'
import { mapActionsHelpers } from '@/common/util'
import TheFramePlaylist from '@/components/TheFramePlaylist.vue'
import { SongTableRow } from '@/common/types'

////////////////////////////////////////////////////////////////////////////////////////////////
// 以下获取数据
////////////////////////////////////////////////////////////////
const store = useStore()
const route = useRoute()
const id = route.query.payload
// 歌手信息
const data = reactive<{
  info: any
  songs: Array<SongTableRow>
}>({
  info: {
    title: '',
    desc: '',
    picUrl: '',
    sub: '',
    artist: '',
    createTime: ''
  },
  songs: []
})

// 取出action函数
const { getDjpDetail, getDjpListDetail } = mapActionsHelpers(null, [
  'getDjpDetail',
  'getDjpListDetail'
])

getDjpDetail({ id }).then((res: any) => {
  const rid = res.radioId
  Object.assign(data.info, res)

  getDjpListDetail({ rid }).then((res: any) => {
    data.songs = res.data
  })
})
</script>

<template>
  <div id="detail-radio">
    <the-frame-playlist
      :title="data.info.title"
      :desc="data.info.desc"
      :sub="data.info.sub"
      :picUrl="data.info.picUrl"
      :artist="data.info.artist"
      :createTime="data.info.createTime"
      :songs="data.songs"
    />
  </div>
</template>

<style lang="less">
#detail-radio {
  width: 100%;
  height: 100%;
}
</style>

