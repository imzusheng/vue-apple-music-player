<!--
Author: zusheng
Date: 2022-04-13 22:41:51
LastEditTime: 2022-04-15 11:46:18
Description: 海报展示组件
FilePath: \vite-music-player\src\components\SectionBanner.vue
-->

<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { ref, watchEffect } from 'vue'

const router = useRouter()

const { picUrl = '', type } = defineProps<{
  payload: string | number
  picUrl: string
  title: string
  desc: string
  type: number
}>()

// 前往详情页
const toDetail = (payload: any) => {
  // 1为单曲，10为专辑
  if (type === 1) {
    router.push({
      name: 'song',
      query: {
        payload
      }
    })
  } else {
    router.push({
      name: 'album',
      query: {
        payload
      }
    })
  }
}

const bannerloading = ref<boolean>(true)

const bannerOnload = () => {
  bannerloading.value = false
}

watchEffect(() => {
  if (picUrl) {
    bannerloading.value = true
  }
})
</script>

<template>
  <div v-if="picUrl.length > 0" class="banner-block" @click="toDetail(payload)">
    <!-- 背景 -->
    <div
      class="banner-blur-bg"
      :style="{ backgroundImage: `url(${picUrl}?imageView&blur=40x20)` }"
    ></div>

    <!-- 海报描述 -->
    <div class="banner-desc">{{ title }}</div>
    <div class="banner-pictrue-box">
      <!-- 海报标题 -->
      <div class="banner-title">
        {{ type === 1 ? '单曲' : '专辑' }}&nbsp;&nbsp;&nbsp;{{ desc }}
      </div>

      <!-- 相机框框 -->
      <span class="banner-frame-1"></span>
      <span class="banner-frame-2"></span>
      <span class="banner-frame-3"></span>
      <span class="banner-frame-4"></span>

      <img
        v-if="bannerloading"
        class="banner-picture"
        src="@/assets/empty-banner.jpg"
        alt=""
      />
      <img
        v-show="!bannerloading"
        @load="bannerOnload"
        class="banner-picture"
        :src="picUrl + '?imageView&quality=90'"
        alt=""
      />
    </div>
  </div>
</template>

<style lang="less" scoped>
.banner-block {
  width: 100%;
  overflow: hidden;
  border-radius: 12px;
  position: relative;
  padding: 40px 40px 80px;
  cursor: pointer;

  // 模糊背景
  .banner-blur-bg {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: -1;
    background-position: center center;
    background-repeat: no-repeat;
    background-size: 200%;
    opacity: 0.95;
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: radial-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.3));
    }
  }

  // 小标题
  .banner-desc {
    position: absolute;
    bottom: 10px;
    right: 16px;
    font-size: 16px;
    color: #fff;
  }

  .banner-pictrue-box {
    position: relative;
    padding: 50px 80px 0;
    --border-style: 3px solid rgba(255, 255, 255, 1);
    // 海报标题
    .banner-title {
      position: absolute;
      top: 10px;
      left: 20px;
      font-size: 14px;
      color: #fff;
    }

    // 海报
    .banner-picture {
      width: 100%;
      min-height: 180px;
      display: block;
      border: 3px solid #fff;
    }
    // 相机框框
    .banner-frame-1,
    .banner-frame-2,
    .banner-frame-3,
    .banner-frame-4 {
      position: absolute;
      width: 24px;
      height: 24px;
      transform: scale(0.6);
    }
    .banner-frame-1 {
      top: 0;
      left: 0;
      border-top: var(--border-style);
      border-left: var(--border-style);
    }
    .banner-frame-2 {
      top: 0;
      right: 0;
      border-top: var(--border-style);
      border-right: var(--border-style);
    }
    .banner-frame-3 {
      bottom: -6px;
      right: 0;
      border-bottom: var(--border-style);
      border-right: var(--border-style);
    }
    .banner-frame-4 {
      bottom: -6px;
      left: 0;
      border-bottom: var(--border-style);
      border-left: var(--border-style);
    }
  }

  @media screen and (max-width: 1200px) {
    & {
      padding: 20px 20px 50px;
      .banner-pictrue-box {
        padding: 40px 50px 0;
      }
    }
  }

  @media screen and (max-width: 768px) {
    & {
      padding: 10px 10px 40px;
      .banner-pictrue-box {
        padding: 30px 40px 0;
      }
    }
  }
}
</style>
