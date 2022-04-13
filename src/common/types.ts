/*
 * @Author: zusheng
 * @Date: 2022-04-11 22:59:54
 * @LastEditTime: 2022-04-12 21:50:16
 * @Description: typescript的复用的类型、接口定义
 * @FilePath: \vite-music-player\src\common\types.ts
 */

// data中数组结构
interface DataItem {
  // 描述/副标题
  desc: string
  // 点击跳转需要传递的id值
  payload: string
  // 图片url
  picUrl: string
  // 点击跳转的路由参数
  routeName: string
  // 小标题
  title: string
}

// 返回值中data
interface Returns {
  // 返回数据
  data: Array<DataItem> | DataItem
  // 当前返回类型|函数名
  type: string
}

// 统一传参数
interface Args {
  // id
  id?: number | string
  // 获取条数
  limit?: number
  // 当前页数
  pageIndex?: number
}

// 歌单表格组件
interface TableListSongsTypes {
  // 作者名
  artist: string

  // 歌曲封面
  picUrl: string

  // 歌曲名
  title: string

  // 来自专辑
  album: string

  // 发布时间 年
  publishTime?: string

  // 歌曲时长，单位分钟
  duration: string

  // 是否需要会员
  fee: string
}

export type { Returns, DataItem, Args, TableListSongsTypes }
