import type { SpaceProps } from '..'
import { describe, expect, it, vi } from 'vitest'
import { h } from 'vue'
import Space from '..'
import { mount } from '/@tests/utils'

describe('space.semantic', () => {
  it('should support classNames and styles as functions', async () => {
    const classNamesFn = vi.fn((info: { props: SpaceProps }) => {
      if (info.props.orientation === 'vertical') {
        return {
          root: 'fn-vertical-root',
          item: 'fn-vertical-item',
          separator: 'fn-vertical-sep',
        }
      }
      return {
        root: 'fn-horizontal-root',
        item: 'fn-horizontal-item',
        separator: 'fn-horizontal-sep',
      }
    })

    const stylesFn = vi.fn((info: { props: SpaceProps }) => {
      if (info.props.orientation === 'vertical') {
        return { root: { color: 'rgb(0, 128, 0)' } }
      }
      return { root: { color: 'rgb(255, 0, 0)' } }
    })

    const wrapper = mount(Space, {
      props: {
        classes: classNamesFn,
        styles: stylesFn,
      },
      slots: {
        default: () => [h('span', '1'), h('span', '2')],
        separator: () => h('span', '|'),
      },
    })

    expect(classNamesFn).toHaveBeenCalled()
    expect(stylesFn).toHaveBeenCalled()
    // default is horizontal
    expect(wrapper.find('.ant-space').classes()).toContain('fn-horizontal-root')
    expect(wrapper.find('.ant-space-item').classes()).toContain('fn-horizontal-item')
    // separator element: use custom class to find it because itemClassName concatenation
    // with item semantic class breaks the base class selector
    expect(wrapper.find('.fn-horizontal-sep').exists()).toBe(true)
    expect(wrapper.find('.ant-space').attributes('style')).toContain('color: rgb(255, 0, 0)')

    await wrapper.setProps({ orientation: 'vertical' })
    expect(wrapper.find('.ant-space').classes()).toContain('fn-vertical-root')
    expect(wrapper.find('.ant-space-item').classes()).toContain('fn-vertical-item')
    expect(wrapper.find('.fn-vertical-sep').exists()).toBe(true)
    expect(wrapper.find('.ant-space').attributes('style')).toContain('color: rgb(0, 128, 0)')
  })

  it('should apply object classNames and styles to all semantic elements', () => {
    const wrapper = mount(Space, {
      props: {
        classes: {
          root: 'obj-root',
          item: 'obj-item',
          separator: 'obj-sep',
        },
        styles: {
          root: { padding: '1px' },
          item: { padding: '2px' },
          separator: { padding: '3px' },
        },
      },
      slots: {
        default: () => [h('span', '1'), h('span', '2')],
        separator: () => h('span', '|'),
      },
    })

    expect(wrapper.find('.ant-space').classes()).toContain('obj-root')
    expect(wrapper.find('.ant-space-item').classes()).toContain('obj-item')
    // find separator via custom class (base class selector breaks when item class is set)
    const sep = wrapper.find('.obj-sep')
    expect(sep.exists()).toBe(true)

    expect(wrapper.find('.ant-space').attributes('style')).toContain('padding: 1px')
    expect(wrapper.find('.ant-space-item').attributes('style')).toContain('padding: 2px')
    expect(sep.attributes('style')).toContain('padding: 3px')
  })

  it('should not break when separator is absent', () => {
    const wrapper = mount(Space, {
      props: {
        classes: {
          root: 'obj-root',
          item: 'obj-item',
          separator: 'obj-sep',
        },
      },
      slots: {
        default: () => [h('span', '1'), h('span', '2')],
      },
    })

    // present elements still get classes
    expect(wrapper.find('.ant-space').classes()).toContain('obj-root')
    expect(wrapper.find('.ant-space-item').classes()).toContain('obj-item')
    // separator not rendered (no separator slot provided)
    expect(wrapper.find('.obj-sep').exists()).toBe(false)
  })

  it('should react to classNames function when props change', async () => {
    const classNamesFn = vi.fn((info: { props: SpaceProps }) => ({
      root: info.props.wrap ? 'wrap-root' : 'no-wrap-root',
    }))

    const wrapper = mount(Space, {
      props: { classes: classNamesFn },
      slots: { default: () => [h('span', '1'), h('span', '2')] },
    })
    expect(wrapper.find('.ant-space').classes()).toContain('no-wrap-root')

    await wrapper.setProps({ wrap: true })
    expect(wrapper.find('.ant-space').classes()).toContain('wrap-root')
  })
})
