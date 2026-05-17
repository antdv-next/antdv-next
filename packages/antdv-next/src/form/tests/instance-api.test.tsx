import type { FormInstance } from '..'
import { describe, expect, it } from 'vitest'
import { nextTick, reactive, ref } from 'vue'
import Form, { FormItem } from '..'
import { mount } from '/@tests/utils'

describe('form instance api', () => {
  it('supports assigning undefined through form instance update apis', async () => {
    const formRef = ref<FormInstance>()
    const model = reactive({
      email: 'foo@example.com',
      profile: {
        nickname: 'foo',
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
    expect(model.profile.nickname).toBeUndefined()

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
