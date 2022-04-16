<!--
Author: zusheng
Date: 2022-04-12 11:17:48
LastEditTime: 2022-04-16 21:22:07
Description: 左侧导航栏
FilePath: \vite-music-player\src\components\TheNavigationLeft.vue
-->
<script lang="ts" setup>
import iconHome from '@/assets/icon-face.svg'
import iconDiscovery from '@/assets/icon-discovery.svg'
import iconLibrary from '@/assets/icon-library.svg'
import iconSearch from '@/assets/icon-search.svg'
import { useRouter } from 'vue-router'
import { ref } from 'vue'

const router = useRouter()

const navConfig = [
  { title: '探索', icon: iconDiscovery, routerName: 'discovery' },
  { title: '推荐', icon: iconHome, routerName: 'home' },
  { title: '媒体库', icon: iconLibrary, routerName: 'library' },
  { title: '搜索', icon: iconSearch, routerName: 'search' }
]

const curRouterName = ref<any>(router.currentRoute.value.name)

router.afterEach((to) => {
  curRouterName.value = to.name
})
</script>

<template>
  <nav id="nav">
    <div class="nav-spacing">
      <router-link class="logo flex-center" :to="{ name: 'home' }">
        <img class="logo-img-b" src="../assets/logo_b.png" alt="" />
        <img class="logo-img-m" src="../assets/logo_m.png" alt="" />
      </router-link>

      <ul class="nav-list">
        <li
          v-for="item in navConfig"
          :key="item.title"
          class="nav-list-item"
          :class="{ 'nav-checked': item.routerName === curRouterName }"
        >
          <router-link class="nav-list-link" :to="{ name: item.routerName }">
            <img class="nav-list-item-icon" :src="item.icon" alt="" />
            <span class="nav-list-link-span">{{ item.title }}</span>
          </router-link>
        </li>
      </ul>

      <div></div>
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
      width: 100%;
      padding: 16px;
      .logo-img-b {
        height: 50px;
      }
      .logo-img-m {
        display: none;
      }
    }

    .nav-list {
      margin-top: 16px;
      > .nav-list-item {
        font-size: 16px;
        border-radius: 4px;
        cursor: pointer;
        opacity: 0.5;
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
        .nav-list-link-span {
          display: block;
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

      .nav-checked {
        opacity: 1;
      }
    }
  }

  @media screen and (max-width: 728px) {
    & {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: unset;
      background: rgba(246, 246, 246, calc(var(--animation-ratio) * 1));
      z-index: 999;
      .nav-spacing {
        padding: 16px;
        height: 100%;
        display: flex;
        justify-content: space-between;

        .logo {
          width: unset;
          padding: 0;
          .logo-img-b {
            display: none;
          }
          .logo-img-m {
            display: block;
            width: 24px;
          }
        }

        .nav-list {
          margin-top: 0;
          display: flex;
          > .nav-list-item {
            font-size: 16px;
            border-radius: 4px;
            cursor: pointer;
            opacity: 0.5;
            // router-link
            .nav-list-link {
              height: 100%;
              width: 100%;
              display: block;
              padding: 10px 16px;
              display: flex;
              align-items: center;
              color: #000;
              padding: 0 18px;
            }

            .nav-list-link-span {
              display: none;
            }
            .nav-list-item-icon {
              height: 24px;
              width: 24px;
              margin: 0;
            }
            &:hover {
              background: transparent;
            }
          }

          .nav-checked {
            opacity: 1;
          }
        }
      }
    }
  }
}
</style>
