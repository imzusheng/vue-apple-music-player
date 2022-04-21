<!--
Author: zusheng
Date: 2022-04-21 11:44:53
LastEditTime: 2022-04-21 13:55:05
Description: 查看更多
FilePath: \vite-music-player\src\views\DetailMore.vue
-->

<script lang="ts" setup>
import { reactive, onMounted, ref } from 'vue'
import { useStore } from '@/store'
import { useRoute, useRouter } from 'vue-router'
import { mapMutationsHelpers } from '@/common/util'
import SectionListItem from '@/components/SectionListItem.vue'

const { setError } = mapMutationsHelpers(null, ['setError'])
const store: any = useStore()
const route: any = useRoute()
const router: any = useRouter()
const loadingRef = ref<any>()

const data = reactive<any>({
  pageIndex: 0,

  listData: [],

  title: '',

  more: true
})

const action = `get${route.query.action}`

if (Object.keys(store._actions).includes(`get${route.query.action}`)) {
  getData()
} else {
  setError({
    status: true,
    msg: '无法找到该页面'
  })
}

onMounted(() => {
  // IntersectionObserver
  const intersectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((item) => {
        // 图片出现，挂上src
        if (item.intersectionRatio > 0) {
          // 停止观察
          data.pageIndex += 1
          getData()
          if (data.pageIndex > 10 || data.more === false) {
            intersectionObserver.unobserve(item.target)
            data.more = false
          }
        }
      })
    },
    {
      threshold: [0]
    }
  )
  // 开始观察
  intersectionObserver.observe(loadingRef.value)
})

function getData() {
  // 调用store函数并传入参数
  store
    .dispatch(action, {
      limit: 30,
      offset: 30 * data.pageIndex
    })
    .then((res: any) => {
      const listDataIds = data.listData.map((v: any) => v.payload)
      // 用id来排除重复值
      res.data.forEach((resVal: any) => {
        if (!listDataIds.includes(resVal.payload)) {
          data.listData.push(resVal)
        }
      })

      data.title = res.title

      // 当获取的数据为空 或 获取的数据都是重复的
      if (
        res.data.length === 0 ||
        listDataIds.length === data.listData.length
      ) {
        data.more = false
      }
    })
}

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
  <main id="display-more">
    <!-- 标题 -->
    <div class="section-more-title">
      <span>
        {{ data.title || '更多' }}
      </span>
    </div>

    <!-- 列表 -->
    <ul class="section-more-list">
      <template v-for="listItem in data.listData" :key="listItem.payload">
        <section-list-item
          @click="toDetail(listItem.routeName, listItem.payload)"
          :data="listItem"
        />
      </template>
    </ul>

    <div class="loading-spacing" v-show="data.listData.length > 0">
      <div
        v-show="data.more"
        ref="loadingRef"
        class="display-no-more"
        v-text="'加载中'"
      />

      <div v-show="!data.more" class="display-no-more" v-text="'没有更多了'" />
    </div>
  </main>
</template>

<style lang="less">
#display-more {
  padding: 32px 16px 0;
  .section-more-title {
    font-size: 28px;
    line-height: 1.5;
    font-weight: 700;
    padding: 32px 0 16px;
  }

  .section-more-list {
    display: grid;
    column-gap: 10px;
    row-gap: 16px;
    grid-template-columns: repeat(2, 1fr);
  }

  .loading-spacing {
    position: relative;
    height: 50px;
    margin-bottom: 50px;
    .display-more-loading {
      position: absolute;
    }
    .display-no-more {
      display: flex;
      justify-content: center;
      align-items: flex-end;
      height: 100%;
      color: #b3b3b3;
    }
  }
}
</style>
