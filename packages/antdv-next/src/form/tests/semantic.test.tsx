import type { FormProps } from '..'
import { describe, expect, it, vi } from 'vitest'
import Form, { FormItem } from '..'
import { mount } from '/@tests/utils'

describe('form.Semantic', () => {
  it('should support semantic classes and styles for root/label/content', () => {
    const wrapper = mount(Form, {
      props: {
        classes: {
          root: 'form-root-custom',
          label: 'form-label-custom',
          content: 'form-content-custom',
        },
        styles: {
          root: { borderWidth: '2px', borderStyle: 'solid' },
          label: { color: 'rgb(255, 0, 0)' },
          content: { backgroundColor: 'rgb(240, 248, 255)' },
        },
      },
      slots: {
        default: () => (
          <FormItem label="Username">
            <input />
          </FormItem>
        ),
      },
      attachTo: document.body,
    })

    const form = wrapper.find('form.ant-form')
    expect(form.classes()).toContain('form-root-custom')
    expect((form.element as HTMLElement).style.borderWidth).toBe('2px')

    const label = wrapper.find('.ant-form-item-label > label')
    expect(label.classes()).toContain('form-label-custom')
    expect((label.element as HTMLElement).style.color).toBe('rgb(255, 0, 0)')

    const content = wrapper.find('.ant-form-item-control-input-content')
    expect(content.classes()).toContain('form-content-custom')
    expect((content.element as HTMLElement).style.backgroundColor).toBe('rgb(240, 248, 255)')

    wrapper.unmount()
  })

  it('should support function-based semantic classes and styles', async () => {
    const classesFn = vi.fn((info: { props: FormProps }) => ({
      root: info.props.layout === 'vertical' ? 'layout-vertical' : 'layout-horizontal',
      label: 'label-fn',
      content: 'content-fn',
    }))
    const stylesFn = vi.fn((info: { props: FormProps }) => ({
      root: { paddingTop: info.props.layout === 'vertical' ? '8px' : '4px' },
      label: { fontWeight: 700 },
      content: { minHeight: '20px' },
    }))

    const wrapper = mount(Form, {
      props: {
        layout: 'horizontal',
        classes: classesFn as any,
        styles: stylesFn as any,
      },
      slots: {
        default: () => (
          <FormItem label="Field">
            <input />
          </FormItem>
        ),
      },
      attachTo: document.body,
    })

    expect(classesFn).toHaveBeenCalled()
    expect(stylesFn).toHaveBeenCalled()
    expect(wrapper.find('form').classes()).toContain('layout-horizontal')
    expect((wrapper.find('form').element as HTMLElement).style.paddingTop).toBe('4px')

    await wrapper.setProps({ layout: 'vertical' })

    expect(wrapper.find('form').classes()).toContain('layout-vertical')
    expect((wrapper.find('form').element as HTMLElement).style.paddingTop).toBe('8px')
    expect(wrapper.find('.ant-form-item-label > label').classes()).toContain('label-fn')
    expect(wrapper.find('.ant-form-item-control-input-content').classes()).toContain('content-fn')

    wrapper.unmount()
  })
})
