import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    projects: [
      './packages/antdv-next',
      './packages/cssinjs',
    ],
    coverage: {
      provider: 'v8',
      include: [
        'packages/antdv-next/src/**/*.{ts,tsx}',
        'packages/cssinjs/src/**/*.{ts,tsx}',
        'packages/pro/src/**/*.{ts,tsx}',
      ],
      exclude: [
        'packages/**/locale/*.{ts,tsx}',
        'packages/antdv-next/src/index.with-locales.ts',
      ],
    },
  },
})
