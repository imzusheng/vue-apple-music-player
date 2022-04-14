/*
 * @Author: zusheng
 * @Date: 2022-04-11 09:15:16
 * @LastEditTime: 2022-04-14 16:10:36
 * @Description: 所有请求
 * @FilePath: \vite-music-player\src\store\actions.ts
 */
import API from '@/common/api'
import { countConvert, timeStampConvert, pickUpName, durationConvert } from '@/common/util'
import moment from 'moment'
import { get } from '@/common/apiService'
import { Args, RmdItem, ResRmd, SongTableRow } from '@/common/types'

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
  async getPlaylistHot({}): Promise<any> {
    const resJson = await get(API.PLAYLIST.GET_PLAYLIST_HOT, {})
    return {
      data: resJson.tags
    }
  },
  // 获取热门歌单分类
  async getPlaylistDetail({}): Promise<any> {
    const resJson = await get(API.PLAYLIST.GET_PLAYLIST_DETAIL, {})
    return resJson.playlist
  },
  // 所有榜单详情
  async getToplistDetail({}): Promise<any> {
    const resJson = await get(API.GET_TOPLIST_DETAIL, {})
    return resJson
  },
  // 获取banner图片
  async getBanner({}): Promise<any> {
    const resJson = await get(API.GET_BANNER, {})
    return resJson.banners.map((v: any) => {
      let payload: any

      if (v.targetId === 0 && v.url) {
        payload = v.url.substring(v.url.indexOf('id=') + 3)
      } else {
        payload = v.targetId
      }

      return {
        payload,
        picUrl: v.imageUrl,
        type: v.targetType,
        title: v.typeTitle
      }
    })
  }
}

/**
 * 专辑相关请求
 */
const album = {
  // 获取专辑内所有歌曲
  async getAlbumAll({}, id: string | number): Promise<any> {
    return await get(API.ALBUM.GET_ALBUM_All, { id })
  },

  // 获取专辑信息
  async getAlbumDetail({}, id: string | number): Promise<any> {
    const data = await get(API.ALBUM.GET_ALBUM_DETAIL, { id })

    console.log(data)

    return {
      // 歌曲id集合
      trackIds: data.album.trackIds.map((v: any) => v.id),
      title: data.album.name,
      desc: data.album.description,
      picUrl: data.album.coverImgUrl + '?param=800y800',
      sub: `共${data.album.trackCount}首音乐`
    }
  }
}

/**
 * 单曲
 */
const song = {
  // 获取单曲详情
  async getSongsDetail({}, ids: string): Promise<any> {
    const resJson = await get(API.SONG.GET_SONG_DETAIL, { ids })
    const data: Array<SongTableRow> = resJson.songs.map((v: any): SongTableRow => {
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
  },
  // 通过单曲获取专辑详情
  async getAlbumThroughSongs({}, ids: string): Promise<any> {
    const resJson = await get(API.SONG.GET_SONG_DETAIL, { ids })
    const song = resJson.songs[0]
    return song.al.id
  }
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
 * 歌手
 */
const artist = {
  // 获取歌手信息
  async getArtistDetail({}, id: string | number): Promise<ResRmd> {
    const resJson = await get(API.ART.GET_ARTIST_DETAIL, { id })
    const data: RmdItem = {
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
  async getArtistAlbum({}, args: any): Promise<ResRmd> {
    const resJson = await get(API.ART.GET_ARTIST_ALBUM, args)
    const data: Array<RmdItem> = resJson.hotAlbums.map((v: any): RmdItem => {
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
  async getArtistMv({}, args: any): Promise<ResRmd> {
    const resJson = await get(API.ART.GET_ARTIST_MV, args)
    const data: Array<RmdItem> = resJson.mvs.map((v: any): RmdItem => {
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
  async getArtistVideo({}, args: any): Promise<ResRmd> {
    const resJson = await get(API.ART.GET_ARTIST_VIDEO, args)
    const data: Array<RmdItem> = resJson.data.records.map((v: any): RmdItem => {
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
  async getArtistSimi({}, args: any): Promise<ResRmd> {
    const resJson = await get(API.ART.GET_ARTIST_SIMI, args)
    const data: Array<RmdItem> = resJson.artists.map((v: any): RmdItem => {
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
 * 电台
 */
const radio = {
  // 电台节目详情-单曲详情 id
  async getDjpDetail({}, args: Args): Promise<any> {
    const resJson = await get(API.DJ.GET_DJP_DETAIL, Object.assign(initArgs, args))
    // 单曲详情没啥用，需要节目ID然后再获取整个节目列表
    return {
      title: resJson.program.radio.name,
      desc: resJson.program.radio.desc,
      picUrl: resJson.program.radio.picUrl + '?param=800y800',
      sub: resJson.program.radio.category,
      radioId: resJson.program.radio.id
    }
  },
  // 电台节目详情-单曲详情 id
  async getDjDetail({}, args: Args): Promise<any> {
    const resJson = await get(API.DJ.GET_DJ_DETAIL, Object.assign(initArgs, args))
    // 单曲详情没啥用，需要节目ID然后再获取整个节目列表

    return {
      title: resJson.data.name,
      desc: resJson.data.desc,
      picUrl: resJson.data.picUrl + '?param=800y800',
      sub: resJson.data.category,
      radioId: resJson.data.id
    }
  },
  // 电台节目详情-节目详情 rid
  async getDjpListDetail({}, args: Args): Promise<any> {
    const resJson = await get(API.DJ.GET_DJP, Object.assign(initArgs, args))
    const data: Array<SongTableRow> = resJson.programs.map((row: any): SongTableRow => {
      return {
        artist: row.dj.nickname,
        title: row.mainSong.name,
        album: row.radio?.name || row.mainSong.album.name,
        picUrl: row.coverUrl + '?param=50y50',
        duration: durationConvert(row.duration / 1000),
        fee: row.fee
      }
    })

    return {
      data,
      more: resJson.more
    }
  }
}

/**
 * 首页推荐请求
 */
const recommend = {
  // 社区精选 歌单
  async getcommunitys({}, args: Args): Promise<ResRmd> {
    const resJson = await get(API.PLAYLIST.GET_COMMUNITY, Object.assign(initArgs, args))
    const data: Array<RmdItem> = resJson.playlists.map((v: any): RmdItem => {
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
  async getrecommends({}, args: Args): Promise<ResRmd> {
    const resJson = await get(API.PLAYLIST.GET_RECOMMENDS, Object.assign(initArgs, args))
    const data: Array<RmdItem> = resJson.result.map((v: any): RmdItem => {
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
  async getmvs({}, args: Args): Promise<ResRmd> {
    const resJson = await get(API.MV.GET_NEW_MV, Object.assign(initArgs, args))
    const data: Array<RmdItem> = resJson.data.map((v: any): RmdItem => {
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
  async getHotArtists({}, args: Args): Promise<ResRmd> {
    const resJson = await get(API.ART.GET_HOT_ARTISTS, Object.assign(initArgs, args))
    const data: Array<RmdItem> = resJson.artists.map((v: any): RmdItem => {
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
  // 热门电台节目
  async getHotDjp({}, args: Args): Promise<ResRmd> {
    const resJson = await get(API.DJ.GET_HOT_DJP, Object.assign(initArgs, args))

    const data: Array<RmdItem> = resJson.result.map((v: any): RmdItem => {
      return {
        title: v.name,
        picUrl: v.picUrl + '?param=180y180',
        desc: v.copywriter,
        payload: v.id,
        routeName: 'djp'
      }
    })
    return {
      data,
      type: 'HotDjp'
    }
  },
  // 推荐电台节目
  async getRecommendsDjp({}, args: Args): Promise<ResRmd> {
    const resJson = await get(API.DJ.GET_RECOMMENDS_DJP, Object.assign(initArgs, args))

    const data: Array<RmdItem> = resJson.programs.map((v: any): RmdItem => {
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
  // 个性推荐电台
  async getRecommendsDj({}, args: Args): Promise<ResRmd> {
    const resJson = await get(API.DJ.GET_RECOMMENDS_DJ, Object.assign(initArgs, args))

    const data: Array<RmdItem> = resJson.data.map((v: any): RmdItem => {
      return {
        title: v.name,
        picUrl: v.picUrl + '?param=180y180',
        desc: v.desc,
        payload: v.id,
        routeName: 'dj'
      }
    })
    return {
      data,
      type: 'RecommendsDj'
    }
  },
  // 最新专辑
  async getNewAlbum({}, args: Args): Promise<ResRmd> {
    const resJson = await get(API.ALBUM.GET_NEW_ALBUM, Object.assign(initArgs, args))

    const data: Array<RmdItem> = resJson.albums.map((v: any): RmdItem => {
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
  async getPlaylistHq({}, args: Args): Promise<ResRmd> {
    const resJson = await get(API.PLAYLIST.GET_PLAYLIST_HQ, Object.assign(initArgs, args))

    const data: Array<RmdItem> = resJson.playlists.map((v: any): RmdItem => {
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
  async getRecommendsPrivate({}, args: Args): Promise<ResRmd> {
    const resJson = await get(API.DJ.GET_RECOMMENDS_PRIVATE, Object.assign(initArgs, args))

    const data: Array<RmdItem> = resJson.result.map((v: any): RmdItem => {
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
  ...radio,
  ...album,
  ...artist,
  ...playlist,
  ...recommend
}
