import type { SegmentedProps } from '..'
import { describe, expect, it, vi } from 'vitest'
import { h } from 'vue'
import Segmented from '..'
import { mount } from '/@tests/utils'

const prefixCls = 'ant-segmented'

const iconOptions = [
  { value: 'A', label: 'A', icon: h('span', 'ic-a') },
  { value: 'B', label: 'B', icon: h('span', 'ic-b') },
]

const basicOptions = ['A', 'B', 'C']

describe('segmented.semantic', () => {
  // ===================== Object form =====================

  describe('object form', () => {
    it('should apply classes and styles to root', () => {
      const wrapper = mount(Segmented, {
        props: {
          options: basicOptions,
          classes: { root: 'c-root' },
          styles: { root: { color: 'rgb(255, 0, 0)' } },
        },
      })
      const root = wrapper.find(`.${prefixCls}`)
      expect(root.classes()).toContain('c-root')
      expect(root.attributes('style')).toContain('color: rgb(255, 0, 0)')
    })

    it('should apply classes and styles to icon element', () => {
      const wrapper = mount(Segmented, {
        props: {
          options: iconOptions,
          classes: { icon: 'c-icon' },
          styles: { icon: { fontSize: '20px' } },
        },
      })
      const icons = wrapper.findAll(`.${prefixCls}-item-icon`)
      expect(icons.length).toBeGreaterThan(0)
      icons.forEach((icon) => {
        expect(icon.classes()).toContain('c-icon')
        expect(icon.attributes('style')).toContain('font-size: 20px')
      })
    })

    it('should pass item and label semantic classNames/styles to VcSegmented', () => {
      const wrapper = mount(Segmented, {
        props: {
          options: basicOptions,
          classes: { item: 'c-item', label: 'c-label' },
          styles: { item: { padding: '4px' }, label: { fontWeight: 'bold' } },
        },
      })
      // item/label classNames and styles are passed through to VcSegmented's classNames/styles
      // they should appear in the rendered DOM
      const items = wrapper.findAll(`.${prefixCls}-item`)
      expect(items.length).toBeGreaterThan(0)
      items.forEach((item) => {
        expect(item.classes()).toContain('c-item')
        expect(item.attributes('style')).toContain('padding: 4px')
      })
      const labels = wrapper.findAll(`.${prefixCls}-item-label`)
      expect(labels.length).toBeGreaterThan(0)
      labels.forEach((label) => {
        expect(label.classes()).toContain('c-label')
        expect(label.attributes('style')).toContain('font-weight: bold')
      })
    })
  })

  // ===================== Function form =====================

  describe('function form', () => {
    it('should support classes as function', () => {
      const classesFn = vi.fn((_info: { props: SegmentedProps }) => ({
        root: 'fn-root',
      }))

      const wrapper = mount(Segmented, {
        props: {
          options: basicOptions,
          classes: classesFn,
        },
      })
      expect(classesFn).toHaveBeenCalled()
      expect(wrapper.find(`.${prefixCls}`).classes()).toContain('fn-root')
    })

    it('should support styles as function', () => {
      const stylesFn = vi.fn((_info: { props: SegmentedProps }) => ({
        root: { color: 'rgb(0, 128, 0)' },
      }))

      const wrapper = mount(Segmented, {
        props: {
          options: basicOptions,
          styles: stylesFn,
        },
      })
      expect(stylesFn).toHaveBeenCalled()
      expect(wrapper.find(`.${prefixCls}`).attributes('style')).toContain('color: rgb(0, 128, 0)')
    })

    it('should re-evaluate function when props change', async () => {
      const classesFn = vi.fn((info: { props: SegmentedProps }) => ({
        root: info.props.block ? 'is-block' : 'not-block',
      }))

      const wrapper = mount(Segmented, {
        props: {
          options: basicOptions,
          classes: classesFn,
          block: false,
        },
      })
      expect(wrapper.find(`.${prefixCls}`).classes()).toContain('not-block')

      await wrapper.setProps({ block: true })
      expect(wrapper.find(`.${prefixCls}`).classes()).toContain('is-block')
    })
  })

  // Note: segmented is NOT in ConfigProvider PASSED_PROPS,
  // so ConfigProvider-level classes/styles are not forwarded

  // ===================== Absent elements =====================

  describe('absent semantic elements', () => {
    it('icon semantic should not appear when options have no icons', () => {
      const wrapper = mount(Segmented, {
        props: {
          options: basicOptions,
          classes: { icon: 'c-icon' },
        },
      })
      expect(wrapper.find(`.${prefixCls}-item-icon`).exists()).toBe(false)
    })
  })
})
