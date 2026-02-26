import { afterEach, describe, expect, it, vi } from 'vitest'
import ConfigProvider from '../../config-provider'
import PurePanel from '../PurePanel'
import { mount } from '/@tests/utils'

describe('message.Semantic', () => {
  // PurePanel uses useMergeSemantic, same mechanism as useMessage hook
  // Semantic slots: root, icon, content

  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('should support classNames and styles', () => {
    const wrapper = mount(PurePanel, {
      props: {
        type: 'info',
        content: 'Semantic Test',
        classes: {
          root: 'custom-root',
          icon: 'custom-icon',
          content: 'custom-content',
        },
        styles: {
          root: { margin: '10px' },
          icon: { color: 'red' },
          content: { fontSize: '14px' },
        },
      } as any,
      attachTo: document.body,
    })

    const root = document.querySelector('.ant-message-notice')
    expect(root?.classList.contains('custom-root')).toBe(true)
    expect((root as HTMLElement)?.style.margin).toBe('10px')

    const icon = document.querySelector('.ant-message-icon')
    expect(icon?.classList.contains('custom-icon')).toBe(true)
    expect((icon as HTMLElement)?.style.color).toBe('red')

    const contentSpan = document.querySelector('.custom-content')
    expect(contentSpan).toBeTruthy()
    expect(contentSpan?.textContent).toContain('Semantic Test')
    expect((contentSpan as HTMLElement)?.style.fontSize).toBe('14px')

    wrapper.unmount()
  })

  it('should support classNames and styles as functions', () => {
    const classNamesFn = vi.fn(() => {
      return { root: 'fn-root', icon: 'fn-icon' }
    })

    const wrapper = mount(PurePanel, {
      props: {
        type: 'success',
        content: 'Fn Test',
        classes: classNamesFn,
      } as any,
      attachTo: document.body,
    })

    expect(classNamesFn).toHaveBeenCalled()

    const root = document.querySelector('.ant-message-notice')
    expect(root?.classList.contains('fn-root')).toBe(true)

    const icon = document.querySelector('.ant-message-icon')
    expect(icon?.classList.contains('fn-icon')).toBe(true)

    wrapper.unmount()
  })

  it('should merge classNames from ConfigProvider', () => {
    const wrapper = mount({
      render() {
        return (
          <ConfigProvider message={{
            class: 'provider-cls',
            classes: { root: 'provider-root', icon: 'provider-icon' },
            styles: { root: { color: 'blue' } },
          }}
          >
            <PurePanel
              type="info"
              content="Merge Test"
              classes={{ root: 'comp-root' }}
            />
          </ConfigProvider>
        )
      },
    }, { attachTo: document.body })

    const root = document.querySelector('.ant-message-notice')
    expect(root?.classList.contains('provider-root')).toBe(true)
    expect(root?.classList.contains('comp-root')).toBe(true)
    expect(root?.classList.contains('provider-cls')).toBe(true)
    expect((root as HTMLElement)?.style.color).toBe('blue')

    const icon = document.querySelector('.ant-message-icon')
    expect(icon?.classList.contains('provider-icon')).toBe(true)

    wrapper.unmount()
  })
})
