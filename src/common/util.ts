/*
 * @Author: zusheng
 * @Date: 2022-04-10 23:39:46
 * @LastEditTime: 2022-04-12 00:05:05
 * @Description:
 * @FilePath: \vite-music-player\src\common\util.ts
 */
import moment from 'moment'
import { mapActions, createNamespacedHelpers } from 'vuex'
import { useStore } from '@/store'

/**
 * 转换时间戳为xx天前
 * @param timeStamp 时间戳
 * @returns 描述
 */
export const timeStampConvert = (timeStamp: number | string): string => {
  return `${moment.duration(timeStamp).days()}天前` ?? '刚刚'
}

/**
 * 时间转换为格式 04:31
 * @param time timeStamp时间戳
 * @returns
 */
export const durationConvert = (time: number | string) => {
  const _moment = moment.duration(time, 'second')
  return `${_moment.minutes() < 10 ? `0${_moment.minutes()}` : _moment.minutes()}:${_moment.seconds() < 10 ? `0${_moment.seconds()}` : _moment.seconds()}`
}

/**
 * 时间转换为格式 4分钟
 * @param time timeStamp时间戳
 * @returns
 */
export const durationConvertMinutes = (time: number | string) => {
  const _moment = moment.duration(time, 'second')
  return `${_moment.minutes()}分钟`
}

/**
 * 转换播放数量单位为：万
 * @param count 数量
 * @returns 转换后
 */
export const countConvert = (count: number): string => {
  const sum = typeof count === 'string' ? Number(count) : count
  return sum > 10000 ? `${(sum / 10000).toFixed(1)}万` : sum.toString()
}

/**
 * 注意: createNamespacedHelpers提供的辅助函数内部依旧是使用this.$store.xxx的方式去获取对应的store值
 * 所以如果是在script setup中使用的时候，需要自己手动将this绑定为类似于之前的{$store: store}这类对象
 * 以便于createNamespacedHelpers提供的辅助函数内部可以获取正确的state值
 * @param namespaced
 * @param actions
 */
export const mapActionsHelpers = (namespaced: string | null, actions: Array<string>): any => {
  let namespacedMapActions = namespaced ? createNamespacedHelpers(namespaced).mapActions : mapActions

  const store = useStore()

  const fnList = namespacedMapActions(actions)

  Object.keys(fnList).forEach(fnKey => {
    fnList[fnKey] = fnList[fnKey].bind({
      $store: store
    })
  })
  return fnList
}
