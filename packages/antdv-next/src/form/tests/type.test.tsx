import type { FormInstance, FormProps } from '..'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { ref } from 'vue'
import Form, { FormItem } from '..'

describe('form.TypeScript', () => {
  it('supports array name paths and FormInstance APIs', async () => {
    interface LoginForm {
      users: Array<{ name: string }>
      remember: boolean
    }

    const formRef = ref<FormInstance>()
    const model: LoginForm = {
      users: [{ name: 'A' }],
      remember: true,
    }

    const wrapper = mount(() => (
      <Form ref={formRef} model={model}>
        <FormItem name={['users', 0, 'name']} label="Name">
          <input />
        </FormItem>
      </Form>
    ))

    formRef.value?.setFieldValue(['users', 0, 'name'], 'B')
    formRef.value?.getFieldValue(['users', 0, 'name'])
    formRef.value?.clearValidate([['users', 0, 'name']])
    formRef.value?.resetFields([['users', 0, 'name']])

    expect(wrapper.exists()).toBeTruthy()
  })

  it('supports semantic props and emits typing', () => {
    const props: FormProps = {
      layout: 'horizontal',
      classes: {
        root: 'f-root',
        label: 'f-label',
        content: 'f-content',
      },
      styles: {
        root: { marginTop: '8px' },
        label: { color: 'red' },
        content: { color: 'blue' },
      },
      model: {
        list: ['a'],
      },
    }

    const vnode = (
      <Form
        {...props}
        onFinish={(values: any) => {
          expect(values).toBeTruthy()
        }}
        onValuesChange={(changedValues: any, values: any) => {
          expect(changedValues).toBeTruthy()
          expect(values).toBeTruthy()
        }}
        onFieldsChange={(changedFields: any, allFields: any) => {
          expect(Array.isArray(changedFields)).toBe(true)
          expect(Array.isArray(allFields)).toBe(true)
        }}
      >
        <FormItem name={['list', 0]}>
          <input />
        </FormItem>
      </Form>
    )

    expect(vnode).toBeTruthy()
  })

  it('form item slots should accept VueNode fragments', () => {
    const vnode = (
      <Form model={{}}>
        <FormItem label="Multi children">
          <span>one</span>
          <span>two</span>
        </FormItem>
      </Form>
    )

    expect(vnode).toBeTruthy()
  })
})
