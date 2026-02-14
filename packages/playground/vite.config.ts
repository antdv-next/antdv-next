import { resolve } from 'node:path'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { defineConfig } from 'vite'

export default defineConfig({
  resolve: {
    alias: {
      'antdv-next': resolve(__dirname, '../antdv-next/src/index.ts'),
      '@antdv-next/cssinjs/cssinjs-utils': resolve(__dirname, '../cssinjs/src/cssinjs-utils/index.ts'),
      '@antdv-next/cssinjs': resolve(__dirname, '../cssinjs/src/index.ts'),
    },
  },
  plugins: [
    vue(),
    vueJsx(),
  ],
})
