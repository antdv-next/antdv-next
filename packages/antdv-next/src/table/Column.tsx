import type { SlotsType } from 'vue'
import type { AnyObject, EmptyEmit } from '../_util/type.ts'
import type { ColumnType } from './interface.ts'
import { defineComponent } from 'vue'

export interface ColumnProps<RecordType = AnyObject> extends ColumnType<RecordType> {
  children?: null
}

export interface ColumnSlots {
  default?: () => any
}

/**
 * Syntactic sugar for the `columns` prop.
 *
 * Kebab-case template attributes (`data-index`, `min-width`, ...) are
 * remapped to the camelCase field names the table understands in
 * `convertColumnsToColumnProps` (see `./utils.ts`).
 */
const Column = defineComponent<ColumnProps, EmptyEmit, string, SlotsType<ColumnSlots>>(
  () => {
    return () => null
  },
  {
    name: 'ATableColumn',
    inheritAttrs: false,
  },
)

export default Column
