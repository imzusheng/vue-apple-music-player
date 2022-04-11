/*
 * @Author: zusheng
 * @Date: 2022-04-10 20:15:36
 * @LastEditTime: 2022-04-11 00:58:22
 * @Description: 入口
 * @FilePath: \vite-music-player\src\main.ts
 */
import { createApp } from 'vue'
import router from './router'
import store from './store'
import App from './App.vue'

createApp(App).use(store).use(router).mount('#app')
