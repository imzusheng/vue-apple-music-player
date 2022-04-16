/*
 * @Author: zusheng
 * @Date: 2022-04-10 20:43:36
 * @LastEditTime: 2022-04-16 21:41:34
 * @Description: 路由
 * @FilePath: \vite-music-player\src\router\index.ts
 */
import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import { store } from '@/store'

const routes = [
  {
    path: '/',
    name: 'layoutDefault',
    component: () => import('@/views/LayoutDefault.vue'),
    children: [
      {
        path: '',
        redirect: '/discovery'
      },
      {
        path: 'recommend',
        name: 'home',
        meta: { description: '主页' },
        component: () => import('@/views/PageHome.vue')
      },
      {
        path: 'discovery',
        name: 'discovery',
        meta: { description: '探索' },
        component: () => import('@/views/pageDiscovery.vue')
      },
      {
        path: '',
        name: 'library',
        meta: { description: '媒体库' },
        component: () => import('@/views/PageHome.vue')
      },
      {
        path: '',
        name: 'search',
        meta: { description: '搜索' },
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
        path: 'song',
        name: 'song',
        meta: { description: '专辑单曲详情' },
        component: () => import('@/views/DetailAlbum.vue')
      },
      {
        path: 'djp',
        name: 'djp',
        meta: { description: '电台节目详情' },
        component: () => import('@/views/DetailDjp.vue')
      },
      {
        path: 'dj',
        name: 'dj',
        meta: { description: '电台详情' },
        component: () => import('@/views/DetailDj.vue')
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
  // history: createWebHistory(),
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    return {
      left: 0,
      top: 0
    }
  }
})

router.beforeResolve(async to => {
  if (store.state.error.status) {
    store.commit('setError', {
      status: false
    })
  }
  document.documentElement.style.setProperty('--animation-ratio', '0')
  document.documentElement.style.setProperty('--animation-target', '0')
})

export default router
