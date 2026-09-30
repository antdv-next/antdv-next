import type { SpinProps } from '..'
import { describe, expect, it, vi } from 'vitest'
import { h } from 'vue'
import Spin from '..'
import { mount } from '/@tests/utils'

const prefixCls = 'ant-spin'

describe('spin.semantic', () => {
  // ===================== Object form =====================

  describe('object form', () => {
    it('should apply classes and styles to root', () => {
      const wrapper = mount(Spin, {
        props: {
          classes: { root: 'c-root' },
          styles: { root: { color: 'rgb(255, 0, 0)' } },
        },
      })
      const root = wrapper.find(`.${prefixCls}`)
      expect(root.classes()).toContain('c-root')
      expect(root.attributes('style')).toContain('color: rgb(255, 0, 0)')
    })

    it('should apply section classes and styles to root when non-nested', () => {
      const wrapper = mount(Spin, {
        props: {
          classes: { section: 'c-section' },
          styles: { section: { padding: '10px' } },
        },
      })
      // Non-nested: section class/style go on root element
      const root = wrapper.find(`.${prefixCls}`)
      expect(root.classes()).toContain(`${prefixCls}-section`)
      expect(root.classes()).toContain('c-section')
      expect(root.attributes('style')).toContain('padding: 10px')
    })

    it('should apply section classes and styles to inner wrapper when nested', () => {
      const wrapper = mount(Spin, {
        props: {
          spinning: true,
          classes: { section: 'c-section' },
          styles: { section: { padding: '10px' } },
        },
        slots: {
          default: () => h('div', 'Content'),
        },
      })
      // Nested: section class/style go on inner .ant-spin-section div
      const section = wrapper.find(`.${prefixCls}-section`)
      expect(section.exists()).toBe(true)
      expect(section.classes()).toContain('c-section')
      expect(section.attributes('style')).toContain('padding: 10px')
      // Root should NOT have section class
      const root = wrapper.find(`.${prefixCls}`)
      expect(root.classes()).not.toContain(`${prefixCls}-section`)
    })

    it('should apply classes and styles to indicator', () => {
      const wrapper = mount(Spin, {
        props: {
          classes: { indicator: 'c-indicator' },
          styles: { indicator: { background: 'rgb(0, 128, 0)' } },
        },
      })
      // Indicator class is passed to the Indicator component
      const indicator = wrapper.find('.c-indicator')
      expect(indicator.exists()).toBe(true)
    })

    it('should apply classes and styles to description', () => {
      const wrapper = mount(Spin, {
        props: {
          description: 'Loading...',
          classes: { description: 'c-desc' },
          styles: { description: { fontSize: '14px' } },
        },
      })
      const desc = wrapper.find(`.${prefixCls}-description`)
      expect(desc.classes()).toContain('c-desc')
      expect(desc.attributes('style')).toContain('font-size: 14px')
    })

    it('should apply classes and styles to container (nested mode)', () => {
      const wrapper = mount(Spin, {
        props: {
          classes: { container: 'c-container' },
          styles: { container: { background: 'rgb(0, 0, 255)' } },
        },
        slots: {
          default: () => h('div', 'Content'),
        },
      })
      const container = wrapper.find(`.${prefixCls}-container`)
      expect(container.classes()).toContain('c-container')
      expect(container.attributes('style')).toContain('background: rgb(0, 0, 255)')
    })

    it('should apply deprecated tip classes and styles to description', () => {
      const wrapper = mount(Spin, {
        props: {
          description: 'Loading...',
          classes: { tip: 'c-tip' },
          styles: { tip: { color: 'rgb(128, 128, 128)' } },
        },
      })
      const desc = wrapper.find(`.${prefixCls}-description`)
      expect(desc.classes()).toContain('c-tip')
      expect(desc.attributes('style')).toContain('color: rgb(128, 128, 128)')
    })

    it('should apply deprecated mask classes and styles to root in fullscreen', () => {
      const wrapper = mount(Spin, {
        props: {
          fullscreen: true,
          classes: { mask: 'c-mask' },
          styles: { mask: { opacity: '0.5' } },
        },
      })
      const root = wrapper.find(`.${prefixCls}`)
      expect(root.classes()).toContain('c-mask')
      expect(root.attributes('style')).toContain('opacity: 0.5')
    })
  })

  // ===================== Function form =====================

  describe('function form', () => {
    it('should support classes as function', () => {
      const classesFn = vi.fn((_info: { props: SpinProps }) => ({
        root: 'fn-root',
      }))

      const wrapper = mount(Spin, {
        props: {
          classes: classesFn,
        },
      })
      expect(classesFn).toHaveBeenCalled()
      expect(wrapper.find(`.${prefixCls}`).classes()).toContain('fn-root')
    })

    it('should support styles as function', () => {
      const stylesFn = vi.fn((_info: { props: SpinProps }) => ({
        root: { color: 'rgb(0, 128, 0)' },
      }))

      const wrapper = mount(Spin, {
        props: {
          styles: stylesFn,
        },
      })
      expect(stylesFn).toHaveBeenCalled()
      expect(wrapper.find(`.${prefixCls}`).attributes('style')).toContain('color: rgb(0, 128, 0)')
    })

    it('should re-evaluate function when props change', async () => {
      const classesFn = vi.fn((info: { props: SpinProps }) => ({
        root: info.props.size === 'small' ? 'is-small' : 'not-small',
      }))

      const wrapper = mount(Spin, {
        props: {
          classes: classesFn,
          size: 'medium',
        },
      })
      expect(wrapper.find(`.${prefixCls}`).classes()).toContain('not-small')

      await wrapper.setProps({ size: 'small' })
      expect(wrapper.find(`.${prefixCls}`).classes()).toContain('is-small')
    })
  })
})
