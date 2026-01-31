import { defineConfig } from 'tsdown'

export default defineConfig({
  dts: true,
  format: 'es',
  entry: [
    'src/index.ts',
    'src/v4.ts',
  ],
  external: [
    'tailwindcss',
    'tailwindcss/plugin',
  ],
  skipNodeModulesBundle: true,
})
