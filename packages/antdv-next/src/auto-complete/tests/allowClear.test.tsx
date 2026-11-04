import type { AutoCompleteProps } from '..'
import { describe, expect, it } from 'vitest'
import { defineComponent, nextTick, ref } from 'vue'
import AutoComplete from '..'
import ConfigProvider from '../../config-provider'
import Select from '../../select'
import { mount } from '/@tests/utils'

type AllowClear = AutoCompleteProps['allowClear']

function mountDemo(render: () => any) {
  return mount(defineComponent(() => () => render()), { attachTo: document.body })
}

// https://github.com/ant-design/ant-design/pull/59591
describe('autoComplete allowClear with ConfigProvider', () => {
  const getClearButton = (wrapper: ReturnType<typeof mount>) => wrapper.find('.ant-select-clear')

  it('lets component props override a globally disabled clear button', async () => {
    const allowClear = ref<AllowClear>()
    const wrapper = mountDemo(() => (
      <ConfigProvider autoComplete={{ allowClear: false }}>
        <AutoComplete defaultValue="value" allowClear={allowClear.value} />
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
      <ConfigProvider autoComplete={{ allowClear: { tabIndex: -1, label: 'Outer clear' } }}>
        <ConfigProvider
          autoComplete={innerAllowClear.value === undefined ? undefined : { allowClear: innerAllowClear.value }}
        >
          <AutoComplete defaultValue="value" />
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

  it('keeps Select and AutoComplete global clear options independent', () => {
    const wrapper = mountDemo(() => (
      <ConfigProvider
        autoComplete={{ allowClear: { label: 'Clear autocomplete', tabIndex: -1 } }}
        select={{ allowClear: { label: 'Clear select', tabIndex: 0 } }}
      >
        <AutoComplete class="auto" defaultValue="value" />
        <Select class="select" defaultValue="value" options={[{ value: 'value' }]} />
      </ConfigProvider>
    ))
    const autoClear = wrapper.find('.auto .ant-select-clear')
    const selectClear = wrapper.find('.select .ant-select-clear')
    expect(autoClear.attributes('aria-label')).toBe('Clear autocomplete')
    expect(autoClear.attributes('tabindex')).toBe('-1')
    expect(selectClear.attributes('aria-label')).toBe('Clear select')
    expect(selectClear.attributes('tabindex')).toBe('0')
    wrapper.unmount()
  })
})
