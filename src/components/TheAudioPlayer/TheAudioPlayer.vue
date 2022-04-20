

<!--
Author: zusheng
Date: 2022-04-18 13:09:20
LastEditTime: 2022-04-20 18:22:39
Description: 播放器
FilePath: \vite-music-player\src\components\TheAudioPlayer\TheAudioPlayer.vue
-->

<script setup lang="ts">
import {
  ref,
  reactive,
  nextTick,
  provide,
  computed,
  watchEffect,
  onMounted,
  onUnmounted,
  inject
} from 'vue'
import { mapMutationsHelpers, durationConvert } from '@/common/util'
import { useStore } from '@/store'
import ControlsMini from '@/components/TheAudioPlayer/ControlsMini.vue'

const store = useStore()
const player = ref<any>()
const poster = ref<any>()
const playerRef = ref<any>()
const controlsProgress = ref<any>()
const controlsVolume = ref<any>()
const { setPlayerDisplay, setDebugInfo } = mapMutationsHelpers(null, [
  'setPlayerDisplay',
  'setDebugInfo'
])
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
  // 图片缩放
  posterDisplay: false,

  // 播放器是否自动黏贴
  playerDisplay: false,

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

  // 当前播放时间
  curTime: '',

  // 播放进度
  progress: '',

  // 音量 0~100
  volume: '',

  // 是否正在调整进度条
  seeking: false
})

const getDurationConvert = computed(() => {
  return function (time: any) {
    return durationConvert(time)
  }
})

provide('data', data)
provide('props', props)
provide('setData', (name: string, value: any) => {
  data[name] = value
})

const tabbarRef: any = inject('tabbarRef')

onMounted(() => {
  // 创建播放器
  playerCreate()

  // 计算封面图缩放比例
  resizeHandler()
  window.addEventListener('resize', resizeHandler)

  player.value.addEventListener('touchstart', touchStartHandler, {
    passive: false
  })
})

onUnmounted(() => {
  if (player.value) {
    player.value.removeEventListener('touchstart', touchStartHandler)
  }
  window.removeEventListener('resize', resizeHandler)
})

watchEffect(() => {
  if (props.url) {
    nextTick(() => {
      document.title = `${props.title} - ${props.artist}`
      // 加载歌曲
      playerLoading(props.url, true)
    })
  }
  if (props.picUrl && poster.value) {
    // 设置背景
    poster.value.style.backgroundImage = `url("${props.picUrl}?param=400y400")`
  }
})

/**
 * 计算封面图缩放比例
 */
function resizeHandler() {
  const w = document.documentElement.clientWidth
  const h = document.documentElement.clientHeight

  // 目标缩放比率
  let targetScale: any

  if (w > h / 2) {
    // 宽屏
    const curSize = h / 2 - 32
    const curW = (w - curSize) / 2
    const curY = h / 2 - curSize
    playerRef.value.style.setProperty('--poster-size', `${curSize}px`)
    playerRef.value.style.setProperty('--poster-translateX', `${curW}px`)
    playerRef.value.style.setProperty('--poster-translateY', `${curY}px`)
    targetScale = (60 / (h / 2)).toFixed(2)
  } else {
    // 竖排
    const curW = w - 32
    const curY = h / 2 - curW
    playerRef.value.style.setProperty('--poster-translateX', `16px`)
    playerRef.value.style.setProperty('--poster-translateY', `${curY}px`)
    playerRef.value.style.setProperty('--poster-size', `${curW}px`)
    targetScale = (60 / curW).toFixed(2)
  }

  // 设置缩小后的比例
  playerRef.value.style.setProperty('--scale-ratio', targetScale)
}

/**
 * 触摸开始事件
 * @param e
 */
function touchStartHandler(e: any) {
  if (e.target.tagName.toLowerCase() === 'button') {
    // 触发调整按钮
    if (e.target.dataset.funcVolume === 'on') {
      // 调整音量
      volumeChangeHandler()
    } else if (e.target.dataset.funcProgress === 'on') {
      progressChangeHandler()
    }
  } else {
    playerChangeHandler(e)
  }
}

/**
 * 播放器全局缩放动画 监听 touchstart
 */
function playerChangeHandler(e: any) {
  let gH = document.documentElement.clientHeight

  // 设置播放器开启状态
  setPlayerDisplay(true)
  data.playerDisplay = true

  // 拖动时关闭动画
  player.value.style.transition = 'none'

  // 开始拖动时手按下的坐标
  const startY = e.changedTouches[0].clientY

  // 此时播放器距离网页顶部的距离
  const targetStartY = player.value.getBoundingClientRect().top

  // 保存上一次的坐标
  let befY = startY

  // 拖动时触发
  function touchMoveHandler(e: any) {
    // 阻止默认行为
    e.stopPropagation()
    e.preventDefault()

    // 计算拖动时播放器坐标
    let curY = targetStartY + (e.changedTouches[0].clientY - startY)
    // 拖放边界，不能小于0，不能大于屏幕高度
    if (curY < 0) {
      curY = 0
    } else if (curY > gH) {
      curY = gH
    }

    // 过了临界值自动收缩/展开
    if (befY > e.changedTouches[0].clientY) {
      // 向上滑动时
      if (curY / gH < 0.7) {
        // 展开封面和播放器
        data.posterDisplay = true
        data.playerDisplay = true
      }
    } else {
      // 向下滑动
      if (curY / gH > 0.2) {
        // 收缩播放器，封面暂时不动
        data.playerDisplay = false
      }
    }

    // 更新为上次位置
    befY = e.changedTouches[0].clientY

    // 在body上设置当前坐标，因为稍后default页面也要设置，
    // 而外部无法获取播放器元素的引用(HTMLElement)
    document.body.style.setProperty('--player-translate', `${curY}px`)
  }

  player.value.addEventListener('touchmove', touchMoveHandler, {
    passive: false
  })

  // 只监听一次
  player.value.addEventListener(
    'touchend',
    () => {
      // 移除监听
      player.value.removeEventListener('touchmove', touchMoveHandler)

      // 重新设置回动画
      const transition = 'transform cubic-bezier(0.333, 0.93, 0.667, 1) 0.35s'
      player.value.style.transition = transition

      // 稍后设置播放器样式
      setTimeout(() => {
        // 展开时的位置
        const openTranslate = `${(
          document.documentElement.clientHeight - 144
        ).toFixed(0)}px`

        // setDebugInfo(
        //   `当前屏幕高度: ${document.documentElement.clientHeight}
        //   <br>根据屏幕高度计算: ${document.documentElement.clientHeight - 144}
        //   <br>根据tabbar计算的高度: ${
        //     tabbarRef.value.getBoundingClientRect().top - 72
        //   }`
        // )

        // 如果data.playerDisplay为true则为打开状态
        const translateValue = data.playerDisplay ? '0px' : openTranslate
        document.body.style.setProperty('--player-translate', translateValue)

        // 设置全局打开状态，tabbar就会隐藏
        setTimeout(() => {
          player.value.style.transition = 'none'
          setPlayerDisplay(data.playerDisplay)
        }, 350)

        // 设置封面展开放大
        data.posterDisplay = data.playerDisplay
      }, 10)
    },
    { once: true }
  )
}

/**
 * 调整音量 监听
 */
function volumeChangeHandler() {
  const rect = controlsVolume.value.getBoundingClientRect()
  const start = rect.left
  const end = rect.right

  const moveHandler = (e: any) => {
    const moveX = e.changedTouches[0].clientX
    // 计算拖动时坐标
    let ratio = (moveX - start) / (end - start)
    if (ratio > 1) {
      ratio = 1
    } else if (ratio < 0) {
      ratio = 0
    }
    data.audioRef.volume = ratio
    data.volume = (ratio * 100).toFixed(2)
    // const context = new AudioContext()
    // const gainNode = context.createGain()
    // gainNode.gain.value = ratio
  }

  player.value.addEventListener('touchmove', moveHandler, {
    passive: false
  })

  player.value.addEventListener(
    'touchend',
    () => {
      player.value.removeEventListener('touchmove', moveHandler)
    },
    {
      once: true
    }
  )
}

/**
 * 调整进度 监听
 */
function progressChangeHandler() {
  // 触发进度调节按钮
  data.seeking = true
  data.audioRef.muted = true
  data.audioRef.pause()

  const rect = controlsProgress.value.getBoundingClientRect()
  const start = rect.left
  const end = rect.right

  const moveHandler = (e: any) => {
    const moveX = e.changedTouches[0].clientX
    // 计算拖动时坐标
    let ratio = (moveX - start) / (end - start)
    if (ratio > 1) {
      ratio = 1
    } else if (ratio < 0) {
      ratio = 0
    }
    data.audioRef.currentTime = data.duration * ratio
    data.progress = (ratio * 100).toFixed(2)
  }

  player.value.addEventListener('touchmove', moveHandler, {
    passive: false
  })

  player.value.addEventListener(
    'touchend',
    () => {
      data.seeking = false
      data.audioRef.muted = false
      data.audioRef.play()
      player.value.removeEventListener('touchmove', moveHandler)
    },
    {
      once: true
    }
  )
}

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
    data.curTime = data.audioRef.currentTime
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
 * @param url 音乐src
 * @param autoplay 是否自动播放
 */
function playerLoading(url: string, autoplay: boolean) {
  data.audioRef.pause
  data.audioRef.src = url
  data.audioRef.autoplay = autoplay
  data.audioRef.load()
}

/**
 * 开始/暂停音乐
 */
function controlPlay() {
  // const context = new AudioContext() // 创建Audio上下文
  // const audio = new Audio(
  //   'http://m701.music.126.net/20220419201137/dcba2ee07db834acec4260a0b6f45016/jdymusic/obj/wo3DlMOGwrbDjj7DisKw/8731125515/a5c3/ac77/d19e/1d3daf3953ca2d09ea553dcd5b4bfed0.mp3'
  // )
  // audio.crossOrigin = 'anonymous'
  // const media = context.createMediaElementSource(audio) // 从元素创建媒体节点
  // const gainNode = context.createGain()
  // gainNode.gain.value = 0.5
  // //连接：media→gain→destination
  // media.connect(gainNode)
  // gainNode.connect(context.destination)
  // //音量控制
  // gainNode.gain.value = 0.5

  data.playStatus = !data.playStatus
  if (data.playStatus) data.audioRef.play()
  else data.audioRef.pause()
}
</script>

<template>
  <div
    ref="playerRef"
    id="player"
    v-show="props.url"
    :class="{
      'player-poster-display': data.posterDisplay,
      'player-fade': store.state.playerFade,
      'player-hide': !store.state.playerFade
    }"
  >
    <div class="player-spacing" ref="player">
      <!-- 把手 -->
      <div class="player-handle" v-if="data.posterDisplay"></div>

      <!-- 海报 -->
      <div
        ref="poster"
        class="player-poster user-not-select"
        :class="{ 'player-poster-show': data.posterDisplay }"
      ></div>

      <!-- 迷你控制栏 -->
      <controls-mini :title="props.title" />

      <!-- 标准控制中心 -->
      <div class="player-controls">
        <!-- 歌曲信息 -->
        <div class="player-controls-info">
          <h2 class="player-controls-info-h2">{{ props.title }}</h2>
          <p class="player-controls-info-p">{{ props.artist }}</p>
        </div>

        <!-- 进度条 -->
        <div class="player-controls-progress" ref="controlsProgress">
          <!-- 进度条本体 -->
          <div
            class="player-controls-progress-rail"
            :style="{
              'clip-path': `inset(0 ${100 - data.progress}% 0 0)`
            }"
          ></div>
          <!-- 调整按钮 -->
          <div
            class="player-progress-handler-btn"
            :class="{ 'player-progress-handler-btn-seeking': data.seeking }"
            :style="{ transform: ` translateX(${data.progress}%)` }"
          ></div>
          <button
            class="player-progress-handler"
            data-func-progress="on"
          ></button>
          <div class="player-controls-progress-info">
            <div>{{ getDurationConvert(data.curTime) }}</div>
            <div>{{ getDurationConvert(data.duration) }}</div>
          </div>
        </div>

        <!-- 中控 -->
        <div class="player-controls-btn">
          <button class="player-controls-btn-prev"></button>
          <button
            v-show="data.playStatus"
            class="player-controls-btn-play"
            @click="controlPlay"
          ></button>
          <button
            v-show="!data.playStatus"
            class="player-controls-btn-pause"
            @click="controlPlay"
          ></button>
          <button class="player-controls-btn-next"></button>
        </div>

        <!-- 音量调整 -->
        <div class="player-controls-volume">
          <div>
            <img src="@/assets/player-controls-volume-low.svg" alt="" />
          </div>
          <div class="player-controls-volume-progress" ref="controlsVolume">
            <!-- 音量条底色 -->
            <div
              :style="{
                'clip-path': `inset(0 ${100 - data.volume}% 0 0)`
              }"
              class="player-controls-volume-bg"
            ></div>
            <!-- 圆形按钮 -->
            <button
              :style="{ transform: ` translateX(${data.volume}%)` }"
              class="volume-progress-handler"
              data-func-volume="on"
            ></button>
          </div>
          <div>
            <img src="@/assets/player-controls-volume-high.svg" alt="" />
          </div>
        </div>

        <div class="player-tools-bar"></div>
      </div>
    </div>
  </div>
</template>

<style lang="less">
#player {
  // 封面尺寸 大
  --poster-size: 0;
  // 封面X偏移
  --poster-translateX: 0;
  // 封面Y偏移
  --poster-translateY: 0;
  // 封面放大比例
  --scale-ratio: 0;

  position: fixed;
  height: 0;
  width: 0;
  top: 0;

  // 展开后样式
  .player-poster-show {
    transform: translate(var(--poster-translateX), var(--poster-translateY))
      scale(1) !important;
    border-radius: 12px !important;
    box-shadow: 0 16px 20px rgba(94, 84, 77, 0.6) !important;
  }

  .player-spacing {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    height: 100vh;
    width: 100vw;
    z-index: 998;
    // backdrop-filter: blur(20px);
    // -webkit-backdrop-filter: blur(20px);
    background-color: rgba(247, 247, 247, 1);
    // background-color: rgba(255, 255, 255, 1);
    transform: translate(0, var(--player-translate));
    // transition: transform cubic-bezier(0.333, 0.93, 0.667, 1) 0.35s;

    // 抓手
    .player-handle {
      position: absolute;
      left: 50%;
      top: calc((var(--poster-translateY) / 2) - 5px);
      width: 72px;
      height: 5px;
      border-radius: 5px;
      background: #ccc;
      transform: translate(-50%, 0);
    }

    // 封面
    .player-poster {
      position: absolute;
      top: 0;
      left: 0;
      width: var(--poster-size);
      height: var(--poster-size);
      transform-origin: left top;
      transform: translate(16px, 6px) scale(var(--scale-ratio));
      transition: transform cubic-bezier(0.333, 0.93, 0.667, 1) 0.35s;
      background-position: center center;
      background-repeat: no-repeat;
      background-size: 100%;
    }

    // 控制中心
    .player-controls {
      margin-top: 50vh;
      height: 50vh;
      width: 100%;
      padding: 24px 24px 0;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      // 进度条
      .player-controls-progress {
        height: 3px;
        width: 100%;
        margin: 16px 0;
        border-radius: 3px;
        background-color: rgba(0, 0, 0, 0.15);
        position: relative;
        .player-controls-progress-rail {
          position: absolute;
          height: 100%;
          width: 100%;
          overflow: hidden;
          border-radius: 3px;
          clip-path: inset(0 100% 0 0);
          background-color: rgba(0, 0, 0, 0.45);
        }
        // 小圆点
        .player-progress-handler-btn {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          transform: translateX(0);
          &::after {
            content: '';
            position: absolute;
            top: -3px;
            left: -3px;
            width: 9px;
            height: 9px;
            border-radius: 50%;
            background-color: rgba(0, 0, 0, 0.45);
          }
        }
        .player-progress-handler-btn-seeking {
          &::after {
            transform: scale(3) !important;
          }
        }
        // 调整触发区域
        .player-progress-handler {
          z-index: 1;
          position: absolute;
          top: -10px;
          left: 0;
          width: 100%;
          height: 22px;
          border: none;
          background: transparent;
        }
        .player-controls-progress-info {
          width: 100%;
          position: relative;
          display: flex;
          justify-content: space-between;
          > div {
            margin-top: 6px;
            color: rgba(0, 0, 0, 0.45);
            font-size: 13px;
          }
        }
      }

      // 歌曲信息
      .player-controls-info {
        .player-controls-info-h2,
        .player-controls-info-p {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .player-controls-info-h2 {
          font-size: 22px;
          color: rgba(0, 0, 0, 0.8);
        }
        .player-controls-info-p {
          font-size: 21px;
          color: rgba(0, 0, 0, 0.45);
          line-height: 1;
        }
      }

      // 控制按钮
      .player-controls-btn {
        display: flex;
        justify-content: space-between;
        padding: 32px 24px;
        .player-controls-btn-next,
        .player-controls-btn-play,
        .player-controls-btn-pause,
        .player-controls-btn-prev {
          border: none;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 46px;
          height: 46px;
          background-position: center center;
          background-repeat: no-repeat;
          background-size: 100%;
        }
        .player-controls-btn-prev {
          background-image: url('@/assets/icon-apple-prev.png');
        }
        .player-controls-btn-play {
          background-image: url('@/assets/player-controls-play.svg');
        }
        .player-controls-btn-pause {
          background-image: url('@/assets/icon-apple-center.png');
        }
        .player-controls-btn-next {
          background-image: url('@/assets/icon-apple-next.png');
        }
      }

      // 音量控制
      .player-controls-volume {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 24px 0;

        > div {
          display: flex;
          align-items: center;
          > img {
            width: 14px;
            height: 14px;
          }
        }

        .player-controls-volume-progress {
          height: 3px;
          width: 100%;
          margin: 0 16px;
          border-radius: 3px;
          background-color: rgba(0, 0, 0, 0.15);
          position: relative;
          .player-controls-volume-bg {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            border-radius: 3px;
            overflow: hidden;
            clip-path: inset(0 100% 0 0);
            background-color: rgba(0, 0, 0, 0.45);
          }
          .volume-progress-handler {
            position: absolute;
            top: -10px;
            left: -5px;
            width: 100%;
            height: 22px;
            border: none;
            background: transparent;
            transform: translateX(0);
            &::after {
              content: '';
              height: 22px;
              width: 22px;
              border-radius: 50%;
              background-color: rgba(140, 140, 140, 1);
              position: absolute;
              top: 0;
              left: -6px;
              border: none;
            }
          }
        }
      }

      .player-tools-bar {
        height: 175px;
        flex-shrink: 0;
        width: 100%;
      }
    }

    &:hover {
      will-change: auto;
    }
  }
}

.player-fade {
  animation: player-fade 0.2s forwards;
}

.player-hide {
  animation: player-hide 0.2s forwards;
}

@keyframes player-fade {
  0% {
    opacity: 0;
    display: none;
  }
  1% {
    opacity: 0;
    display: block;
  }
  100% {
    opacity: 1;
    display: block;
  }
}

@keyframes player-hide {
  0% {
    opacity: 1;
    display: block;
  }
  99% {
    opacity: 0;
    display: block;
  }
  100% {
    opacity: 0;
    display: none;
  }
}

// 展开后样式
.player-poster-show {
  transform: translate(var(--poster-translateX), var(--poster-translateY))
    scale(1) !important;
  border-radius: 12px !important;
  box-shadow: 0 16px 20px rgba(94, 84, 77, 0.6) !important;
}
</style>
