import { describe, expect, it } from 'vitest'
import { defineComponent, h } from 'vue'
import Link from '../Link'
import Paragraph from '../Paragraph'
import Text from '../Text'
import Title from '../Title'
import { mount } from '/@tests/utils'

const SCOPE_ID = 'data-v-scoped'

// Simulates a parent SFC with `<style scoped>`: Vue stamps `__scopeId` on the
// vnodes it renders and passes it down to a child's root element only while
// every component in between renders a single root vnode.
function mountInScopedParent(render: () => any) {
  const Parent = defineComponent({
    __scopeId: SCOPE_ID,
    render,
  } as any)
  return mount(Parent)
}

// https://github.com/antdv-next/antdv-next/issues/1168
describe('typography scoped css id', () => {
  it.each([
    ['Text', Text, 'span'],
    ['Paragraph', Paragraph, 'div'],
    ['Title', Title, 'h1'],
    ['Link', Link, 'a'],
  ] as const)('%s root receives the parent scope id', (_, Comp, tag) => {
    const wrapper = mountInScopedParent(() => h(Comp as any, { class: 'outlined' }, () => 'content'))
    const root = wrapper.find(`${tag}.ant-typography`)
    expect(root.exists()).toBe(true)
    expect(root.classes()).toContain('outlined')
    expect(root.attributes(SCOPE_ID)).toBeDefined()
  })

  it('root receives the parent scope id with ellipsis', () => {
    const wrapper = mountInScopedParent(() => h(Text as any, { class: 'outlined', ellipsis: true }, () => 'content'))
    const root = wrapper.find('span.ant-typography')
    expect(root.exists()).toBe(true)
    expect(root.attributes(SCOPE_ID)).toBeDefined()
  })

  it('root receives the parent scope id with multi-line ellipsis', () => {
    const wrapper = mountInScopedParent(() => h(Paragraph as any, { ellipsis: { rows: 2 } }, () => 'content'))
    const root = wrapper.find('div.ant-typography')
    expect(root.exists()).toBe(true)
    expect(root.attributes(SCOPE_ID)).toBeDefined()
  })
})
