<!--
Author: zusheng
Date: 2022-04-10 21:10:50
LastEditTime: 2022-04-11 00:59:22
Description: 默认布局
FilePath: \vite-music-player\src\components\LayoutDefault.vue
-->

<template>
  <div id="default-layout">
    <nav id="nav">
      <div class="nav-spacing">
        <div class="logo">
          <img class="logo-img" src="../assets/logo_b.png" alt="" />
        </div>

        <ul class="nav-list">
          <li class="nav-list-item">
            <img class="nav-list-item-icon" src="../assets/icon-home.svg" alt="" />
            首页
          </li>
          <li class="nav-list-item">
            <img class="nav-list-item-icon" src="../assets/icon-discovery.svg" alt="" />
            探索
          </li>
          <li class="nav-list-item">
            <img class="nav-list-item-icon" src="../assets/icon-library.svg" alt="" />
            媒体库
          </li>
          <li class="nav-list-item">
            <img class="nav-list-item-icon" src="../assets/icon-search.svg" alt="" />
            搜索
          </li>
        </ul>
      </div>
    </nav>

    <main id="main">
      <header id="header"></header>
      <div id="player"></div>
    </main>
  </div>
</template>

<script setup lang="ts">
import store from '../store'

store.dispatch('getCommunity').then((res) => {
  console.log(res)
})
</script>

<style lang="less">
#default-layout {
  width: 100%;
  min-height: 100vh;
  display: flex;

  #nav {
    min-width: 220px;
    max-width: 300px;
    width: 20vw;
    height: 100vh;
    background: rgba(246, 246, 246, 1);
    .nav-spacing {
      padding: 16px;
      height: 100%;

      .logo {
        width: 100%;
        padding: 16px;
        .logo-img {
          height: 50px;
        }
      }

      .nav-list {
        margin-top: 16px;
        > .nav-list-item {
          display: flex;
          align-items: center;
          font-size: 16px;
          padding: 16px;
          cursor: pointer;
          border-radius: 4px;
          .nav-list-item-icon {
            height: 24px;
            width: 24px;
            margin-right: 16px;
          }
          &:hover {
            background: rgba(0, 0, 0, 0.1);
          }
        }
      }
    }
  }

  #main {
    height: 100vh;
    width: 100%;
    position: relative;

    #header {
      width: 100%;
      height: 72px;
      background: rgba(240, 240, 240, 1);
    }

    #player {
      width: 100%;
      height: 72px;
      position: absolute;
      bottom: 0;
      right: 0;
      border-top: 1px solid rgba(0, 0, 0, 0.1);
    }
  }
}
</style>
