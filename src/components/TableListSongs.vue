<!--
Author: zusheng
Date: 2022-04-12 18:47:25
LastEditTime: 2022-04-14 21:04:26
Description: 歌曲表格展示 单击切歌，有XL/L/M/S四种尺寸
                L: 封面，歌名，专辑，发布时间，时长
                L: 封面，歌名，专辑，时长
                M: 封面，歌名，时长
                S: 封面，歌名，时长
FilePath: \vite-music-player\src\components\TableListSongs.vue
-->

<script lang="ts" setup>
import { SongTableRow } from '@/common/types'
import InfiniteList from './InfiniteList.vue'

const props = defineProps<{
  // 数据
  songs: Array<SongTableRow>

  // 表格尺寸 L/M/S
  size: string

  // 表头是否显示
  title: boolean

  // 是否使用虚拟滚动条
  virtualScroll: boolean

  // 是否显示序号
  index?: boolean
}>()
</script>

<template>
  <div
    class="song-table-wrap"
    :class="{ 'song-table-hide-index': !props.index }"
  >
    <!-- 表头 -->
    <div
      v-if="props.title"
      class="song-table-title"
      :class="`table-title-size-${props.size.toLowerCase()}`"
    >
      <div v-if="props.index">#</div>
      <div>标题</div>
      <div v-if="['XL', 'L'].includes(props.size.toUpperCase())">专辑</div>
      <div v-if="['XL'].includes(props.size.toUpperCase())">发布时间</div>
      <div>时长</div>
    </div>
    <!-- 数据 ul-->

    <!-- 使用了虚拟滚动条 -->
    <infinite-list
      v-if="virtualScroll"
      class="song-table"
      :listData="props.songs"
    >
      <template #default="{ listItem }">
        <div
          class="table-row"
          :class="`table-title-size-${props.size.toLowerCase()}`"
        >
          <!-- 序号 -->
          <div v-if="props.index" class="table-cell-index">
            <span class="playlist-table-index"> {{ listItem.idx }}</span>
            <span class="playlist-table-icon">
              <img alt="" src="../assets/icon-song-play-black.svg" />
            </span>
          </div>

          <!-- 歌曲名字和作者 -->
          <div class="table-cell-desc table-cell-ellipsis">
            <img class="table-cell-desc-pic" :src="listItem.picUrl" alt="" />
            <div class="table-cell-desc-info table-cell-ellipsis">
              <!-- 歌名 -->
              <div class="table-desc-name">
                <span :title="listItem.title" class="table-cell-ellipsis">
                  {{ listItem.title }}</span
                >
                <!-- vip图标 -->
                <img
                  v-if="['1'].includes(listItem.fee)"
                  ref=""
                  alt=""
                  class="table-cell-desc-vip"
                  src="../assets/vip.svg"
                />
              </div>
              <!-- 作者名 -->
              <div
                v-if="['XL', 'L', 'M'].includes(size.toUpperCase())"
                :title="listItem.artist"
                class="table-desc-art table-cell-ellipsis"
              >
                {{ listItem.artist }}
              </div>
            </div>
          </div>

          <!-- 专辑名 -->
          <div
            v-if="['XL', 'L'].includes(props.size.toUpperCase())"
            class="table-cell-ellipsis table-cell-album"
          >
            <div
              :title="listItem.album"
              class="table-cell-ellipsis table-cell-album"
              style="display: block"
            >
              {{ listItem.album }}
            </div>
          </div>

          <!-- 发布时间 -->
          <div
            v-if="['XL'].includes(props.size.toUpperCase())"
            class="table-cell-pub"
          >
            {{ listItem.publishTime }}
          </div>

          <!-- 时长 -->
          <div class="table-cell-dt">{{ listItem.duration }}</div>
        </div>
      </template>
    </infinite-list>

    <!-- 未使用虚拟滚动条 -->
    <ul v-else class="song-table">
      <li
        v-for="(listItem, listIndex) in props.songs"
        :key="`songs-${listIndex}`"
        :class="`table-row-size-${props.size.toLowerCase()}`"
        class="table-row"
      >
        <!-- 序号 -->
        <div v-if="props.index" class="table-cell-index">
          <span class="playlist-table-index"> {{ listIndex + 1 }}</span>
          <span class="playlist-table-icon">
            <img alt="" src="../assets/icon-song-play-black.svg" />
          </span>
        </div>

        <!-- 歌曲名字和作者 -->
        <div class="table-cell-desc table-cell-ellipsis">
          <img
            v-lazy:[listItem.picUrl]
            class="table-cell-desc-pic"
            src="../assets/empty_white.png"
            alt=""
          />
          <div class="table-cell-desc-info table-cell-ellipsis">
            <!-- 歌名 -->
            <div class="table-desc-name">
              <span :title="listItem.title" class="table-cell-ellipsis">
                {{ listItem.title }}</span
              >
              <!-- vip图标 -->
              <img
                v-if="['1'].includes(listItem.fee)"
                ref=""
                alt=""
                class="table-cell-desc-vip"
                src="../assets/vip.svg"
              />
            </div>
            <!-- 作者名 -->
            <div
              v-if="['XL', 'L', 'M'].includes(props.size.toUpperCase())"
              :title="listItem.artist"
              class="table-desc-art table-cell-ellipsis"
            >
              {{ listItem.artist }}
            </div>
          </div>
        </div>

        <!-- 专辑名 -->
        <div
          v-if="['XL', 'L'].includes(props.size.toUpperCase())"
          class="table-cell-ellipsis table-cell-album"
        >
          <div
            :title="listItem.album"
            class="table-cell-ellipsis table-cell-album"
            style="display: block"
          >
            {{ listItem.album }}
          </div>
        </div>

        <!-- 发布时间 -->
        <div
          v-if="['XL'].includes(props.size.toUpperCase())"
          class="table-cell-pub"
        >
          {{ listItem.publishTime }}
        </div>

        <!-- 时长 -->
        <div class="table-cell-dt">{{ listItem.duration }}</div>
      </li>
    </ul>
  </div>
</template>

<style lang="less">
.song-table-wrap {
  // 表格标题
  .song-table-title {
    display: grid;
    grid-gap: 16px;
    grid-template-columns:
      [index] 16px
      [first] 6fr
      [var1] 4fr
      [var2] 3fr
      [last] minmax(120px, 1fr);
    padding: 0 16px;
    cursor: pointer;
    border-bottom: 1px solid rgba(100, 100, 100, 0.15);

    > div {
      padding: 12px 0 0;
      color: rgba(0, 0, 0, 0.45);
      font-size: 16px;

      &:last-child {
        text-align: right;
        margin-right: 32px;
      }
    }
  }

  // 最大尺寸
  .table-title-size-xl {
    padding: 16px;
    grid-template-columns:
      [index] 16px
      [first] 6fr
      [var1] 4fr
      [var2] 3fr
      [last] minmax(120px, 1fr);
  }

  // l
  .table-title-size-l {
    padding: 16px;
    grid-template-columns:
      [index] 16px
      [first] 6fr
      [var1] 4fr
      [last] minmax(120px, 1fr);
  }

  // 中等尺寸,去掉专辑
  .table-title-size-m {
    grid-template-columns:
      [index] 16px
      [name] auto
      [last] minmax(120px, 1fr);
  }

  // 小尺寸,只保留封面、歌名、时长
  .table-title-size-s {
    padding: 0;
    grid-template-columns:
      [name] auto
      [last] minmax(120px, 1fr);
  }

  // ul
  .song-table {
    padding-top: 6px;
    // li
    .table-row {
      display: grid;
      grid-gap: 16px;
      grid-template-columns:
        [index] 16px
        [name] 6fr
        [al] 4fr
        [last] minmax(120px, 1fr);
      padding: 0 16px;
      border-radius: 6px;
      cursor: pointer;
      // li > div
      > div {
        display: flex;
        align-items: center;
        padding: 4px 0;

        &:last-child {
          justify-content: flex-end;
          margin-right: 32px;
        }
      }

      // index单元格
      .table-cell-index {
        justify-content: center;
        align-items: center;

        .playlist-table-index {
          display: block;
          color: rgba(0, 0, 0, 0.3);
        }

        .playlist-table-icon {
          display: none;
        }
      }

      // 歌曲信息
      .table-cell-desc {
        // 歌曲封面
        .table-cell-desc-pic {
          height: 54px;
          width: 54px;
          flex-shrink: 0;
          margin-right: 5px;
          padding: 5px;
          box-sizing: border-box;
        }

        // 歌曲名 和 歌手
        .table-cell-desc-info {
          .table-desc-name {
            grid-area: title;
            color: #121212;
            display: flex;
            align-items: center;

            > span {
              font-size: 15px;
              color: #121212;
              font-weight: 600;
            }

            .table-cell-desc-vip {
              height: 32px;
              width: 32px;
              margin-left: 4px;
            }
          }
        }
      }

      // 专辑
      .table-cell-album,
      .table-cell-pub,
      .table-desc-art,
      .table-cell-dt {
        color: rgba(0, 0, 0, 0.65);
        font-size: 14px;
      }

      // hover样式
      &:hover {
        background: rgba(0, 0, 0, 0.1);

        .playlist-table-index {
          display: none;
        }

        .playlist-table-icon {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .table-desc-name {
          text-decoration: underline;
        }
      }

      // 需要省略的格子
      .table-cell-ellipsis {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }

    // 最大尺寸
    .table-row-size-xl {
      padding: 16px;
      grid-template-columns:
        [index] 16px
        [first] 6fr
        [var1] 4fr
        [var2] 3fr
        [last] minmax(120px, 1fr);
    }

    .table-row-size-l {
      grid-template-columns:
        [index] 16px
        [first] 6fr
        [var1] 4fr
        [last] minmax(120px, 1fr);
    }

    // 中等尺寸,去掉专辑
    .table-row-size-m {
      grid-template-columns:
        [index] 16px
        [name] auto
        [last] minmax(120px, 1fr);
    }

    // 小尺寸,只保留封面、歌名、时长
    .table-row-size-s {
      padding: 0;
      grid-template-columns:
        [name] auto
        [last] minmax(120px, 1fr);
    }

    // 正在播放的歌曲样式
    .playing {
      background: rgb(60, 60, 60);

      .playlist-table-index {
        display: none !important;
      }

      .playlist-table-icon {
        display: flex !important;
        align-items: center;
        justify-content: center;

        .icon-pause {
          display: none;
        }

        .icon-equaliser {
          display: block;
        }
      }

      &:hover {
        .playlist-table-icon {
          .icon-pause {
            display: block;
          }

          .icon-equaliser {
            display: none;
          }
        }
      }
    }
  }
}

// 无序号的样式
.song-table-hide-index {
  // 表头无序号样式
  .table-title-size-xl {
    padding: 16px;
    grid-template-columns:
      [first] 6fr
      [var1] 4fr
      [var2] 3fr
      [last] minmax(120px, 1fr) !important;
  }
  .table-title-size-l {
    padding: 16px;
    grid-template-columns:
      [first] 6fr
      [var1] 4fr
      [last] minmax(120px, 1fr) !important;
  }
  .table-title-size-m {
    grid-template-columns:
      [name] auto
      [last] minmax(120px, 1fr) !important;
  }

  // 行无序号样式
  .table-row-size-xl {
    padding: 16px;
    grid-template-columns:
      [first] 6fr
      [var1] 4fr
      [var2] 3fr
      [last] minmax(120px, 1fr) !important;
  }
  .table-row-size-l {
    grid-template-columns:
      [first] 6fr
      [var1] 4fr
      [last] minmax(120px, 1fr) !important;
  }
  // 中等尺寸,去掉专辑
  .table-row-size-m {
    grid-template-columns:
      [name] auto
      [last] minmax(120px, 1fr) !important;
  }
}
</style>

