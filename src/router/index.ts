/*
 * @Author: zusheng
 * @Date: 2022-04-10 20:43:36
 * @LastEditTime: 2022-04-10 21:36:20
 * @Description: 路由
 * @FilePath: \vite-music-player\src\router\index.ts
 */
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'layoutDefault',
    component: () => import('@/components/LayoutDefault.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return {
      left: 0,
      top: 0
    }
  }
})

export default router
