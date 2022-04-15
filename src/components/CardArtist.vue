import { watchEffect } from "vue"

<!--
Author: zusheng
Date: 2022-04-15 00:29:14
LastEditTime: 2022-04-15 09:24:23
Description: 人像展示卡片
FilePath: \vite-music-player\src\components\CardArtist.vue
-->

<script lang="ts" setup>
import { onMounted, ref, watchEffect } from 'vue'
import { getMainColor } from '@/common/util'

const props = defineProps<{
  title: any

  desc: any

  imgA: any

  imgB: any

  imgC: any
}>()

const cardArtist = ref<any>()

watchEffect(() => {
  if (props.imgA) {
    getMainColor(props.imgA).then((rgba) => {
      cardArtist.value.style.setProperty('--main-color', `rgba(${rgba})`)
    })
  }
})
</script>


<template>
  <div ref="cardArtist" class="card-artist">
    <!-- 封面 -->
    <div class="card-artist-poster flex-center">
      <div class="card-artist-spacing">
        <img class="artist-poster-main" :src="props.imgA" alt="" />
        <img class="artist-poster-sub-l" :src="props.imgB" alt="" />
        <img class="artist-poster-sub-r" :src="props.imgC" alt="" />
      </div>
    </div>
    <!-- 描述 -->
    <div class="card-artist-desc">
      <h3 class="card-artist-desc-h3">{{ props.title }}</h3>
      <p class="card-artist-desc-p">{{ props.desc }}</p>
    </div>
  </div>
</template>

<style lang="less" >
.card-artist {
  --main-color: rgba(200, 200, 200, 1);
  height: 100%;
  position: relative;
  background-color: var(--main-color);
  background-image: linear-gradient(
    rgba(0, 0, 0, 0) 60%,
    rgba(100, 100, 100, 0.3)
  );
  display: flex;
  flex-direction: column;
  cursor: pointer;
  // 歌手封面
  .card-artist-poster {
    padding: 52px;
    z-index: 1;
    .card-artist-spacing {
      position: relative;
      .artist-poster-main {
        height: 240px;
        width: 240px;
        border-radius: 50%;
      }
      .artist-poster-sub-l {
        position: absolute;
        top: -18px;
        left: -18px;
        width: 92px;
        height: 92px;
        border-radius: 50%;
        border: 8px solid var(--main-color);
      }
      .artist-poster-sub-r {
        position: absolute;
        right: -9px;
        bottom: -9px;
        width: 92px;
        height: 92px;
        border-radius: 50%;
        border: 8px solid var(--main-color);
      }
    }
  }
  // 描述
  .card-artist-desc {
    flex: 1;
    display: flex;
    flex-direction: column;
    background-color: rgba(100, 100, 100, 0.1);
    justify-content: center;
    align-items: center;
    > .card-artist-desc-h3 {
      font-size: 20px;
      font-weight: 400;
      color: rgba(255, 255, 255, 0.95);
      margin-bottom: 3px;
    }
    > .card-artist-desc-p {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.65);
    }
  }
}
</style>
