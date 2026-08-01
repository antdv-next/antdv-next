/**
 * Type-level regression tests: Segmented value generic (mirrors upstream
 * antd `<Segmented<ValueType>>`) and h() resolvability. Compile-time
 * assertions verified by `vue-tsc`.
 */
import type { SegmentedProps } from '..'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import Segmented from '..'

type Mode = 'horizontal' | 'vertical' | 'inline'

type IsExact<A, B> = (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2)
  ? true
  : false

declare const typedProps: SegmentedProps<Mode>

export function renderTyped() {
  return h(Segmented, { ...typedProps })
}

export function renderWithLiteralValue() {
  return h(Segmented, {
    options: ['horizontal', 'vertical', 'inline'] as const,
    value: 'horizontal' as Mode,
    onChange: (value: Mode) => value,
  })
}

declare const SegmentedCtor: typeof Segmented

export function constructTyped() {
  const _instance = new SegmentedCtor<Mode>({ options: ['horizontal', 'vertical', 'inline'] })

  // v-model / change payload must keep the literal union, not widen to string | number
  type ChangeArg = (typeof _instance)['$props']['onChange'] extends ((value: infer V) => void) | undefined
    ? V
    : never
  const changePayloadTyped: IsExact<ChangeArg, Mode> = true

  type ValueProp = (typeof _instance)['$props']['value']
  const valueTyped: IsExact<ValueProp, Mode | undefined> = true

  return changePayloadTyped && valueTyped
}

describe('segmented types', () => {
  it('type-only assertions compile', () => {
    expect(typeof renderTyped).toBe('function')
    expect(typeof renderWithLiteralValue).toBe('function')
    expect(typeof constructTyped).toBe('function')
  })
})
