/**
 * Type-level regression tests: Transfer generic support.
 * `TransferProps<RecordType>` must stay generic (it was exported as a
 * non-generic alias before), `h(Transfer, props)` must resolve, and the
 * construct signature must infer RecordType for template/Volar usage.
 *
 * Runtime here is trivial on purpose — the real assertions are compile-time
 * and are verified by `vue-tsc`. Keep this file free of `@ts-expect-error`
 * suppressions around the `h()` calls.
 */
import type { TransferProps } from '..'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import Transfer from '..'

interface RecordType {
  key: string
  title: string
  description: string
}

type IsExact<A, B> = (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2)
  ? true
  : false

declare const typedProps: TransferProps<RecordType>

export function renderTyped() {
  return h(Transfer, { ...typedProps })
}

export function renderWithTypedCallbacks() {
  return h(Transfer, {
    dataSource: [] as RecordType[],
    render: item => item.title,
    filterOption: (inputValue, item) => item.description.includes(inputValue),
    rowKey: record => record.key,
  })
}

declare const TransferCtor: typeof Transfer

export function constructTyped() {
  const _instance = new TransferCtor({ dataSource: [] as RecordType[] })
  type InferredRecord = NonNullable<(typeof _instance)['$props']['dataSource']>[number]
  const genericInferenceKept: IsExact<InferredRecord, RecordType> = true

  // slot ctx must keep the record generic
  type RenderSlotItem = Parameters<NonNullable<(typeof _instance)['$slots']['render']>>[0]
  const renderSlotTyped: IsExact<RenderSlotItem, RecordType> = true

  return genericInferenceKept && renderSlotTyped
}

describe('transfer types', () => {
  it('type-only assertions compile', () => {
    expect(typeof renderTyped).toBe('function')
    expect(typeof renderWithTypedCallbacks).toBe('function')
    expect(typeof constructTyped).toBe('function')
  })
})
