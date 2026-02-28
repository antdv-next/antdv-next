import vueJsx from '@vitejs/plugin-vue-jsx'
import { defineConfig } from 'vite'
import { tsxResolveTypes } from 'vite-plugin-tsx-resolve-types'

export default defineConfig({
  plugins: [
    tsxResolveTypes({
      defaultPropsToUndefined: ['Boolean'],
    }),
    vueJsx(),
  ],
  build: {
    rolldownOptions: {
      external: [
        'vue',
        /^dayjs/,
      ],
      output: {
        exports: 'named',
        globals: {
          'vue': 'Vue',
          'dayjs': 'dayjs',
          'dayjs/plugin/advancedFormat': 'dayjs_plugin_advancedFormat',
          'dayjs/plugin/customParseFormat': 'dayjs_plugin_customParseFormat',
          'dayjs/plugin/localeData': 'dayjs_plugin_localeData',
          'dayjs/plugin/weekday': 'dayjs_plugin_weekday',
          'dayjs/plugin/weekOfYear': 'dayjs_plugin_weekOfYear',
          'dayjs/plugin/weekYear': 'dayjs_plugin_weekYear',
        },
      },
    },
    emptyOutDir: false,
    lib: {
      entry: 'src/index.ts',
      name: 'antd',
      fileName: () => 'antd.js',
      formats: ['umd'],
    },
  },
})
