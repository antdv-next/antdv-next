import { describe, expect, it } from 'vitest'
import Form, { FormItem } from '..'
import ConfigProvider from '../../config-provider'
import { mount } from '/@tests/utils'

// https://github.com/ant-design/ant-design/pull/58035
describe('form labelWrap via ConfigProvider', () => {
  it('applies labelWrap from ConfigProvider.form', () => {
    const wrapper = mount(() => (
      <ConfigProvider form={{ labelWrap: true }}>
        <Form>
          <FormItem label="Label">
            <input />
          </FormItem>
        </Form>
      </ConfigProvider>
    ))

    expect(wrapper.find('.ant-form-item-label').classes()).toContain('ant-form-item-label-wrap')
  })

  it('component-level labelWrap wins over ConfigProvider', () => {
    const wrapper = mount(() => (
      <ConfigProvider form={{ labelWrap: true }}>
        <Form labelWrap={false}>
          <FormItem label="Label">
            <input />
          </FormItem>
        </Form>
      </ConfigProvider>
    ))

    expect(wrapper.find('.ant-form-item-label').classes()).not.toContain('ant-form-item-label-wrap')
  })
})
