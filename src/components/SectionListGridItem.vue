<!--
Author: zusheng
Date: 2022-04-12 12:12:08
LastEditTime: 2022-04-12 12:17:22
Description: li单项
FilePath: \vite-music-player\src\components\SectionListGridItem.vue
-->

<template>
  <li class="list-item">
    <!-- 遮罩 -->
    <div class="list-item-poster">
      <div class="list-item-overlay">
        <!-- 播放按钮 -->
        <button class="overlay-btn-play flex-center" v-if="playBtn">
          <img src="@/assets/player-controls-pause.svg" alt="" />
        </button>
      </div>
      <!-- 封面 -->
      <img
        v-lazy:[item.picUrl]
        class="list-item-poster"
        src="@/assets/empty_white.png"
        :style="{ borderRadius: round ? '50%' : '3px' }"
        :alt="title"
      />
    </div>

    <!-- 详情 -->
    <div class="list-item-desc">
      <h3 class="list-item-desc-h3" :title="title">
        {{ title }}
      </h3>
      <p class="list-item-desc-p" :title="desc">{{ desc }}</p>
    </div>
  </li>
</template>