import type { TimelineProps } from '..'
import { describe, expect, it, vi } from 'vitest'
import Timeline from '..'
import { mount } from '/@tests/utils'

describe('timeline.semantic', () => {
  const baseItems: TimelineProps['items'] = [
    { title: '2024-01-01', content: 'Created' },
    { title: '2024-01-02', content: 'Updated' },
  ]

  // ===================== Function Form =====================
  it('should support classNames as function', () => {
    const classNamesFn = vi.fn((info: { props: TimelineProps }) => {
      if (info.props.mode === 'end') {
        return {
          root: 'fn-root-end',
          item: 'fn-item-end',
          itemIcon: 'fn-icon-end',
          itemTitle: 'fn-title-end',
          itemContent: 'fn-content-end',
          itemRail: 'fn-rail-end',
        }
      }
      return {
        root: 'fn-root-start',
        item: 'fn-item-start',
        itemIcon: 'fn-icon-start',
        itemTitle: 'fn-title-start',
        itemContent: 'fn-content-start',
        itemRail: 'fn-rail-start',
      }
    })

    const wrapper = mount(Timeline, {
      props: {
        items: baseItems,
        mode: 'start',
        classes: classNamesFn,
      },
    })

    expect(classNamesFn).toHaveBeenCalled()
    expect(wrapper.find('.ant-timeline').classes()).toContain('fn-root-start')
    expect(wrapper.find('.ant-timeline-item').classes()).toContain('fn-item-start')
    expect(wrapper.find('.ant-timeline-item-icon').classes()).toContain('fn-icon-start')
    expect(wrapper.find('.ant-timeline-item-title').classes()).toContain('fn-title-start')
    expect(wrapper.find('.ant-timeline-item-content').classes()).toContain('fn-content-start')
    expect(wrapper.find('.ant-timeline-item-rail').classes()).toContain('fn-rail-start')
  })

  it('should support styles as function', () => {
    const stylesFn = vi.fn((info: { props: TimelineProps }) => {
      if (info.props.mode === 'end') {
        return {
          root: { color: 'rgb(0, 0, 255)' },
        }
      }
      return {
        root: { color: 'rgb(255, 0, 0)' },
      }
    })

    const wrapper = mount(Timeline, {
      props: {
        items: baseItems,
        mode: 'start',
        styles: stylesFn,
      },
    })

    expect(stylesFn).toHaveBeenCalled()
    expect(wrapper.find('.ant-timeline').attributes('style')).toContain('color: rgb(255, 0, 0)')
  })

  // ===================== Function Reactivity =====================
  it('should react to classNames function when props change', async () => {
    const classNamesFn = vi.fn((info: { props: TimelineProps }) => ({
      root: info.props.mode === 'end' ? 'mode-end-root' : 'mode-start-root',
    }))

    const wrapper = mount(Timeline, {
      props: {
        items: baseItems,
        mode: 'start' as const,
        classes: classNamesFn,
      },
    })

    expect(wrapper.find('.ant-timeline').classes()).toContain('mode-start-root')

    await wrapper.setProps({ mode: 'end' })
    expect(wrapper.find('.ant-timeline').classes()).toContain('mode-end-root')
  })

  it('should react to styles function when props change', async () => {
    const stylesFn = vi.fn((info: { props: TimelineProps }) => ({
      root: { color: info.props.mode === 'end' ? 'rgb(0, 0, 255)' : 'rgb(255, 0, 0)' },
    }))

    const wrapper = mount(Timeline, {
      props: {
        items: baseItems,
        mode: 'start' as const,
        styles: stylesFn,
      },
    })

    expect(wrapper.find('.ant-timeline').attributes('style')).toContain('color: rgb(255, 0, 0)')

    await wrapper.setProps({ mode: 'end' })
    expect(wrapper.find('.ant-timeline').attributes('style')).toContain('color: rgb(0, 0, 255)')
  })

  // ===================== Object Form =====================
  it('should apply object classNames to all semantic elements', () => {
    const wrapper = mount(Timeline, {
      props: {
        items: baseItems,
        classes: {
          root: 'obj-root',
          item: 'obj-item',
          itemIcon: 'obj-icon',
          itemTitle: 'obj-title',
          itemContent: 'obj-content',
          itemRail: 'obj-rail',
        },
      },
    })

    expect(wrapper.find('.ant-timeline').classes()).toContain('obj-root')
    expect(wrapper.find('.ant-timeline-item').classes()).toContain('obj-item')
    expect(wrapper.find('.ant-timeline-item-icon').classes()).toContain('obj-icon')
    expect(wrapper.find('.ant-timeline-item-title').classes()).toContain('obj-title')
    expect(wrapper.find('.ant-timeline-item-content').classes()).toContain('obj-content')
    expect(wrapper.find('.ant-timeline-item-rail').classes()).toContain('obj-rail')
  })

  it('should apply object styles to all semantic elements', () => {
    const wrapper = mount(Timeline, {
      props: {
        items: baseItems,
        styles: {
          root: { backgroundColor: 'rgb(245, 245, 245)' },
          item: { margin: '4px' },
          itemIcon: { borderColor: 'rgb(0, 128, 0)' },
          itemTitle: { fontWeight: 'bold' },
          itemContent: { fontStyle: 'italic' },
          itemRail: { borderWidth: '2px' },
        },
      },
    })

    expect(wrapper.find('.ant-timeline').attributes('style')).toContain('background-color: rgb(245, 245, 245)')
    expect(wrapper.find('.ant-timeline-item').attributes('style')).toContain('margin: 4px')
    expect(wrapper.find('.ant-timeline-item-icon').attributes('style')).toContain('border-color: rgb(0, 128, 0)')
    expect(wrapper.find('.ant-timeline-item-title').attributes('style')).toContain('font-weight: bold')
    expect(wrapper.find('.ant-timeline-item-content').attributes('style')).toContain('font-style: italic')
    expect(wrapper.find('.ant-timeline-item-rail').attributes('style')).toContain('border-width: 2px')
  })

  // ===================== Absent Elements =====================
  it('should not break when some items lack title', () => {
    const wrapper = mount(Timeline, {
      props: {
        items: [
          { content: 'no-title-item' },
        ],
        classes: {
          root: 'obj-root',
          item: 'obj-item',
          itemContent: 'obj-content',
        },
      },
    })

    expect(wrapper.find('.ant-timeline').classes()).toContain('obj-root')
    expect(wrapper.find('.ant-timeline-item').classes()).toContain('obj-item')
    expect(wrapper.find('.ant-timeline-item-content').classes()).toContain('obj-content')
  })

  it('should not break with empty items array', () => {
    const wrapper = mount(Timeline, {
      props: {
        items: [],
        classes: {
          root: 'obj-root',
        },
      },
    })

    expect(wrapper.find('.ant-timeline').classes()).toContain('obj-root')
    expect(wrapper.findAll('li.ant-timeline-item')).toHaveLength(0)
  })

  // ===================== Combined classes and styles =====================
  it('should merge classNames and styles together', () => {
    const wrapper = mount(Timeline, {
      props: {
        items: baseItems,
        classes: { root: 'combined-root' },
        styles: { root: { padding: '16px' } },
      },
    })

    const root = wrapper.find('.ant-timeline')
    expect(root.classes()).toContain('combined-root')
    expect(root.attributes('style')).toContain('padding: 16px')
  })
})
