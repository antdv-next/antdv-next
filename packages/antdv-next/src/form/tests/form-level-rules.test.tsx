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

describe('form-level (global) rules', () => {
  it('applies form-level rules keyed by field name', async () => {
    const formRef = shallowRef<FormInstance>()
    const model = reactive({ username: '' })

    const wrapper = mount(defineComponent(() => () => (
      <Form
        ref={formRef as any}
        model={model}
        rules={{ username: [{ required: true, message: 'Username required' }] }}
      >
        <FormItem name="username">
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

  it('merges form-level rules with FormItem rules', async () => {
    const formRef = shallowRef<FormInstance>()
    const model = reactive({ username: 'ab' })

    const wrapper = mount(defineComponent(() => () => (
      <Form
        ref={formRef as any}
        model={model}
        rules={{ username: [{ required: true, message: 'Username required' }] }}
      >
        <FormItem name="username" rules={[{ min: 3, message: 'Too short' }]}>
          <input class="username-input" value={model.username} />
        </FormItem>
      </Form>
    )), { attachTo: document.body })

    await flushForm()
    await expect(formRef.value!.validateFields()).rejects.toMatchObject({
      errorFields: [{ name: ['username'], errors: ['Too short'] }],
    })

    wrapper.unmount()
  })

  it('applies form-level rules to nested object path', async () => {
    const formRef = shallowRef<FormInstance>()
    const model = reactive({ user: { email: '' } })

    const wrapper = mount(defineComponent(() => () => (
      <Form
        ref={formRef as any}
        model={model}
        rules={{ user: { email: [{ required: true, message: 'Email required' }] } }}
      >
        <FormItem name={['user', 'email']}>
          <input class="email-input" value={model.user.email} />
        </FormItem>
      </Form>
    )), { attachTo: document.body })

    await flushForm()
    await expect(formRef.value!.validateFields()).rejects.toMatchObject({
      errorFields: [{ name: ['user', 'email'], errors: ['Email required'] }],
    })

    wrapper.unmount()
  })

  it('supports array/index-keyed rules: rules={{ list: { 0: [...], 1: [...] } }}', async () => {
    const formRef = shallowRef<FormInstance>()
    const model = reactive({ list: ['', ''] })

    const wrapper = mount(defineComponent(() => () => (
      <Form
        ref={formRef as any}
        model={model}
        rules={{
          list: {
            0: [{ required: true, message: 'Item 0 required' }],
            1: [{ required: true, message: 'Item 1 required' }],
          },
        }}
      >
        <FormItem name={['list', 0]}>
          <input class="list-0" value={model.list[0]} />
        </FormItem>
        <FormItem name={['list', 1]}>
          <input class="list-1" value={model.list[1]} />
        </FormItem>
      </Form>
    )), { attachTo: document.body })

    await flushForm()
    await expect(formRef.value!.validateFields()).rejects.toMatchObject({
      errorFields: [
        { name: ['list', 0], errors: ['Item 0 required'] },
        { name: ['list', 1], errors: ['Item 1 required'] },
      ],
    })

    wrapper.unmount()
  })
})
