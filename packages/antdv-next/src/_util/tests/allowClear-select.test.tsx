import type { AllowClear } from '../hooks/useAllowClear'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, nextTick, ref } from 'vue'
import AutoComplete from '../../auto-complete'
import Cascader from '../../cascader'
import ConfigProvider from '../../config-provider'
import zhCN from '../../locale/zh_CN'
import Select from '../../select'
import TreeSelect from '../../tree-select'
import { mount } from '/@tests/utils'

// https://github.com/ant-design/ant-design/pull/59566
interface ClearProps {
  allowClear?: AllowClear
  onClear?: () => void
}

const clearCases: {
  name: string
  configKey?: 'select' | 'autoComplete' | 'treeSelect' | 'cascader'
  render: (props: ClearProps) => any
}[] = [
  {
    name: 'Select',
    configKey: 'select',
    render: props => <Select defaultValue="value" options={[{ value: 'value' }]} {...props} />,
  },
  {
    name: 'AutoComplete',
    configKey: 'autoComplete',
    render: props => <AutoComplete defaultValue="value" {...props} />,
  },
  {
    name: 'TreeSelect',
    render: props => (
      <TreeSelect defaultValue="value" treeData={[{ value: 'value', title: 'Value' }]} {...props} />
    ),
  },
  {
    name: 'Cascader',
    render: props => (
      <Cascader defaultValue={['value']} options={[{ value: 'value', label: 'Value' }]} {...props} />
    ),
  },
]

function mountDemo(render: () => any) {
  return mount(defineComponent(() => () => render()), { attachTo: document.body })
}

const getClearButton = (wrapper: ReturnType<typeof mount>) => wrapper.find('.ant-select-clear')

describe.each(clearCases)('$name unified allowClear', ({ configKey, render }) => {
  it('removes the clear entry when disabled and restores its configuration when enabled', async () => {
    const onClear = vi.fn()
    const config = {
      clearIcon: <span class="custom-clear-icon">Custom</span>,
      label: 'Remove value',
      tabIndex: -1,
    }
    const allowClear = ref<AllowClear>(config)
    const wrapper = mountDemo(() => render({ allowClear: allowClear.value, onClear }))

    expect(getClearButton(wrapper).attributes('aria-label')).toBe('Remove value')
    expect(getClearButton(wrapper).attributes('tabindex')).toBe('-1')

    allowClear.value = { ...config, disabled: true }
    await nextTick()
    expect(getClearButton(wrapper).exists()).toBe(false)
    expect(wrapper.find('.custom-clear-icon').exists()).toBe(false)
    expect(onClear).not.toHaveBeenCalled()

    allowClear.value = { ...config, disabled: false }
    await nextTick()
    expect(getClearButton(wrapper).attributes('aria-label')).toBe('Remove value')
    expect(getClearButton(wrapper).attributes('tabindex')).toBe('-1')
    expect(wrapper.find('.custom-clear-icon').exists()).toBe(true)

    await getClearButton(wrapper).trigger('click')
    expect(onClear).toHaveBeenCalledTimes(1)
    wrapper.unmount()
  })

  it('updates the localized label and preserves an explicit label', async () => {
    const chinese = ref(false)
    const allowClear = ref<AllowClear>(true)
    const wrapper = mountDemo(() => (
      <ConfigProvider locale={chinese.value ? zhCN : undefined}>
        {render({ allowClear: allowClear.value })}
      </ConfigProvider>
    ))

    expect(getClearButton(wrapper).attributes('aria-label')).toBe('Clear')
    chinese.value = true
    await nextTick()
    expect(getClearButton(wrapper).attributes('aria-label')).toBe('清除')
    allowClear.value = { label: 'Remove value' }
    await nextTick()
    expect(getClearButton(wrapper).attributes('aria-label')).toBe('Remove value')
    wrapper.unmount()
  })

  if (configKey) {
    it('merges fields before normalization and preserves explicit false and zero overrides', async () => {
      const contextAllowClear = {
        clearIcon: <span class="global-clear">Custom</span>,
        disabled: true,
        tabIndex: -1,
        label: 'Global clear',
      }
      const allowClear = ref<AllowClear | undefined>()
      const wrapper = mountDemo(() => (
        <ConfigProvider {...{ [configKey]: { allowClear: contextAllowClear } }}>
          {render({ allowClear: allowClear.value })}
        </ConfigProvider>
      ))

      expect(wrapper.find('.global-clear').exists()).toBe(false)

      allowClear.value = true
      await nextTick()
      expect(wrapper.find('.global-clear').exists()).toBe(false)

      allowClear.value = { tabIndex: 0 }
      await nextTick()
      expect(wrapper.find('.global-clear').exists()).toBe(false)

      allowClear.value = { disabled: false }
      await nextTick()
      expect(getClearButton(wrapper).attributes('aria-label')).toBe('Global clear')
      expect(getClearButton(wrapper).attributes('tabindex')).toBe('-1')
      expect(wrapper.find('.global-clear').exists()).toBe(true)

      allowClear.value = { disabled: false, tabIndex: 0, label: 'Local clear' }
      await nextTick()
      expect(getClearButton(wrapper).attributes('aria-label')).toBe('Local clear')
      expect(getClearButton(wrapper).attributes('tabindex')).toBe('0')
      expect(wrapper.find('.global-clear').exists()).toBe(true)

      allowClear.value = false
      await nextTick()
      expect(wrapper.find('.global-clear').exists()).toBe(false)
      wrapper.unmount()
    })
  }
})

it.each([true, {}, { tabIndex: 0 }])(
  'keeps AutoComplete outside select.allowClear configuration (%j)',
  (allowClear) => {
    const wrapper = mountDemo(() => (
      <ConfigProvider
        select={{
          allowClear: {
            clearIcon: <span class="select-clear" />,
            disabled: true,
            tabIndex: -1,
            label: 'Select clear',
          },
        }}
      >
        <AutoComplete defaultValue="value" allowClear={allowClear} />
      </ConfigProvider>
    ))
    expect(getClearButton(wrapper).attributes('aria-label')).toBe('Clear')
    expect(getClearButton(wrapper).attributes('tabindex')).not.toBe('-1')
    expect(wrapper.find('.select-clear').exists()).toBe(false)
    wrapper.unmount()
  },
)
