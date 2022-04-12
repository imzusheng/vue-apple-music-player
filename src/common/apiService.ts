/*
 * @Author: zusheng
 * @Date: 2022-04-10 23:43:21
 * @LastEditTime: 2022-04-12 11:44:52
 * @Description: API服务
 * @FilePath: \vite-music-player\src\common\apiService.ts
 */
import axios from 'axios'

axios.defaults.baseURL = process.env.NODE_ENV === 'development' ? 'https://music.zusheng.club' : 'https://music.zusheng.club'
axios.defaults.headers['X-Requested-With'] = 'XMLHttpRequest'
axios.defaults.headers.post['Content-Type'] = 'application/json'

// 请求拦截
axios.interceptors.request.use(config => {
  // config.headers.Authorization = localStorage.getItem('token')
  return config
})

// 响应拦截器
axios.interceptors.response.use(
  async function (response) {
    if (response.data.code !== 200) {
      return Promise.reject(response.data)
    } else {
      return response
    }
  },
  error => {
    return Promise.reject(error)
  }
)

export const get = (url: string, params: any): Promise<any> => {
  return new Promise(resolve => {
    axios
      .get(url, {
        params
      })
      .then(({ data }) => {
        resolve(data)
      })
      .catch(err => {
        resolve(null)
        console.error('get-error', err)
      })
  })
}
