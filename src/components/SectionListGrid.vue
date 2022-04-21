<!--
Author: zusheng
Date: 2022-04-11 11:08:36
LastEditTime: 2022-04-21 13:51:36
Description: 歌单展示列表grid布局
FilePath: \vite-music-player\src\components\SectionListGrid.vue
-->
<script lang="ts" setup>
import { useStore } from '@/store'
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import SectionListItem from '@/components/SectionListItem.vue'
import SectionTitle from '@/components/SectionTitle.vue'

const { action, actionParams } = defineProps<{
  // 获取数据的action名字
  action: string

  // 大标题
  sectionTitle: string

  // 强制显示查看更多的按钮（原本是自动计算）
  more?: boolean

  // 小标题
  subTitle?: string

  // 调用action的参数
  actionParams?: object

  // 是否显示播放按钮
  playBtn?: boolean

  // 封面是否圆角
  round?: boolean

  // 大小倍率，如果为2则占用column列数*2
  // sizeRatio?: number
}>()

const emit = defineEmits(['onload'])

emit('onload', null)

const store = useStore()
const router = useRouter()
const listData = reactive<any>({
  data: []
})

store
  .dispatch(`get${action}`, actionParams)
  .then((res) => {
    listData.data = res.data
    // 加载完成后调用绑定的onload方法
    emit('onload', action)
  })
  .catch((err: any) => {
    store.commit('setError', {
      status: true,
      info: err.stack
    })
  })

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
  <section class="section-list-grid" v-if="listData.data.length > 0">
    <!-- 大标题 -->
    <section-title
      :sectionTitle="sectionTitle"
      :subTitle="subTitle"
      :actionName="listData.data.length > 6 || more ? action : null"
    />

    <!-- 列表 -->
    <ul class="list">
      <template
        v-for="item in listData.data.slice(0, store.state.columnCount)"
        :key="item.payload"
      >
        <section-list-item
          @click="toDetail(item.routeName, item.payload)"
          :playBtn="playBtn"
          :round="round"
          :data="item"
        />
      </template>
    </ul>
  </section>
</template>


<style lang="less">
.section-list-grid {
  margin-bottom: 36px;
  // h2
  .list-title {
    width: 100%;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    padding: 16px 0;
    .list-title-content {
      .list-title-h2 {
        font-size: 28px;
        font-weight: 700;
        line-height: calc(28px * 1.6);
      }
      .list-title-sub {
        font-size: 16px;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.45);
      }
    }
    .list-title-more {
      font-size: 16px;
      margin-left: 16px;
      font-weight: 400;
      line-height: calc((28px * 1.6) - 8px);
      color: rgba(0, 0, 0, 0.8);
    }
  }

  // ul
  .list {
    display: grid;
    gap: var(--grid-gap);
    grid-template-columns: repeat(calc(var(--column-count)), 1fr);
  }
}
</style>
