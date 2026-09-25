import vueJsx from '@vitejs/plugin-vue-jsx'
import { defineConfig } from 'vite'
import { tsxResolveTypes } from 'vite-plugin-tsx-resolve-types'
import { umdGlobals } from './scripts/umd-globals'

export default defineConfig({
  plugins: [
    tsxResolveTypes({
      defaultPropsToUndefined: ['Boolean'],
      ignoreTypes: [/EmitsProps$/],
    }),
    vueJsx(),
  ],
  // Browser-facing bundle: replace `process.env.NODE_ENV` so the output does
  // not reference the missing `process` global in the browser (#666).
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
  build: {
    rolldownOptions: {
      external: [
        'vue',
        /^dayjs/,
      ],
      output: {
        exports: 'named',
        globals: umdGlobals,
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
