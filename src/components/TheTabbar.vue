<!--
Author: zusheng
Date: 2022-04-18 12:37:17
LastEditTime: 2022-04-19 20:28:13
Description: 底部tabbar
FilePath: \vite-music-player\src\components\TheTabbar.vue
-->

<!--
Author: zusheng
Date: 2022-04-12 11:17:48
LastEditTime: 2022-04-16 21:22:07
Description: 左侧导航栏
FilePath: \vite-music-player\src\components\TheNavigationLeft.vue
-->
<script lang="ts" setup>
import iconPlay from '@/assets/icon-uni-play.png'
import iconvView from '@/assets/icon-uni-view.png'
import iconBroadcast from '@/assets/icon-uni-dj.png'
import iconLibrary from '@/assets/icon-uni-media.png'
import iconSearch from '@/assets/icon-uni-search.png'

import iconPlayCheck from '@/assets/icon-uni-play-checked.png'
import iconvViewCheck from '@/assets/icon-uni-view-checked.png'

import { useRouter } from 'vue-router'
import { useStore } from '@/store'

const store = useStore()
const router = useRouter()
const navConfig = [
  {
    title: '现在就听',
    icon: iconPlay,
    iconChecked: iconPlayCheck,
    routerName: 'home'
  },
  {
    title: '浏览',
    icon: iconvView,
    iconChecked: iconvViewCheck,
    routerName: 'browse'
  },
  {
    title: '广播',
    icon: iconBroadcast,
    iconChecked: iconPlayCheck,
    routerName: 'broadcast'
  },
  {
    title: '媒体库',
    icon: iconLibrary,
    iconChecked: iconPlayCheck,
    routerName: 'library'
  },
  {
    title: '搜索',
    icon: iconSearch,
    iconChecked: iconPlayCheck,
    routerName: 'search'
  }
]
</script>

<template>
  <nav id="tabbar" :class="{ 'tabbar-display': store.state.playerDisplay }">
    <ul class="tabbar-list">
      <li
        class="tabbar-list-item"
        v-for="(listItem, listIndex) in navConfig"
        :key="`nav-${listIndex}`"
      >
        <router-link :to="{ name: listItem.routerName }">
          <img
            v-show="router.currentRoute.value.name !== listItem.routerName"
            class="nav-list-item-icon"
            :src="listItem.icon"
            alt=""
          />
          <img
            v-show="router.currentRoute.value.name === listItem.routerName"
            class="nav-list-item-icon"
            :src="listItem.iconChecked"
            alt=""
          />
          <span
            class="nav-list-link-span"
            :class="{
              'link-checked':
                router.currentRoute.value.name === listItem.routerName
            }"
            >{{ listItem.title }}</span
          >
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<style lang="less">
#tabbar {
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 999;
  width: 100%;
  height: 72px;
  overflow: hidden;
  transition: transform 0.1s;
  background: rgba(247, 247, 247, 1);
  border-top: 1px solid rgba(143, 146, 147, 0.1);
  .tabbar-list {
    height: 100%;
    display: flex;
    align-items: center;
    position: relative;
    // &::after {
    //   content: '';
    //   position: absolute;
    //   top: 0;
    //   left: 0;
    //   right: 0;
    //   bottom: 0;
    //   // background: rgba(247, 247, 247, 0.8);
    //   z-index: -1;
    // }
    .tabbar-list-item {
      width: 20%;
      padding: 12px 10px;
      > a {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        color: rgba(143, 146, 147, 1);

        .nav-list-item-icon {
          width: 24px;
          margin-bottom: 6px;
        }
        .nav-list-link-span {
          display: block;
          font-size: 10px;
          font-weight: 600;
        }
        .link-checked {
          color: rgba(250, 35, 59, 1);
        }
      }
    }
  }
}

.tabbar-display {
  transform: translate(0, 100%);
}
</style>
