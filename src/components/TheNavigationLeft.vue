<!--
Author: zusheng
Date: 2022-04-12 11:17:48
LastEditTime: 2022-04-14 15:55:40
Description: 左侧导航栏
FilePath: \vite-music-player\src\components\TheNavigationLeft.vue
-->
<script lang="ts" setup>
import iconHome from '@/assets/icon-home.svg'
import iconDiscovery from '@/assets/icon-discovery.svg'
import iconLibrary from '@/assets/icon-library.svg'
import iconSearch from '@/assets/icon-search.svg'

const navConfig = [
  { title: '首页', icon: iconHome, routerName: 'home' },
  { title: '探索', icon: iconDiscovery, routerName: 'discovery' },
  { title: '媒体库', icon: iconLibrary, routerName: 'home' },
  { title: '搜索', icon: iconSearch, routerName: 'home' }
]
</script>

<template>
  <nav id="nav">
    <div class="nav-spacing">
      <router-link class="logo" :to="{ name: 'home' }">
        <img class="logo-img" src="../assets/logo_b.png" alt="" />
      </router-link>

      <ul class="nav-list">
        <li class="nav-list-item" v-for="item in navConfig" :key="item.title">
          <router-link class="nav-list-link" :to="{ name: item.routerName }">
            <img class="nav-list-item-icon" :src="item.icon" alt="" />
            {{ item.title }}
          </router-link>
        </li>
      </ul>
    </div>
  </nav>
</template>

<style lang="less">
#nav {
  flex-shrink: 0;
  width: var(--nav-left-width);
  height: 100vh;
  background: rgba(246, 246, 246, 1);
  position: fixed;
  z-index: 1;
  .nav-spacing {
    padding: 16px;
    height: 100%;

    .logo {
      display: block;
      width: 100%;
      padding: 16px;
      .logo-img {
        height: 50px;
      }
    }

    .nav-list {
      margin-top: 16px;
      > .nav-list-item {
        font-size: 16px;
        border-radius: 4px;
        cursor: pointer;
        // router-link
        .nav-list-link {
          height: 100%;
          width: 100%;
          display: block;
          padding: 16px;
          display: flex;
          align-items: center;
          color: #000;
        }
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
  @media screen and (max-width: 728px) {
    & {
      display: none;
    }
  }
}
</style>
