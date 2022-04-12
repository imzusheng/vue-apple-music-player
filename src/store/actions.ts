/*
 * @Author: zusheng
 * @Date: 2022-04-11 09:15:16
 * @LastEditTime: 2022-04-12 12:08:06
 * @Description: 所有请求
 * @FilePath: \vite-music-player\src\store\actions.ts
 */
import API from '@/common/api'
import { countConvert, timeStampConvert, durationConvertMinutes } from '@/common/util'
import moment from 'moment'
import { get } from '@/common/apiService'
import { Args, DataItem, Returns } from '@/common/types'

// 定义参数默认值
const initArgs: Args = {
  limit: 7,
  pageIndex: 0
}

/**
 * 无需参数的请求，也没有固定返回格式
 */
const notArgs = {
  // 获取热门歌单分类
  async getPlaylistHot({}): Promise<Returns> {
    const resJson = await get(API.PLAYLIST.GET_PLAYLIST_HOT, {})
    return {
      data: resJson.tags,
      type: 'playlistHot'
    }
  },
  // 获取热门歌单分类
  async getPlaylistDetail({}): Promise<any> {
    const resJson = await get(API.PLAYLIST.GET_PLAYLIST_DETAIL, {})
    return resJson.playlist
  }
}

/**
 * 歌手相关请求
 */
const artist = {
  // 获取歌手信息
  async getArtistDetail({}, id: string | number): Promise<Returns> {
    const resJson = await get(API.ART.GET_ARTIST_DETAIL, { id })
    const data: DataItem = {
      routeName: 'artist',
      title: resJson.data.artist.name,
      picUrl: resJson.data.artist.cover + '?param=1600y900',
      payload: resJson.data.artist.id,
      desc: resJson.data.artist.briefDesc
    }
    return {
      data: data,
      type: 'artistDetail'
    }
  },
  // 获取歌手粉丝
  async getArtistFans({}, id: string | number): Promise<any> {
    const resJson = await get(API.ART.GET_ARTIST_FANS, { id })
    return {
      data: {
        count: countConvert(resJson.data.fansCnt)
      },
      type: 'artistFans'
    }
  },
  // 获取歌手专辑
  async getArtistAlbum({}, id: string | number): Promise<Returns> {
    const resJson = await get(API.ART.GET_ARTIST_ALBUM, { id })
    const data: Array<DataItem> = resJson.hotAlbums.map((v: any): DataItem => {
      return {
        title: v.name,
        desc: `${moment(v.publishTime).year()} • ${v.type === 'Single' ? (v.type = '单曲') : v.type}`,
        routeName: 'album',
        picUrl: v.picUrl + '?param=200y200',
        payload: v.id
      }
    })
    return {
      data,
      type: 'albums'
    }
  },
  // 获取歌手MV
  async getArtistMV({}, id: string | number): Promise<Returns> {
    const resJson = await get(API.ART.GET_ARTIST_MV, { id })
    const data: Array<DataItem> = resJson.mvs.map((v: any): DataItem => {
      return {
        title: v.name,
        desc: `${countConvert(v.playCount)}次观看`,
        routeName: 'mv',
        picUrl: v.imgurl + '?param=200y200',
        payload: v.id
      }
    })
    return {
      data,
      type: 'mvs'
    }
  },
  // 获取歌手视频
  async getArtistVideo({}, id: string | number): Promise<Returns> {
    const resJson = await get(API.ART.GET_ARTIST_VIDEO, { id })
    const data: Array<DataItem> = resJson.data.records.map((v: any): DataItem => {
      return {
        title: v.resource.mlogBaseData.text,
        desc: countConvert(v.resource.mlogExtVO.playCount) + '万次观看',
        routeName: 'video',
        picUrl: v.resource.mlogBaseData.coverUrl + '?param=200y200',
        payload: v.id
      }
    })
    return {
      data,
      type: 'videos'
    }
  },
  // 获取相似歌手
  async getArtistSimi({}, id: string | number): Promise<Returns> {
    const resJson = await get(API.ART.GET_ARTIST_SIMI, { id })
    const data: Array<DataItem> = resJson.artists.map((v: any): DataItem => {
      return {
        title: v.name,
        desc: '艺人',
        routeName: 'artist',
        picUrl: v.img1v1Url + '?param=180y180',
        payload: v.id
      }
    })
    return {
      data,
      type: 'simi'
    }
  }
}

/**
 * 首页推荐请求
 */
const recommend = {
  // 社区精选 歌单
  async getcommunitys({}, args: Args): Promise<Returns> {
    const resJson = await get(API.PLAYLIST.GET_COMMUNITY, Object.assign(initArgs, args))
    const data: Array<DataItem> = resJson.playlists.map((v: any): DataItem => {
      return {
        title: v.name,
        desc: `${timeStampConvert(v.trackUpdateTime)} • ${v.trackCount}首音乐`,
        payload: v.id,
        picUrl: v.coverImgUrl + '?param=180y180',
        routeName: 'playlist'
      }
    })
    return {
      data,
      type: 'communitys'
    }
  },
  // 今日推荐 歌单
  async getrecommends({}, args: Args): Promise<Returns> {
    const resJson = await get(API.PLAYLIST.GET_RECOMMENDS, Object.assign(initArgs, args))
    const data: Array<DataItem> = resJson.result.map((v: any): DataItem => {
      return {
        title: v.name,
        desc: `${timeStampConvert(v.trackNumberUpdateTime)} • ${v.trackCount}首音乐`,
        payload: v.id,
        picUrl: v.picUrl + '?param=180y180',
        routeName: 'playlist'
      }
    })
    return {
      data,
      type: 'recommends'
    }
  },
  // 推荐MV
  async getmvs({}, args: Args): Promise<Returns> {
    const resJson = await get(API.MV.GET_NEW_MV, Object.assign(initArgs, args))
    const data: Array<DataItem> = resJson.data.map((v: any): DataItem => {
      return {
        title: v.name,
        picUrl: v.cover + '?param=180y180',
        desc: `${v.artistName} • ${countConvert(v.playCount)}次播放`,
        payload: v.id,
        routeName: 'mv'
      }
    })
    return {
      data,
      type: 'mvs'
    }
  }
}

export default {
  ...notArgs,
  ...artist,
  ...recommend
}
