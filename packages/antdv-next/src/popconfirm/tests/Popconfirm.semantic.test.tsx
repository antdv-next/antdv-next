import type { PopconfirmProps } from '..'
import { describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import Popconfirm from '..'
import ConfigProvider from '../../config-provider'
import { mount } from '/@tests/utils'

describe('popconfirm.Semantic', () => {
  it('should support classNames and styles', async () => {
    const wrapper = mount(Popconfirm, {
      props: {
        title: 'Sure?',
        description: 'Details',
        classes: {
          root: 'custom-root',
          title: 'custom-title',
          content: 'custom-content',
        },
        styles: {
          root: { margin: '10px' },
          title: { color: 'red' },
          content: { color: 'blue' },
        },
      },
      slots: {
        default: () => <button>Del</button>,
      },
      attachTo: document.body,
    })

    await wrapper.find('button').trigger('click')
    await nextTick()
    await nextTick()

    const root = document.querySelector('.ant-popconfirm')
    expect(root?.classList.contains('custom-root')).toBe(true)

    const title = document.querySelector('.ant-popconfirm-title')
    expect(title?.classList.contains('custom-title')).toBe(true)
    expect((title as HTMLElement)?.style.color).toBe('red')

    const content = document.querySelector('.ant-popconfirm-description')
    expect(content?.classList.contains('custom-content')).toBe(true)
    expect((content as HTMLElement)?.style.color).toBe('blue')

    wrapper.unmount()
  })

  it('should support classNames and styles as functions', async () => {
    const classNamesFn = vi.fn((_info: { props: PopconfirmProps }) => {
      return { root: 'fn-root', title: 'fn-title' }
    })

    const wrapper = mount(Popconfirm, {
      props: {
        title: 'Sure?',
        classes: classNamesFn,
      },
      slots: {
        default: () => <button>Del</button>,
      },
      attachTo: document.body,
    })

    await wrapper.find('button').trigger('click')
    await nextTick()
    await nextTick()

    expect(classNamesFn).toHaveBeenCalled()

    const root = document.querySelector('.ant-popconfirm')
    expect(root?.classList.contains('fn-root')).toBe(true)

    const title = document.querySelector('.ant-popconfirm-title')
    expect(title?.classList.contains('fn-title')).toBe(true)

    wrapper.unmount()
  })

  it('should merge classNames from ConfigProvider', async () => {
    const wrapper = mount({
      render() {
        return (
          <ConfigProvider popconfirm={{
            class: 'provider-cls',
            classes: { root: 'provider-root', title: 'provider-title' },
            styles: { root: { color: 'red' } },
          }}
          >
            <Popconfirm
              title="Sure?"
              classes={{ root: 'comp-root' }}
            >
              <button>Del</button>
            </Popconfirm>
          </ConfigProvider>
        )
      },
    }, { attachTo: document.body })

    await wrapper.find('button').trigger('click')
    await nextTick()
    await nextTick()

    const root = document.querySelector('.ant-popconfirm')
    expect(root?.classList.contains('provider-root')).toBe(true)
    expect(root?.classList.contains('comp-root')).toBe(true)
    expect(root?.classList.contains('provider-cls')).toBe(true)

    const title = document.querySelector('.ant-popconfirm-title')
    expect(title?.classList.contains('provider-title')).toBe(true)

    wrapper.unmount()
  })
})
