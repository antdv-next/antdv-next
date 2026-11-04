import type { TreeSelectProps } from '..'
import { describe, expect, it } from 'vitest'
import { defineComponent, nextTick, ref } from 'vue'
import TreeSelect from '..'
import ConfigProvider from '../../config-provider'
import { mount } from '/@tests/utils'

type AllowClear = TreeSelectProps['allowClear']

const treeData = [{ value: 'value', title: 'Value' }]

function mountDemo(render: () => any) {
  return mount(defineComponent(() => () => render()), { attachTo: document.body })
}

// https://github.com/ant-design/ant-design/pull/59592
describe('treeSelect allowClear with ConfigProvider', () => {
  const getClearButton = (wrapper: ReturnType<typeof mount>) => wrapper.find('.ant-select-clear')

  it('lets component props override a globally disabled clear button', async () => {
    const allowClear = ref<AllowClear>()
    const wrapper = mountDemo(() => (
      <ConfigProvider treeSelect={{ allowClear: false }}>
        <TreeSelect defaultValue="value" treeData={treeData} allowClear={allowClear.value} />
      </ConfigProvider>
    ))
    expect(getClearButton(wrapper).exists()).toBe(false)

    allowClear.value = true
    await nextTick()
    expect(getClearButton(wrapper).attributes('aria-label')).toBe('Clear')

    allowClear.value = false
    await nextTick()
    expect(getClearButton(wrapper).exists()).toBe(false)
    wrapper.unmount()
  })

  it('inherits parent configuration and responds to nested provider updates', async () => {
    const innerAllowClear = ref<AllowClear>()
    const wrapper = mountDemo(() => (
      <ConfigProvider treeSelect={{ allowClear: { tabIndex: -1, label: 'Outer clear' } }}>
        <ConfigProvider
          treeSelect={innerAllowClear.value === undefined ? undefined : { allowClear: innerAllowClear.value }}
        >
          <TreeSelect defaultValue="value" treeData={treeData} />
        </ConfigProvider>
      </ConfigProvider>
    ))
    expect(getClearButton(wrapper).attributes('aria-label')).toBe('Outer clear')
    expect(getClearButton(wrapper).attributes('tabindex')).toBe('-1')

    innerAllowClear.value = { label: 'Inner clear', tabIndex: 0 }
    await nextTick()
    expect(getClearButton(wrapper).attributes('aria-label')).toBe('Inner clear')
    expect(getClearButton(wrapper).attributes('tabindex')).toBe('0')

    innerAllowClear.value = false
    await nextTick()
    expect(getClearButton(wrapper).exists()).toBe(false)

    innerAllowClear.value = undefined
    await nextTick()
    expect(getClearButton(wrapper).attributes('aria-label')).toBe('Outer clear')
    expect(getClearButton(wrapper).attributes('tabindex')).toBe('-1')
    wrapper.unmount()
  })
})
