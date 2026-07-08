/**
 * Type-level regression tests: TreeSelect generic support
 * (ValueType/OptionType) and h() resolvability. Compile-time assertions
 * verified by `vue-tsc`.
 */
import type { TreeSelectProps } from '..'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import TreeSelect from '..'

interface TreeNodeData {
  value: string
  title: string
  children?: TreeNodeData[]
}

type IsExact<A, B> = (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2)
  ? true
  : false

declare const typedProps: TreeSelectProps<string, TreeNodeData>

export function renderTyped() {
  return h(TreeSelect, { ...typedProps })
}

declare const TreeSelectCtor: typeof TreeSelect

export function constructTyped() {
  const _instance = new TreeSelectCtor<string, TreeNodeData>({ treeData: [] as TreeNodeData[] })

  // slot ctx must keep the node generic
  type TitleRenderNode = Parameters<NonNullable<(typeof _instance)['$slots']['treeTitleRender']>>[0]
  const titleRenderTyped: IsExact<TitleRenderNode, TreeNodeData> = true

  // expose methods must be visible on the instance type
  const focusTyped: IsExact<(typeof _instance)['focus'], () => void> = true
  const scrollToTyped: IsExact<(typeof _instance)['scrollTo'], (arg: any) => void> = true

  return titleRenderTyped && focusTyped && scrollToTyped
}

describe('treeSelect types', () => {
  it('type-only assertions compile', () => {
    expect(typeof renderTyped).toBe('function')
    expect(typeof constructTyped).toBe('function')
  })
})
