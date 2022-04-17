<!--
Author: zusheng
Date: 2022-04-10 20:15:36
LastEditTime: 2022-04-17 19:29:35
Description: 入口
FilePath: \vite-music-player\src\App.vue
-->

<script setup lang="ts">
import { mapMutationsHelpers } from '@/common/util'

const { setAudioDisplay, setAudioInfo } = mapMutationsHelpers(null, [
  'setAudioUrl',
  'setAudioDisplay',
  'setAudioInfo'
])

// 恢复localStorage中的数据
function restore() {
  const audioInfo = localStorage.getItem('audioInfo')
  if (audioInfo) {
    const parsedInfo = JSON.parse(audioInfo)
    setAudioInfo(parsedInfo)
    setAudioDisplay(true)
  }
}

restore()
</script>

<template>
  <!-- v-columnMatch指令 js响应式布局，计算gird列数 -->
  <div id="view" v-columnMatch>
    <router-view />
  </div>
</template>

<style lang="less">
* {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-overflow-scrolling: touch;
  -webkit-tap-highlight-color: transparent;

  padding: 0;
  margin: 0;
  box-sizing: border-box;
  background: transparent;
  text-decoration: none;
  list-style: none;
  line-height: 1.6;
  z-index: 0;
}

html {
  overflow-y: scroll;
  scrollbar-color: rgba(0, 0, 0, 0.2) #fff;
  scrollbar-width: auto;

  a {
    -webkit-tap-highlight-color: rgba(255, 255, 255, 0) !important;
  }
}

.disable-hover {
  pointer-events: none;
}

.user-not-select {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

:root {
  // 左侧导航栏宽度
  --nav-left-width: 240px;

  // grid布局列数
  --column-count: 5;

  // 头部高度
  --header-height: 72px;

  // 动画进度
  --animation-ratio: 0;

  // 动画触发点，一般是100vh高度
  --animation-target: 0;

  // 主题色
  --theme-color: rgba(212, 42, 42, 0.8);

  // gap间隙
  --grid-gap: 24px;

  // 页面两边距
  --page-spacing: 32px;

  // @media screen and (min-width: 1200px) {
  // }

  // @media screen and (max-width: 1200px) {
  // }

  // @media screen and (max-width: 1068px) {
  // }

  @media screen and (max-width: 768px) {
    --grid-gap: 10px;
    --page-spacing: 16px;
  }

  // @media screen and (max-width: 628px) {
  // }
}

.flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.flex-al-end {
  display: flex;
  justify-content: center;
  align-items: flex-end;
}

.spacing {
  padding: calc(var(--header-height) + 16px) var(--page-spacing)
    var(--page-spacing);
}

::-webkit-scrollbar {
  width: 14px;
  height: 14px;
  background-color: #fff;
}

/*定义滚动条轨道 内阴影+圆角*/
::-webkit-scrollbar-track {
  background-color: transparent;
}

/*定义滑块 内阴影+圆角*/
::-webkit-scrollbar-thumb {
  border-radius: 1px;
  background-color: rgba(0, 0, 0, 0.2);
}

::-webkit-input-placeholder {
  /* WebKit browsers */
  color: rgba(255, 255, 255, 0.35);
}

:-moz-placeholder {
  /* Mozilla Firefox 4 to 18 */
  color: rgba(255, 255, 255, 0.35);
}

::-moz-placeholder {
  /* Mozilla Firefox 19+ */
  color: rgba(255, 255, 255, 0.35);
}

:-ms-input-placeholder {
  /* Internet Explorer 10+ */
  color: rgba(255, 255, 255, 0.35);
}
</style>
