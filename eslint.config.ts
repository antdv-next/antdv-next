import type { Linter } from 'eslint'
import antfu from '@antfu/eslint-config'

const config = antfu(
  {
    markdown: false,
    formatters: {
      css: true,
    },
    pnpm: true,
    rules: {
      'jsdoc/empty-tags': 0,
      'node/prefer-global/process': 0,
      'regexp/no-unused-capturing-group': 0,
      'no-template-curly-in-string': 0,
      'vue/no-template-shadow': 0,
      'vue/one-component-per-file': 0,
      'style/quote-props': 0,
    },
  },
  {
    ignores: [
      'packages/icons/src/icons',
      'playground/src/assets/antd.css',
    ],
  },
  {
    files: [
      'playground/**/*',
      'tests/**/*',
      'packages/**/tests/**/*',
    ],
    rules: {
      'no-console': 0,
      'no-restricted-globals': 0,
      'no-irregular-whitespace': 0,
    },
  },
) as Linter.Config

export default config
