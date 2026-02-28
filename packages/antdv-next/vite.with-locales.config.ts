import type { UserConfig } from 'vite'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { defineConfig } from 'vite'
import { tsxResolveTypes } from 'vite-plugin-tsx-resolve-types'

export default defineConfig(
  () => {
    const format = process.env.WITH_LOCALES_FORMAT === 'umd' ? 'umd' : 'es'
    const isUmd = format === 'umd'

    return {
      plugins: [
        tsxResolveTypes({
          defaultPropsToUndefined: ['Boolean'],
        }),
        vueJsx(),
      ],
      build: {
        rolldownOptions: {
          external: isUmd ? ['vue', /^dayjs/] : ['vue'],
          output: {
            entryFileNames: isUmd ? 'antd-with-locales.js' : 'antd-with-locales.esm.js',
            exports: 'named',
            ...(isUmd
              ? {
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
                }
              : {}),
          },
        },
        emptyOutDir: false,
        lib: {
          entry: 'src/index.with-locales.ts',
          formats: [format],
          ...(isUmd ? { name: 'antd' } : {}),
          fileName: () => (isUmd ? 'antd-with-locales.js' : 'antd-with-locales.esm.js'),
        },
      },
    } as UserConfig
  },
)
