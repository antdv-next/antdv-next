import { describe, expect, it } from 'vitest'
import Form from '..'
import { mount } from '/@tests/utils'

describe('form attrs', () => {
  it('passes autoComplete to native form element', () => {
    const wrapper = mount(() => (
      <Form autoComplete="off">
        <input name="username" />
      </Form>
    ))

    expect(wrapper.find('form').attributes('autocomplete')).toBe('off')
  })

  it('keeps autocomplete attrs on native form element', () => {
    const wrapper = mount(() => (
      <Form autocomplete="off">
        <input name="username" />
      </Form>
    ))

    expect(wrapper.find('form').attributes('autocomplete')).toBe('off')
  })
})
