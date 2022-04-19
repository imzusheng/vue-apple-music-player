<!--
Author: zusheng
Date: 2022-04-19 21:10:46
LastEditTime: 2022-04-19 21:15:23
Description: 标准控制中心（大码）
FilePath: \vite-music-player\src\components\TheAudioPlayer\ControlsStandard.vue
-->

<script setup lang="ts">
import { inject, computed } from 'vue'
import { durationConvert } from '@/common/util'

defineProps<{ title: string; artist: string }>()

const setData: any = inject('setData')
const parentData: any = inject('data')

function playStatusChange(status: boolean) {
  if (status) parentData.audioRef.play()
  else parentData.audioRef.pause()
  setData('playStatus', status)
}

const getDurationConvert = computed(() => {
  return function (time: any) {
    return durationConvert(time)
  }
})
</script>

<template>
  <div class="player-controls">
    <!-- 歌曲信息 -->
    <div class="player-controls-info">
      <h2 class="player-controls-info-h2">{{ title }}</h2>
      <p class="player-controls-info-p">{{ artist }}</p>
    </div>

    <!-- 进度条 -->
    <div class="player-controls-progress" ref="controlsProgress">
      <!-- 进度条本体 -->
      <div
        class="player-controls-progress-rail"
        :style="{
          'clip-path': `inset(0 ${100 - parentData.progress}% 0 0)`
        }"
      ></div>
      <!-- 调整按钮 -->
      <div
        class="player-progress-handler-btn"
        :class="{ 'player-progress-handler-btn-seeking': parentData.seeking }"
        :style="{ transform: ` translateX(${parentData.progress}%)` }"
      ></div>
      <button
        class="player-progress-handler"
        parentData-func-progress="on"
      ></button>
      <div class="player-controls-progress-info">
        <div>{{ getDurationConvert(parentData.curTime) }}</div>
        <div>{{ getDurationConvert(parentData.duration) }}</div>
      </div>
    </div>

    <!-- 中控 -->
    <div class="player-controls-btn">
      <button class="player-controls-btn-prev"></button>
      <button
        v-show="parentData.playStatus"
        class="player-controls-btn-play"
        @click="playStatusChange(false)"
      ></button>
      <button
        v-show="!parentData.playStatus"
        class="player-controls-btn-pause"
        @click="playStatusChange(true)"
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
            'clip-path': `inset(0 ${100 - parentData.volume}% 0 0)`
          }"
          class="player-controls-volume-bg"
        ></div>
        <!-- 圆形按钮 -->
        <button
          :style="{ transform: ` translateX(${parentData.volume}%)` }"
          class="volume-progress-handler"
          parentData-func-volume="on"
        ></button>
      </div>
      <div>
        <img src="@/assets/player-controls-volume-high.svg" alt="" />
      </div>
    </div>

    <div class="player-tools-bar"></div>
  </div>
</template>

<style lang="less">
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
    .player-controls-info-h2 {
      font-size: 22px;
      color: rgba(0, 0, 0, 0.8);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
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
</style>
