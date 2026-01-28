import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { defineConfig } from 'vite'
import { tsxResolveTypes } from 'vite-plugin-tsx-resolve-types'

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
})
