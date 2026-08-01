/**
 * Type-level regression tests for #634: `h(Table, props)` must resolve against
 * Vue's `Constructor<P>` overload of `h` instead of falling through to the
 * instance-typed catch-all overload.
 *
 * Runtime here is trivial on purpose — the real assertions are compile-time
 * and are verified by `vue-tsc` (editors / manual typecheck). Keep this file
 * free of `@ts-expect-error` suppressions around the `h()` calls.
 */
import type { ColumnsType, ColumnType, TableProps } from '..'
import { describe, expect, it } from 'vitest'
import { h, ref, shallowRef } from 'vue'
import Table from '..'

interface DataType {
  key: number
  name: string
}

// ============ issue #673: dataIndex accessible on the columns union ============
// `TableProps['columns']` is `(ColumnGroupType | ColumnType)[]`. A group carries
// `dataIndex?: never` (rather than omitting it), so `.dataIndex` stays directly
// accessible when mapping the union — no narrowing required.
export function mapColumnsDataIndex() {
  const columns: TableProps['columns'] = [
    { title: 'ID', dataIndex: 'id' },
    { title: 'Name', dataIndex: 'name' },
  ]
  return columns.map(column => ({ dataIndex: column.dataIndex }))
}

// A mixed array (with a group) still exposes `.dataIndex`; the group reads back
// as `undefined`. Narrow to the group with `'children' in column`.
export function mapMixedColumns() {
  const columns: ColumnsType<DataType> = [
    { title: 'Group', children: [{ title: 'Name', dataIndex: 'name' }] },
    { title: 'Key', dataIndex: 'key' },
  ]
  return columns.map((column) => {
    if ('children' in column) {
      const children: ColumnsType<DataType> = column.children
      return children.length
    }
    const _dataIndex: ColumnType<DataType>['dataIndex'] = column.dataIndex
    return _dataIndex
  })
}

// ============ issue #634: wrapper forwarding props via h() ============
const rootRef = shallowRef<InstanceType<typeof Table>>()
const scrollY = ref(0)

declare const forwardedProps: TableProps
declare const forwardedAttrs: Record<string, unknown>

export function renderForwarded() {
  const { scroll, ...restProps } = forwardedProps
  return h(Table, {
    ...restProps,
    ...forwardedAttrs,
    ref: rootRef,
    scroll: { ...scroll, y: scrollY.value },
    style: { height: '100%' },
    styles: {
      section: { height: '100px' },
    },
    classes: {
      header: { wrapper: 'measure-header' },
      pagination: { root: 'measure-pagination' },
    },
  })
}

// ============ h() with record-typed props (contravariant callbacks) ============
declare const typedProps: TableProps<DataType>

export function renderTyped() {
  return h(Table, { ...typedProps })
}

// ============ generic construct signature must keep driving inference ============
type IsExact<A, B> = (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2)
  ? true
  : false

declare const dataSource: DataType[]
declare const TableCtor: typeof Table
export type TypedInstance = InstanceType<typeof TableCtor>

export function constructTyped() {
  const _instance = new TableCtor({ dataSource })
  type InferredRecord = NonNullable<(typeof _instance)['$props']['dataSource']>[number]
  const genericInferenceKept: IsExact<InferredRecord, DataType> = true

  // slot ctx must keep the record generic — this is what Volar reads for
  // `#bodyCell="{ record }"` in templates
  type BodyCellCtx = Parameters<NonNullable<(typeof _instance)['$slots']['bodyCell']>>[0]
  const bodyCellRecordTyped: IsExact<BodyCellCtx['record'], DataType> = true
  type ExpandedRowCtx = Parameters<NonNullable<(typeof _instance)['$slots']['expandedRowRender']>>[0]
  const expandedRowRecordTyped: IsExact<ExpandedRowCtx['record'], DataType> = true

  return genericInferenceKept && bodyCellRecordTyped && expandedRowRecordTyped
}

describe('table types (#634)', () => {
  it('type-only assertions compile', () => {
    expect(typeof renderForwarded).toBe('function')
    expect(typeof renderTyped).toBe('function')
    expect(typeof constructTyped).toBe('function')
  })
})
