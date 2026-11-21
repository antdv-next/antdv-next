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

describe('form getFieldsValue filter', () => {
  it('filters registered fields by meta', async () => {
    const formRef = shallowRef<FormInstance>()
    const model = reactive({
      username: 'A',
      profile: { age: 18, email: 'a@example.com' },
    })

    const wrapper = mount(defineComponent(() => () => (
      <Form ref={formRef as any} model={model}>
        <FormItem name="username">
          <input />
        </FormItem>
        <FormItem name={['profile', 'age']}>
          <input />
        </FormItem>
        <FormItem name={['profile', 'email']}>
          <input />
        </FormItem>
      </Form>
    )), { attachTo: document.body })

    await flushForm()
    formRef.value!.setFields([{ name: ['profile', 'age'], touched: true }])
    await flushForm()

    const touched = (meta: { touched: boolean } | null) => !!meta?.touched

    expect(formRef.value!.getFieldsValue({ filter: touched })).toEqual({
      profile: { age: 18 },
    })
    expect(formRef.value!.getFieldsValue(true, touched)).toEqual({
      profile: { age: 18 },
    })
    expect(formRef.value!.getFieldsValue([['profile']], touched)).toEqual({
      profile: { age: 18 },
    })
    expect(formRef.value!.getFieldsValue([['profile', 'email']], touched)).toEqual({})
    expect(formRef.value!.getFieldsValue(['profile'], touched)).toEqual({
      profile: { age: 18 },
    })
    expect(formRef.value!.getFieldsValue(['username'], touched)).toEqual({})
    expect(formRef.value!.getFieldsValue(['username'])).toEqual({ username: 'A' })
    expect(formRef.value!.getFieldsValue()).toEqual({
      username: 'A',
      profile: { age: 18, email: 'a@example.com' },
    })

    wrapper.unmount()
  })

  it('passes null meta for unregistered name paths', async () => {
    const formRef = shallowRef<FormInstance>()
    const model = reactive({ username: 'A' })

    const wrapper = mount(defineComponent(() => () => (
      <Form ref={formRef as any} model={model}>
        <FormItem name="username">
          <input />
        </FormItem>
      </Form>
    )), { attachTo: document.body })

    await flushForm()
    formRef.value!.setFieldsValue({ extra: 'kept' })

    expect(formRef.value!.getFieldsValue([['extra']], meta => meta === null)).toEqual({ extra: 'kept' })
    expect(formRef.value!.getFieldsValue([['extra']], meta => meta !== null)).toEqual({})
    expect(formRef.value!.getFieldsValue([['extra']])).toEqual({ extra: 'kept' })

    wrapper.unmount()
  })

  it('narrows parent name paths to registered fields', async () => {
    const formRef = shallowRef<FormInstance>()
    const model = reactive({
      list: [{ name: 'bamboo', notExist: 'little' }],
    })

    const wrapper = mount(defineComponent(() => () => (
      <Form ref={formRef as any} model={model}>
        <FormItem name={['list', 0, 'name']}>
          <input />
        </FormItem>
      </Form>
    )), { attachTo: document.body })

    await flushForm()

    expect(formRef.value!.getFieldsValue()).toEqual({ list: [{ name: 'bamboo' }] })
    expect(formRef.value!.getFieldsValue([['list']])).toEqual({ list: [{ name: 'bamboo' }] })
    expect(formRef.value!.getFieldsValue(true)).toEqual({
      list: [{ name: 'bamboo', notExist: 'little' }],
    })

    wrapper.unmount()
  })
})
