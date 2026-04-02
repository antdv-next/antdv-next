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
})
