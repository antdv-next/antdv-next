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

function createForm() {
  const formRef = shallowRef<FormInstance>()
  const model = reactive<{ username?: string, password?: string }>({
    username: undefined,
    password: undefined,
  })

  const wrapper = mount(defineComponent(() => () => (
    <Form ref={formRef as any} model={model}>
      <FormItem name="username" rules={[{ required: true, message: 'Username required' }]}>
        <input class="username" />
      </FormItem>
      <FormItem name="password" rules={[{ required: true, message: 'Password required' }]}>
        <input class="password" />
      </FormItem>
    </Form>
  )), { attachTo: document.body })

  return { formRef, model, wrapper }
}

describe('form validateFields options', () => {
  it('accepts options object as first argument', async () => {
    const { formRef, wrapper } = createForm()

    await expect(formRef.value!.validateFields({ validateOnly: true })).rejects.toMatchObject({
      errorFields: [
        { name: ['username'], errors: ['Username required'] },
        { name: ['password'], errors: ['Password required'] },
      ],
    })

    wrapper.unmount()
  })

  it('validateOnly does not trigger UI and field status update', async () => {
    const { formRef, wrapper } = createForm()

    await expect(formRef.value!.validateFields(['username'], { validateOnly: true })).rejects.toMatchObject({
      errorFields: [
        { name: ['username'], errors: ['Username required'] },
      ],
    })

    await flushForm()
    expect(formRef.value!.getFieldError('username')).toEqual([])
    expect(formRef.value!.isFieldValidating('username')).toBe(false)
    expect(wrapper.findAll('.ant-form-item-explain-error')).toHaveLength(0)

    wrapper.unmount()
  })

  it('dirty option only validates touched or validated fields', async () => {
    const { formRef, model, wrapper } = createForm()

    // Touch `username` only
    model.username = 'foo'
    await flushForm()
    model.username = ''
    await flushForm()

    await expect(formRef.value!.validateFields({ dirty: true })).rejects.toMatchObject({
      errorFields: [
        { name: ['username'], errors: ['Username required'] },
      ],
    })

    await flushForm()
    expect(formRef.value!.getFieldError('username')).toEqual(['Username required'])
    expect(formRef.value!.getFieldError('password')).toEqual([])

    wrapper.unmount()
  })

  it('treats fields with defined initial value as dirty', async () => {
    const formRef = shallowRef<FormInstance>()
    const model = reactive({ nickname: '', age: undefined as string | undefined })

    const wrapper = mount(defineComponent(() => () => (
      <Form ref={formRef as any} model={model}>
        <FormItem name="nickname" rules={[{ required: true, message: 'Nickname required' }]}>
          <input />
        </FormItem>
        <FormItem name="age" rules={[{ required: true, message: 'Age required' }]}>
          <input />
        </FormItem>
      </Form>
    )), { attachTo: document.body })

    // `nickname` has a defined initial value (''), so it is dirty; `age` is not
    await expect(formRef.value!.validateFields({ dirty: true })).rejects.toMatchObject({
      errorFields: [
        { name: ['nickname'], errors: ['Nickname required'] },
      ],
    })

    wrapper.unmount()
  })

  it('rejects with first error message', async () => {
    const { formRef, wrapper } = createForm()

    await expect(formRef.value!.validateFields()).rejects.toMatchObject({
      message: 'Username required',
    })

    wrapper.unmount()
  })

  it('still validates all fields without arguments', async () => {
    const { formRef, wrapper } = createForm()

    await expect(formRef.value!.validateFields()).rejects.toMatchObject({
      errorFields: [
        { name: ['username'], errors: ['Username required'] },
        { name: ['password'], errors: ['Password required'] },
      ],
    })
    expect(formRef.value!.getFieldError('username')).toEqual(['Username required'])
    expect(formRef.value!.getFieldError('password')).toEqual(['Password required'])

    wrapper.unmount()
  })

  it('validateOnly resolves with values when valid', async () => {
    const { formRef, model, wrapper } = createForm()

    model.username = 'foo'
    model.password = 'bar'
    await flushForm()

    await expect(formRef.value!.validateFields({ validateOnly: true })).resolves.toEqual({
      username: 'foo',
      password: 'bar',
    })

    wrapper.unmount()
  })

  it('combines dirty and recursive options', async () => {
    const formRef = shallowRef<FormInstance>()
    const model = reactive<{ user: { name?: string, age?: string } }>({
      user: { name: undefined, age: undefined },
    })

    const wrapper = mount(defineComponent(() => () => (
      <Form ref={formRef as any} model={model}>
        <FormItem name={['user', 'name']} rules={[{ required: true, message: 'Name required' }]}>
          <input />
        </FormItem>
        <FormItem name={['user', 'age']} rules={[{ required: true, message: 'Age required' }]}>
          <input />
        </FormItem>
      </Form>
    )), { attachTo: document.body })

    // Touch `user.name` only
    model.user.name = 'x'
    await flushForm()
    model.user.name = ''
    await flushForm()

    await expect(formRef.value!.validateFields(['user'], { recursive: true, dirty: true })).rejects.toMatchObject({
      errorFields: [
        { name: ['user', 'name'], errors: ['Name required'] },
      ],
    })

    await flushForm()
    expect(formRef.value!.getFieldError(['user', 'age'])).toEqual([])

    wrapper.unmount()
  })

  it('resetFields clears dirty state for dirty-only validation', async () => {
    const { formRef, model, wrapper } = createForm()

    model.username = 'x'
    await flushForm()
    model.username = ''
    await flushForm()

    await expect(formRef.value!.validateFields({ dirty: true })).rejects.toMatchObject({
      errorFields: [
        { name: ['username'], errors: ['Username required'] },
      ],
    })

    formRef.value!.resetFields()
    await flushForm()
    expect(formRef.value!.getFieldError('username')).toEqual([])

    await expect(formRef.value!.validateFields({ dirty: true })).resolves.toBeTruthy()
    expect(formRef.value!.getFieldError('username')).toEqual([])

    wrapper.unmount()
  })

  it('validate alias forwards name list and options', async () => {
    const { formRef, wrapper } = createForm()

    await expect(formRef.value!.validate(['username'])).rejects.toMatchObject({
      errorFields: [
        { name: ['username'], errors: ['Username required'] },
      ],
    })
    expect(formRef.value!.getFieldError('password')).toEqual([])

    await expect(formRef.value!.validate()).rejects.toMatchObject({
      errorFields: [
        { name: ['username'], errors: ['Username required'] },
        { name: ['password'], errors: ['Password required'] },
      ],
    })

    wrapper.unmount()
  })
})
