/*
 * @Author: zusheng
 * @Date: 2022-04-10 20:43:36
 * @LastEditTime: 2022-04-12 12:10:43
 * @Description: 路由
 * @FilePath: \vite-music-player\src\router\index.ts
 */
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'layoutDefault',
    component: () => import('@/views/LayoutDefault.vue'),
    children: [
      {
        path: '',
        name: 'pageHome',
        component: () => import('@/views/PageHome.vue')
      },
      {
        path: 'artist',
        name: 'artist',
        component: () => import('@/views/DetailArtist.vue')
      },
      {
        path: 'more',
        name: 'more',
        component: () => import('@/views/DetailArtist.vue')
      }
    ]
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

router.afterEach((to, from) => {
  document.documentElement.style.setProperty('--animation-ratio', '0')
  document.documentElement.style.setProperty('--animation-target', '0')
})

export default router
