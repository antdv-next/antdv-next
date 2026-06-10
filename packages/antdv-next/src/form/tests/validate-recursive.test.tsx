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

function createNestedForm() {
  const formRef = shallowRef<FormInstance>()
  const model = reactive({
    user: {
      name: '',
      age: '',
    },
    other: '',
  })

  const wrapper = mount(defineComponent(() => () => (
    <Form ref={formRef as any} model={model}>
      <FormItem name={['user', 'name']} rules={[{ required: true, message: 'Name required' }]}>
        <input />
      </FormItem>
      <FormItem name={['user', 'age']} rules={[{ required: true, message: 'Age required' }]}>
        <input />
      </FormItem>
      <FormItem name="other" rules={[{ required: true, message: 'Other required' }]}>
        <input />
      </FormItem>
    </Form>
  )), { attachTo: document.body })

  return { formRef, model, wrapper }
}

describe('form validateFields recursive', () => {
  it('validates nested fields when recursive is true', async () => {
    const { formRef, wrapper } = createNestedForm()

    await expect(formRef.value!.validateFields(['user'], { recursive: true })).rejects.toMatchObject({
      errorFields: [
        { name: ['user', 'name'], errors: ['Name required'] },
        { name: ['user', 'age'], errors: ['Age required'] },
      ],
    })

    expect(formRef.value!.getFieldError(['user', 'name'])).toEqual(['Name required'])
    expect(formRef.value!.getFieldError(['user', 'age'])).toEqual(['Age required'])
    // Fields outside the provided name path are not validated
    expect(formRef.value!.getFieldError('other')).toEqual([])

    wrapper.unmount()
  })

  it('only matches exact name path without recursive', async () => {
    const { formRef, wrapper } = createNestedForm()

    await expect(formRef.value!.validateFields(['user'])).resolves.toEqual({
      user: { name: '', age: '' },
    })
    expect(formRef.value!.getFieldError(['user', 'name'])).toEqual([])
    expect(formRef.value!.getFieldError(['user', 'age'])).toEqual([])

    wrapper.unmount()
  })

  it('still validates exact matched field with recursive', async () => {
    const { formRef, wrapper } = createNestedForm()

    await expect(formRef.value!.validateFields([['user', 'name']], { recursive: true })).rejects.toMatchObject({
      errorFields: [
        { name: ['user', 'name'], errors: ['Name required'] },
      ],
    })
    expect(formRef.value!.getFieldError(['user', 'age'])).toEqual([])

    wrapper.unmount()
  })

  it('resolves with nested values when recursive validation passes', async () => {
    const { formRef, model, wrapper } = createNestedForm()

    model.user.name = 'foo'
    model.user.age = '18'
    await flushForm()

    await expect(formRef.value!.validateFields(['user'], { recursive: true })).resolves.toEqual({
      user: { name: 'foo', age: '18' },
    })

    wrapper.unmount()
  })

  it('supports a single string name with recursive', async () => {
    const { formRef, wrapper } = createNestedForm()

    await expect(formRef.value!.validateFields('user' as any, { recursive: true })).rejects.toMatchObject({
      errorFields: [
        { name: ['user', 'name'] },
        { name: ['user', 'age'] },
      ],
    })

    wrapper.unmount()
  })

  it('validates dot-separated string path as exact nested field', async () => {
    const { formRef, wrapper } = createNestedForm()

    await expect(formRef.value!.validateFields(['user.name'])).rejects.toMatchObject({
      errorFields: [
        { name: ['user', 'name'], errors: ['Name required'] },
      ],
    })
    expect(formRef.value!.getFieldError(['user', 'age'])).toEqual([])

    wrapper.unmount()
  })

  it('recursively validates multiple provided paths', async () => {
    const { formRef, wrapper } = createNestedForm()

    await expect(formRef.value!.validateFields([['user'], 'other'], { recursive: true })).rejects.toMatchObject({
      errorFields: [
        { name: ['user', 'name'], errors: ['Name required'] },
        { name: ['user', 'age'], errors: ['Age required'] },
        { name: ['other'], errors: ['Other required'] },
      ],
    })

    wrapper.unmount()
  })

  it('recursively validates list index paths', async () => {
    const formRef = shallowRef<FormInstance>()
    const model = reactive<{ list: string[] }>({ list: ['', ''] })

    const wrapper = mount(defineComponent(() => () => (
      <Form ref={formRef as any} model={model}>
        <FormItem name={['list', 0]} rules={[{ required: true, message: 'Item 0 required' }]}>
          <input />
        </FormItem>
        <FormItem name={['list', 1]} rules={[{ required: true, message: 'Item 1 required' }]}>
          <input />
        </FormItem>
      </Form>
    )), { attachTo: document.body })

    await expect(formRef.value!.validateFields(['list'], { recursive: true })).rejects.toMatchObject({
      errorFields: [
        { name: ['list', 0], errors: ['Item 0 required'] },
        { name: ['list', 1], errors: ['Item 1 required'] },
      ],
    })

    wrapper.unmount()
  })

  it('recursively validates deeply nested fields', async () => {
    const formRef = shallowRef<FormInstance>()
    const model = reactive({ a: { b: { c: '' } } })

    const wrapper = mount(defineComponent(() => () => (
      <Form ref={formRef as any} model={model}>
        <FormItem name={['a', 'b', 'c']} rules={[{ required: true, message: 'C required' }]}>
          <input />
        </FormItem>
      </Form>
    )), { attachTo: document.body })

    await expect(formRef.value!.validateFields(['a'], { recursive: true })).rejects.toMatchObject({
      errorFields: [
        { name: ['a', 'b', 'c'], errors: ['C required'] },
      ],
    })
    await expect(formRef.value!.validateFields([['a', 'b']], { recursive: true })).rejects.toMatchObject({
      errorFields: [
        { name: ['a', 'b', 'c'], errors: ['C required'] },
      ],
    })

    wrapper.unmount()
  })
})
