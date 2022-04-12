/*
 * @Author: zusheng
 * @Date: 2022-04-11 22:59:54
 * @LastEditTime: 2022-04-12 08:12:14
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
  data: Array<DataItem>
  // 当前函数名
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

export type { Returns, DataItem, Args }
