/*
 * @Author: zusheng
 * @Date: 2022-04-11 15:06:54
 * @LastEditTime: 2022-04-11 17:58:23
 * @Description: 自定义指令，利用插件安装
 * @FilePath: \vite-music-player\src\common\directive.ts
 */
import { store } from '@/store'

// 指令v-columnMatch 为了监听media变化，动态设置grid布局的列数
export const columnMatchDirective = {
  install(app: any, options: any) {
    // 创建指令
    app.directive('columnMatch', {
      // 节点挂载
      mounted(el: HTMLElement) {
        // 需要监听的media
        const columnMatch = {
          '(max-width: 1200px)': 5,
          '(max-width: 1068px)': 4,
          '(max-width: 768px)': 3,
          '(max-width: 628px)': 2
        }
        const mediaChangeHandle = (e: MediaQueryListEvent) => {
          const count = e.matches ? columnMatch[e.media] : columnMatch[e.media] + 1
          store.commit('setcolumnCount', count)
        }
        Object.keys(columnMatch).forEach(media => {
          window.matchMedia(media).addEventListener('change', mediaChangeHandle)
        })
        // 初始化赋值
        const count = window.getComputedStyle(document.documentElement).getPropertyValue('--column-count')
        store.commit('setcolumnCount', count)
      }
    })
  }
}

// 指令v-lazy 节点下所有图片懒加载
export const lazyloadDirective = {
  install(app: any, options: any) {
    // 创建指令
    app.directive('lazy', {
      // 节点挂载
      mounted(imgEl: HTMLImageElement, binding: any) {
        const src = binding.arg

        if (!src) return
        // IntersectionObserver
        const intersectionObserver = new IntersectionObserver(
          entries => {
            entries.forEach((item: any) => {
              binding.value = 'hahaha'
              // 图片出现，挂上src
              if (item.intersectionRatio > 0) {
                // 停止观察
                intersectionObserver.unobserve(item.target)
                item.target.src = src
              }
            })
          },
          {
            threshold: [0]
          }
        )
        // 开始观察
        intersectionObserver.observe(imgEl)
      }
    })
  }
}
