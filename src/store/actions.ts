/*
 * @Author: zusheng
 * @Date: 2022-04-11 09:15:16
 * @LastEditTime: 2022-04-13 09:36:37
 * @Description: 所有请求
 * @FilePath: \vite-music-player\src\store\actions.ts
 */
import API from '@/common/api'
import { countConvert, timeStampConvert, pickUpName, durationConvert } from '@/common/util'
import moment from 'moment'
import { get } from '@/common/apiService'
import { Args, DataItem, Returns, TableListSongsTypes } from '@/common/types'

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
 * 专辑相关请求
 */
const album = {
  // 获取专辑内所有歌曲
  async getAlbumAll({}, id: string | number): Promise<any> {
    return await get(API.ALBUM.GET_ALBUM_All, { id })
  }
}

/**
 * 单曲
 */
const song = {
  // 获取单曲详情
  async getSongsDetail({}, ids: string): Promise<any> {
    const resJson = await get(API.SONG.GET_SONG_DETAIL, { ids })
    const data: Array<TableListSongsTypes> = resJson.songs.map((v: any): TableListSongsTypes => {
      return {
        // 作者名
        artist: pickUpName(v.ar),

        // 歌曲封面
        picUrl: v.al.picUrl + '?param=50y50',

        // 歌曲名
        title: v.name,

        // 来自专辑
        album: v.al.name,

        // 发布时间 年
        publishTime: moment(v.publishTime).year().toString(),

        // 歌曲时长，单位分钟
        duration: durationConvert(v.dt / 1000),

        // 是否需要会员
        fee: v.fee.toString()
      }
    })
    return data
  }
  // 获取单曲详情
  // getSongDetail({ state }, ids) {
  //   return new Promise(resolve => {
  //     fetchToJson(`${API.SONG.GET_SONG_DETAIL}?ids=${ids}`).then(resJson => {
  //       const songs = resJson.songs.map(v => {
  //         v.duration = v.dt
  //         v.album = v.al.name
  //         v.picUrl = v.al.picUrl + '?param=180y180'
  //         return v
  //       })
  //       resolve(songs)
  //     })
  //   })
  // }
}

/**
 * 歌单
 */
const playlist = {
  // 获取歌单详情
  async getPlaylistDetail({}, id: string | number): Promise<any> {
    const data = await get(API.PLAYLIST.GET_PLAYLIST_DETAIL, { id })

    return {
      // 歌曲id集合
      trackIds: data.playlist.trackIds.map((v: any) => v.id),
      title: data.playlist.name,
      desc: data.playlist.description,
      picUrl: data.playlist.coverImgUrl + '?param=800y800',
      sub: `共${data.playlist.trackCount}首音乐`
    }
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
      picUrl: resJson.data.artist.cover + '?param=800y800',
      payload: resJson.data.artist.id,
      desc: resJson.data.artist.briefDesc
    }
    return {
      data: data,
      type: 'ArtistDetail'
    }
  },
  // 获取歌手粉丝
  async getArtistFans({}, id: string | number): Promise<any> {
    const resJson = await get(API.ART.GET_ARTIST_FANS, { id })
    return {
      data: {
        count: countConvert(resJson.data.fansCnt)
      },
      type: 'ArtistFans'
    }
  },
  // 获取歌手专辑
  async getArtistAlbum({}, args: any): Promise<Returns> {
    const resJson = await get(API.ART.GET_ARTIST_ALBUM, args)
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
      type: 'ArtistAlbum'
    }
  },
  // 获取歌手MV
  async getArtistMv({}, args: any): Promise<Returns> {
    const resJson = await get(API.ART.GET_ARTIST_MV, args)
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
      type: 'ArtistMv'
    }
  },
  // 获取歌手视频
  async getArtistVideo({}, args: any): Promise<Returns> {
    const resJson = await get(API.ART.GET_ARTIST_VIDEO, args)
    const data: Array<DataItem> = resJson.data.records.map((v: any): DataItem => {
      return {
        title: v.resource.mlogBaseData.text,
        desc: countConvert(v.resource.mlogExtVO.playCount) + '次观看',
        routeName: 'video',
        picUrl: (v.picUrl ? v.imgurl : v.resource.mlogBaseData.coverUrl) + '?param=200y200',
        payload: v.id
      }
    })
    return {
      data,
      type: 'ArtistVideo'
    }
  },
  // 获取相似歌手
  async getArtistSimi({}, args: any): Promise<Returns> {
    const resJson = await get(API.ART.GET_ARTIST_SIMI, args)
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
      type: 'ArtistSimi'
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
  },
  // 推荐热门歌手
  async getHotArtists({}, args: Args): Promise<Returns> {
    const resJson = await get(API.ART.GET_HOT_ARTISTS, Object.assign(initArgs, args))
    const data: Array<DataItem> = resJson.artists.map((v: any): DataItem => {
      return {
        title: v.name,
        picUrl: v.img1v1Url + '?param=180y180',
        desc: '艺人',
        payload: v.id,
        routeName: 'artist'
      }
    })
    return {
      data,
      type: 'HotArtists'
    }
  },
  // 推荐DJ
  async getRecommendsDj({}, args: Args): Promise<Returns> {
    const resJson = await get(API.DJ.GET_RECOMMENDS_DJ, Object.assign(initArgs, args))

    const data: Array<DataItem> = resJson.result.map((v: any): DataItem => {
      return {
        title: v.name,
        picUrl: v.picUrl + '?param=180y180',
        desc: v.copywriter,
        payload: v.id,
        routeName: 'dj'
      }
    })
    return {
      data,
      type: 'RecommendsDj'
    }
  },
  // 推荐DJ
  async getRecommendsDjp({}, args: Args): Promise<Returns> {
    const resJson = await get(API.DJ.GET_RECOMMENDS_DJP, Object.assign(initArgs, args))

    const data: Array<DataItem> = resJson.programs.map((v: any): DataItem => {
      return {
        title: v.name,
        picUrl: v.coverUrl + '?param=180y180',
        desc: v.description,
        payload: v.id,
        routeName: 'djp'
      }
    })
    return {
      data,
      type: 'RecommendsDjp'
    }
  },
  // 最新专辑
  async getNewAlbum({}, args: Args): Promise<Returns> {
    const resJson = await get(API.ALBUM.GET_NEW_ALBUM, Object.assign(initArgs, args))

    const data: Array<DataItem> = resJson.albums.map((v: any): DataItem => {
      return {
        title: v.name,
        picUrl: v.picUrl + '?param=180y180',
        desc: pickUpName(v.artists) + ' • ' + (v.size === 1 ? '单曲' : v.size + '首音乐'),
        payload: v.id,
        routeName: 'album'
      }
    })
    return {
      data,
      type: 'NewAlbum'
    }
  },
  // 精品歌单
  async getPlaylistHq({}, args: Args): Promise<Returns> {
    const resJson = await get(API.PLAYLIST.GET_PLAYLIST_HQ, Object.assign(initArgs, args))

    const data: Array<DataItem> = resJson.playlists.map((v: any): DataItem => {
      return {
        title: v.name,
        picUrl: v.coverImgUrl + '?param=180y180',
        desc: v.tags.join('/'),
        payload: v.id,
        routeName: 'playlist'
      }
    })
    return {
      data,
      type: 'PlaylistHq'
    }
  },
  // 独家精选
  async getRecommendsPrivate({}, args: Args): Promise<Returns> {
    const resJson = await get(API.DJ.GET_RECOMMENDS_PRIVATE, Object.assign(initArgs, args))

    const data: Array<DataItem> = resJson.result.map((v: any): DataItem => {
      return {
        title: v.name,
        picUrl: v.sPicUrl + '?param=320y180',
        desc: moment(v.time).format('YYYY-MM-DD').toString(),
        payload: v.id,
        routeName: 'private'
      }
    })
    return {
      data,
      type: 'RecommendsPrivate'
    }
  }
}

export default {
  ...notArgs,
  ...song,
  ...album,
  ...artist,
  ...playlist,
  ...recommend
}
