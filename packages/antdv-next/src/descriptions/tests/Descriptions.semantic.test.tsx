import type { DescriptionsProps } from '../index'
import { describe, expect, it, vi } from 'vitest'
import Descriptions from '..'
import ConfigProvider from '../../config-provider'
import { mount } from '/@tests/utils'

const basicItems = [
  { key: '1', label: 'Product', content: 'Cloud Database' },
  { key: '2', label: 'Billing', content: 'Prepaid' },
]

describe('descriptions.Semantic', () => {
  it('should support classes and styles as objects', () => {
    const wrapper = mount(Descriptions, {
      props: {
        items: basicItems,
        title: 'Info',
        extra: 'Edit',
        classes: {
          root: 'custom-root',
          header: 'custom-header',
          title: 'custom-title',
          extra: 'custom-extra',
        },
        styles: {
          root: { backgroundColor: 'rgb(240, 240, 240)' },
          header: { padding: '10px' },
          title: { fontWeight: 'bold' },
          extra: { color: 'red' },
        },
      },
    })

    const root = wrapper.find('.ant-descriptions')
    expect(root.classes()).toContain('custom-root')
    expect(root.attributes('style')).toContain('background-color: rgb(240, 240, 240)')

    const header = wrapper.find('.ant-descriptions-header')
    expect(header.classes()).toContain('custom-header')
    expect(header.attributes('style')).toContain('padding: 10px')

    const title = wrapper.find('.ant-descriptions-title')
    expect(title.classes()).toContain('custom-title')
    expect(title.attributes('style')).toContain('font-weight: bold')

    const extra = wrapper.find('.ant-descriptions-extra')
    expect(extra.classes()).toContain('custom-extra')
    expect(extra.attributes('style')).toContain('color: red')
  })

  it('should support label and content semantic classes from items styles', () => {
    const wrapper = mount(Descriptions, {
      props: {
        items: [{
          label: 'Name',
          content: 'Zhou',
          styles: {
            label: { color: 'blue' },
            content: { color: 'green' },
          },
        }],
      },
    })
    // In non-bordered: label/content are in spans inside container
    const labelSpan = wrapper.find('.ant-descriptions-item-label')
    const contentSpan = wrapper.find('.ant-descriptions-item-content')
    expect(labelSpan.exists()).toBe(true)
    expect(contentSpan.exists()).toBe(true)
  })

  it('should support classes and styles as functions', () => {
    const classesFn = vi.fn((info: { props: DescriptionsProps }) => {
      if (info.props.bordered) {
        return { root: 'bordered-root', header: 'bordered-header' }
      }
      return { root: 'plain-root' }
    })

    const stylesFn = vi.fn((info: { props: DescriptionsProps }) => {
      if (info.props.bordered) {
        return { root: { border: '1px solid red' } }
      }
      return { root: { border: 'none' } }
    })

    const wrapper = mount(Descriptions, {
      props: {
        title: 'Test',
        bordered: true,
        items: basicItems,
        classes: classesFn,
        styles: stylesFn,
      },
    })

    expect(classesFn).toHaveBeenCalled()
    expect(stylesFn).toHaveBeenCalled()

    const root = wrapper.find('.ant-descriptions')
    expect(root.classes()).toContain('bordered-root')
    expect(root.attributes('style')).toContain('border: 1px solid red')

    const header = wrapper.find('.ant-descriptions-header')
    expect(header.classes()).toContain('bordered-header')
  })

  it('should merge ConfigProvider and component classes and styles', () => {
    const wrapper = mount(ConfigProvider, {
      props: {
        descriptions: {
          classes: { root: 'ctx-root', title: 'ctx-title' },
          styles: { root: { margin: '10px' }, title: { fontSize: '18px' } },
        },
      },
      slots: {
        default: () => (
          <Descriptions
            title="Merged"
            items={basicItems}
            classes={{ root: 'comp-root', header: 'comp-header' }}
            styles={{ root: { padding: '5px' }, header: { backgroundColor: 'rgb(255, 255, 0)' } }}
          />
        ),
      },
    })

    const root = wrapper.find('.ant-descriptions')
    expect(root.classes()).toContain('ctx-root')
    expect(root.classes()).toContain('comp-root')
    const rootStyle = root.attributes('style') ?? ''
    expect(rootStyle).toContain('margin: 10px')
    expect(rootStyle).toContain('padding: 5px')

    const title = wrapper.find('.ant-descriptions-title')
    expect(title.classes()).toContain('ctx-title')

    const header = wrapper.find('.ant-descriptions-header')
    expect(header.classes()).toContain('comp-header')
    expect(header.attributes('style')).toContain('background-color: rgb(255, 255, 0)')
  })

  it('should propagate label/content semantic classes through context', () => {
    const wrapper = mount(Descriptions, {
      props: {
        items: basicItems,
        classes: {
          label: 'semantic-label',
          content: 'semantic-content',
        },
      },
    })
    // label/content classes propagate through DescriptionsContext to Cell
    expect(wrapper.find('.semantic-label').exists()).toBe(true)
    expect(wrapper.find('.semantic-content').exists()).toBe(true)
  })
})
