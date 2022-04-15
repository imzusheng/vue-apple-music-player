<!--
Author: zusheng
Date: 2022-04-13 12:49:50
LastEditTime: 2022-04-14 18:10:06
Description: 电台详情
FilePath: \vite-music-player\src\views\DetailDj.vue
-->

<script lang="ts" setup>
import { useStore } from '@/store'
import { useRoute } from 'vue-router'
import { reactive } from 'vue'
import { mapActionsHelpers } from '@/common/util'
import TheDetailFrame from '@/components/TheDetailFrame.vue'
import TableListSongs from '@/components/TableListSongs.vue'
import { SongTableRow } from '@/common/types'

////////////////////////////////////////////////////////////////////////////////////////////////
// 以下获取数据
////////////////////////////////////////////////////////////////
const store = useStore()
const route = useRoute()
const rid = route.query.payload
// 歌手信息
const data = reactive<{
  info: any
  songs: Array<SongTableRow>
}>({
  info: {
    title: '',
    desc: '',
    picUrl: '',
    sub: ''
  },
  songs: []
})

// 取出action函数
const { getDjDetail, getDjpListDetail } = mapActionsHelpers(null, [
  'getDjDetail',
  'getDjpListDetail'
])

getDjDetail({ rid })
  .then((res: any) => {
    const rid = res.radioId
    Object.assign(data.info, res)
    return getDjpListDetail({ rid })
  })
  .then((res: any) => {
    data.songs = res.data
  })
  .catch((err: any) => {
    store.commit('setError', {
      status: true,
      info: err.stack
    })
  })
</script>

<template>
  <div id="detail-radio">
    <the-detail-frame
      :title="data.info.title"
      :desc="data.info.desc"
      :sub="data.info.sub"
      :picUrl="data.info.picUrl"
    >
      <template #list>
        <table-list-songs
          :virtualScroll="true"
          :songs="data.songs"
          size="L"
          :title="true"
        />
      </template>
    </the-detail-frame>
  </div>
</template>

<style lang="less">
#detail-radio {
  width: 100%;
  height: 100%;
}
</style>

