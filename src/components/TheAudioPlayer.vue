

<!--
Author: zusheng
Date: 2022-04-18 13:09:20
LastEditTime: 2022-04-19 15:16:31
Description: 播放器
FilePath: \vite-music-player\src\components\TheAudioPlayer.vue
-->

<script setup lang="ts">
import {
  ref,
  reactive,
  nextTick,
  provide,
  watchEffect,
  onMounted,
  onUnmounted
} from 'vue'
import { mapMutationsHelpers } from '@/common/util'
import { useStore } from '@/store'

const store = useStore()
const player = ref<any>()
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

  // 播放进度
  progress: '',

  // 音量 0~100
  volume: ''
})

provide('data', data)
provide('props', props)

const { setPlayerDisplay, setDebugInfo } = mapMutationsHelpers(null, [
  'setPlayerDisplay',
  'setDebugInfo'
])

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
  player.value.removeEventListener('touchstart', touchStartHandler)
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
})
/**
 * 计算封面图缩放比例
 */
function resizeHandler() {
  const w = document.documentElement.clientWidth
  const h = document.documentElement.clientHeight

  // 目标缩放比率
  let targetScale = ''

  if (w > h / 2) {
    // 宽屏
    const curSize = h / 2 - 32
    const curW = (w - curSize) / 2
    const curY = h / 2 - curSize
    player.value.style.setProperty('--poster-translateX', `${curW}px`)
    player.value.style.setProperty('--poster-translateY', `${curY}px`)
    player.value.style.setProperty('--poster-size', `${curSize}px`)
    targetScale = (60 / (h / 2)).toFixed(2)
  } else {
    // 竖排
    const curW = w - 32
    const curY = h / 2 - curW
    player.value.style.setProperty('--poster-translateX', `16px`)
    player.value.style.setProperty('--poster-translateY', `${curY}px`)
    player.value.style.setProperty('--poster-size', `${curW}px`)
    targetScale = (60 / curW).toFixed(2)
  }

  // 设置缩小后的比例
  player.value.style.setProperty('--scale-ratio', targetScale)
}

/**
 * 触摸开始事件
 * @param e
 */
function touchStartHandler(e: any) {
  let gH = document.documentElement.clientHeight

  // 设置播放器开启状态
  setPlayerDisplay(true)
  data.posterDisplay = true
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
    e.stopPropagation()
    e.preventDefault()

    // 计算拖动时播放器坐标
    let curY = targetStartY + (e.changedTouches[0].clientY - startY)
    // 边界
    if (curY < 0) {
      curY = 0
    } else if (curY > gH) {
      curY = gH
    }

    // 过了临界值自动收缩/展开
    if (befY > e.changedTouches[0].clientY) {
      // 向上滑动
      data.posterDisplay = true
      data.playerDisplay = true
    } else {
      // 向下滑动
      if (curY / gH > 0.2) {
        data.playerDisplay = false
      }
    }

    befY = e.changedTouches[0].clientY

    // 设置当前坐标
    player.value.style.setProperty('--player-translate', `${curY}px`)
  }

  player.value.addEventListener('touchmove', touchMoveHandler, {
    passive: false
  })

  // 只监听一次
  player.value.addEventListener(
    'touchend',
    () => {
      player.value.removeEventListener('touchmove', touchMoveHandler)

      // 设置动画
      player.value.style.transition = 'transform 0.3s'

      // 设置播放器显示状态
      data.posterDisplay = data.playerDisplay

      // 稍后设置播放器样式
      setTimeout(() => {
        let cTop: any = data.playerDisplay
          ? 0
          : document.documentElement.clientHeight - 80 - 72
        const translateY = `${cTop.toFixed(0)}px`

        // setDebugInfo(
        //   `tly:${cTop},窗口高度:${document.documentElement.clientHeight},播放器高度:${player.value.clientHeight}`
        // )

        player.value.style.setProperty('--player-translate', translateY)
        setPlayerDisplay(data.playerDisplay)
      }, 10)
    },
    { once: true }
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
</script>

<template>
  <div id="player" :class="{ 'player-poster-display': data.posterDisplay }">
    <div class="player-spacing" ref="player">
      <div style="position: absolute; top: 0; right: 0">
        {{ store.state.debugInfo }}
      </div>

      <!-- 把手 -->
      <div class="player-handle" v-if="data.posterDisplay"></div>

      <!-- 海报 -->
      <div class="player-poster user-not-select"></div>

      <!-- 迷你控制栏 -->
      <div class="player-mini-controls" v-show="!data.posterDisplay">
        <div class="player-mini-controls-spacing">
          <div class="player-mini-desc">Time (feat. Mapei)</div>
          <div class="player-mini-controls-btn">
            <button class="btn-play">
              <img src="@/assets/icon-apple-center.png" alt="" />
            </button>
            <button class="btn-next">
              <img src="@/assets/icon-apple-next.png" alt="" />
            </button>
          </div>
        </div>
      </div>

      <div class="player-controls">
        <!-- 歌曲信息 -->
        <div class="player-controls-info">
          <h2 class="player-controls-info-h2">Time (feat. Mapei)</h2>
          <p class="player-controls-info-p">Swedish Hourse Mafia</p>
        </div>

        <!-- 进度条 -->
        <div class="player-controls-progress">
          <div class="player-controls-progress-info">
            <div>0:05</div>
            <div>3:15</div>
          </div>
        </div>

        <div class="player-controls-btn">
          <button>
            <img src="@/assets/icon-apple-white-prev.png" alt="" />
          </button>
          <button class="btn-play">
            <img src="@/assets/icon-apple-white-center.png" alt="" />
          </button>
          <button>
            <img src="@/assets/icon-apple-white-next.png" alt="" />
          </button>
        </div>

        <div class="player-controls-volume">
          <div>
            <img src="@/assets/player-controls-volume-low.svg" alt="" />
          </div>
          <div class="player-controls-volume-progress">
            <div class="volume-progress-handler"></div>
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
  --poster-size: 0;
  --poster-translateX: 0;
  --poster-translateY: 0;
  --scale-ratio: 0;
  --player-translate: calc(100vh - 80px - 72px);

  position: fixed;
  height: 0;
  width: 0;
  top: 0;
  left: 0;

  .player-spacing {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    height: 100vh;
    width: 100vw;
    z-index: 998;
    background-color: rgba(247, 247, 247, 1);
    transform: translate(0, var(--player-translate));
    transition: transform 0.3s;

    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-image: linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.6));
      opacity: 0;
      z-index: -1;
      transition: opacity 0.3s;
    }

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
      border-radius: 4px;
      top: 0;
      left: 0;
      width: var(--poster-size);
      height: var(--poster-size);
      transform-origin: left top;
      transform: translate(16px, 10px) scale(var(--scale-ratio));
      transition: transform 0.3s;
      background: url('http://p1.music.126.net/fZXYjrs6ye2IIWYkfWazJg==/109951165849906351.jpg?param=800y800')
        center center no-repeat;
      background-size: 100%;
    }

    // mini控制中心
    .player-mini-controls {
      position: absolute;
      top: 0;
      right: 0;
      left: 78px;
      height: 78px;
      .player-mini-controls-spacing {
        width: 100%;
        height: 100%;
        padding: 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .player-mini-desc {
          font-size: 20px;
          padding-right: 10px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        .player-mini-controls-btn {
          display: flex;
          align-items: center;
          .btn-play,
          .btn-next {
            border: none;
            padding: 10px;
            display: flex;
            justify-content: center;
            align-items: center;
            > img {
              display: block;
            }
          }
          .btn-play > img {
            height: 22px;
          }
          .btn-next > img {
            height: 28px;
          }
        }
      }
    }

    // 控制中心
    .player-controls {
      margin-top: 50vh;
      height: 50vh;
      width: 100%;
      padding: 48px 24px 0;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      // background-color: #ccc;

      // 进度条
      .player-controls-progress {
        height: 3px;
        width: 100%;
        margin: 16px 0;
        border-radius: 3px;
        background: #ccc;
        .player-controls-progress-info {
          width: 100%;
          position: relative;
          display: flex;
          justify-content: space-between;
          > div {
            margin-top: 6px;
            color: #ccc;
            font-size: 13px;
          }
        }
      }

      // 歌曲信息
      .player-controls-info {
        .player-controls-info-h2 {
          font-size: 22px;
          color: #fff;
        }
        .player-controls-info-p {
          font-size: 21px;
          color: rgba(255, 255, 255, 0.5);
          line-height: 1;
        }
      }

      // 控制按钮
      .player-controls-btn {
        display: flex;
        justify-content: space-between;
        padding: 32px 24px;
        .btn-play {
          > img {
            width: 46px;
            height: 46px;
          }
        }
        > button {
          border: none;
          display: flex;
          justify-content: center;
          align-items: center;
          > img {
            height: 50px;
          }
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
          background: #ccc;
          position: relative;
          .volume-progress-handler {
            height: 20px;
            width: 20px;
            border-radius: 50%;
            background-color: #999;
            position: absolute;
            top: clac(12px /2 * -1);
            left: clac(12px /2 * -1);
          }
        }
      }

      .player-tools-bar {
        height: 140px;
        flex-shrink: 0;
        width: 100%;
      }
    }

    &:hover {
      will-change: auto;
    }
  }
}

// 展开后样式
.player-poster-display {
  .player-spacing::after {
    opacity: 1 !important;
  }
  .player-poster {
    transform: translate(var(--poster-translateX), var(--poster-translateY))
      scale(1) !important;
    border-radius: 12px !important;
    box-shadow: 0px 16px 20px rgba(94, 84, 77, 0.6) !important;
  }
}
</style>