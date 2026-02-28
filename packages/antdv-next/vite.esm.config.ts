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
      ],
      output: {
        globals: {
          'vue': 'vue',
        },
      },
    },
    emptyOutDir: false,
    lib: {
      entry: 'src/index.ts',
      name: 'antd',
      fileName: () => 'antd.esm.js',
      formats: ['es'],
    },
  },
})
