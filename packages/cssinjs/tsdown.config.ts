import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: [
    // 'src/index.ts',
    'src/**/*.ts',
    // 'src/cssinjs-utils/index.ts',
  ],
  dts: true,
  deps: {
    skipNodeModulesBundle: true,
    neverBundle: [
      'vue',
    ],
  },
  outExtensions() {
    return {
      js: '.js',
      dts: '.d.ts',
    }
  },
  format: 'esm',
  unbundle: true,
})
