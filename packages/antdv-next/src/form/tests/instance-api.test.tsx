import type { FormInstance } from '..'
import { describe, expect, it } from 'vitest'
import { nextTick, reactive, ref, toRaw } from 'vue'
import Form, { FormItem } from '..'
import { mount } from '/@tests/utils'

describe('form instance api', () => {
  it.each([
    {
      name: 'nested objects',
      values: { profile: { name: 'B', address: { city: 'Shanghai' } } },
    },
    {
      name: 'dotted field names',
      values: { 'profile.name': 'B', 'profile.address': { city: 'Shanghai' } },
    },
  ])('merges $name without losing sibling fields', async ({ values }) => {
    const formRef = ref<FormInstance>()
    const model = reactive({
      profile: {
        name: 'A',
        age: 18,
        address: { city: 'Hangzhou', zip: '310000' },
      },
      email: 'foo@example.com',
    })

    const wrapper = mount(() => (
      <Form ref={formRef} model={model}>
        <FormItem name={['profile', 'name']} label="Name">
          <input value={model.profile.name} />
        </FormItem>
        <FormItem name={['profile', 'age']} label="Age">
          <input value={model.profile.age} />
        </FormItem>
      </Form>
    ))

    formRef.value!.setFieldsValue(values)
    await nextTick()

    expect(model).toEqual({
      profile: {
        name: 'B',
        age: 18,
        address: { city: 'Shanghai', zip: '310000' },
      },
      email: 'foo@example.com',
    })
    expect(wrapper.findAll('input').map(input => input.element.value)).toEqual(['B', '18'])
  })

  it('keeps references of untouched values when merging nested updates', async () => {
    const formRef = ref<FormInstance>()
    const model = reactive({
      profile: {
        name: 'A',
        address: { city: 'Hangzhou' },
      },
      tags: [{ label: 'A' }],
      other: { enabled: true },
    })
    const profile = model.profile
    const address = model.profile.address
    const tags = model.tags
    const other = model.other

    mount(() => <Form ref={formRef} model={model} />)

    formRef.value!.setFieldsValue({ profile: { name: 'B' } })
    await nextTick()

    expect(model.profile.name).toBe('B')
    expect(model.profile).toBe(profile)
    expect(model.profile.address).toBe(address)
    expect(model.tags).toBe(tags)
    expect(model.other).toBe(other)
  })

  it('does not share object or array references from the payload', async () => {
    const formRef = ref<FormInstance>()
    const model = reactive({
      profile: { name: 'A' },
    } as any)
    const payload = {
      profile: { address: { city: 'Hangzhou' } },
      tags: [{ label: 'A' }],
    }

    mount(() => <Form ref={formRef} model={model} />)

    formRef.value!.setFieldsValue(payload)
    await nextTick()

    expect(toRaw(model.profile.address)).not.toBe(payload.profile.address)
    expect(toRaw(model.tags)).not.toBe(payload.tags)
    expect(toRaw(model.tags[0])).not.toBe(payload.tags[0])

    payload.profile.address.city = 'Beijing'
    payload.tags[0]!.label = 'B'
    expect(model.profile.address.city).toBe('Hangzhou')
    expect(model.tags[0].label).toBe('A')

    formRef.value!.setFieldsValue({ profile: { address: { city: 'Shanghai' } } })
    await nextTick()

    expect(model.profile.address.city).toBe('Shanghai')
    expect(payload.profile.address.city).toBe('Beijing')
  })

  it.each([
    { value: [{ name: 'C' }] },
    { value: [] },
    { value: null },
  ])('replaces array fields with $value', async ({ value }) => {
    const formRef = ref<FormInstance>()
    const model = reactive({
      users: [{ name: 'A', age: 18 }, { name: 'B', age: 20 }],
    })

    mount(() => <Form ref={formRef} model={model} />)

    formRef.value!.setFieldsValue({ users: value })
    await nextTick()

    expect(model.users).toEqual(value)
  })

  it('supports assigning undefined through form instance update apis', async () => {
    const formRef = ref<FormInstance>()
    const model = reactive({
      email: 'foo@example.com',
      profile: {
        nickname: 'foo',
        age: 18,
      },
    })

    mount(() => (
      <Form ref={formRef} model={model}>
        <FormItem name="email" label="Email">
          <input />
        </FormItem>
        <FormItem name={['profile', 'nickname']} label="Nickname">
          <input />
        </FormItem>
      </Form>
    ))

    formRef.value!.setFieldValue('email', undefined)
    await nextTick()
    expect(model.email).toBeUndefined()

    formRef.value!.setFieldsValue({
      profile: {
        nickname: undefined,
      },
    })
    await nextTick()
    expect(model.profile).toEqual({ nickname: undefined, age: 18 })

    model.email = 'bar@example.com'
    formRef.value!.setFields([{ name: ['email'], value: undefined }])
    await nextTick()
    expect(model.email).toBeUndefined()
  })

  it('setFields accepts string names and applies errors/value/touched', async () => {
    const formRef = ref<FormInstance>()
    const model = reactive({
      username: '',
      password: '',
    })

    mount(() => (
      <Form ref={formRef} model={model}>
        <FormItem name="username" label="Username">
          <input />
        </FormItem>
        <FormItem name="password" label="Password">
          <input />
        </FormItem>
      </Form>
    ))

    formRef.value!.setFields([
      {
        name: 'password',
        errors: ['Please input your password!', 'Use at least 8 characters.'],
        touched: true,
      },
      {
        name: 'username',
        value: 'alice',
      },
    ])
    await nextTick()

    expect(formRef.value!.getFieldError('password')).toEqual([
      'Please input your password!',
      'Use at least 8 characters.',
    ])
    expect(formRef.value!.isFieldTouched('password')).toBe(true)
    expect(model.username).toBe('alice')
  })

  it('setFields accepts nested string-path names', async () => {
    const formRef = ref<FormInstance>()
    const model = reactive({
      profile: {
        nickname: '',
      },
    })

    mount(() => (
      <Form ref={formRef} model={model}>
        <FormItem name={['profile', 'nickname']} label="Nickname">
          <input />
        </FormItem>
      </Form>
    ))

    formRef.value!.setFields([
      {
        name: 'profile.nickname',
        errors: ['Required'],
      },
    ])
    await nextTick()

    expect(formRef.value!.getFieldError(['profile', 'nickname'])).toEqual(['Required'])
  })
})
