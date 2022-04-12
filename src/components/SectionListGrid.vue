<!--
Author: zusheng
Date: 2022-04-11 11:08:36
LastEditTime: 2022-04-12 13:26:51
Description: 歌单展示列表grid布局
FilePath: \vite-music-player\src\components\SectionListGrid.vue
-->
<script lang="ts" setup>
import { useStore } from '@/store'
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import SectionListItem from '@/components/SectionListItem.vue'

const props = defineProps<{
  // 获取数据的action名字
  action: string
  // 调用action的参数
  actionParams?: any
  // 是否显示播放按钮
  playBtn?: boolean
  // 封面是否圆角
  round?: boolean
  // 大标题
  sectionTitle: string
}>()

const emit = defineEmits(['onload'])

const store = useStore()
const router = useRouter()
const listData = reactive<any>({
  data: []
})

store.dispatch(`get${props.action}`, props.actionParams).then((res) => {
  listData.data = res.data
  // 加载完成后调用绑定的onload方法
  emit('onload', props.action)
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
    <h2 class="list-title" v-if="sectionTitle">
      {{ sectionTitle }}
      <router-link
        class="list-sub-title"
        v-if="listData.data.length > 6"
        :to="{
          name: 'more',
          query: {
            type: props.action
          }
        }"
        v-text="'更多'"
      />
    </h2>

    <!-- 列表 -->
    <ul class="list">
      <template
        v-for="item in listData.data.slice(0, store.state.columnCount)"
        :key="item.payload"
      >
        <section-list-item
          @click="toDetail(item.routeName, item.payload)"
          :playBtn="props.playBtn"
          :round="props.round"
          :data="item"
        />
      </template>
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
  }
}
</style>
