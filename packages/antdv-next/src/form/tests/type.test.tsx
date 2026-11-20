import type { FormHookInstance, FormInstance, FormItemProps, FormProps } from '..'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { ref } from 'vue'
import Form, { FormItem, useForm } from '..'

type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends (<T>() => T extends Y ? 1 : 2) ? true : false

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

    const _fieldsValue = formRef.value!.getFieldsValue()
    const _allFieldsValue = formRef.value!.getFieldsValue(true)
    const _validated = await formRef.value!.validateFields()
    const _validatedByOptions = await formRef.value!.validateFields({ recursive: true })
    const _validatedByNameList = await formRef.value!.validateFields([['users', 0, 'name']], { recursive: true })
    const untypedChecks: [
      Equal<typeof _fieldsValue, Record<string, any>>,
      Equal<typeof _allFieldsValue, Record<string, any>>,
      Equal<typeof _validated, Record<string, any>>,
      Equal<typeof _validatedByOptions, Record<string, any>>,
      Equal<typeof _validatedByNameList, Record<string, any>>,
    ] = [true, true, true, true, true]

    expect(untypedChecks).toEqual([true, true, true, true, true])
    expect(wrapper.exists()).toBeTruthy()
  })

  it('honors explicit model generics across Form, FormItem and useForm', async () => {
    interface ProfileForm {
      username: string
      profile: { age: number }
    }

    const formRef = ref<FormInstance<ProfileForm>>()
    const wrapper = mount(() => (
      <Form ref={formRef} model={{ username: 'A', profile: { age: 1 } }}>
        <FormItem name={['username']} label="Username">
          <input />
        </FormItem>
        <FormItem name={['profile', 'age']} label="Age">
          <input />
        </FormItem>
      </Form>
    ))

    const _fieldsValue = formRef.value!.getFieldsValue()
    const _allFieldsValue = formRef.value!.getFieldsValue(true)
    const _validated = await formRef.value!.validateFields()
    const _validatedByOptions = await formRef.value!.validateFields({ recursive: true })
    const _validatedByNameList = await formRef.value!.validateFields([['profile', 'age']], { recursive: true })
    const typedChecks: [
      Equal<typeof _fieldsValue, ProfileForm>,
      Equal<typeof _allFieldsValue, ProfileForm>,
      Equal<typeof _validated, ProfileForm>,
      Equal<typeof _validatedByOptions, ProfileForm>,
      Equal<typeof _validatedByNameList, ProfileForm>,
    ] = [true, true, true, true, true]

    formRef.value!.setFieldValue(['profile', 'age'], 2)
    formRef.value!.setFieldsValue({ username: 'B' })
    // @ts-expect-error unknown nested field path
    formRef.value!.getFieldValue(['profile', 'name'])

    const _hookForm = useForm<ProfileForm>()
    const hookCheck: Equal<typeof _hookForm, FormHookInstance<ProfileForm>> = true

    const itemProps: FormItemProps<ProfileForm> = { name: ['profile', 'age'] }
    // @ts-expect-error unknown nested field path
    const invalidItemProps: FormItemProps<ProfileForm> = { name: ['profile', 'name'] }
    const typedProps: FormProps<ProfileForm> = { model: { username: 'A', profile: { age: 1 } } }
    // @ts-expect-error model must match the generic
    const invalidProps: FormProps<ProfileForm> = { model: { username: 1, profile: { age: 1 } } }

    expect(typedChecks).toEqual([true, true, true, true, true])
    expect(hookCheck).toBe(true)
    expect(itemProps.name).toEqual(['profile', 'age'])
    expect(invalidItemProps.name).toEqual(['profile', 'name'])
    expect(typedProps.model?.username).toBe('A')
    expect(invalidProps.model).toBeDefined()
    expect(wrapper.exists()).toBeTruthy()
  })

  it('infers model generics in Form emits and keeps untyped subsets narrowed', () => {
    interface ProfileForm {
      username: string
      profile: { age: number }
    }

    const model: ProfileForm = { username: 'A', profile: { age: 1 } }
    const vnode = (
      <Form
        model={model}
        onFinish={(_values) => {
          const check: Equal<typeof _values, ProfileForm> = true
          expect(check).toBe(true)
        }}
        onValuesChange={(_changed, _values) => {
          const check: Equal<typeof _values, ProfileForm> = true
          expect(check).toBe(true)
        }}
        onFinishFailed={(_errorInfo) => {
          const check: Equal<typeof _errorInfo.values, ProfileForm> = true
          expect(check).toBe(true)
        }}
      />
    )
    const untypedVNode = (
      <Form
        model={{ username: 'A' } as any}
        onFinish={(_values) => {
          const check: Equal<typeof _values, Record<string, any>> = true
          expect(check).toBe(true)
        }}
      />
    )

    const untyped = {} as FormInstance
    const typed = {} as FormInstance<ProfileForm>
    const flag = true as true | undefined
    const _untypedSubset = () => untyped.getFieldsValue(['username'])
    const _typedSubset = () => typed.getFieldsValue([['profile', 'age']])
    const _dynamic = () => typed.getFieldsValue(flag)
    const subsetChecks: [
      Equal<ReturnType<typeof _untypedSubset>, Record<string, any>>,
      Equal<ReturnType<typeof _typedSubset>, Record<string, any>>,
      Equal<ReturnType<typeof _dynamic>, Record<string, any>>,
    ] = [true, true, true]

    expect(subsetChecks).toEqual([true, true, true])
    expect(vnode).toBeTruthy()
    expect(untypedVNode).toBeTruthy()
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
