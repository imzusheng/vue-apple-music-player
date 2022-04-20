<!--
Author: zusheng
Date: 2022-04-12 12:12:08
LastEditTime: 2022-04-19 22:05:22
Description: li单项
FilePath: \vite-music-player\src\components\SectionListItem.vue
-->
<script lang="ts" setup>
import { computed } from 'vue'

const props = defineProps<{
  // 是否显示播放按钮
  playBtn?: boolean
  // 封面是否圆角
  round?: boolean
  // 数据
  data: any
}>()

const vLazyLoad = computed(() => {
  return function (url: string) {
    return `${url}?param=50y50`
  }
})
</script>

<template>
  <li class="list-item user-not-select">

    <div class="list-item-poster">

      <!-- 遮罩 -->
      <div class="list-item-overlay">
        <!-- 播放按钮 -->
        <button class="overlay-btn-play flex-center" v-if="props.playBtn">
          <img src="@/assets/player-controls-pause.svg" alt="" />
        </button>
      </div>

      <!-- 封面 -->
      <img
        v-lazy="vLazyLoad(props.data.picUrl)"
        class="list-item-poster"
        src="@/assets/empty_white.png"
        :style="{ borderRadius: props.round ? '50%' : '3px' }"
        :alt="props.data.title"
      />
    </div>

    <!-- 详情 -->
    <div class="list-item-desc">
      <h3 class="list-item-desc-h3" :title="props.data.title">
        {{ props.data.title }}
      </h3>
      <p class="list-item-desc-p" :title="props.data.desc">
        {{ props.data.desc.length === 0 ? props.data.title : props.data.desc }}
      </p>
    </div>
  </li>
</template>

<style lang="less">
// li
.list-item {
  overflow: hidden;
  border-radius: 3px;
  white-space: nowrap;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  // padding: 16px;
  // background: rgba(250, 251, 253, 1);
  // box-shadow: 7px 7px 20px rgba(0, 0, 0, 0.1),
  //   -7px -7px 20px rgba(200, 200, 200, 0.2);
  // transition: all 0.2s;

  // img
  .list-item-poster {
    cursor: pointer;
    width: 100%;
    height: auto;
    object-fit: cover;
    // 由于img默认inline-block，会造成间隙
    display: flex;
    flex: 1;
    border-radius: 3px;
    position: relative;
    overflow: hidden;
    // img遮罩
    .list-item-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 1;
      opacity: 0;
      transition: all 0.2s;
      background-image: linear-gradient(
        rgba(255, 255, 255, 0.1),
        rgba(255, 255, 255, 0.4)
      );
      .overlay-btn-play {
        position: absolute;
        bottom: 10px;
        right: 10px;
        height: 50px;
        width: 50px;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        background: rgba(0, 0, 0, 0.4);
      }
    }
  }

  // desc
  .list-item-desc {
    padding: 10px 0 4px;
    .list-item-desc-h3 {
      font-size: 15px;
      color: rgba(0, 0, 0, 0.8);
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .list-item-desc-p {
      font-size: 13px;
      color: rgba(0, 0, 0, 0.6);
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }
}
</style>
