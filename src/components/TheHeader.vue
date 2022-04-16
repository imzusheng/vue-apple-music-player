<!--
Author: zusheng
Date: 2022-04-12 11:22:11
LastEditTime: 2022-04-16 22:25:58
Description: 头部
FilePath: \vite-music-player\src\components\TheHeader.vue
-->
<script lang="ts" setup>
import { useStore } from '@/store'
import { useRouter } from 'vue-router'
import { provide, ref } from 'vue'

const store = useStore()
const router = useRouter()
const header = ref<HTMLElement | null>(null)

provide('getHeaderRef', () => {
  return header
})

const routerPrev = () => {
  router.go(-1)
}
const routerNext = () => {
  router.go(1)
}
</script>


<template>
  <header id="header" ref="header">
    <!-- 前进后退按钮 -->
    <div class="header-action flex-center">
      <button class="header-action-prev flex-center" @click="routerPrev">
        <img class="icon" src="@/assets/icon-prev.svg" alt="" />
      </button>
      <button class="header-action-next flex-center" @click="routerNext">
        <img class="icon" src="@/assets/icon-next.svg" alt="" />
      </button>
      <button aria-label="播放全部" class="header-action-play flex-center">
        <img class="icon" src="@/assets/icon-song-play.svg" alt="" />
      </button>
      <div class="artist-action-title">{{ store.state.headerText }}</div>
    </div>
  </header>
</template>

<style lang="less">
#header {
  position: fixed;
  width: calc(100% - var(--nav-left-width));
  height: var(--header-height);
  background: rgba(246, 246, 246, calc(var(--animation-ratio) * 1));
  z-index: 999;
  display: flex;
  align-items: center;
  .header-action {
    width: 100%;
    padding: 0 16px;
    display: flex;
    justify-content: flex-start;
    .header-action-prev,
    .header-action-next,
    .header-action-play {
      flex-shrink: 0;
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
      padding: 0 32px 0 16px;
      opacity: var(--animation-target);
      transition: opacity 0.2s;
      transition-delay: 0.02s;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
</style>
