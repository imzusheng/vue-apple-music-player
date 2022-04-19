<!--
Author: zusheng
Date: 2022-04-19 09:19:50
LastEditTime: 2022-04-19 10:02:05
Description: 进度条
FilePath: \vite-music-player\src\components\TheAudioPlayerProgress.vue
-->


<script setup lang="ts">
import { durationConvert } from '@/common/util'
import { reactive, ref, onMounted, inject } from 'vue'

const parentData = inject<any>('data')

const data = reactive<any>({
  // 是否是调整状态
  audioSeeking: false
})

const playerProgressRef = ref<any>()

onMounted(() => {
  /**
   * 调整音乐播放进度
   */

  // 鼠标在进度条上移动时调用(1)显示当前播放时间
  playerProgressRef.value.addEventListener('mousemove', progressMousedMove)

  // 在进度条按下鼠标时 -------------------------------------开始调整进度条
  playerProgressRef.value.addEventListener('mousedown', () => {
    const mouseupHandle = (e: any) => {
      progressMousedrag(e) // 单击时触发调整进度,因为单击没有触发mousemove
      document.removeEventListener('mousemove', mousemoveHandle)
      document.removeEventListener('mouseup', mouseupHandle)
      // 恢复播放状态
      data.audioSeeking = false
      parentData.audioRef.muted = false
    }

    // 设置播放状态
    data.audioSeeking = true // 调整时标记状态为调整中(seeking)
    parentData.audioRef.muted = true

    document.addEventListener('mousemove', mousemoveHandle) // 监听鼠标移动
    document.addEventListener('mouseup', mouseupHandle) // 监听鼠标松开 ---------------------------结束调整进度条
  })

  // 移动端触摸调整
  playerProgressRef.value.addEventListener(
    'touchstart',
    () => {
      const mouseupHandle = (e: any) => {
        progressMousedrag(e) // 单击时触发调整进度,因为单击没有触发mousemove
        document.removeEventListener('touchmove', mousemoveHandle)
        document.removeEventListener('touchend', mouseupHandle)
        // 恢复播放状态
        data.audioSeeking = false
        parentData.audioRef.muted = false
      }

      // 设置播放状态
      data.audioSeeking = true // 调整时标记状态为调整中(seeking)
      parentData.audioRef.muted = true

      document.addEventListener('touchmove', mousemoveHandle) // 监听鼠标移动
      document.addEventListener('touchend', mouseupHandle) // 监听鼠标松开 ---------------------------结束调整进度条
    },
    { passive: false }
  )
})

/**
 * 1.
 * 鼠标在进度条上方移动时显示当前时间
 * @param e event
 */
function progressMousedMove(e: any) {
  const clientX =
    e.clientX || e?.touches[0]?.clientX || e?.changedTouches[0]?.clientX

  // 鼠标移动的百分比
  let x = (clientX / playerProgressRef.value.offsetWidth) * 100

  // 处理临界值
  if (x <= 1) {
    x = 0
  } else if (x >= 99) {
    x = 100
  }

  // 获取提示框显示的位置，X轴坐标
  let mouseX = clientX
  const mouseXMin = 30
  const mouseXmax = playerProgressRef.value.offsetWidth - 30
  if (mouseX < mouseXMin) {
    mouseX = mouseXMin
  } else if (mouseX > mouseXmax) {
    mouseX = mouseXmax
  }
}

/**
 * 2.
 * 鼠标拖拽进度条时
 * @param e
 */
function progressMousedrag(e: any) {
  // 鼠标移动的百分比
  const clientX =
    e.clientX || e?.touches[0]?.clientX || e?.changedTouches[0]?.clientX
  const xRatio = clientX / playerProgressRef.value.offsetWidth
  // 改变歌曲时间
  parentData.audioRef.currentTime = parentData.duration * xRatio
}

/**
 * 3.
 * 一起调用,当在进度条上按下鼠标并拖动时
 * @param e
 */
function mousemoveHandle(e: any) {
  progressMousedMove(e)
  progressMousedrag(e)
}
</script>


<template>
  <div
    class="player-progress"
    ref="playerProgressRef"
    :class="{ 'player-seeking': data.audioSeeking }"
  >
    <!-- 滑轨 深灰色-->
    <div class="player-progress-rail">
      <!-- 小圆点 -->
      <!-- <div
        class="player-progress-point"
        :style="{ transform: ` translate(${parentData.progress}%, -50%)` }"
      ></div> -->
      <!-- 播放进度 红色 -->
      <div
        class="player-progress-bg"
        :class="{ 'player-progress-bg-animate': !data.audioSeeking }"
        :style="{ 'clip-path': `inset(0 ${100 - parentData.progress}% 0 0)` }"
      />
    </div>
  </div>
</template>

<style lang="less" scoped>
// 进度条
.player-progress {
  margin: 16px 0;
  // 透明区域高度
  --player-progress-height: 36px;
  width: 100%;
  // 透明区域，鼠标进入后可以调整进度条
  height: var(--player-progress-height);
  background: transparent;
  z-index: 2;
  display: flex;
  align-items: center;
  cursor: pointer;

  .player-progress-rail {
    --progress-rail-height: 3px;
    width: 100%;
    height: var(--progress-rail-height);
    background: #ccc;
    position: relative;
    overflow: hidden;
    border-radius: var(--progress-rail-height);
  }

  // 小圆点
  .player-progress-point {
    display: none;
    --progress-point-size: 16px;
    height: var(--progress-point-size);
    width: var(--progress-point-size);
    background: #fff;
    box-shadow: 1px 0 8px rgba(100, 100, 100, 0.6);
    position: absolute;
    right: calc(var(--progress-point-size) * -1);
    top: 50%;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    z-index: 3;
  }

  // 播放进度
  .player-progress-bg {
    width: 100%;
    height: 100%;
    position: relative;
    z-index: 2;
    background: rgba(240, 0, 0, 0.8);
    clip-path: inset(0 50% 0 0);
  }

  player-progress-bg-animate {
    transition: transform 0.25s linear 0s;
  }
}

// 正在拖动状态的进度条
.player-seeking {
  .player-progress-rail {
    width: 100%;
    height: 8px;

    .player-progress-point {
      display: block;
    }
  }
}
</style>
