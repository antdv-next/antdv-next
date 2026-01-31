/**
 * 自定义配置示例
 */

import type { Config } from 'tailwindcss'
import { createAntdPlugin } from '@antdv-next/tailwind'

export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  plugins: [
    createAntdPlugin({
      antPrefix: 'ant', // 自定义 CSS 变量前缀
    }),
  ],
  theme: {
    extend: {
      // 你可以继续扩展其他 Tailwind 主题配置
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
    },
  },
} satisfies Config
