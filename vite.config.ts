/*
 * @Author: zusheng
 * @Date: 2022-04-10 20:15:36
 * @LastEditTime: 2022-04-17 09:16:54
 * @Description:
 * @FilePath: \vite-music-player\vite.config.ts
 */
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
const path = require('path')

// https://vitejs.dev/config/
export default defineConfig({
  base: '/music/',
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  server: {
    port: 4000,
    // 设为 true 时若端口已被占用则会直接退出，而不是尝试下一个可用端口。
    strictPort: false,
    cors: true
  }
})

