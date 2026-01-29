import * as path from 'node:path'
import { fileURLToPath } from 'node:url'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import Unocss from 'unocss/vite'
import { defineConfig } from 'vite'
import dayjsPlugin from 'vite-plugin-dayjs'
import inspect from 'vite-plugin-inspect'
import { tsxResolveTypes } from 'vite-plugin-tsx-resolve-types'

import virtualAntdCss from './plugins/css-plugin'
import { mdPlugin } from './plugins/markdown'
import { postcssIsolateStyles } from './plugins/markdown/isolateStyles.ts'
import prefetch from './plugins/prefetch'

const baseUrl = fileURLToPath(new URL('.', import.meta.url))
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    virtualAntdCss({
      development: false,
    }),
    dayjsPlugin(),
    mdPlugin(),
    tsxResolveTypes({
      defaultPropsToUndefined: true,
    }),
    vueJsx(),
    vue({
      include: [/\.vue$/, /\.md$/],
    }),
    inspect(),
    Unocss(),
    prefetch(),
  ],
  server: {
    port: 3322,
  },
  optimizeDeps: {
    // include: ['@antdv-next/icons'],
    exclude: [
      '@v-c/segmented',
      '@v-c/trigger',
      '@v-c/tooltip',
      '@v-c/util',
      '@v-c/menu',
      '@v-c/tour',
      '@v-c/input',
      '@v-c/input-number',
      '@v-c/textarea',
      '@v-c/select',
      '@v-c/picker',
      '@v-c/drawer',
      '@v-c/dialog',
    ],
    include: [
      '@antdv-next/icons',
      '@antdv-next/icons/all',
      '@ant-design/icons-svg/es/asn/*',
    ],
  },
  resolve: {
    alias: [
      {
        find: /^antdv-next/,
        replacement: path.resolve(baseUrl, '../packages/antdv-next/src'),
      },
      {
        find: /^@antdv-next\/cssinjs/,
        replacement: path.resolve(baseUrl, '../packages/cssinjs/src'),
      },
      // {
      //   find: /^@antdv-next\/icons/,
      //   replacement: path.resolve(baseUrl, '../packages/icons/src'),
      // },
      {
        find: '@',
        replacement: '/src',
      },
    ],
  },
  css: {
    postcss: {
      plugins: [
        postcssIsolateStyles(),
      ],
    },
  },
  build: {
    sourcemap: false,
  },
})
