<!--
Author: zusheng
Date: 2022-04-10 21:10:50
LastEditTime: 2022-04-17 19:46:24
Description: 默认布局
FilePath: \vite-music-player\src\views\LayoutDefault.vue
-->
<script lang="ts" setup>
import { mapActionsHelpers, mapMutationsHelpers } from '@/common/util'
import TheNavigationLeft from '@/components/TheNavigationLeft.vue'
// import TheNavigationTop from '@/components/TheNavigationTop.vue'
import AudioPlayer from '@/components/AudioPlayer/PlayerAudio.vue'
import TheLoading from '@/components/TheLoading.vue'
import TheHeader from '@/components/TheHeader.vue'
import PageError from '@/views/PageError.vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from '@/store'

const { getSongUrl } = mapActionsHelpers(null, ['getSongUrl'])
const { setAudioUrl } = mapMutationsHelpers(null, ['setAudioUrl'])
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
  <audio-player
    :url="store.state.audioUrl"
    :title="store.state.audioInfo.title"
    :album="store.state.audioInfo.album"
    :publish-time="store.state.audioInfo.publishTime"
    :artist="store.state.audioInfo.artist"
    :pic-url="store.state.audioInfo.picUrl"
    @reload="reload"
  />

  <div id="default-layout">
    <!-- 左侧导航栏 -->
    <the-navigation-left />
    <!-- <the-navigation-top /> -->

    <main id="main">
      <!-- 头部 -->
      <the-header :class="'m_hide'" />

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
  </div>
</template>

<style lang="less">
#default-layout {
  width: 100%;
  min-height: 100vh;
  display: flex;
  padding: 0 0 72px;

  #main {
    min-width: 350px;
    width: calc(100% - var(--nav-left-width));
    margin-left: var(--nav-left-width);
    position: relative;
  }
  @media screen and (max-width: 728px) {
    & {
      .m_hide {
        display: none;
      }
      .m_show {
        display: block;
      }
      #main {
        width: 100%;
        margin-left: 0;
      }
    }
  }
}
</style>
