import type { IconMetaSchema } from './tags'
import { ellipsis } from './tags'

export default {
  contributors: ['ant-design'],
  tags: [...ellipsis],
  category: 'other',
} as const satisfies IconMetaSchema
