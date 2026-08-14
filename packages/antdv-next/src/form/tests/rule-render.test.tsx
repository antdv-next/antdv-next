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

describe('function rules (RuleRender)', () => {
  it('resolves function rules when validating', async () => {
    const formRef = shallowRef<FormInstance>()
    const model = reactive({ username: '' })

    const wrapper = mount(defineComponent(() => () => (
      <Form ref={formRef as any} model={model}>
        <FormItem
          name="username"
          rules={[() => ({ required: true, message: 'Username required' })]}
        >
          <input class="username-input" value={model.username} />
        </FormItem>
      </Form>
    )), { attachTo: document.body })

    await flushForm()
    await expect(formRef.value!.validateFields()).rejects.toMatchObject({
      errorFields: [{ name: ['username'], errors: ['Username required'] }],
    })

    wrapper.unmount()
  })

  it('passes the form instance to function rules', async () => {
    const formRef = shallowRef<FormInstance>()
    const model = reactive({ password: 'abc', confirm: 'abd' })

    const wrapper = mount(defineComponent(() => () => (
      <Form ref={formRef as any} model={model}>
        <FormItem name="password">
          <input value={model.password} />
        </FormItem>
        <FormItem
          name="confirm"
          rules={[
            form => ({
              validator: (_rule, value) =>
                value === form.getFieldValue('password')
                  ? Promise.resolve()
                  : Promise.reject(new Error('Passwords do not match')),
            }),
          ]}
        >
          <input value={model.confirm} />
        </FormItem>
      </Form>
    )), { attachTo: document.body })

    await flushForm()
    await expect(formRef.value!.validateFields()).rejects.toMatchObject({
      errorFields: [{ name: ['confirm'], errors: ['Passwords do not match'] }],
    })

    model.confirm = 'abc'
    await flushForm()
    await expect(formRef.value!.validateFields()).resolves.toMatchObject({
      confirm: 'abc',
    })

    wrapper.unmount()
  })

  it('derives the required mark from function rules', async () => {
    const model = reactive({ username: '' })

    const wrapper = mount(defineComponent(() => () => (
      <Form model={model}>
        <FormItem
          name="username"
          label="Username"
          rules={[() => ({ required: true, message: 'Username required' })]}
        >
          <input value={model.username} />
        </FormItem>
      </Form>
    )), { attachTo: document.body })

    await flushForm()
    expect(wrapper.find('label').classes()).toContain('ant-form-item-required')

    wrapper.unmount()
  })

  it('ignores warningOnly function rules for the required mark', async () => {
    const model = reactive({ username: '' })

    const wrapper = mount(defineComponent(() => () => (
      <Form model={model}>
        <FormItem
          name="username"
          label="Username"
          rules={[() => ({ required: true, warningOnly: true, message: 'Better fill it' })]}
        >
          <input value={model.username} />
        </FormItem>
      </Form>
    )), { attachTo: document.body })

    await flushForm()
    expect(wrapper.find('label').classes()).not.toContain('ant-form-item-required')

    wrapper.unmount()
  })
})
