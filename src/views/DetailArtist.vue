<!--
Author: zusheng
Date: 2022-04-11 18:15:50
LastEditTime: 2022-04-12 11:26:49
Description: 歌单详情页
FilePath: \vite-music-player\src\views\DetailArtist.vue
-->

<script lang="ts" setup>
import { useRoute } from 'vue-router'
import { onMounted, onUnmounted, onUpdated, reactive, ref } from 'vue'
import { mapActionsHelpers } from '@/common/util'
import SectionListGrid from '@/components/SectionListGrid.vue'

const artistContentRef = ref<any>()
const infoRef = ref<any>()
const actionRef = ref<any>()
// const getHeaderRef = inject<HTMLElement | any>('getHeaderRef')

// 处理动画
const animationHandler = () => {
  // 首屏高度
  const documentHeight = document.documentElement.clientHeight
  // 当前滚动条高度
  const curScrollTop = document.documentElement.scrollTop
  // 动画完成节点
  const targetHeight = documentHeight * 0.7
  // 头部标题显示触发点
  const headerTarget = documentHeight - 120
  // 动画产生值
  let curValue: any, showValue: any
  // 头部按钮显示动画
  if (headerTarget > curScrollTop) {
    showValue = 1 - (headerTarget - curScrollTop) / headerTarget
  } else {
    showValue = 1
  }
  document.documentElement.style.setProperty(
    '--animation-target',
    showValue === 1 ? showValue : '0'
  )

  // 其他动画
  if (targetHeight > curScrollTop) {
    curValue = 1 - (targetHeight - curScrollTop) / targetHeight
  } else {
    curValue = 1
  }
  document.documentElement.style.setProperty(
    '--animation-ratio',
    curValue.toFixed(3)
  )
}

onMounted(() => {
  // 监听动画
  document.addEventListener('scroll', animationHandler)
})

onUpdated(() => {
  // 每次更新页面时，设定css变量--content-mg-top
  const mgTop = actionRef.value.offsetHeight + infoRef.value.offsetHeight + 'px'
  artistContentRef.value.style.setProperty('--content-mg-top', `-${mgTop}`)
})

onUnmounted(() => {
  document.removeEventListener('scroll', animationHandler)
})

// 以下获取数据
const route = useRoute()
const id = route.query.payload
const data = reactive<any>({
  artistDetail: {},
  artistFans: {},
  albums: [],
  videos: [],
  mvs: [],
  simi: []
})
const {
  getArtistDetail,
  getArtistFans,
  getArtistAlbum,
  getArtistMV,
  getArtistVideo,
  getArtistSimi
} = mapActionsHelpers(null, [
  'getArtistDetail',
  'getArtistFans',
  'getArtistAlbum',
  'getArtistMV',
  'getArtistVideo',
  'getArtistSimi'
])

Promise.allSettled([
  getArtistDetail(id),
  getArtistFans(id),
  getArtistAlbum(id),
  getArtistMV(id),
  getArtistVideo(id),
  getArtistSimi(id)
]).then((resArr) => {
  resArr.forEach((res: any) => {
    if (res.status === 'fulfilled') {
      data[res.value.type] = res.value.data
    }
  })
})
</script>

<template>
  <div
    id="detail-artist"
    :style="{ '--poster-url': `url(${data.artistDetail.picUrl})` }"
  >
    <!-- 海报 -->
    <div class="artist-banner">
      <div class="artist-banner-poster" ref="posterRef"></div>
      <div class="artist-banner-mask" ref="maskRef"></div>
    </div>

    <section class="artist-content" ref="artistContentRef">
      <!-- 歌手信息 -->
      <div class="artist-artist-info" ref="infoRef">
        <div class="artist-artist-info-spacing">
          <div class="artist-info-main">
            <span class="artist-info-name">{{ data.artistDetail.title }}</span>
            <span class="artist-info-desc">{{ data.artistDetail.desc }}</span>
          </div>
        </div>
      </div>

      <!-- 按钮栏 -->
      <div class="artist-action" ref="actionRef">
        <div class="artist-action-content">
          <button aria-label="播放全部" class="action-btn-play flex-center">
            <img class="icon" src="@/assets/icon-song-play.svg" alt="" />
          </button>
          <button aria-label="关注" class="action-btn-subscribe">
            订阅 {{ data.artistFans.count }}
          </button>
        </div>
      </div>

      <!-- 歌手作品列表 -->
      <div class="artist-list">
        <section-list-grid
          :listData="data.albums"
          sectionTitle="专辑"
          more="''"
        />
        <section-list-grid
          :listData="data.mvs"
          sectionTitle="MV"
          more="'asdasd'"
        />
        <section-list-grid
          :listData="data.videos"
          sectionTitle="视频"
          more="''"
        />
        <section-list-grid
          :listData="data.simi"
          :round="true"
          sectionTitle="粉丝也喜欢"
          more="''"
        />
      </div>
    </section>
  </div>
</template>

<style lang="less">
#detail-artist {
  --content-mg-top: -50vh;
  --poster-url: '';
  // 封面
  .artist-banner {
    position: sticky;
    top: 0;
    height: 100vh;
    width: 100%;
    overflow: hidden;
    .artist-banner-poster {
      position: absolute;
      top: 0;
      height: 100vh;
      width: 100%;
      transform: scale(calc(1.05 - 0.05 * var(--animation-ratio)));
      background: var(--poster-url) center center no-repeat;
      background-size: auto 100%;
      &::after {
        content: '';
        position: absolute;
        height: 100%;
        width: 100%;
        z-index: 1;
        background: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.4));
      }
    }
    .artist-banner-mask {
      position: absolute;
      width: 100%;
      height: 100%;
      z-index: 1;
      opacity: var(--animation-ratio);
      background: #fff;
    }
  }

  .artist-content {
    position: relative;
    z-index: 2;
    margin-top: var(--content-mg-top);

    // 歌手信息
    .artist-artist-info {
      width: 100%;
      .artist-artist-info-spacing {
        padding: 32px;
        display: flex;
        width: 100%;
        height: 100%;
        align-items: flex-end;
        justify-content: flex-start;
        .artist-info-main {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: flex-end;
          border-left: 6px solid #fff;
          padding-left: 24px;
          box-sizing: border-box;
          .artist-info-name {
            color: rgba(255, 255, 255, 1);
            width: 100%;
            font-size: 56px;
            line-height: 56px;
            font-weight: 900;
            margin-bottom: 24px;
          }
          .artist-info-desc {
            color: rgba(255, 255, 255, 0.8);
            font-size: 14px;
            line-height: 2;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            display: -webkit-box;
            overflow: hidden;
          }
        }
      }
    }

    // 按钮栏
    .artist-action {
      width: 100%;
      padding: 32px;
      background-image: linear-gradient(
        rgba(255, 255, 255, 0.8),
        rgba(255, 255, 255, 1)
      );
      .artist-action-content {
        display: flex;
        align-items: center;
        .action-btn-play {
          border: none;
          outline: none;
          cursor: pointer;
          margin-right: 32px;
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background-color: rgba(0, 0, 0, 0.6);
          .icon {
            height: 24px;
            width: 24px;
          }
        }
        .action-btn-subscribe {
          padding: 6px 16px;
          background: transparent;
          border: 1px solid rgba(0, 0, 0, 0.6);
          border-radius: 4px;
          cursor: pointer;
        }
      }
    }

    // 歌手作品
    .artist-list {
      width: 100%;
      height: 100%;
      background: #fff;
      padding: 32px;
    }
  }
}
</style>

