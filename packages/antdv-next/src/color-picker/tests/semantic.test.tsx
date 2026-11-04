import type { ColorPickerProps } from '..'
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick, ref } from 'vue'
import ColorPicker from '..'
import ConfigProvider from '../../config-provider'
import { mount, waitFakeTimer } from '/@tests/utils'

async function flushColorPickerTimer() {
  await waitFakeTimer(150, 10)
  await nextTick()
}

describe('color-picker semantic', () => {
  let originOffsetParentDescriptor: PropertyDescriptor | undefined

  beforeAll(() => {
    originOffsetParentDescriptor = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetParent')
    Object.defineProperty(HTMLElement.prototype, 'offsetParent', {
      configurable: true,
      get: () => document.body,
    })
  })

  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.clearAllTimers()
    vi.useRealTimers()
    document.body.innerHTML = ''
  })

  afterAll(() => {
    if (originOffsetParentDescriptor) {
      Object.defineProperty(HTMLElement.prototype, 'offsetParent', originOffsetParentDescriptor)
    }
  })

  it('supports object-form classes and styles for root/popup/body/content/description', async () => {
    mount(ColorPicker, {
      attachTo: document.body,
      props: {
        defaultValue: '#1677ff',
        open: true,
        showText: true,
        classes: {
          root: 'test-root',
          body: 'test-body',
          content: 'test-content',
          description: 'test-description',
          popup: {
            root: 'test-popup',
          },
        },
        styles: {
          root: { color: 'rgb(255, 0, 0)' },
          body: { outline: '1px solid rgb(0, 0, 255)' },
          content: { border: '1px solid rgb(0, 128, 0)' },
          popup: {
            root: { padding: '8px' },
          },
        },
      },
    })
    await flushColorPickerTimer()

    const root = document.querySelector<HTMLElement>('.ant-color-picker-trigger')
    const body = document.querySelector<HTMLElement>('.ant-color-picker-color-block')
    const content = document.querySelector<HTMLElement>('.ant-color-picker-color-block-inner')
    const description = document.querySelector<HTMLElement>('.ant-color-picker-trigger-text')
    const popup = document.querySelector<HTMLElement>('.ant-color-picker')

    expect(root).toHaveClass('test-root')
    expect(body).toHaveClass('test-body')
    expect(content).toHaveClass('test-content')
    expect(description).toHaveClass('test-description')
    expect(popup).toHaveClass('test-popup')

    expect(root?.style.color).toBe('rgb(255, 0, 0)')
    expect(body?.getAttribute('style')).toContain('outline: 1px solid rgb(0, 0, 255)')
    expect(content?.getAttribute('style')).toContain('border: 1px solid rgb(0, 128, 0)')
  })

  it('supports function-form classes and styles', async () => {
    const classesFn: ColorPickerProps['classes'] = vi.fn((info) => {
      if (info.props.disabled) {
        return { root: 'fn-disabled' }
      }
      return { root: 'fn-enabled' }
    })
    const stylesFn: ColorPickerProps['styles'] = vi.fn((info) => {
      if (info.props.size === 'large') {
        return { root: { fontSize: '16px' } }
      }
      return { root: { fontSize: '14px' } }
    })

    const wrapper = mount(ColorPicker, {
      attachTo: document.body,
      props: {
        defaultValue: '#1677ff',
        classes: classesFn,
        styles: stylesFn,
      },
    })
    await flushColorPickerTimer()

    const root = wrapper.find('.ant-color-picker-trigger')
    expect(classesFn).toHaveBeenCalled()
    expect(stylesFn).toHaveBeenCalled()
    expect(root.classes()).toContain('fn-enabled')
    expect(root.element.getAttribute('style')).toContain('font-size: 14px')

    await wrapper.setProps({ disabled: true })
    await nextTick()
    expect(wrapper.find('.ant-color-picker-trigger').classes()).toContain('fn-disabled')

    await wrapper.setProps({ disabled: false, size: 'large' })
    await nextTick()
    expect(wrapper.find('.ant-color-picker-trigger').element.getAttribute('style')).toContain(
      'font-size: 16px',
    )
  })

  it('merges ConfigProvider semantic classes/styles with component props', async () => {
    mount({
      render() {
        return (
          <ConfigProvider
            colorPicker={{
              classes: {
                root: 'cp-root',
                popup: { root: 'cp-popup' },
              } as any,
              styles: {
                root: { marginTop: '2px' },
              } as any,
            }}
          >
            <ColorPicker
              defaultValue="#1677ff"
              open
              classes={{ root: 'comp-root' }}
              styles={{ root: { marginBottom: '3px' } }}
            />
          </ConfigProvider>
        )
      },
    }, { attachTo: document.body })
    await flushColorPickerTimer()

    const root = document.querySelector<HTMLElement>('.ant-color-picker-trigger')
    const popup = document.querySelector<HTMLElement>('.ant-color-picker')

    expect(root).toHaveClass('cp-root')
    expect(root).toHaveClass('comp-root')
    expect(popup).toHaveClass('cp-popup')
    expect(root?.getAttribute('style')).toContain('margin-top: 2px')
    expect(root?.getAttribute('style')).toContain('margin-bottom: 3px')
  })

  it.each([false, true])('supports popup.container with function = %s', async (asFunction) => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const contextClassNames = { popup: { container: 'context-container' } }
    const contextStyles = { popup: { container: { width: '400px' } } }
    const classNames = { popup: { container: 'custom-container' } }
    const styles = { popup: { container: { width: '480px' } } }
    const contextConfig = {
      classes: asFunction ? () => contextClassNames : contextClassNames,
      styles: asFunction ? () => contextStyles : contextStyles,
    }
    const withProps = ref(false)
    mount({
      render() {
        return (
          <ConfigProvider colorPicker={contextConfig as any}>
            <ColorPicker
              open
              classes={withProps.value ? (asFunction ? () => classNames : classNames) : undefined}
              styles={withProps.value ? (asFunction ? () => styles : styles) : undefined}
            />
          </ConfigProvider>
        )
      },
    }, { attachTo: document.body })
    await flushColorPickerTimer()

    const popupContainer = document.querySelector<HTMLElement>('.ant-popover-container')
    expect(popupContainer).toHaveClass('context-container')
    expect(popupContainer?.style.width).toBe('400px')

    withProps.value = true
    await flushColorPickerTimer()

    expect(popupContainer).toHaveClass('context-container')
    expect(popupContainer).toHaveClass('custom-container')
    expect(popupContainer?.style.width).toBe('480px')
    expect(errorSpy).not.toHaveBeenCalled()
    errorSpy.mockRestore()
  })

  // https://github.com/ant-design/ant-design/issues/59738
  it.each([
    ['styles object', false, false],
    ['styles function', true, false],
    ['ConfigProvider styles object', false, true],
    ['ConfigProvider styles function', true, true],
  ])('supports deprecated popupOverlayInner from %s', async (_, asFunction, fromContext) => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const legacyStyles = { popupOverlayInner: { width: '480px' } }
    const styles: ColorPickerProps['styles'] = asFunction ? () => legacyStyles : legacyStyles
    mount({
      render() {
        return fromContext
          ? (
              <ConfigProvider colorPicker={{ styles } as any}>
                <ColorPicker open />
              </ConfigProvider>
            )
          : <ColorPicker open styles={styles} />
      },
    }, { attachTo: document.body })
    await flushColorPickerTimer()

    expect(document.querySelector<HTMLElement>('.ant-popover-container')?.style.width).toBe('480px')
    expect(errorSpy).toHaveBeenCalledWith(
      'Warning: [antd: ColorPicker] `styles.popupOverlayInner` is deprecated. Please use `styles.popup.container` instead.',
    )
    errorSpy.mockRestore()
  })

  it('prefers popup.container while preserving other popupOverlayInner styles', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    mount(ColorPicker, {
      attachTo: document.body,
      props: {
        open: true,
        styles: {
          popupOverlayInner: { width: '400px', padding: '20px' },
          popup: { container: { width: '480px' } },
        },
      },
    })
    await flushColorPickerTimer()

    const popupContainer = document.querySelector<HTMLElement>('.ant-popover-container')
    expect(popupContainer?.style.width).toBe('480px')
    expect(popupContainer?.style.padding).toBe('20px')
    errorSpy.mockRestore()
  })
})
