/*
 * @Author: zusheng
 * @Date: 2022-04-10 23:39:46
 * @LastEditTime: 2022-04-17 09:58:52
 * @Description:
 * @FilePath: \vite-music-player\src\common\util.ts
 */
import moment from 'moment'
import { mapActions, mapMutations, createNamespacedHelpers } from 'vuex'
import { store } from '@/store'

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
 * 提取歌手名字
 * @param artists
 * @param Separator
 */
export const pickUpName = (artists: Array<any>, Separator = '/'): string => {
  // 判断是否是数组
  if (Object.prototype.toString.call(artists) === '[object Array]') {
    return artists.map(n => n.name || n.userName || n).join(Separator)
  } else {
    return ''
  }
}

export const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise(resolve => {
    const fileReader: any = new FileReader()
    fileReader.onload = (e: any) => {
      resolve(e.target.result)
    }
    fileReader.readAsDataURL(blob)
  })
}

/**
 * 使mapActions语法糖可用
 *
 * 注意: createNamespacedHelpers提供的辅助函数内部依旧是使用this.$store.xxx的方式去获取对应的store值
 * 所以如果是在script setup中使用的时候，需要自己手动将this绑定为类似于之前的{$store: store}这类对象
 * 以便于createNamespacedHelpers提供的辅助函数内部可以获取正确的state值
 * @param namespaced 命名空间
 * @param actions
 */
export const mapActionsHelpers = (namespaced: string | null, actions: Array<string>): any => {
  if (actions.length === 0) return {}

  const namespacedMapActions = namespaced ? createNamespacedHelpers(namespaced).mapActions : mapActions

  const fnList = namespacedMapActions(actions)

  Object.keys(fnList).forEach(fnKey => {
    fnList[fnKey] = fnList[fnKey].bind({
      $store: store
    })
  })
  return fnList
}

export const mapMutationsHelpers = (namespaced: string | null, mutations: Array<string>): any => {
  if (mutations.length === 0) return {}

  const namespacedMapMutations = namespaced ? createNamespacedHelpers(namespaced).mapMutations : mapMutations

  const fnList = namespacedMapMutations(mutations)

  Object.keys(fnList).forEach(fnKey => {
    fnList[fnKey] = fnList[fnKey].bind({
      $store: store
    })
  })
  return fnList
}

/**
 * 获取 [min,max]的随机数
 * Math.floor(Math.random()*10) 可均衡获取 0 到 9 的随机整数
 * @param min
 * @param max
 */
export const getRandomIndex = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1) + min) ?? 0
}

/**
 * 防抖
 * @param func
 * @param delay
 */
export const throttle = (func: Function, delay: number) => {
  let last: any, timer: any

  return function () {
    const now = Date.now()

    if (last && now - last < delay) {
      clearTimeout(timer)
      timer = setTimeout(function () {
        last = now
        func()
      }, delay)
    } else {
      last = now
      func()
    }
  }
}

/**
 * 提取图片占比最大的颜色
 * @param imgSrc
 */
export const getMainColor = (imgSrc: string): Promise<string> => {
  function getRgba(data: any) {
    const race = {}
    const len = data.length

    let max = 0
    let color = ''
    let i = 0
    while (i < len) {
      if (data[i + 3] !== 0) {
        const r = data[i]
        const g = data[i + 1]
        const b = data[i + 2]
        const c = 20
        const c2 = 230
        if (!(r < c && g < c && b < c) && !(r > c2 && g > c2 && b > c2)) {
          // k格式为 255, 255, 255, 1
          const k = `${data[i]}, ${data[i + 1]}, ${data[i + 2]}, ${data[i + 3] / 255}`
          // 利用temp对象统计该颜色出现的次数
          race[k] = race[k] ? race[k] + 1 : 1
          if (race[k] > max) {
            // 替换出现的最大次数
            max = race[k]
            // 当前出现次数最多的颜色
            color = k
          }
        }
      }
      i += 4
    }
    return color
  }

  return new Promise(resolve => {
    const canvas = document.createElement('canvas')
    const ctx: any = canvas.getContext('2d')
    const img = new Image()
    // 跨域
    img.setAttribute('crossOrigin', '')
    img.src = imgSrc
    img.onload = () => {
      ctx.drawImage(img, 0, 0, 200, 200)
      const data = ctx.getImageData(0, 0, 200, 200).data
      const color = getRgba(data)
      const rgb = color.split(',')
      let r = parseInt(rgb[0])
      let g = parseInt(rgb[1])
      let b = parseInt(rgb[2])
      // 为了让颜色更匹配网站主题
      if (r > 200 || g > 200 || b > 200) {
        r -= 40
        g -= 40
        b -= 40
      } else if (r > 150 || g > 150 || b > 150) {
        r -= 20
        g -= 20
        b -= 20
      } else if (r < 30 || g < 30 || b < 30) {
        r += 20
        g += 20
        b += 20
      }
      resolve(`${r}, ${g}, ${b}, 1`)
    }
  })
}
