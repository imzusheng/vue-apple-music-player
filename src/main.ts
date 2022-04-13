/*
 * @Author: zusheng
 * @Date: 2022-04-10 20:15:36
 * @LastEditTime: 2022-04-13 00:01:48
 * @Description: 入口
 * @FilePath: \vite-music-player\src\main.ts
 */
import { createApp } from 'vue'
import { store, key } from '@/store'
import router from '@/router'
import { columnMatchDirective, lazyloadDirective } from '@/common/directive'
import App from '@/App.vue'

createApp(App).use(store, key).use(router).use(columnMatchDirective).use(lazyloadDirective).mount('#app')

