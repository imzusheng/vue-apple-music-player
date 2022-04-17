<!--
Author: zusheng
Date: 2022-04-17 09:39:32
LastEditTime: 2022-04-17 13:41:53
Description: 歌曲信息模块
FilePath: \vite-music-player\src\components\AudioPlayer\PlayerAudioInfo.vue
-->

<script lang="ts" setup>
import TheLoadingCircle from '@/components/TheLoadingCircle.vue'
import { inject, ref } from 'vue'

const parentProps = inject<any>('props')
const loading = inject('loading', ref(false))
</script>

<template>
  <div class="player-song">
    <!-- 封面 -->
    <div class="player-song-pic">
      <img
        v-if="!loading && parentProps.picUrl"
        :src="parentProps.picUrl"
        alt=""
      />
      <the-loading-circle v-else class="pic-loading" />
    </div>
    <!-- 歌曲信息 -->
    <div class="player-song-desc">
      <p :title="parentProps.title">
        {{ parentProps.title }}
      </p>
      <p>
        {{ parentProps.artist }}
        <span v-if="parentProps.artist && parentProps.publishTime"
          >&nbsp;•&nbsp;</span
        >
        {{ parentProps.publishTime }}
      </p>
    </div>
  </div>
</template>


<style lang="less">
// 歌曲信息
.player-song {
  width: 30%;
  height: 100%;
  display: flex;
  align-items: center;

  .player-song-pic {
    height: 48px;
    width: 48px;
    margin-right: 12px;

    img {
      height: 48px;
      border-radius: 3px;
      cursor: pointer;
    }

    .pic-loading {
      padding: 6px;
      box-sizing: border-box;
    }
  }

  .player-song-desc {
    display: flex;
    height: 100%;
    justify-content: center;
    flex-direction: column;
    overflow: hidden;
    white-space: nowrap;

    p:hover {
      cursor: pointer;
      text-decoration: underline;
    }

    p:first-child {
      font-size: 14px;
    }

    p:last-child {
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 11px;
      color: rgba(0, 0, 0, 0.65);

      span {
        color: currentColor;
      }
    }
  }

  @media screen and (max-width: 728px) {
    & {
      flex: 1;
      padding-right: 16px;
      .player-song-desc {
        > p {
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
  }
}
</style>
