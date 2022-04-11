/*
 * @Author: zusheng
 * @Date: 2022-04-10 23:22:44
 * @LastEditTime: 2022-04-11 00:58:05
 * @Description: vuex
 * @FilePath: \vite-music-player\src\store\index.ts
 */
import { InjectionKey } from 'vue'
import { createStore, useStore as baseUseStore, Store } from 'vuex'
import moment from 'moment'
import API from '../common/api'
import { get } from '../common/apiService'

// 为 store state 声明类型
export interface State {
  count: number
}

// 定义 injection key
export const key: InjectionKey<Store<State>> = Symbol()

// 统一传参数
interface Args {
  // id
  id?: number | string
  // 获取条数
  limit: number
  // 当前页数
  pageIndex: number
}

// data中数组结构
interface DataItem {
  desc: string
  payload: string
  picUrl: string
  query: string
}

// 返回值中data
interface returns {
  // 返回数据
  data: Array<DataItem>
  // 返回数据的标题
  title: string
  // 当前函数名
  type: string
}

// 定义参数默认值
const initArgs: Args = {
  limit: 30,
  pageIndex: 0
}

const store = createStore<State>({
  strict: process.env.NODE_ENV !== 'production',
  state: {
    count: 1
  },
  getters: {},
  mutations: {},
  actions: {
    // 社区精选 歌单
    getCommunity({}, args: Args): Promise<returns> {
      return new Promise((resolve) => {
        get(API.PLAYLIST.GET_COMMUNITY, Object.assign(initArgs, args)).then((resJson) => {
          const data: Array<DataItem> = resJson.playlists.map((v: any) => {
            v.desc = 123123
            return v
          })
          resolve({
            data,
            title: '社区精选',
            type: 'community'
          })
        })
      })
    },
    // 今日推荐 歌单
    getRecommend({}, args: Args): Promise<returns> {
      const { limit = 30, pageIndex = 0 } = args
      return new Promise((resolve) => {
        get(API.PLAYLIST.GET_RECOMMENDS, Object.assign(initArgs, args)).then((resJson) => {
          const data = resJson.result.map((v: any) => {
            const days = moment.duration(v.trackNumberUpdateTime).days()
            v.desc = (days !== 0 ? `${days}天前 • ` : '刚刚 • ') + `${v.trackCount}首音乐`
            v.payload = v.id
            v.picUrl = v.picUrl + '?param=180y180'
            v.query = 'playlist'
            return v
          })
          resolve({
            data,
            title: '为你推荐',
            type: 'recommends'
          })
        })
      })
    }
  }
})

// 定义自己的 `useStore` 组合式函数
export function useStore() {
  return baseUseStore(key)
}

export default store
