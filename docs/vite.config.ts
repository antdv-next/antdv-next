import * as path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createOxfmtJsFormatter, mdPlugin, postcssIsolateStyles } from '@antdv-next/docs-plugins'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import Unocss from 'unocss/vite'
import { defineConfig } from 'vite'
import dayjsPlugin from 'vite-plugin-dayjs'
import inspect from 'vite-plugin-inspect'
import { tsxResolveTypes } from 'vite-plugin-tsx-resolve-types'

import virtualAntdCss from './plugins/css-plugin'

const baseUrl = fileURLToPath(new URL('.', import.meta.url))
const docsBuildTarget = [
  'chrome111',
  'edge111',
  'firefox114',
  'safari16.4',
  'ios16.4',
] as const

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    virtualAntdCss({
      development: false,
    }),
    dayjsPlugin(),
    mdPlugin({
      demo: {
        // antfu 风格(无分号、单引号),与 TS 源码页签观感一致
        jsFormatter: createOxfmtJsFormatter({ semi: false, singleQuote: true }),
      },
    }),
    tsxResolveTypes({
      defaultPropsToUndefined: ['Boolean'],
    }),
    vueJsx(),
    vue({
      include: [/\.vue$/, /\.md$/],
    }),
    inspect(),
    Unocss(),
    // prefetch(),
  ],
  server: {
    port: 3322,
  },
  optimizeDeps: {
    // include: ['@antdv-next/icons'],
    exclude: [
      '@antdv-next/img-crop',
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
      '@antdv-next/img-crop > @antdv-next/vue-easy-crop',
      '@ant-design/icons-svg/es/asn/*',
    ],
  },
  resolve: {
    dedupe: [
      'vue',
      'vue-router',
      '@vueuse/core',
      'antdv-style',
      '@antdv-next/icons',
      'sandpack-vue3',
      '@codesandbox/sandpack-themes',
      '@vue/compiler-sfc',
      'sucrase',
    ],
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
    // Lock the docs site target to Vite's current baseline so future browser
    // version bumps do not leak unsupported targets like `chrome142` into the build.
    target: [...docsBuildTarget],
    cssTarget: [...docsBuildTarget],
    sourcemap: false,
  },
})
