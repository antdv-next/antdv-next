import antfu from '@antfu/eslint-config'

export default antfu({
  formatters: {
    css: true,
  },
  rules: {
    'jsdoc/empty-tags': 0,
    'node/prefer-global/process': 0,
    'regexp/no-unused-capturing-group': 0,
    'no-template-curly-in-string': 0,
  },
}, {
  ignores: [
    'packages/icons/src/icons',
  ],
}, {
  files: [
    'playground/**/*',
    'tests/**/*',
    'packages/**/tests/**/*',
  ],
  rules: {
    'no-console': 0,
    'no-restricted-globals': 0,
  },
})
