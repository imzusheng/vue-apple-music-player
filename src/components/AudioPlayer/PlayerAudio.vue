<!--
Author: zusheng
Date: 2022-04-16 23:33:22
LastEditTime: 2022-04-17 17:53:37
Description: 音乐播放器
FilePath: \vite-music-player\src\components\AudioPlayer\PlayerAudio.vue
-->

<script lang="ts" setup>
import PlayerAudioInfo from '@/components/AudioPlayer/PlayerAudioInfo.vue'
import PlayerAudioControls from '@/components/AudioPlayer/PlayerAudioControls.vue'
import PlayerAudioVolume from '@/components/AudioPlayer/PlayerAudioVolume.vue'
import PlayerAudioProgress from '@/components/AudioPlayer/PlayerAudioProgress.vue'
import { useStore } from '@/store'
import { mapMutationsHelpers } from '@/common/util'
import { onMounted, provide, reactive, watchEffect } from 'vue'

const store = useStore()
const { setAudioDisplay } = mapMutationsHelpers(null, ['setAudioDisplay'])

const props = defineProps<{
  // 音乐url
  url: string

  // 歌名
  title: string

  // 专辑
  album: string

  // 作者
  artist: string

  // 发布时间
  publishTime: any

  // 封面
  picUrl: string
}>()

const data = reactive<any>({
  // HTMLAudioElement
  audioRef: null,

  // 歌曲加载状态
  loading: false,

  // 音乐是否正在播放
  playStatus: false,

  // 是否开启随机播放 on/off
  random: 'off',

  // 播放模式 如: repeat(单曲循环), common(不), list(列表播放)
  model: 'common',

  // 是否单曲循环播放
  loop: 'off',

  // 音频时长
  duration: '',

  // 播放进度
  progress: '',

  // 音量 0~100
  volume: ''
})

provide('data', data)
provide('props', props)
provide('setData', (name: string, value: any) => {
  data[name] = value
})

onMounted(() => {
  // 创建播放器
  playerCreate()
})

watchEffect(() => {
  if (props.url) {
    document.title = `${props.title} - ${props.artist}`
    setAudioDisplay(true)
    // 加载歌曲
    playerLoading(props.url, true)
  }
})

/**
 * 创建audio标签
 */
function playerCreate() {
  data.audioRef = document.createElement('audio')
  data.audioRef.controls = true
  data.audioRef.preload = 'auto'
  data.audioRef.loop = false
  // 设置初始音量
  const volumeInit = localStorage.getItem('volume')
  data.volume = volumeInit ? Number(localStorage.getItem('volume')) : 30
  data.audioRef.volume = data.volume / 100

  // 监听错误
  data.audioRef.addEventListener('error', () => {
    // 发生错误暂停歌曲
    data.audioRef.pause()
    data.loading = true
    // 只能连续重连两次
    // TODO 错误重连
  })

  // 可以开始播放，加载完毕
  data.audioRef.addEventListener('canplay', () => {
    data.loading = false
    // 获取音频总时长
    data.duration = data.audioRef.duration
    localStorage.setItem('duration', data.duration)
  })

  // 开始播放
  data.audioRef.addEventListener('play', () => {
    data.playStatus = true
  })

  // 暂停播放
  data.audioRef.addEventListener('pause', () => {
    data.playStatus = false
  })

  // 计算当前缓存进度
  data.audioRef.addEventListener('progress', () => {
    // 计算缓存进度
    let cacheLength = 0
    for (let i = 0; i < data.audioRef.buffered.length; i++) {
      cacheLength +=
        data.audioRef.buffered.end(i) - data.audioRef.buffered.start(i)
    }
    // data.cacheProgress = (cacheLength / data.duration) * 100
  })

  // 计算当前播放进度
  data.audioRef.addEventListener('timeupdate', () => {
    data.progress = (data.audioRef.currentTime / data.duration) * 100
    // 保存进度到localStorage
    localStorage.setItem('currentTime', data.audioRef.currentTime)
  })

  // 播放完毕
  data.audioRef.addEventListener('ended', () => {
    if (data.model === 'list') {
      // 列表循环模式
      // next()
    } else if (data.model === 'repeat') {
      // 单曲循环模式
      data.audioRef.currentTime = 0
    } else {
      // 列表播放，播完即止
      // const playQueue = this.playQueue()
      // const playQueueIndex = this.playQueueIndex()
      // 如果播放到尾，则结束播放。反之下一首
      // if (playQueueIndex !== playQueue.length - 1) {
      //   next()
      // }
    }
  })
}

/**
 * 加载音乐
 */
function playerLoading(url: string, autoplay: boolean) {
  data.audioRef.src = url
  data.audioRef.autoplay = autoplay
  data.audioRef.load()
}
</script>

<template>
  <div
    id="audio-player"
    :class="{ 'audio-player-show': store.state.audioDisplay }"
  >
    <div class="player-main">
      <!-- 进度条 -->
      <player-audio-progress />

      <!-- 歌曲信息 -->
      <player-audio-info />

      <!-- 中控 -->
      <player-audio-controls />

      <!-- 音量控制 -->
      <player-audio-volume />
    </div>
  </div>
</template>

<style lang="less">
.audio-player-show {
  transform: translate(0, 0) !important;
}

#audio-player {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 72px;
  background: rgba(252, 253, 255, 1);
  box-shadow: 0 0 1px rgba(255, 255, 255, 1);
  z-index: 999;
  transform: translate(0, 100px);
  transition: transform 0.4s;

  * {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  .player-main {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 100%;
    padding: 0 24px 0 12px;
    box-sizing: border-box;
    position: relative;
  }
}
</style>
