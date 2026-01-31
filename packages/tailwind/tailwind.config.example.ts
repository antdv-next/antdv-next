/**
 * Tailwind CSS 配置示例
 * 展示如何使用 @antdv-next/tailwind 插件
 */

import type { Config } from 'tailwindcss'
import antdPlugin from '@antdv-next/tailwind'

export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  plugins: [antdPlugin],
} satisfies Config
