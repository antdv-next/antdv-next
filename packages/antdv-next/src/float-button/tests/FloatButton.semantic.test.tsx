import type { FloatButtonProps } from '../FloatButton'
import { QuestionCircleOutlined } from '@antdv-next/icons'
import { describe, expect, it, vi } from 'vitest'
import { h } from 'vue'
import FloatButton from '..'
import ConfigProvider from '../../config-provider'
import { mount } from '/@tests/utils'

describe('floatButton.Semantic', () => {
  // FloatButton semantic slots: root, icon, content (same as Button)
  it('should support classNames and styles', () => {
    const wrapper = mount(FloatButton, {
      props: {
        icon: h(QuestionCircleOutlined),
        content: 'Help',
        classes: { root: 'custom-root', icon: 'custom-icon', content: 'custom-content' },
        styles: { root: { margin: '10px' }, icon: { fontSize: '20px' }, content: { padding: '5px' } },
      },
    })

    const rootEl = wrapper.find('.ant-float-btn')
    expect(rootEl.classes()).toContain('custom-root')
    expect(rootEl.attributes('style')).toContain('margin: 10px')

    const iconEl = wrapper.find('.ant-float-btn-icon')
    expect(iconEl.classes()).toContain('custom-icon')
    expect(iconEl.attributes('style')).toContain('font-size: 20px')

    const contentEl = wrapper.find('.ant-float-btn-content')
    expect(contentEl.classes()).toContain('custom-content')
    expect(contentEl.attributes('style')).toContain('padding: 5px')
  })

  it('should support classNames and styles as functions', async () => {
    const classNamesFn = vi.fn((info: { props: FloatButtonProps }) => {
      if (info.props.type === 'primary') {
        return { root: 'primary-btn' }
      }
      return { root: 'default-btn' }
    })

    const wrapper = mount(FloatButton, {
      props: {
        type: 'primary',
        classes: classNamesFn,
      },
    })

    expect(classNamesFn).toHaveBeenCalled()
    expect(wrapper.find('.ant-float-btn').classes()).toContain('primary-btn')

    await wrapper.setProps({ type: 'default' })
    expect(wrapper.find('.ant-float-btn').classes()).toContain('default-btn')
  })

  it('should merge context and component classNames and styles', () => {
    const wrapper = mount(ConfigProvider, {
      props: {
        floatButton: {
          classes: { root: 'context-root', icon: 'context-icon' },
          styles: { root: { margin: '10px' } },
        },
      },
      slots: {
        default: () => (
          <FloatButton
            icon={h(QuestionCircleOutlined)}
            content="Help"
            classes={{ root: 'component-root' }}
            styles={{ root: { padding: '5px' } }}
          />
        ),
      },
    })

    const rootEl = wrapper.find('.ant-float-btn')
    expect(rootEl.classes()).toContain('context-root')
    expect(rootEl.classes()).toContain('component-root')
    expect(rootEl.attributes('style')).toContain('margin: 10px')
    expect(rootEl.attributes('style')).toContain('padding: 5px')

    const iconEl = wrapper.find('.ant-float-btn-icon')
    expect(iconEl.classes()).toContain('context-icon')
  })
})
