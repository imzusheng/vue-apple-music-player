/*
 * @Author: zusheng
 * @Date: 2022-04-17 10:38:22
 * @LastEditTime: 2022-04-17 10:40:17
 * @Description: symbol
 * @FilePath: \vite-music-player\src\common\symbol.ts
 */

import { InjectionKey } from 'vue'
import { PlayerAudioProps } from '@/common/types'

export const audioPlayerPropsKey: InjectionKey<Readonly<PlayerAudioProps>> = Symbol()
