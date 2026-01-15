import type { IconMetaSchema } from './tags'
import { financial } from './tags'

export default {
  contributors: ['ant-design'],
  tags: [...financial],
  category: 'logo',
} as const satisfies IconMetaSchema
