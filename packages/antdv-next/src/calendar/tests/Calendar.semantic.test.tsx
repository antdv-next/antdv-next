import type { CalendarProps } from '..'
import dayjs from 'dayjs'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import Calendar from '..'
import { mount, resetMockDate, setMockDate } from '../../../../../tests/utils'

describe('calendar.Semantic', () => {
  beforeEach(() => {
    setMockDate('2017-09-18T03:30:07.795Z')
  })

  afterEach(() => {
    resetMockDate()
  })

  it('should support classNames and styles', () => {
    const wrapper = mount(Calendar, {
      props: {
        value: dayjs('2025-01-15T00:00:00Z'),
        classes: {
          root: 'custom-root',
          header: 'custom-header',
          body: 'custom-body',
          content: 'custom-content',
          item: 'custom-item',
        },
        styles: {
          root: { margin: '10px' },
          header: { padding: '5px' },
          body: { padding: '8px' },
          content: { borderColor: 'red' },
          item: { color: 'blue' },
        },
      },
    })

    // root - applied directly by Calendar
    const rootElement = wrapper.find('.ant-picker-calendar')
    expect(rootElement.classes()).toContain('custom-root')
    expect(rootElement.attributes('style')).toContain('margin: 10px')

    // header - applied directly by Calendar
    const headerElement = wrapper.find('.ant-picker-calendar-header')
    expect(headerElement.classes()).toContain('custom-header')
    expect(headerElement.attributes('style')).toContain('padding: 5px')

    // body - applied by PickerPanel's PanelBody wrapper div
    const bodyElement = wrapper.find('.ant-picker-body')
    expect(bodyElement.classes()).toContain('custom-body')
    expect(bodyElement.attributes('style')).toContain('padding: 8px')

    // content - applied by PickerPanel's PanelBody table
    const contentElement = wrapper.find('.ant-picker-content')
    expect(contentElement.classes()).toContain('custom-content')
    expect(contentElement.attributes('style')).toContain('border-color: red')

    // item - applied by PickerPanel's PanelBody td cells
    const itemElement = wrapper.find('.ant-picker-cell')
    expect(itemElement.classes()).toContain('custom-item')
    expect(itemElement.attributes('style')).toContain('color: blue')
  })

  it('should support classNames and styles as functions', async () => {
    const classNamesFn = vi.fn((info: { props: CalendarProps<any> }) => {
      if (info.props.fullscreen === false) {
        return {
          root: 'mini-calendar',
          body: 'mini-body',
        }
      }
      return {
        root: 'full-calendar',
        body: 'full-body',
      }
    })

    const stylesFn = vi.fn((info: { props: CalendarProps<any> }) => {
      if (info.props.fullscreen === false) {
        return { root: { backgroundColor: '#f5f5f5' } }
      }
      return { root: { backgroundColor: '#ffffff' } }
    })

    const wrapper = mount(Calendar, {
      props: {
        value: dayjs('2025-01-15T00:00:00Z'),
        fullscreen: true,
        classes: classNamesFn,
        styles: stylesFn,
      },
    })

    expect(classNamesFn).toHaveBeenCalled()
    expect(stylesFn).toHaveBeenCalled()

    const rootElement = wrapper.find('.ant-picker-calendar')
    expect(rootElement.classes()).toContain('full-calendar')
    const bodyElement = wrapper.find('.ant-picker-body')
    expect(bodyElement.classes()).toContain('full-body')

    await wrapper.setProps({ fullscreen: false })

    const updatedRootElement = wrapper.find('.ant-picker-calendar')
    expect(updatedRootElement.classes()).toContain('mini-calendar')
    const updatedBodyElement = wrapper.find('.ant-picker-body')
    expect(updatedBodyElement.classes()).toContain('mini-body')
  })
})
