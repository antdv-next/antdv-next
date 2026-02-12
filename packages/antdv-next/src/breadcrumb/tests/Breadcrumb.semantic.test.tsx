import type { BreadcrumbProps } from '..'
import { describe, expect, it, vi } from 'vitest'
import Breadcrumb from '..'
import { mount } from '../../../../../tests/utils'

describe('breadcrumb.Semantic', () => {
  it('should support classNames and styles', () => {
    const wrapper = mount(Breadcrumb, {
      props: {
        items: [
          { title: 'Home' },
          { title: 'Current' },
        ],
        classes: { root: 'custom-root', item: 'custom-item', separator: 'custom-separator' },
        styles: { root: { margin: '10px' }, item: { padding: '5px' }, separator: { color: 'red' } },
      },
    })

    const rootElement = wrapper.find('.ant-breadcrumb')
    expect(rootElement.classes()).toContain('custom-root')
    expect(rootElement.attributes('style')).toContain('margin: 10px')

    const itemElement = wrapper.find('.ant-breadcrumb-item')
    expect(itemElement.classes()).toContain('custom-item')
    expect(itemElement.attributes('style')).toContain('padding: 5px')

    const separatorElement = wrapper.find('.ant-breadcrumb-separator')
    expect(separatorElement.classes()).toContain('custom-separator')
    expect(separatorElement.attributes('style')).toContain('color: red')
  })

  it('should support classNames and styles as functions', async () => {
    const classNamesFn = vi.fn((info: { props: BreadcrumbProps }) => {
      if (info.props.separator === '>') {
        return { root: 'arrow-breadcrumb', separator: 'arrow-separator' }
      }
      return { root: 'default-breadcrumb', separator: 'default-separator' }
    })

    const stylesFn = vi.fn((info: { props: BreadcrumbProps }) => {
      if (info.props.separator === '>') {
        return { root: { backgroundColor: '#f0f0f0' } }
      }
      return { root: { backgroundColor: '#ffffff' } }
    })

    const wrapper = mount(Breadcrumb, {
      props: {
        items: [
          { title: 'Home' },
          { title: 'Current' },
        ],
        separator: '>',
        classes: classNamesFn,
        styles: stylesFn,
      },
    })

    expect(classNamesFn).toHaveBeenCalled()
    expect(stylesFn).toHaveBeenCalled()

    const rootElement = wrapper.find('.ant-breadcrumb')
    expect(rootElement.classes()).toContain('arrow-breadcrumb')

    const separatorElement = wrapper.find('.ant-breadcrumb-separator')
    expect(separatorElement.classes()).toContain('arrow-separator')

    await wrapper.setProps({ separator: '/' })

    const updatedRootElement = wrapper.find('.ant-breadcrumb')
    expect(updatedRootElement.classes()).toContain('default-breadcrumb')

    const updatedSeparatorElement = wrapper.find('.ant-breadcrumb-separator')
    expect(updatedSeparatorElement.classes()).toContain('default-separator')
  })
})
