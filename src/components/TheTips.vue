<!--
Author: zusheng
Date: 2022-04-21 17:18:14
LastEditTime: 2022-04-21 17:27:52
Description: 全局提示小组件
FilePath: \vite-music-player\src\components\TheTips.vue
-->

<script lang="ts" setup>
import { reactive, watchEffect } from 'vue'
import { useStore } from '@/store'

const store = useStore()
const data = reactive<any>({
  isShow: false
})

watchEffect(() => {
  if (store.state.tips) {
    data.isShow = true
    if (data.timer) {
      clearTimeout(data.timer)
      data.timer = undefined
    }

    data.timer = setTimeout(() => {
      data.isShow = false
      store.commit('setTips', '')
    }, 2000)
  }
})
</script>


<template>
  <transition name="fade">
    <div class="tips" v-if="data.isShow">
      {{ store.state.tips }}
    </div>
  </transition>
</template>

<style lang="less" scoped>
.tips {
  position: fixed;
  top: 50%;
  left: 50%;
  z-index: 999;
  padding: 10px 16px;
  transform: translate(-50%, -50%);
  background: rgba(230, 230, 230, 1);
  color: #000;
  border-radius: 4px;
  letter-spacing: 1px;
  box-shadow: 4px 4px 20px rgba(0, 0, 0, 0.05);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>

