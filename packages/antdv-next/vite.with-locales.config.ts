import type { UserConfig } from 'vite'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { defineConfig } from 'vite'
import { tsxResolveTypes } from 'vite-plugin-tsx-resolve-types'
import { umdGlobals } from './scripts/umd-globals'

export default defineConfig(
  () => {
    const format = process.env.WITH_LOCALES_FORMAT === 'umd' ? 'umd' : 'es'
    const isUmd = format === 'umd'

    return {
      plugins: [
        tsxResolveTypes({
          defaultPropsToUndefined: ['Boolean'],
          ignoreTypes: [/EmitsProps$/],
        }),
        vueJsx(),
      ],
      // Browser-facing bundle: replace `process.env.NODE_ENV` so the output
      // does not reference the missing `process` global in the browser (#666).
      define: {
        'process.env.NODE_ENV': JSON.stringify('production'),
      },
      build: {
        rolldownOptions: {
          external: isUmd ? ['vue', /^dayjs/] : ['vue'],
          output: {
            entryFileNames: isUmd ? 'antd-with-locales.js' : 'antd-with-locales.esm.js',
            exports: 'named',
            ...(isUmd
              ? {
                  globals: umdGlobals,
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
