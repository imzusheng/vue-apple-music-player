<!--
Author: zusheng
Date: 2022-04-10 21:10:50
LastEditTime: 2022-04-20 18:00:57
Description: 默认布局
FilePath: \vite-music-player\src\views\LayoutDefault.vue
-->
<script lang="ts" setup>
import { mapActionsHelpers, mapMutationsHelpers } from '@/common/util'
import TheAudioPlayer from '@/components/TheAudioPlayer/TheAudioPlayer.vue'
import TheTabbar from '@/components/TheTabbar.vue'
import TheLoading from '@/components/TheLoading.vue'
import PageError from '@/views/PageError.vue'
import {
  computed,
  onMounted,
  onUnmounted,
  provide,
  ref,
  watchEffect
} from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from '@/store'

const { getSongUrl } = mapActionsHelpers(null, ['getSongUrl'])
const {
  setAudioUrl,
  setDebugInfo,
  setAudioInfo,
  setAudioDisplay,
  setPlayerFade
} = mapMutationsHelpers(null, [
  'setAudioUrl',
  'setDebugInfo',
  'setAudioInfo',
  'setAudioDisplay',
  'setPlayerFade'
])
const store = useStore()
const route = useRoute()
const tabbarRef = ref<any>(null)

const viewKey = computed(() => {
  const payload = route.query.payload ?? ''
  return Date.now().toString() + payload
})

provide('tabbarRef', tabbarRef)

function getRef(ref: any) {
  tabbarRef.value = ref
}

// =============================================================================> 恢复上次播放歌曲
restore()
function restore() {
  const audioInfo = localStorage.getItem('audioInfo')
  if (audioInfo) {
    const parsedInfo = JSON.parse(audioInfo)
    setAudioInfo(parsedInfo)
    setAudioDisplay(true)

    getSongUrl(parsedInfo.payload).then((url: string) => {
      setAudioUrl(url)
    })
  }
}

watchEffect(() => {
  if (store.state.playerDisplay) {
    document.documentElement.style.setProperty('overflow', 'hidden')
  } else {
    document.documentElement.style.setProperty('overflow', 'hidden auto')
  }
})

let playerFadeTimer: any
const handler = (e: any) => {
  if (store.state.playerDisplay) {
    e.preventDefault()
  } else {
    // 一滚动就把播放器隐藏
    setPlayerFade(false)

    if (playerFadeTimer) clearTimeout(playerFadeTimer)
    playerFadeTimer = setTimeout(() => {
      const trl = `${tabbarRef.value.getBoundingClientRect().top - 72}px`
      document.body.style.setProperty('--player-translate', trl)
      setPlayerFade(true)
      // setDebugInfo(trl)
    }, 300)
  }
}

onMounted(() => {
  document.addEventListener('touchmove', handler, { passive: false })
  document.addEventListener('scroll', handler, { passive: false })
})

onUnmounted(() => {
  document.removeEventListener('touchmove', handler)
  document.removeEventListener('scroll', handler)
})
</script>


<template>
  <div id="default-layout">
    <div
      style="
        position: fixed;
        top: 0;
        right: 0;
        z-index: 9999;
        background: #ccc;
        padding: 10px;
      "
      v-html="store.state.debugInfo"
    ></div>
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
    <the-tabbar @getRef="getRef"></the-tabbar>
  </div>
</template>

<style lang="less">
#default-layout {
  display: flex;
  padding: 0 0 calc(72px + 80px + 10px);

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
