/**
 * Type-level regression tests for #634: `h(Table, props)` must resolve against
 * Vue's `Constructor<P>` overload of `h` instead of falling through to the
 * instance-typed catch-all overload.
 *
 * Runtime here is trivial on purpose — the real assertions are compile-time
 * and are verified by `vue-tsc` (editors / manual typecheck). Keep this file
 * free of `@ts-expect-error` suppressions around the `h()` calls.
 */
import type { TableProps } from '..'
import { describe, expect, it } from 'vitest'
import { h, ref, shallowRef } from 'vue'
import Table from '..'

interface DataType {
  key: number
  name: string
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
