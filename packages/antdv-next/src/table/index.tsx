import type { DataIndex, Reference } from '@v-c/table'
import type { App } from 'vue'
import { EXPAND_COLUMN, Summary, SummaryCell, SummaryRow } from '@v-c/table'
import Column from './Column.tsx'
import ColumnGroup from './ColumnGroup.tsx'
import {
  SELECTION_ALL,
  SELECTION_COLUMN,
  SELECTION_INVERT,
  SELECTION_NONE,
} from './hooks/useSelection.tsx'
import Table from './Table.tsx'

export type { TableTouchScrollConfig } from './hooks/useTouchScroll.ts'
export type { ColumnsType, ColumnType, ExpandType, FilterValue, SorterResult, SortOrder, TableLocale, TablePaginationConfig, TableRowSelection } from './interface.ts'
export type { TableClassNamesType, TableEmits, TableProps, TableSlots, TableStylesType } from './InternalTable.tsx'
export type { DataIndex, Reference }

const InternalTable = Table as typeof Table & {
  install: (app: App) => void
  Column: typeof Column
  ColumnGroup: typeof ColumnGroup
  Summary: typeof Summary
  SummaryRow: typeof SummaryRow
  SummaryCell: typeof SummaryCell
  SELECTION_COLUMN: typeof SELECTION_COLUMN
  EXPAND_COLUMN: typeof EXPAND_COLUMN
  SELECTION_ALL: typeof SELECTION_ALL
  SELECTION_INVERT: typeof SELECTION_INVERT
  SELECTION_NONE: typeof SELECTION_NONE
}

InternalTable.Column = Column
InternalTable.ColumnGroup = ColumnGroup
InternalTable.Summary = Summary
InternalTable.SummaryRow = SummaryRow
InternalTable.SummaryCell = SummaryCell
InternalTable.SELECTION_COLUMN = SELECTION_COLUMN
InternalTable.EXPAND_COLUMN = EXPAND_COLUMN
InternalTable.SELECTION_ALL = SELECTION_ALL
InternalTable.SELECTION_INVERT = SELECTION_INVERT
InternalTable.SELECTION_NONE = SELECTION_NONE

InternalTable.install = (app: App) => {
  app.component(Table.name, Table)
  app.component(Column.name, Column)
  app.component(ColumnGroup.name, ColumnGroup)
  app.component('ATableSummary', Summary)
  app.component('ATableSummaryRow', SummaryRow)
  app.component('ATableSummaryCell', SummaryCell)
  return app
}

export {
  Column,
  ColumnGroup,
  EXPAND_COLUMN,
  SELECTION_ALL,
  SELECTION_COLUMN,
  SELECTION_INVERT,
  SELECTION_NONE,
  Summary,
  SummaryCell,
  SummaryRow,
}

export default InternalTable
