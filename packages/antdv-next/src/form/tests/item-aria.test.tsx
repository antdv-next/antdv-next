import type { FormInstance } from '..'
import { describe, expect, it } from 'vitest'
import { defineComponent, nextTick, reactive, shallowRef } from 'vue'
import Form, { FormItem } from '..'
import { flushPromises, mount } from '/@tests/utils'

async function flushForm() {
  await nextTick()
  await flushPromises()
  await nextTick()
}

describe('formItem aria attributes', () => {
  it('sets aria-required when the required prop is set', async () => {
    const model = reactive({ username: '' })

    const wrapper = mount(defineComponent(() => () => (
      <Form model={model}>
        <FormItem name="username" label="Username" required>
          <input value={model.username} />
        </FormItem>
      </Form>
    )), { attachTo: document.body })

    await flushForm()
    expect(wrapper.find('input').attributes('aria-required')).toBe('true')

    wrapper.unmount()
  })

  it('sets aria-required when rules contain a required rule', async () => {
    const model = reactive({ username: '' })

    const wrapper = mount(defineComponent(() => () => (
      <Form model={model}>
        <FormItem name="username" label="Username" rules={[{ required: true, message: 'Required' }]}>
          <input value={model.username} />
        </FormItem>
      </Form>
    )), { attachTo: document.body })

    await flushForm()
    expect(wrapper.find('input').attributes('aria-required')).toBe('true')

    wrapper.unmount()
  })

  it('required={false} overrides rules-derived required', async () => {
    const model = reactive({ username: '' })

    const wrapper = mount(defineComponent(() => () => (
      <Form model={model}>
        <FormItem
          name="username"
          label="Username"
          required={false}
          rules={[{ required: true, message: 'Required' }]}
        >
          <input value={model.username} />
        </FormItem>
      </Form>
    )), { attachTo: document.body })

    await flushForm()
    expect(wrapper.find('input').attributes('aria-required')).toBeUndefined()
    expect(wrapper.find('label').classes()).not.toContain('ant-form-item-required')

    wrapper.unmount()
  })

  it('does not set aria attributes on a plain optional field', async () => {
    const model = reactive({ username: '' })

    const wrapper = mount(defineComponent(() => () => (
      <Form model={model}>
        <FormItem name="username" label="Username">
          <input value={model.username} />
        </FormItem>
      </Form>
    )), { attachTo: document.body })

    await flushForm()
    const input = wrapper.find('input')
    expect(input.attributes('aria-required')).toBeUndefined()
    expect(input.attributes('aria-invalid')).toBeUndefined()
    expect(input.attributes('aria-describedby')).toBeUndefined()

    wrapper.unmount()
  })

  it('sets aria-invalid and aria-describedby after a failed validation', async () => {
    const formRef = shallowRef<FormInstance>()
    const model = reactive({ username: '' })

    const wrapper = mount(defineComponent(() => () => (
      <Form ref={formRef as any} model={model}>
        <FormItem name="username" label="Username" rules={[{ required: true, message: 'Required' }]}>
          <input value={model.username} />
        </FormItem>
      </Form>
    )), { attachTo: document.body })

    await flushForm()
    await expect(formRef.value!.validateFields()).rejects.toMatchObject({
      errorFields: [{ name: ['username'], errors: ['Required'] }],
    })
    await flushForm()

    const input = wrapper.find('input')
    expect(input.attributes('aria-invalid')).toBe('true')
    expect(input.attributes('aria-describedby')).toBe('username_help')
    expect(wrapper.find('#username_help').exists()).toBe(true)

    wrapper.unmount()
  })

  it('points aria-describedby at help and extra elements', async () => {
    const model = reactive({ username: '' })

    const wrapper = mount(defineComponent(() => () => (
      <Form model={model}>
        <FormItem name="username" label="Username" help="Some help" extra="Some extra">
          <input value={model.username} />
        </FormItem>
      </Form>
    )), { attachTo: document.body })

    await flushForm()
    expect(wrapper.find('input').attributes('aria-describedby')).toBe('username_help username_extra')
    expect(wrapper.find('#username_help').exists()).toBe(true)
    expect(wrapper.find('#username_extra').exists()).toBe(true)

    wrapper.unmount()
  })

  it('only lists extra when no help or errors exist', async () => {
    const model = reactive({ username: '' })

    const wrapper = mount(defineComponent(() => () => (
      <Form model={model}>
        <FormItem name="username" label="Username" extra="Some extra">
          <input value={model.username} />
        </FormItem>
      </Form>
    )), { attachTo: document.body })

    await flushForm()
    expect(wrapper.find('input').attributes('aria-describedby')).toBe('username_extra')

    wrapper.unmount()
  })
})
