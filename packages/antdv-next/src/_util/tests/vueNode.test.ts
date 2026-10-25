import { describe, expect, it } from 'vitest'
import { defineComponent, h, isVNode, nextTick } from 'vue'
import { cloneIfVNode } from '../vueNode'
import { mount } from '/@tests/utils'

const Child = {
  name: 'Child',
  setup: () => () => h('span', { class: 'child' }),
}

describe('cloneIfVNode', () => {
  it('should clone vnode and reset mount state', () => {
    const template = h(Child)
    const cloned = cloneIfVNode(template) as any

    expect(cloned).not.toBe(template)
    expect(isVNode(cloned)).toBe(true)
    expect(cloned.el).toBeFalsy()
    expect(cloned.component).toBeFalsy()
  })

  it('should isolate children array from source vnode', () => {
    const child = h('span')
    const template = h('div', null, [child]) as any
    const cloned = cloneIfVNode(template) as any

    expect(Array.isArray(cloned.children)).toBe(true)
    expect(cloned.children).not.toBe(template.children)
    // 子节点也必须 clone：否则挂载时 Vue 会直接挂载源子 vnode，把 el 写回源 vnode
    expect(cloned.children[0]).not.toBe(child)
  })

  it('should keep source children unmounted after render', async () => {
    const child = h(Child)
    const template = h('div', null, [child])
    const Comp = defineComponent({
      setup: () => () => cloneIfVNode(template),
    })

    const wrapper = mount(Comp)
    await nextTick()

    expect((template as any).children[0]).toBe(child)
    expect((child as any).el).toBeNull()
    expect((child as any).component).toBeFalsy()

    wrapper.unmount()
  })

  it('should clone each item for array input', () => {
    const a = h('span')
    const b = h('i')
    const list = [a, b]
    const cloned = cloneIfVNode(list)

    expect(cloned).not.toBe(list)
    expect(cloned[0]).not.toBe(a)
    expect(cloned[1]).not.toBe(b)
    expect(isVNode(cloned[0])).toBe(true)
    expect(isVNode(cloned[1])).toBe(true)
  })

  it('should return non-vnode values as is', () => {
    expect(cloneIfVNode('text')).toBe('text')
    expect(cloneIfVNode(0)).toBe(0)
    expect(cloneIfVNode(null)).toBeNull()
    expect(cloneIfVNode(undefined)).toBeUndefined()

    const fn = () => null
    expect(cloneIfVNode(fn)).toBe(fn)
  })
})
