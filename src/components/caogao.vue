<!--
Author: zusheng
Date: 2022-04-12 12:54:51
LastEditTime: 2022-04-12 12:54:51
Description: 草稿纸
FilePath: \vite-music-player\src\components\caogao.vue
-->
<template>
  <section class="section-list-grid" v-if="res.data.length > 0">
    <!-- 大标题 -->
    <h2 class="list-title" v-if="sectionTitle">
      {{ sectionTitle }}
      <router-link
        class="list-sub-title"
        v-if="res.data.length > 6"
        :to="{
          name: 'more',
          query: {
            type: ''
          }
        }"
        v-text="'更多'"
      />
    </h2>

    <!-- 列表 -->
    <ul class="list">
      <li
        v-for="item in res.data.slice(0, store.state.columnCount)"
        class="list-item"
        :key="item.payload"
        @click="toDetail(item.routeName, item.payload)"
      >
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
            :alt="item.title"
          />
        </div>

        <!-- 详情 -->
        <div class="list-item-desc">
          <h3 class="list-item-desc-h3" :title="item.title">
            {{ item.title }}
          </h3>
          <p class="list-item-desc-p" :title="item.desc">{{ item.desc }}</p>
        </div>
      </li>
    </ul>
  </section>
</template>