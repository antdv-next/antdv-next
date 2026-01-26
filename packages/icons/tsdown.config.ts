import { defineConfig } from 'tsdown'

export default defineConfig({
  fromVite: true,
  dts: true,
  format: 'es',
  entry: [
    'src/index.ts',
    'src/icons/index.tsx',
  ],
  external: [
    'vue',
  ],
  unbundle: true,
  skipNodeModulesBundle: true,
})
