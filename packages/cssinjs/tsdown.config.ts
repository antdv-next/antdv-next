import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/cssinjs-utils/index.ts',
  ],
  dts: true,
  external: [
    'vue',
  ],
  format: 'esm',
  unbundle: true,
  skipNodeModulesBundle: true,
})
