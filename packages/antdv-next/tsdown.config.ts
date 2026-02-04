import { defineConfig } from 'tsdown'

export default defineConfig({
  fromVite: true,
  entry: [
    'src/**/*.ts',
    'src/**/*.tsx',
    '!src/**/tests/*',
    '!src/**/*.test.ts',
    '!src/**/*.test.tsx',
  ],
  unbundle: true,
  format: 'es',
  inlineOnly: false,
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
