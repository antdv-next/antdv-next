import type { Component } from 'vue'
import type { AllowClear } from '../hooks/useAllowClear'
import VcInput from '@v-c/input'
import VcInputNumber from '@v-c/input-number'
import VcMentions from '@v-c/mentions'
import VcTextArea from '@v-c/textarea'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, nextTick, ref } from 'vue'
import ConfigProvider from '../../config-provider'
import Input from '../../input'
import InputNumber from '../../input-number'
import zhCN from '../../locale/zh_CN'
import Mentions from '../../mentions'
import { mount } from '/@tests/utils'

// https://github.com/ant-design/ant-design/pull/59548
interface ClearProps {
  allowClear?: AllowClear
  onClear?: () => void
}

const clearCases: {
  name: string
  configKey: 'input' | 'textArea' | 'mentions' | 'inputNumber'
  vcComponent: Component
  /** The @v-c component renders `allowClear.tabIndex` on the clear button */
  rendersTabIndex: boolean
  /** The @v-c component renders `allowClear.label` as the clear button's aria-label */
  rendersLabel: boolean
  render: (props: ClearProps) => any
}[] = [
  {
    name: 'Input',
    configKey: 'input',
    vcComponent: VcInput,
    rendersTabIndex: true,
    rendersLabel: false,
    render: props => <Input defaultValue="value" {...props} />,
  },
  {
    name: 'TextArea',
    configKey: 'textArea',
    vcComponent: VcTextArea,
    rendersTabIndex: true,
    rendersLabel: false,
    render: props => <Input.TextArea defaultValue="value" {...props} />,
  },
  {
    name: 'Search',
    configKey: 'input',
    vcComponent: VcInput,
    rendersTabIndex: true,
    rendersLabel: false,
    render: props => <Input.Search defaultValue="value" {...props} />,
  },
  {
    name: 'Password',
    configKey: 'input',
    vcComponent: VcInput,
    rendersTabIndex: true,
    rendersLabel: false,
    render: props => <Input.Password defaultValue="value" {...props} />,
  },
  {
    name: 'Mentions',
    configKey: 'mentions',
    vcComponent: VcMentions,
    rendersTabIndex: true,
    rendersLabel: false,
    render: props => <Mentions defaultValue="value" {...props} />,
  },
  {
    name: 'InputNumber',
    configKey: 'inputNumber',
    vcComponent: VcInputNumber,
    rendersTabIndex: false,
    rendersLabel: true,
    render: props => <InputNumber defaultValue={0} {...props} />,
  },
]

function mountDemo(render: () => any) {
  return mount(defineComponent(() => () => render()), { attachTo: document.body })
}

describe.each(clearCases)('$name unified allowClear', ({
  configKey,
  vcComponent,
  rendersTabIndex,
  rendersLabel,
  render,
}) => {
  const getClearButton = (wrapper: ReturnType<typeof mount>) => wrapper.find('button[class*="clear-icon"]')
  const getMergedAllowClear = (wrapper: ReturnType<typeof mount>) =>
    wrapper.findComponent(vcComponent as any).props('allowClear')

  it('passes the merged configuration and keeps clicking to clear working', async () => {
    const onClear = vi.fn()
    const allowClear = ref<AllowClear>({
      clearIcon: <span class="custom-clear-icon">Custom</span>,
      label: 'Remove value',
      tabIndex: -1,
    })
    const wrapper = mountDemo(() => render({ allowClear: allowClear.value, onClear }))

    expect(getMergedAllowClear(wrapper)).toMatchObject({ label: 'Remove value', tabIndex: -1 })
    expect(wrapper.find('.custom-clear-icon').exists()).toBe(true)
    if (rendersTabIndex)
      expect(getClearButton(wrapper).attributes('tabindex')).toBe('-1')
    if (rendersLabel)
      expect(getClearButton(wrapper).attributes('aria-label')).toBe('Remove value')

    allowClear.value = { ...(allowClear.value as object), disabled: true }
    await nextTick()
    expect(getMergedAllowClear(wrapper)).toMatchObject({ disabled: true })

    allowClear.value = { ...(allowClear.value as object), disabled: false }
    await nextTick()
    expect(getMergedAllowClear(wrapper)).toMatchObject({ disabled: false })
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
    const getLabel = () => rendersLabel
      ? getClearButton(wrapper).attributes('aria-label')
      : getMergedAllowClear(wrapper).label

    expect(getLabel()).toBe('Clear')
    chinese.value = true
    await nextTick()
    expect(getLabel()).toBe('清除')
    allowClear.value = { label: 'Remove value' }
    await nextTick()
    expect(getLabel()).toBe('Remove value')
    wrapper.unmount()
  })

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

    expect(getMergedAllowClear(wrapper)).toMatchObject({ disabled: true, tabIndex: -1, label: 'Global clear' })

    allowClear.value = true
    await nextTick()
    expect(getMergedAllowClear(wrapper)).toMatchObject({ disabled: true, tabIndex: -1, label: 'Global clear' })

    allowClear.value = { tabIndex: 0 }
    await nextTick()
    expect(getMergedAllowClear(wrapper)).toMatchObject({ disabled: true, tabIndex: 0 })

    allowClear.value = { disabled: false }
    await nextTick()
    expect(getMergedAllowClear(wrapper)).toMatchObject({ disabled: false, tabIndex: -1, label: 'Global clear' })
    expect(wrapper.find('.global-clear').exists()).toBe(true)
    if (rendersTabIndex)
      expect(getClearButton(wrapper).attributes('tabindex')).toBe('-1')

    allowClear.value = { disabled: false, tabIndex: 0, label: 'Local clear' }
    await nextTick()
    expect(getMergedAllowClear(wrapper)).toMatchObject({ disabled: false, tabIndex: 0, label: 'Local clear' })
    expect(wrapper.find('.global-clear').exists()).toBe(true)
    if (rendersTabIndex)
      expect(getClearButton(wrapper).attributes('tabindex')).toBe('0')
    if (rendersLabel)
      expect(getClearButton(wrapper).attributes('aria-label')).toBe('Local clear')

    allowClear.value = false
    await nextTick()
    expect(getMergedAllowClear(wrapper)).toBe(false)
    expect(wrapper.find('.global-clear').exists()).toBe(false)
    wrapper.unmount()
  })
})
