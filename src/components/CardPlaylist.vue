<!--
Author: zusheng
Date: 2022-04-14 23:39:46
LastEditTime: 2022-04-15 09:29:13
Description: 歌单展示卡片
FilePath: \vite-music-player\src\components\CardPlaylist.vue
-->


<script lang="ts" setup>
defineProps<{
  // 大标题
  title: string

  // 小标题
  subTitle: string

  // 图片链接
  picUrl: string
}>()
</script>


<template>
  <div class="card-playlist">
    <!-- 歌曲信息 -->
    <div class="card-playlist-desc">
      <img class="card-playlist-desc-poster" :src="picUrl" alt="" />
      <div class="card-playlist-desc-main">
        <div class="card-playlist-desc-text">
          <h3 class="text-h3">{{ title }}</h3>
          <p class="text-p">{{ subTitle }}</p>
        </div>
        <button aria-label="播放全部" class="action-btn-play flex-center">
          <img class="icon" src="@/assets/icon-song-play.svg" alt="" />
        </button>
      </div>
    </div>
    <!-- 歌单列表插槽 -->
    <slot> 来点歌曲 </slot>
  </div>
</template>

<style lang="less">
.card-playlist {
  border-radius: 12px;
  background: rgba(246, 246, 246, 1);
  overflow: hidden;
  padding-bottom: 8px;

  .card-playlist-desc {
    display: flex;
    padding: 8px 16px 16px;
    .card-playlist-desc-poster {
      flex-shrink: 0;
      border-radius: 3px;
      width: 180px;
      height: 180px;
    }
    .card-playlist-desc-main {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding-left: 16px;
      .card-playlist-desc-text {
        > .text-h3 {
          font-size: 36px;
        }
        > .text-p {
          font-size: 14px;
          color: rgba(0, 0, 0, 0.6);
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      }
      .action-btn-play {
        height: 52px;
        width: 52px;
        border: none;
        border-radius: 50%;
        background-color: var(--theme-color);
        cursor: pointer;
        > .icon {
          width: 22px;
          height: 22px;
        }
      }
    }
  }
}
</style>