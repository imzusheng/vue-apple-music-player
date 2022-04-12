<!--
Author: zusheng
Date: 2022-04-11 11:08:36
LastEditTime: 2022-04-12 00:15:11
Description: 歌单展示列表grid布局
FilePath: \vite-music-player\src\components\SectionListGrid.vue
-->
<script lang="ts" setup>
import { useStore } from '@/store'
import { useRouter } from 'vue-router'
const store = useStore()
const router = useRouter()

interface DataItem {
  // 标题
  title: string
  // 参数类似与id
  payload: string | number
  // 封面url
  picUrl: string
  // 小标题
  desc: string
  // 路由名
  routeName: string
}

defineProps<{
  // 封面是否圆角
  round?: boolean
  // 点击更多时跳转
  more: string
  // 大标题
  sectionTitle: null | string
  // 列表数据
  listData: Array<DataItem>
}>()

const toDetail = (routeName: string, payload: string | number) => {
  router.push({
    name: routeName,
    query: {
      payload
    }
  })
}
</script>

<template>
  <section class="section-list-grid" v-if="listData.length > 0">
    <!-- 大标题 -->
    <h2 class="list-title" v-if="sectionTitle">
      {{ sectionTitle }}
      <router-link
        class="list-sub-title"
        v-if="listData.length > 7"
        to="/"
        v-text="'更多'"
      />
    </h2>

    <!-- 列表 -->
    <ul class="list">
      <li
        v-for="item in listData.slice(0, store.state.columnCount)"
        class="list-item"
        :key="item.payload"
        @click="toDetail(item.routeName, item.payload)"
      >
        <!-- 遮罩 -->
        <div class="list-item-poster">
          <div class="list-item-overlay">
            <!-- 播放按钮 -->
            <button class="overlay-btn-play flex-center">
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

<style lang="less">
.section-list-grid {
  margin-bottom: 72px;
  // h2
  .list-title {
    font-size: 28px;
    padding: 16px 0;
    .list-sub-title {
      font-size: 16px;
      margin-left: 16px;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.8);
      &:hover {
        text-decoration: underline;
      }
    }
  }
  // ul
  .list {
    display: grid;
    gap: 24px;
    grid-template-columns: repeat(var(--column-count), 1fr);
    // li
    .list-item {
      overflow: hidden;
      border-radius: 3px;
      white-space: nowrap;
      // padding: 16px;
      // background: rgba(250, 251, 253, 1);
      // box-shadow: 7px 7px 20px rgba(0, 0, 0, 0.1),
      //   -7px -7px 20px rgba(200, 200, 200, 0.2);
      // transition: all 0.2s;

      // img
      .list-item-poster {
        cursor: pointer;
        width: 100%;
        // 由于img默认inline-block，会造成间隙
        display: block;
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

        // 发生了什么：遮罩层出现、播放按钮出现
        .list-item-overlay:hover {
          opacity: 1;
        }
      }

      // desc
      .list-item-desc {
        padding: 10px 0 4px;
        .list-item-desc-h3:hover {
          cursor: pointer;
          text-decoration: underline;
        }
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
  }
}
</style>
