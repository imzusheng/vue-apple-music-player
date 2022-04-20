<!--
Author: zusheng
Date: 2022-04-11 18:15:50
LastEditTime: 2022-04-16 22:29:03
Description: 歌单详情页
FilePath: \vite-music-player\src\views\DetailArtist.vue
-->

<script lang="ts" setup>
import { useStore } from '@/store'
import { useRoute } from 'vue-router'
import { reactive, toRaw } from 'vue'
import { mapActionsHelpers } from '@/common/util'
import SectionListGrid from '@/components/SectionListGrid.vue'
import TheDetailFrame from '@/components/TheDetailFrame.vue'

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
  ArtistFans: {}
})
// 取出action函数
const { getArtistDetail, getArtistFans } = mapActionsHelpers(null, [
  'getArtistDetail',
  'getArtistFans'
])
// 批量请求
Promise.allSettled([getArtistDetail(id), getArtistFans(id)])
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
<!--    <the-detail-frame
      :title="data.ArtistDetail.title"
      :desc="data.ArtistDetail.desc"
      :picUrl="data.ArtistDetail.picUrl"
    >
      &lt;!&ndash; 作品列表 &ndash;&gt;
      <template #list>
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
    </the-detail-frame>-->
  </div>
</template>

<style lang="less">
#detail-artist {
  width: 100%;
  height: 100%;
}
</style>

