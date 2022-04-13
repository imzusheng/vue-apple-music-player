<!--
Author: zusheng
Date: 2022-04-12 20:53:25
LastEditTime: 2022-04-13 13:34:57
Description: 错误提示页面
FilePath: \vite-music-player\src\views\PageError.vue
-->

<script setup lang="ts">
import { useStore } from '@/store'
import { useRouter } from 'vue-router'

const store = useStore()
const router = useRouter()

store.commit('setLoading', false)

const goBack = () => {
  router.go(-1)
}
</script>
<template>
  <div id="error-page">
    <div class="error-page-content">
      <svg
        class="error-icon"
        role="img"
        height="64"
        width="64"
        viewBox="0 0 24 24"
      >
        <path d="M11 18v-2h2v2h-2zm0-4V6h2v8h-2z"></path>
        <path
          d="M12 3a9 9 0 100 18 9 9 0 000-18zM1 12C1 5.925 5.925 1 12 1s11 4.925 11 11-4.925 11-11 11S1 18.075 1 12z"
        ></path>
      </svg>
      <h2 class="error-msg" :title="store.state.error.info">
        {{ store.state.error.msg || '出现了不可描述的错误' }}
      </h2>
      <button class="error-back" @click="goBack">返回上一页</button>
    </div>
  </div>
</template>

<style lang="less">
#error-page {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  .error-page-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 32px;
    .error-icon {
      fill: rgba(255, 200, 40, 0.5);
    }
    .error-msg {
      margin-top: 6px;
      font-size: 36px;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      display: -webkit-box;
      overflow: hidden;
    }
    .error-back {
      margin-top: 24px;
      padding: 8px 16px;
      border-radius: 50px;
      border: none;
      color: #fff;
      cursor: pointer;
      background: var(--theme-color);
    }
  }
}
</style>
