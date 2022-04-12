<!--
Author: zusheng
Date: 2022-04-10 20:15:36
LastEditTime: 2022-04-11 19:13:27
Description: 入口
FilePath: \vite-music-player\src\App.vue
-->

<script setup lang="ts"></script>

<template>
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
  scrollbar-color: rgba(255, 255, 255, 0.1) rgb(12, 12, 12);
  scrollbar-width: auto;
}

::-webkit-scrollbar {
  width: 14px;
  height: 14px;
  background-color: #121212;
}

/*定义滚动条轨道 内阴影+圆角*/
::-webkit-scrollbar-track {
  background-color: transparent;
}

/*定义滑块 内阴影+圆角*/
::-webkit-scrollbar-thumb {
  border-radius: 1px;
  background-color: rgba(255, 255, 255, 0.3);
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

.user-not-select {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

:root {
  // grid布局列数
  --column-count: 5;
  // 头部高度
  --header-height: 72px;

  @media screen and (min-width: 1200px) {
    --column-count: 6;
  }

  @media screen and (max-width: 1200px) {
    --column-count: 5;
  }

  @media screen and (max-width: 1068px) {
    --column-count: 4;
  }

  @media screen and (max-width: 768px) {
    --column-count: 3;
  }

  @media screen and (max-width: 628px) {
    --column-count: 2;
  }
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
  padding: calc(var(--header-height) + 16px) 32px 32px;
}
</style>
