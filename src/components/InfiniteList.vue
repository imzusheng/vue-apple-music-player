<!--
Author: zusheng
Date: 2022-04-14 12:00:28
LastEditTime: 2022-04-17 20:48:30
Description: 无限滚动列表
FilePath: \vite-music-player\src\components\InfiniteList.vue
-->

<script lang="ts" setup>
import {
  ref,
  computed,
  nextTick,
  reactive,
  watchEffect,
  onUnmounted
} from 'vue'

const props = defineProps<{
  listData: Array<any>
}>()

// 列表HTMLElementDom
const ulRef = ref<any>(null)

// 屏幕高度
const screenH = document.documentElement.clientHeight

const data = reactive<any>({
  // 列表第一项的高度（起始高度）
  initH: 0,

  // 一行的高度
  unitH: 0,

  // 屏幕范围内能显示个数
  displayCount: 0,

  // 列表起始值
  startIdx: 0
})

const listData = computed(() => {
  if (props.listData.length === 0 || data.displayCount === 0)
    return props.listData.slice(0, 1)

  // let startIds = data.startIdx - 10
  // if (startIds <= 0) startIds = 0

  let endIdx = data.startIdx + data.displayCount + 10
  if (endIdx >= props.listData.length) endIdx = props.listData.length

  const computedData = props.listData
    .slice(data.startIdx, endIdx)
    .map((v, k) => {
      v.idx = data.startIdx + k + 1
      return v
    })

  return computedData
})

function scrollHandler() {
  // 当前滚动高度
  const curScrollTop = document.documentElement.scrollTop
  if (curScrollTop > data.initH) {
    const addCount = Math.floor((curScrollTop - data.initH) / data.unitH)
    ulRef.value.style.setProperty('padding-top', `${addCount * data.unitH}px`)
    data.startIdx = addCount
  } else {
    ulRef.value.style.setProperty('padding-top', '0px')
    data.startIdx = 0
  }
}

watchEffect(() => {
  if (props.listData.length > 0) {
    nextTick(() => {
      // 列表距离顶部距离
      data.initH =
        ulRef.value.getBoundingClientRect().top +
        document.documentElement.scrollTop
      // 计算每行高度
      data.unitH = ulRef.value.children[0].offsetHeight
      // 计算屏幕内能显示的行数
      data.displayCount = Math.ceil(screenH / data.unitH)
      // 设置列表总高度 = 一行高度 * 行数
      const listH = data.unitH * props.listData.length
      ulRef.value.style.setProperty('height', `${listH}px`)

      window.removeEventListener('scroll', scrollHandler)
      window.addEventListener('scroll', scrollHandler)
    })
  }
})

onUnmounted(() => {
  window.removeEventListener('scroll', scrollHandler)
})
</script>


<template>
  <ul ref="ulRef">
    <li
      v-for="(listItem, listIndex) in listData"
      :key="`list-${listIndex}`"
      :data-idx="listItem.idx"
    >
      <slot :listItem="listItem"></slot>
    </li>
  </ul>
</template>
