import type { TimePickerProps } from '..'
import { describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import TimePicker from '..'
import ConfigProvider from '../../config-provider'
import { mount } from '/@tests/utils'

const { RangePicker } = TimePicker

describe('time-picker.semantic', () => {
  // ====================== Classes as Object ======================
  it('should support semantic classes and styles for single picker', async () => {
    const wrapper = mount(TimePicker, {
      props: {
        open: true,
        prefix: 'prefix',
        classes: {
          root: 'tp-root',
          prefix: 'tp-prefix',
          input: 'tp-input',
          suffix: 'tp-suffix',
          popup: {
            root: 'tp-popup-root',
            content: 'tp-popup-content',
            item: 'tp-popup-item',
          },
        },
        styles: {
          root: { backgroundColor: 'rgb(255, 0, 0)' },
          prefix: { color: 'rgb(0, 128, 0)' },
          input: { color: 'rgb(0, 0, 255)' },
          suffix: { fontSize: '20px' },
          popup: {
            root: { backgroundColor: 'rgb(200, 200, 200)' },
            content: { backgroundColor: 'rgb(240, 240, 255)' },
            item: { backgroundColor: 'rgb(255, 255, 240)' },
          },
        },
      },
      attachTo: document.body,
    })
    await nextTick()

    // Root
    const root = wrapper.find('.ant-picker')
    expect(root.classes()).toContain('tp-root')
    expect((root.element as HTMLElement).style.backgroundColor).toBe('rgb(255, 0, 0)')

    // Prefix
    const prefix = wrapper.find('.ant-picker-prefix')
    expect(prefix.classes()).toContain('tp-prefix')
    expect((prefix.element as HTMLElement).style.color).toBe('rgb(0, 128, 0)')

    // Input
    const input = wrapper.find('.ant-picker-input input')
    expect(input.classes()).toContain('tp-input')
    expect((input.element as HTMLInputElement).style.color).toBe('rgb(0, 0, 255)')

    // Suffix
    const suffix = wrapper.find('.ant-picker-suffix')
    expect(suffix.classes()).toContain('tp-suffix')
    expect((suffix.element as HTMLElement).style.fontSize).toBe('20px')

    // Popup
    const popup = document.querySelector('.ant-picker-dropdown') as HTMLElement | null
    expect(popup).toBeTruthy()
    expect(popup?.classList.contains('tp-popup-root')).toBe(true)
    expect(popup?.style.backgroundColor).toBe('rgb(200, 200, 200)')

    // Popup content
    const content = document.querySelector('.ant-picker-content')
    expect(content?.classList.contains('tp-popup-content')).toBe(true)

    // Popup item
    const item = document.querySelector('.ant-picker-time-panel-cell')
    expect(item?.classList.contains('tp-popup-item')).toBe(true)

    await wrapper.setProps({ open: false })
    await nextTick()
    wrapper.unmount()
  })

  // ====================== Classes as Function ======================
  it('should support semantic classes as function', () => {
    const classesFn = vi.fn((info: { props: TimePickerProps }) => ({
      root: info.props.disabled ? 'tp-disabled-root' : 'tp-enabled-root',
      suffix: `tp-size-${info.props.size ?? 'middle'}`,
    }))

    const stylesFn = vi.fn((info: { props: TimePickerProps }) => ({
      root: { fontSize: info.props.size === 'large' ? '18px' : '14px' },
    }))

    const wrapper = mount(TimePicker, {
      props: {
        classes: classesFn as any,
        styles: stylesFn as any,
        size: 'large',
      },
    })

    expect(classesFn).toHaveBeenCalled()
    expect(stylesFn).toHaveBeenCalled()

    const root = wrapper.find('.ant-picker')
    expect(root.classes()).toContain('tp-enabled-root')
    expect((root.element as HTMLElement).style.fontSize).toBe('18px')

    const suffix = wrapper.find('.ant-picker-suffix')
    expect(suffix.classes()).toContain('tp-size-large')
  })

  // ====================== ConfigProvider Merging ======================
  it('should merge ConfigProvider and component classes', () => {
    const wrapper = mount(() => (
      <ConfigProvider
        timePicker={{
          classes: { root: 'ctx-root' },
          styles: { root: { margin: '1px' } },
        }}
      >
        <TimePicker
          classes={{ root: 'comp-root' }}
          styles={{ root: { padding: '2px' } }}
        />
      </ConfigProvider>
    ))

    const root = wrapper.find('.ant-picker')
    expect(root.classes()).toContain('ctx-root')
    expect(root.classes()).toContain('comp-root')
    expect((root.element as HTMLElement).style.margin).toBe('1px')
    expect((root.element as HTMLElement).style.padding).toBe('2px')
  })

  // ====================== RangePicker Semantic ======================
  it('should support semantic classes for range picker', async () => {
    const wrapper = mount(RangePicker, {
      props: {
        open: true,
        classes: {
          root: 'range-root',
          input: 'range-input',
          popup: { root: 'range-popup-root' },
        },
        styles: {
          root: { borderWidth: '2px' },
        },
      },
      attachTo: document.body,
    })
    await nextTick()

    expect(wrapper.find('.ant-picker-range').classes()).toContain('range-root')
    expect((wrapper.find('.ant-picker-range').element as HTMLElement).style.borderWidth).toBe('2px')
    expect(wrapper.findAll('.ant-picker-input input')[0]?.classes()).toContain('range-input')

    const popup = document.querySelector('.ant-picker-dropdown') as HTMLElement | null
    expect(popup?.classList.contains('range-popup-root')).toBe(true)

    await wrapper.setProps({ open: false })
    await nextTick()
    wrapper.unmount()
  })
})
