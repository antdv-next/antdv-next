import type { ComputedRef } from 'vue'
import type { ColumnGroupType, ColumnsType, ColumnType } from '../interface'
import { EXPAND_COLUMN } from '@v-c/table'
import { computed } from 'vue'
import { SELECTION_COLUMN } from './useSelection'

function isSpecialColumn(col: any): boolean {
  return col === SELECTION_COLUMN || col === EXPAND_COLUMN
}

/**
 * Merge a per-column default (typically from ConfigProvider) into every
 * non-special column in the tree. Mirrors ant-design 6.4.0 useFilledColumns.
 *
 * Component-level column props take precedence over the default; defaults only
 * fill in missing keys.
 */
export default function useFilledColumns<RecordType = any>(
  columns: ComputedRef<ColumnsType<RecordType>>,
  column: ComputedRef<Partial<ColumnType<RecordType>> | undefined>,
): ComputedRef<ColumnsType<RecordType>> {
  return computed(() => {
    const defaults = column.value
    if (!defaults) {
      return columns.value
    }

    const { children: _ignoredChildren, ...defaultsWithoutChildren } = defaults as Partial<ColumnGroupType<RecordType>>

    const fill = (list: ColumnsType<RecordType>): ColumnsType<RecordType> =>
      list.map((col) => {
        if (isSpecialColumn(col)) {
          return col
        }
        if ('children' in col && Array.isArray((col as ColumnGroupType<RecordType>).children)) {
          const group = col as ColumnGroupType<RecordType>
          return {
            ...defaults,
            ...group,
            children: fill(group.children),
          } as ColumnGroupType<RecordType>
        }
        return {
          ...defaultsWithoutChildren,
          ...(col as ColumnType<RecordType>),
        } as ColumnType<RecordType>
      })

    return fill(columns.value)
  })
}
