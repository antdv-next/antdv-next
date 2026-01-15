import type { IconMetaSchema } from './tags'
import { financial } from './tags'

export default {
  contributors: ['ant-design'],
  tags: [...financial, 'ledger'],
  category: 'other',
} as const satisfies IconMetaSchema
