import type { FloatButtonGroupProps } from '../FloatButtonGroup'
import { QuestionCircleOutlined } from '@antdv-next/icons'
import { describe, expect, it, vi } from 'vitest'
import { h } from 'vue'
import FloatButton, { FloatButtonGroup } from '..'
import ConfigProvider from '../../config-provider'
import { mount } from '/@tests/utils'

describe('floatButtonGroup.Semantic', () => {
  // FloatButtonGroup semantic slots:
  // root, list, item, itemIcon, itemContent, trigger, triggerIcon, triggerContent

  it('should support classNames and styles for root and list', () => {
    const wrapper = mount(FloatButtonGroup, {
      props: {
        classes: { root: 'custom-root', list: 'custom-list' },
        styles: { root: { margin: '10px' }, list: { padding: '5px' } },
      },
      slots: {
        default: () => h(FloatButton),
      },
    })

    const rootEl = wrapper.find('.ant-float-btn-group')
    expect(rootEl.classes()).toContain('custom-root')
    expect(rootEl.attributes('style')).toContain('margin: 10px')

    const listEl = wrapper.find('.ant-float-btn-group-list')
    expect(listEl.classes()).toContain('custom-list')
    expect(listEl.attributes('style')).toContain('padding: 5px')
  })

  it('should pass item classNames to children via context', () => {
    const wrapper = mount(FloatButtonGroup, {
      props: {
        classes: {
          item: 'custom-item',
          itemIcon: 'custom-item-icon',
          itemContent: 'custom-item-content',
        },
        styles: {
          item: { margin: '2px' },
          itemIcon: { fontSize: '20px' },
          itemContent: { padding: '3px' },
        },
      },
      slots: {
        default: () => h(FloatButton, { icon: h(QuestionCircleOutlined), content: 'Help' }),
      },
    })

    // item classNames are passed via context to child FloatButton's root
    const btn = wrapper.find('.ant-float-btn')
    expect(btn.classes()).toContain('custom-item')
    expect(btn.attributes('style')).toContain('margin: 2px')

    const icon = wrapper.find('.ant-float-btn-icon')
    expect(icon.classes()).toContain('custom-item-icon')
    expect(icon.attributes('style')).toContain('font-size: 20px')

    const content = wrapper.find('.ant-float-btn-content')
    expect(content.classes()).toContain('custom-item-content')
    expect(content.attributes('style')).toContain('padding: 3px')
  })

  it('should support trigger classNames and styles', () => {
    const wrapper = mount(FloatButtonGroup, {
      props: {
        trigger: 'click',
        classes: { trigger: 'custom-trigger' },
        styles: { trigger: { backgroundColor: 'red' } },
      },
      slots: {
        default: () => h(FloatButton),
      },
    })

    // rootClass is applied to the same element as ant-float-btn
    const triggerEl = wrapper.find('.ant-float-btn-group-trigger')
    expect(triggerEl.exists()).toBe(true)
    expect(triggerEl.classes()).toContain('custom-trigger')
  })

  it('should support triggerIcon and triggerContent classNames', () => {
    const wrapper = mount(FloatButtonGroup, {
      props: {
        trigger: 'click',
        icon: h(QuestionCircleOutlined),
        content: 'Menu',
        classes: {
          triggerIcon: 'custom-trigger-icon',
          triggerContent: 'custom-trigger-content',
        },
        styles: {
          triggerIcon: { fontSize: '24px' },
          triggerContent: { color: 'blue' },
        },
      },
      slots: {
        default: () => h(FloatButton),
      },
    })

    const triggerEl = wrapper.find('.ant-float-btn-group-trigger')
    const triggerIcon = triggerEl.find('.ant-float-btn-icon')
    expect(triggerIcon.classes()).toContain('custom-trigger-icon')
    expect(triggerIcon.attributes('style')).toContain('font-size: 24px')

    const triggerContent = triggerEl.find('.ant-float-btn-content')
    expect(triggerContent.classes()).toContain('custom-trigger-content')
    expect(triggerContent.attributes('style')).toContain('color: blue')
  })

  it('should support classNames and styles as functions', async () => {
    const classNamesFn = vi.fn((info: { props: FloatButtonGroupProps }) => {
      if (info.props.shape === 'circle') {
        return { root: 'circle-group' }
      }
      return { root: 'square-group' }
    })

    const wrapper = mount(FloatButtonGroup, {
      props: {
        shape: 'circle',
        classes: classNamesFn,
      },
      slots: {
        default: () => h(FloatButton),
      },
    })

    expect(classNamesFn).toHaveBeenCalled()
    expect(wrapper.find('.ant-float-btn-group').classes()).toContain('circle-group')

    await wrapper.setProps({ shape: 'square' })
    expect(wrapper.find('.ant-float-btn-group').classes()).toContain('square-group')
  })

  it('should merge context and component classNames and styles', () => {
    const wrapper = mount(ConfigProvider, {
      props: {
        floatButtonGroup: {
          classes: { root: 'context-root', list: 'context-list' },
          styles: { root: { margin: '10px' } },
        },
      },
      slots: {
        default: () => (
          <FloatButtonGroup
            classes={{ root: 'component-root' }}
            styles={{ root: { padding: '5px' } }}
          >
            <FloatButton />
          </FloatButtonGroup>
        ),
      },
    })

    const rootEl = wrapper.find('.ant-float-btn-group')
    expect(rootEl.classes()).toContain('context-root')
    expect(rootEl.classes()).toContain('component-root')
    expect(rootEl.attributes('style')).toContain('margin: 10px')
    expect(rootEl.attributes('style')).toContain('padding: 5px')

    const listEl = wrapper.find('.ant-float-btn-group-list')
    expect(listEl.classes()).toContain('context-list')
  })
})
