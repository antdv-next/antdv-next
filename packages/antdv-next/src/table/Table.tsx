import type { SlotsType } from 'vue'
import type { TableEmits, TableProps, TableSlots } from './InternalTable.tsx'
import { EXPAND_COLUMN, Summary } from '@v-c/table'
import { omit } from 'es-toolkit'
import { defineComponent, shallowRef } from 'vue'
import Column from './Column.tsx'
import ColumnGroup from './ColumnGroup.tsx'
import {
  SELECTION_ALL,
  SELECTION_COLUMN,
  SELECTION_INVERT,
  SELECTION_NONE,
} from './hooks/useSelection.tsx'
import InternalTable from './InternalTable.tsx'

const Table = defineComponent<
  TableProps,
  TableEmits,
  string,
  SlotsType<TableSlots>
>(
  (props, { slots, attrs, expose, emit }) => {
    const renderTimesRef = shallowRef(0)
    renderTimesRef.value += 1
    const tableRef = shallowRef<any>(null)

    expose({
      scrollTo: (...args: any[]) => tableRef.value?.scrollTo?.(...args),
      get nativeElement() {
        return tableRef.value?.nativeElement
      },
    })

    return () => (
      <InternalTable
        {...omit(props, ['onUpdate:expandedRowKeys', 'onChange'])}
        {...attrs}
        onChange={(pagination: any, filters: any, sorter: any, extra: any) => {
          emit('change', pagination, filters, sorter, extra)
        }}
        onUpdate:expandedRowKeys={(keys: any) => {
          emit('update:expandedRowKeys', keys)
        }}
        _renderTimes={renderTimesRef.value}
        ref={tableRef}
        v-slots={slots}
      />
    )
  },
  {
    name: 'ATable',
    inheritAttrs: false,
  },
)

const ForwardTable = Table as typeof Table & {
  displayName?: string
  SELECTION_COLUMN: typeof SELECTION_COLUMN
  EXPAND_COLUMN: typeof EXPAND_COLUMN
  SELECTION_ALL: typeof SELECTION_ALL
  SELECTION_INVERT: typeof SELECTION_INVERT
  SELECTION_NONE: typeof SELECTION_NONE
  Column: typeof Column
  ColumnGroup: typeof ColumnGroup
  Summary: typeof Summary
}

ForwardTable.SELECTION_COLUMN = SELECTION_COLUMN
ForwardTable.EXPAND_COLUMN = EXPAND_COLUMN
ForwardTable.SELECTION_ALL = SELECTION_ALL
ForwardTable.SELECTION_INVERT = SELECTION_INVERT
ForwardTable.SELECTION_NONE = SELECTION_NONE
ForwardTable.Column = Column
ForwardTable.ColumnGroup = ColumnGroup
ForwardTable.Summary = Summary

export default ForwardTable
