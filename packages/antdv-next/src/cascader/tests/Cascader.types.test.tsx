/**
 * Type-level regression tests: Cascader generic support (OptionType) and
 * h() resolvability. Compile-time assertions verified by `vue-tsc`.
 */
import type { CascaderProps } from '..'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import Cascader from '..'

interface Option {
  value: string
  label: string
  children?: Option[]
  disabled?: boolean
}

type IsExact<A, B> = (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2)
  ? true
  : false

declare const typedProps: CascaderProps<Option>

export function renderTyped() {
  return h(Cascader, { ...typedProps })
}

export function renderWithTypedOptions() {
  return h(Cascader, {
    options: [] as Option[],
    displayRender: (labels: string[]) => labels.join(' / '),
  })
}

declare const CascaderCtor: typeof Cascader

export function constructTyped() {
  const _instance = new CascaderCtor({ options: [] as Option[] })
  type InferredOption = NonNullable<(typeof _instance)['$props']['options']>[number]
  const genericInferenceKept: IsExact<InferredOption, Option> = true

  // expose methods must be visible on the instance type
  const focusTyped: IsExact<(typeof _instance)['focus'], () => void> = true
  const blurTyped: IsExact<(typeof _instance)['blur'], () => void> = true

  return genericInferenceKept && focusTyped && blurTyped
}

describe('cascader types', () => {
  it('type-only assertions compile', () => {
    expect(typeof renderTyped).toBe('function')
    expect(typeof renderWithTypedOptions).toBe('function')
    expect(typeof constructTyped).toBe('function')
  })
})
