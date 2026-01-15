import type { IconMetaSchema } from './tags'
import { check } from './tags'

export default {
  contributors: ['ant-design'],
  tags: check,
  category: 'other',
} as const satisfies IconMetaSchema
