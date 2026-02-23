import type { DatePickerProps } from '..'
import { describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import DatePicker from '..'
import { mount } from '/@tests/utils'

describe('date-picker.Semantic', () => {
  it('should support semantic classes and styles for single picker', async () => {
    const wrapper = mount(DatePicker, {
      props: {
        open: true,
        prefix: 'prefix',
        classes: {
          root: 'dp-root',
          prefix: 'dp-prefix',
          input: 'dp-input',
          suffix: 'dp-suffix',
          popup: {
            root: 'dp-popup-root',
            header: 'dp-popup-header',
            body: 'dp-popup-body',
            content: 'dp-popup-content',
            item: 'dp-popup-item',
            footer: 'dp-popup-footer',
          },
        },
        styles: {
          root: { backgroundColor: 'rgb(255, 0, 0)' },
          prefix: { color: 'rgb(0, 128, 0)' },
          input: { color: 'rgb(0, 0, 255)' },
          suffix: { fontSize: '20px' },
          popup: {
            root: { backgroundColor: 'rgb(200, 200, 200)' },
            header: { backgroundColor: 'rgb(255, 240, 240)' },
            body: { backgroundColor: 'rgb(240, 255, 240)' },
            content: { backgroundColor: 'rgb(240, 240, 255)' },
            item: { backgroundColor: 'rgb(255, 255, 240)' },
            footer: { backgroundColor: 'rgb(245, 245, 245)' },
          },
        },
      },
      attachTo: document.body,
    })
    await nextTick()

    const root = wrapper.find('.ant-picker')
    expect(root.classes()).toContain('dp-root')
    expect((root.element as HTMLElement).style.backgroundColor).toBe('rgb(255, 0, 0)')

    const prefix = wrapper.find('.ant-picker-prefix')
    expect(prefix.classes()).toContain('dp-prefix')
    expect((prefix.element as HTMLElement).style.color).toBe('rgb(0, 128, 0)')

    const input = wrapper.find('.ant-picker-input input')
    expect(input.classes()).toContain('dp-input')
    expect((input.element as HTMLInputElement).style.color).toBe('rgb(0, 0, 255)')

    const suffix = wrapper.find('.ant-picker-suffix')
    expect(suffix.classes()).toContain('dp-suffix')
    expect((suffix.element as HTMLElement).style.fontSize).toBe('20px')

    const popup = document.querySelector('.ant-picker-dropdown') as HTMLElement | null
    expect(popup).toBeTruthy()
    expect(popup?.classList.contains('dp-popup-root')).toBe(true)
    expect((popup as HTMLElement).style.backgroundColor).toBe('rgb(200, 200, 200)')
    expect(document.querySelector('.ant-picker-header')?.classList.contains('dp-popup-header')).toBe(true)
    expect(document.querySelector('.ant-picker-body')?.classList.contains('dp-popup-body')).toBe(true)
    expect(document.querySelector('.ant-picker-content')?.classList.contains('dp-popup-content')).toBe(true)
    expect(document.querySelector('.ant-picker-cell')?.classList.contains('dp-popup-item')).toBe(true)

    await wrapper.setProps({ open: false })
    await nextTick()
    wrapper.unmount()
  })

  it('should support semantic classes and styles as functions', () => {
    const classesFn = vi.fn((info: { props: DatePickerProps }) => ({
      root: info.props.disabled ? 'dp-disabled-root' : 'dp-enabled-root',
      suffix: `dp-size-${info.props.size ?? 'middle'}`,
    }))

    const stylesFn = vi.fn((info: { props: DatePickerProps }) => ({
      root: { fontSize: info.props.size === 'large' ? '18px' : '14px' },
      suffix: { color: info.props.disabled ? 'gray' : 'black' },
    }))

    const wrapper = mount(DatePicker, {
      props: {
        classes: classesFn as any,
        styles: stylesFn as any,
        size: 'large',
      },
    })

    expect(classesFn).toHaveBeenCalled()
    expect(stylesFn).toHaveBeenCalled()

    const root = wrapper.find('.ant-picker')
    expect(root.classes()).toContain('dp-enabled-root')
    expect((root.element as HTMLElement).style.fontSize).toBe('18px')

    const suffix = wrapper.find('.ant-picker-suffix')
    expect(suffix.classes()).toContain('dp-size-large')
  })

  it('should support semantic classes and styles for range picker', async () => {
    const wrapper = mount(DatePicker.RangePicker, {
      props: {
        open: true,
        classes: {
          root: 'range-root',
          input: 'range-input',
          popup: { root: 'range-popup-root', content: 'range-popup-content' },
        },
        styles: {
          root: { borderWidth: '2px' },
          input: { color: 'rgb(128, 0, 128)' },
          popup: { root: { zIndex: 1234 }, content: { backgroundColor: 'rgb(250, 250, 210)' } },
        },
      },
      attachTo: document.body,
    })
    await nextTick()

    expect(wrapper.find('.ant-picker-range').classes()).toContain('range-root')
    expect((wrapper.find('.ant-picker-range').element as HTMLElement).style.borderWidth).toBe('2px')
    expect(wrapper.findAll('.ant-picker-input input')[0]?.classes()).toContain('range-input')
    expect((wrapper.findAll('.ant-picker-input input')[0]?.element as HTMLInputElement).style.color).toBe('rgb(128, 0, 128)')

    const popup = document.querySelector('.ant-picker-dropdown') as HTMLElement | null
    expect(popup?.classList.contains('range-popup-root')).toBe(true)
    expect(document.querySelector('.ant-picker-content')?.classList.contains('range-popup-content')).toBe(true)

    await wrapper.setProps({ open: false })
    await nextTick()
    wrapper.unmount()
  })
})
