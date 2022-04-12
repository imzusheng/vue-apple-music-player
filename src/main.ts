/*
 * @Author: zusheng
 * @Date: 2022-04-10 20:15:36
 * @LastEditTime: 2022-04-11 17:28:32
 * @Description: 入口
 * @FilePath: \vite-music-player\src\main.ts
 */
import { createApp } from 'vue'
import router from '@/router'
import { store, key } from '@/store'
import App from '@/App.vue'
import { columnMatchDirective, lazyloadDirective } from '@/common/directive'

createApp(App).use(store, key).use(router).use(columnMatchDirective).use(lazyloadDirective).mount('#app')

