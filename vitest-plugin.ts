import path from 'node:path'
import { fileURLToPath } from 'node:url'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { defineConfig } from 'vite'
import { tsxResolveTypes } from 'vite-plugin-tsx-resolve-types'

const baseUrl = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  plugins: [
    tsxResolveTypes({
      defaultPropsToUndefined: ['Boolean'],
    }),
    vue(),
    vueJsx({
    }),
    {
      name: 'vue-docs-block',
      transform(_code, id) {
        if (id.includes('?vue&type=docs')) {
          return { code: 'export default {}', map: null }
        }
      },
    },
  ],
  optimizeDeps: {
    include: ['@antdv-next/icons', '@antdv-next/icons > @ant-design/icons-svg'],
  },
  resolve: {
    alias: [
      {
        find: /^antdv-next/,
        replacement: path.resolve(baseUrl, './packages/antdv-next/src'),
      },
      {
        find: /^@antdv-next\/cssinjs/,
        replacement: path.resolve(baseUrl, './packages/cssinjs/src'),
      },
      {
        find: /^\/@tests/,
        replacement: path.resolve(baseUrl, './tests'),
      },
      {
        find: '@',
        replacement: path.resolve(baseUrl, './docs/src'),
      },
    ],
  },
  test: {
    env: {
      // Pin the timezone so date-dependent assertions and snapshots do not
      // depend on where the suite happens to run. Several tests build dates
      // from a UTC instant (e.g. `dayjs('2025-06-15T00:00:00Z')`) and assert
      // the rendered day, which shifts by one in any UTC- zone; committed
      // snapshots were recorded at UTC+8.
      TZ: 'Asia/Shanghai',
    },
  },
})
