<!--
Author: zusheng
Date: 2022-04-12 11:22:11
LastEditTime: 2022-04-12 11:28:26
Description: 头部
FilePath: \vite-music-player\src\components\TheHeader.vue
-->
<script lang="ts" setup>
import { provide, ref } from 'vue'

const header = ref<HTMLElement | null>(null)

provide('getHeaderRef', () => {
  return header
})
</script>


<template>
  <header id="header" ref="header">
    <!-- 前进后退按钮 -->
    <div class="header-action flex-center">
      <button class="header-action-prev flex-center">
        <img class="icon" src="@/assets/icon-prev.svg" alt="" />
      </button>
      <button class="header-action-next flex-center">
        <img class="icon" src="@/assets/icon-next.svg" alt="" />
      </button>
      <button aria-label="播放全部" class="header-action-play flex-center">
        <img class="icon" src="@/assets/icon-song-play.svg" alt="" />
      </button>
      <div class="artist-action-title">陈奕迅</div>
    </div>
  </header>
</template>

<style lang="less">
#header {
  position: fixed;
  width: 100%;
  width: 100%;
  height: var(--header-height);
  background-image: linear-gradient(
    rgba(246, 246, 246, 1),
    rgba(246, 246, 246, calc(0.9 + var(--animation-ratio) * 0.1))
  );
  z-index: 999;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .header-action {
    margin: 0 16px;
    .header-action-prev,
    .header-action-next,
    .header-action-play {
      border: none;
      background: rgba(0, 0, 0, 0.1);
      padding: 8px;
      border-radius: 50%;
      margin: 0 10px;
      cursor: pointer;
      .icon {
        height: 24px;
        width: 24px;
      }
    }
    // 播放按钮
    .header-action-play {
      height: 52px;
      width: 52px;
      background: var(--theme-color);
      opacity: var(--animation-target);
      transition: opacity 0.2s;
    }
    .artist-action-title {
      font-size: 26px;
      font-weight: 700;
      padding-left: 16px;
      opacity: var(--animation-target);
      transition: opacity 0.2s;
      transition-delay: 0.02s;
    }
  }
}
</style>
