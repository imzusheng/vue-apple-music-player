/*
 * @Author: zusheng
 * @Date: 2022-04-10 23:22:44
 * @LastEditTime: 2022-04-12 12:04:03
 * @Description: vuex
 * @FilePath: \vite-music-player\src\store\index.ts
 */
import { InjectionKey } from 'vue'
import { createStore, useStore as baseUseStore, Store } from 'vuex'
import actions from './actions'

import API from '@/common/api'
import moment from 'moment'
import { get } from '@/common/apiService'

// 为 store state 声明类型
export interface State {
  columnCount: number | string
}

// 定义 injection key
export const key: InjectionKey<Store<State>> = Symbol()

export const store = createStore<State>({
  strict: process.env.NODE_ENV !== 'production',
  state: {
    // grid列数
    columnCount: 0
  },
  getters: {},
  mutations: {
    setcolumnCount(state, count) {
      state.columnCount = count
    }
  },
  actions,
  modules: {
    artist: {
      namespaced: true,
      actions: {
        // 获取歌手专辑
        getArtistAlbum: {
          async handler(namespacedContext, id) {
            console.log(namespacedContext)

            const resJson = await get(API.ART.GET_ARTIST_ALBUM, { id })
            const data = resJson.hotAlbums.map((v: any): any => {
              return {
                title: v.name ?? '',
                desc: `${moment(v.publishTime).year()} • ${v.type === 'Single' ? (v.type = '单曲') : v.type}`,
                routeName: 'album',
                picUrl: v.picUrl + '?param=200y200',
                payload: v.id
              }
            })
            return {
              data,
              title: '专辑',
              type: 'hotAlbums'
            }
          }
        }
      }
    }
  }
})

// 定义自己的 `useStore` 组合式函数
export function useStore() {
  return baseUseStore(key)
}
