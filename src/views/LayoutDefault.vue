<!--
Author: zusheng
Date: 2022-04-10 21:10:50
LastEditTime: 2022-04-20 22:49:57
Description: 默认布局
FilePath: \vite-music-player\src\views\LayoutDefault.vue
-->
<script lang="ts" setup>
import { mapActionsHelpers, mapMutationsHelpers } from '@/common/util'
import TheAudioPlayer from '@/components/TheAudioPlayer/TheAudioPlayer.vue'
import TheTabbar from '@/components/TheTabbar.vue'
import TheLoading from '@/components/TheLoading.vue'
import PageError from '@/views/PageError.vue'
import { computed, onMounted, onUnmounted, ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from '@/store'

const { getSongUrl } = mapActionsHelpers(null, ['getSongUrl'])
const { setAudioUrl, setDebugInfo, setAudioInfo, setAudioDisplay } =
  mapMutationsHelpers(null, [
    'setAudioUrl',
    'setDebugInfo',
    'setAudioInfo',
    'setAudioDisplay'
  ])
const store = useStore()
const route = useRoute()
// 播放器在滚动时隐藏
const playerFade = ref<boolean>(true)
const viewKey = computed(() => {
  const payload = route.query.payload ?? ''
  return Date.now().toString() + payload
})

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

function setPlayerTranslate() {
  // const rectTop = tabbarRef.value.getBoundingClientRect().top
  const clientHeight = document.documentElement.clientHeight
  const trl =
    clientHeight > window.innerHeight
      ? `${clientHeight - 144}px`
      : `${window.innerHeight - 144}px`
  document.body.style.setProperty('--player-translate', trl)
  playerFade.value = true
  ////////////////////////////////////////////////////////////////
  // setDebugInfo(
  //   `window.outerHeight:${window.outerHeight}
  //   <br>window.innerHeight:${window.innerHeight}
  //   <br>当前屏幕高度: ${clientHeight}
  //   <br>tabbar距离顶部高度:${rectTop.toFixed(0)}
  //   <br>根据屏幕高度计算:${clientHeight}-144=${clientHeight - 144}
  //   <br>根据屏幕tabbar高度计算:${rectTop}-72=${(rectTop - 72).toFixed(0)}`
  // )
}

// 定时器
let playerFadeTimer: any
const handler = (e: any) => {
  if (store.state.playerDisplay) {
    e.preventDefault()
  } else {
    // 一滚动就把播放器隐藏
    playerFade.value = false

    if (playerFadeTimer) clearTimeout(playerFadeTimer)
    playerFadeTimer = setTimeout(() => {
      setPlayerTranslate()
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
    <!-- <div
      style="
        position: fixed;
        top: 0;
        right: 0;
        z-index: 9999;
        background: #ccc;
        padding: 10px;
      "
      v-html="store.state.debugInfo"
    ></div> -->
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

    <transition name="fade">
      <!-- 播放器 -->
      <the-audio-player
        v-show="playerFade"
        :url="store.state.audioUrl"
        :title="store.state.audioInfo.title"
        :album="store.state.audioInfo.album"
        :publish-time="store.state.audioInfo.publishTime"
        :artist="store.state.audioInfo.artist"
        :pic-url="store.state.audioInfo.picUrl"
      />
    </transition>

    <!-- 底部tabbar -->
    <the-tabbar></the-tabbar>
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity cubic-bezier(0.333, 0.93, 0.667, 1) 0.2s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
