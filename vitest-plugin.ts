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
      defaultPropsToUndefined: true,
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
        find: /^@antdv-next\/icons/,
        replacement: path.resolve(baseUrl, './packages/icons/src'),
      },
      {
        find: /^\/@tests/,
        replacement: path.resolve(baseUrl, './tests'),
      },
    ],
  },
})
