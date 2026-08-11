import { defineProject, mergeConfig } from 'vitest/config'
import vitestPlugin from '../../vitest-plugin.ts'

export default mergeConfig(vitestPlugin, defineProject({
  test: {
    include: ['**/tests/*.spec.ts', '**/tests/*.test.ts'],
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
  },
}))
