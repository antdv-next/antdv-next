import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import { SkeletonButton } from '..'
import mountTest from '/@tests/shared/mountTest'
import rtlTest from '/@tests/shared/rtlTest'
import { mount } from '/@tests/utils'

describe('skeleton.button', () => {
  mountTest(SkeletonButton)
  rtlTest(() => h(SkeletonButton))

  // ==================== Basic Rendering ====================

  it('should render skeleton button by default', () => {
    const wrapper = mount(SkeletonButton)
    expect(wrapper.find('.ant-skeleton').exists()).toBe(true)
    expect(wrapper.find('.ant-skeleton-element').exists()).toBe(true)
    expect(wrapper.find('.ant-skeleton-button').exists()).toBe(true)
  })

  // ==================== active ====================

  it('should render active class when active=true', () => {
    const wrapper = mount(SkeletonButton, { props: { active: true } })
    expect(wrapper.find('.ant-skeleton-active').exists()).toBe(true)
  })

  it('should not render active class by default', () => {
    const wrapper = mount(SkeletonButton)
    expect(wrapper.find('.ant-skeleton-active').exists()).toBe(false)
  })

  // ==================== block ====================

  it('should render block class when block=true', () => {
    const wrapper = mount(SkeletonButton, { props: { block: true } })
    expect(wrapper.find('.ant-skeleton-block').exists()).toBe(true)
  })

  it('should not render block class by default', () => {
    const wrapper = mount(SkeletonButton)
    expect(wrapper.find('.ant-skeleton-block').exists()).toBe(false)
  })

  // ==================== size ====================

  describe('size', () => {
    it('should render large size class when size=large', () => {
      const wrapper = mount(SkeletonButton, { props: { size: 'large' } })
      expect(wrapper.find('.ant-skeleton-button-lg').exists()).toBe(true)
    })

    it('should render small size class when size=small', () => {
      const wrapper = mount(SkeletonButton, { props: { size: 'small' } })
      expect(wrapper.find('.ant-skeleton-button-sm').exists()).toBe(true)
    })

    it('should not render size class when size=default', () => {
      const wrapper = mount(SkeletonButton, { props: { size: 'default' } })
      expect(wrapper.find('.ant-skeleton-button-lg').exists()).toBe(false)
      expect(wrapper.find('.ant-skeleton-button-sm').exists()).toBe(false)
    })
  })

  // ==================== shape ====================

  describe('shape', () => {
    it('should render circle shape class when shape=circle', () => {
      const wrapper = mount(SkeletonButton, { props: { shape: 'circle' } })
      expect(wrapper.find('.ant-skeleton-button-circle').exists()).toBe(true)
    })

    it('should render square shape class when shape=square', () => {
      const wrapper = mount(SkeletonButton, { props: { shape: 'square' } })
      expect(wrapper.find('.ant-skeleton-button-square').exists()).toBe(true)
    })

    it('should render round shape class when shape=round', () => {
      const wrapper = mount(SkeletonButton, { props: { shape: 'round' } })
      expect(wrapper.find('.ant-skeleton-button-round').exists()).toBe(true)
    })

    it('should not render any shape class when shape=default', () => {
      const wrapper = mount(SkeletonButton, { props: { shape: 'default' } })
      const btn = wrapper.find('.ant-skeleton-button')
      expect(btn.classes()).not.toContain('ant-skeleton-button-circle')
      expect(btn.classes()).not.toContain('ant-skeleton-button-square')
      expect(btn.classes()).not.toContain('ant-skeleton-button-round')
    })
  })

  // ==================== rootClass ====================

  it('should apply rootClass to root element', () => {
    const wrapper = mount(SkeletonButton, { props: { rootClass: 'my-root' } })
    expect(wrapper.find('.ant-skeleton').classes()).toContain('my-root')
  })

  // ==================== classes ====================

  it('should apply classes.content to inner button element', () => {
    const wrapper = mount(SkeletonButton, {
      props: { classes: { content: 'my-content' } },
    })
    expect(wrapper.find('.ant-skeleton-button').classes()).toContain('my-content')
  })

  // ==================== styles ====================

  it('should apply styles.root to root element', () => {
    const wrapper = mount(SkeletonButton, {
      props: { styles: { root: { padding: '10px' } } },
    })
    expect(wrapper.find('.ant-skeleton').attributes('style')).toContain('padding: 10px')
  })

  it('should apply styles.content to inner button element', () => {
    const wrapper = mount(SkeletonButton, {
      props: { styles: { content: { color: 'red' } } },
    })
    const style = wrapper.find('.ant-skeleton-button').attributes('style')
    expect(style).toContain('color: red')
  })

  // ==================== attrs passthrough ====================

  it('should pass attrs.class to root element', () => {
    const wrapper = mount(SkeletonButton, {
      attrs: { class: 'extra-class' },
    })
    expect(wrapper.find('.ant-skeleton').classes()).toContain('extra-class')
  })

  it('should pass attrs.style to inner button element', () => {
    const wrapper = mount(SkeletonButton, {
      attrs: { style: { border: '1px solid red' } },
    })
    const style = wrapper.find('.ant-skeleton-button').attributes('style')
    expect(style).toContain('border: 1px solid red')
  })

  it('should pass extra attrs to root element', () => {
    const wrapper = mount(SkeletonButton, {
      attrs: { 'data-testid': 'skeleton-btn' },
    })
    expect(wrapper.find('.ant-skeleton').attributes('data-testid')).toBe('skeleton-btn')
  })
})
