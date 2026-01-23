import { defineConfig } from 'tsdown'

export default defineConfig({
  dts: true,
  format: 'es',
  entry: [
    'src/index.ts',
  ],
})
