<!--
Author: zusheng
Date: 2022-04-14 23:13:43
LastEditTime: 2022-04-15 09:48:49
Description: MV展示卡片
FilePath: \vite-music-player\src\components\CardMv.vue
-->

<script lang="ts" setup>
defineProps<{
  picUrl: string
  title: string
  artist: string
  desc: string
  area: string
}>()
</script>

<template>
  <div class="mv-block">
    <img class="mv-block-poster" :src="picUrl" alt="" />
    <div class="mv-block-mv">MV</div>
    <div class="mv-block-area">{{ area }}</div>
    <div class="mv-block-desc" :title="desc">
      <div>
        <span class="desc-title">{{ title }}</span>
        <span class="desc-title-sub">{{ artist }}</span>
      </div>
      <div class="desc-sub">{{ desc }}</div>
    </div>
  </div>
</template>

<style lang="less">
.mv-block {
  cursor: pointer;
  border-radius: 6px;
  overflow: hidden;
  position: relative;
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    // background: linear-gradient(rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0.9) 90%);
    background: radial-gradient(rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.3) 100%);
  }
  // img
  .mv-block-poster {
    width: 100%;
    height: 100%;
    object-fit: cover;
    // mask-image: linear-gradient(
    //   to top,
    //   rgba(0, 0, 0, 0.1) 0%,
    //   rgba(0, 0, 0, 1) 100%
    // );
    // -webkit-mask-image: linear-gradient(
    //   to top,
    //   rgba(0, 0, 0, 0.1) 0%,
    //   rgba(0, 0, 0, 1) 100%
    // );
  }

  .mv-block-mv {
    position: absolute;
    top: 10px;
    left: 10px;
    color: #fff;
    z-index: 1;
    font-weight: 400;
  }

  .mv-block-area {
    position: absolute;
    top: 10px;
    right: 10px;
    color: #fff;
    z-index: 1;
    font-weight: 400;
  }

  .mv-block-desc {
    position: absolute;
    bottom: 0;
    left: 50%;
    width: 100%;
    padding: 10px;
    color: #fff;
    z-index: 1;
    font-size: 14px;
    transform: translate(-50%, 0);

    .desc-title {
      font-weight: 600;
      margin-right: 16px;
    }
    .desc-sub {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      overflow: hidden;
      color: rgba(255, 255, 255, 0.9);
    }
  }
}
</style>