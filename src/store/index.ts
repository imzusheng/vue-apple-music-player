/*
 * @Author: zusheng
 * @Date: 2022-04-10 23:22:44
 * @LastEditTime: 2022-04-19 08:45:34
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

  audioDisplay: boolean

  audioUrl: string

  audioInfo: {
    title: string
    album: string
    publishTime: string | number
    artist: string
    picUrl: string
    payload: string | number
  }

  playerDisplay: boolean

  error: {
    status: boolean
    msg?: string
    info?: string
  }

  debugInfo: any
}

export const key: InjectionKey<Store<State>> = Symbol()

export const store = createStore<State>({
  strict: process.env.NODE_ENV !== 'production',
  state: {
    // grid列数
    columnCount: 0,

    // 全局加载状态
    loading: false,

    // 头部标题显示什么
    headerText: '',

    playerDisplay: false,

    // 播放器是否显示
    audioDisplay: false,

    // 当前音频链接
    audioUrl: '',

    // 当前音频信息
    audioInfo: {
      title: '',
      album: '',
      publishTime: '',
      artist: '',
      picUrl: '',
      payload: ''
    },

    // 错误页面
    error: {
      status: false,
      msg: '',
      info: ''
    },

    debugInfo: ''
  },
  getters: {},
  mutations: {
    setDebugInfo(state, payload) {
      state.debugInfo = payload
    },
    setPlayerDisplay(state, payload) {
      state.playerDisplay = payload
    },
    setAudioDisplay(state, payload) {
      state.audioDisplay = payload
    },
    setAudioInfo(state, payload) {
      localStorage.setItem('audioInfo', JSON.stringify(payload))
      state.audioInfo = payload
    },
    setAudioUrl(state, payload) {
      state.audioUrl = payload
    },
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
