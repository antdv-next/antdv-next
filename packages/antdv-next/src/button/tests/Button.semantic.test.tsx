import type { BaseButtonProps } from '..'
import { SearchOutlined } from '@antdv-next/icons'
import { describe, expect, it, vi } from 'vitest'
import { h } from 'vue'
import Button from '..'
import { mount } from '../../../../../tests/utils'
import ConfigProvider from '../../config-provider'

describe('button.Semantic', () => {
  it('should support classNames and styles', () => {
    const wrapper = mount(Button, {
      props: {
        icon: h(SearchOutlined),
        classes: { root: 'custom-root', icon: 'custom-icon', content: 'custom-content' },
        styles: { root: { margin: '10px' }, icon: { fontSize: '20px' }, content: { padding: '5px' } },
      },
      slots: {
        default: () => 'Test',
      },
    })

    const rootElement = wrapper.find('.ant-btn')
    expect(rootElement.classes()).toContain('custom-root')
    expect(rootElement.attributes('style')).toContain('margin: 10px')

    const iconElement = wrapper.find('.ant-btn-icon')
    expect(iconElement.classes()).toContain('custom-icon')
    expect(iconElement.attributes('style')).toContain('font-size: 20px')
  })

  it('should support classNames and styles as functions', async () => {
    const classNamesFn = vi.fn((info: { props: BaseButtonProps }) => {
      if (info.props.type === 'primary') {
        return { root: 'primary-button' }
      }
      return { root: 'default-button' }
    })

    const stylesFn = vi.fn((info: { props: BaseButtonProps }) => {
      if (info.props.type === 'primary') {
        return { root: { backgroundColor: '#1890ff' } }
      }
      return { root: { backgroundColor: '#ffffff' } }
    })

    const wrapper = mount(Button, {
      props: {
        type: 'primary',
        classes: classNamesFn,
        styles: stylesFn,
      },
      slots: {
        default: () => 'Test',
      },
    })

    expect(classNamesFn).toHaveBeenCalled()
    expect(stylesFn).toHaveBeenCalled()

    const rootElement = wrapper.find('.ant-btn')
    expect(rootElement.classes()).toContain('primary-button')

    await wrapper.setProps({ type: 'default' })

    const updatedRootElement = wrapper.find('.ant-btn')
    expect(updatedRootElement.classes()).toContain('default-button')
  })

  it('should merge context and component classNames and styles', () => {
    const contextClassNames = {
      root: 'context-root',
      icon: 'context-icon',
    }
    const contextStyles = {
      root: { margin: '10px' },
      icon: { fontSize: '16px' },
    }
    const componentClassNames = {
      root: 'component-root',
      content: 'component-content',
    }
    const componentStyles = {
      root: { padding: '5px' },
    }

    const wrapper = mount(ConfigProvider, {
      props: {
        button: {
          classes: contextClassNames,
          styles: contextStyles,
        },
      },
      slots: {
        default: () => (
          <Button
            icon={h(SearchOutlined)}
            classes={componentClassNames}
            styles={componentStyles}
          >
            Test
          </Button>
        ),
      },
    })

    const rootElement = wrapper.find('.ant-btn')
    const iconElement = wrapper.find('.ant-btn-icon')

    expect(rootElement.classes()).toContain('context-root')
    expect(rootElement.classes()).toContain('component-root')

    const rootStyle = rootElement.attributes('style')
    expect(rootStyle).toContain('margin: 10px')
    expect(rootStyle).toContain('padding: 5px')

    expect(iconElement.classes()).toContain('context-icon')
    const iconStyle = iconElement.attributes('style')
    expect(iconStyle).toContain('font-size: 16px')
  })
})
