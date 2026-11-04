import type { FormProps } from '..'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import Form, { FormItem } from '..'
import ConfigProvider from '../../config-provider'
import { mount } from '/@tests/utils'

// https://github.com/ant-design/ant-design/pull/59760
vi.setConfig({ testTimeout: 30000 })

describe.each(['ltr', 'rtl'] as const)('form labelAlign in %s', (direction) => {
  let errorSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    errorSpy.mockRestore()
  })

  function getTextAlign(el: Element) {
    return getComputedStyle(el).textAlign
  }

  describe.each(['Form', 'Form.Item', 'ConfigProvider'])('%s', (source) => {
    it.each<{ labelAlign: FormProps['labelAlign'], textAlign: string }>([
      { labelAlign: undefined, textAlign: 'end' },
      { labelAlign: 'left', textAlign: 'start' },
      { labelAlign: 'right', textAlign: 'end' },
      { labelAlign: 'start', textAlign: 'start' },
      { labelAlign: 'end', textAlign: 'end' },
    ])('aligns $labelAlign labels to $textAlign', ({ labelAlign, textAlign }) => {
      const wrapper = mount(() => (
        <ConfigProvider
          direction={direction}
          form={{ labelAlign: source === 'ConfigProvider' ? labelAlign : undefined }}
        >
          <Form labelAlign={source === 'Form' ? labelAlign : undefined}>
            <FormItem label="Name" labelAlign={source === 'Form.Item' ? labelAlign : undefined}>
              <input />
            </FormItem>
          </Form>
        </ConfigProvider>
      ), { attachTo: document.body })

      const label = wrapper.find('.ant-form-item-label').element
      expect(getTextAlign(label)).toBe(textAlign)

      if (textAlign === 'start') {
        expect(label.classList.contains('ant-form-item-label-start')).toBe(true)
        expect(label.classList.contains('ant-form-item-label-left')).toBe(true)
      }
      else {
        expect(label.classList.contains('ant-form-item-label-start')).toBe(false)
        expect(label.classList.contains('ant-form-item-label-left')).toBe(false)
      }

      if (labelAlign === 'left' || labelAlign === 'right') {
        const component = source === 'Form.Item' ? 'Form.Item' : 'Form'
        expect(errorSpy).toHaveBeenCalledWith(
          `Warning: [antd: ${component}] \`labelAlign=left|right\` is deprecated. Please use \`labelAlign=start|end\` instead.`,
        )
      }
      else {
        expect(errorSpy).not.toHaveBeenCalled()
      }
      wrapper.unmount()
    })
  })

  it('supports the start and legacy left classes independently', () => {
    const wrapper = mount(() => (
      <ConfigProvider direction={direction}>
        <Form labelAlign="start">
          <FormItem label="Name">
            <input />
          </FormItem>
        </Form>
      </ConfigProvider>
    ), { attachTo: document.body })

    const label = wrapper.find('.ant-form-item-label').element
    label.classList.remove('ant-form-item-label-left')
    expect(getTextAlign(label)).toBe('start')

    label.classList.replace('ant-form-item-label-start', 'ant-form-item-label-left')
    expect(getTextAlign(label)).toBe('start')
    wrapper.unmount()
  })

  it.each(['start', 'end'] as const)(
    'prioritizes Form.Item over Form over ConfigProvider with %s alignment',
    (labelAlign) => {
      const oppositeAlign = labelAlign === 'start' ? 'end' : 'start'
      const wrapper = mount(() => (
        <ConfigProvider direction={direction} form={{ labelAlign }}>
          <Form labelAlign={oppositeAlign}>
            <FormItem label="Form alignment">
              <input />
            </FormItem>
            <FormItem label="Item alignment" labelAlign={labelAlign}>
              <input />
            </FormItem>
          </Form>
        </ConfigProvider>
      ), { attachTo: document.body })

      const labels = wrapper.findAll('.ant-form-item-label')
      expect(getTextAlign(labels[0]!.element)).toBe(oppositeAlign)
      expect(getTextAlign(labels[1]!.element)).toBe(labelAlign)
      wrapper.unmount()
    },
  )

  it('does not warn for a standalone Form.Item with default alignment', () => {
    const wrapper = mount(() => (
      <ConfigProvider direction={direction}>
        <FormItem label="Name">
          <input />
        </FormItem>
      </ConfigProvider>
    ))

    expect(errorSpy).not.toHaveBeenCalled()
    wrapper.unmount()
  })

  it('does not warn when Form overrides a deprecated global alignment', () => {
    const wrapper = mount(() => (
      <ConfigProvider direction={direction} form={{ labelAlign: 'left' }}>
        <Form labelAlign="end">
          <FormItem label="Name">
            <input />
          </FormItem>
        </Form>
      </ConfigProvider>
    ))

    expect(errorSpy).not.toHaveBeenCalled()
    wrapper.unmount()
  })
})
