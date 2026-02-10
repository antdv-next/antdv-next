import type { DividerProps } from '..'
import { describe, expect, it, vi } from 'vitest'
import Divider from '..'
import { mount } from '/@tests/utils'

describe('divider.Semantic', () => {
  it('should support classNames and styles as functions', async () => {
    const classNamesFn = vi.fn((info: { props: DividerProps }) => {
      if (info.props.dashed) {
        return { root: 'dashed-root', rail: 'dashed-rail', content: 'dashed-content' }
      }
      return { root: 'default-root', rail: 'default-rail', content: 'default-content' }
    })

    const stylesFn = vi.fn((info: { props: DividerProps }) => {
      if (info.props.dashed) {
        return { root: { color: 'rgb(255, 0, 0)' } }
      }
      return { root: { color: 'rgb(0, 0, 255)' } }
    })

    const wrapper = mount(Divider, {
      props: {
        dashed: true,
        classes: classNamesFn,
        styles: stylesFn,
      },
      slots: { default: () => 'Text' },
    })

    expect(classNamesFn).toHaveBeenCalled()
    expect(stylesFn).toHaveBeenCalled()

    const root = wrapper.find('.ant-divider')
    expect(root.classes()).toContain('dashed-root')
    expect(root.attributes('style')).toContain('color: rgb(255, 0, 0)')

    const railStart = wrapper.find('.ant-divider-rail-start')
    expect(railStart.classes()).toContain('dashed-rail')

    const content = wrapper.find('.ant-divider-inner-text')
    expect(content.classes()).toContain('dashed-content')

    // Update props — function should return different values
    await wrapper.setProps({ dashed: false })

    const updatedRoot = wrapper.find('.ant-divider')
    expect(updatedRoot.classes()).toContain('default-root')
    expect(updatedRoot.attributes('style')).toContain('color: rgb(0, 0, 255)')

    const updatedRailStart = wrapper.find('.ant-divider-rail-start')
    expect(updatedRailStart.classes()).toContain('default-rail')

    const updatedContent = wrapper.find('.ant-divider-inner-text')
    expect(updatedContent.classes()).toContain('default-content')
  })

  it('should support classNames function without children (rail on root)', () => {
    const classNamesFn = vi.fn(() => ({
      root: 'fn-root',
      rail: 'fn-rail',
    }))

    const stylesFn = vi.fn(() => ({
      rail: { borderColor: 'rgb(0, 128, 0)' },
    }))

    const wrapper = mount(Divider, {
      props: {
        classes: classNamesFn,
        styles: stylesFn,
      },
    })

    expect(classNamesFn).toHaveBeenCalled()
    expect(stylesFn).toHaveBeenCalled()

    const root = wrapper.find('.ant-divider')
    expect(root.classes()).toContain('fn-root')
    // When no children, rail class and style are applied to root
    expect(root.classes()).toContain('fn-rail')
    expect(root.attributes('style')).toContain('border-color: rgb(0, 128, 0)')
    expect(wrapper.find('.ant-divider-rail-start').exists()).toBe(false)
  })

  it('should apply object classNames and styles to all semantic elements', () => {
    const wrapper = mount(Divider, {
      props: {
        classes: {
          root: 'custom-root',
          rail: 'custom-rail',
          content: 'custom-content',
        },
        styles: {
          root: { padding: '5px' },
          rail: { borderColor: 'rgb(0, 128, 0)' },
          content: { fontWeight: 'bold' },
        },
      },
      slots: { default: () => 'Text' },
    })

    // root
    const root = wrapper.find('.ant-divider')
    expect(root.classes()).toContain('custom-root')
    expect(root.attributes('style')).toContain('padding: 5px')

    // rail (with children → applied to rail-start and rail-end)
    const railStart = wrapper.find('.ant-divider-rail-start')
    expect(railStart.classes()).toContain('custom-rail')
    expect(railStart.attributes('style')).toContain('border-color: rgb(0, 128, 0)')

    const railEnd = wrapper.find('.ant-divider-rail-end')
    expect(railEnd.classes()).toContain('custom-rail')
    expect(railEnd.attributes('style')).toContain('border-color: rgb(0, 128, 0)')

    // content
    const content = wrapper.find('.ant-divider-inner-text')
    expect(content.classes()).toContain('custom-content')
    expect(content.attributes('style')).toContain('font-weight: bold')
  })

  it('should react to classNames function when props change', async () => {
    const classNamesFn = vi.fn((info: { props: DividerProps }) => ({
      root: info.props.plain ? 'plain-root' : 'normal-root',
    }))

    const wrapper = mount(Divider, {
      props: {
        plain: false,
        classes: classNamesFn,
      },
      slots: { default: () => 'Text' },
    })

    expect(wrapper.find('.ant-divider').classes()).toContain('normal-root')

    await wrapper.setProps({ plain: true })
    expect(wrapper.find('.ant-divider').classes()).toContain('plain-root')
  })
})
