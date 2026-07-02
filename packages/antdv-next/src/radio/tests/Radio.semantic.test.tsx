import { describe, expect, it } from 'vitest'
import Radio from '..'
import ConfigProvider from '../../config-provider'
import { expectSemanticRootStylePriority, semanticRootStylePriority } from '/@tests/shared/semanticStylePriority'
import { mount } from '/@tests/utils'

const prefixCls = 'ant-radio'

describe('radio semantic', () => {
  // ===================== classes (object form) =====================

  it('should apply semantic classes as object', () => {
    const wrapper = mount(Radio, {
      props: {
        classes: {
          root: 'custom-root',
          icon: 'custom-icon',
          label: 'custom-label',
        },
      },
      slots: { default: () => 'Test' },
    })
    expect(wrapper.find('label').classes()).toContain('custom-root')
    expect(wrapper.find(`.${prefixCls}`).classes()).toContain('custom-icon')
    expect(wrapper.find(`.${prefixCls}-label`).classes()).toContain('custom-label')
  })

  // ===================== styles (object form) =====================

  it('should apply semantic styles as object', () => {
    const wrapper = mount(Radio, {
      props: {
        styles: {
          root: { backgroundColor: 'rgb(255, 0, 0)' },
          icon: { backgroundColor: 'rgb(0, 255, 0)' },
          label: { backgroundColor: 'rgb(0, 0, 255)' },
        },
      },
      slots: { default: () => 'Test' },
    })
    expect(wrapper.find('label').attributes('style')).toContain('background-color: rgb(255, 0, 0)')
    expect(wrapper.find(`.${prefixCls}`).attributes('style')).toContain('background-color: rgb(0, 255, 0)')
    expect(wrapper.find(`.${prefixCls}-label`).attributes('style')).toContain('background-color: rgb(0, 0, 255)')
  })

  // ===================== both classes and styles =====================

  it('should support both classes and styles together', () => {
    const wrapper = mount(Radio, {
      props: {
        classes: { root: 'c-root', icon: 'c-icon', label: 'c-label' },
        styles: {
          root: { color: 'rgb(255, 0, 0)' },
          icon: { color: 'rgb(0, 255, 0)' },
          label: { color: 'rgb(0, 0, 255)' },
        },
      },
      slots: { default: () => 'Test' },
    })
    expect(wrapper.find('label').classes()).toContain('c-root')
    expect(wrapper.find('label').attributes('style')).toContain('color: rgb(255, 0, 0)')
    expect(wrapper.find(`.${prefixCls}`).classes()).toContain('c-icon')
    expect(wrapper.find(`.${prefixCls}`).attributes('style')).toContain('color: rgb(0, 255, 0)')
    expect(wrapper.find(`.${prefixCls}-label`).classes()).toContain('c-label')
    expect(wrapper.find(`.${prefixCls}-label`).attributes('style')).toContain('color: rgb(0, 0, 255)')
  })

  // ===================== ConfigProvider semantic merging =====================

  it('should merge ConfigProvider classes with component classes', () => {
    const wrapper = mount(() => (
      <ConfigProvider radio={{ classes: { root: 'ctx-root', icon: 'ctx-icon' } }}>
        <Radio classes={{ root: 'comp-root', label: 'comp-label' }}>Test</Radio>
      </ConfigProvider>
    ))
    const label = wrapper.find('label')
    expect(label.classes()).toContain('ctx-root')
    expect(label.classes()).toContain('comp-root')
    expect(wrapper.find(`.${prefixCls}`).classes()).toContain('ctx-icon')
    expect(wrapper.find(`.${prefixCls}-label`).classes()).toContain('comp-label')
  })

  it('should merge ConfigProvider styles with component styles', () => {
    const wrapper = mount(() => (
      <ConfigProvider radio={{ styles: { root: { margin: '1px' } } }}>
        <Radio styles={{ root: { padding: '2px' } }}>Test</Radio>
      </ConfigProvider>
    ))
    const style = wrapper.find('label').attributes('style')!
    expect(style).toContain('margin: 1px')
    expect(style).toContain('padding: 2px')
  })

  // ===================== partial classes =====================

  it('should apply partial classes without affecting other slots', () => {
    const wrapper = mount(Radio, {
      props: {
        classes: { root: 'only-root' },
      },
      slots: { default: () => 'Test' },
    })
    expect(wrapper.find('label').classes()).toContain('only-root')
    // icon and label should not have extra custom classes
    expect(wrapper.find(`.${prefixCls}`).classes()).not.toContain('only-root')
    expect(wrapper.find(`.${prefixCls}-label`).classes()).not.toContain('only-root')
  })

  it('should apply partial styles without affecting other slots', () => {
    const wrapper = mount(Radio, {
      props: {
        styles: { icon: { color: 'rgb(255, 0, 0)' } },
      },
      slots: { default: () => 'Test' },
    })
    expect(wrapper.find(`.${prefixCls}`).attributes('style')).toContain('color: rgb(255, 0, 0)')
    // root should not have the style
    expect(wrapper.find('label').attributes('style') ?? '').not.toContain('color: rgb(255, 0, 0)')
  })

  // https://github.com/ant-design/ant-design/pull/58474
  it('aligns root semantic style priority', () => {
    const wrapper = mount(() => (
      <ConfigProvider radio={{ style: semanticRootStylePriority.contextStyle, styles: semanticRootStylePriority.contextStyles }}>
        <Radio style={semanticRootStylePriority.style} styles={semanticRootStylePriority.styles}>Radio</Radio>
      </ConfigProvider>
    ), { attachTo: document.body })

    expectSemanticRootStylePriority(wrapper.find('.ant-radio-wrapper').element)
    wrapper.unmount()
  })
})
