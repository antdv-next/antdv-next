import { describe, expect, it } from 'vitest'
import Form, { FormItem } from '..'
import Input from '../../input'
import Switch from '../../switch'
import { mount } from '/@tests/utils'

const labelSelector = '.ant-form-item-label > label'

describe('form item label association', () => {
  it('should associate label with the explicit id of the control', () => {
    const wrapper = mount(() => (
      <Form model={{ account: '' }}>
        <FormItem name="account" label="Account" extra="Account identifier">
          <Input id="custom-account" />
        </FormItem>
      </Form>
    ), { attachTo: document.body })

    const input = wrapper.find('input')
    // Label should follow the id the control actually renders with
    expect(input.attributes('id')).toBe('custom-account')
    expect(wrapper.find(labelSelector).attributes('for')).toBe('custom-account')
    expect((wrapper.find(labelSelector).element as HTMLLabelElement).control).toBe(input.element)

    // `help` / `extra` still use the generated field id and stay reachable
    expect(input.attributes('aria-describedby')).toBe('account_extra')
    expect(document.getElementById('account_extra')?.textContent).toBe('Account identifier')

    wrapper.unmount()
  })

  it('should keep generated field id for label when control has no explicit id', () => {
    const wrapper = mount(() => (
      <Form model={{ account: '' }}>
        <FormItem name="account" label="Account">
          <Input />
        </FormItem>
      </Form>
    ))

    expect(wrapper.find('input').attributes('id')).toBe('account')
    expect(wrapper.find(labelSelector).attributes('for')).toBe('account')

    wrapper.unmount()
  })

  it('should let explicit htmlFor override the control id', () => {
    const wrapper = mount(() => (
      <Form model={{ account: '' }}>
        <FormItem name="account" label="Account" htmlFor="custom-html-for">
          <Input id="custom-account" />
        </FormItem>
      </Form>
    ))

    expect(wrapper.find(labelSelector).attributes('for')).toBe('custom-html-for')

    wrapper.unmount()
  })

  it('should keep htmlFor null as the way to disable label association', () => {
    const nullHtmlFor = { htmlFor: null } as any

    const wrapper = mount(() => (
      <Form model={{ switch: false }}>
        <FormItem name="switch" label="Switch" {...nullHtmlFor}>
          <Switch />
        </FormItem>
      </Form>
    ))

    expect(wrapper.find(labelSelector).attributes('for')).toBeUndefined()

    wrapper.unmount()
  })

  it('should fall back to the control id when htmlFor is explicitly undefined', () => {
    const wrapper = mount(() => (
      <Form model={{ account: '' }}>
        <FormItem name="account" label="Account" htmlFor={undefined}>
          <Input id="custom-account" />
        </FormItem>
      </Form>
    ))

    expect(wrapper.find(labelSelector).attributes('for')).toBe('custom-account')

    wrapper.unmount()
  })

  it('should keep generated field id for label when there are multiple children', () => {
    const wrapper = mount(() => (
      <Form model={{ account: '' }}>
        <FormItem name="account" label="Account">
          <Input id="custom-account" />
          <span>suffix</span>
        </FormItem>
      </Form>
    ))

    expect(wrapper.find(labelSelector).attributes('for')).toBe('account')

    wrapper.unmount()
  })
})
