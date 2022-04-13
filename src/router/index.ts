/*
 * @Author: zusheng
 * @Date: 2022-04-10 20:43:36
 * @LastEditTime: 2022-04-12 21:28:13
 * @Description: 路由
 * @FilePath: \vite-music-player\src\router\index.ts
 */
import { createRouter, createWebHistory } from 'vue-router'
import { store } from '@/store'

const routes = [
  {
    path: '/',
    name: 'layoutDefault',
    component: () => import('@/views/LayoutDefault.vue'),
    children: [
      {
        path: '',
        name: 'pageHome',
        meta: { description: '主页' },
        component: () => import('@/views/PageHome.vue')
      },
      {
        path: 'artist',
        name: 'artist',
        meta: { description: '歌手详情' },
        component: () => import('@/views/DetailArtist.vue')
      },
      {
        path: 'album',
        name: 'album',
        meta: { description: '专辑详情' },
        component: () => import('@/views/DetailAlbum.vue')
      },
      {
        path: 'playlist',
        name: 'playlist',
        meta: { description: '歌单详情' },
        component: () => import('@/views/DetailPlaylist.vue')
      },
      {
        path: 'more',
        name: 'more',
        meta: { description: '查看更多' },
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
  if (store.state.error.status) {
    store.commit('setError', {
      status: false
    })
  }
  document.documentElement.style.setProperty('--animation-ratio', '0')
  document.documentElement.style.setProperty('--animation-target', '0')
})

export default router
