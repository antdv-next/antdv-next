import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import Alert from '..'
import ConfigProvider from '../../config-provider'
import { mount } from '/@tests/utils'

describe('alert variant', () => {
  it('defaults to outlined when no variant is provided', () => {
    const wrapper = mount(Alert, { props: { type: 'success', title: 'hi' } })
    const root = wrapper.find('.ant-alert').element as HTMLElement
    expect(root.classList.contains('ant-alert-outlined')).toBe(true)
    expect(root.classList.contains('ant-alert-filled')).toBe(false)
  })

  it('applies variant prop to the root class', () => {
    const wrapper = mount(Alert, { props: { type: 'success', variant: 'filled', title: 'hi' } })
    const root = wrapper.find('.ant-alert').element as HTMLElement
    expect(root.classList.contains('ant-alert-filled')).toBe(true)
    expect(root.classList.contains('ant-alert-outlined')).toBe(false)
  })

  it('reads variant from ConfigProvider alert config', () => {
    const wrapper = mount({
      render: () => h(ConfigProvider as any, { alert: { variant: 'filled' } }, {
        default: () => h(Alert as any, { type: 'info', title: 'hello' }),
      }),
    })
    const root = wrapper.find('.ant-alert').element as HTMLElement
    expect(root.classList.contains('ant-alert-filled')).toBe(true)
  })

  it('component variant prop wins over ConfigProvider variant', () => {
    const wrapper = mount({
      render: () => h(ConfigProvider as any, { alert: { variant: 'filled' } }, {
        default: () => h(Alert as any, { type: 'info', variant: 'outlined', title: 'hello' }),
      }),
    })
    const root = wrapper.find('.ant-alert').element as HTMLElement
    expect(root.classList.contains('ant-alert-outlined')).toBe(true)
    expect(root.classList.contains('ant-alert-filled')).toBe(false)
  })
})
