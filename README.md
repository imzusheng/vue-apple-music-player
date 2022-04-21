# 前言

继上次写的 PC 网页播放器项目后又模仿 Apple Music 写了一个适配移动端的播放器,用的是 Vue3 + Typescript + Vite

为了实现一个播放器展开的动效花了不少功夫, 这个效果还算满意

[体验一下 demo(建议手机)](https://demo.zusheng.club/music)

![图片](http://cdn.zusheng.club/screenshots/blog/vite-music.gif)

项目中有一些值得琢磨的点记录一下：

- 用 Observer API 配合 Vue 自定义指令实现全局图片懒加载

- Vue3 中使用 mapActions 和 mapMutations 语法糖

- Canvas 提取图片主题色

- Canvas 压缩图片分辨率

- mouse 和 touch 冲突

# 用 Observer API 配合 Vue 自定义指令实现全局图片懒加载

1. 指令 directive.ts

```typescript
export const lazyloadDirective = {
  install(app: any, options: any) {
    // v-lazy指令
    app.directive('lazy', {
      // 生命周期挂载
      mounted(imgEl: HTMLImageElement, binding: any) {
        // 指令传值
        const src = binding.value

        if (!src) return

        // Intersection Observer
        const intersectionObserver = new IntersectionObserver(
          function (entries: any) {
            entries.forEach((item: any) => {
              // intersectionRatio>0 图片出现
              if (item.intersectionRatio > 0) {
                // 给img挂上src
                item.target.src = src
                // 停止观察
                intersectionObserver.unobserve(item.target)
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
```

2. main.ts

```typescript
import { createApp } from 'vue'
import { lazyloadDirective } from '@/common/directive'
import App from '@/App.vue'

createApp(App).use(lazyloadDirective).mount('#app')
```

3. 使用

先用 empty_white.png 作占位图，减少原图加载出来时页面布局的计算

```vue
<template>
  <img v-lazy="picUrl" src="@/assets/empty_white.png" alt="" />
</template>
```

# Vue3 中使用 mapActions 和 mapMutations 语法糖

`createNamespacedHelpers` 提供的辅助函数内部依旧是使用 `this.$store.xxx` 的方式去获取对应的 `store` 值，所以如果是在 `script setup`中使用的时候，需要自己手动将 `this` 绑定为类似于之前的 `{$store: store}` 对象

1. unit.ts

```typescript
import { store, mapActions, mapMutations, createNamespacedHelpers } from 'vuex'

/**
 * @param namespaced 命名空间
 * @param actions
 */
export const mapActionsHelpers = (namespaced: string | null, actions: Array<string>): any => {
  if (actions.length === 0) return {}

  // 是否使用命名空间
  // mapMutations 只需要把下面的 mapActions 替换成 mapMutations
  const namespacedMapActions = namespaced ? createNamespacedHelpers(namespaced).mapActions : mapActions

  // 获取了所有actions
  const fnList = namespacedMapActions(actions)

  const $store = {
    $store: store
  }

  // 手动绑定this到$store
  Object.keys(fnList).forEach(fnKey => {
    fnList[fnKey] = fnList[fnKey].bind($store)
  })

  return fnList
}
```

2. 使用

```typescript
import { mapActionsHelpers } from '@/util'

// 使用默认命名空间
const { getSongUrl } = mapActionsHelpers(null, ['getSongUrl'])

getSongUrl().then(res => {
  // ...
})
```

# Canvas 提取图片主题色

主要利用 `ImageData.data` 属性

> 只读的 ImageData.data 属性，返回 Uint8ClampedArray ，描述一个一维数组，包含以 RGBA 顺序的数据，数据使用 0 至 255（包含）的整数表示。 MDN

```typescript
// 提取这张图片的主题色
const imgSrc = 'https://p1.music.126.net/5Vo9wOwVfhkP42Fb_0cDQQ==/109951166945083815.jpg'
const image = new Image()

// 跨域
image.setAttribute('crossOrigin', '')
image.src = imgSrc
img.onload = () => {
  ctx.drawImage(img, 0, 0, 200, 200)
  const data = ctx.getImageData(0, 0, 200, 200).data
  const color = getRgba(data)
  // ...
  // color就是出现最多的rgba组合
}

function getRgba(data: any) {
  // 保存不同rgb组合出现次数
  const race = {}

  // 循环次数
  const len = data.length

  // 出现最多次数
  let max = 0

  // 出现最多rgb颜色
  let color = ''

  let i = 0
  while (i < len) {
    if (data[i + 3] !== 0) {
      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]
      const c = 20
      const c2 = 230

      // k格式为 255, 255, 255, 1
      const k = `${data[i]}, ${data[i + 1]}, ${data[i + 2]}, ${data[i + 3] / 255}`

      // 统计该颜色出现的次数
      race[k] = race[k] ? race[k] + 1 : 1

      // 出现更大值
      if (race[k] > max) {
        // 替换出现的最大次数
        max = race[k]
        // 当前出现次数最多的颜色
        color = k
      }
    }
    i += 4
  }
  return color
}
```

# canvas 压缩图片分辨率

```typescript
export const compressionImage = imgSrc => {
  const image = new Image()

  // 跨域
  image.setAttribute('crossOrigin', 'Anonymous')
  image.src = imgSrc

  return new Promise(resolve => {
    image.onload = function () {
      // 图片原始宽高
      const imgWidth = image.width
      const imgHeight = image.height

      // 创建画布
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')

      // 图像压缩比例
      const ratio = 0.7

      // 压缩后宽高
      const compressionWidth = imgWidth * ratio
      const compressionHeight = imgHeight * ratio

      // 画布宽高
      canvas.width = compressionWidth
      canvas.height = compressionHeight

      // 裁剪图片
      context.drawImage(image, 0, 0, imgWidth, imgHeight, 0, 0, compressionWidth, compressionHeight)

      resolve(canvas.toDataURL('image/jpg'))
    }
  })
}
```

# mouse 和 touch 冲突

emmmmm...这个找到了一个非常简单的方法，用`if ('ontouchstart' in window)` 判断是否是移动端，移动端监听`touchmove`，PC 端监听`mousemove`

[我的博客](https://blog.zusheng.club)

