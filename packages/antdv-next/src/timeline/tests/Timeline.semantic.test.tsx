import type { TimelineProps } from '..'
import { describe, expect, it, vi } from 'vitest'
import Timeline from '..'
import { mount } from '/@tests/utils'

describe('timeline.semantic', () => {
  it('should support classNames and styles as functions', async () => {
    const classNamesFn = vi.fn((info: { props: TimelineProps }) => {
      if (info.props.mode === 'start') {
        return {
          root: 'fn-start-root',
          item: 'fn-start-item',
          itemIcon: 'fn-start-icon',
          itemTitle: 'fn-start-title',
          itemContent: 'fn-start-content',
          itemRail: 'fn-start-rail',
        }
      }
      return {
        root: 'fn-end-root',
        item: 'fn-end-item',
        itemIcon: 'fn-end-icon',
        itemTitle: 'fn-end-title',
        itemContent: 'fn-end-content',
        itemRail: 'fn-end-rail',
      }
    })

    const stylesFn = vi.fn((info: { props: TimelineProps }) => {
      if (info.props.mode === 'start') {
        return { root: { color: 'rgb(0, 128, 0)' } }
      }
      return { root: { color: 'rgb(255, 0, 0)' } }
    })

    const wrapper = mount(Timeline, {
      props: {
        mode: 'start',
        items: [{ title: 'Title', content: 'Content' }],
        classes: classNamesFn,
        styles: stylesFn,
      },
    })

    expect(classNamesFn).toHaveBeenCalled()
    expect(stylesFn).toHaveBeenCalled()
    expect(wrapper.find('.ant-timeline').classes()).toContain('fn-start-root')
    expect(wrapper.find('.ant-timeline').attributes('style')).toContain('color: rgb(0, 128, 0)')

    await wrapper.setProps({ mode: 'end' })
    expect(wrapper.find('.ant-timeline').classes()).toContain('fn-end-root')
    expect(wrapper.find('.ant-timeline').attributes('style')).toContain('color: rgb(255, 0, 0)')
  })

  it('should apply object classNames and styles to all semantic elements', () => {
    const wrapper = mount(Timeline, {
      props: {
        items: [
          { title: 'Title 1', content: 'Content 1' },
          { title: 'Title 2', content: 'Content 2' },
        ],
        classes: {
          root: 'obj-root',
          item: 'obj-item',
          itemIcon: 'obj-icon',
          itemTitle: 'obj-title',
          itemContent: 'obj-content',
          itemRail: 'obj-rail',
        },
        styles: {
          root: { padding: '1px' },
          item: { padding: '2px' },
          itemIcon: { padding: '3px' },
          itemTitle: { padding: '4px' },
          itemContent: { padding: '5px' },
          itemRail: { padding: '6px' },
        },
      },
    })

    expect(wrapper.find('.ant-timeline').classes()).toContain('obj-root')
    expect(wrapper.find('.ant-timeline-item').classes()).toContain('obj-item')
    expect(wrapper.find('.ant-timeline-item-icon').classes()).toContain('obj-icon')
    expect(wrapper.find('.ant-timeline-item-title').classes()).toContain('obj-title')
    expect(wrapper.find('.ant-timeline-item-content').classes()).toContain('obj-content')
    // Rail only renders on non-last items
    expect(wrapper.find('.ant-timeline-item-rail').classes()).toContain('obj-rail')

    expect(wrapper.find('.ant-timeline').attributes('style')).toContain('padding: 1px')
    expect(wrapper.find('.ant-timeline-item').attributes('style')).toContain('padding: 2px')
    expect(wrapper.find('.ant-timeline-item-icon').attributes('style')).toContain('padding: 3px')
    expect(wrapper.find('.ant-timeline-item-title').attributes('style')).toContain('padding: 4px')
    expect(wrapper.find('.ant-timeline-item-content').attributes('style')).toContain('padding: 5px')
    expect(wrapper.find('.ant-timeline-item-rail').attributes('style')).toContain('padding: 6px')
  })

  it('should not break when title is absent', () => {
    const wrapper = mount(Timeline, {
      props: {
        items: [{ content: 'Content' }],
        classes: {
          root: 'obj-root',
          item: 'obj-item',
          itemIcon: 'obj-icon',
          itemContent: 'obj-content',
          itemTitle: 'obj-title',
        },
      },
    })

    // present elements still get classes
    expect(wrapper.find('.ant-timeline').classes()).toContain('obj-root')
    expect(wrapper.find('.ant-timeline-item').classes()).toContain('obj-item')
    expect(wrapper.find('.ant-timeline-item-content').classes()).toContain('obj-content')
  })

  it('should react to classNames function when props change', async () => {
    const classNamesFn = vi.fn((info: { props: TimelineProps }) => ({
      root: info.props.reverse ? 'reversed-root' : 'normal-root',
    }))

    const wrapper = mount(Timeline, {
      props: {
        reverse: false,
        items: [{ content: 'item' }],
        classes: classNamesFn,
      },
    })
    expect(wrapper.find('.ant-timeline').classes()).toContain('normal-root')

    await wrapper.setProps({ reverse: true })
    expect(wrapper.find('.ant-timeline').classes()).toContain('reversed-root')
  })
})
