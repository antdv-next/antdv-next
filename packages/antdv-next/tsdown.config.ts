import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { defineConfig } from 'tsdown'
import { tsxResolveTypes } from 'vite-plugin-tsx-resolve-types'

export default defineConfig({
  plugins: [
    tsxResolveTypes({
      defaultPropsToUndefined: ['Boolean'],
    }),
    vueJsx(),
    vue({
      include: [/\.vue$/, /\.md$/],
    }),
  ],
  entry: [
    'src/**/*.ts',
    'src/**/*.tsx',
    '!src/**/tests/*',
    '!src/**/*.test.ts',
    '!src/**/*.test.tsx',
    '!src/index.with-locales.ts',
  ],
  unbundle: true,
  format: 'es',
  inlineOnly: false,
  outExtensions() {
    return {
      js: '.js',
      dts: '.d.ts',
    }
  },
  // minify: true,
  clean: true,
  skipNodeModulesBundle: true,
  copy: [
    { from: 'src/style/reset.css', to: 'dist' },
  ],
  external: [
    'vue',
    '@antdv-next/icons',
    '@antdv-next/cssinjs/cssinjs-utils',
    '@antdv-next/cssinjs',
    'csstype',
    '@v-c/util',
  ],
})
