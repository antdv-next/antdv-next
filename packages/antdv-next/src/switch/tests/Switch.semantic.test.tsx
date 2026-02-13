import type { SwitchProps } from '..'
import { describe, expect, it, vi } from 'vitest'
import Switch from '..'
import { mount } from '/@tests/utils'

const prefixCls = 'ant-switch'

describe('switch.semantic', () => {
  // ===================== Object form =====================

  describe('object form', () => {
    it('should apply classes and styles to root', () => {
      const wrapper = mount(Switch, {
        props: {
          classes: { root: 'c-root' },
          styles: { root: { color: 'rgb(255, 0, 0)' } },
        },
      })
      const root = wrapper.find('button')
      expect(root.classes()).toContain('c-root')
      expect(root.attributes('style')).toContain('color: rgb(255, 0, 0)')
    })

    it('should apply classes and styles to content', () => {
      const wrapper = mount(Switch, {
        props: {
          checkedChildren: 'on',
          unCheckedChildren: 'off',
          classes: { content: 'c-content' },
          styles: { content: { fontSize: '16px' } },
        },
      })
      const checkedEl = wrapper.find(`.${prefixCls}-inner-checked`)
      expect(checkedEl.classes()).toContain('c-content')
      expect(checkedEl.attributes('style')).toContain('font-size: 16px')

      const uncheckedEl = wrapper.find(`.${prefixCls}-inner-unchecked`)
      expect(uncheckedEl.classes()).toContain('c-content')
      expect(uncheckedEl.attributes('style')).toContain('font-size: 16px')
    })

    it('should apply classes and styles to indicator (handle)', () => {
      const wrapper = mount(Switch, {
        props: {
          classes: { indicator: 'c-indicator' },
          styles: { indicator: { background: 'rgb(0, 128, 0)' } },
        },
      })
      const handle = wrapper.find(`.${prefixCls}-handle`)
      expect(handle.classes()).toContain('c-indicator')
      expect(handle.attributes('style')).toContain('background: rgb(0, 128, 0)')
    })
  })

  // ===================== Function form =====================

  describe('function form', () => {
    it('should support classes as function', () => {
      const classesFn = vi.fn((_info: { props: SwitchProps }) => ({
        root: 'fn-root',
      }))

      const wrapper = mount(Switch, {
        props: {
          classes: classesFn,
        },
      })
      expect(classesFn).toHaveBeenCalled()
      expect(wrapper.find('button').classes()).toContain('fn-root')
    })

    it('should support styles as function', () => {
      const stylesFn = vi.fn((_info: { props: SwitchProps }) => ({
        root: { color: 'rgb(0, 128, 0)' },
      }))

      const wrapper = mount(Switch, {
        props: {
          styles: stylesFn,
        },
      })
      expect(stylesFn).toHaveBeenCalled()
      expect(wrapper.find('button').attributes('style')).toContain('color: rgb(0, 128, 0)')
    })

    it('should re-evaluate function when props change', async () => {
      const classesFn = vi.fn((info: { props: SwitchProps }) => ({
        root: info.props.loading ? 'is-loading' : 'not-loading',
      }))

      const wrapper = mount(Switch, {
        props: {
          classes: classesFn,
          loading: false,
        },
      })
      expect(wrapper.find('button').classes()).toContain('not-loading')

      await wrapper.setProps({ loading: true })
      expect(wrapper.find('button').classes()).toContain('is-loading')
    })
  })

  // Note: switch is NOT in ConfigProvider PASSED_PROPS,
  // so ConfigProvider-level classes/styles are not forwarded

  // ===================== Indicator always present =====================

  describe('indicator element presence', () => {
    it('indicator handle is always rendered regardless of loading', () => {
      const wrapper = mount(Switch, {
        props: {
          classes: { indicator: 'c-indicator' },
        },
      })
      const handle = wrapper.find(`.${prefixCls}-handle`)
      expect(handle.exists()).toBe(true)
      expect(handle.classes()).toContain('c-indicator')
    })
  })
})
