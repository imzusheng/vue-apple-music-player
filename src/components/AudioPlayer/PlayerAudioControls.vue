<!--
Author: zusheng
Date: 2022-04-17 11:11:37
LastEditTime: 2022-04-17 18:51:57
Description: 播放器控制中心
FilePath: \vite-music-player\src\components\AudioPlayer\PlayerAudioControls.vue
-->



<script lang="ts" setup>
import { inject } from 'vue'

const parentData = inject<any>('data')
const setData = inject('setData', (name: string, value: any) => {})

// 开始/暂停音乐
function playChange() {
  if (parentData.audioRef.src) {
    if (parentData.audioRef.paused) {
      parentData.audioRef.play()
    } else {
      parentData.audioRef.pause()
    }
  } else {
  }
}

// 切换播放模式
function modelChange() {
  if (parentData.model === 'common') {
    setData('model', 'list')
    // this.setTips('列表循环播放')
  } else if (parentData.model === 'list') {
    setData('model', 'repeat')
    // this.setTips('单曲播放')
  } else if (parentData.model === 'repeat') {
    setData('model', 'common')
    // this.setTips('列表播放')
  }
  const loop = parentData.loop === 'repeat' ? 'on' : 'off'
  localStorage.setItem('loop', loop)
  localStorage.setItem('model', parentData.loop)
}

// 设置是否随机播放
function randomPlay() {
  parentData.random = parentData.random === 'on' ? 'off' : 'on'
  localStorage.setItem('random', parentData.random)
  // this.setTips(this.random === 'on' ? '开启随机播放' : '关闭随机播放')
}

function prev() {}

function next() {}
</script>

<template>
  <div id="player-controls">
    <div class="player-controls-left">
      <!-- 随机播放 -->
      <button @click="randomPlay">
        <img
          v-if="parentData.random === 'on'"
          src="@/assets/player-controls-random-active.svg"
          alt=""
        />
        <img v-else src="@/assets/player-controls-random.svg" alt="" />
      </button>
      <!-- 上一首 -->
      <button @click="prev">
        <img src="@/assets/player-controls-prev.svg" alt="" />
      </button>
    </div>
    <div class="player-controls-center">
      <button
        class="player-controls-center-btn"
        title="播放/暂停"
        @click="playChange"
        :disabled="parentData.loading"
      >
        <!-- 开始 -->
        <img
          v-if="parentData.playStatus"
          src="@/assets/player-controls-play.svg"
          alt=""
        />
        <!-- 暂停 -->
        <img v-else src="@/assets/player-controls-pause.svg" alt="" />
      </button>
    </div>
    <div class="player-controls-right">
      <!-- 按钮 下一首 -->
      <button @click="next">
        <img src="@/assets/player-controls-next.svg" alt="" />
      </button>
      <!-- 按钮 播放模式 -->
      <button
        @click="modelChange"
        :class="`control-button-${parentData.model}`"
      >
        <!-- 默认 -->
        <img
          v-if="parentData.model === 'common'"
          src="@/assets/player-controls-model-common.svg"
          alt=""
        />
        <!-- 列表循环  -->
        <img
          v-else-if="parentData.model === 'list'"
          src="@/assets/player-controls-model-list.svg"
          alt=""
        />
        <!-- 单曲循环 -->
        <img v-else src="@/assets/player-controls-model-repeat.svg" alt="" />
      </button>
    </div>
  </div>
</template>

<style lang="less">
// 控制按钮
#player-controls {
  display: flex;
  width: 40%;
  justify-content: center;

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

  .player-controls-left,
  .player-controls-center,
  .player-controls-right {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .player-controls-center {
    margin: 0 12px;
    .player-controls-center-btn {
      border-radius: 50%;
      background: #141414;
      transition: all 0.2s;
      > img {
        width: 13px;
      }
    }

    //&:hover {
    //  transform: translate3d(0, 0, 0) scale(1.08);
    //}
  }

  .player-controls-right {
    position: relative;
    // 列表播放
    .control-button-list {
      &,
      * {
        color: rgba(240, 0, 0, 0.8);
      }

      &::after {
        content: '';
        background-color: currentColor;
        border-radius: 50%;
        bottom: 0;
        display: block;
        height: 4px;
        position: absolute;
        width: 4px;
      }
    }

    // 单曲循环播放
    .control-button-repeat {
      &,
      * {
        color: rgba(240, 0, 0, 0.8);
      }

      &::after {
        content: '';
        background-color: currentColor;
        border-radius: 50%;
        bottom: 0;
        display: block;
        height: 4px;
        position: absolute;
        width: 4px;
      }
    }
  }

  @media screen and (max-width: 728px) {
    & {
      width: unset;
      flex-shrink: 0;
      .player-controls-left,
      .player-controls-right {
        display: none;
      }
      .player-controls-center {
        margin: 0;
        .player-controls-center-btn {
          background: #141414;
          width: 42px;
          height: 42px;
          > img {
            width: 13px;
          }
        }
      }
    }
  }
}
</style>
