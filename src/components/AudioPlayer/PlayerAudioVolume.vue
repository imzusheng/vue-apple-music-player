<!--
Author: zusheng
Date: 2022-04-17 12:27:31
LastEditTime: 2022-04-17 19:05:44
Description: 音量调整组件
FilePath: \vite-music-player\src\components\AudioPlayer\PlayerAudioVolume.vue
-->


<script setup lang="ts">
import { inject, computed, onMounted, ref } from 'vue'

const parentData = inject<any>('data')
const volumeProgressRef = ref<any>()

// 获取音量值
const getVolumeProgress = computed(() => {
  return `${parentData.volume - 100}px`
})

// 切换静音
function mutedChange() {
  if (parentData.volume > 0) {
    parentData.volume = 0
  } else {
    const befVolume = Number(localStorage.getItem('volume'))
    parentData.volume = befVolume === 0 ? 30 : befVolume
  }
  parentData.audioRef.volume = parentData.volume / 100
}

// 调整音量
function updateVolume(x: number) {
  if (parentData.volume !== x) {
    parentData.volume = x
    parentData.audioRef.volume = parentData.volume / 100
    localStorage.setItem('volume', x.toString())
  }
}

onMounted(() => {
  /**
   * 调整音量
   */
  // 1.鼠标拖动时计算调整音量
  const volumeMouseMove = (e: any) => {
    let x = e.clientX - volumeProgressRef.value.offsetLeft
    if (x <= 0) x = 0
    else if (x >= 100) x = 100
    updateVolume(x)
  }
  const volumeMouseMoveHandle = (e) => {
    volumeMouseMove(e)
    document.removeEventListener('mousemove', volumeMouseMove)
    document.removeEventListener('mouseup', volumeMouseMoveHandle)
  }
  // 2.鼠标按下时，监听鼠标移动 -------------------------------------开始调整进度条
  volumeProgressRef.value.addEventListener('mousedown', () => {
    document.addEventListener('mousemove', volumeMouseMove)
    document.addEventListener('mouseup', volumeMouseMoveHandle) // ---------------------------结束调整进度条
  })
})
//     // 前往播放列表
//     toPlayQueue() {
//       if (!this.$store.state.playQueueStatus) {
//         this.$store.commit('setLoading', true)
//         this.$router.push({ name: 'playqueue' })
//       } else {
//         this.$router.go(-1)
//       }
//     }
//   }
</script>


<template>
  <div class="player-volume">
    <div class="btn-row">
      <!-- 播放队列 -->
      <button title="播放队列" class="play-queue">
        <!-- :class="{ 'play-queue-open': $store.state.playQueueStatus }"
        @click="toPlayQueue" -->
        <!-- v-if="!$store.state.playQueueStatus" -->
        <img src="@/assets/player-controls-queue.svg" alt="" />
        <!-- <img v-else src="@/assets/player-controls-queue-action.svg" alt="" /> -->
      </button>

      <!-- 单击切换静音 -->
      <button title="静音" class="switch-volume" @click="mutedChange">
        <!-- 静音icon -->
        <img
          v-if="parentData.volume === 0"
          src="@/assets/player-controls-volume-muted.svg"
          alt=""
        />
        <!-- 低音量icon -->
        <img
          v-else-if="parentData.volume <= 25"
          src="@/assets/player-controls-volume-low.svg"
          alt=""
        />
        <!-- 中音量icon -->
        <img
          v-else-if="parentData.volume <= 75"
          src="@/assets/player-controls-volume-medium.svg"
          alt=""
        />
        <!-- 高音量icon -->
        <img v-else src="@/assets/player-controls-volume-high.svg" alt="" />
      </button>
    </div>

    <!-- 音量调整滑轨 -->
    <div class="player-volume-progress" ref="volumeProgressRef">
      <!-- 滑轨小圆点 -->
      <div
        class="player-volume-point"
        :style="{ transform: `translateX(${getVolumeProgress})` }"
      ></div>
      <!-- 滑轨背景 s -->
      <div class="player-progress-bg">
        <!-- 滑轨前景 s -->
        <div
          class="player-progress-fg"
          :style="{ transform: `translateX(${getVolumeProgress})` }"
        ></div>
      </div>
    </div>
  </div>
</template>

<style lang="less">
.player-volume {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;

  button {
    width: 32px;
    height: 32px;
    border: none;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 6px;
    cursor: pointer;
  }

  .btn-row {
    display: flex;
    .play-queue,
    .switch-volume {
      position: relative;
      margin: 0 4px 0 0 !important;
    }
    .play-queue-open {
      &::after {
        content: '';
        background-color: rgba(240, 0, 0, 0.8);
        border-radius: 50%;
        bottom: 0;
        display: block;
        height: 4px;
        position: absolute;
        width: 4px;
      }
    }
  }

  .player-volume-progress {
    height: 12px;
    width: 100px;
    display: flex;
    align-items: center;
    position: relative;
    .hidden-label {
      visibility: hidden;
      width: 0;
      height: 0;
    }
    .player-volume-point {
      height: 12px;
      width: 12px;
      background: rgba(0, 0, 0, 0.9);
      border-radius: 50%;
      position: absolute;
      right: -6px;
      left: 94px;
      z-index: 100;
      cursor: pointer;
    }
    .player-progress-bg {
      width: 100px;
      height: 4px;
      border-radius: 4px;
      position: relative;
      background: rgba(200, 200, 200, 0.8);
      overflow: hidden;
      .player-progress-fg {
        height: 100%;
        width: 100%;
        transform: translateX(-100%);
        background: rgba(0, 0, 0, 1);
      }
    }
  }

  @media screen and (max-width: 728px) {
    & {
      display: none;
    }
  }
}
</style>
