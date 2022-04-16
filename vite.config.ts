/*
 * @Author: zusheng
 * @Date: 2022-04-10 20:15:36
 * @LastEditTime: 2022-04-16 21:44:28
 * @Description:
 * @FilePath: \vite-music-player\vite.config.ts
 */
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
const path = require('path')

// https://vitejs.dev/config/
export default defineConfig({
  base: '/music',
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  }
})

