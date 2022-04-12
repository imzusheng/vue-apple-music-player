<!--
Author: zusheng
Date: 2022-04-11 18:15:50
LastEditTime: 2022-04-12 08:20:02
Description: 歌单详情页
FilePath: \vite-music-player\src\views\DetailArtist.vue
-->

<script lang="ts" setup>
import { useRoute } from 'vue-router'
import { onMounted, onUnmounted, reactive, ref } from 'vue'
import { mapActionsHelpers } from '@/common/util'
import SectionListGrid from '@/components/SectionListGrid.vue'

const data = reactive({
  artistDetail: {},
  artistFans: {},
  albums: [],
  videos: [],
  mvs: [],
  simi: []
})

const route = useRoute()
const id = route.query.payload

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

const artistContentRef = ref<any>()
const infoRef = ref<any>()
const actionRef = ref<any>()
const maskRef = ref<any>(null)
const posterRef = ref<any>(null)

// 处理动画
const animationHandler = () => {
  const targetHeight = document.documentElement.clientHeight * 0.6
  const curScrollTop = document.documentElement.scrollTop
  let curValue: any
  if (targetHeight > curScrollTop) {
    curValue = 1 - (targetHeight - curScrollTop) / targetHeight
  } else {
    curValue = 1
  }
  curValue = curValue.toFixed(3)
  posterRef.value.style.transform = `scale(${1.05 - 0.05 * curValue})`
  maskRef.value.style.opacity = curValue
}

onMounted(() => {
  // 每次进入页面时，设定css变量--content-mg-top
  const mgTop = actionRef.value.offsetHeight + infoRef.value.offsetHeight + 'px'
  artistContentRef.value.style.setProperty('--content-mg-top', `-${mgTop}`)
  // 监听动画
  document.addEventListener('scroll', animationHandler)
})

onUnmounted(() => {
  document.removeEventListener('scroll', animationHandler)
})
</script>

<template>
  <div id="detail-artist">
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
            <span class="artist-info-name">G.E.M.邓紫棋</span>
            <span class="artist-info-desc"
              >邓紫棋（G.E.M.），本名邓诗颖，1991年8月16日出生于上海市，中国香港流行乐女歌手、词曲作者、音乐制作人。
              2008年，发行个人首张音乐EP《G.E.M.》，凭该EP获得香港叱咤乐坛流行榜“叱咤乐坛生力军女歌手（金奖）”。2009年，发行个人首张音乐专辑《18...》。2011年，成为首位登上香港体育馆开唱的90后华语女歌手。2012年，凭借音乐专辑《Xposed》入围第24届台湾金曲奖“最佳国语女歌手奖”，并获得IFPI香港唱片销量大奖“全年最高销量女歌手奖”和“最高销量国语唱片奖”。2013年，举行邓紫棋“X.X.X.”世界巡回演唱会。2014年，获得湖南卫视歌唱真人秀节目《我是歌手第二季》总决赛亚军；同年，获得第27届美国儿童选择奖“最受欢迎亚洲艺人奖”。
              2015年，登上2015年中央电视台春节联欢晚会，弹唱歌曲《多远都要在一起》；同年，位列《2015年福布斯中国名人榜》第11名。2016年，入选福布斯《全球30岁以下最具潜力音乐人榜单》；同年，获得MTV欧洲音乐奖“中国内地及香港地区最佳艺人奖”。2018年，成为美国国家航空航天局“科学突破奖”首位亚洲颁奖女艺人；同年，入选英国广播公司BBC发布的《全球最具影响力百大女性榜单》。2019年，《光年之外》MV在视频平台YouTube突破2亿次点击量。2020年，凭借音乐专辑《摩天动物园》获得第31届台湾金曲奖“评审团奖”；同年，获得Mnet亚洲音乐大奖“最佳亚洲艺人奖”。</span
            >
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
            订阅 695.1万
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
  --poster-url: url(http://p2.music.126.net/W42LIbHIkxcccJfQYWzSIA==/109951164561122718.jpg?param=1600y900);
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
      transform: scale(1.05);
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
      opacity: 0;
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

