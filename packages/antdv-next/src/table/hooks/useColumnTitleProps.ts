import type { ComputedRef, Ref } from 'vue'
import type { AnyObject } from '../../_util/type.ts'
import type { ColumnTitleProps, FilterValue } from '../interface.ts'
import { computed } from 'vue'
import isNonNullable from '../../_util/isNonNullable.ts'

function getMergedFilters(filters: Record<string, FilterValue | null>) {
  const mergedFilters: Record<string, FilterValue> = {}
  for (const [key, value] of Object.entries(filters)) {
    if (isNonNullable(value)) {
      mergedFilters[key] = value
    }
  }
  return mergedFilters
}

export default function useColumnTitleProps<RecordType extends AnyObject = AnyObject>(
  sorterTitleProps: Ref<ColumnTitleProps<RecordType>>,
  filters: Ref<Record<string, FilterValue | null>>,
): ComputedRef<ColumnTitleProps<RecordType>> {
  return computed(() => ({
    ...sorterTitleProps.value,
    filters: getMergedFilters(filters.value),
  }))
}
