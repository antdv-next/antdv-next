import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: [
    // 'src/index.ts',
    'src/**/*.ts',
    // 'src/cssinjs-utils/index.ts',
  ],
  dts: true,
  external: [
    'vue',
  ],
  outExtensions() {
    return {
      js: '.js',
      dts: '.d.ts',
    }
  },
  format: 'esm',
  unbundle: true,
  skipNodeModulesBundle: true,
})
