import type { IconMetaSchema } from './tags'
import { ellipsis } from './tags'

export default {
  contributors: ['ant-design'],
  tags: [...ellipsis, 'feedback', 'discussion', 'reply', 'opinion', 'note'],
  category: 'other',
} as const satisfies IconMetaSchema
