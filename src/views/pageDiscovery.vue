<!--
Author: zusheng
Date: 2022-04-13 15:29:38
LastEditTime: 2022-04-19 22:07:37
Description: 探索页面
FilePath: \vite-music-player\src\views\pageDiscovery.vue
-->
<script setup lang="ts">
import { mapActionsHelpers, getRandomIndex } from '@/common/util'
import TableListSongs from '@/components/TableListSongs.vue'
import SectionTitle from '@/components/SectionTitle.vue'
import CardMv from '@/components/CardMv.vue'
import CardArtist from '@/components/CardArtist.vue'
import CardPlaylist from '@/components/CardPlaylist.vue'
import SectionBanner from '@/components/SectionBanner.vue'
import { useStore } from '@/store'
import { reactive, watchEffect, ref, toRaw } from 'vue'

const {
  getToplistDetail,
  getToplistArtist,
  getNewSongs,
  getDjBanner,
  getBanner,
  getTopMv
} = mapActionsHelpers(null, [
  'getToplistDetail',
  'getPlaylistDetail',
  'getToplistArtist',
  'getSongsDetail',
  'getNewSongs',
  'getDjBanner',
  'getBanner',
  'getTopMv'
])

const store = useStore()

const data = reactive<any>({
  list: [],

  // 海报
  banner: {
    payload: '',
    title: '',
    picUrl: '',
    type: 1,
    desc: ''
  },
  djBanner: {
    payload: '',
    title: '',
    picUrl: '',
    type: 1,
    desc: ''
  },

  // 新歌速递
  newSongs: {
    all: {
      list: [],
      sub: '',
      pic: ''
    },
    jk: {
      list: [],
      sub: '',
      pic: ''
    },
    occident: {
      list: [],
      sub: '',
      pic: ''
    }
  },

  // 歌手排行榜
  toplistArtist: {
    // 欧美
    occident: [],
    // 日韩
    jk: [],
    // 国内
    china: []
  },

  // mv
  mvs: [],

  // 榜单
  toplist: {
    cloud: [],
    other: []
  }
})

// 标记请求是否完成
const loadings = reactive<any>([])
loadings.push(new Array(10).fill('target'))
store.commit('setLoading', true)

watchEffect(() => {
  if (loadings.length === 0) {
    store.commit('setLoading', false)
  }
})

// banner图片
getBanner().then((res: any) => {
  loadings.shift()
  const banners = res
  const curBannerIdx = getRandomIndex(0, res.length - 1)
  Object.assign(data.banner, banners[curBannerIdx])
})
// Djbanner图片
getDjBanner().then((res: any) => {
  loadings.shift()
  const banners = res
  const curBannerIdx = getRandomIndex(0, res.length - 1)
  Object.assign(data.djBanner, banners[curBannerIdx])
})

// 新歌排行
getNewSongs({ type: 0 }).then((res: any) => {
  loadings.shift()
  data.newSongs.all.list = res.slice(0, 5)
  data.newSongs.all.sub = res.map((v: any) => v.artist).join('、')
  data.newSongs.all.pic = res[0].picUrl
})
// 日本新歌排行
getNewSongs({ type: 8 }).then((res: any) => {
  loadings.shift()
  data.newSongs.jk.list = res.slice(0, 5)
  data.newSongs.jk.sub = res.map((v: any) => v.artist).join('、')
  data.newSongs.jk.pic = res[0].picUrl
})
// 欧美新歌排行
getNewSongs({ type: 96 }).then((res: any) => {
  loadings.shift()
  data.newSongs.occident.list = res.slice(0, 5)
  data.newSongs.occident.sub = res.map((v: any) => v.artist).join('、')
  data.newSongs.occident.pic = res[0].picUrl
})

// mv排行
getTopMv({ limit: 3 }).then((res: any) => {
  loadings.shift()
  data.mvs = res
})

// 欧美歌手排行榜
getToplistArtist({ type: 2 }).then((res: any) => {
  loadings.shift()
  data.toplistArtist.occident = res.data.slice(0, 3)
})
// 日韩歌手排行榜
getToplistArtist({ type: 3 }).then((res: any) => {
  loadings.shift()
  data.toplistArtist.jk = res.data.slice(0, 3)
})
// 国内歌手排行榜
getToplistArtist({ type: 1 }).then((res: any) => {
  loadings.shift()
  data.toplistArtist.china = res.data.slice(0, 3)
})

// 获取所有榜单详情
getToplistDetail().then((res: any) => {
  loadings.shift()
  data.list = res.list.map((v: any) => {
    if (
      v.name.indexOf('云音乐') > -1 ||
      ['飙升榜', '新歌榜', '热歌榜', '原创榜'].includes(v.name)
    ) {
      data.toplist.cloud.push(v.name)
    } else {
      data.toplist.other.push(v.name)
    }
    return v
  })
})

// const playlistId = Toplist.飙升榜
// 获取歌单详情里的trackIds,
// 再通过ids获取所有歌曲
// getPlaylistDetail(playlistId)
//   .then((res: any) => {
//     const trackIds = res.trackIds.slice(0, 5).toString()
//     return getSongsDetail(trackIds)
//   })
//   .then((res: any) => {
//     data.list = res
//   })
</script>

<template>
  <div id="page-discovery" class="spacing">
    <!-- 海报 -->
    <div class="discovery-banner">
      <section-banner
        :payload="data.banner.payload"
        :title="data.banner.title"
        :picUrl="data.banner.picUrl"
        :type="data.banner.type"
        :desc="''"
      />
    </div>

    <!--
      新歌速递 + 最热歌手/粉丝最爱
    -->
    <section class="discovery-toplist">
      <!--
        新歌速递
      -->
      <div class="discovery-card toplist-grid-l">
        <card-playlist
          title="新歌热榜"
          :subTitle="data.newSongs.all.sub"
          :picUrl="data.newSongs.all.pic"
        >
          <template #default>
            <table-list-songs
              v-if="data.newSongs.all.list.length > 0"
              :virtualScroll="false"
              :songs="data.newSongs.all.list"
              :title="false"
              size="m"
            />
          </template>
        </card-playlist>
      </div>

      <!--
        最热歌手/粉丝最爱
      -->
      <div class="discovery-card toplist-grid-r">
        <card-artist
          title="国内热门歌手"
          :desc="data.toplistArtist.china.map((v) => v.title).join('、')"
          :imgA="data.toplistArtist.china[0]?.picUrl"
          :imgB="data.toplistArtist.china[1]?.picUrl"
          :imgC="data.toplistArtist.china[2]?.picUrl"
        />
      </div>
    </section>

    <!--
      mv热榜
    -->
    <section class="discovery-mv">
      <template v-for="item in data.mvs" :key="item.payload">
        <card-mv
          :pic-url="item.picUrl"
          :title="item.title"
          :artist="item.artist"
          :desc="item.desc"
          :area="item.area"
        />
      </template>
    </section>

    <!--
      最热歌手/粉丝最爱 + 新歌速递
    -->
    <section class="discovery-toplist">
      <!--
        最热歌手/粉丝最爱
      -->
      <div class="discovery-card toplist-grid-l-2">
        <card-artist
          title="日韩歌手榜单"
          :desc="data.toplistArtist.jk.map((v) => v.title).join('、')"
          :imgA="data.toplistArtist.jk[0]?.picUrl"
          :imgB="data.toplistArtist.jk[1]?.picUrl"
          :imgC="data.toplistArtist.jk[2]?.picUrl"
        />
        <!-- <card-artist
          title="欧美歌手榜单"
          :desc="data.toplistArtist.occident.map((v) => v.title).join('、')"
          :imgA="data.toplistArtist.occident[0]?.picUrl"
          :imgB="data.toplistArtist.occident[1]?.picUrl"
          :imgC="data.toplistArtist.occident[2]?.picUrl"
        /> -->
      </div>

      <!--
        新歌速递
      -->
      <div class="discovery-card toplist-grid-r-2">
        <card-playlist
          title="日本流行音乐"
          :subTitle="data.newSongs.jk.sub"
          :picUrl="data.newSongs.jk.pic"
        >
          <template #default>
            <table-list-songs
              v-if="data.newSongs.jk.list.length > 0"
              :virtualScroll="false"
              :songs="data.newSongs.jk.list"
              :title="false"
              size="m"
            />
          </template>
        </card-playlist>
      </div>
    </section>

    <!-- 海报 -->
    <div class="discovery-banner">
      <section-banner
        :payload="data.djBanner.payload"
        :title="data.djBanner.title"
        :picUrl="data.djBanner.picUrl"
        :type="data.djBanner.type"
      />
    </div>

    <!--
      新歌速递 + 最热歌手/粉丝最爱
    -->
    <section class="discovery-toplist">
      <!--
        新歌速递
      -->
      <div class="discovery-card toplist-grid-l">
        <card-playlist
          title="欧美流行"
          :subTitle="data.newSongs.occident.sub"
          :picUrl="data.newSongs.occident.pic"
        >
          <template #default>
            <table-list-songs
              v-if="data.newSongs.occident.list.length > 0"
              :virtualScroll="false"
              :songs="data.newSongs.occident.list"
              :title="false"
              size="m"
            />
          </template>
        </card-playlist>
      </div>

      <!--
        最热歌手/粉丝最爱
      -->
      <div class="discovery-card toplist-grid-r">
        <card-artist
          title="欧美热门歌手"
          :desc="data.toplistArtist.occident.map((v) => v.title).join('、')"
          :imgA="data.toplistArtist.occident[0]?.picUrl"
          :imgB="data.toplistArtist.occident[1]?.picUrl"
          :imgC="data.toplistArtist.occident[2]?.picUrl"
        />
      </div>
    </section>

    <!--  -->
    <div style="height: 52px"></div>
    <!--  -->

    <!--
      榜单
    -->
    <section-title sectionTitle="云音乐特色榜" subTitle="" actionName="" />
    <section class="discovery-category">
      <div
        v-for="(item, idx) in data.toplist.cloud"
        :key="`category${idx}`"
        class="discovery-category-item"
        :class="`color-${getRandomIndex(0, 9)}`"
      >
        {{ item }}
      </div>
    </section>
    <!--  -->
    <div style="height: 52px"></div>
    <!--  -->
    <section-title sectionTitle="全球媒体排行榜" subTitle="" actionName="" />
    <section class="discovery-category">
      <div
        v-for="(item, idx) in data.toplist.other"
        :key="`category${idx}`"
        class="discovery-category-item"
        :class="`color-${getRandomIndex(0, 9)}`"
      >
        {{ item }}
      </div>
    </section>
  </div>
</template>

<style lang="less">
#page-discovery {
  --discovery-gap: 24px;

  // 分类-列
  --discovery-category-columns: 4;

  // 海报
  .discovery-banner {
    margin-bottom: var(--discovery-gap);
  }

  // 新歌热榜
  .discovery-toplist {
    display: grid;
    margin-bottom: var(--discovery-gap);
    grid-gap: var(--discovery-gap);
    grid-template-columns: repeat(12, 1fr);

    .discovery-card {
      border-radius: 12px;
      background: rgba(246, 246, 246, 1);
      overflow: hidden;
    }

    .toplist-grid-l {
      grid-column: 1/9;
    }

    .toplist-grid-r {
      grid-column: 9/-1;
    }

    .toplist-grid-l-2 {
      grid-column: 1/5;
    }

    .toplist-grid-r-2 {
      grid-column: 5/-1;
    }
  }

  // mv
  .discovery-mv {
    display: grid;
    gap: var(--discovery-gap);
    grid-template-columns: repeat(3, 1fr);
    margin-bottom: var(--discovery-gap);
  }

  // 新碟上架
  .discovery-newAlbum {
    width: 100%;
    .newAlbum-block {
      border-radius: 12px;
      overflow: hidden;
      position: relative;
      cursor: pointer;
      .newAlbum-block-poster {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
        mask-image: linear-gradient(rgba(0, 0, 0, 1) 60%, rgba(0, 0, 0, 0.3));
        -webkit-mask-image: linear-gradient(
          rgba(0, 0, 0, 1) 60%,
          rgba(0, 0, 0, 0.3)
        );
      }
      .newAlbum-block-desc {
        width: 100%;
        left: 0;
        bottom: 0;
        position: absolute;
        z-index: 1;
        // background: rgba(0, 0, 0, 0.6);
        background: linear-gradient(rgba(0, 0, 0, 0.5) 30%, rgba(0, 0, 0, 0.7));
        padding: 30px 0 20px;
        > .newAlbum-block-desc-h3 {
          text-align: center;
          font-size: 18px;
          font-weight: 400;
          color: #fff;
          margin-bottom: 3px;
        }
        > .newAlbum-block-desc-p {
          text-align: center;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.8);
        }
      }
    }
  }

  // 分类
  .discovery-category {
    display: grid;
    grid-template-columns: repeat(var(--discovery-category-columns), 1fr);
    .discovery-category-item {
      margin: 6px;
      padding: 10px 20px;
      border-radius: 6px;
      position: relative;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      cursor: pointer;
      transition: background 0.2s;
      background: rgba(246, 246, 246, 1);
      &::after {
        content: '';
        position: absolute;
        background: var(--color);
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: -1;
        clip-path: inset(0px calc(100% - 6px) 0px 0);
      }
    }
  }

  @media screen and (max-width: 1200px) {
    --discovery-category-columns: 3;
    .discovery-toplist {
      .toplist-grid-l,
      .toplist-grid-r,
      .toplist-grid-l-2,
      .toplist-grid-r-2 {
        grid-column: 1/-1;
      }
    }
  }

  @media screen and (max-width: 968px) {
    --discovery-category-columns: 2;
    .discovery-mv {
      display: grid;
      grid-template-columns: repeat(1, 1fr);
    }
  }

  @media screen and (max-width: 768px) {
    --discovery-category-columns: 1;
    --grid-gap: 10px;
    --page-spacing: 16px;
  }

  @media screen and (max-width: 628px) {
    --discovery-category-columns: 1;
  }

  .color-1 {
    --color: rgba(255, 137, 131, 0.51);
  }
  .color-2 {
    --color: rgba(164, 255, 164, 0.51);
  }
  .color-3 {
    --color: rgba(204, 0, 0, 0.51);
  }
  .color-4 {
    --color: rgba(51, 125, 255, 0.51);
  }
  .color-5 {
    --color: rgba(255, 194, 0, 0.51);
  }
  .color-6 {
    --color: rgba(77, 238, 255, 0.51);
  }
  .color-7 {
    --color: rgba(164, 197, 255, 0.51);
  }
  .color-8 {
    --color: rgba(0, 146, 191, 0.51);
  }
  .color-9 {
    --color: rgba(123, 62, 219, 0.51);
  }
  .color-10 {
    --color: rgba(0, 165, 19, 0.51);
  }
}
</style>
