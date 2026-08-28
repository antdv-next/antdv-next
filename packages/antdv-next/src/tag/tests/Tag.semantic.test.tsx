import type { TagProps } from '..'
import { describe, expect, it, vi } from 'vitest'
import { h } from 'vue'
import Tag, { CheckableTagGroup } from '..'
import ConfigProvider from '../../config-provider'
import { mount } from '/@tests/utils'

const prefixCls = 'ant-tag'

describe('tag.semantic', () => {
  // ===================== Object form =====================

  describe('object form', () => {
    it('should apply classes and styles to root', () => {
      const wrapper = mount(Tag, {
        props: {
          classes: { root: 'c-root' },
          styles: { root: { color: 'rgb(255, 0, 0)' } },
        },
        slots: { default: () => 'Tag' },
      })
      const root = wrapper.find(`.${prefixCls}`)
      expect(root.classes()).toContain('c-root')
      expect(root.attributes('style')).toContain('color: rgb(255, 0, 0)')
    })

    it('should apply classes and styles to icon', () => {
      const wrapper = mount(Tag, {
        props: {
          icon: h('span', null, 'i'),
          classes: { icon: 'c-icon' },
          styles: { icon: { fontSize: '16px' } },
        },
        slots: { default: () => 'Tag' },
      })
      // icon is wrapped via createVNode with class/style
      const iconEl = wrapper.find('.c-icon')
      expect(iconEl.exists()).toBe(true)
    })

    it('should apply classes and styles to content', () => {
      const wrapper = mount(Tag, {
        props: {
          icon: h('span', null, 'i'),
          classes: { content: 'c-content' },
          styles: { content: { fontWeight: 'bold' } },
        },
        slots: { default: () => 'Tag' },
      })
      // content span is only rendered when icon is present
      const contentEl = wrapper.find('.c-content')
      expect(contentEl.exists()).toBe(true)
      expect(contentEl.attributes('style')).toContain('font-weight: bold')
      expect(contentEl.text()).toBe('Tag')
    })

    it('should apply all semantic classes and styles together', () => {
      const wrapper = mount(Tag, {
        props: {
          icon: h('span', null, 'i'),
          classes: { root: 'c-root', icon: 'c-icon', content: 'c-content' },
          styles: {
            root: { color: 'rgb(255, 0, 0)' },
            icon: { fontSize: '16px' },
            content: { fontWeight: 'bold' },
          },
        },
        slots: { default: () => 'Tag' },
      })
      // root
      const root = wrapper.find(`.${prefixCls}`)
      expect(root.classes()).toContain('c-root')
      expect(root.attributes('style')).toContain('color: rgb(255, 0, 0)')
      // icon
      const iconEl = wrapper.find('.c-icon')
      expect(iconEl.exists()).toBe(true)
      // content
      const contentEl = wrapper.find('.c-content')
      expect(contentEl.exists()).toBe(true)
      expect(contentEl.attributes('style')).toContain('font-weight: bold')
    })

    it('content span should not render when no icon', () => {
      const wrapper = mount(Tag, {
        props: {
          classes: { content: 'c-content' },
        },
        slots: { default: () => 'Tag' },
      })
      // Without icon, children is rendered directly without content wrapper
      expect(wrapper.find('.c-content').exists()).toBe(false)
    })

    it('icon and content semantic should not break when absent', () => {
      // no icon, no children — only root semantic applies
      const wrapper = mount(Tag, {
        props: {
          classes: { root: 'c-root', icon: 'c-icon', content: 'c-content' },
        },
      })
      expect(wrapper.find(`.${prefixCls}`).classes()).toContain('c-root')
      expect(wrapper.find('.c-icon').exists()).toBe(false)
      expect(wrapper.find('.c-content').exists()).toBe(false)
    })
  })

  // ===================== Function form =====================

  describe('function form', () => {
    it('should support classes as function', () => {
      const classesFn = vi.fn((_info: { props: TagProps }) => ({
        root: 'fn-root',
      }))

      const wrapper = mount(Tag, {
        props: {
          classes: classesFn,
        },
        slots: { default: () => 'Tag' },
      })
      expect(classesFn).toHaveBeenCalled()
      expect(wrapper.find(`.${prefixCls}`).classes()).toContain('fn-root')
    })

    it('should support styles as function', () => {
      const stylesFn = vi.fn((_info: { props: TagProps }) => ({
        root: { color: 'rgb(0, 128, 0)' },
      }))

      const wrapper = mount(Tag, {
        props: {
          styles: stylesFn,
        },
        slots: { default: () => 'Tag' },
      })
      expect(stylesFn).toHaveBeenCalled()
      expect(wrapper.find(`.${prefixCls}`).attributes('style')).toContain('color: rgb(0, 128, 0)')
    })

    it('should re-evaluate function when props change', async () => {
      const classesFn = vi.fn((info: { props: TagProps }) => ({
        root: info.props.disabled ? 'is-disabled' : 'is-enabled',
      }))

      const wrapper = mount(Tag, {
        props: {
          classes: classesFn,
          disabled: false,
        },
        slots: { default: () => 'Tag' },
      })
      expect(wrapper.find(`.${prefixCls}`).classes()).toContain('is-enabled')

      await wrapper.setProps({ disabled: true })
      expect(wrapper.find(`.${prefixCls}`).classes()).toContain('is-disabled')
    })
  })

  // ===================== ConfigProvider level =====================

  describe('configProvider classes/styles', () => {
    // tag IS in PASSED_PROPS, so ConfigProvider-level config is forwarded

    it('should apply ConfigProvider tag class', () => {
      const wrapper = mount({
        render() {
          return h(
            ConfigProvider,
            { tag: { class: 'cp-tag-class' } },
            { default: () => h(Tag, null, { default: () => 'Tag' }) },
          )
        },
      })
      expect(wrapper.find(`.${prefixCls}`).classes()).toContain('cp-tag-class')
    })

    it('should apply ConfigProvider tag style', () => {
      const wrapper = mount({
        render() {
          return h(
            ConfigProvider,
            { tag: { style: { background: 'rgb(200, 200, 200)' } } },
            { default: () => h(Tag, null, { default: () => 'Tag' }) },
          )
        },
      })
      expect(wrapper.find(`.${prefixCls}`).attributes('style')).toContain('background: rgb(200, 200, 200)')
    })

    it('should prioritize local CheckableTag style over context style', () => {
      const wrapper = mount({
        render() {
          return h(
            ConfigProvider,
            { tag: { style: { color: 'rgb(255, 0, 0)' } } },
            {
              default: () => h(
                Tag.CheckableTag,
                { checked: true, style: { color: 'rgb(0, 0, 255)' } },
                { default: () => 'Bamboo' },
              ),
            },
          )
        },
      })

      expect(wrapper.find('.ant-tag-checkable').attributes('style')).toContain('color: rgb(0, 0, 255)')
    })

    it('should prioritize group item and option styles over context style', () => {
      const wrapper = mount({
        render() {
          return h(
            ConfigProvider,
            { tag: { style: { color: 'rgb(255, 0, 0)' } } },
            {
              default: () => h(CheckableTagGroup, {
                styles: { item: { color: 'rgb(0, 128, 0)' } },
                options: [
                  { label: 'Bamboo', value: 'bamboo' },
                  { label: 'Little', value: 'little', style: { color: 'rgb(0, 0, 255)' } },
                ],
              }),
            },
          )
        },
      })

      const items = wrapper.findAll('.ant-tag-checkable')
      expect(items[0]!.attributes('style')).toContain('color: rgb(0, 128, 0)')
      expect(items[1]!.attributes('style')).toContain('color: rgb(0, 0, 255)')
    })

    it('should apply ConfigProvider tag variant', () => {
      const wrapper = mount({
        render() {
          return h(
            ConfigProvider,
            { tag: { variant: 'solid' } },
            { default: () => h(Tag, null, { default: () => 'Tag' }) },
          )
        },
      })
      expect(wrapper.find(`.${prefixCls}`).classes()).toContain(`${prefixCls}-solid`)
    })
  })
})
