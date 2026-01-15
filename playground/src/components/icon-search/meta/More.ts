import type { IconMetaSchema } from './tags'
import { ellipsis } from './tags'

export default {
  contributors: ['ant-design'],
  tags: [...ellipsis, 'vertical'],
  category: 'other',
} as const satisfies IconMetaSchema
