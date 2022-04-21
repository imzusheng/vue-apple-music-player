<!--
Author: zusheng
Date: 2022-04-21 10:01:51
LastEditTime: 2022-04-21 11:00:53
Description: 艺人详情页面
FilePath: \vite-music-player\src\components\TheFrameArtist.vue
-->

<script lang="ts" setup>
const props = defineProps<{
  title: string
  desc: string
  picUrl: string
}>()
</script>

<template>
  <div id="detail-frame-artist">
    <!-- 上 海报 -->
    <div class="frame-artist-poster">
      <div
        class="artist-poster"
        :style="{
          backgroundImage: `url(${props.picUrl}?param=1000y1000)`
        }"
      >
        <div class="artist-poster-action">
          <h1 class="artist-poster-action-title">{{ props.title }}</h1>
          <button class="artist-poster-action-play">
            <img src="@/assets/icon-song-play.svg" alt="" />
          </button>
        </div>
      </div>
    </div>

    <!-- 下 作品列表 -->
    <div class="frame-artist-main">
      <slot name="list"></slot>
    </div>
  </div>
</template>

<style lang="less">
#detail-frame-artist {
  width: 100%;
  min-height: 100vh;

  .frame-artist-poster {
    width: 100%;
    height: calc((100vh - 72px) / 2);
    // 封面
    .artist-poster {
      width: 100%;
      height: 100%;
      background-position: center;
      background-repeat: no-repeat;
      background-size: 100%;
      position: relative;

      // 封面遮罩
      &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        z-index: 1;
        background-image: linear-gradient(
          rgba(0, 0, 0, 0.3),
          rgba(0, 0, 0, 0.1),
          rgba(0, 0, 0, 0),
          rgba(0, 0, 0, 0.4)
        );
      }

      // 标题按钮
      .artist-poster-action {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 2;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: 10px 16px;
        .artist-poster-action-title {
          font-size: 24px;
          color: #fff;
        }

        .artist-poster-action-play {
          border: none;
          height: 30px;
          width: 30px;
          background-color: var(--theme-color);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
    }
  }

  .frame-artist-main {
    padding: 10px 16px;
  }
}
</style>

