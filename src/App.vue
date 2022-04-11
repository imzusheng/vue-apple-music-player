<!--
Author: zusheng
Date: 2022-04-10 20:15:36
LastEditTime: 2022-04-10 22:06:24
Description: 入口
FilePath: \vite-music-player\src\App.vue
-->

<script setup lang="ts"></script>

<template>
  <router-view />
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
</style>
