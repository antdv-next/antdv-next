import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: [
    // 'src/index.ts',
    'src/**/*.ts',
    // 'src/cssinjs-utils/index.ts',
  ],
  dts: true,
  deps: {
    neverBundle: true,
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
