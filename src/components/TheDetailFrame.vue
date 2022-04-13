<!--
Author: zusheng
Date: 2022-04-12 17:31:44
LastEditTime: 2022-04-14 00:23:31
Description: detail页面的基本框架
FilePath: \vite-music-player\src\components\TheDetailFrame.vue
-->

<script lang="ts" setup>
import { onMounted, onUnmounted, ref, nextTick, watchEffect } from 'vue'
import { useStore } from '@/store'
import { blobToBase64, throttle } from '@/common/util'

const props = defineProps<{
  // 标题
  title: string
  // 副标题
  desc: string
  // 海报链接
  picUrl: string
  // 副标题
  sub?: string
}>()

const store = useStore()
const posterRef = ref<any>()

store.commit('setLoading', true)
////////////////////////////////////////////////////////////////////////////////////////////////
// 以下加载封面图
// fetch获取封面, 用fetch是因为可以监听封面加载成功没，没有封面的页面太丑了
////////////////////////////////

watchEffect(() => {
  // 所有数据是同时传入的，有了picUrl说明其他也传入了
  if (!props.picUrl) return

  store.commit('setHeaderText', props.title)

  fetch(props.picUrl).then(async (res) => {
    const imgBlob = await res.blob()
    const base64 = await blobToBase64(imgBlob)

    posterRef.value.style.backgroundImage = `url(${base64})`
    store.commit('setLoading', false)
    nextTick(() => {
      // 每次更新页面时，设定css变量--content-mg-top
      const mgTop =
        actionRef.value.offsetHeight + infoRef.value.offsetHeight + 'px'
      artistContentRef.value.style.setProperty('--content-mg-top', `-${mgTop}`)
    })
  })
})

////////////////////////////////////////////////////////////////////////////////////////////////
// 以下动画
////////////////////////////////////////////////////////////////

const artistContentRef = ref<any>()
const infoRef = ref<any>()
const actionRef = ref<any>()

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

  const curShowValue =
    document.documentElement.style.getPropertyValue('--animation-target')
  // 避免重复赋值
  if (curShowValue !== showValue) {
    document.documentElement.style.setProperty(
      '--animation-target',
      showValue === 1 ? showValue : '0'
    )
  }

  // 其他动画
  if (targetHeight > curScrollTop) {
    curValue = 1 - (targetHeight - curScrollTop) / targetHeight
  } else {
    curValue = 1
  }

  const curRatio =
    document.documentElement.style.getPropertyValue('--animation-ratio')
  // 避免重复赋值
  if (curRatio !== curValue) {
    document.documentElement.style.setProperty(
      '--animation-ratio',
      curValue.toFixed(3)
    )
  }
}

// 套上防抖
const throttleScrollHandler = throttle(animationHandler, 1000 / 60)

onMounted(() => {
  // 监听动画
  document.addEventListener('scroll', throttleScrollHandler)
})

onUnmounted(() => {
  document.removeEventListener('scroll', throttleScrollHandler)
})
</script>

<template>
  <div id="detail-frame">
    <!-- 海报 -->
    <div class="frame-banner">
      <div
        v-show="props.picUrl"
        class="frame-banner-poster"
        ref="posterRef"
      ></div>
      <div class="frame-banner-mask" ref="maskRef"></div>
    </div>

    <section class="frame-content" ref="artistContentRef">
      <!-- 歌手信息 -->
      <div class="section-frame-info" ref="infoRef">
        <div class="frame-frame-info-spacing">
          <div class="frame-info-main">
            <span v-if="props.sub" class="frame-info-sub">{{ props.sub }}</span>
            <span class="frame-info-name">{{ props.title }}</span>
            <span class="frame-info-desc">{{ props.desc }}</span>
          </div>
        </div>
      </div>

      <div class="section-frame-content">
        <div class="section-frame-bg"></div>

        <!-- 按钮栏 -->
        <div class="frame-action" ref="actionRef">
          <div class="frame-action-content">
            <button aria-label="播放全部" class="action-btn-play flex-center">
              <img class="icon" src="@/assets/icon-song-play.svg" alt="" />
            </button>
            <button aria-label="关注" class="action-btn-subscribe">
              共12首音乐
            </button>
            <button aria-label="关注" class="action-btn-subscribe">
              订阅 132.1万
            </button>
          </div>
        </div>

        <!-- 歌手作品列表 -->
        <div class="frame-list">
          <!-- 列表插槽 -->
          <slot name="list"></slot>
        </div>
      </div>
    </section>
  </div>
</template>

<style lang="less">
#detail-frame {
  --content-mg-top: 0;
  height: 100%;
  width: 100%;
  position: relative;

  // 封面
  .frame-banner {
    position: sticky;
    top: 0;
    height: 100vh;
    width: 100%;
    overflow: hidden;
    .frame-banner-poster {
      position: absolute;
      top: 0;
      height: 100vh;
      width: 100%;
      transform: scale(calc(1.05 - 0.05 * var(--animation-ratio)));
      background-repeat: no-repeat;
      background-position: center center;
      background-size: 100% auto;
      &::after {
        content: '';
        position: absolute;
        height: 100%;
        width: 100%;
        z-index: 1;
        background: linear-gradient(rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.6));
      }
    }
    .frame-banner-mask {
      position: absolute;
      width: 100%;
      height: 100%;
      z-index: 1;
      opacity: var(--animation-ratio);
      background: #fff;
    }
  }

  .frame-content {
    position: relative;
    z-index: 2;
    margin-top: var(--content-mg-top);
    overflow: hidden;

    // 歌手信息
    .section-frame-info {
      width: 100%;
      .frame-frame-info-spacing {
        padding: 32px;
        display: flex;
        width: 100%;
        height: 100%;
        align-items: flex-end;
        justify-content: flex-start;
        .frame-info-main {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: flex-end;
          border-left: 6px solid #fff;
          padding-left: 24px;
          box-sizing: border-box;
          .frame-info-name {
            color: rgba(255, 255, 255, 1);
            width: 100%;
            font-size: 56px;
            line-height: 56px;
            font-weight: 900;
            margin-bottom: 16px;
          }
          .frame-info-sub {
            color: rgba(255, 255, 255, 1);
            font-weight: 600;
            margin-bottom: 20px;
          }
          .frame-info-desc {
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

    .section-frame-content {
      // height: calc(100% + var(--content-mg-top));
      .section-frame-bg {
        position: absolute;
        width: 100%;
        height: 100%;
        z-index: -1;
        background-image: linear-gradient(
          rgba(255, 255, 255, 0.6) 0,
          rgba(255, 255, 255, 1) 220px
        );
      }
    }

    // 按钮栏
    .frame-action {
      width: 100%;
      padding: 32px;
      // background-image: linear-gradient(
      //   rgba(255, 255, 255, 0.6),
      //   rgba(255, 255, 255, 1)
      // );
      .frame-action-content {
        display: flex;
        align-items: center;
        .action-btn-play {
          margin-right: 16px;
          border: none;
          outline: none;
          cursor: pointer;
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
          margin-left: 16px;
          // background: transparent;
          // border: 1px solid rgba(0, 0, 0, 0.6);
          border: none;
          background-color: rgba(0, 0, 0, 0.05);
          border-radius: 16px;
          cursor: pointer;
        }
      }
    }

    // 歌手作品
    .frame-list {
      width: 100%;
      height: 100%;
      // background: #fff;
      padding: 32px;
      min-height: calc(100vh - var(--header-height) + 32px);
    }
  }
}
</style>

