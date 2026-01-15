import type { IconMetaSchema } from './tags'
import { check } from './tags'

export default {
  contributors: ['ant-design'],
  tags: [...check],
  category: 'suggestion',
} as const satisfies IconMetaSchema
