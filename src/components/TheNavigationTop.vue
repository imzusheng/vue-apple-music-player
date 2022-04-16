<!--
Author: zusheng
Date: 2022-04-16 20:52:05
LastEditTime: 2022-04-16 21:00:48
Description: 
FilePath: \vite-music-player\src\components\TheNavigationTop.vue
-->
<!--
Author: zusheng
Date: 2022-04-12 11:17:48
LastEditTime: 2022-04-16 20:46:31
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
        <img class="logo-img" src="../assets/logo_m.png" alt="" />
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
          </router-link>
        </li>
      </ul>

      <div></div>
    </div>
  </nav>
</template>

<style lang="less">
#nav {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background: rgba(246, 246, 246, 1);
  z-index: 1;
  .nav-spacing {
    padding: 16px;
    height: 100%;
    display: flex;
    justify-content: space-between;

    .logo {
      padding: 0;
      .logo-img {
        width: 28px;
      }
    }

    .nav-list {
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
        }
        .nav-list-item-icon {
          height: 24px;
          width: 24px;
        }
      }

      .nav-checked {
        opacity: 1;
      }
    }
  }
}
</style>
