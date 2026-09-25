import type { AlertProps } from '../Alert'
import { describe, expect, it, vi } from 'vitest'
import Alert from '..'
import ConfigProvider from '../../config-provider'
import { expectSemanticRootStylePriority, semanticRootStylePriority } from '/@tests/shared/semanticStylePriority'
import { mount } from '/@tests/utils'

describe('alert.Semantic', () => {
  it('should support classNames and styles as functions', async () => {
    const classNamesFn = vi.fn((info: { props: AlertProps }) => {
      if (info.props.type === 'error') {
        return { root: 'error-alert' }
      }
      return { root: 'default-alert' }
    })

    const stylesFn = vi.fn((info: { props: AlertProps }) => {
      if (info.props.type === 'success') {
        return { root: { backgroundColor: '#f6ffed' } }
      }
      return { root: { backgroundColor: '#fff7e6' } }
    })

    const wrapper = mount(Alert, {
      props: {
        title: 'Test Alert',
        type: 'error',
        classes: classNamesFn,
        styles: stylesFn,
      },
    })

    expect(classNamesFn).toHaveBeenCalled()
    expect(stylesFn).toHaveBeenCalled()

    const rootElement = wrapper.find('.ant-alert')
    expect(rootElement.classes()).toContain('error-alert')
    // rgb(255, 247, 230) is #fff7e6
    expect(rootElement.attributes('style')).toContain('background-color: rgb(255, 247, 230)')

    await wrapper.setProps({
      type: 'success',
    })

    const updatedRootElement = wrapper.find('.ant-alert')
    expect(updatedRootElement.classes()).toContain('default-alert')
    // rgb(246, 255, 237) is #f6ffed
    expect(updatedRootElement.attributes('style')).toContain('background-color: rgb(246, 255, 237)')
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
      title: 'component-title',
    }
    const componentStyles = {
      root: { padding: '5px' },
      title: { fontWeight: 'bold' },
    }

    const wrapper = mount(ConfigProvider, {
      props: {
        alert: {
          classes: contextClassNames,
          styles: contextStyles,
        },
      },
      slots: {
        default: () => (
          <Alert
            title="Test Alert"
            showIcon={true}
            classes={componentClassNames}
            styles={componentStyles}
          />
        ),
      },
    })

    const rootElement = wrapper.find('.ant-alert')
    const iconElement = wrapper.find('.ant-alert-icon')
    const titleElement = wrapper.find('.ant-alert-title')

    // Check merged classNames
    expect(rootElement.classes()).toContain('context-root')
    expect(rootElement.classes()).toContain('component-root')
    expect(iconElement.classes()).toContain('context-icon')
    expect(titleElement.classes()).toContain('component-title')

    // Check merged styles
    const rootStyle = rootElement.attributes('style')
    expect(rootStyle).toContain('margin: 10px')
    expect(rootStyle).toContain('padding: 5px')

    const iconStyle = iconElement.attributes('style')
    expect(iconStyle).toContain('font-size: 16px')

    const titleStyle = titleElement.attributes('style')
    expect(titleStyle).toContain('font-weight: bold')
  })

  it('should apply icon and close semantic classes exactly once', () => {
    const wrapper = mount(Alert, {
      props: {
        title: 'Test Alert',
        showIcon: true,
        closable: true,
        classes: { icon: 'custom-icon', close: 'custom-close' },
        styles: { close: { color: 'red' } },
      },
    })

    expect(wrapper.find('.ant-alert-icon').attributes('class')).toBe('ant-alert-icon custom-icon')
    const closeElement = wrapper.find('.ant-alert-close-icon')
    expect(closeElement.attributes('class')).toBe('ant-alert-close-icon custom-close')
    expect(closeElement.attributes('style')).toBe('color: red;')
  })

  // https://github.com/ant-design/ant-design/pull/58474
  it('aligns root semantic style priority', () => {
    const wrapper = mount(() => (
      <ConfigProvider alert={{ style: semanticRootStylePriority.contextStyle, styles: semanticRootStylePriority.contextStyles }}>
        <Alert message="test" style={semanticRootStylePriority.style} styles={semanticRootStylePriority.styles} />
      </ConfigProvider>
    ), { attachTo: document.body })

    expectSemanticRootStylePriority(wrapper.find('.ant-alert').element)
    wrapper.unmount()
  })
})
