import { describe, expect, it, vi } from 'vitest'
import { nextTick, ref } from 'vue'
import Form, { FormItem } from '..'
import { mount } from '/@tests/utils'

describe('form item control events', () => {
  it('keeps child id and falls back to field id when child id is missing', () => {
    const wrapper = mount(() => (
      <Form model={{ username: '', email: '' }}>
        <FormItem name="username">
          <input id="custom-id" />
        </FormItem>
        <FormItem name="email">
          <input />
        </FormItem>
      </Form>
    ))

    expect(wrapper.find('input#custom-id').exists()).toBe(true)
    expect(wrapper.find('input#email').exists()).toBe(true)

    wrapper.unmount()
  })

  it('links generated field id to label for when form item has a name', () => {
    const wrapper = mount(() => (
      <Form name="profile" model={{ username: '' }}>
        <FormItem name="username" label="Username">
          <input />
        </FormItem>
      </Form>
    ))

    expect(wrapper.find('input#profile_username').exists()).toBe(true)
    expect(wrapper.find('.ant-form-item-label > label').attributes('for')).toBe('profile_username')

    wrapper.unmount()
  })

  it('prefers explicit htmlFor over generated field id', () => {
    const wrapper = mount(() => (
      <Form name="profile" model={{ username: '' }}>
        <FormItem name="username" label="Username" htmlFor="custom-control-id">
          <input />
        </FormItem>
      </Form>
    ))

    expect(wrapper.find('input#profile_username').exists()).toBe(true)
    expect(wrapper.find('.ant-form-item-label > label').attributes('for')).toBe('custom-control-id')

    wrapper.unmount()
  })

  it('supports array-based onBlur/onFocus listeners from child vnode', async () => {
    const blurA = vi.fn()
    const blurB = vi.fn()
    const focusA = vi.fn()
    const focusB = vi.fn()

    const wrapper = mount(() => (
      <Form model={{ username: '' }}>
        <FormItem name="username">
          <input
            onBlur={[blurA, null, blurB] as any}
            onFocus={[focusA, undefined, focusB] as any}
          />
        </FormItem>
      </Form>
    ))

    const input = wrapper.find('input')
    await input.trigger('focus')
    await input.trigger('blur')

    expect(focusA).toHaveBeenCalledTimes(1)
    expect(focusB).toHaveBeenCalledTimes(1)
    expect(blurA).toHaveBeenCalledTimes(1)
    expect(blurB).toHaveBeenCalledTimes(1)

    wrapper.unmount()
  })

  it('supports function-based onBlur/onFocus listeners from child vnode', async () => {
    const blur = vi.fn()
    const focus = vi.fn()

    const wrapper = mount(() => (
      <Form model={{ username: '' }}>
        <FormItem name="username">
          <input onBlur={blur} onFocus={focus} />
        </FormItem>
      </Form>
    ))

    const input = wrapper.find('input')
    await input.trigger('focus')
    await input.trigger('blur')

    expect(focus).toHaveBeenCalledTimes(1)
    expect(blur).toHaveBeenCalledTimes(1)

    wrapper.unmount()
  })

  it('preserves child ref after FormItem wraps vnode props', async () => {
    const inputRef = ref<HTMLInputElement>()

    const wrapper = mount(() => (
      <Form model={{ username: '' }}>
        <FormItem name="username">
          <input ref={inputRef} />
        </FormItem>
      </Form>
    ))

    await nextTick()

    expect(inputRef.value).toBeInstanceOf(HTMLInputElement)

    wrapper.unmount()
  })
})
