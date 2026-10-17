import { afterEach, describe, expect, it, vi } from 'vitest'
import { h } from 'vue'
import Select from '..'
import Cascader from '../../cascader'
import ConfigProvider from '../../config-provider'
import deDE from '../../locale/de_DE'
import zhCN from '../../locale/zh_CN'
import TreeSelect from '../../tree-select'
import { mount } from '/@tests/utils'

// https://github.com/ant-design/ant-design/pull/58267
const cases: [string, any, Record<string, any>][] = [
  [
    'Select',
    Select,
    {
      options: [
        { value: 'jack', label: 'Jack' },
        { value: 'lucy', label: 'Lucy' },
      ],
      defaultValue: 'jack',
      allowClear: true,
    },
  ],
  [
    'Cascader',
    Cascader,
    {
      options: [
        {
          value: 'zhejiang',
          label: 'Zhejiang',
          children: [{ value: 'hangzhou', label: 'Hangzhou' }],
        },
      ],
      defaultValue: ['zhejiang', 'hangzhou'],
      allowClear: true,
    },
  ],
  [
    'TreeSelect',
    TreeSelect,
    {
      treeData: [{ value: 'leaf', title: 'Leaf' }],
      defaultValue: 'leaf',
      allowClear: true,
    },
  ],
]

describe.each(cases)('%s clear button accessibility', (_, Component, props) => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  const render = (extraProps: Record<string, any> = {}, locale?: any) =>
    mount(() => (
      <ConfigProvider locale={locale}>
        {h(Component, { ...props, ...extraProps })}
      </ConfigProvider>
    ))

  it('should expose an accessible label on the clear button', () => {
    const wrapper = render()
    const clear = wrapper.find('.ant-select-clear')
    expect(clear.element.tagName).toBe('BUTTON')
    expect(clear.attributes('type')).toBe('button')
    expect(clear.attributes('aria-label')).toBe('Clear')
  })

  it('should localize the clear button accessible label', () => {
    const wrapper = render({}, zhCN)
    expect(wrapper.find('.ant-select-clear').attributes('aria-label')).toBe(zhCN.global?.clear)
  })

  it('should fall back to English for locales that do not translate `clear`', () => {
    expect(deDE.global).not.toHaveProperty('clear')
    const wrapper = render({}, deDE)
    expect(wrapper.find('.ant-select-clear').attributes('aria-label')).toBe('Clear')
  })

  it('should prefer a custom label from allowClear over the locale', () => {
    const wrapper = render({ allowClear: { label: 'Custom clear' } }, zhCN)
    expect(wrapper.find('.ant-select-clear').attributes('aria-label')).toBe('Custom clear')
  })

  it('should support default clear icon if only label is passed in allowClear prop', () => {
    const wrapper = render({ allowClear: { label: 'Clear' } })
    expect(wrapper.find('.ant-select-clear .anticon-close-circle').exists()).toBe(true)
  })

  it('should support clearIcon prop if only label is passed in allowClear prop', () => {
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const wrapper = render({ allowClear: { label: 'Clear' }, clearIcon: 'clear' })
    expect(wrapper.find('.ant-select-clear').text()).toBe('clear')
    errSpy.mockRestore()
  })

  it('should support custom clear icon if both label and icon are passed in allowClear prop', () => {
    const wrapper = render({ allowClear: { label: 'Clear', clearIcon: 'custom' } })
    expect(wrapper.find('.ant-select-clear').text()).toBe('custom')
  })
})
