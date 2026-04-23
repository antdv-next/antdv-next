import type { SlotsType } from 'vue'
import type { AnyObject } from '../_util/type.ts'
import type { TableEmits, TableExpose, TableProps, TableSlots } from './InternalTable.tsx'
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

export type TableEmitsProps<RecordType = AnyObject> = {
  [K in keyof TableEmits<RecordType> as `on${Capitalize<string & K>}`]?: TableEmits<RecordType>[K]
}

interface InternalTableProps<RecordType = AnyObject> extends TableProps<RecordType>,
  /* @vue-ignore */
  TableEmitsProps<RecordType> {}

export interface ForwardTableType {
  new<RecordType = AnyObject>(props: InternalTableProps<RecordType>): {
    $props: InternalTableProps<RecordType>
    $emit: {
      (event: 'change', ...args: Parameters<TableEmits<RecordType>['change']>): void
      (event: 'update:expandedRowKeys', ...args: Parameters<TableEmits<RecordType>['update:expandedRowKeys']>): void
      (event: 'scroll', ...args: Parameters<TableEmits<RecordType>['scroll']>): void
    }
    $slots: TableSlots<RecordType>
  } & TableExpose
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

const Table = defineComponent<
  InternalTableProps,
  TableEmits,
  string,
  SlotsType<TableSlots>
>(
  (props, { slots, attrs, expose, emit }) => {
    const renderTimesRef = shallowRef(0)
    renderTimesRef.value += 1
    const tableRef = shallowRef<TableExpose | null>(null)

    const tableExpose: TableExpose = {
      scrollTo: (...args) => tableRef.value?.scrollTo?.(...args),
      get nativeElement() {
        return tableRef.value?.nativeElement as HTMLDivElement
      },
    }

    expose(tableExpose)

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

const ForwardTable = Table as typeof Table & ForwardTableType

ForwardTable.SELECTION_COLUMN = SELECTION_COLUMN
ForwardTable.EXPAND_COLUMN = EXPAND_COLUMN
ForwardTable.SELECTION_ALL = SELECTION_ALL
ForwardTable.SELECTION_INVERT = SELECTION_INVERT
ForwardTable.SELECTION_NONE = SELECTION_NONE
ForwardTable.Column = Column
ForwardTable.ColumnGroup = ColumnGroup
ForwardTable.Summary = Summary

export default ForwardTable as unknown as ForwardTableType
