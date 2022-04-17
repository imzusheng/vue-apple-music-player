/*
 * @Author: zusheng
 * @Date: 2022-04-11 22:59:54
 * @LastEditTime: 2022-04-17 10:37:26
 * @Description: typescript的复用的类型、接口定义
 * @FilePath: \vite-music-player\src\common\types.ts
 */

// data中数组结构
interface RmdItem {
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

// recommend请求中的返回值
interface ResRmd {
  // 返回数据
  data: Array<RmdItem> | RmdItem | any
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

// 表格中每首歌曲所需信息
interface SongTableRow {
  // id
  payload: string | number

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

  [prop: string]: any
}

interface PlayerAudioProps {
  // 音乐url
  url: string

  // 歌名
  title: string

  // 专辑
  album: string

  // 作者
  artist: string

  // 发布时间
  publishTime: any
}

export type { ResRmd, RmdItem, Args, SongTableRow, PlayerAudioProps }

export enum Toplist {
  '飙升榜' = 19723756,
  '新歌榜' = 3779629,
  '原创榜' = 2884035,
  '热歌榜' = 3778678,
  '黑胶VIP爱听榜' = 5453912201,
  '云音乐说唱榜' = 991319590,
  '云音乐古典榜' = 71384707,
  '云音乐电音榜' = 1978921795,
  '云音乐ACG榜' = 71385702,
  '云音乐韩语榜' = 745956260,
  '云音乐国电榜' = 10520166,
  'UK排行榜周榜' = 180106,
  '美国Billboard榜' = 60198,
  'Beatport全球电子舞曲榜' = 3812895,
  'KTV唛榜' = 21845217,
  '日本Oricon榜' = 60131,
  '云音乐欧美热歌榜' = 2809513713,
  '云音乐欧美新歌榜' = 2809577409,
  '法国 NRJ Vos Hits 周榜' = 27135204,
  '云音乐ACG动画榜' = 3001835560,
  '云音乐ACG游戏榜' = 3001795926,
  '云音乐ACG VOCALOID榜' = 3001890046,
  '中国新乡村音乐排行榜' = 3112516681,
  '云音乐日语榜' = 5059644681,
  '云音乐摇滚榜' = 5059633707,
  '云音乐古风榜' = 5059642708,
  '潜力爆款榜' = 5338990334,
  '云音乐民谣榜' = 5059661515,
  '听歌识曲榜' = 6688069460,
  '网络热歌榜' = 6723173524,
  '俄语榜' = 6732051320,
  '越南语榜' = 6732014811,
  '中文DJ榜' = 6886768100,
  '俄罗斯top hit流行音乐榜' = 6939992364,
  '泰语榜' = 7095271308,
  'BEAT排行榜' = 7356827205
}
