<!--
Author: zusheng
Date: 2022-04-10 21:10:50
LastEditTime: 2022-04-19 13:48:48
Description: 默认布局
FilePath: \vite-music-player\src\views\LayoutDefault.vue
-->
<script lang="ts" setup>
import { mapActionsHelpers, mapMutationsHelpers } from '@/common/util'
import TheAudioPlayer from '@/components/TheAudioPlayer.vue'
import TheTabbar from '@/components/TheTabbar.vue'
import TheLoading from '@/components/TheLoading.vue'
import PageError from '@/views/PageError.vue'
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from '@/store'

const { getSongUrl } = mapActionsHelpers(null, ['getSongUrl'])
const { setAudioUrl, setDebugInfo } = mapMutationsHelpers(null, [
  'setAudioUrl',
  'setDebugInfo'
])
const store = useStore()
const route = useRoute()

const viewKey = computed(() => {
  const payload = route.query.payload ?? ''
  return Date.now().toString() + payload
})

function reload() {
  getSongUrl(store.state.audioInfo.payload).then((url: string) => {
    setAudioUrl(url)
  })
}
</script>


<template>
  <!-- 播放器 -->
  <!-- <audio-player
    :url="store.state.audioUrl"
    :title="store.state.audioInfo.title"
    :album="store.state.audioInfo.album"
    :publish-time="store.state.audioInfo.publishTime"
    :artist="store.state.audioInfo.artist"
    :pic-url="store.state.audioInfo.picUrl"
    @reload="reload"
  /> -->

  <div id="default-layout">
    <!-- <div id="default-mask" v-if="store.state.playerDisplay"></div> -->

    <main id="main">
      <!-- 头部 -->

      <the-loading v-if="store.state.loading" />
      <page-error v-if="store.state.error.status" />

      <router-view
        v-show="!store.state.loading && !store.state.error.status"
        v-slot="{ Component }"
        :key="viewKey"
      >
        <component :is="Component" />
      </router-view>
    </main>

    <!-- 播放器 -->
    <the-audio-player
      :url="store.state.audioUrl"
      :title="store.state.audioInfo.title"
      :album="store.state.audioInfo.album"
      :publish-time="store.state.audioInfo.publishTime"
      :artist="store.state.audioInfo.artist"
      :pic-url="store.state.audioInfo.picUrl"
    />

    <!-- 底部tabbar -->
    <!-- <the-tabbar></the-tabbar> -->
  </div>
</template>

<style lang="less">
#default-layout {
  display: flex;
  padding: 0 0 4.5rem /* 72/16 */;

  // 遮罩
  // #default-mask {
  //   position: fixed;
  //   top: 0;
  //   left: 0;
  //   right: 0;
  //   bottom: 0;
  //   background: rgba(255, 255, 255, 0.5);
  //   backdrop-filter: blur(40px);
  //   -webkit-backdrop-filter: blur(40px);
  //   z-index: 997;
  // }

  #main {
    width: 100%;
    position: relative;
  }
}
</style>
