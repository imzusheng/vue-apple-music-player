/*
 * @Author: zusheng
 * @Date: 2022-04-10 23:22:44
 * @LastEditTime: 2022-04-13 13:33:21
 * @Description: vuex
 * @FilePath: \vite-music-player\src\store\index.ts
 */
import { InjectionKey } from 'vue'
import { createStore, useStore as baseUseStore, Store } from 'vuex'
import actions from './actions'

// 为 store state 声明类型
export interface State {
  columnCount: number | string
  loading: boolean
  headerText: string
  error: {
    status: boolean
    msg?: string
    info?: string
  }
}

export const key: InjectionKey<Store<State>> = Symbol()

// 定义 injection key
// export const key: InjectionKey<Store<State>> = Symbol()

export const store = createStore<State>({
  strict: process.env.NODE_ENV !== 'production',
  state: {
    // grid列数
    columnCount: 0,

    // 全局加载状态
    loading: false,

    // 头部标题显示什么
    headerText: '',

    // 错误页面
    error: {
      status: false,
      msg: '',
      info: ''
    }
  },
  getters: {},
  mutations: {
    setHeaderText(state, payload) {
      state.headerText = payload
    },
    setLoading(state, payload) {
      state.loading = payload
    },
    setcolumnCount(state, payload) {
      state.columnCount = payload
    },
    setError(state, { status = false, msg = '', info = '' }) {
      state.error.status = status
      state.error.msg = msg
      state.error.info = info
    }
  },
  actions,
  modules: {
    // artist: {
    //   namespaced: true,
    //   actions: {
    //     // 获取歌手专辑
    //     getArtistAlbum: {
    //       async handler(namespacedContext, id) {
    //         console.log(namespacedContext)
    //         const resJson = await get(API.ART.GET_ARTIST_ALBUM, { id })
    //         const data = resJson.hotAlbums.map((v: any): any => {
    //           return {
    //             title: v.name ?? '',
    //             desc: `${moment(v.publishTime).year()} • ${v.type === 'Single' ? (v.type = '单曲') : v.type}`,
    //             routeName: 'album',
    //             picUrl: v.picUrl + '?param=200y200',
    //             payload: v.id
    //           }
    //         })
    //         return {
    //           data,
    //           title: '专辑',
    //           type: 'hotAlbums'
    //         }
    //       }
    //     }
    //   }
    // }
  }
})

// 定义自己的 `useStore` 组合式函数
export function useStore() {
  return baseUseStore(key)
}
