<!--
Author: zusheng
Date: 2022-04-10 21:10:50
LastEditTime: 2022-04-11 21:37:48
Description: 默认布局
FilePath: \vite-music-player\src\views\LayoutDefault.vue
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
            <img
              class="nav-list-item-icon"
              src="../assets/icon-home.svg"
              alt=""
            />
            首页
          </li>
          <li class="nav-list-item">
            <img
              class="nav-list-item-icon"
              src="../assets/icon-discovery.svg"
              alt=""
            />
            探索
          </li>
          <li class="nav-list-item">
            <img
              class="nav-list-item-icon"
              src="../assets/icon-library.svg"
              alt=""
            />
            媒体库
          </li>
          <li class="nav-list-item">
            <img
              class="nav-list-item-icon"
              src="../assets/icon-search.svg"
              alt=""
            />
            搜索
          </li>
        </ul>
      </div>
    </nav>

    <main id="main">
      <header id="header" ref="header">
        <div class="header-action flex-center">
          <button class="header-action-prev flex-center">
            <img src="@/assets/icon-prev.svg" alt="" />
          </button>
          <button class="header-action-next flex-center">
            <img src="@/assets/icon-next.svg" alt="" />
          </button>
        </div>
      </header>

      <router-view />

      <div id="player"></div>
    </main>
  </div>
</template>

<style lang="less">
#default-layout {
  width: 100%;
  min-height: 100vh;
  display: flex;

  #nav {
    flex-shrink: 0;
    width: 240px;
    height: 100vh;
    background: rgba(246, 246, 246, 1);
    position: fixed;
    z-index: 1;
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
    width: 100%;
    padding-left: 240px;
    position: relative;

    #header {
      position: fixed;
      width: 100%;
      width: 100%;
      height: var(--header-height);
      background: #f6f6f6;
      z-index: 999;
      // opacity: 0.1;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .header-action {
        margin: 0 16px;
        .header-action-prev,
        .header-action-next {
          border: none;
          background: rgba(0, 0, 0, 0.1);
          padding: 8px;
          border-radius: 50%;
          margin: 0 10px;
          cursor: pointer;
        }
      }
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
