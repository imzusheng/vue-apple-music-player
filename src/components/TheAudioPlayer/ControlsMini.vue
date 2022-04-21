<!--
Author: zusheng
Date: 2022-04-19 20:58:30
LastEditTime: 2022-04-20 21:19:01
Description: mini控制中心
FilePath: \vite-music-player\src\components\TheAudioPlayer\ControlsMini.vue
-->

<script setup lang="ts">
import { inject } from 'vue'

defineProps<{ title: string }>()

const setData: any = inject('setData')
const parentData: any = inject('data')

function playStatusChange(status: boolean) {
  if (status) parentData.audioRef.play()
  else parentData.audioRef.pause()
  setData('playStatus', status)
}
</script>

<template>
  <div class="player-mini-controls" v-show="!parentData.posterDisplay">
    <div class="player-mini-controls-spacing">
      <div class="player-mini-desc">{{ title }}</div>
      <div class="player-mini-controls-btn">
        <button
          class="btn-play"
          v-show="parentData.playStatus"
          @click="playStatusChange(false)"
        ></button>
        <button
          class="btn-pause"
          v-show="!parentData.playStatus"
          @click="playStatusChange(true)"
        ></button>
        <button class="btn-next"></button>
      </div>
    </div>
  </div>
</template>

<style lang="less">
// mini控制中心
.player-mini-controls {
  position: absolute;
  top: 0;
  right: 0;
  left: 72px;
  height: 72px;
  .player-mini-controls-spacing {
    width: 100%;
    height: 100%;
    padding: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    // 歌名
    .player-mini-desc {
      font-size: 20px;
      padding-right: 10px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    // 按钮button
    .player-mini-controls-btn {
      display: flex;
      align-items: center;
      .btn-play,
      .btn-pause,
      .btn-next {
        border: none;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0 10px;
        background-size: 100%;
        background-position: center center;
        background-repeat: no-repeat;
      }
      .btn-play {
        background-image: url('@/assets/player-controls-play.svg');
        width: 26px;
        height: 26px;
      }
      .btn-pause {
        background-image: url('@/assets/icon-apple-center.png');
        width: 25px;
        height: 25px;
      }
      .btn-next {
        background-image: url('@/assets/icon-apple-next.png');
        width: 30px;
        height: 30px;
      }
    }
  }
}
</style>
