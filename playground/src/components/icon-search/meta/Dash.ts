import type { IconMetaSchema } from './tags'
import { ellipsis } from './tags'

export default {
  contributors: ['ant-design'],
  tags: [...ellipsis],
  category: 'editor',
} as const satisfies IconMetaSchema
