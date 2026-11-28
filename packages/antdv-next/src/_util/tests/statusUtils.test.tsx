import { describe, expect, it } from 'vitest'
import { defineComponent } from 'vue'
import Form, { FormItem } from '../../form'
import Input from '../../input'
import { getMergedStatus } from '../statusUtils'
import { mount } from '/@tests/utils'

// https://github.com/ant-design/ant-design/pull/60001
describe('getMergedStatus', () => {
  it('explicit empty status should override context status', () => {
    expect(getMergedStatus('error', '')).toBe('')
  })

  it('falls back to context status when custom status is not set', () => {
    expect(getMergedStatus('error', undefined)).toBe('error')
    expect(getMergedStatus('warning')).toBe('warning')
  })

  it('custom status takes precedence over context status', () => {
    expect(getMergedStatus('error', 'warning')).toBe('warning')
  })

  it('input with status="" does not inherit the Form.Item status', () => {
    const Demo = defineComponent(() => () => (
      <Form>
        <FormItem validateStatus="error">
          <Input class="explicit" status="" />
        </FormItem>
        <FormItem validateStatus="error">
          <Input class="inherit" />
        </FormItem>
      </Form>
    ))
    const wrapper = mount(Demo)

    expect(wrapper.find('.explicit').classes()).not.toContain('ant-input-status-error')
    expect(wrapper.find('.inherit').classes()).toContain('ant-input-status-error')
    wrapper.unmount()
  })
})
